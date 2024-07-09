<template>
  <div class="interflow_con">
    <div v-show="sessionType === 'init'" class="init">
      <div class="introduction flex-c-c">
        <div class="cricle"></div>
        <div class="title">
          欢迎进入{{ knowledgeStore.userInfo?.company }}的AI知识库
        </div>
        <div class="desc">
          你好，xx用户，作为你的智能伙伴，，我能写文案、想点子
          又能陪你聊天、解答疑惑。但是只有企业认证之后，才能更了解我。认证请联系管理员!
        </div>
      </div>
      <div class="flex-r-c type-list">
        <div v-for="item in functionItems" class="flex-c-c type-list-item">
          <div class="img-div flex-c-c" :style="`background:${item.bgColor} ;`">
            <img :src="item.icon" alt="" />
          </div>
          <div class="mb24 text">{{ item.text }}</div>
        </div>
      </div>
      <el-scrollbar class="functionItems">
        <div
          v-for="(item, index) in knowledgeStore.getKnowledgeList"
          :key="index"
          class="items_level"
        >
          <div
            v-for="(w, i) in item"
            :key="i"
            @click="dealAffair(w, index)"
            class="items_cell"
          >
            <div class="imgCon">
              <img src="@/assets/images/txtChat.svg" />
            </div>
            <div>{{ w.name }}</div>
          </div>
        </div>
      </el-scrollbar>
      <div style="height: 160px;"></div>
      <div class="init_typeBox">
        <inputField @reqResponse="reqResponse" />
      </div>
      <footer>
        <img src="@/assets/images/logo.png" />
        <div>齐光同辰企业AI知识库</div>
      </footer>
    </div>
    <div
      v-show="sessionType === 'assign' || sessionType === 'random'"
      class="assign"
    >
      <div class="title" v-show="sessionType === 'assign'">
        {{ knowledgeStore.currentBase }}
      </div>
      <el-divider class="divider" v-show="sessionType === 'assign'" />
      <el-scrollbar
        :class="[
          'messageBox',
          sessionType === 'assign' ? 'assign_scrollbar' : '',
        ]"
        ref="scrollbarRef"
      >
        <Message :messageList="currentMessageList" />
      </el-scrollbar>
      <div class="assign_typeBox">
        <inputField @reqResponse="reqResponse" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, h, defineComponent, PropType, nextTick } from "vue";
import inputField from "./inputField.vue";
import ourRound from "./ourRound.vue";
import oppositeRound from "./oppositeRound.vue";
import { storeToRefs } from "pinia";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import { getHistoricMessage, getAIResponse } from "@/config/api.ts";
import { getHour } from "@/utils/tool";
import type { ElScrollbar } from "element-plus";
import { ElMessage } from "element-plus";

const knowledgeStore = useKnowledgeStore();
const { sessionType, currentBase } = storeToRefs(knowledgeStore);
const currentMessageList = ref();

watch(
  currentBase,
    (newVal, oldVal) => {
    getDefaultMessage();
  },
  { immediate: true }
);

function getDefaultMessage() {
    console.log(currentBase.value)
  getHistoricMessage(currentBase.value)
    .then((res) => {
      currentMessageList.value = res.data.data.map((item) => {
        item.bot_response = item.bot_response.replace(/\n/g, "<br />");
        return {
          ...item,
          timestamp: getHour(item.timestamp),
        };
      });
      sessionType.value === "assign"
        ? (knowledgeStore.messageList = currentMessageList.value)
        : (knowledgeStore.randomMessageList = currentMessageList.value);
      scrollToBottom();
    })
    .catch(() => {});
}

const functionItems = [
  {
    icon: "/src/assets/images/photo.svg",
    text: "照片生成",
    bgColor: "rgba(239, 231, 246, 1)",
  },
  {
    icon: "/src/assets/images/vedio.svg",
    text: "视频生成",
    bgColor: "rgba(220, 237, 229, 1)",
  },
  {
    icon: "/src/assets/images/jiangbei.svg",
    text: "教育与科学",
    bgColor: "rgba(242, 229, 238, 1)",
  },
  {
    icon: "/src/assets/images/code.svg",
    text: "ctrl+1代码生成",
    bgColor: "rgba(233, 233, 246, 1)",
  },
  {
    icon: "/src/assets/images/audio.svg",
    text: "语音工具",
    bgColor: "rgba(225, 235, 244, 1)",
  },
  {
    icon: "/src/assets/images/txt.svg",
    text: "文本识别",
    bgColor: "rgba(241, 231, 229, 1)",
  },
];

function dealAffair(item: any, i: number) {
  knowledgeStore.menuData.flag = true;
  knowledgeStore.menuData.index = `${++i}`;
  knowledgeStore.sessionType = "assign";
  knowledgeStore.currentBase = item.name;
}

const scrollbarRef = ref(null) as unknown as typeof ElScrollbar;

function scrollToBottom() {
  nextTick(() => {
    scrollbarRef.value.setScrollTop(scrollbarRef.value.wrapRef.scrollHeight);
  });
}

