<template>
  <div class="subComponent">
    <b>{{ $t('i18n_wcs_export_settings') }}</b>
    <div class="export">
      <div class="export-box vcm-base-dye05 vcm-border-dye03 vcm-content-width-full">
        <div id="raster_settings" v-if="activeSelection === 'wcs'">
          <input
            id="vcm_wcs_res_input"
            class="wcs_export_input"
            type="number"
            step="0.1"
            :min="maxResolution"
            max="1000"
            size="30"
            v-model="imageRes"
            placeholder="10.0"
          >
          <label id="i18n_wcs_res_input" for="vcm_wcs_res_input">{{ $t('i18n_wcs_res_input') }}</label>
          <input id="vcm_wcs_imgHeight" type="number" class="wcs_export_field" v-model="imageSize.height" disabled>
          <input id="vcm_wcs_imgWidth" type="number" class="wcs_export_field" v-model="imageSize.width" disabled>
          <label id="i18n_wcs_imgSize" for="vcm_wcs_imgWidth">{{ $t('i18n_wcs_imageSize') }}</label>
        </div>
        <div id="vector_settings" v-else>
          <select id="vcm_wfs_outputFormat" class="wcs_export_input" v-model="outputFormat">
            <option v-for="format in selectedDataSource.outputFormats" :value="format">
              {{ format }}
            </option>
          </select>
          <label id="i18n_wfs_format" >{{ $t('i18n_wfs_format') }}</label>
          <br>
        </div>
        <div>
          <input
            id="vcm_wcs_response_input"
            type="text"
            size="30"
            class="wcs_export_input"
            v-model="responseCRS"
            placeholder="EPSG:31468"
          >
          <label id="i18n_wcs_response_input" for="vcm_wcs_response_input">{{ $t('i18n_wcs_response_input') }}</label>
        </div>
      </div>
    </div>
    <router-link
      :to="{ name: 'wsDataExport.area' }"
    >
      <LeadButton class="vcm-content-width-full">
        {{ $t('i18n_wcs_dataSource_back') }}
      </LeadButton>
    </router-link>
    <LeadButton v-if="!running" @click="submit" class="vcm-content-width-full">
      {{ $t('i18n_export_submit_button') }}
    </LeadButton>
  </div>
</template>
<style>
  .subComponent {
    margin: .5rem 1rem .5rem 0;
  }
  .export{
    margin: .5rem 0 .5rem 0;
  }
  .export-box {
    border: 1px solid;
    padding: .5em;
    margin: 0 .5rem 0 0;
  }
  .export-box label, .export-box span, .export-box select{
    display: block;
    margin-bottom: .5rem;
  }
  .wcs_export_input{
    width: 8rem;
    padding: .1rem !important;
    float: right;
  }
  .wcs_export_field{
    width: 4rem;
    padding: .1rem !important;
    float: right;
  }
