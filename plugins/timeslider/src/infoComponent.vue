<template>
  <div v-html="translateText(item.config.text)"></div>
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
      return {};
    },
  };

</script>
