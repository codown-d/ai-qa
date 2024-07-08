<template>
  <div class="common-page-wrapper">
    <div class="page-title u-flex u-row-between">
      <div class="text">历史记录</div>
      <div class="u-flex u-row-between" style="width: 70px">
        <el-icon><CollectionTag /></el-icon>
      </div>
    </div>
    <div class="query-wrapper">
      <div class="u-flex common-form">
        <div class="common-form-item u-flex">
          <div class="form-label">类型</div>
          <el-select
                  style="--el-select-input-color: #7d4ced"
                  v-model="queryForm.kb_name"
                  placeholder="请选择"
                  @change="getList"
                  clearable
                  size="large"
          >
            <el-option
                    v-for="(item, index) in typeData"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
            />
          </el-select>
        </div>
        <div class="common-form-item u-flex">
          <div class="form-label">日期</div>
          <el-date-picker
                  @change="getList"
                  :prefix-icon="ArrowDown"
                  v-model="queryForm.month"
                  type="month"
                  format="M月"
                  value-format="M"
                  placeholder="请选择"
                  clearable
          />
        </div>
        <div class="common-form-item u-flex">
          <div class="form-label">搜索</div>
          <input v-model="queryForm.keyword" @change="getList" type="text" class="common-input" placeholder="请输入搜索关键词">
        </div>
      </div>
    </div>
    <el-scrollbar class="history-list" v-if="Object.keys(showList).length">
      <div v-for="(item, key, value) in showList">
        <div class="list-label u-flex baseline">
          <div class="day">{{ key }}</div>
          <div class="date">{{ formatDate(key) }}</div>
        </div>
        <div class="list-wrapper">
          <div class="item-list u-flex cursor-pointer" v-for="i in item" @click="toChat(i)">
            <div class="content u-flex-1">
              <div class="u-flex u-row-between">
                <div class="title u-flex-1 u-line-1">{{ i.kb_name }}</div>
                <div class="action">
                  <span class="itme-list-time">{{ i.timestamp_format }}</span>
                  <el-icon @click.stop="favorite(i)" :class="{'active': favoriteList.includes(i.id)}"><CollectionTag /></el-icon>
                </div>
              </div>
              <div class="desc u-line-1">{{ i.user_question }}</div>
              <div class="desc u-line-1">{{ i.bot_response }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div v-else  class="history-list">
      <el-empty :image-size="200"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { messageHistory, favoritesList, favoritMessage  } from "@/config/history"
import { getKnowledgeBase } from "@/config/api"
import {timestampFormat} from "@/utils/tool"
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useKnowledgeStore } from "@/store/useKnowledgeStore"
import { useRouter } from "vue-router"

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const showList = ref({})
const queryForm = ref({})
const favoriteList = ref([])
const typeData = ref([])

const getTypeData = () => {
  getKnowledgeBase().then(res => {
    typeData.value = [...res.data.data]
  })
}

const formatDate = (bool, date=new Date()) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const qiantian = new Date(yesterday)
  qiantian.setDate(yesterday.getDate() - 1);

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  if (bool == '今天') return pad(date.getMonth() + 1) + '月' + pad(date.getDate()) + '日'
  if (bool == '昨天') return pad(yesterday.getMonth() + 1) + '月' + pad(yesterday.getDate()) + '日'
  if (bool == '前天') return pad(qiantian.getMonth() + 1) + '月' + pad(qiantian.getDate()) + '日'
  if (!bool) {
    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    } else if (date.toDateString() === qiantian.toDateString()) {
      return '前天'
    } else {
      return '三天前'
    }
  } else {
    return ''
  }
}

const getList = () => {
  showList.value = {}
  messageHistory(queryForm.value).then(res => {
    let data = res.data.data?.reverse()
    data.forEach(item => {
      item.timestamp_format = timestampFormat(new Date(item.timestamp).getTime())
      item.timestamp_format2 = formatDate(false, new Date(item.timestamp))
    })

    let obj = {}
    data.forEach(item => {
      if (!obj[item.timestamp_format2]) {
        obj[item.timestamp_format2] = []
      }
      obj[item.timestamp_format2].push(item)
    })
    showList.value = obj
  })
}

