<template>
  <div>
    <ContentTitle>{{ $t('i18n_style_title') }}</ContentTitle>
    <div class="vcm-scroll-wrap">
      <div class="scroll-spacer">
        <select v-model="selectedLayer" @change="loadData" class="full-width">
          <option v-for="option in layerNames" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <template v-if="loading">
          <Loader />
        </template>
        <template v-else>
          <strong>{{ $t('i18n_style_attribute') }}</strong>
          <select
            v-if="attributes.length > 0"
            v-model="selectedAttr"
            @change="getAttribute(selectedAttr)"
            class="full-width"
          >
            <option v-for="attribute in attributes" :key="attribute">
              {{ attribute }}
            </option>
          </select>
          <div v-if="selectedAttr">
            <strong>{{ $t('i18n_style_chosenAtt') }}</strong>
            <span>{{ selectedAttr }}: min value: {{ origAttr.minRange }} | max value: {{ origAttr.maxRange }}</span>
            <br><br>
            <span>
              <label for="min-range">Min:</label>
              <input id="min-range" type="number" v-model.number="attr.minRange" step="0.01" @change="setStyle">
              <label for="max-range">Max:</label>
              <input id="max-range" type="number" v-model.number="attr.maxRange" step="0.01" @change="setStyle">
              <label for="max-steps">Steps:</label>
              <input
                id="max-steps"
                type="number"
                v-model.number="attr.steps"
                step="1"
                min="1"
                @change="setStyle"
              >
            </span>
            <strong>{{ $t('i18n_style_Styling') }}</strong>
            <select v-if="selectedAttr" v-model="selectedColor">
              <option v-for="color in colors" :key="color.text" :value="color.value">
                {{ color.text }}
              </option>
            </select>
            <input type="checkbox" id="checkbox" v-model="invert" @change="setStyle">
            <label for="checkbox">{{ $t('i18n_style_invert') }}</label>
            <div v-if="selectedAttr" class="vcm-margin-top-full">
              <LeadButton class="vcm-content-width-full" @click="setStyle">
                {{ $t('i18n_style_apply') }}
              </LeadButton>
              <LeadButton
                v-if="!presetStyle"
                class="vcm-content-width-full"
                @click="reset"
              >
                {{ $t('i18n_style_reset') }}
              </LeadButton>
              <LeadButton class="vcm-content-width-full" @click="clear">
                {{ $t('i18n_style_clear') }}
              </LeadButton>
              <LeadButton v-if="downloadBtn && legend.length > 0" class="vcm-content-width-full" @click="download">
                {{ $t('i18n_style_download') }}
              </LeadButton>
            </div>
            <template v-if="legend.length > 0">
              <h4>{{ $t('i18n_style_legend') }}</h4>
              <div class="wrap-style-legend vcm-base-dye03 vcm-border vcm-border-default">
                <LegendEntry
                  v-for="(entry, index) in legend"
                  :key="`color${index}`"
                  :title="entry.title"
                  :color="entry.color"
                />
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped>
  input[type="number"] {
    width: 15%;
  }

  .vcm-scroll-wrap{
    top: 3.5rem;
  }
  .scroll-spacer{
    padding-right: .5rem;
    padding-top: 1rem;
  }
  .content-layer-wrap.center .scroll-spacer{
    width: 50%;
  }

  strong{
    display: block;
    margin-top: 1.5rem;
    margin-bottom: .5rem;
  }
</style>
<script type="text/babel">
  import DynamicStyler from './dynamicStyler';
  import LegendEntry from './legendEntry';

  export default {
    i18n: {
      messages: {
        de: {
          i18n_style_title: 'Einstellung für einen neuen Layerstyle',
          i18n_style_attribute: 'Ein im Layer verfügbares Attribut auswählen',
          i18n_style_chosenAtt: 'Ausgewähltes Attribut',
          i18n_style_Styling: 'Styling für ausgwähltes Attribut wählen',
          i18n_style_invert: 'Farbrange invertieren?',
          i18n_style_apply: 'Style anwenden',
          i18n_style_reset: 'Style zurücksetzen',
          i18n_style_clear: 'Style löschen',
          i18n_style_download: 'Download Config als JSON',
          i18n_style_legend: 'Farblegende',
        },
        en: {
          i18n_style_title: 'Settings for new layer style',
          i18n_style_attribute: 'choose an attribute from layer',
          i18n_style_chosenAtt: 'chosen attribute',
          i18n_style_Styling: 'choose a style for attribute',
          i18n_style_invert: 'inverte the color range?',
          i18n_style_apply: 'Apply style',
          i18n_style_reset: 'Reset style',
          i18n_style_clear: 'Remove style',
          i18n_style_download: 'Download config as JSON',
          i18n_style_legend: 'color legend',
        },
      },
    },
    components: {
      LegendEntry,
    },
    created() {
      const dynamicStyler = DynamicStyler.getInstance();
      this.layerNames = dynamicStyler.layerNames;
      this.colors = dynamicStyler.colors;
      this.selectedLayer = this.layerNames[0];
      this.selectedColor = this.colors[0].value;
      this.downloadBtn = dynamicStyler.downloadBtn;
      this.loadData();
      if (dynamicStyler.styleItem && dynamicStyler.styleItem.legend) {
        this.legend = dynamicStyler.styleItem.legend;
      }
    },
    data() {
      return {
        uiConfig: {
          contentPosition: 'left',
          contentPositionFixed: true,
        },
        layerNames: [],
        colors: [],
        attributes: [],
        legend: [],
        invert: false,
        selectedLayer: '',
        selectedAttr: '',
        selectedColor: null,
        attr: {
          minRange: null,
          maxRange: null,
          steps: 10,
        },
        origAttr: {
          minRange: null,
          maxRange: null,
          steps: 10,
        },
        loading: false,
        downloadBtn: false,
      };
    },
    computed: {
      presetStyle() {
        return this.attr.minRange === this.origAttr.minRange &&
          this.attr.maxRange === this.origAttr.maxRange &&
          this.attr.steps === this.origAttr.steps;
      },
    },
    methods: {
      async loadData() {
        try {
          this.loading = true;
          const properties = await DynamicStyler.getInstance().loadData(this.selectedLayer);
          // filter numeric properties
          this.attributes = Object.keys(properties).filter(p => properties[p].minimum < properties[p].maximum);
          this.getAttribute(this.attributes[0]);
          this.loading = false;
        } catch (err) {
          this.notifyError(err);
        }
      },
      getAttribute(name) {
        this.selectedAttr = name;
        try {
          this.attr = DynamicStyler.getInstance().getAttributeStatistics(name);
          this.origAttr = { ...this.attr };
        } catch (err) {
          this.notifyError(err);
        }
      },
      setStyle() {
        const dynamicStyler = DynamicStyler.getInstance();
        dynamicStyler.setStyle({
          invert: this.invert,
          color: this.selectedColor,
          selectedAttr: this.selectedAttr,
          attr: this.attr,
        });
        this.legend = dynamicStyler.styleItem.legend;
      },
      reset() {
        this.attr = { ...this.origAttr };
        this.setStyle();
      },
      clear() {
        DynamicStyler.getInstance().clear();
      },
      download() {
        const style = DynamicStyler.getInstance().styleItem;
        const config = {
          name: style.name,
          declarativeStyle: style.getOptions().declarativeStyle,
          legend: style.legend,
        };
        vcs.vcm.util.downloadText(
          JSON.stringify(config, undefined, 2),
          'style.json',
        );
      },
    },
  };

</script>
