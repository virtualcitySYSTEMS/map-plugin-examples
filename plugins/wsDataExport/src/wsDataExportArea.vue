<template>
  <div class="subComponent">
    <b>{{ $t('i18n_wcs_export_area') }}</b>
    <div class="export">
      <div class="export-box vcm-base-dye05 vcm-border-dye03 vcm-content-width-full">
        <span>{{ $t('i18n_wcs_export_desc') }}</span>
        <Editor
          v-if="edtiorId && featureId"
          :editor-id="edtiorId"
          :replace-id="featureId"
          :editor-options="{ hideExport: true, hideAltitudeMode: true, denyDelete: true}"
        />
      </div>
    </div>
    <router-link
      :to="{ name: 'wsDataExport.main' }"
    >
      <LeadButton class="vcm-content-width-full">
        {{ $t('i18n_wcs_dataSource_back') }}
      </LeadButton>
    </router-link>
    <router-link
      :to="{ name: 'wsDataExport.settings' }"
    >
      <LeadButton class="vcm-content-width-full">
        {{ $t('i18n_wcs_dataSource_next') }}
      </LeadButton>
    </router-link>
  </div>
</template>
<style>
  .subComponent {
    margin: .5rem 1rem .5rem 0;
  }
  .export-box {
    border: 1px solid;
  }
  .export-box label, .export-box span, .export-box select{
    display: block;
    margin-bottom: .5rem;
  }
</style>
<script type="text/babel">
  import DataSourceManager from './DataSourceManager';

  export default {
    i18n: {
      messages: {
        de: {
          i18n_wcs_export_area: 'Export-Bereichs-Auswahl',
          i18n_wcs_export_settings: 'Export-Einstellungen',
          i18n_wcs_export_desc: 'Bitte wählen Sie den Export Bereich aus, indem Sie eine Bounding Box definieren.',
          i18n_wcs_res_input: 'Rasterauflösung [m/ px]',
          i18n_wcs_imageSize: 'Bildgröße [px]',
          i18n_wfs_format: 'Ausgabeformat',
          i18n_wcs_response_input: 'Rückgabe CRS (optional)',
          i18n_wcs_dataSource_back: 'Zurück',
          i18n_wcs_dataSource_next: 'Weiter',
        },
        en: {
          i18n_wcs_export_area: 'Export Area Selection',
          i18n_wcs_export_settings: 'Export Settings',
          i18n_wcs_export_desc: 'Please select the export area by defining a bounding box.',
          i18n_wcs_res_input: 'Image Resoultion [m/ px]',
          i18n_wcs_imageSize: 'Image size [px]',
          i18n_wfs_format: 'Output format',
          i18n_wcs_response_input: 'Response CRS (optional)',
          i18n_wcs_dataSource_back: 'Back',
          i18n_wcs_dataSource_next: 'Next',
        },
      },
    },
    created() {
      const dsManager = DataSourceManager.getInstance();
      this.edtiorId = dsManager.layerEditor.id;
      this.featureId = dsManager.singleFeatureId;
      this.$store.commit('wsDataExport/useFeatureGeometry', true);
    },
    data() {
      return {
        edtiorId: null,
        featureId: null,
      };
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'wsDataExport.settings') {
        if (DataSourceManager.getInstance().geometryLayer.getFeatureById(this.featureId)) {
          next();
        } else {
          this.notifyError(this.$t('i18n_wcs_export_desc'));
          next(false);
        }
      } else {
        next();
      }
    },
  };
</script>
