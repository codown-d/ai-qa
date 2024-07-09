<template>
  <div class="a-header">{{ props.title }}</div>
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
.a-header {
  font-size: 36px;
  font-weight: bold;
  line-height: 48px;
  color: #333333;
  padding-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;

}
</style>
