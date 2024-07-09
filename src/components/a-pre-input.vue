<template>
  <div :class="`a-pre-input flex-r-c ${props.class}`" :style="props.style">
    <slot name="pre"></slot>
    <el-input
      v-model="value"
      @change="$attrs.change"
      style="width: 0; flex: 1;font-size: 16px;"
      :placeholder="props.placeholder"
      b
    />
    <slot name="next"></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps({
  class: { type: String, default: "" },
  value: {
    type: String,
    default: "",
  },
  style: {
    type: Object,
    default: {},
  },
  placeholder: {
    type: String,
    default: "请输入搜索关键词",
  },
});
let value = ref(props.value);
</script>

<style lang="less">
.a-pre-input {
  border-radius: 8px;
  opacity: 1;
  background: #f6f6f8;
  padding: 0px 16px 0px;
  /* 输入框阴影 */
  box-shadow: 0px 1px 0px 0px #C9C2D2;
  .el-input__wrapper{
    box-shadow: none ;
    background: #F6F6F8;
    padding-top:0 ;
    padding-bottom: 0;
  }
  .el-input__inner{
    height: 44px;
    line-height: 44px;

  }
}
</style>
