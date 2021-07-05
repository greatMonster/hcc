<template>
  <div class="login-container" :style="{ backgroundImage: `url(${imgSrc})`, backgroundSize: '100% 100%' }">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          <!-- <img height="50" :src="imgSrc" /> -->
          <img height="50" src="@/assets/logo.png" />
        </h3>
      </div>
      <div style="border: 1px solid #586488">
        <div class="titlelogin">登录</div>
        <div style="margin-right: 24px; margin-left: 24px">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" maxlength="25" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <!-- <el-form-item prop="code">
            <el-row :span="24">
              <el-col :span="16">
                <el-input v-model="loginForm.code" type="text" :maxlength="code.len" placeholder="验证码（点击图片刷新）" />
              </el-col>
              <el-col :span="8">
                <div class="login-code" style="float:right">
                  <span v-if="code.type == 'text'" class="login-code-img" @click="refreshCode">{{ code.value }}</span>
                  <img v-else :src="code.src" alt="验证码" style="width:110px;;height:36px" class="login-code-img" @click="refreshCode">
                </div>
              </el-col>
            </el-row>
          </el-form-item>-->

          <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.native.prevent="handleLogin">登录</el-button>
        </div>
      </div>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
import { randomLenNum } from '@/utils/util'
import { Message } from 'element-ui'
import axios from 'axios'
// import { login } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      // const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/
      if (value.length < 6 || value.length > 12) {
        callback(new Error('密码应在6-12位'))
      } else {
        callback()
      }
    }
    return {
      imgSrc: null,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'image'
      },
      loginForm: {
        username: '',
        password: ''
        // code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.refreshCode()
    this.getBg()
  },
  methods: {
    // 获取背景图片
    getBg() {
      axios({
        method: 'get',
        url: '/prepare/api/v1/files/home/image?fileType=login', // 请求地址
        responseType: 'arraybuffer' // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          let url = this.transformArrayBufferToBase64(res.data)
          this.imgSrc = `data:image/png;base64,${url}`
        })
        .catch(() => {
          this.imgSrc = '@/assets/logobg.jpg'
        })
    },
    transformArrayBufferToBase64(buffer) {
      let binary = ''

      let bytes = new Uint8Array(buffer)

      for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }

      return window.btoa(binary)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      var data = {
        username: this.loginForm.username,
        password: this.loginForm.password
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', data)
            .then(() => {
              //   this.$router.push({ path: '/' })
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((message) => {
              // TODO: 应将错误信息显示在登录输入框下方
              Message({
                message: message,
                type: 'error',
                duration: 5 * 1000
              })
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    refreshCode() {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text' ? (this.code.value = randomLenNum(this.code.len)) : (this.code.src = `http://localhost:18084/api/v1/user/getVerify/`)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #314057;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input {
    display: inline-block;
    width: 85%;
    input {
      color: $cursor;
      border: none;
      border-radius: 0;
      background: transparent;
      -webkit-appearance: none;
      color: $light_gray;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
.titlelogin {
  padding: 15px;
  color: #fff;
  background: #294177;
  margin-bottom: 30px;
}
/* reset element-ui css */
.login-container {
  // background: url('../../assets/logobg.jpg') 100% 100%;
  // background-size: 100%;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  input {
    border: none;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      margin-left: 47px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
