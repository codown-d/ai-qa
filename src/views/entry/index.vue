<template>
  <div class="login_con">
    <div class="form">
      <div class="nav">
        <img src="@/assets/images/purple.png" alt="" />
        <div class="logo">LOGO</div>
        <div class="ai">AI</div>
      </div>
      <div class="tab" v-show="currentActiveTab !== 2">
        <div
          :class="['login', currentActiveTab === 0 ? 'active_tab' : '']"
          @click="changeTab(0)"
        >
          登录
        </div>
        <div
          :class="['account', currentActiveTab === 1 ? 'active_tab' : '']"
          @click="changeTab(1)"
        >
          创建账户
        </div>
      </div>
      <div class="reset_password" v-show="currentActiveTab === 2">忘记密码</div>
      <div class="content" v-show="currentActiveTab !== 2">
        <div v-show="currentActiveTab === 1">
          <div>
            <img src="@/assets/images/user.svg" class="user" />
          </div>
          <div>
            <div class="title">用户名</div>
            <div>
              <input
                placeholder="请输入用户名"
                v-model="registerForm.username"
              />
            </div>
            <img
              v-show="registerForm.username"
              @click="clearField('rn')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/email.svg" />
          </div>
          <div>
            <div class="title">邮箱</div>
            <div v-show="currentActiveTab === 0">
              <input placeholder="请输入邮箱" v-model="loginForm.email" />
            </div>
            <div v-show="currentActiveTab === 1">
              <input placeholder="请输入邮箱" v-model="registerForm.email" />
            </div>
            <img
              v-show="loginForm.email && !currentActiveTab"
              @click="clearField('le')"
              src="@/assets/images/close.svg"
              alt=""
            />
            <div
              class="sendYZM"
              @click="sendYZM('register')"
              v-show="currentActiveTab === 1"
            >
              {{ YZMFlagR ? `已发送(${timeR})` : "发送验证码" }}
            </div>
          </div>
        </div>
        <div v-show="currentActiveTab === 1">
          <div>
            <img src="@/assets/images/yanzhengma.svg" />
          </div>
          <div>
            <div class="title">验证码</div>
            <div>
              <input placeholder="请输入验证码" v-model="registerForm.code" />
            </div>
            <img
              v-show="registerForm.code"
              @click="clearField('rc')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
        <div v-show="currentActiveTab === 0" class="login_password">
          <div>
            <img src="@/assets/images/key.svg" />
          </div>
          <div>
            <div class="title">密码</div>
            <div>
              <input placeholder="请输入密码"  type="password" v-model="loginForm.password" />
            </div>
            <img
              v-show="loginForm.password"
              @click="clearField('lp')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
        <div v-show="currentActiveTab === 1">
          <div>
            <img src="@/assets/images/key.svg" />
          </div>
          <div>
            <div class="title">密码</div>
            <div>
              <input placeholder="请输入密码"  type="password" v-model="registerForm.password" />
            </div>
            <img
              v-show="registerForm.password"
              @click="clearField('rp')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div
        class="content reset_password_content"
        v-show="currentActiveTab === 2"
      >
        <div>
          <div>
            <img src="@/assets/images/email.svg" />
          </div>
          <div>
            <div class="title">邮箱</div>
            <div>
              <input placeholder="请输入邮箱" v-model="forgetForm.email" />
            </div>
            <div class="sendYZM" @click="sendYZM('forget')">
              {{ YZMFlagF ? `已发送(${timeF})` : "发送验证码" }}
            </div>
          </div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/yanzhengma.svg" />
          </div>
          <div>
            <div class="title">验证码</div>
            <div>
              <input placeholder="请输入验证码" v-model="forgetForm.code" />
            </div>
            <img
              v-show="forgetForm.code"
              @click="clearField('fc')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
        <div>
          <div>
            <img src="@/assets/images/key.svg" />
          </div>
          <div>
            <div class="title">新密码</div>
            <div>
              <input
                placeholder="请输入您的新密码"
                v-model="forgetForm.new_password"
              />
            </div>
            <img
              v-show="forgetForm.new_password"
              @click="clearField('fp')"
              src="@/assets/images/close.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="btn" @click="navigate" @enter="navigate" >
        {{
          currentActiveTab
            ? currentActiveTab === 1
              ? "创建账户"
              : "修改密码"
            : "登录"
        }}
      </div>
      <div class="btn_login" v-show="currentActiveTab === 2">
        <div @click="currentActiveTab = 0">&lt;&lt;&lt;返回登录</div>
      </div>
      <div
        class="forgotPassword"
        @click="changeTab(2)"
        v-show="currentActiveTab !== 2"
      >
        <img src="@/assets/images/p_question.svg" />
        <div>忘记密码</div>
      </div>
      <div class="policy">隐私政策和使用条款</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { login, register, sendCode, updatePassword } from "@/config/api";