</style>
<script type="text/babel">
  import DataSourceManager from './DataSourceManager';

  export default {
    i18n: {
      messages: {
        de: {
          i18n_wcs_export_region: 'Export-Bereich',
          i18n_wcs_export_settings: 'Export-Einstellungen',
          i18n_wcs_export_desc: 'Bitte wählen Sie den Export Bereich aus, indem Sie eine Bounding Box definieren.',
          i18n_wcs_res_input: 'Rasterauflösung [m/ px]',
          i18n_wcs_imageSize: 'Bildgröße [px]',
          i18n_wfs_format: 'Ausgabeformat',
          i18n_wcs_response_input: 'Rückgabe CRS (optional)',
          i18n_wcs_dataSource_error: 'Bitte wählen Sie eine WCS Datenquelle aus.',
          i18n_wcs_export_error: 'Bitte wählen Sie den Export Bereich aus, indem Sie eine Bounding Box definieren.',
          i18n_wcs_imageSize_error: 'Bitte reduzieren Sie die Rasterauflösung! Der angefragte Datensatz übersteigt die maximale Größe von ',
          i18n_wcs_crs_error: 'Das angegebene Koordinatensystem entspricht keinem gültigem EPSG Code!',
          i18n_wcs_dataSource_running: 'Ihre Anfrage wurde entgegengenommen und wird verarbeitet.',
          i18n_wcs_dataSource_back: 'Zurück',
        },
        en: {
          i18n_wcs_export_region: 'Export region',
          i18n_wcs_export_settings: 'Export Settings',
          i18n_wcs_export_desc: 'Please select the export area by defining a bounding box.',
          i18n_wcs_res_input: 'Image Resoultion [m/ px]',
          i18n_wcs_imageSize: 'Image size [px]',
          i18n_wfs_format: 'Output format',
          i18n_wcs_response_input: 'Response CRS (optional)',
          i18n_wcs_dataSource_error: 'Please select WCS datasource.',
          i18n_wcs_export_error: 'Please select the export area by defining a bounding box.',
          i18n_wcs_imageSize_error: 'Please reduce the raster resolution! Your request exceeds the maximum size of ',
          i18n_wcs_crs_error: 'The CRS is not a valid EPSG Code!',
          i18n_wcs_dataSource_running: 'Your request is being processed.',
          i18n_wcs_dataSource_back: 'Back',
        },
      },
    },
    created() {
      const pluginState = this.$store.state.wsDataExport;
      this.activeSelection = pluginState.activeSelection;
      this.selectedDataSource = pluginState.selectedDataSource;
      this.responseCRS = 'EPSG:'.concat(this.selectedDataSource.EPSGCode);
      if (this.activeSelection === 'wfs') {
        this.outputFormat = this.selectedDataSource.outputFormats[0];
      }
      this.calcImageResolution();
    },
    data() {
      return {
        activeSelection: null,
        selectedDataSource: {},
        imageRes: 10.0,
        maxResolution: 0.1,
        responseCRS: null,
        outputFormat: null,
        running: false,
        downloadLink: null,
      };
    },
    computed: {
      imageSize() {
        return {
          width: Math.round(this.width / this.imageRes) || 0,
          height: Math.round(this.height / this.imageRes) || 0,
        };
      },
    },
    methods: {
      calcImageResolution() {
        const dsManager = DataSourceManager.getInstance();
        if (dsManager.geometryLayer.getFeatureById(dsManager.singleFeatureId)) {
          const exportArea = dsManager.geometryLayer
            .getFeatureById(dsManager.singleFeatureId);
          const extent = exportArea.getGeometry().getExtent();
          this.width = Math.abs(ol.extent.getWidth(extent));
          this.height = Math.abs(ol.extent.getHeight(extent));

          const map = vcs.vcm.Framework.getInstance().getActiveMap();
          if (map instanceof vcs.vcm.maps.Cesium) {
            const scene = map.getScene();
            const mercatorProj = vcs.vcm.util.mercatorProjection;
            const geogProj = vcs.vcm.util.wgs84Projection;
            const lowerLefWGS84 = mercatorProj.transformTo(geogProj, [extent[0], extent[1]]);
            const upperRightWGS84 = mercatorProj.transformTo(geogProj, [extent[2], extent[3]]);
            const lowerLeftIC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              scene,
              Cesium.Cartesian3.fromDegrees(...lowerLefWGS84),
            );
            const upperRightIC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              scene,
              Cesium.Cartesian3.fromDegrees(...upperRightWGS84),
            );
            this.imageRes = Math.round((this.width / Math.abs(upperRightIC.x - lowerLeftIC.x)) * 10) / 10;
          } else if (map instanceof vcs.vcm.maps.Openlayers) {
            const lowerLeftIC = map.olMap.getPixelFromCoordinate([extent[0], extent[1]]);
            const upperRightIC = map.olMap.getPixelFromCoordinate([extent[2], extent[3]]);
            this.imageRes = Math.round((this.width / Math.abs(upperRightIC[0] - lowerLeftIC[0])) * 10) / 10;
          }
          this.maxResolution =
            Math.round(Math.sqrt((this.width * this.height) / this.selectedDataSource.maxPixel) * 100) / 100;
        }
      },
      submit() {
        // check user input
        const dsManager = DataSourceManager.getInstance();
        if (!this.selectedDataSource) {
          this.notifyError(this.$t('i18n_wcs_dataSource_error'));
          return;
        }
        if (!dsManager.geometryLayer.getFeatureById(dsManager.singleFeatureId)) {
          this.notifyError(this.$t('i18n_wcs_export_error'));
          return;
        }

        if (this.activeSelection === 'wcs' && this.imageSize.width * this.imageSize.height > this.selectedDataSource.maxPixel) {
          this.notifyError(`${this.$t('i18n_wcs_imageSize_error') + this.selectedDataSource.maxPixel} [px]`);
          return;
        }

        if (this.responseCRS.indexOf(':') < 0) {
          this.notifyError(this.$t('i18n_wcs_crs_error'));
        } else {
          const checkCRS = this.responseCRS.split(':');
          if (checkCRS[0] !== 'EPSG' || checkCRS[1].length < 4) {
            this.notifyError(this.$t('i18n_wcs_crs_error'));
            return;
          }
        }

        try {
          this.running = true;
          this.notifyInfo(this.$t('i18n_wcs_dataSource_running'));

          // transform bbox
          const extent = dsManager.geometryLayer.getFeatureById(dsManager.singleFeatureId).getGeometry().getExtent();
          const sourceProj = vcs.vcm.util.mercatorProjection;
          const targetProj = new vcs.vcm.util.Projection({
            epsg: this.selectedDataSource.EPSGCode,
            proj4: this.selectedDataSource.proj4,
          });
          const lowerLeft = sourceProj.transformTo(targetProj, [extent[0], extent[1]]);
          const upperRight = sourceProj.transformTo(targetProj, [extent[2], extent[3]]);
          const bbox = lowerLeft.concat(upperRight);
          const exportSettings = {
            imageSize: this.imageSize,
            responseCRS: this.responseCRS,
            outputFormat: this.outputFormat,
          };

          let promise;
          if (this.activeSelection === 'wcs') {
            promise = DataSourceManager.doWcsRequest(this.selectedDataSource, bbox, exportSettings);
          } else {
            promise = DataSourceManager.doWfsRequest(this.selectedDataSource, bbox, exportSettings);
          }

          promise.then((response) => {
            const ext = DataSourceManager.getExtension(response.data.type);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${response.config.params.COVERAGE || response.config.params.TYPENAME}${ext}`);
            document.body.appendChild(link);
            link.click();
          })
            .catch((error) => {
              this.notifyError(error.message);
            })
            .then(() => {
              this.running = false;
            });
        } catch (e) {
          this.notifyError(this.$t(e.message));
          this.running = false;
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      const dsManager = DataSourceManager.getInstance();
      if (!dsManager.geometryLayer.getFeatureById(dsManager.singleFeatureId)) {
        next({ name: 'wsDataExport.main' });
      } else {
        next();
      }
    },
  };
</script>
