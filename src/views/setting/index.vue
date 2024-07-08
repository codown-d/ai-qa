<template>
  <div class="common-page-wrapper">
    <div class="page-title u-flex u-row-between">
      <div class="text">账户信息</div>
    </div>
    <div class="item">
      <div class="item-label u-flex u-row-between">
        <div>用户名</div>
        <div class="cursor-pointer update-pwd" @click="logout">退出登录</div>
      </div>
      <div class="item-value">{{ userInfo.username || '--' }}</div>
    </div>
    <div class="item">
      <div class="item-label">账号</div>
      <div class="item-value">{{ userInfo.email || '--' }}</div>
    </div>
    <div class="item">
      <div class="item-label u-flex u-row-between">
        <div>密码</div>
        <div class="cursor-pointer update-pwd" @click="changePwd">修改密码</div>
      </div>
    </div>
    <div class="item">
      <div class="item-label">所属企业</div>
      <div class="item-value">{{ userInfo.company || '--' }}</div>
    </div>
    <div class="item" style="pointer-events: none">
      <div class="item-label">状态</div>
      <div class="item-value">
        <el-radio-group v-model="userInfo.role" style="--el-color-primary: rgb(126,76,225)">
          <el-radio value="user">企业员工</el-radio>
          <el-radio value="admin">企业管理员</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="item">
      <div class="item-label u-flex" style="align-items: flex-start;justify-content: space-between">
        <div>修改头像</div>
        <el-upload
                class="avatar-uploader"
                :action="`${baseUrl}/user/profile`"
                :headers="{Authorization: getToken()}"
                ref="uplaodRefs"
                :limit="1"
                :auto-upload="true"
                :show-file-list="false"
                :on-success="saveSuccess"
        >
          <div class="upload-wrapper">
            <img v-if="userInfo.avatar_url" :src="`${userInfo.avatar_url}`" class="avatar" />
            <div v-else style="text-align: center">
              <el-icon><Avatar /></el-icon>
              <div class="tips">上传头像</div>
            </div>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { getInfo } from "@/config/user"
  import { useRouter } from 'vue-router'
  import { getToken } from "@/utils/tool"
  import {useKnowledgeStore} from "@/store/useKnowledgeStore"

  const baseUrl = import.meta.env.VITE_BASE_URL
  const router = useRouter()
  const userInfo = ref({})
  const knowledgeStore = useKnowledgeStore()
  const uplaodRefs = ref('')

  const getUserInfo = () => {
    getInfo().then(res => {
      userInfo.value = res.data.data
      knowledgeStore.userInfo = res.data.data
      knowledgeStore.userInfo.avatar_url = `${import.meta.env.VITE_BASE_URL}${res.data.data.avatar_url}`
    })
  }

  getUserInfo()

  const changePwd = () => {
    router.push({
      path: '/login',
      query: {
        email: userInfo.value.email
      }
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push({
      path: 'login'
    })
  }

  const saveSuccess = () => {
    uplaodRefs.value.clearFiles()
    getUserInfo()
  }
</script>

<style scoped lang="less">
  .common-page-wrapper {
    
    padding: 40px;
    padding-top: 30px;
    .page-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 48px;
      color: rgba(51, 51, 51, 1);
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .item {
      padding: 20px 35px;
      border-radius: 8px;
      border: 1px solid rgba(226, 226, 226, 1);
      margin-bottom: 22px;
      .item-label {
        font-size: 20px;
        font-weight: 500;
        .update-pwd {
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 26px;
          text-decoration-line: underline;
          color: rgba(125, 76, 237, 1);
          text-align: center;
        }
      }
      .item-value {
        color: rgba(102, 102, 102, 1);
        font-size: 16px;
        margin-top: 12px;
      }
    }
  }

  .upload-wrapper {
    width: 112px;
    height: 112px;
    opacity: 1;
    border-radius: 100%;
    background: rgba(248, 249, 251, 1);
    border: 1px solid rgba(233, 234, 238, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
    overflow: hidden;
    img {
      // width: 100%;
      height: 100%;
    }
    .el-icon {
      color: rgba(219, 219, 219, 1);
      font-size: 45px;
      margin-bottom: 5px;
    }
  }
</style>