const getFavoriteData = () => {
  favoritesList().then(res => {
    favoriteList.value = res.data.data.map(item => item.id)
  })
}

getList()
getFavoriteData()
getTypeData()

const favorite = (item) => {
  favoritMessage(item.id, favoriteList.value.includes(item.id) ? 0 : 1).then(res => {
    getFavoriteData()
    ElMessage({
      message: favoriteList.value.includes(item.id) ? '取消收藏成功' : '收藏成功',
      plain: true,
      type: 'info',
      offset: 400
    })
  })
}

const toChat = (item) => {
  router.push({
    path: '/',
    query: item
  })
}
</script>

<style scoped lang="less">
  .common-page-wrapper {
    
    padding: 40px;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    height: 100%;
    .page-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 48px;
      color: rgba(51, 51, 51, 1);
      border-bottom: 1px solid rgba(224, 224, 224, 1);
      padding-bottom: 15px;
      margin-bottom: 25px;
      .u-flex {
        cursor: pointer;
      }
    }
    .query-wrapper {
      padding-bottom: 20px;
    }
  }
  .common-form {
    flex-wrap: wrap;
    .btn {
      margin-bottom: 30px;
    }
  }
  .common-form-item {
    white-space: nowrap;
    border-radius: 8px;
    background: rgba(246, 246, 248, 1);
    box-shadow: 0px 1px 0px  rgba(201, 194, 210, 1);
    padding-left: 19px;
    padding-right: 19px;
    margin-right: 12px;
    &:first-of-type {
      margin-left: 0;
    }
    min-height: 44px;
    .form-label {
      color: rgba(102, 102, 102, 1);
      font-size: 16px;
    }
    .common-input {
      border: none;
      outline: none;
      min-height: 44px;
      background: transparent;
      color: rgba(51, 51, 51, 1);
      text-align: center;
      width: 158px;
    }
    :deep(.el-select) {
      .el-select__wrapper {
        width: 158px;
        // padding: 0;
        text-align: right;
        min-height: 44px;
        box-shadow: none;
        background: transparent;
      }
    }
  }
  .history-list {
    width: 100%;
    padding-right: 30%;
    flex: 1;
    overflow: hidden;
    .list-label {
      margin-top: 40px;
      .day {
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0px;
        color: rgba(51, 51, 51, 1);
        margin-right: 8px;
      }
      .date {
        color: rgba(153, 153, 153, 1);
        font-weight: 500;
        font-size: 16px;
      }
    }
    .list-wrapper {
      .item-list {
        margin: 20px 0;
        .content {
          font-size: 16px;
          .title {
            color: rgba(51, 51, 51, 1);
          }
          .desc {
            line-height: 30px;
            margin-top: 5px;
            width: calc(100% - 70px);
            color: rgba(153, 153, 153, 1);
          }
        }
        .action {
          color: rgba(153, 153, 153, 1);
        }
        .el-icon {
          color: rgba(0, 0, 0, 1);
          font-size: 22px;
          margin-left: 20px;
          cursor: pointer;
        }
        .active {
          color: #FDB52D;
        }
      }
      .avatar {
        width: 66px;
        height: 66px;
        border-radius: 100%;
        position: relative;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
        }
        .status {
          width: 12px;
          height: 12px;
          border-radius: 100%;
          background: rgba(192, 144, 108, 1);
          position: absolute;
          z-index: 10;
          right: 3px;
          bottom: 3px;
          border: 2px solid #fff;
        }
      }
    }
  }
  :deep(.el-date-editor) {
    .el-input__wrapper {
      background-color: transparent;
      box-shadow: none;
      flex-direction: row-reverse;
    }
    .el-input__inner {
      text-align: right;
    }
    .el-input__prefix {
      // display: none;
      margin-left: 10px;
    }
  }
</style>
