import Cyclomedia from './cyclomedia';
import cyclomediaButton from './cyclomediaButton';
import { version } from '../package.json';

export default {
  version,
  postInitialize: async config => Cyclomedia.getInstance(config),
  registerUiPlugin: async config => ({
    name: 'cyclomedia',
    toolboxButton: config && config.actionButton ? cyclomediaButton : undefined,
    mapButton: config && config.actionButton ? undefined : cyclomediaButton,
  }),
};

