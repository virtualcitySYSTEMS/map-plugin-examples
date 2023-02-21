import axios from 'axios';
import defaultOptions from '../config.json';
import { createReqURL } from './streetSmartApiHelpers';

/**
 * derives a wgs extent from cesium camera review and restricts it to a maximum size
 * Reduction is performed towards camera side (removing the averted side)
 * @param {Cesium.Rectangle} rect - camera view rectangle
 * @param {number} maxSize - max size of extent
 * @returns {ol.Extent}
 */
function rectToWGS84Extent(rect, maxSize = 1000) {
  const extentWGS84 = [
    Cesium.Math.toDegrees(rect.west),
    Cesium.Math.toDegrees(rect.south),
    Cesium.Math.toDegrees(rect.east),
    Cesium.Math.toDegrees(rect.north),
  ];
  const extent = ol.proj.transformExtent(
    extentWGS84,
    'EPSG:4326',
    'EPSG:3857',
  );
  const [width, height] = ol.extent.getSize(extent);
  if (width > maxSize || height > maxSize) {
    extent[0] = extent[0] + (width - maxSize) / 2;
    extent[2] = extent[2] - (width - maxSize) / 2;
    extent[3] = extent[3] - (height - maxSize);
  }
  return ol.proj.transformExtent(
    extent,
    'EPSG:3857',
    'EPSG:4326',
  );
}

/**
 * @type {vcs.vcm.Framework}
 */
const framework = vcs.vcm.Framework.getInstance();

/**
 * @type {vcs.vcm.plugins.cyclomedia.Cyclomedia|null}
 */
let instance = null;

/**
 * Cyclomedia Plugin Class
 * shows cyclomedia panorama viewer on 2/3 of the screen next to active VC Map
 * @class
 * @memberOf vcs.vcm.plugins.cyclomedia
 */
export default class Cyclomedia {
  constructor(options) {
    /** @type {string} */
    this.url = options.url ? options.url : 'https://streetsmart.cyclomedia.com/api/v21.1/StreetSmartApi.js';
    /** @type {string} */
    this.user = options.user ? options.user : '';
    /** @type {string} */
    this.password = options.password ? options.password : '';
    /** @type {string} */
    this.locale = options.locale ? options.locale : 'en-us';
    /** @type {Object} */
    this.addressSettings = options.addressSettings ? options.addressSettings : {
      locale: 'us',
      database: 'Nokia',
    };
    /** @type {string} */
    this.configurationUrl = options.configurationUrl ? options.configurationUrl : 'https://atlas.cyclomedia.com/configuration/';
    /** @type {string} */
    this.recordingsBaseUrl = options.recordingsBaseUrl ? options.recordingsBaseUrl : 'https://atlas.cyclomedia.com/recording/wfs?';
    /** @type {vcs.vcm.util.Projection.Options} */
    this.srs = options.srs ? options.srs : null;


    /** @type {string} */
    this.apiKey = options.apiKey ? options.apiKey : '';
    /** @type {number[]} */
    this.recordingsColorRGBA = options.recordingsColorRGBA ? options.recordingsColorRGBA : [0, 128, 255, 0.4];
    /** @type {string} */
    this.recordingsBalloonKey = options.recordingsBalloonKey ? options.recordingsBalloonKey : 'name';
    /** @type {vcs.vcm.layer.Vector} */
    this.vectorLayerPosition = null;
    /** @type {vcs.vcm.layer.Vector} */
    this.vectorLayerRecordings = null;
    /** @type {vcs.vcm.layer.WFS} */
    this.wfsLayer = null;
    /** @type {vcs.vcm.maps.VcsMap} */
    this.activeMap = null;
    /** @type {string} */
    this.startUpMap = options.startUpMap || 'vcs.vcm.maps.Openlayers';
    /** @type {string} */
    this.startUpLayer = options.startUpLayer ? options.startUpLayer : null;
    /** @type {int} */
    this.startUpZoomDistance = options.startUpZoomDistance ? options.startUpZoomDistance : null;
    /** @type {int} */
    this.cameraOptions3D = options.cameraOptions3D ? options.cameraOptions3D : {
      heightReference: 'cyclomedia',
      offset: 0,
    };

    let { cameraIcon } = options;
    if (!cameraIcon || cameraIcon === '') {
      cameraIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAYAAADxJz2MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMzhlODgyYy00ZGYzLTZkNGMtYWZhYy1hYTkwOTI3MjRiYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEYxRkE1MDlENjRDMTFFNTlGRjhFMzM3RTA3MDJFMDciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEYxRkE1MDhENjRDMTFFNTlGRjhFMzM3RTA3MDJFMDciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OGJiODg5ODItZGM0Zi0xNjQyLWEyZDYtODJkZTcxMGNhNjkwIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzY5MTdhNjAtZDYzYy0xMWU1LThjNTgt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';
    }

    /** @type {ol.style.Icon} */
    this.imageStyle = new ol.style.Icon({
      src: cameraIcon,
      anchor: options.anchorPosition || [0.5, 0.95],
    });

    /** @type {string|null} */
    this.subscribeKey = null;

    /** @type {PointerEvent} */
    this.pointerEvent = undefined;
    /** @type {PointerEvent} */
    this.cyclomediaPointerEvent = undefined;


    /** @type {HTMLElement} */
    this.mapElement = document.createElement('div');
    this.mapElement.setAttribute('id', 'streetsmartApiContainer');
    framework.getMapContainer().appendChild(this.mapElement);
    this.mapElement.classList.add('mapElement');
    this.mapElement.classList.add('vcm-map-top');
    this.mapElement.classList.add('cyclomediaMapElement');
    this.mapElement.classList.add('vcm-map-sub-left-23rd');
    this.hide();

    /** @type {vcs.vcm.util.ViewPoint} */
    this.viewpoint = null;
    /** @type {boolean} */
    this.panoramaViewActive = false;
    /** @type {boolean} */
    this.initialized = false;

    framework.subscribe('FEATURE_CLICKED', this.recordingFeatureClicked, this);
    framework.subscribe('MAP_ACTIVATED', this.handleMapChange, this);
  }

