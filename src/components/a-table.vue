<template>
  <el-button class="a-table"><slot></slot></el-button>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: Object,
    default: {},
  },
});
</script>

<style lang="less">
.a-table {
}
</style>
