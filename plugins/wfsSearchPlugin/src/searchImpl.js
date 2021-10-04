import axios from 'axios';
import UnderscoreTemplate from 'underscore.template';
import defaultOptions from '../config.json';

/** Class which implements Search API */
export default class SearchImpl {
  /**
   * Initialize array for search results, adds resultLayer to framework,
   * adds balloonInfo to resultLayer, adds property-values from options object or from default values.
   * @param {!Object} options - All properties are optional, uses default values if not specified
   * @param {Object=} options.resultLayerOptions - Options for vcs.vcm.layer.Vector object used for displaying balloon-info
   * @param {(Array<string>|string)=} options.balloonInfo - Structure of balloon-info. Underscore-Template syntax allowed
   * @param {(Array<string>|string)=} options.resultHeadline - Headline of the search result. Underscore-Template syntax allowed
   * @param {(Array<string>|string)=} options.resultDescription - Description of the search result. Underscore-Template syntax allowed
   * @param {string=} options.serviceAddress - URL of the search service
   * @param {(Array<string>|string)=} options.filterExpression - Use OGC Filter Encoding for constraints on the geometric and scalar properties of a feature type
   * @param {Array<string>=} options.queryAdditions - strings to be added to the query, such as city or state.
   */
  constructor(options) {
    this._currentResults = [];

    function createTemplate(template) {
      const string = Array.isArray(template) ? template.join('') : template;
      return UnderscoreTemplate(string);
    }

    const config = Object.assign(defaultOptions, options);
    const resultLayer = new vcs.vcm.layer.Vector(config.layerOptions);
    /** @type {string} */
    this.resultLayerName = resultLayer.name;
    /** @type {string|Array<string>} */
    this.balloonInfo = config.balloonInfo;
    /** @type {Function} */
    this.title = createTemplate(config.title);
    /** @type {Function} */
    this.description = createTemplate(config.description);
    /** @type {string} */
    this.url = config.url.replace(/\/$/, '');
    /** @type {Function} */
    this.filterExpression = createTemplate(config.filterExpression);
    /** @type {olx.format.WFSWriteGetFeatureOptions} */
    this.getFeatureOptions = config.getFeatureOptions;
    /** @type {boolean} */
    this.isStoredQuery = config.isStoredQuery;
    /** @type {number} */
    this.minToken = config.minToken;
    /** @type {string} */
    this.regEx = config.regEx;
    /** @type {string} */
    this.projection = config.projection || 'EPSG:4326';
    /** @type {ol.StyleFunction} */
    this.iconStyle = null;

    if (config.iconStyle) {
      if ((config.iconStyle.type === 'declarative' || config.iconStyle.declarativeStyle) && config.iconStyle.declarativeStyle.image) {
        this.iconStyle = new vcs.vcm.util.style.DeclarativeStyleItem(config.iconStyle).style;
      } else if (config.iconStyle.image && config.iconStyle.image.src) {
        this.iconStyle = new vcs.vcm.util.style.DeclarativeStyleItem({
          declarativeStyle: {
            image: config.iconStyle.image.src,
          },
        }).style;
      }
    }


    const framework = vcs.vcm.Framework.getInstance();
    framework.addLayer(resultLayer);
    const balloonInfo = framework.getWidgetByType('vcs.vcm.widgets.BalloonInfo');
    if (balloonInfo && !balloonInfo.hasTypeForLayerName(this.resultLayerName)) {
      balloonInfo.addTypeForLayer(this.resultLayerName, this.balloonInfo, 'balloonHeight + 30', '70');
    }
  }

  /**
   * Sending search request and store data response.
   * @param {string} query - axios will handle url encoding automatically
   * @returns {Promise}
   */
  search(query) {
    this.clear();
    this.runningRequest = axios.CancelToken.source();
    const wfsFormat = new ol.format.WFS();
    const xml = this.generateGetFeatureXMLString(query, wfsFormat);
    if (!xml) {
      return Promise.resolve();
    }

    return axios.post(this.url, xml, {
      headers: { 'Content-Type': 'application/xml' },
      cancelToken: this.runningRequest.token,
    })
      .then((response) => {
        const features = wfsFormat.readFeatures(response.data, { featureProjection: 'EPSG:4326', dataProjection: this.projection });
        this._currentResults.push(...features.map((feature) => {
          const featureProperties = feature.getProperties();
          const option = {
            result: featureProperties,
            layerName: this.resultLayerName,
            title: this.title(featureProperties),
            description: this.description(featureProperties),
            geometry: (new ol.format.GeoJSON()).writeFeatureObject(feature).geometry,
          };

          if (this.iconStyle) {
            const style = this.iconStyle(feature).getImage();
            console.log(style);
            console.log(style.getSrc());
            option.icon = style.getSrc();
          }

          return new vcs.vcm.widgets.search.FeatureItem(option);
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  /**
   * @param {string} query
   * @param {ol.format.WFS} wfsFormat
   * @returns {string|null}
   */
  generateGetFeatureXMLString(query, wfsFormat) {
    const token = query.match(new RegExp(this.regEx));
    if (!token || token.length < this.minToken + 1) {
      return null;
    }
    const xmlParser = new DOMParser();
    const filterXMLString = this.filterExpression({ token });
    const featureRequestXMLNode = wfsFormat.writeGetFeature(this.getFeatureOptions);
    const filterXMLDoc = xmlParser.parseFromString(filterXMLString, 'text/xml');
    const queryParent = featureRequestXMLNode.getElementsByTagName('Query')[0];
    if (this.isStoredQuery) {
      const storedQueryElement = filterXMLDoc.documentElement;
      for (let index = 0; index < queryParent.attributes.length; index++) {
        storedQueryElement.attributes.setNamedItem(queryParent.attributes[index].cloneNode());
      }

      queryParent.parentNode.replaceChild(storedQueryElement, queryParent);
    } else {
      queryParent.appendChild(filterXMLDoc.documentElement);
    }
    return new XMLSerializer().serializeToString(featureRequestXMLNode);
  }

  /** Empties result array and hides resultLayer */
  clear() {
    this._currentResults.splice(0);
    const resultLayer = vcs.vcm.Framework.getInstance().getLayerByName(this.resultLayerName);
    resultLayer.deactivate();
    if (this.runningRequest) {
      this.runningRequest.cancel();
      this.runningRequest = null;
    }
  }

  /** Returns current search results */
  get currentResults() {
    return this._currentResults;
  }
}

