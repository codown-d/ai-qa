<template>
  <div class="translate-page">
    <div class="common-wrapper">
      <div class="title">新建企业知识库</div>
      <div class="form-wrapper">
        <div class="item-form-item u-flex">
          <div class="label">知识库名称</div>
          <div class="item-form-content">
            <input type="text" v-model="feedback.name" placeholder="知识库名称" style="width: 100%">
          </div>
        </div>
        <div class="item-form-item u-flex" style="align-items: baseline">
          <div class="label">添加问答对</div>
          <div style="color: rgba(102, 102, 102, 1)" class="item-form-content">
            <div class="u-flex" style="margin-bottom: 10px">问：<input type="text" class="u-flex-1"
                                                                      v-model="feedback.question" placeholder="请输入">
            </div>
            <div class="u-flex">答：<input type="text" v-model="feedback.answer" class="u-flex-1" placeholder="请输入">
            </div>
          </div>
        </div>
        <div class="item-form-item u-flex" style="align-items: flex-start">
          <div class="label">上传数据</div>
          <div>
            <el-upload
                class="avatar-uploader"
                :action="`${baseUrl}/kb/`"
                :headers="{Authorization: getToken()}"
                ref="upload"
                :limit="1"
                :data="feedback"
                :auto-upload="false"
                :show-file-list="true"
                :on-success="saveSuccess"
                :on-error="onError"
                :file-list="fileList"
            >
              <div class="upload-wrapper">
                <el-icon>
                  <FolderOpened/>
                </el-icon>
                <div class="tips">上传数据</div>
              </div>
            </el-upload>
            <div class="tips">*请上传经过专业数据整理后的文件，确保数据准确性</div>
          </div>
        </div>
        <div class="item-form-item u-flex">
          <div class="label"></div>
          <div class="item-form-content">
            <el-button size="large" style="width: 150px;border-radius: 8px;margin-top: 50px" :loading="isLoading" @click="save" color="#7e4ce1">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {setKnowledgeBase} from "@/config/api";
import { useKnowledgeStore } from "@/store/useKnowledgeStore.ts"
import { getToken } from "@/utils/tool"

const router = useRouter()
const feedback = ref({})
const upload = ref(null)
const baseUrl = import.meta.env.VITE_BASE_URL
const isLoading = ref(false)
const fileList = ref([])
const nowledgeStore = useKnowledgeStore()

const save = () => {
  if (!feedback.value.name) {
    return ElMessage({
      message: '请填写知识库名称',
      plain: true,
      type: 'warning'
    })
  }
  if ((feedback.value.question && !feedback.value.answer) || (!feedback.value.question && feedback.value.answer)) {
    return ElMessage({
      message: '请完善问答对',
      plain: true,
      type: 'warning'
    })
  }
  isLoading.value = true
  if (fileList.value.length) {
    upload.value.submit()
  } else {
    setKnowledgeBase(feedback.value).then(res => {
      saveSuccess()
    })
  }
}

const saveSuccess = () => {
  isLoading.value = false
  ElMessage({
    message: '创建知识库成功',
    type: 'success'
  })
  feedback.value = {}
  nowledgeStore.updateKnowledgeList()
}

const onError = () => {
  isLoading.value = false
  ElMessage({
    message: '创建知识库出错了，请稍后再试',
    type: 'warning'
  })
  feedback.value = {}
}
</script>

<style scoped lang="less">
.translate-page {
  width: 70%;
  background: rgba(255, 255, 255, 1);
  padding-top: 40px;
  padding-left: 40px;
  padding-bottom: 40px;
  border-radius: 0.93vw;
  height: 100%;

  .title {
    font-size: 28px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 50px;
  }
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
      width: 150px;
    }

    input {
      background: rgba(248, 249, 251, 1);
      height: 48px;
      text-indent: 20px;
      border: 1px solid rgba(233, 234, 238, 1);
      outline: none;
      color: rgba(153, 153, 153, 1);
      font-size: 18px;
      border-radius: 10px;
    }

    .item-form-content {
      width: 600px;
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
  box-shadow: 0px 2px 0px rgba(57, 11, 160, 1);
  transition: all .3s;

  &:hover {
    background-color: rgba(125, 76, 237, .9);
  }
}

.tips {
  margin-top: 15px;
  color: rgba(102, 102, 102, 1);
  font-size: 18px;
}

.upload-wrapper {
  width: 142px;
  height: 132px;
  opacity: 1;
  border-radius: 10px;
  background: rgba(248, 249, 251, 1);
  border: 1px solid rgba(233, 234, 238, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-icon {
    color: rgba(219, 219, 219, 1);
    font-size: 45px;
    margin-bottom: 5px;
  }
}
</style>
