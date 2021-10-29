import axios from 'axios';
import UnderscoreTemplate from 'underscore.template';
import defaultOptions from '../config.json';

function createTemplate(template) {
  const string = Array.isArray(template) ? template.join('') : template;
  return UnderscoreTemplate(string);
}

/**
 * Class which implements Search API:
 * Initialize array for search results, adds resultLayer to framework,
 * adds balloonInfo to resultLayer, adds property-values from options object or from default values.
 * @class
 * @param {!Object} options - All properties are optional, uses default values if not specified
 * @param {Object=} options.layerOptions - Options for vcs.vcm.layer.Vector object used for displaying balloon-info
 * @param {(Array<string>|string)=} options.balloonInfo - Structure of balloon-info. Underscore-Template syntax allowed
 * @param {(Array<string>|string)=} options.title - Headline of the search result. Underscore-Template syntax allowed
 * @param {(Array<string>|string)=} options.description - Description of the search result. Underscore-Template syntax allowed
 * @param {string=} options.url - URL of the search service
 * @param {Object=} options.defaultQueryParams - default Geolocator params to be added to every query
 * @param {Object=} options.defaultAutocompleteParams - default suggest params to be added to every suggest
 * @param {number=} options.zoomDistance - the distance to use, when flying to the result
 */
export default class SearchImpl {
  constructor(options) {
    const config = Object.assign(defaultOptions, options);
    const resultLayer = new vcs.vcm.layer.Vector(config.layerOptions);
    
    /** @type {string} */
    this.resultLayerName = resultLayer.name;
    /** @type {string|Array<string>} */
    this.balloonInfo = config.balloonInfo;
    /** @type {string|Array<string>} */
    this.title = createTemplate(config.title);
    /** @type {string|Array<string>} */
    this.description = createTemplate(config.description);
    /** @type {string} */
    this.url = config.url.replace(/\/$/, '');
    /** @type {Object} */
    this.defaultQueryParams = config.defaultQueryParams;
    /** @type {Object} */
    this.defaultAutocompleteParams = config.defaultAutocompleteParams;
    /** @type {number} */
    this.zoomDistance = config.zoomDistance;
    /**
     * @type {Array<vcs.vcm.widgets.search.FeatureItem>}
     * @private
     */
    this._currentResults = [];

    const framework = vcs.vcm.Framework.getInstance();
    framework.addLayer(resultLayer);
    const balloonInfo = framework.getWidgetByType('vcs.vcm.widgets.BalloonInfo');
    if (balloonInfo && !balloonInfo.hasTypeForLayerName(this.resultLayerName)) {
      balloonInfo.addTypeForLayer(this.resultLayerName, this.balloonInfo, 'balloonHeight + 30', '70');
    }
  }

  /**
   * Sending search request and store data response.
   * @param {string} query - the trimmed user string input
   * @returns {Promise}
   */
  search(query) {
    this.clear();
    this.runningRequest = axios.CancelToken.source();
    const params = Object.assign(
      {
        SingleLineCityName: query,
        f: 'json',
      },
      this.defaultQueryParams,
    );
    return axios.get(`${this.url}/findAddressCandidates`, { params, cancelToken: this.runningRequest.token })
      .then((response) => {
        this.runningRequest = null;
        if (response.data.candidates) {
          this._currentResults.push(...response.data.candidates
            .map((candidate) => {
              return new vcs.vcm.widgets.search.FeatureItem({
                pointWGS84: [Number(candidate.location.x), Number(candidate.location.y)],
                result: candidate,
                layerName: this.resultLayerName,
                title: this.title(candidate),
                description: this.description(candidate),
                zoomDistance: this.zoomDistance,
              });
            }),
          );
        }
      })
      .catch((error) => {
        if (error.message) {
          console.error(error.message);
        }
      });
  }
  
  /**
   * @param {string} query
   * @returns {Promise<AxiosResponse<any> | *[]>}
   */
  autocomplete(query) {
    this.clear();
    this.runningRequest = axios.CancelToken.source();
    const params = Object.assign(
      {
        text: query,
        f: 'json',
      },
      this.defaultAutocompleteParams,
    );
    return axios.get(`${this.url}/suggest`, { params, cancelToken: this.runningRequest.token })
      .then((response) => {
        this.runningRequest = null;
        if (response.data.suggestions) {
          return response.data.suggestions.map(suggestion => suggestion.text);
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  /** Empties result array, hides resultLayer and cancels running request */
  clear() {
    this._currentResults.splice(0);
    const resultLayer = vcs.vcm.Framework.getInstance().getLayerByName(this.resultLayerName);
    resultLayer.activate(false);
    if (this.runningRequest) {
      this.runningRequest.cancel();
      this.runningRequest = null;
    }
  }
  
  /**
   * Returns current search results
   * @returns {Array<vcs.vcm.widgets.search.FeatureItem>}
   */
  get currentResults() {
    return this._currentResults;
  }
}

