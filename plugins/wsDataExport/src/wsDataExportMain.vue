<template>
  <div v-if="uiConfig.show !== false">
    <contentTitle>{{ $t("i18n_wsDataExport_title") }}</contentTitle>
    <div class="vcm-scroll-wrap">
      <div class="export-layer-rows">
        <div class="nav-buttons">
          <router-link
            :to="{ name: 'wsDataExport.main' }"
            :title="$t('i18n_wsDataExport_service')"
          >
            <LeadButton class="vcm-btn-project-list nav-button" :class="{active: $route.name === 'wsDataExport.main' }">
              <span class="fa-stack fa-lg">
                <i class="fa fa-list-ul" />
              </span>
            </LeadButton>
          </router-link>
          <router-link
            :to="{ name: 'wsDataExport.area' }"
            :title="$t('i18n_wsDataExport_area')"
          >
            <LeadButton
              class="vcm-btn-project-list nav-button export-bbox-button"
              :class="{active: $route.name === 'wsDataExport.area' }"
            />
          </router-link>
          <router-link
            :to="{ name: 'wsDataExport.settings' }"
            :title="$t('i18n_wsDataExport_settings')"
          >
            <LeadButton
              class="vcm-btn-project-list nav-button"
              :class="{active: $route.name === 'wsDataExport.settings' }"
            >
              <span class="fa-stack fa-lg">
                <i class="fa fa-cog" />
              </span>
            </LeadButton>
          </router-link>
        </div>
        <div>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .export-layer-rows{
    overflow: auto;
    text-align: left;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .nav-buttons {
    display: inline-block;
    margin: 4rem 0 0 0;
    width: 100%;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    margin-right: .2rem;
  }

  .nav-button i {
    position: absolute;
    top: .2rem;
    left: -.3rem;
    right: .1rem;
    font-size: 1.8rem;
  }

  .export-bbox-button{
    background-image: url('../assets/bbox.png');
    background-repeat: no-repeat;
    background-position: center;
  }

</style>
<script>
  import DataSourceManager from './DataSourceManager';

  export default {
    i18n: {
      messages: {
        de: {
          i18n_wsDataExport_title: 'Web Service 2D Data Export',
          i18n_wsDataExport_service: 'Web Service Auswahl',
          i18n_wsDataExport_area: 'Export Bereich',
          i18n_wsDataExport_settings: 'Export Einstellungen',
          i18n_ws_raster_button: 'Raster',
          i18n_ws_vector_button: 'Vektor',
          i18n_wcs_tooltip: 'Wählen Sie eine Datenquelle aus:',
        },
        en: {
          i18n_wsDataExport_title: 'Web Service 2D Data Export',
          i18n_wsDataExport_service: 'Web Service Selection',
          i18n_wsDataExport_area: 'Export Area',
          i18n_wsDataExport_settings: 'Export Settings',
          i18n_ws_raster_button: 'Raster',
          i18n_ws_vector_button: 'Vector',
          i18n_wcs_tooltip: 'Please select a Datasource:',
        },
      },
    },
    created() {
      this.setUiConfig('content.wsDataExport');
      this.setDefaultContentState('wsDataExport');
      DataSourceManager.getInstance().geometryLayer.activate();
      DataSourceManager.getInstance().layerEditor.activate();
    },
    data() {
      return {
        uiConfig: {
          contentPosition: 'left',
          contentPositionFixed: true,
          confirmCheckbox: false,
        },
      };
    },
    beforeRouteLeave(to, from, next) {
      if (!to.path.includes('wsDataExport')) {
        DataSourceManager.getInstance().layerEditor.deactivate();
        DataSourceManager.getInstance().geometryLayer.deactivate();
      }
      next();
    },
  };
</script>

