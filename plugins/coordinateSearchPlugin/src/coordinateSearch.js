import UnderscoreTemplate from 'underscore.template';
import defaultOptions from '../config.json';
import searchedCoordinateIcon from './searchedCoordinateIcon';

function createTemplate(template) {
  const string = Array.isArray(template) ? template.join('') : template;
  return UnderscoreTemplate(string);
}

/**
 * Class which implements Search API
 * @class
 * @memberOf vcs.vcm.plugins.coordinateSearchPlugin
 */
class CoordinateSearch {
  constructor(options) {
    /** @type {Array.<vcs.vcm.widgets.search.FeatureItem>} */
    this._currentResults = [];
    /** @type {Array.<vcs.vcm.util.Projection>} */
    this.searchProjections = [];
    if (options.searchProjections) {
      this.searchProjections = options.searchProjections.map(proj => new vcs.vcm.util.Projection(proj));
    }

    const config = Object.assign(defaultOptions, options);
    /* default style */
    if (!config.layerOptions.style) {
      config.layerOptions.style = {
        image: {
          src: searchedCoordinateIcon,
          scale: 0.5,
        },
      };
      config.layerOptions.highlightStyle = {
        image: {
          src: searchedCoordinateIcon,
        },
      };
    }
    /** @type {vcs.vcm.layer.Vector} */
    this.resultLayer = new vcs.vcm.layer.Vector(Object.assign(config.layerOptions, {
      projection: vcs.vcm.util.wgs84Projection,
    }));
    /** @type {string} */
    this.title = createTemplate(config.title);
    /** @type {string} */
    this.description = createTemplate(vcs.vcm.i18n.getMessage('i18n_coordinateSearch_description'));

    const framework = vcs.vcm.Framework.getInstance();
    framework.addLayer(this.resultLayer);
    const balloonInfo = framework.getWidgetByType('vcs.vcm.widgets.BalloonInfo');
    if (balloonInfo && !balloonInfo.hasTypeForLayerName(this.resultLayer.name)) {
      balloonInfo.addTypeForLayer(this.resultLayer.name, config.balloonInfo, 'balloonHeight + 30', '70');
    }
  }

  /**
   * @type {Array.<vcs.vcm.widgets.search.FeatureItem>}
   * @readonly
   */
  get currentResults() {
    return this._currentResults;
  }

  /**
   * Sending search request and store data response.
   * @param {string} query - coordinate string
   */
  search(query) {
    const cArray = query.match(/\d*[,.]?\d*/g);
    const coords = cArray
      .map(number => parseFloat(number))
      .filter(Number.isFinite)
      .slice(0, 2);

    if (coords.length === 2) {
      const { projection } = vcs.vcm.Framework.getInstance();
      if (ol.extent.containsCoordinate(vcs.vcm.util.wgs84Projection.proj.getExtent(), coords)) {
        this._handleSearch(/** @type {ol/coordinate} */ coords);
      } else {
        const pointWGS84 = projection.transformTo(vcs.vcm.util.wgs84Projection, coords);
        this._handleSearch(pointWGS84, /** @type {ol/coordinate} */ coords, projection.epsg);
        if (this.searchProjections) {
          this.searchProjections.forEach((proj) => {
            const point = proj.transformTo(vcs.vcm.util.wgs84Projection, coords);
            this._handleSearch(point, /** @type {ol/coordinate} */ coords, proj.epsg);
          });
        }
      }
    }
  }

  /**
   * if only pointWGS84 is provided, pointProjected is derived using map projection
   * @param {ol/Coordinate} pointWGS84
   * @param {ol/Coordinate} [pointProjected]
   * @param {string} [epsg]
   * @private
   */
  _handleSearch(pointWGS84, pointProjected, epsg) {
    const { projection } = vcs.vcm.Framework.getInstance();
    const featureProperties = {
      name: vcs.vcm.i18n.getMessage('i18n_coordinateSearch_title'),
      pointWGS84: ol.coordinate.toStringHDMS(pointWGS84),
      pointProjected: pointProjected || projection.transformFrom(vcs.vcm.util.wgs84Projection, pointWGS84).join(', '),
      epsg: epsg || projection.epsg,
    };
    const option = {
      pointWGS84,
      result: featureProperties,
      layerName: this.resultLayer.name,
      title: `${this.title(featureProperties)} ${epsg || 'WGS84 (lat/lon)'}`,
      description: `${this.description(featureProperties)} ${pointProjected ? pointProjected.join(', ') : ol.coordinate.toStringHDMS(pointWGS84)}`,
      icon: searchedCoordinateIcon,
    };

    this._currentResults.push(new vcs.vcm.widgets.search.FeatureItem(option));
  }

  /** Empties result array and hides resultLayer */
  clear() {
    this._currentResults.splice(0);
    this.resultLayer.deactivate();
  }
}

export default CoordinateSearch;
