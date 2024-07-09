<template>
  <div class="a-segmented flex-r-c">
    <el-segmented
      v-model="value"
      :options="props.options"
      :change="props.change"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  options: {
    type: Object,
    default: {},
  },
  change: {
    type: Function,
    default: (_val:string)=>{},
  }
});
let value = ref(props.value)
</script>

<style lang="less">
.a-segmented {
  height: 50px;
  border-radius: 12px;
  background: #f6f6f8;
  padding: 4px;
  .el-segmented__item {
    padding: 5px 18px;
    height: 44px;
    line-height: 44px;
    font-size: 22px;
    color: #999999;
    &:hover {
      color: #999999 !important;
      background: transparent !important;
    }
  }
  .el-segmented__item-selected {
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0px 1px 0px 0px #c9c2d2;
  }
  .is-selected {
    height: 44px;
    color: #7d4ced;
    font-weight: 550;
  }
}
</style>
