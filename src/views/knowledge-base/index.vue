<template>
  <div class="common-page-wrapper">
    <div class="form-item u-flex">
      <div class="form-label">知识库名称</div>
      <div class="u-flex">
        <input type="text" placeholder="请输入知识库名称" v-model="feedback.name" class="common-input">
        <div class="u-flex edit-btn" @click="saveName">
          <el-icon><EditPen /></el-icon>
          <div>修改</div>
        </div>
      </div>
    </div>
    <div class="form-item u-flex">
      <div class="form-label">上传数据</div>
      <div class="form-item-content">
        <el-upload
                class="avatar-uploader"
                :action="`${baseUrl}/kb/${route.query.name}`"
                :headers="{Authorization: getToken()}"
                ref="upload"
                :limit="1"
                :data="feedback"
                method="put"
                :auto-upload="false"
                :show-file-list="true"
                :on-success="saveSuccess"
                :on-error="onError"
                v-model:file-list="fileList"
        >
          <div class="upload-wrapper">
            <el-icon><FolderOpened /></el-icon>
            <div class="tips">上传数据</div>
          </div>
        </el-upload>
        <div class="tips upload-tips">*请上传经过专业数据整理后的文件，确保数据准确性</div>
        <div class="btn" @click="save">上传数据</div>
      </div>
    </div>
    <div class="form-item u-flex">
      <div class="form-label">添加问答对</div>
      <div class="form-item-content">
        <div style="margin-bottom: 10px">问：<input type="text" v-model="feedback.question" placeholder="请输入" class="common-input common-input-long"></div>
        <div class="u-flex">答：<input type="text" placeholder="请输入" v-model="feedback.answer" class="common-input common-input-long">
          <div class="btn" @click="saveWenda">确认添加</div>
        </div>
      </div>
    </div>
    <div class="form-item u-flex">
      <div class="form-label">修改问答对</div>
      <div class="form-item-content">
        <div class="u-flex search-input-wrapper">
          <el-autocomplete
                  value-key="question"
                  v-model="quetions"
                  @select="selectItem"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入问答对"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #default="{ item }">
              <div class="item-link">
                <div class="item-question">{{ item.question }}</div>
                <span class="item-answer">{{ item.answer }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div style="margin-bottom: 10px">问：<input type="text" placeholder="请输入" v-model="newQuestion.question" class="common-input common-input-long"></div>
        <div class="u-flex">答：<input type="text" placeholder="请输入" v-model="newQuestion.answer" class="common-input common-input-long">
          <div class="btn" style="margin-right: 20px" @click="saveQuestion">保存修改</div>
          <div class="btn cancel-btn">取消修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { searchQuestion, updateKnowledgeBase, updateQuestion, rename } from "@/config/api";
  import {ElMessage} from 'element-plus'
  import { useKnowledgeStore } from "@/store/useKnowledgeStore.ts"
  import { getToken } from "@/utils/tool"

  const route = useRoute()
  const router = useRouter()
  const feedback = ref({})
  const upload = ref(null)
  const baseUrl = import.meta.env.VITE_BASE_URL
  const fileList = ref([])
  const nowledgeStore = useKnowledgeStore()
  // 问答对
  const quetions = ref('')
  const newQuestion = ref({})

  feedback.value.name = route.query.name

  watch(() => route.query, (newval) => {
    feedback.value.name = newval.name
  })

  const saveWenda = () => {
    if (!feedback.value.question || !feedback.value.answer)  {
      return ElMessage({
        message: '请完善问答对',
        plain: true,
        type: 'warning'
      })
    }
    updateKnowledgeBase(route.query.name, {
      question: feedback.value.question,
      answer: feedback.value.answer
    }).then(res => {
      saveSuccess()
    })
  }

  const save = () => {
    if (!fileList.value.length) {
      return ElMessage({
        message: '请选择需要上传的文件',
        plain: true,
        type: 'warning'
      })
    }
    upload.value.submit()
  }

  const saveName = () => {
    if (!feedback.value.name)  {
      return ElMessage({
        message: '请输入知识库名称',
        plain: true,
        type: 'warning'
      })
    }
    rename(route.query.name, {
      new_name: feedback.value.name
    }).then(res => {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      router.push({
        path: route.path,
        query: {
          name: feedback.value.name
        }
      })
      nowledgeStore.updateKnowledgeList()
    })
  }

  const saveSuccess = () => {
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    fileList.value = []
    feedback.value = {
      name: route.query.name
    }
  }

  const onError = () => {
    ElMessage({
      message: '创建知识库出错了，请稍后再试',
      type: 'warning'
    })
    feedback.value = {}
  }

  const querySearchAsync = (queryString: string, cb) => {
    searchQuestion({
      name: feedback.value.name,
      query: queryString,
      n_results: 5
    }).then(res => {
      cb(res.data.data?.results)
    })
  }

  const selectItem = item => {
    newQuestion.value = item
  }

  const saveQuestion = () => {
    updateQuestion({
      knowledge_base_name: feedback.value.name,
      uuid: newQuestion.value.id,
      new_question: newQuestion.value.question,
      new_answer: newQuestion.value.answer
    }).then(res => {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
    })
  }
</script>

<style scoped lang="less">
  .common-page-wrapper {
    
    padding: 40px;
    padding-top: 30px;
    background: #fff;
    .form-item {
      margin-bottom: 40px;
      align-items: flex-start;
      color: rgba(102, 102, 102, 1);
      .form-label {
        width: 140px;
        font-size: 18px;
        padding-top: 8px;
      }
      .common-input {
        padding: 5px 15px;
        height: 40px;
        border-radius: 10px;
        background: rgba(246, 246, 248, 1);
        border: 1px solid rgba(233, 234, 238, 1);
        margin-right: 20px;
        width: 300px;
        outline: none;
      }
      .common-input-long {
        width: 400px;
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
      .edit-btn {
        color: rgba(125, 76, 237, 1);
        font-size: 16px;
        cursor: pointer;
      }
      .tips {
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
      }
      .upload-tips {
        margin-top: 18px;
        margin-bottom: 18px;
      }
      .btn {
        width: 110px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
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
      .cancel-btn {
        background: rgba(242, 242, 242, 1);
        box-shadow: none;
        color: rgba(51, 51, 51, 1);
        height: 41px;
        &:hover {
          background: rgba(242, 242, 242, .8);
        }
      }
      .search-input-wrapper {
        margin-bottom: 10px;
        position: relative;
        .el-icon {
          position: absolute;
          left: 20px;
          top: 14px;
          color: rgba(196, 196, 196, 1);
        }
        .common-input {
          text-indent: 20px;
        }
      }
    }
  }
  :deep(.el-input__wrapper) {
    box-shadow: none;
    .el-input__inner {
      padding: 5px 15px;
      height: 40px;
      border-radius: 10px;
      background: rgba(246, 246, 248, 1);
      border: 1px solid rgba(233, 234, 238, 1);
      margin-right: 20px;
      width: 300px;
      outline: none;
      text-indent: 10px;
    }
  }
  .item-link {
    margin-bottom: 10px;
  }
  .item-question {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 21px;
    color: rgba(51, 51, 51, 1);

  }
  .item-answer {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
    margin-top: 5px;
  }
</style>