function reqResponse() {
  getAIResponse({
    user_input: knowledgeStore.currentReq,
    kb_name: knowledgeStore.currentBase,
  })
    .then((res) => {
      if (res.data.code === 1000) {
        let reqItems;
        if (knowledgeStore.sessionType === "assign") {
          reqItems = knowledgeStore.messageList.filter(
            (item) => item.type === "req"
          );
        } else {
          reqItems = knowledgeStore.randomMessageList.filter(
            (item) => item.type === "req"
          );
        }
        reqItems.forEach((w) => {
          delete w.type;
          w.bot_response = res.data.data.response.replace(/\n/g, "<br />");
          w.id = res.data.data.message_id;
        });
        scrollToBottom();
      } else {
        ElMessage({
          type: "error",
          message: res.data.msg,
        });
      }
    })
    .catch((err) => {
      ElMessage({
        type: "error",
        message: "请先登录或联系管理员",
      });
    });
  scrollToBottom();
}

const Message = defineComponent({
  name: "Message",
  props: {
    messageList: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  render() {
    const children = [];
    // 使用 for 循环来生成多个虚拟节点
    for (let i = 0; i < this.messageList?.length; i++) {
      const item = this.messageList[i];
      if (!item.type) {
        children.push(
          h(
            "div",
            { class: "ourRound", key: `ourRound-${i}` },
            h(ourRound, { content: item })
          ),
          h(
            "div",
            { class: "oppositeRound", key: `oppositeRound-${i}` },
            h(oppositeRound, { content: item, loc: i })
          )
        );
      } else {
        children.push(
          h(
            "div",
            { class: "ourRound", key: `ourRound-${i}` },
            h(ourRound, { content: item })
          ),
          h(
            "div",
            { class: "oppositeRound", key: `ourRound-${i}` },
            h(oppositeRound, { content: item, loc: i })
          )
        );
      }
    }
    return h("div", children);
  },
});
</script>
<style scoped lang="less">
.interflow_con {
  width: 100%;
  border-radius: 0.93vw;
  background: rgba(255, 255, 255, 1);
  height: 100%;
  padding: 0px 19px;
  box-sizing: border-box;
  overflow: auto;

  .introduction {
    background: url("@/assets/images/introduction.png");
    background-size: cover;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    .cricle {
      width: 151px;
      height: 151px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
      margin: 118px auto 37px;
      border-radius: 50%;
    }

    .title {
      font-size: 43px;
      color: rgba(14, 14, 16, 1);
      margin: 0px auto;
      text-align: center;
    }

    .desc {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.45vw;
      color: rgba(153, 153, 153, 1);
      margin-top: 21.5px;
      text-align: center;
      width: 844px;
    }
  }

  .functionItems {
    height: calc(100vh - 619px);
    padding-right: 20px;

    .items_level {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;

      & > div {
        cursor: pointer;
        width: 325px;
        margin-right: 14px;
        height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 17px;
        background: rgba(246, 246, 248, 1);
        border: 1px solid rgba(226, 226, 226, 1);
        font-size: 16px;

        & > .imgCon {
          width: 69px;
          height: 67px;
          border-radius: 12px;
          margin-bottom: 19.5px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(241, 231, 229, 1);

          & > img {
            width: 35px;
            height: 30px;
          }
        }
      }

      & > div:last-child {
        margin-right: auto;
      }
    }
  }

  footer {
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    display: flex;
    width: 260px;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 10px;
  }

  .init {
    position: relative;

    .init_typeBox {
      position: absolute;
      bottom: 79px;
      left: 0;
      right: 0;
      margin: auto;
    }
  }

  .assign {
    padding: 28.5px 13px 33px;
    box-sizing: border-box;

    .title {
      height: 25px;
      font-size: 24px;
      font-weight: 700;
      color: rgba(51, 51, 51, 1);
    }

    .divider {
      width: calc(100% + 53px);
      margin-left: -40px;
    }

    .messageBox {
      height: calc(100vh - 215px);
      margin-bottom: 23px;
      padding-right: 27px;
    }

    .assign_scrollbar {
      height: calc(100vh - 289px);
    }

    .assign_typeBox {
      height: 58px;
      padding-right: 27px;
    }
  }
}

:deep(.ourRound),
:deep(.oppositeRound) {
  overflow: hidden;
  margin-bottom: 23px;
}

:deep(.ourRound) {
  .ourRound_con {
    float: right;
  }
}

:deep(.oppositeRound) {
  .oppositeRound_con {
    float: left;
  }
}

.type-list {
  flex-wrap: wrap;
}

.type-list-item {
  margin: 7px;
  width: 320px;
  border-radius: 17px;
  opacity: 1;

  background: #f6f6f8;

  box-sizing: border-box;
  border: 1px dashed #e2e2e2;

  .img-div {
    width: 69px;
    height: 67px;
    margin-top: 26px;
    border-radius: 12px;
    opacity: 1;
    margin-bottom: 20px;
  }

  img {
    width: 25.85px;
    height: 23.27px;
  }
  .text {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
