import wmsDataSource from './wmsDataSource';
import wmsDataSourceButton from './wmsDataSoureceButton';
import version from '../package.json';

const routes = [
  {
    name: 'wmsData',
    path: '/wmsData',
    component: wmsDataSource,
  },
];

export default {
  version,
  registerUiPlugin: async () => ({
    name: 'wmsDataSource',
    routes,
    store: {
      state: {
        layers: [],
      },
      mutations: {
        addLayer(state, options) {
          state.layers.push(options);
        },
        removeLayer(state, layerName) {
          const index = state.layers.findIndex(layer => layer.layerName === layerName);
          state.layers.splice(index, 1);
        },
      },
    },
    widgetButton: wmsDataSourceButton,
  }),
};

