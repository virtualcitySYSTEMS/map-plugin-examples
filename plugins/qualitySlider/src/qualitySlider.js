import defaultOptions from '../config.json';

/**
 * @typedef {Object} vcs.vcm.plugins.qualitySlider.QualitySliderValue
 * @property {string} label
 * @property {vcs.vcm.widgets.DisplayQuality.ViewModel.Options} model
 */

/**
 * @type {vcs.vcm.plugins.qualitySlider.QualitySlider}
 */
const instance = null;

/**
 * Quality Slider Plugin
 * @class
 * @memberOf vcs.vcm.plugins.qualitySlider
 */
class QualitySlider {
  constructor(options) {
    /** @type {number} */
    this.default = options.default;
    /** @type {vcs.vcm.plugins.qualitySlider.QualitySliderValue} */
    this.viewModels = options.viewModels;
  }

  /**
   * Singleton
   * @param {Object} options config
   * @returns {vcs.vcm.plugins.qualitySlider.QualitySlider} instance of QualitySlider
   */
  static getInstance(options) {
    if (instance) {
      return instance;
    }
    return new QualitySlider(Object.assign(defaultOptions, options));
  }
}

export default QualitySlider;
