import styleMenue from './styleMenue';
import widgetButton from './widgetButton';
import version from '../package.json';
import DynamicStyler from './dynamicStyler';

const routes = [{
  name: 'styleMenue',
  path: '/styleMenue',
  component: styleMenue,
}];

const store = {
  state: {
    ticker: 0,
  },
  mutations: {
    setTicker(state, ticker) {
      state.ticker = ticker;
    },
  },
};

export default {
  version,
  postInitialize: async config => DynamicStyler.getInstance(config),
  registerUiPlugin: async () => ({
    name: 'dynamicStyler',
    routes,
    store,
    supportedMaps: ['vcs.vcm.maps.Cesium'],
    widgetButton,
  }),
};

