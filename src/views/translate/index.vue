<template>
  <div class="translate-page">
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      style="padding-bottom: 10px;max-width: 1100px;" 
    >
      <el-tab-pane label="文本翻译" name="text">
        <div class="common-wrapper">
          <div class="u-flex common-form">
            <div class="common-form-item u-flex">
              <div class="label">生成语言</div>
              <el-select v-model="currenLng" placeholder="请选择" size="large">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
            <div class="btn common-btn" @click="transitionAction">生成</div>
          </div>
          <div class="translate-cont" style="width: 1100px">
            <el-input
              @change="translateRes = ''"
              v-model="context"
              :autosize="{ minRows: 8 }"
              type="textarea"
              style="font-size: 20px;"
              class="translate-input"
              placeholder="请将您需要翻译或调整的原文粘贴在此处"
            />
            <div
              class="response"
              v-loading="isTranslating"
              v-if="translateRes || isTranslating"
              element-loading-background="translate"
              element-loading-text="翻译中"
              style="--el-color-primary: rgb(126, 76, 225)"
            >
              <div v-html="translateRes"></div>
              <div class="plain-btn" @click="copy(translateRes)">一键复制</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="邮件格式" name="email" style="border: 0px">
        <div class="common-wrapper">
          <div class="u-flex common-form">

            <div class="common-form-item u-flex">
              <div class="label">生成语言</div>
              <el-select
                v-model="emailReq.language"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
            <div class="common-form-item u-flex">
              <div class="label">姓名</div>
              <input
                type="text"
                v-model="emailReq.receiver_name"
                placeholder="请输入"
                class="common-input"
              />
            </div>
            <div class="common-form-item u-flex">
              <div class="label">职称</div>
              <input
                type="text"
                v-model="emailReq.receiver_title"
                class="common-input"
                placeholder="请输入"
              />
            </div>
            <div class="common-form-item u-flex">
              <div class="label">公司名称</div>
              <input
                type="text"
                v-model="emailReq.receiver_company"
                class="common-input"
                placeholder="请输入"
              />
            </div>
            <div class="common-form-item u-flex">
              <div class="label">您的姓名</div>
              <input
                type="text"
                v-model="emailReq.sender_name"
                placeholder="请输入"
                class="common-input"
              />
            </div>
            <div class="common-form-item u-flex">
              <div class="label">您的职称</div>
              <input
                type="text"
                v-model="emailReq.sender_title"
                class="common-input"
                placeholder="请输入"
              />
            </div>
            <div class="common-form-item u-flex">
              <div class="label">您的公司名称</div>
              <input
                type="text"
                v-model="emailReq.sender_company"
                class="common-input"
                placeholder="请输入"
              />
            </div>
            <div class="btn common-btn" @click="makeEmail">生成</div>
          </div>
          <div class="translate-cont" style="width: 1100px">
            <el-input
                @change="emailRes = ''"
              v-model="emailReq.context"
              :autosize="{ minRows: 8 }"
              type="textarea"
              style="font-size: 20px;"
              class="translate-input"
              placeholder="请将您需要翻译或调整的原文粘贴在此处"
            />
            <!-- v-if="translateRes || isTranslating" -->
            <div
              class="response"
              v-loading="isEmail"
              v-if="emailRes || isEmail"
              element-loading-background="translate"
              element-loading-text="生成中，请稍后"
              style="--el-color-primary: rgb(126, 76, 225)"
            >
            <div v-html="emailRes"></div>
            <div class="plain-btn" @click="copy(emailRes)">一键复制</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <feed-back />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import feedBack from "@/components/feedback/index.vue";
import { getLngs, translation, emailFormat } from "@/config/translation";
import { copyEvent } from "@/utils/tool";
import { ElMessage } from "element-plus";

const currenLng = ref("");
const context = ref("");
const options = ref<string>([]);
const translateRes = ref("");
const isTranslating = ref(false);
const isEmail = ref(false);
let labelObj={
    language:'',
    receiver_name: '',
    receiver_title: "",
    receiver_company:"",
    sender_name: '',
    sender_title: "",
    sender_company:'',
    context: '',
}
const emailReq = ref({
    language:'',
    receiver_name: '',
    receiver_title: "",
    receiver_company:"",
    sender_name: '',
    sender_title: "",
    sender_company:'',
    context: '',
});
const emailRes = ref("");
const activeName = ref("text");

const handleClick = () => {};
const getLanguages = () => {
  getLngs().then((res: any) => {
    if (res.data.code === 1000) {
      const { languages } = res.data.data;
      options.value = languages;
      currenLng.value = languages[0];
    }
  });
};
getLanguages();

const transitionAction = () => {
  if (!context.value) {
    return ElMessage({
      message: "请输入需要翻译的原文",
      plain: true,
      type: "warning",
    });
  }
  isTranslating.value = true;
  translation({
    context: context.value,
    language: currenLng.value,
  })
    .then((res) => {
      translateRes.value = res.data.data.response;
      isTranslating.value = false;
    })
    .catch((err) => (isTranslating.value = false));
};

const copy = (content: string) => {
  copyEvent(content);
  ElMessage({
    message: "复制成功",
    plain: true,
    type: "info",
    offset: 400,
  });
};

const makeEmail = () => {
  if (!emailReq.value.receiver_name || !emailReq.value.sender_name) {
    return ElMessage({
      message: "请完善发件人和收件人信息",
      plain: true,
      type: "warning",
    });
  }
  if (!emailReq.value.context) {
    return ElMessage({
      message: "请输入邮件内容",
      plain: true,
      type: "warning",
    });
  }
  isEmail.value = true;
  emailFormat(emailReq.value)
    .then((res) => {
      emailRes.value = res.data.data.response;
      isEmail.value = false;
    })
    .catch((err) => (isEmail.value = false));
};
</script>
<style lang="less">
.translate-page {

  .translate-cont {
    border-radius: 14px;
    border: 1px solid #d6d6d6;
    overflow: hidden;
    .translate-input {
      .el-textarea__inner {
        box-shadow: none;
        padding: 38px;
        &:hover {
          box-shadow: none;
        }
      }
    }
  }
}
</style>
<style scoped lang="less">
::-webkit-scrollbar {
  display: none;
}

.translate-page {
  width: 82%;
  background: rgba(255, 255, 255, 1);
  padding-top: 40px;
  padding-left: 40px;
  padding-bottom: 40px;
  border-radius: 0.93vw;
  height: 100%;
  overflow: scroll;

  .title {
    font-size: 28px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 36px;
  }
}

.common-wrapper {
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
    margin-bottom: 30px;
    padding-right: 19px;
    margin-right: 12px;

    &:first-of-type {
      margin-left: 0;
    }

    min-height: 44px;

    .label {
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

  .btn {
    width: 140px;
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
    transition: all 0.3s;

    &:hover {
      background-color: rgba(125, 76, 237, 0.9);
    }
  }

  .response {
    width: 100%;
    background: rgba(246, 246, 248, 1);
    padding: 25px 30px;
    font-size: 18px;
    height: 300px;
    color: rgba(51, 51, 51, 1);
    white-space: pre-wrap;
    position: relative;

    .plain-btn {
        position: absolute;
      width: 90px;
      height: 34px;
      opacity: 1;
      border-radius: 6px;
      background: rgba(240, 234, 255, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(125, 76, 237, 1);
      font-size: 16px;
      cursor: pointer;
      user-select: none;
      margin-top: 20px;
      bottom: 38px;
      right: 38px;
    }
  }
}
</style>
