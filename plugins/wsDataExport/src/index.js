import { version } from '../package.json';
import widgetButton from './widgetButton';
import wsDataExportMain from './wsDataExportMain';
import wsDataExportService from './wsDataExportService';
import wsDataExportArea from './wsDataExportArea';
import wsDataExportSettings from './wsDataExportSettings';
import DataSourceManager from './DataSourceManager';

const routes = [
  {
    path: '/wsDataExport',
    component: wsDataExportMain,
    children: [
      {
        name: 'wsDataExport.main',
        path: '',
        component: wsDataExportService,
      },
      {
        name: 'wsDataExport.area',
        path: '/area',
        component: wsDataExportArea,
      },
      {
        name: 'wsDataExport.settings',
        path: '/settings',
        component: wsDataExportSettings,
      },
    ]
  },
];

const store = {
  state: {
    activeSelection: null,
    selectedDataSource: {},
    useFeatureGeometry: false,
  },
  getters: {
    widgetState(state) {
      const obj = {};
      Object.keys(state).forEach(key => obj[key] = state[key]);
      return obj;
    },
  },
  mutations: {
    setWidgetState(state, widgetState) {
      Object.keys(widgetState).forEach(key => state[key] = widgetState[key]);
    },
    setActiveSelection(state, activeSelection) {
      state.activeSelection = activeSelection;
    },
    setDataSource(state, selectedDataSource) {
      state.selectedDataSource = selectedDataSource;
    },
    useFeatureGeometry(state, use) {
      state.useFeatureGeometry = use;
    },
  },
};

export default {
  version,
  postInitialize: async config => DataSourceManager.getInstance(config),
  registerUiPlugin: async () => ({
    name: 'wsDataExport',
    routes,
    store,
    widgetButton,
  }),
};
