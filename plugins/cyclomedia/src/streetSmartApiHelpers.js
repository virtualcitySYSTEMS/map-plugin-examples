/** utility function
 *  create url with
 *  @param {String} base (base-URL)
 *  @param {Object} parameters (as key-value pairs)
 *  @return {String} url
 */
export function createReqURL(base, parameters) {
  const parameter = [];
  // url.push(base);
  Object.entries(parameters).forEach(
    ([key, value]) => {
      parameter.push(`${key}=${value}`);
    });
  let url = '';
  if (base.slice(-1) === '?') {
    url = base;
  } else {
    url = `${base}?`;
  }
  return url.concat(parameter.join('&'));
}