  /**
   * Singleton
   * @param {Object} options config
   * @returns {vcs.vcm.plugins.cyclomedia.Cyclomedia} instance of Cyclomedia
   */
  static getInstance(options) {
    if (instance) {
      return instance;
    }
    instance = new Cyclomedia(Object.assign(defaultOptions, options));
    return instance;
  }


  /**
   * initializes the cyclomedia panorama viewer
   * @returns {Promise}
   */
  init() {
    this.pointerEvent = window.PointerEvent;

    if (this.srs) {
      this.proj = new vcs.vcm.util.Projection(this.srs);
    } else {
      this.proj = framework.projection;
    }

    return framework.loadLibraries([
      'https://unpkg.com/react@16.12.0/umd/react.production.min.js',
      'https://unpkg.com/react-dom@16.12.0/umd/react-dom.production.min.js',
      // OpenLayers is loaded by vcs.vcm.framework
      // 'https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.3.3/ol.js',
      this.url,
    ], true)
      .then(() => {
        return window.StreetSmartApi.init({
          targetElement: document.getElementById('streetsmartApiContainer'),
          username: this.user,
          password: this.password,
          apiKey: this.apiKey,
          srs: this.proj.epsg,
          locale: this.locale,
          addressSettings: this.addressSettings,
          configurationUrl: this.configurationUrl,
        });
      });
  }

