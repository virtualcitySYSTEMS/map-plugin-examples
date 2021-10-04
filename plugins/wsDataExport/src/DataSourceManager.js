import axios from 'axios';

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.DataSources
 * @property {Array<vcs.vcm.plugins.wsDataExport.WfsDataSource>} wfs
 * @property {Array<vcs.vcm.plugins.wsDataExport.WcsDataSource>} wcs
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.WfsDataSource.Options
 * @property {string} service
 * @property {string} baseUrl
 * @property {string} user
 * @property {string} pw
 * @property {string} format
 * @property {Array.<vcs.vcm.plugins.wsDataExport.DataSourceType>} coverages
 * @property {string} EPSGCode
 * @property {string} proj4
 * @property {number} maxPixel
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.WcsDataSource.Options
 * @property {string} service
 * @property {string} baseUrl
 * @property {string} user
 * @property {string} pw
 * @property {Array.<vcs.vcm.plugins.wsDataExport.DataSourceType>} typeNames
 * @property {string[]} outputFormats
 * @property {string} EPSGCode
 * @property {string} proj4
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.DataSourceType
 * @property {string} name
 * @property {string} label
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.WfsDataSource
 * @property {string} service
 * @property {string} baseUrl
 * @property {string} user
 * @property {string} pw
 * @property {string} format
 * @property {string} name
 * @property {string} label
 * @property {string} EPSGCode
 * @property {string} proj4
 * @property {number} maxPixel
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.WcsDataSource
 * @property {string} service
 * @property {string} baseUrl
 * @property {string} user
 * @property {string} pw
 * @property {string} name
 * @property {string} label
 * @property {string[]} outputFormats
 * @property {string} EPSGCode
 * @property {string} proj4
 */

/**
 * @typedef {Object} vcs.vcm.plugins.wsDataExport.ExportSettings
 * @property {width: number, height: number} [imageSize]
 * @property {string} [outputFormat]
 * @property {string} responseCRS
 */

/**
 * @type {vcs.vcm.plugins.wsDataExport.DataSourceManager}
 */
let instance = null;

/**
 * @class
 * @memberOf vcs.vcm.plugins.wsDataExport
 */
export default class DataSourceManager {
  constructor(options) {
    /** @type {string} */
    this.singleFeatureId = Cesium.createGuid();

    /** @type {vcs.vcm.layer.Vector} */
    this.geometryLayer = new vcs.vcm.layer.Vector({
      projection: vcs.vcm.util.mercatorProjection,
      name: '_wsDataExportLayer',
    });
    vcs.vcm.Framework.getInstance().addLayer(this.geometryLayer);

    /** @type {vcs.vcm.util.editor.GeometryLayerEditor|null} */
    this.layerEditor = new vcs.vcm.util.editor.GeometryLayerEditor({
      allowedGeometries: ['BBox'],
      defaultMode: 'edit',
    });
    this.layerEditor.initialize();
    this.layerEditor.addEditingLayer(this.geometryLayer);
  
    /**
     * @type {vcs.vcm.plugins.wsDataExport.DataSources}
     */
    this.dataSources = {
      wcs: DataSourceManager.loadWcsDataSources(options),
      wfs: DataSourceManager.loadWfsDataSources(options),
    };
  }

  /**
   * Singleton
   * @param {Object} options config
   * @returns {vcs.vcm.plugins.wsDataExport.DataSourceManager} instance of ExportStep
   */
  static getInstance(options = {}) {
    if (instance) {
      return instance;
    }
    instance = new DataSourceManager(options);
    return instance;
  }
  
  /**
   * @param {vcs.vcm.plugins.wsDataExport.WcsDataSource} dataSource
   * @param {ol.Extent} bbox
   * @param {vcs.vcm.plugins.wsDataExport.ExportSettings} exportSettings
   * @returns {Promise<AxiosResponse<any>>}
   */
  static doWcsRequest(dataSource, bbox, exportSettings) {
    const params = {
      VERSION: '1.0.0',
      REQUEST: 'GetCoverage',
      SERVICE: 'WCS',
      FORMAT: dataSource.format,
      COVERAGE: dataSource.name,
      BBOX: bbox.toString(),
      CRS: `EPSG:${dataSource.EPSGCode}`,
      RESPONSE_CRS: exportSettings.responseCRS,
      WIDTH: exportSettings.imageSize.width,
      HEIGHT: exportSettings.imageSize.height,
    };

    const requestURL = `${dataSource.baseUrl}ows?`;
    return axios.get(requestURL.split('?')[0], {
      params,
      withCredentials: true,
      responseType: 'blob',
      auth: {
        username: dataSource.user,
        password: dataSource.pw,
      },
    });
  }
  
  /**
   * @param {vcs.vcm.plugins.wsDataExport.WfsDataSource} dataSource
   * @param {ol.Extent} bbox
   * @param {vcs.vcm.plugins.wsDataExport.ExportSettings} exportSettings
   * @returns {Promise<AxiosResponse<any>>}
   */
  static doWfsRequest(dataSource, bbox, exportSettings) {
    const params = {
      VERSION: '1.1.0',
      REQUEST: 'GetFeature',
      TYPENAME: dataSource.name,
      BBOX: `${bbox.toString()},EPSG:${dataSource.EPSGCode}`,
      SRSNAME: exportSettings.responseCRS,
      OUTPUTFORMAT: exportSettings.outputFormat,
    };

    const requestURL = `${dataSource.baseUrl}wfs?`;
    return axios.get(requestURL.split('?')[0], {
      params,
      withCredentials: true,
      responseType: 'blob',
      auth: {
        username: dataSource.user,
        password: dataSource.pw,
      },
    });
  }
  
  /**
   * @param {vcs.vcm.plugins.wsDataExport.WcsDataSource.Options} options
   * @returns {*[]}
   */
  static loadWcsDataSources(options) {
    const wcsDataSources = [];
    options.wcs.forEach((service) => {
      service.coverages.forEach((coverage) => {
        wcsDataSources.push({
          service,
          baseUrl: service.baseUrl,
          user: service.user,
          pw: service.pw,
          format: service.format,
          name: coverage.name,
          label: coverage.label,
          EPSGCode: service.EPSGCode,
          proj4: service.proj4,
          maxPixel: service.maxPixel,
        });
      });
    });
    return wcsDataSources;
  }
  
  /**
   * @param {vcs.vcm.plugins.wsDataExport.WfsDataSource.Options} options
   * @returns {*[]}
   */
  static loadWfsDataSources(options) {
    const wfsDataSources = [];
    options.wfs.forEach((service) => {
      service.typeNames.forEach((typeNames) => {
        wfsDataSources.push({
          service,
          baseUrl: service.baseUrl,
          user: service.user,
          pw: service.pw,
          name: typeNames.name,
          label: typeNames.label,
          outputFormats: service.outputFormats,
          EPSGCode: service.EPSGCode,
          proj4: service.proj4,
        });
      });
    });
    return wfsDataSources;
  }
  
  /**
   * @param {string} responseDataType
   * @returns {string}
   */
  static getExtension(responseDataType) {
    if (responseDataType.indexOf('tif') > 0) {
      return '.tif';
    } else if (responseDataType.indexOf('gml') > 0) {
      return '.gml';
    } else if (responseDataType.indexOf('kml') > 0) {
      return '.kml';
    } else if (responseDataType.indexOf('zip') > 0) {
      return '.zip';
    } else if (responseDataType.indexOf('csv') > 0) {
      return '.csv';
    } else if (responseDataType.indexOf('json') > 0) {
      return '.json';
    }
    return '.xml';
  }
}
