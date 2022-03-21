<template>
  <div>
    <span
      @click="changeLayerState"
      class="wms-layer-btn vcm-SubButton vcm-btn-base-dye03 vcm-font-default vcm-font-default-hover vcm-btn-border vcm-border-dye03 vcm-btn-base-dye01-hover"
    >
      {{ title }}
    </span>
    <span
      @click="changeLayerState"
      class="wms-check-state-btn vcm-SubButton vcm-btn-base-dye03 vcm-font-default vcm-font-default-hover vcm-btn-border vcm-border-dye03 vcm-btn-base-dye01-hover"
    >
      <span class="wms-visible" :class="state" />
    </span>
    <span
      @click="removeLayer"
      class="wms-remove-btn vcm-SubButton vcm-btn-base-dye03 vcm-font-default vcm-btn-icon delete-icon vcm-btn-icon-font-alert-hover vcm-btn-border vcm-border-dye03 vcm-btn-base-dye01-hover"
    />
  </div>
</template>

<script>
  export default {
    name: 'WmsLayer',
    props: {
      layerName: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    created() {
      const layer = vcs.vcm.Framework.getInstance().getLayerByName(this.layerName);
      this.active = layer.active;
    },
    data() {
      return {
        active: false,
      };
    },
    computed: {
      state() {
        return this.active ? 'active' : 'inactive';
      },
    },
    methods: {
      async changeLayerState() {
        const layer = vcs.vcm.Framework.getInstance().getLayerByName(this.layerName);
        if (layer) {
          if (layer.active) {
            layer.deactivate();
          } else {
            await layer.activate();
          }
          this.active = layer.active;
        }
      },
      removeLayer() {
        const layer = vcs.vcm.Framework.getInstance().getLayerByName(this.layerName);
        if (layer) {
          layer.deactivate();
          vcs.vcm.Framework.getInstance().removeLayer(layer);
        }
        this.$store.commit('wmsDataSource/removeLayer', this.layerName);
      },
    },
  };
</script>

<style scoped>
    .vcm-SubButton{
        margin-top: .3rem;
        height: 1.5rem;
    }
    .wms-layer-btn{
        display: inline-block;
        width: 83%;
    }
    .wms-check-state-btn{
        display: inline-block;
        width: 1.5rem;
        padding: .2rem 0 0 .1rem;
        vertical-align: bottom;
        overflow: visible;
    }
    .wms-visible.active:before{
        font-family: FontAwesome;
        content: "\F070";
        font-size: 1.33333333em;
    }
    .wms-visible.inactive:before{
        font-family: FontAwesome;
        content: "\F06E";
        font-size: 1.33333333em;
    }
    .wms-remove-btn{
        display: inline-block;
        width: 1.5rem;
        vertical-align: bottom;
        overflow: visible;
        line-height: 1rem;
    }
</style>
