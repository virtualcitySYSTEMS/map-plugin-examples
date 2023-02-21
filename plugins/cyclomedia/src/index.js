import Cyclomedia from './cyclomedia';
import cyclomediaButton from './cyclomediaButton';
import { version } from '../package.json';
import { openCyclomedia } from './loadingScreen.js';

export default {
  version,
  postInitialize: async config => {
    const cm = Cyclomedia.getInstance(config);
    if (config.activeOnStartup) {
      try {
        await openCyclomedia(config.startingPosition);
      } catch (e) {
        cm.deactivate();
      }
    }
  },
  registerUiPlugin: async config => ({
    name: 'cyclomedia',
    toolboxButton: config && config.actionButton ? cyclomediaButton : undefined,
    mapButton: config && config.actionButton ? undefined : cyclomediaButton,
  }),
  openCyclomedia,
};

