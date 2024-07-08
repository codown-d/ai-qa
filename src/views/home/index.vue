<template>
  <div class="con">
    <div class="interflow">
      <Interflow />
    </div>
      <el-scrollbar class="section">
        <Section />
      </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import Interflow from "./components/interflow.vue";
import Section from "./components/section.vue";
</script>
<style scoped lang="less">
.con {
  height: 100%;
  display: flex;
  background: rgba(234, 234, 236, 1);
  & > div {
    height: 100%;
  }
  .interflow {
    width: 1056px;
    margin-right: 16px;
    flex: 1 0 auto;
  }
  .section {
    width: 428px;
    :deep(.el-scrollbar__view) {
      height: 100%;
    }
  }
}
</style>
