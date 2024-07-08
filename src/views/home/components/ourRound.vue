<template>
  <div class="ourRound_con">
    <div class="content">{{ content.user_question }}</div>
    <div class="avatar">
      <img :src="knowledgeStore.userInfo.avatar_url" />
      <div class="time">{{ content.timestamp }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

defineProps<
  {
    content: any
  }
>()

const knowledgeStore = useKnowledgeStore();
</script>
<style scoped lang="less">
.ourRound_con {
  border-radius: 20px;
  border: 2px solid rgba(225, 220, 241, 1);
  display: flex;

  .content {
    padding: 30px 26px;
    min-width: 40px;
    max-width: 746px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 23px;
  }

  .avatar {
    padding: 19px;
    width: 80px;
    border-radius: 0px 18px 18px 0px;
    background: rgba(243, 241, 252, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &>img {
      width: 43px;
      height: 43px;
      border-radius: 50%;
      margin-bottom: 16px;
    }

    &>.time {
      font-size: 14px;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }
  }
}</style>