  initialize() {
    this.activeMap = framework.getActiveMap();
    
    /* intialize vector layer for cyclomedia position */
    this.vectorLayerPosition = new vcs.vcm.layer.Vector({
      name: '_cyclomediaPositionVectorLayer',
      altitudeMode: 'clampToGround',
      projection: { epsg: 4326, proj4: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs' },
    });
    framework.addLayer(this.vectorLayerPosition);
    
    /* intialize vector layer for cyclomedia recordings */
    this.vectorLayerRecordings = new vcs.vcm.layer.Vector({
      minResolution: 0,
      maxResolution: 2,
      name: '_cyclomediaRecordingVectorLayer',
      style: {
        image: {
          radius: 5,
          fill: { color: this.recordingsColorRGBA },
          stroke: { color: this.recordingsColorRGBA, width: 1, opacity: 0.7 },
        },
      },
      projection: vcs.vcm.util.mercatorProjection,
    });
    framework.addLayer(this.vectorLayerRecordings);
    const wfsParams = {
      apiKey: this.apiKey,
      nameVersion: `${window.StreetSmartApi.getApplicationName()}_${window.StreetSmartApi.getApplicationVersion()}`,
    };
    
    /* intialize wfs layer for cyclomedia wfs request */
    this.wfsLayer = new vcs.vcm.layer.WFS({
      name: '_cyclomediaRecordingWfsLayer',
      url: createReqURL(this.recordingsBaseUrl, wfsParams),
      featureType: 'Recording',
      featureNS: 'http://www.cyclomedia.com/atlas',
      featurePrefix: 'atlas',
      projection: vcs.vcm.util.mercatorProjection,
    });
    framework.addLayer(this.wfsLayer);
    this.initialized = true;
  }

  /**
   * opens cyclomedia panorama viewer at given coordinate
   * @param {ol.Coordinate} coordinates
   * @returns {Promise}
   */
  openViewer(coordinates) {
    this.activeMap = framework.getActiveMap();
    this.addMapMoveListener(this.activeMap);
    document.getElementById('streetSmartApi').style.width = '0%';

    if (this.cyclomediaPointerEvent) {
      window.PointerEvent = this.cyclomediaPointerEvent;
    } else {
      this.cyclomediaPointerEvent = window.PointerEvent;
    }

    return new Promise((resolve, reject) => {
      const viewerType = window.StreetSmartApi.ViewerType.PANORAMA;
      const coordsString = coordinates.join(',');
      window.StreetSmartApi.open(coordsString, {
        viewerType,
        srs: this.proj.epsg,
        panoramaViewer: {
          closable: false,
        },
      })
        .then((result) => {
          if (result) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].getType() === window.StreetSmartApi.ViewerType.PANORAMA) window.panoramaViewer = result[i];
            }
          }
          const panoramaViewerCloseBtn = document.getElementsByClassName('btn-close btn btn-default');
          if (panoramaViewerCloseBtn.length > 0) {
            panoramaViewerCloseBtn[0].addEventListener('click', this.deactivate.bind(this));
          }
          document.getElementsByClassName('company-box vcm-font-default').item(0).style.display = 'none';
          document.getElementById('streetSmartApi').style.width = '100%';
          window.panoramaViewer.toggleRecordingsVisible(true);
          window.panoramaViewer.on(
            window.StreetSmartApi.Events.panoramaViewer.VIEW_LOAD_END,
            this.synchronizeView.bind(this),
          );
          window.panoramaViewer.on(
            window.StreetSmartApi.Events.panoramaViewer.IMAGE_CHANGE,
            this.synchronizeView.bind(this),
          );
          this.panoramaViewActive = true;
          resolve(result);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  /**
   * closes cyclomedia panorama viewer
   */
  closeViewer() {
    if (window.panoramaViewer && this.panoramaViewActive) {
      window.StreetSmartApi.stopMeasurementMode();
      window.StreetSmartApi.closeViewer(window.panoramaViewer.props.id)
        .then((res) => {
          if (res) {
            console.log(`Closed component through StreetSmartApi: ${res}`);
          }
        })
        .catch((err) => {
          console.log(`Failed closing component through StreetSmartApi: ${err}`);
        });
    }
    document.getElementsByClassName('company-box vcm-font-default').item(0).style.display = 'block';
    this.panoramaViewActive = false;
    window.PointerEvent = this.pointerEvent;
  }

  /**
   * synchronizes map with cyclomedia view
   */
  async synchronizeView() {
    const rl = window.panoramaViewer.getRecording();

    if (rl != null) {
      const viewerData = {};
      const orientation = window.panoramaViewer.getOrientation();
      viewerData.yaw = Cesium.Math.toRadians(orientation.yaw);
      viewerData.pitch = Cesium.Math.toRadians(orientation.pitch);
      viewerData.hFov = Cesium.Math.toRadians(orientation.hFov);
      viewerData.lonLat = this.proj.transformTo(
        vcs.vcm.util.wgs84Projection,
        rl.xyz,
      );
      viewerData.srs = rl.srs;
      viewerData.scale = 50;

      this.updateVectorLayer(viewerData);

      /* synchronize map view with panorama viewer */
      if (this.activeMap instanceof vcs.vcm.maps.Cesium) {
        const { camera } = this.activeMap.getScene();
        const hpr = new Cesium.HeadingPitchRange(viewerData.yaw, viewerData.pitch, 5.0);
        const cartPos = Cesium.Cartesian3.fromDegrees(viewerData.lonLat[0], viewerData.lonLat[1]);
        camera.lookAt(cartPos, hpr);
        camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      }
      this.viewpoint = await this.activeMap.getViewPoint();
      this.viewpoint.groundPosition = [viewerData.lonLat[0], viewerData.lonLat[1]];
      let height = 1.5;
      if (this.cameraOptions3D.heightReference === 'cyclomedia') {
        height = viewerData.lonLat[2] + this.cameraOptions3D.offset;
      } else {
        height = this.cameraOptions3D.offset;
      }
      this.viewpoint.cameraPosition = [viewerData.lonLat[0], viewerData.lonLat[1], height];
      if (this.startUpZoomDistance) {
        this.viewpoint.distance = this.startUpZoomDistance;
      }
      this.activeMap.gotoViewPoint(this.viewpoint);
    }
  }

  /**
   * updates position in VC Map
   * @param {Object} viewerData
   */
  updateVectorLayer(viewerData) {
    this.vectorLayerPosition.removeFeaturesById(['currentViewLocator']);
    const viewerColor = window.panoramaViewer.getViewerColor();
    const colorStyle = [
      new ol.style.Style({
        image: this.imageStyle,
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({ color: viewerColor, opacity: 0.7 }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 1, opacity: 0.7 }),
        }),
      }),
    ];

