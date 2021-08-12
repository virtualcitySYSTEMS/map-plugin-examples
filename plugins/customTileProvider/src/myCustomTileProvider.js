
/**
 * @typedef {vcs.vcm.layer.tileProvider.TileProvider.Options} MyCustomTileProvider.Options
 * @property {string} url  url Template in the form `http://myFeatureSource/layer/getFeatures?minx={minx}&miny={miny}&maxx={maxx}&maxy={maxy}` or `http://myFeatureSource/layer/getFeatures?x={x}&y={y}&level={z}`
 * @api
 */

/**
 * replaces {x}, {y}, {z} with the x, y, z tiling coordinates
 * replaces {minx}, {miny}, {maxx}, {maxy} with extent of the tile if tilingExtent is provided
 * replaces {locale} with the current locale
 *
 * @param {string} url
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Cesium/Rectangle=} tilingExtent
 * @returns {string}
 */
export function getURL(url, x, y, z, tilingExtent) {
  let replacedURL = url;
  if (tilingExtent) {
    const southwest = Cesium.Rectangle.southwest(tilingExtent);
    const northeast = Cesium.Rectangle.northeast(tilingExtent);
    const minx = Cesium.Math.toDegrees(southwest.longitude);
    const miny = Cesium.Math.toDegrees(southwest.latitude);
    const maxx = Cesium.Math.toDegrees(northeast.longitude);
    const maxy = Cesium.Math.toDegrees(northeast.latitude);
    replacedURL = replacedURL
      .replace(/\{minx\}/, String(minx))
      .replace(/\{miny\}/, String(miny))
      .replace(/\{maxx\}/, String(maxx))
      .replace(/\{maxy\}/, String(maxy));
  }
  const locale = vcs.vcm.Framework.getInstance().getLocale();
  replacedURL = replacedURL
    .replace(/\{x\}/, String(x))
    .replace(/\{y\}/, String(y))
    .replace(/\{z\}/, String(z))
    .replace(/\{locale\}/, String(locale));
  return replacedURL;
}

/**
 * TileProvider loads GeoJSON from the provided URL. The URL has placeholders:
 * the extent in latitude/longitude via: {minx}, {miny}, {maxx}, {maxy}
 * tile Coordinates in x, y, z(level) via:  {x}, {y}, {z}
 * {locale} can be used to request locale aware content.
 *
 * @class
 * @extends {vcs.vcm.layer.tileProvider.TileProvider}
 * @export
 * @api
 */
class MyCustomTileProvider extends vcs.vcm.layer.tileProvider.TileProvider {
  /**
   * @readonly
   * @returns {string}
   */
  static get className() { return 'MyCustomTileProvider'; }

  /**
   * @returns {MyCustomTileProvider.Options}
   */
  static getDefaultOptions() {
    return {
      ...vcs.vcm.layer.tileProvider.TileProvider.getDefaultOptions(),
      url: undefined,
    };
  }

  /**
   * @param {MyCustomTileProvider.Options} options
   */
  constructor(options) {
    const defaultOptions = MyCustomTileProvider.getDefaultOptions();
    super(options);

    /**
     * @type {string}
     */
    this.url = options.url || defaultOptions.url;
  }


  /**
   * @inheritDoc
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Promise<Array<ol/Feature>>}
   */
  async loader(x, y, z) {
    const rectangle = this.tilingScheme.tileXYToRectangle(x, y, z);
    const url = getURL(this.url, x, y, z, rectangle);
    const response = await fetch(url);
    const data = await response.json();
    const { features } = vcs.vcm.layer.GeoJSON.parseGeoJSON(data, { dynamicStyle: true });
    return features;
  }
}

export default MyCustomTileProvider;
