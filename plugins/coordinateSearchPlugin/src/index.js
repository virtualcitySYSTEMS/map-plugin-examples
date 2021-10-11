import CoordinateSearch from './coordinateSearch';
import { version } from '../package.json';
import defaultOptions from '../config.json';

function addI18n(i18nConfig = {}) {
  Object.entries(Object.assign(defaultOptions.i18n, i18nConfig)).forEach(([lang, obj]) => {
    if (obj instanceof Object) {
      Object.entries(obj).forEach(([token, message]) => {
        vcs.vcm.i18n.setMessage(lang, token, message);
      });
    }
  });
}

export default {
  version,
  postInitialize: async config => addI18n(config.i18n),
  registerUiPlugin: async config => ({
    name: 'coordinateSearchPlugin',
    search: {
      search: new CoordinateSearch(config),
    },
  }),
};
