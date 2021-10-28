<template>
  <div class="vcm-slider-wrap">
    <span class="title">
      {{ translateText(item.titleObject) }}
    </span>
    <Slider
      v-model="step"
      :style="{'marginLeft': '10%','marginRight':'10%'}"
      :tooltip="false"
      @callback="clicked"
      :piecewise="true"
      :piecewise-label="true"
      :data="item.config.labels"
      :process-class="'vcm-base-splash'"
      :slider-class="'vcm-btn-base-dye02 vcm-slider-btn'"
      :dot-size="10"
      :bg-class="'vcm-base-dye01 vcm-slider-base'"
    />
  </div>
</template>
<style scoped>
  div {
    padding: .5rem;
  }
  .title {
    width: 70%;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: .5rem .5rem .5rem 0;
  }
  .level_0 .title {
    width: 75%;
    padding: .5rem .5rem .5rem .5rem;
  }
  .menu-button.level_2 .title{
    width: 65%;
  }
  .menu-button.level_3 .title{
    width: 65%;
  }
  .group-item .level_0 .title {
    padding: .5rem .5rem .5rem 0;
  }
</style>
<script type="text/babel">

  export default {
    props: ['item'],
    created() {
    },
    data() {
      return {
        step: 0,
        layersActive: 0,
      };
    },
    computed: {},
    methods: {
      clicked(label) {
        const active = this.item.config.labels.findIndex(element => element === label);
        if (active !== this.layersActive) {
          this.item.config.layerNames.forEach((name, index) => {
            const layer = vcs.vcm.Framework.getInstance().getLayerByName(name);
            if (layer) {
              if (index <= active) {
                layer.activate();
              } else {
                layer.deactivate();
              }
            }
          });
          this.layersActive = active;
        }
      },
    },
  };

</script>
