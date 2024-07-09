<template>
  <el-button class="a-button"><slot></slot></el-button>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: Object,
    default: {},
  },
});
</script>

<style lang="less" scoped>
.a-button {
  height: 50px;
  border-radius: 10px;
  background: #7d4ced;

  /* 按钮阴影 */
  box-shadow: 0px 2px 0px 0px #390ba0;
  padding: 9px 22px;
  color: #fff;
  font-size: 24px;
  border:0px;
}
</style>