    const pointGeom = new ol.geom.Point([viewerData.lonLat[0], viewerData.lonLat[1]]);
    const circleFeature = new ol.Feature(pointGeom);
    circleFeature.setId('currentViewLocator');
    circleFeature.setStyle(colorStyle);
    circleFeature.set('viewerData', viewerData);
    this.imageStyle.setRotation(viewerData.yaw);
    this.vectorLayerPosition.addFeatures([circleFeature]);
  }

  /**
   * gets all recordings within extent
   * @param {ol.Extent} extent
   */
  getRecordings(extent) {
    if (this.wfsLayer) {
      this.wfsLayer.getFeaturesOptions = {
        filter: ol.format.filter.and(
          ol.format.filter.bbox('recordings', extent, 'EPSG:4326'),
          ol.format.filter.isNull('expiredAt'),
        ),
        resultType: 'results',
      };
      this.fetchData().then(() => {
        const features = this.vectorLayerRecordings.getFeatures();
        const removeF = features.filter(f => !ol.extent.containsCoordinate(
          extent,
          vcs.vcm.util.Projection.mercatorToWgs84(f.getGeometry().getCoordinates()),
        ));
        const removeIds = removeF.map(f => f.getId());
        this.vectorLayerRecordings.removeFeaturesById(removeIds);
      });
    }
  }

  /**
   * fetches recordings data from cylomedia via web feature service
   * @returns {Promise}
   */
  fetchData() {
    if (this.runningRequest) {
      this.runningRequest.cancel();
      this.runningRequest = null;
    }
    if (this.wfsLayer.url) {
      this.runningRequest = axios.CancelToken.source();
      let postData = this.wfsLayer.wfsFormat.writeGetFeature(/** @type {olx.format.WFSWriteGetFeatureOptions} */ ({
        featureNS: this.wfsLayer.featureNS,
        featurePrefix: this.wfsLayer.featurePrefix,
        featureTypes: this.wfsLayer.featureType,
        srsName: this.wfsLayer.projection.epsg,
        ...this.wfsLayer.getFeaturesOptions,
      }));
      postData = new XMLSerializer().serializeToString(postData);
      return axios.post(this.wfsLayer.url, postData, {
        headers: {
          'Content-Type': 'text/xml',
        },
        cancelToken: this.runningRequest.token,
        withCredentials: true,
        auth: {
          username: this.user,
          password: this.password,
        },
      })
        .then((response) => {
          const reader = new ol.format.GeoJSON();
          const features = reader.readFeatures(response.data);
          const key = this.recordingsBalloonKey;
          if (features) {
            features.forEach(f => f.setProperties({ [key]: `ImageId: ${f.get('imageId')}` }));
            this.vectorLayerRecordings.addFeatures(features);
          }
          this.runningRequest = null;
        })
        .catch((err) => {
          console.log(`Could not send request for loading layer content (${err.message})`);
          this.wfsLayer.islayerloading = false;
        });
    }
    return Promise.reject();
  }

  /**
   * handles click on recording feature and synchronizes cyclomedia view with map
   * @param {string} id
   * @param {Object} feature
   * @param {vcs.vcm.layer.Layer} layer
   */
  recordingFeatureClicked(id, feature, layer) {
    if (layer instanceof vcs.vcm.layer.Vector && layer.name === this.vectorLayerRecordings.name) {
      window.panoramaViewer.openByImageId(feature.getProperties().imageId);
    }
  }

  /**
   * activates the cyclomedia panorama viewer as map window, if necessary initializes the viewer.
   * @param {vcs.vcm.util.ViewPoint=} viewPoint the optional starting Viewpoint of the map after activation.
   * @returns {Promise}
   */
  activate(viewPoint) {
    this.show();
    if (!this.initialized) {
      return this.init()
        .then(() => this.initialize())
        .then(() => this.activate(viewPoint));
    }

    if (framework.getActiveMap().name !== this.startUpMap) {
      const map = framework.getMapByName(this.startUpMap);
      if (map) {
        framework.activateMap(map.name);
      } else {
        console.error(`Could not activate map. Map of name ${this.startUpMap} is not configured. Check config.json!`)
      }
    }

    if (this.startUpLayer) {
      const layer = framework.getLayerByName(this.startUpLayer);
      if (layer && !layer.active) {
        layer.activate();
      }
    }

    this.viewpoint = viewPoint;
    const position = this.proj.transformFrom(
      vcs.vcm.util.wgs84Projection,
      viewPoint.groundPosition || viewPoint.cameraPosition,
    );
    if (position) {
      return this.openViewer(position);
    }

    return Promise.reject();
  }

  /**
   * deactivates the map
   * returns the current viewpoint of the map to enable a change between different maps.
   * @returns {Promise} current viewpoint of the map
   */
  deactivate() {
    this.closeViewer();
    this.hide();
    this.subscribeKey = null;
    return Promise.resolve(this.viewpoint);
  }

  /**
   * sets the visibility of the maps dom element to true
   */
  show() {
    const vcMapElements = document.getElementsByClassName('mapElement');
    for (let i = 0; i < vcMapElements.length; i++) {
      if (!(vcMapElements[i].classList.contains('vcm-map-sub-left-23rd'))) {
        vcMapElements[i].classList.add('cyclomediaMapElement');
        vcMapElements[i].classList.add('vcm-map-sub-right-3rd');
      }
    }
    if (this.mapElement !== null) {
      this.mapElement.style.display = '';
    }
    if (this.vectorLayerPosition) {
      this.vectorLayerPosition.activate();
    }
    if (this.vectorLayerRecordings) {
      this.vectorLayerRecordings.activate();
    }
    if (this.activeMap instanceof vcs.vcm.maps.Openlayers || this.activeMap instanceof vcs.vcm.maps.Oblique) {
      this.activeMap.olMap.updateSize();
    }
  }

  /**
   * sets the visibility of the maps dom element to false
   */
  hide() {
    const vcMapElements = document.getElementsByClassName('mapElement vcm-map-top');
    for (let i = 0; i < vcMapElements.length; i++) {
      if (vcMapElements[i].classList.contains('vcm-map-sub-right-3rd')) {
        vcMapElements[i].classList.remove('cyclomediaMapElement');
        vcMapElements[i].classList.remove('vcm-map-sub-right-3rd');
      }
    }
    if (this.mapElement !== null) {
      this.mapElement.style.display = 'none';
    }
    if (this.vectorLayerPosition) {
      this.vectorLayerPosition.deactivate();
    }
    if (this.vectorLayerRecordings) {
      this.vectorLayerRecordings.deactivate();
    }
    if (this.activeMap instanceof vcs.vcm.maps.Openlayers || this.activeMap instanceof vcs.vcm.maps.Oblique) {
      this.activeMap.olMap.updateSize();
    }
  }

  /**
   * @param {vcs.vcm.maps.VcsMap} map
   */
  handleMapChange(map) {
    this.activeMap = map;
    this.addMapMoveListener(map);
  }

  /**
   * sets map move event listener to supplied map
   * @param {vcs.vcm.maps.VcsMap} map
   */
  addMapMoveListener(map) {
    if (map instanceof vcs.vcm.maps.Openlayers) {
      const { olMap } = map;
      this.subscribeKey = olMap.on('moveend', () => {
        const view = olMap.getView();
        if (this.panoramaViewActive && view.getZoom() > 16) {
          const extentWGS84 = ol.proj.transformExtent(
            view.calculateExtent(olMap.getSize()),
            'EPSG:3857',
            'EPSG:4326',
          );
          this.getRecordings(extentWGS84);
        }
      });
    } else if (map instanceof vcs.vcm.maps.Cesium) {
      const scene = map.getScene();
      this.subscribeKey = scene.camera.moveEnd.addEventListener(() => {
        if (this.panoramaViewActive) {
          const rect = scene.camera.computeViewRectangle();
          const extentWGS84 = rectToWGS84Extent(rect);
          this.getRecordings(extentWGS84);
        }
      });
    } else {
      this.subscribeKey = null;
    }
  }
}
