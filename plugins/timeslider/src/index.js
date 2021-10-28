import timesliderComponent from './timesliderComponent';
import infoComponent from './infoComponent';
import { version } from '../package.json';

export default {
  version,
  registerUiPlugin: () => ({
    name: 'timeslider',
    legendItem: [
      {
        name: 'timeslider',
        component: timesliderComponent,
      },
      {
        name: 'info',
        component: infoComponent,
      },
    ],
  }),
};
