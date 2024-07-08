<template>
  <div class="typeBox">
    <div>
      <img src="@/assets/images/plus.svg" />
    </div>
    <div>
      <input
        placeholder="请输入消息"
        @keyup.enter="onEnterPress"
        v-model="info"
      />
    </div>
    <div @click="onEnterPress">
      <img src="@/assets/images/jiantou.png" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
const knowledgeStore = useKnowledgeStore()
import { getCurrentHour } from "@/utils/tool"

const emit = defineEmits(['reqResponse']);

const info = ref("");

function onEnterPress() {
  if (!info.value) return
  const item = {
      type: 'req',
      kb_name: knowledgeStore.currentBase,
      timestamp: getCurrentHour(),
      user_question: info.value.trim(),
      bot_response: ''
    }
    knowledgeStore.currentReq = info.value.trim()
  if(knowledgeStore.sessionType === 'init') {
    knowledgeStore.sessionType = 'random'
    knowledgeStore.randomMessageList.push(item)
  } else if(knowledgeStore.sessionType === 'random') {
    knowledgeStore.randomMessageList.push(item)
  } else {
    knowledgeStore.messageList.push(item)
  }
  emit('reqResponse')
  info.value = ''
}
</script>
<style scoped lang="less">
.typeBox {
  width: 100%;
  height: 58px;
  border-radius: 11px;
  background: rgba(246, 246, 248, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  padding: 11.5px 0px;
  display: flex;
  & > div:first-child,
  & > div:nth-child(3) {
    width: 46.5px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    & > img {
      width: 18px;
      height: 18px;
    }
  }
  & > div:first-child {
    border-right: 1px solid rgba(213, 213, 213, 1);
  }
  & > div:nth-child(2) {
    flex-grow: 1;
    padding-left: 20px;
    input {
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      font-size: 17px;
      line-height: 17px;
      background-color: transparent;
    }
    input::placeholder {
      font-size: 17px;
    }
  }
  & > div:nth-child(3) {
    border-left: 1px solid rgba(213, 213, 213, 1);
    & > img {
      width: 18px;
      height: 12px;
    }
  }
}
</style>
