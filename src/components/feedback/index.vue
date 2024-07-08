<template>
  <el-dialog
          v-model="dialogVisible"
          width="35.41%"
          modal-class="custom-modal"
          :show-close="false"
  >
    <template #title>
      <div class="custom-title">问题反馈</div>
    </template>
    <div class="form-wrapper">
      <div class="item-form-item">
        <input type="text" class="finger-input" v-model="feedback.content" placeholder="请描述您的问题或建议，我们会第一时间反馈">
        <img src="../../assets/images/finger.png" alt="" class="finger">
      </div>
      <div class="item-form-item">
        <div class="label">联系方式</div>
        <input type="text" v-model="feedback.contact" placeholder="请填写您的手机号或邮箱">
        <div class="feed-history" @click="toFeedBack">反馈历史</div>
      </div>
    </div>
    <template #footer>
      <div class="u-flex">
        <div class="btn" @click="save">提交</div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { addFeedback } from "@/config/feedback"
  import { useKnowledgeStore } from '@/store/useKnowledgeStore'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const knowledgeStore = useKnowledgeStore()
  const dialogVisible = ref(false)
  const feedback = ref({})

  defineExpose({
    init: (feedback_type?: string) => {
      dialogVisible.value = true
      feedback.value.feedback_type = knowledgeStore.currentBase || feedback_type
    }
  })

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
      dialogVisible.value = false
      feedback.value = {}
    })
  }

  const toFeedBack = () => {
    router.push('/feedback')
  }
</script>

<style lang="less">
  .custom-modal {
    .el-dialog {
      border-radius: 14px;
      background: rgba(255, 255, 255, 1);
    }
  }
</style>
<style scoped lang="less">
  .custom-title {
    border-bottom: 1px solid rgba(209, 209, 209, 1);
    // .vwUnit(font-size, 36);
    font-size: 32px;
    
    font-weight: 700;
    color: rgba(51, 51, 51, 1);
    text-indent: 5px;
    padding-bottom: 12px;
  }
  .form-wrapper {
    width: 100%;
    margin: 30px 0;
    margin-top: 10px;
    .item-form-item {
      margin-bottom: 30px;
      position: relative;
      .label {
        font-size: 22px;
        font-weight: 500;
        letter-spacing: 0px;
        line-height: 32px;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 10px;
      }
      input {
        background: rgba(248, 249, 251, 1);
        height: 45px;
        text-indent: 20px;
        border: 1px solid rgba(233, 234, 238, 1);
        width: 100%;
        outline: none;
        color: rgba(153, 153, 153, 1);
        font-size: 18px;
        border-radius: 10px;
      }
      .finger-input {
        text-indent: 50px;
        cursor: pointer;
      }
      .feed-history {
        text-align: right;
        margin-top: 20px;
        color: rgba(125, 76, 237, 1);
        cursor: pointer;
        font-weight: 500;
      }
      .finger {
        position: absolute;
        left: 4px;
        width: 37px;
        top: 4px;
      }
    }
  }
  .btn {
    width: 180px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    color: #fff;
    opacity: 1;
    border-radius: 10px;
    background: rgba(125, 76, 237, 1);
    box-shadow: 0px 2px 0px  rgba(57, 11, 160, 1);
    transition: all .3s;
    &:hover {
      background-color: rgba(125, 76, 237, .9);
    }
  }
</style>