import { ElMessage } from "element-plus";

const router = useRouter();

const currentActiveTab = ref(0);
function changeTab(tab: number) {
  currentActiveTab.value = tab;
}

const YZMFlagR = ref(false);
const YZMFlagF = ref(false);
const timeR = ref(59);
const timeF = ref(59);
const loginForm: any = reactive({
  email: "",
  password: "",
});
const registerForm: any = reactive({
  username: "",
  email: "",
  code: "",
  password: "",
});
const forgetForm: any = reactive({
  email: "",
  code: "",
  new_password: "",
});
let timerIdR = 0;
let timerIdF = 0;

function sendYZM(type: string) {
  let ajaxEmail = "";
  if (type === "register") {
    ajaxEmail = registerForm.email;
    if (!ajaxEmail) {
      ElMessage({
        type: 'error',
        message: '请检查邮箱'
      })
      return
    }
    YZMFlagR.value = true;
    timerIdR = setInterval(() => {
      timeR.value--;
      if (!timeR.value) {
        YZMFlagR.value = false;
        clearInterval(timerIdR);
        timeR.value = 59;
      }
    }, 1000);
  } else {
    ajaxEmail = forgetForm.email;
    if (!ajaxEmail) {
      ElMessage({
        type: 'error',
        message: '请检查邮箱'
      })
      return
    }
    YZMFlagF.value = true;
    timerIdF = setInterval(() => {
      timeF.value--;
      if (!timeF.value) {
        YZMFlagF.value = false;
        clearInterval(timerIdF);
        timeF.value = 59;
      }
    }, 1000);
  }
  sendCode({
    email: ajaxEmail,
  })
    .then(() => {})
    .catch(() => {
      ElMessage({
        message: "验证码发送失败，请联系管理员",
        type: "error",
      });
    });
}

function resetForm(type: string) {
  const eventTrigger: Record<string, () => void> = {
    login() {
      Object.keys(loginForm).forEach((key) => {
        loginForm[key] = "";
      });
    },
    register() {
      Object.keys(registerForm).forEach((key) => {
        registerForm[key] = "";
      });
    },
    forget() {
      Object.keys(forgetForm).forEach((key) => {
        forgetForm[key] = "";
      });
    },
  };
  eventTrigger[type]();
}

