<template>
  <div class="oppositeRound_con" :id="`id${content.id}`">
    <div class="avatar">
      <!-- <img src="@/assets/images/ai.png" /> -->
      <div class="ai_avatar"></div>
      <div class="time">{{ content.timestamp }}</div>
    </div>
    <div class="content">
      <div class="text" v-show="!content.type" v-html="content.bot_response">
      </div>
      <div v-show="content.type === 'req'" class="loading">
        <div v-for="(item, index) in 3" :key="index" :class="[currentLoadingIndex === index ? 'loading_active' : '']"></div>
      </div>
      <div class="items" v-show="!content.type">
      <div v-for="(item, index) in items" :key="index" @click="dealAffair(item, index)">
        <img :src="item.url" />
      </div>
      </div>
    </div>
  </div>
  <feedback ref="feedbackRef"/>
</template>
<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { copyEvent } from "@/utils/tool"
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import feedback from '@/components/feedback/index.vue'
import { ElMessage } from "element-plus";
import { setOpinion } from "@/config/api.ts";

const props = defineProps<
{
  content: any,
  loc: number
}
>()

const knowledgeStore = useKnowledgeStore();

 const currentLoadingIndex = ref(0)
  const timer = setInterval(() => {
    currentLoadingIndex.value++
    if(currentLoadingIndex.value > 2) {
      currentLoadingIndex.value = 0
    }
  }, 500)

  onUnmounted(() => {
    clearInterval(timer)
  })
  const items = [
    {
      url: new URL('/src/assets/images/disapprove.svg', import.meta.url).href,
      type: 'disapprove'
    },
    {
      url: new URL('/src/assets/images/approve.svg', import.meta.url).href,
      type: 'approve'
    },
    {
      url: new URL('/src/assets/images/feedback.svg', import.meta.url).href,
      type: 'feedback'
    },
    {
      url: new URL('/src/assets/images/copy.svg', import.meta.url).href,
      type: 'copy'
    }
  ]

  const feedbackRef = ref(null)
  function dealAffair(item: any){
    const eventTrigger: Record<string, () => void> = {
      copy(){
        copyEvent(knowledgeStore.sessionType === 'assign' ? knowledgeStore.messageList[props.loc].bot_response : knowledgeStore.randomMessageList[props.loc].bot_response )
        ElMessage({
          type: 'success',
          message: '已复制'
        })
      },
      feedback(){
        feedbackRef.value.init('xxx')
      },
      approve(){
        dealAttitude(1)
      },
      disapprove(){
        dealAttitude(0)
      }
    }
    eventTrigger[item.type]()
  }

  function dealAttitude(type: number){
    setOpinion({
      id: props.content.id,
      feedback: type
    }).then((res) => {
      if(res.data.code === 1000) {
        ElMessage({
          type: 'success',
          message: '已反馈'
        })
      } else {
        throw new Error()
      }
    }).catch(() => {
      ElMessage({
          type: 'error',
          message: '反馈失败'
        })
    })
  }

</script>
<style scoped lang="less">
.oppositeRound_con {
  border-radius: 20px;
  border: 2px solid rgba(225, 220, 241, 1);
  background: rgb(245, 245, 247);
  display: flex;
  .content {
    padding: 25px 29px 16px;
    min-width: 40px;
    max-width: 630px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    .items {
      display: flex;
      align-items: center;
      margin-top: auto;
      flex-direction: row-reverse;
      padding-top: 10px;
      & > div {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: rgba(224, 217, 248, 1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          width: 16.6px;
          height: 16.6px;
        }
      }
      & > div:not(:first-child) {
        margin-right: 22px;
      }
    }
    .text {
      line-height: 23px;
    }
    .loading {
      display: flex;
      width: 100px;
      & > div {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 9px;
        background: rgba(165, 165, 167, 1);
      }
      & > .loading_active {
        background: rgba(14, 14, 16, 1);
      }
    }
  }
  .avatar {
    padding: 19px;
    width: 80px;
    border-radius: 18px 0px 0px 18px;
    background: rgba(243, 241, 252, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & > .ai_avatar {
      border-radius: 14px;
background: linear-gradient(180deg, rgba(78, 75, 86, 1) 0%, rgba(16, 15, 17, 1) 100%);
box-shadow: 0px 1px 4px  rgba(51, 51, 51, 0.5);
width: 42px;
height: 42px;
margin-bottom: 18px;
    }
    & > .time {
      font-size: 14px;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }
  }
}
</style>
