<template>
  <div class="subComponent">
    <b>{{ $t('i18n_wsDataExport_service') }}</b>
    <div class="export">
      <button
        class="export-1 tab-export vcm-border vcm-border-dye03 vcm-content-width-full"
        :class="{ selected: activeSelection === 'wcs' }"
        v-if="tabs.indexOf('wcs') > -1 && tabs.indexOf('wfs') > -1"
        @click="setSelectionTab('wcs')"
      >
        {{ $t('i18n_ws_raster_button') }}
      </button>
      <button
        class="export-2 tab-export vcm-border vcm-border-dye03 vcm-content-width-full"
        :class="{ selected: activeSelection === 'wfs' }"
        v-if="tabs.indexOf('wcs') > -1 && tabs.indexOf('wfs') > -1"
        @click="setSelectionTab('wfs')"
      >
        {{ $t('i18n_ws_vector_button') }}
      </button>
      <div class="export-box vcm-base-dye05 vcm-border-dye03">
        <span>{{ $t('i18n_wcs_tooltip') }}</span>
        <select id="vcm_wcs_datasource_input" class="wcs_select" v-model="selectedDataSource" @change="setDataSource">
          <option v-for="dataSource in dataSources" :value="dataSource" :key="dataSource.name">
            {{ dataSource.label }}
          </option>
        </select>
      </div>
    </div>
    <router-link
      :to="{ name: 'wsDataExport.area' }"
    >
      <LeadButton class="vcm-content-width-full">{{ $t('i18n_wcs_dataSource_next') }}</LeadButton>
    </router-link>
  </div>
</template>
<style>
  .subComponent {
    margin: .5rem 1rem .5rem 0;
  }
  button.tab-export{
    padding: .5em;
    margin-bottom: -1px;
    font-size: .9rem;
    width: 5rem;
  }
  button.tab-export.selected{
    background: #EFEFEF;
    border-bottom-color: #EFEFEF;
  }
  .export-1.tab-export {
    /*border-right: none;*/
  }
  .export-2.tab-export {
    margin-left: -0.25rem;
  }
  .export{
    margin: .5rem 0 .5rem 0;
  }
  .export-box {
    border: 1px solid;
  }
  .export-box label, .export-box span, .export-box select{
    display: block;
    margin-bottom: .5rem;
  }
  .wcs_select {
    width: 88%;
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
          i18n_ws_raster_button: 'Raster',
          i18n_ws_vector_button: 'Vektor',
          i18n_wcs_tooltip: 'Wählen Sie eine Datenquelle aus:',
          i18n_wcs_dataSource_running: 'Ihre Anfrage wurde entgegengenommen und wird verarbeitet.',
          i18n_wcs_dataSource_next: 'Weiter',
        },
        en: {
          i18n_wsDataExport_title: 'Web Service 2D Data Export',
          i18n_wsDataExport_service: 'Web Service Selection',
          i18n_ws_raster_button: 'Raster',
          i18n_ws_vector_button: 'Vector',
          i18n_wcs_tooltip: 'Please select a Datasource:',
          i18n_wcs_dataSource_running: 'Your request is being processed.',
          i18n_wcs_dataSource_next: 'Next',
        },
      },
    },
    created() {
      this.tabs = Object.keys(DataSourceManager.getInstance().dataSources);
      this.setSelectionTab(this.tabs[0]);
    },
    data() {
      return {
        dataSources: [],
        selectedDataSource: {},
      };
    },
    methods: {
      setSelectionTab(tab) {
        const { wcs, wfs } = DataSourceManager.getInstance().dataSources;
        if (tab === 'wcs') {
          this.activeSelection = 'wcs';
          if (wcs.length > 0) {
            this.dataSources = wcs;
          } else {
            this.notifyError('At least one wcs coverage has to be specified in the plugins config!');
          }
        } else {
          this.activeSelection = 'wfs';
          if (wfs.length > 0) {
            this.dataSources = wfs;
          } else {
            this.notifyError('At least one wfs service (typeNames) has to be specified in the plugins config!');
          }
        }
        this.selectedDataSource = this.dataSources[0];
        this.$store.commit('wsDataExport/setActiveSelection', this.activeSelection);
        this.$store.commit('wsDataExport/setDataSource', this.selectedDataSource);
      },
      setDataSource() {
        this.$store.commit('wsDataExport/setActiveSelection', this.activeSelection);
        this.$store.commit('wsDataExport/setDataSource', this.selectedDataSource);
      },
    },
  };
</script>

