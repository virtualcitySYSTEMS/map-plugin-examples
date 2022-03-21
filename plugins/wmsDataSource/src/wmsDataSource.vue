<template>
  <div>
    <ContentTitle>{{ $t('dynamicwms') }}</ContentTitle>
    <div class="vcm-scroll-wrap">
      <div class="scroll-spacer">
        <div class="import-wms-data">
          <p>{{ $t('instruction') }}</p>
          <table class="wms-data-form">
            <colgroup>
              <col class="label-cell">
              <col>
            </colgroup>
            <tr>
              <td>
                {{ $t('title') }}
              </td>
              <td>
                <input type="text" v-model="uiConfig.title" class="full-width">
              </td>
            </tr>
            <tr>
              <td>
                {{ $t('url') }}
              </td>
              <td>
                <input type="text" v-model="uiConfig.url" class="full-width">
              </td>
            </tr>
            <tr>
              <td>
                {{ $t('version') }}
              </td>
              <td>
                {{ version }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <LeadButton @click="getCapabilities">
                  {{ $t('getCapabilities') }}
                </LeadButton>
              </td>
            </tr>
          </table>
          <template v-if="capabilitiesLoaded">
            <hr class="vcm-border vcm-border-dye03">
            <table class="wms-data-form">
              <colgroup>
                <col class="label-cell">
                <col>
              </colgroup>
              <tr>
                <td class="vertical-top">
                  {{ $t('wmsLayers') }}
                </td>
                <td>
                  <select multiple v-model="selectedLayers" class="full-width">
                    <option v-for="layer in layers" :value="layer.Name" :key="layer.Name">
                      {{ layer.Title }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  WMS Format
                </td>
                <td>
                  <select v-model="selectedFormat" class="full-width">
                    <option disabled value="">
                      {{ $t('pleaseSelectValue') }}
                    </option>
                    <option v-for="format in formats" :key="format">
                      {{ format }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label for="transparency">{{ $t('transparency') }}</label>
                </td>
                <td>
                  <input type="checkbox" id="transparency" v-model="transparent">
                </td>
              </tr>
              <tr>
                <td>
                  Tiling Schema
                </td>
                <td>
                  <select v-model="tilingScheme" class="full-width">
                    <option v-for="scheme in tilingSchemes" :key="scheme">
                      {{ scheme }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <LeadButton @click="fetchWMSData">
                    {{ $t('fetchWMSData') }}
                  </LeadButton>
                </td>
              </tr>
            </table>
          </template>
          <div>
            <hr class="vcm-border vcm-border-dye03">
            <WmsLayer
              v-for="layer in $store.state.wmsDataSource.layers"
              :key="layer.layerName"
              :layer-name="layer.layerName"
              :title="layer.title"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .vcm-scroll-wrap{
        top: 45px;
    }
  .import-wms-data h2{
    text-align: left;
  }
  .wms-data-form{
    text-align: left;
    width: 100%;
  }
  .label-cell{
    width: 30%;
  }
  .wms-data-form td{
    padding: .4rem 0;
  }
  .import-wms-data hr{
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
</style>

<script type="text/babel">
  import axios from 'axios';
  import defaultOptions from '../config.json';
  import WmsLayer from './wmsLayer';

  export default {
    components: { WmsLayer },
    i18n: {
      messages: {
        en: {
          dynamicwms: 'WMS Services',
          title: 'Title',
          url: 'URL',
          version: 'WMS version',
          instruction: 'Enter an URL to WMS',
          getCapabilities: 'Get capabilities',
          fetchWMSData: 'Add WMS Data',
          transparency: 'Transparency',
          wmsLayers: 'WMS Layers',
          pleaseSelectValue: 'Please select one',
          missingLayer: 'Please select at least one layer.',
          missingFormat: 'Please select a format.',
        },
        de: {
          dynamicwms: 'WMS Dienste',
          title: 'Titel',
          url: 'URL',
          version: 'WMS Version',
          instruction: 'Geben Sie eine URL zu einem WMS ein',
          getCapabilities: 'Verbinden',
          fetchWMSData: 'WMS Ebene hinzufügen',
          transparency: 'Transparenz',
          wmsLayers: 'WMS Ebenen',
          pleaseSelectValue: 'Bitte ein Format wählen',
          missingLayer: 'Bitte mindestens eine Ebene auswählen.',
          missingFormat: 'Bitte ein Format auswählen',
        },
      },
    },
    created() {
      this.setUiConfig('plugins.wmsDataSource');
    },
    data() {
      const data = {
        uiConfig: {
          url: '',
          title: 'title',
        },
        capabilitiesLoaded: false,
        selectedLayers: [],
        layers: [],
        formats: [],
        selectedFormat: '',
        transparent: false,
        tilingSchemes: ['Geographic', 'Mercator'],
        tilingScheme: 'Geographic',
        version: '1.1.1',
      };
      Object.assign(data.uiConfig, defaultOptions);
      return data;
    },
    watch: {
      'uiConfig.url': function () {
        this.capabilitiesLoaded = false;
      },
    },
    methods: {
      getCapabilities() {
        const providedParams = this.getProvidedParams();
        const params = {
          REQUEST: 'GetCapabilities',
          SERVICE: 'WMS',
          VERSION: this.version,
          ...providedParams,
        };
        axios.get(this.uiConfig.url.split('?')[0], { params })
          .then((response) => {
            const capabilities = new ol.format.WMSCapabilities().read(response.data);
            this.layers = capabilities.Capability.Layer.Layer;
            this.formats = capabilities.Capability.Request.GetMap.Format;
            this.capabilitiesLoaded = true;
          })
          .catch((error) => {
            console.log(error);
          });
      },
      fetchWMSData() {
        const inputValidation = this.checkInput();
        if (inputValidation.missingValue) {
          this.notifyError(inputValidation.message);
          return;
        }
        const providedParams = this.getProvidedParams();
        const parameters = {
          format: this.selectedFormat,
          TRANSPARENT: this.transparent,
          ...providedParams,
        };

        const layerOptions = {
          layers: this.selectedLayers.join(','),
          featureInfo: false,
          tilingSchema: this.tilingScheme,
          url: this.uiConfig.url.split('?')[0],
          activeOnStartup: true,
          version: this.version,
          parameters,
        };

        if (this.uiConfig.extent) {
          layerOptions.extent = { coordinates: this.uiConfig.extent, epsg: 'EPSG:4326' };
        }
        const wmsLayer = new vcs.vcm.layer.WMS(layerOptions);
        vcs.vcm.Framework.getInstance().addLayer(wmsLayer);
        wmsLayer.activate().then(() => {
          this.$store.commit(
            'wmsDataSource/addLayer',
            { title: this.uiConfig.title || 'WMS Layer', layerName: wmsLayer.name },
          );
        });
      },
      getProvidedParams() {
        const [, query] = this.uiConfig.url.split('?');
        if (query) {
          return query.split('&')
            .map((stringKvp) => {
              const [key, value] = stringKvp.split('=');
              const decodedValue = decodeURIComponent(value);
              return { [key]: decodedValue };
            })
            .reduce((prev, val) => Object.assign(prev, val), {});
        }
        return {};
      },
      checkInput() {
        const inputValidation = { missingValue: true };
        if (this.selectedLayers.length === 0) {
          inputValidation.message = this.$t('missingLayer');
        } else if (this.selectedFormat === '') {
          inputValidation.message = this.$t('missingFormat');
        } else {
          inputValidation.missingValue = false;
        }
        return inputValidation;
      },
    },
  };
</script>
