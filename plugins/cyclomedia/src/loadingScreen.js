import Cyclomedia from './cyclomedia.js';

/** html loading screen StreetSmartApi */
const loadingScreen = document.createElement('div');
const textWrapper = document.createElement('div');
const text = document.createTextNode('Loading StreetSmartAPI');
textWrapper.appendChild(text);
loadingScreen.appendChild(textWrapper);
const img = document.createElement('img');
img.src = 'assets/loading.gif';
loadingScreen.appendChild(img);
loadingScreen.classList.add('cyclomedia-loading-screen');

function showLoadingScreen() {
  const cmElement = document.getElementById('streetsmartApiContainer');
  cmElement.appendChild(loadingScreen);
}

/**
 * API to open cyclomedia panorama view
 * called on button click or, if activeOnStartup by postInitialize
 * @memberOf vcs.vcm.plugins.cyclomedia
 * @param {ol.Coordinate} [startingPosition]
 * @return {Promise}
 */
export async function openCyclomedia(startingPosition = undefined) {
  const framework = vcs.vcm.Framework.getInstance();
  const cm = Cyclomedia.getInstance();
  
  if (cm.panoramaViewActive) {
    await cm.deactivate();
  } else {
    showLoadingScreen();
    let viewpoint;
    if (startingPosition) {
      viewpoint = new vcs.vcm.util.ViewPoint({ groundPosition: startingPosition });
    } else {
      viewpoint = await framework.getActiveMap().getViewPoint();
    }
    
    try {
      const result = await cm.activate(viewpoint);
      if (result.length > 0) {
        console.log('Created component through StreetSmartApi:', result);
      } else {
        console.log('Could not activate StreetSmartApi:', result);
        return Promise.reject(result);
      }
    } catch(reason) {
      console.log(`Failed to create component(s) through StreetSmartApi: ${reason}`);
      return Promise.reject(reason);
    }
  }
}
