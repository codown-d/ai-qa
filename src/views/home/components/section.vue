<template>
  <div class="section_con">
    <div class="title">
      <div>历史记录</div>
      <img src="@/assets/images/eye.svg" @click="toHistory"/>
    </div>
    <el-scrollbar class="items_con">
      <div class="item" v-for="(item, index) in records" :key="index" @click="setLocation(item)">
      <div class="item_title">{{ item.kb_name }}</div>
      <div class="item_content">
        {{ shortenString(item.user_question) }}
      </div>
      <!-- <img class="photo" :src="item.content.url" /> -->
      <div class="time">
       <div>{{ getHour(item.timestamp) }}</div>
       <div class="avatars" v-show="false">
        <img src="@/assets/images/zhishi.svg" />
        <img src="@/assets/images/vedio.svg" />
        <img src="@/assets/images/txt.svg" />
       </div>
      </div>
    </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { getMessageRecord } from "@/config/api.ts";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import { ElMessage } from "element-plus";
import { getHour} from "@/utils/tool"
import { nextTick, ref, watch, onUnmounted, onMounted } from 'vue';


const router = useRouter()
const route = useRoute()
const knowledgeStore = useKnowledgeStore();

const toHistory = () => {
  router.push('/history')
}
const records = ref([])

onMounted(() => {
  if(route.query.kb_name) {
    setLocation(route.query)
  }
})

function shortenString(str) {
    if(str.length > 15) {
        return str.slice(0, 15) + "...";
    } else {
        return str;
    }
}

function getRecords(){
  getMessageRecord()
      .then((res) => {
        if (res.data.code === 1000) {
          records.value = res.data.data || []
        } else {
          ElMessage({
      type: 'error',
      message: res.data.msg
    })
        }
        })
      .catch(() => {
        ElMessage({
      type: 'error',
      message: '请先登录或联系管理员'
    })
  });
}
getRecords()

const historical = [
  {
    title: "视频生成",
    content: {
      type: "text",
      text: "像素轮廓列表图线",
    },
    time: "2023-05-20  15:30:29",
  },
  {
    title: "照片生成",
    content: {
      type: "photo",
      text: "像素轮廓列表图线",
      url: "/src/assets/images/place.jpg",
    },
    time: "2023-05-20  15:30:29",
  },
  {
    title: "教育与科学",
    content: {
      type: "text",
      text: "排列文本并集布尔减法",
    },
    time: "2023-05-20  15:30:29",
  },
  {
    title: "视频生成",
    content: {
      type: "text",
      text: "像素轮廓列表图线",
    },
    time: "2023-05-20  15:30:29",
  },
];
let timer: number
function setLocation(item: any){
  if(item.kb_name === 'default') {
    knowledgeStore.sessionType = 'random'
  } else {
    knowledgeStore.sessionType = 'assign'
  }
  knowledgeStore.currentBase = item.kb_name
  timer = setTimeout(() => {
    const el = document.querySelector(`#id${item.id}`)
    el?.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"})
  }, 500)
}

onUnmounted(() => {
  clearTimeout(timer)
})
</script>
<style scoped lang="less">
.section_con {
  width: 100%;
  border-radius: 0.93vw;
  background: rgba(249, 249, 249, 1);
  height: 100%;
  padding: 33.5px 33px;
  box-sizing: border-box;
  .title {
    font-size: 22px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-bottom: 38.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    & > img {
      cursor: pointer;
      width: 18.5px;
      height: 18.5px;
    }
  }
  .items_con {
    height: calc(100% - 62px);
  }
  .item {
    margin-bottom: 41.5px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .item_title {
      font-size: 22px;
      font-weight: 700;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 11px;
    }
    .item_content {
        font-size: 18px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 20px;
      }
      .photo {
        height: 198px;
        border-radius: 15px;
        margin-bottom: 20px;
      }
      .time {
        font-size: 16px;
font-weight: 400;
display: flex;
justify-content: space-between;
align-items: center;
color: rgba(102, 102, 102, 1);
       margin-top: auto;
       & > .avatars {
        display: flex;
        align-items: center;
        & > img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          float: right;
        }
        & > img:not(:last-child) {
          margin-right:-16px;
        }
      }
      }
  }
}
</style>
