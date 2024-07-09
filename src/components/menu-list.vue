<template>
  <template v-for="item in props.list" :key="item.idPath">
    <el-sub-menu v-if="item.children.length" :index="item.idPath">
      <template #title>
        <template v-if="item.icon">
          <el-icon> <Compass/></el-icon>
        </template>
        {{ item.label }}
      </template>
      <menu-list :list="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.idPath">
        <template v-if="item.icon">
          <el-icon> <Compass/></el-icon>
        </template>
      {{ item.label }}
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import MenuList from "@/components/menu-list.vue";
import { shallowRef } from "vue";
const props = defineProps({
  list: {
    type: Object,
    default: {},
  },
});
console.log(props.list);
</script>

<style lang="scss" scoped></style>
