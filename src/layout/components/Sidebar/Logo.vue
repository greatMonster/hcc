<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="imgSrc" class="sidebar-logo-small" />
        <!-- <h1 v-else class="sidebar-title">{{ title }} </h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="imgSrc" class="sidebar-logo" />
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      imgSrc: null,
      title: 'ddaigg',
      logo: '@/assets/logo.png'
    }
  },
  created() {
    this.getBg()
  },
  methods: {
    getBg() {
      axios({
        method: 'get',
        url: '/prepare/api/v1/files/home/image?fileType=logo', // 请求地址
        responseType: 'arraybuffer' // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          let url = this.transformArrayBufferToBase64(res.data)
          this.imgSrc = `data:image/png;base64,${url}`
        })
        .catch(() => {
          this.imgSrc = '@/assets/logo.png'
        })
    },
    transformArrayBufferToBase64(buffer) {
      let binary = ''

      let bytes = new Uint8Array(buffer)

      for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }

      return window.btoa(binary)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #172449;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      // margin-left: 7px;
    }
    & .sidebar-logo-small {
      height: 32px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