function validate(type: string) {
  const eventTrigger: Record<string, () => boolean> = {
    login() {
      let valid = true;
      let msg = "";
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!loginForm.password) {
        msg = "请输入密码！";
        valid = false;
      }
      if (!regex.test(loginForm.email)) {
        msg = "请输入正确格式的邮箱！";
        valid = false;
      }
      !valid &&
        ElMessage({
          message: msg,
          type: "error",
        });
      return valid;
    },
    register() {
      let valid = true;
      let msg = "";
      const passwordRegex = /^(?=.*[a-zA-Z]).+$/;
      if (!passwordRegex.test(registerForm.password)) {
        msg = "密码必须含有一个字母！";
        valid = false;
      }
      if (!registerForm.password) {
        msg = "请输入密码！";
        valid = false;
      }
      if (!registerForm.code) {
        msg = "请输入验证码！";
        valid = false;
      }
      if (!registerForm.username) {
        msg = "请输入用户名！";
        valid = false;
      }
      !valid &&
        ElMessage({
          message: msg,
          type: "error",
        });
      return valid;
    },
    forget() {
      let valid = true;
      let msg = "";
      const passwordRegex = /^(?=.*[a-zA-Z]).+$/;
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!passwordRegex.test(forgetForm.new_password)) {
        msg = "新密码必须含有一个字母！";
        valid = false;
      }
      if (!forgetForm.new_password) {
        msg = "请输入新密码！";
        valid = false;
      }
      if (!forgetForm.code) {
        msg = "请输入验证码！";
        valid = false;
      }
      if (!forgetForm.email) {
        msg = "请输入邮箱！";
        valid = false;
      }
      if (!regex.test(forgetForm.email)){
        msg = "请输入正确格式的邮箱！";
        valid = false;
      }
      !valid &&
        ElMessage({
          message: msg,
          type: "error",
        });
      return valid;
    },
  };
  return eventTrigger[type]();
}

function putDownEnter(e: KeyboardEvent){
  if(e.code === "Enter") {
      navigate()
    }
}

