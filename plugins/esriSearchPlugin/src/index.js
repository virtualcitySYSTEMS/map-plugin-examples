import Search from './searchImpl';
import { version } from '../package.json';

export default {
  version,
  registerUiPlugin: async config => ({
    name: 'esriSearchPlugin',
    search: {
      search: new Search(config),
    },
  }),
};
