import Search from './searchImpl';
import { version } from '../package.json';

export default {
  version,
  registerUiPlugin: async config => ({
    name: 'wfsSearchPlugin',
    search: {
      search: new Search(config),
    },
  }),
};