onMounted(() => {
  window.addEventListener('keydown', putDownEnter)
  const changePasswordFlag = router.currentRoute.value?.query?.email
  if(changePasswordFlag) {
    currentActiveTab.value = 2
    forgetForm.email = changePasswordFlag
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', putDownEnter)
})

function navigate() {
  const eventTrigger: Record<number, () => void> = {
    0() {
      validate("login") &&
        login(loginForm)
          .then((res) => {
            if (res.data.code === 1000) {
              ElMessage({
                type: 'success',
                message: '登录成功'
              })
              localStorage.setItem('token', res.data.data.access_token)
              router.push('/')
            } else {
              throw new Error(res.data.msg)
            }
          })
          .catch(err => {
            ElMessage({
                type: 'error',
                message: err
              })
          });
    },
    1() {
      validate("register") &&
        register(registerForm)
          .then((res:any) => {
            if(res.data.code === 1000) {
              ElMessage({
                type: 'success',
                message: '注册成功'
              })
              resetForm("login");
              currentActiveTab.value = 0;
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
    },
    2() {
      validate("forget") &&
        updatePassword(forgetForm)
          .then((res:any) => {
            if (res.data.code === 1000) {
              ElMessage({
              message: "修改密码成功",
              type: "success",
            });
            currentActiveTab.value = 0;
            } else {
              throw new Error(res.data.msg)
            }
          })
          .catch((error) => {
            ElMessage({
                type: 'error',
                message: error
              })
          });
    },
  };
  eventTrigger[currentActiveTab.value]();
}

function clearField(type: string) {
  const eventTrigger: Record<string, () => void> = {
    le() {
      loginForm.email = "";
    },
    lp() {
      loginForm.password = "";
    },
    rn() {
      registerForm.username = "";
    },
    re() {
      registerForm.email = "";
    },
    rc() {
      registerForm.code = "";
    },
    rp() {
      registerForm.password = "";
    },
    fe() {
      forgetForm.email = "";
    },
    fc() {
      forgetForm.code = "";
    },
    fp() {
      forgetForm.new_password = "";
    },
  };
  eventTrigger[type]();
}
</script>
<style scoped lang="less">
.login_con {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/images/bg.png");
  background-size: cover;
  height: 100vh;
  .form {
    width: 600px;
    height: 750px;
    min-height: 580px;
    border-radius: 20px;
    background: rgba(244, 244, 244, 1);
    border: 1px solid rgba(112, 112, 112, 1);
    position: relative;
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 200px;
      margin: 6.29% auto 5.18%;
      & > img {
        width: 44px;
        height: 44px;
      }
      & > .logo {
        font-size: 33px;
        font-weight: 900;
        letter-spacing: 0px;
        color: rgba(14, 14, 16, 1);
      }
      & > .ai {
        /** 文本1 */
        font-size: 33px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 44px;
        color: rgba(51, 51, 51, 1);
      }
    }
    .tab {
      position: relative;
      margin-bottom: 35px;
      font-size: 0.93vw;
      width: 473px;
      height: 48px;
      margin-left: 64px;
      transition: all 0.3s ease;
      .active_tab {
        z-index: 2;
        background: rgba(250, 250, 250, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      }
      & > div {
        cursor: pointer;
        position: absolute;
        z-index: 1;
        width: 241px;
        height: 48px;
        border-radius: 10px;
        line-height: 48px;
        text-align: center;
        font-size: 0.93vw;
        font-weight: 400;
        letter-spacing: 0px;
        border: 1px solid rgba(222, 222, 222, 1);
        color: rgba(134, 132, 135, 1);
      }
      & > .login {
        left: 0;
      }
      & > .account {
        right: 0;
      }
    }
    .reset_password {
      width: 474px;
      height: 48px;
      text-align: center;
      font-size: 0.93vw;
      line-height: 48px;
      border-radius: 10px;
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(222, 222, 222, 1);
      margin: 0 auto 3.24%;
    }
    .content {
      width: 476px;
      font-size: 0.93vw;
      border-radius: 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(201, 201, 201, 1);
      margin: 0 auto 21px;
      & > div:not(:last-child) {
        border-bottom: 1px solid rgba(201, 201, 201, 1);
      }
      & > .login_password {
        border-bottom: none !important;
      }
      & > div {
        display: flex;
        height: 84.5px;
        & > div:first-child {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 62px;
          & > img {
            width: 40px;
            height: 30px;
          }
        }
        & > div:last-child {
          flex-grow: 1;
          position: relative;
          .title {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-bottom: 4px;
          }
          .sendYZM {
            width: 130px;
            position: absolute;
            top: 19px;
            right: 14px;
            height: 48px;
            border-radius: 10px;
            background: rgba(235, 214, 255, 1);
            color: rgba(138, 90, 222, 1);
            text-align: center;
            line-height: 48px;
            cursor: pointer;
          }
          & > div {
            height: 40px;
          }
          & > img {
            position: absolute;
            width: 30px;
            height: 30px;
            cursor: pointer;
            right: 50px;
            top: 29.5px;
          }
        }
      }
      & input {
        border: none;
        outline: none;
        height: 70%;
        width: 95%;
        font-size: 0.93vw;
        line-height: 0.93vw;
      }
      & input::placeholder {
        font-size: 0.93vw;
      }
    }
    .reset_password_content {
      height: 255px;
      & > div:nth-child(2) {
        border-bottom: 1px solid rgba(201, 201, 201, 1);
      }
    }
    .btn {
      margin: 0px auto 15.5px;
      width: 476px;
      height: 49px;
      text-align: center;
      line-height: 49px;
      font-size: 0.93vw;
      font-weight: 400;
      letter-spacing: 0px;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      border-radius: 10px;
      background: linear-gradient(
        180deg,
        rgba(185, 111, 238, 1) 0%,
        rgba(132, 87, 220, 1) 100%
      );
      border: 1px solid rgba(99, 58, 180, 1);
    }
    .btn_login {
      width: 476px;
      display: flex;
      margin: auto;
      & > div {
        margin-left: auto;
        font-size: 16px;
        color: #7d4ced;
        cursor: pointer;
      }
    }
    .forgotPassword {
      cursor: pointer;
      width: 110px;
      display: flex;
      align-items: center;
      height: 25px;
      font-size: 0.93vw;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 24px;
      color: rgba(125, 76, 237, 1);
      margin: 0 auto;
      & > img {
        width: 25px;
        height: 25px;
        color: rgba(125, 76, 237, 1);
        margin-right: 10px;
      }
    }
    .policy {
      position: absolute;
      left: 64px;
      bottom: 6.85%;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 21px;
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>
