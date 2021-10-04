<template>
  <div class="quality-slider-container vcm-border-dye02" title="$t('i18n_quality')">
    <QualitySliderComponent />
  </div>
</template>

<script>
  import QualitySliderComponent from './qualitySliderComponent';

  export default {
    name: 'MapComponent',
    components: { QualitySliderComponent },
    i18n: {
      en: {
        i18n_quality: 'Display Quality'
      },
      de: {
        i18n_quality: 'Anzeigequalität'
      },
    }
  };
</script>

<style scoped>
  .quality-slider-container {
    position: absolute;
    bottom: 1.25rem;
    width: 16rem;
    right: .25rem;
    z-index: 10;
    height: 3.5rem;
    background: rgba(238, 238, 238, 0.34);
  }
</style>
