<template>
  <a href="#/wsDataExport" class="ws-data-export-btn vcm-btn-base-splash-hover" title="WS Data Export">
    <i class="fa fa fa-lg fa-file-image-o"></i>
  </a>
</template>

<script>
  export default {
    name: 'widgetButton',
  };
</script>

<style scoped>
  .ws-data-export-btn{
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .ws-data-export-btn:hover .fa-file-image-o{
    color: white;
  }
</style>
