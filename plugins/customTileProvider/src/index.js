import { version } from '../package.json';
import MyCustomTileProvider from './myCustomTileProvider';

async function preInitialize(){
  vcs.vcm.VcsClassRegistry.registerClass(MyCustomTileProvider.className, MyCustomTileProvider)
}

export default {
  version,
  preInitialize,
};
