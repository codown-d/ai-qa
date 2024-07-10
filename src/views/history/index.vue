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
          <input
            v-model="queryForm.keyword"
            @change="getList"
            type="text"
            class="common-input"
            placeholder="请输入搜索关键词"
          />
        </div>
      </div>
    </div>
    <div class="history-list" v-if="showList.length">
      <div v-for="item in showList" :key="item.time">
        <div
          class="list-label flex-r-c mr14 pb4"
          style="align-items: baseline; justify-content: flex-start"
        >
          <div class="day">
            {{ item.time == $moment().format("M月D日") ? "今天" : item.time }}
          </div>
          <div class="date" v-if="item.time == $moment().format('M月D日')">
            {{ item.time }}
          </div>
        </div>
        <div
          class="list-wrapper pb26 mt36 pl44"
          v-for="ite in item.list"
          @click="toChat(ite)"
        >
          <div class="item-list cursor-p">
            <div class="content">
              <div class="flex-r-c mb6" style="justify-content: space-between">
                <div class="title f18">{{ ite.kb_name }}</div>
                <div class="action flex-r-c">
                  <span class="itme-list-time mr14 f-l">{{
                    ite.timestamp_format1
                  }}</span>
                  <img  v-if='favoriteList.includes(ite.id)' src="../../assets/images/yeqianact.png" alt="" style="width: 20px;">
                  <img v-else src="../../assets/images/yeqian.png" alt="" style="width: 20px;">
                </div>
              </div>
              <div class="desc mb24">{{ ite.user_question }}</div>
              <div class="desc answer">{{ ite.bot_response }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="history-list">
      <el-empty :image-size="200" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { sortBy } from "loadsh";
import { ref } from "vue";
import {
  messageHistory,
  favoritesList,
  favoritMessage,
} from "@/config/history";
import { getKnowledgeBase } from "@/config/api";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showList = ref<any>([]);
const queryForm = ref({});
const favoriteList = ref([]);
const typeData = ref([]);

const getTypeData = () => {
  getKnowledgeBase().then((res) => {
    typeData.value = [...res.data.data];
  });
};

const getList = () => {
  messageHistory(queryForm.value).then((res) => {
    let obj = res.data.data
      .map((item: { [x: string]: string; timestamp: moment.MomentInput }) => {
        let result = moment(item.timestamp).isSame(moment(), "day");
        if (!result) {
          item["timestamp_format"] = moment(item.timestamp).format("MMDD");
          item["timestamp_format1"] = moment(item.timestamp).format("HH:mm");
        } else {
          item["timestamp_format"] = moment(item.timestamp).format("MMDD");
          item["timestamp_format1"] = moment(item.timestamp).fromNow();
        }
        return item;
      })
      .reduce((pre, item) => {
        let key = item.timestamp_format;
        if (pre[key]) {
          pre[key].push(item);
        } else {
          pre[key] = [item];
        }
        pre[key] = sortBy(pre[key], ["user", "age"]);
        return pre;
      }, {});
    showList.value = Object.keys(obj)
      .map((item) => {
        return {
          time: moment(item, "MMDD").format("M月D日"),
          list: obj[item],
          timeStr: item,
        };
      })
      .sort((a, b) => {
        return b.timeStr - a.timeStr;
      });
    console.log(showList.value);
  });
};

const getFavoriteData = () => {
  favoritesList().then((res) => {
    favoriteList.value = res.data.data.map((item: { id: any }) => item.id);
  });
};

getList();
getFavoriteData();
getTypeData();

const favorite = (item: { id: any }) => {
  favoritMessage(item.id, favoriteList.value.includes(item.id) ? 0 : 1).then(
    (res) => {
      getFavoriteData();
      ElMessage({
        message: favoriteList.value.includes(item.id)
          ? "取消收藏成功"
          : "收藏成功",
        plain: true,
        type: "info",
        offset: 400,
      });
    }
  );
};

const toChat = (item: any) => {
  router.push({
    path: "/",
    query: item,
  });
};
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
  box-shadow: 0px 1px 0px rgba(201, 194, 210, 1);
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
  overflow: auto;
  .list-label {
    margin-top: 47px;
    .day {
      font-size: 29px;
      font-weight: 600;
      letter-spacing: 0px;
      color: rgba(51, 51, 51, 1);
      margin-right: 8px;
    }
    .date {
      color: rgba(153, 153, 153, 1);
      font-weight: 500;
      font-size: 22px;
    }
  }
  .list-wrapper {
    border-bottom: 1px solid #e8e8e8;
    .item-list {
      .content {
        .title {
          color: #333333;
          font-size: 18px;
          line-height: 26px;
          position: relative;
          font-weight: 600;
          &::after {
            content: "";
            font-size: 16px;
            background: url("../../assets/images/wen.svg") no-repeat center
              center;
            background-size: cover;
            width: 32px;
            height: 36px;
            position: absolute;
            left: -44px;
            top: 0;
          }
        }
        .desc {
          line-height: 24px;
          font-size: 18px;
          width: calc(100% - 150px);
          color: #999999;
        }
        .answer {
          position: relative;
          &::after {
            content: "";
            font-size: 16px;
            background: url("../../assets/images/answer.svg") no-repeat center
              center;
            background-size: cover;
            width: 32px;
            height: 36px;
            position: absolute;
            left: -44px;
            top: 0;
          }
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
        color: #fdb52d;
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
