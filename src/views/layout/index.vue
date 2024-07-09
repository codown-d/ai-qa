<template>
  <div class="layout-wrapper">
    <div class="side">
      <Side/>
    </div>
    <div class="layout-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Side from "@/views/home/components/side.vue";
import { getKnowledgeBase } from "@/config/api";
import { useKnowledgeStore } from '@/store/useKnowledgeStore';

function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


  getKnowledgeBase()
      .then((res) => {
    useKnowledgeStore().setKnowledgeList(res.data.data.map((item: any) => ({...item, bgColor: getRandomHexColor()})))
  })
  .catch(() => {});
</script>

<style scoped lang="less">
  .layout-wrapper {
    padding: 22px 15px;
    height: 100vh;
    display: flex;
    background: rgba(234, 234, 236, 1);

    .side {
      width: 372px;
      min-width: 220px;
      margin-right: 16px;
      height:calc(100vh - 44px)
    }

    .layout-main {
      background: #fff;
      border-radius: 0.93vw;
      height:calc(100vh - 44px);
      flex: 1;
      overflow: hidden;
    }
  }
</style>
