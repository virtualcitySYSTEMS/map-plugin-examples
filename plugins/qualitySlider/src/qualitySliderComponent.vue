<template>
  <Slider
    :style="{'margin': '1rem 1rem 0'}"
    :min="0"
    :max="2"
    v-model="viewModel"
    :process-class="'vcm-base-splash'"
    :slider-class="'vcm-btn-base-dye02 vcm-slider-btn'"
    :bg-class="'vcm-base-dye01 vcm-slider-base'"
    :piecewise="true"
    :piecewise-label="true"
    :tooltip="false"
    :data="viewModelData"
    :formatter="labelFormatter"
  />
</template>

<script>

  import QualitySlider from './qualitySlider';

  export default {
    name: 'QualitySlider',
    created() {
      this.viewModels = QualitySlider.getInstance().viewModels;
      this.localViewModel = this.$store.state.qualitySlider.currentViewModel;
      this.widget = this.getWidget('vcs.vcm.widgets.DisplayQuality');
    },
    data() {
      return {
        localViewModel: 1,
        viewModels: [],
      };
    },
    computed: {
      viewModel: {
        get() {
          return this.localViewModel;
        },
        set(index) {
          this.localViewModel = index;
          this.$store.commit('qualitySlider/setCurrentViewModel', index);
          const { model } = this.viewModels[index];
          Object.assign(this.widget.viewModel, model);

          this.widget.layers.forEach((layer) => {
            layer.sse = layer.defaultSse * model.layerSSEFactor;
            this.widget.setLayerQuality(layer.layerName);
          });
          this.widget.setQuality(false);
        },
      },
      viewModelData() {
        return [...this.viewModels.keys()];
      },
    },
    methods: {
      labelFormatter(index) {
        const viewModel = this.viewModels[index];
        if (viewModel) {
          return viewModel.label;
        }
        return null;
      },
    },
  };
</script>

<style scoped>
  .slider {
    margin: 1rem 1rem 0;
  }
</style>
