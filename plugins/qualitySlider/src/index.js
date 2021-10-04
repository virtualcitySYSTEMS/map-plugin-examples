import mapComponent from './mapComponent';
import { version } from '../package.json';
import QualitySlider from './qualitySlider';

const store = {
  state: {
    currentViewModel: 1,
  },
  mutations: {
    setCurrentViewModel(state, model) {
      state.currentViewModel = model;
    },
  },
};

export default {
  version,
  postInitialize: (config) => {
    store.state.currentViewModel = QualitySlider.getInstance(config).default;
  },
  registerUiPlugin: () => ({
    name: 'qualitySlider',
    mapComponent,
    store,
  }),
};
