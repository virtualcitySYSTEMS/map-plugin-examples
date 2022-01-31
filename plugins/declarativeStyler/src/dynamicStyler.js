import chroma from 'chroma-js';
import defaultOptions from '../config.json';

/**
 * @type {vcs.vcm.plugins.declarativeStyler.DynamicStyler}
 */
let instance;

const framework = vcs.vcm.Framework.getInstance();

/**
 * @typedef {Object} ColorOption
 * @property {string} text
 * @property {string[]} value
 */

/**
 * @typedef {Object} AttributeStats
 * @property {number} minRange
 * @property {number} maxRange
 * @property {number} steps
 */

/**
 * @class
 * @memberOf vcs.vcm.plugins.declarativeStyler
 */
class DynamicStyler {
  constructor(options) {
    /**
     * @type {string[]}
     */
    this.layerTypes = options.layerTypes || [];
    
    /**
     * @type {string[]}
     */
    this.layerNames = options.layerNames || [];
    
    if (this.layerNames.length === 0) {
      this.layerNames = framework.config.layers
        .filter(l => this.layerTypes.some(t => t === l.type))
        .map(l => l.name);
    }
    
    /**
     * @type {vcs.vcm.layer.FeatureLayer|null}
     */
    this.layer = null;
    
    /**
     * @type {Object}
     */
    this.properties = {};
    
    /**
     * @type {Array<ColorOption>}
     */
    this.colors = options.colors;
    
    /**
     * @type {vcs.vcm.util.style.DeclarativeStyleItem}
     */
    this.styleItem = null;
    
    /**
     * @type {boolean}
     */
    this.downloadBtn = options.downloadBtn || false;
  }
  
  /**
   * Singleton
   * @param {Object} [options] config
   * @returns {vcs.vcm.plugins.declarativeStyler.DynamicStyler} instance of DynamicStyler
   */
  static getInstance(options) {
    if (instance) {
      return instance;
    }
    instance = new DynamicStyler(Object.assign(defaultOptions, options));
    return instance;
  }
  
  /**
   * @param {string} layerName
   * @returns {Promise<Object|null>}
   */
  async loadData(layerName) {
    const layer = framework.getLayerByName(layerName);
    if (!layer) {
      throw new Error(`Could not load layer '${layerName}'. Please adapt the plugins config.`);
    }
    
    this.layer = layer;
    if (this.layer && !this.layer.active) {
      await this.layer.activate();
    }
    
    const map = framework.getActiveMap();
    if (!map) {
      return null;
    }
    const implementations = this.layer.getImplementationsForMap(map);
    
    implementations.forEach((impl) => {
      if (impl instanceof vcs.vcm.layer.cesium.CesiumTilesetCesium && impl.cesium3DTileset) {
        // eslint-disable-next-line prefer-destructuring
        this.properties = impl.cesium3DTileset.properties;
      }
    });
    return this.properties;
  }
  
  /**
   * @param {string} name
   * @returns {AttributeStats}
   */
  getAttributeStatistics(name) {
    if (!this.properties[name]) {
      throw new Error(`Could not get attribute ${name}`);
    }
    if (this.properties[name].minimum === null) {
      throw new Error(`Attribute ${name} is not numeric and therefore not supported.`)
    }
    
    return {
      minRange: parseFloat(this.properties[name].minimum.toFixed(2)),
      maxRange: parseFloat(this.properties[name].maximum.toFixed(2)),
      steps: 10,
    };
  }
  
  /**
   * set style on active layer
   * @param {{invert: boolean, color: Array<ColorOption>, selectedAttr: string, attr: AttributeStats}} options
   */
  setStyle(options) {
    if (!Array.isArray(options.color) && options.color.length !== 2) {
      return;
    }
    const start = options.invert ? options.color[1] : options.color[0];
    const end = options.invert ? options.color[0] : options.color[1];
    let color;
    let hex;
    const style = {
      show: `Boolean(\${attributes.${options.selectedAttr}}) === true`,
      color: {
        conditions: [],
      },
    };
    const legend = [];
    let i;
    if (options.attr.minRange < 0) {
      i = -10;
      color = chroma.scale([start, end]).domain([i, options.attr.maxRange]).mode('lab');
      hex = color(options.attr.minRange).hex();
      style.color.conditions.push([
        `Number(\${attributes.${options.selectedAttr}}) >= ${Number(options.attr.minRange)}`,
        `color("${hex}")`,
      ]);
      legend.push({ color: hex, title: options.attr.minRange.toFixed(2) });
    } else {
      i = options.attr.minRange;
      color = chroma.scale([start, end]).domain([i, options.attr.maxRange]).mode('lab');
    }
    const diff = options.attr.maxRange - i;
    
    while (i < options.attr.maxRange) {
      hex = color(i).hex();
      style.color.conditions.push([
        `Number(\${attributes.${options.selectedAttr}}) >= ${Number(i)}`,
        `color("${hex}")`,
      ]);
      legend.push({ color: hex, title: i.toFixed(2) });
      i += diff / options.attr.steps;
    }
    hex = color(options.attr.maxRange).hex();
    style.color.conditions.push([
      `Number(\${attributes.${options.selectedAttr}}) >= ${Number(options.attr.maxRange)}`,
      `color("${hex}")`,
    ]);
    legend.push({ color: hex, title: options.attr.maxRange.toFixed(2) });
    style.color.conditions.reverse();
    style.color.conditions.push(['true', 'color("white",1)']);
    this.styleItem = new vcs.vcm.util.style.DeclarativeStyleItem({
      name: 'userStyle',
      declarativeStyle: style,
      legend,
    });
    this.layer.activate();
    this.layer.setStyle(this.styleItem);
  }
  
  /**
   * clear style on active layer
   */
  clear() {
    if (this.layer) {
      this.layer.clearStyle();
    }
  }
}

export default DynamicStyler;
