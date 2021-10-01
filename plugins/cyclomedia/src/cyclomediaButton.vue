<template>
  <div @click="click" class="vcm-btn-map-CyclomediaPlugin" />
</template>
<style>
  .vcm-btn-map-CyclomediaPlugin:before{
    content: "\f21d";
    font-family: FontAwesome;
    font-size: 1.25rem;
  }

  .vcm-btn-map-CyclomediaPlugin {
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    font-size: 1.25rem;
    line-height: 2.5rem;
  }

  .cyclomediaMapElement {
  }

  .vcm-map-sub-left-23rd {
    width: 66% !important;
    bottom: 1rem !important;
    z-index: 10 !important;
  }

  .vcm-map-sub-right-3rd {
    left: 66% !important;
    width: 34% !important;
  }
  .cyclomedia-loading-screen {
    background-color: #dee2c9;
    height: 100%;
    width: 100%;
    padding-top: 15%;
    text-align: center;
    font-size: 1.4rem;
  }
</style>
<script type="text/babel">
  import Cyclomedia from './cyclomedia';

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

  export default {
    i18n: {
      messages: {
        de: {
          i18n_cyclomedia_error: 'Öffnen des Cyclomedia Plugins fehlgeschlagen! ',
          i18n_cyclomedia_init_error: 'Fehler beim Initialisieren.',
          i18n_cyclomedia_domain_error: 'Für die aktuelle Position liegen keine Panoramabilder vor.',
        },
        en: {
          i18n_cyclomedia_error: 'Failed to open Cyclomedia Plugin! ',
          i18n_cyclomedia_init_error: 'Initialization error',
          i18n_cyclomedia_domain_error: 'No images for the current position.',
        },
      },
    },
    methods: {
      async click() {
        const framework = vcs.vcm.Framework.getInstance();
        const cm = Cyclomedia.getInstance();

        if (cm.panoramaViewActive) {
          cm.deactivate();
        } else {
          this.showLoadingScreen();
          const viewpoint = await framework.getActiveMap().getViewPoint();
          cm.activate(viewpoint)
            .then((result) => {
              console.log('Created component through StreetSmartApi:', result);
              if (this.$router.currentRoute.fullPath !== '/#') {
                this.$router.push('/#');
              }
            })
            .catch((reason) => {
              console.log(`Failed to create component(s) through StreetSmartApi: ${reason}`);
              if (reason.message.includes('init')) {
                reason.message = this.$t('i18n_cyclomedia_init_error');
              } else if (reason.message.includes('recordedAt') || reason.message.includes('undefined')) {
                reason.message = this.$t('i18n_cyclomedia_domain_error');
              }
              this.alert(this.$t('i18n_cyclomedia_error') + reason.message, () => cm.deactivate());
            });
        }
      },
      showLoadingScreen() {
        const cmElement = document.getElementById('streetsmartApiContainer');
        cmElement.appendChild(loadingScreen);
      },
    },
  };

</script>
