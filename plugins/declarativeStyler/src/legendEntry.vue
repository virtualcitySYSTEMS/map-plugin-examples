<template>
  <div>
    <div class="legend-item" :style="getColor" /> <span v-if="title">{{ translateText(title) }}</span>
  </div>
</template>
<style scoped>
  /* ui - content - legend - style - legendEntry.vue */
  .legend-item {
    display: inline-block;
    margin: 0 .2rem 0 0;
  }
  .legend-item:before {
    font-family: FontAwesome;
    content: '\f0c8';
  }
  .legend-item:after {
    font-family: FontAwesome;
    font-size: 1rem;
    content: '\f096';
    color: #2f2f2f;
    position: absolute;
    left: .5rem;
  }
  div.menu-button.level_1 ~ div.wrap-style-legend .legend-item:after{
    left: 2.5rem;
  }
</style>
<script type="text/babel">

  export default {
    props: {
      title: {
        type: [String, Object],
        default: '',
        required: false,
      },
      color: {
        type: String,
        required: true,
      },
    },
    computed: {
      getColor() {
        return `color:${this.color};`;
      },
    },
  };

</script>
