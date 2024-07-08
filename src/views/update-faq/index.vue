<template>
  <div class="faq-page-wrapper">
    <el-tabs
      v-model="activeName"
      type="card"
      style="padding-bottom: 10px; max-width: 1100px"
    >
      <el-tab-pane label="更新通知" name="update">
        <div>
          <div v-for="item in dataList" class="info-cont">
            <p :class="`${item.type} info-title`">{{ item.title }}</p>
            <span class="info-desc" v-if="typeof item.desc === 'string'">
              {{ item.desc }}</span
            >
            <div class="info-desc" v-else v-for="ite in item.desc">
              {{ ite }}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常见问题" name="faq">
        <div class="flex-r-c" style="height:calc(100vh - 230px);align-items:flex-start">
          <div style="width: 290px">
            <el-menu default-active="defaultctive">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span>Navigator One</span>
                </template>
                <el-menu-item-group title="Group One">
                  <el-menu-item index="1-1">item one</el-menu-item>
                  <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                  <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                  <template #title>item four</template>
                  <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <span>Navigator Two</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <el-icon><document /></el-icon>
                <span>Navigator Three</span>
              </el-menu-item>
              <el-menu-item index="4">
                <el-icon><setting /></el-icon>
                <span>Navigator Four</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div style="flex:1;padding-left:60px">123</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const activeName = ref("update");
const defaultctive = ref("update");

const getUserInfo = () => {};
let dataList = [
  {
    type: "type_1",
    title: "更新信息",
    desc: "重构设备布尔组件布局自动插件选择对象字体。链接变体跟随器下划线设备背景多...",
  },
  {
    type: "type_2",
    title: "更新时间",
    desc: "重本系统将于2024年12月24日24:00--02:00，进行系统升级，若因带来不便，对此感到非常抱歉!",
  },
  {
    type: "type_3",
    title: "更新内容",
    desc: [
      "焕然一新!知识库 2.0 升级详解",
      "1、知识库3合1，文档知识库可以建表格啦 ",
      "2、阅读页目录支持新建文档和表格 ",
      "3、编辑器支持宽屏输入，更流畅的大屏读写体验 ",
      "4、新布局，更直观:将素材面板分为“组件、图标、图片、页面新增标签导航，更快找到想要素材",
      "5、新搜索，更高效:支持全局搜索、新增搜索历史和推荐、优化搜索结果，更准更多素材 ",
      "6、新收藏，更简单:收藏数量无限制、支持搜索，优先找到你收藏的素材",
    ],
  },
];
getUserInfo();
</script>

<style lang="less">
.faq-page-wrapper {
  padding: 40px 44px;

  .info-cont {
    margin-bottom: 46px;
    padding-left: 50px;
  }
  .type_1,
  .type_2,
  .type_3 {
    &:after {
      content: "";
      position: absolute;
      left: -20px;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      top: 45%;
      z-index: 99;
    }
  }
  .type_1:after {
    background: #7e4ce1;
  }
  .type_2:after {
    background: #1c9756;
  }
  .type_3:after {
    background: #3c87c8;
  }
  .info-title {
    position: relative;
    font-size: 24px;
    line-height: 42px;
    font-weight: 500;
    letter-spacing: 0px;
    color: #333333;
    margin-bottom: 12px;
  }

  .info-desc {
    font-size: 18px;
    font-weight: normal;
    line-height: 32px;
    color: #999999;
  }
}
</style>
