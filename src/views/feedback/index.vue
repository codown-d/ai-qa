<template>
  <div class="common-page-wrapper">
    <div class="page-title">问题反馈</div>
    <div class="label">请描述您的问题或建议，我们会第一时间反馈</div>
    <textarea class="input-wrapper textarea"
              v-model="feedback.content"
              placeholder="请描述或者在聊天界面点击选择您的问题或建议（不少于10个字）"></textarea>
    <div class="u-flex">
      <div class="label">联系方式</div>
      <input type="text" v-model="feedback.contact" class="input-wrapper input" placeholder="请填写您的手机号或者邮箱">
      <div class="common-form-item u-flex">
        <div class="form-label">类型</div>
        <el-select
                style="--el-select-input-color: #7d4ced"
                v-model="feedback.feedback_type"
                placeholder="Select"
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
      <div class="u-flex-1">
        <div class="btn" @click="save">提交</div>
      </div>
    </div>
    <div class="history-list" v-if="list.length">
      <div class="u-flex">
        <div class="label">反馈历史</div>
        <div class="u-flex common-form">
          <div class="common-form-item u-flex">
            <div class="form-label">类型</div>
            <el-select
                    style="--el-select-input-color: #7d4ced"
                    v-model="queryForm.type"
                    placeholder="请选择"
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
                    :prefix-icon="ArrowDown"
                    v-model="queryForm.date"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="请选择"
            />
          </div>
        </div>
      </div>
      <div class="list-wrapper">
        <div class="item-line" v-for="item in showList">
          <div class="u-flex">
            <div class="list-title">{{ item.feedback_type }}</div>
            <div class="list-time">{{ item.created_at_format }}</div>
          </div>
          <div class="list-content u-line-1">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { allFeedback, addFeedback } from "@/config/feedback"
import { getKnowledgeBase } from "@/config/api"
import { ElMessage } from 'element-plus'
import { timestampFormat } from "@/utils/tool"
import { ArrowDown } from '@element-plus/icons-vue'

const list = ref([])
const feedback = ref({feedback_type: '产品全局'})
const typeData = ref([])
const queryForm = ref({})
const showList = ref([])

const filterList = (newVal) => {
  showList.value = list.value.filter(item => {
    if (newVal.type && item.feedback_type !== newVal.type) {
      return false;
    }

    if (newVal.date && !item.created_at.includes(newVal.date)) {
      return false; // 不匹配，过滤掉
    }

    // 如果没有不匹配的情况，就保留该反馈
    return true;
  })
}

watch(() => queryForm.value, (newVal) => {
  filterList(newVal)
}, {
  immediate: true,
  deep: true
})

const getAllFeedBack = () => {
  allFeedback().then(res => {
    res.data.data = res.data.data.reverse()
    res.data.data.forEach(item => {
      item.created_at_format = timestampFormat(new Date(item.created_at + ':00').getTime())
    })
    list.value = res.data.data
    filterList({})
  })
}

const getTypeData = () => {
  getKnowledgeBase().then(res => {
    typeData.value = [{ name: '产品全局' }, ...res.data.data]
  })
}

getAllFeedBack()
getTypeData()

const save = () => {
  if (!feedback.value.content) {
    return ElMessage({
      message: '请填写您的宝贵建议',
      plain: true,
      type: 'warning'
    })
  }
  if (!feedback.value.contact)  {
    return ElMessage({
      message: '请填写您的联系方式',
      plain: true,
      type: 'warning'
    })
  }
  addFeedback(feedback.value).then(res => {
    ElMessage({
      message: '反馈成功',
      plain: true,
      type: 'success'
    })
    getAllFeedBack()
  })
}
</script>

<style scoped lang="less">
  .common-page-wrapper {
    
    padding: 40px;
    padding-top: 30px;
    height: 100%;
    overflow-y: auto;
    .page-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 48px;
      color: rgba(51, 51, 51, 1);
      border-bottom: 1px solid rgba(224, 224, 224, 1);
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .label {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 45px;
      color: rgba(51, 51, 51, 1);
    }
    .input-wrapper {
      width: 100%;
      border: none;
      border-radius: 20px;
      background: rgba(246, 246, 248, 1);
      margin-top: 15px;
      height: 150px;
      outline: none;
      padding: 30px;
      font-size: 20px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);

    }
    .input {
      width: 30%;
      height: 45px;
      border-radius: 6px;
      padding: 10px;
      margin-top: 0;
      margin-left: 30px;
      margin-right: 30px;
    }
    .textarea {
      margin-bottom: 25px;
    }
    .u-flex-1 {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      text-align: center;
      .btn {
        width: 40%;
        height: 45px;
        line-height: 45px;
        opacity: 1;
        border-radius: 10px;
        background: rgba(125, 76, 237, 1);
        box-shadow: 0px 2px 0px  rgba(57, 11, 160, 0.16);
        transition: all .3s;
        cursor: pointer;
        color: #fff;
        font-size: 25px;
        &:hover {
          background-color: rgba(125, 76, 237, .9);
        }
      }
    }
    .history-list {
      margin-top: 40px;
      .label {
        color: rgba(125, 76, 237, 1);
        margin-right: 30px;
      }
      .common-form {
        flex-wrap: wrap;
        .btn {
          margin-bottom: 30px;
        }
      }
      .list-wrapper {
        .item-line {
          width: 60%;
          .u-flex {
            justify-content: space-between;
          }
          .list-title {
            font-size: 18px;
            font-weight: 500;
            letter-spacing: 0px;
            line-height: 26px;
            color: rgba(51, 51, 51, 1);
          }
          .list-time {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 24px;
            color: rgba(153, 153, 153, 1);
          }
          .list-content {
            color: rgba(102, 102, 102, 1);
            font-size: 18px;
            margin-top: 5px;
          }
          .u-line-1 {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          margin: 30px 0;
        }
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
