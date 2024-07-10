<template>
  <div class="faq-content">
    <div class="header-title">Ai对话相关问题</div>
    <div v-for="item in dataInfoList" class="answer-cont">
      <div class="issue">{{ item.issue }}</div>
      <p v-if="typeof item.answer === 'string'" class="answer">
        {{ item.answer }}
      </p>
      <div v-else class="answer">
        <p v-for="ite in item.answer">{{ ite }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps({
  prams: {
    type: Object,
    default: {},
  },
});
let dataInfoList = ref<any>([
  {
    issue: "什么是Ai对话",
    answer:
      "画板相当于一个在线文件夹，你可以将不同的采集分类放在不同的画板中，让你的采集并井有条。",
  },
  {
    issue: "如何创建Ai对话",
    answer: [
      "如何创建画板 你可以通过以下方法创建画板:",
      "1.点击页面右下角的加号 +，在弹出菜单中选择[创建画板，即可:",
      "2.在来集时，在搜索框中输入你需要的画板名，并点击创d画板，即可;",
      "3.在你的个人主页中，点击T创建画板，图标",
    ],
  },
  {
    issue: "什么是Ai对话",
    answer:
      "给你的画板分类，可以让你的内容更加有序，也有助于其他用户发现你的优秀采集,使用上文第二种方法创建画板时，您的画板将不会被分类，请注意将它归到会适的分类。",
  },
  {
    issue: "给画板分类",
    answer:
      "给你的画板分类，可以让你的内容更加有序，也有助于其他用户发现你的优秀采集,使用上文第二种方法创建画板时，您的画板将不会被分类，请注意将它归到会适的分类。",
  },
  {
    issue: "什么是Ai对话",
    answer:
      "画板相当于一个在线文件夹，你可以将不同的采集分类放在不同的画板中，让你的采集并井有条。",
  },
]);
let getData = () => {
  console.log(props);
  // return
};
getData();
</script>

<style lang="less">
.faq-content {
    .header-title{
        margin-bottom: 30px;
    }
  .answer-cont {
    margin-bottom: 30px;
    padding-left: 40px;
    position: relative;
    &:after{
        content: '';
        position: absolute;
        left: -4px;
        top: 16px;
        margin-top: -14px;
        width: 32px;
        height: 36px;
        background: url(../../assets/images/wen.png) no-repeat center center;
        background-size: 100% 100%;
    }
  }
  .issue {
    font-weight: 550;
    font-size: 18px;
    line-height: 32px;
    color: #333333;
  }

  .answer {
    font-size: 18px;
    font-weight: normal;
    line-height: 32px;
    color: #999999;
    position: relative;
   
  }
}
</style>
