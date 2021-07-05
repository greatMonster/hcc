<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面样式设置</h3>

      <!-- <div class="drawer-item">
        <span>主题色</span>
        <theme-picker style="float: right; height: 26px; margin: -3px 8px 0 0" @change="themeChange" />
      </div> -->
      <!-- <div class="drawer-item">
        <span>侧边栏logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div> -->
      <div class="drawer-item">
        <span>侧边栏背景</span>
        <el-color-picker v-model="navBgColor" style="float: right; height: 26px; margin: -3px 8px 0 0" class="theme-picker" popper-class="theme-picker-dropdown" />
      </div>
      <div class="drawer-item">
        <span>侧边栏选中颜色</span>
        <el-color-picker v-model="navSelectColor" style="float: right; height: 26px; margin: -3px 8px 0 0" class="theme-picker" popper-class="theme-picker-dropdown" />
      </div>
      <div class="drawer-item">
        <span>header背景</span>
        <el-color-picker v-model="headerBgColor" style="float: right; height: 26px; margin: -3px 8px 0 0" class="theme-picker" popper-class="theme-picker-dropdown" />
      </div>
      <!-- <div class="drawer-item">
        <span>页面背景色</span>
        <el-color-picker v-model="pageBgColor" style="float: right; height: 26px; margin: -3px 8px 0 0" class="theme-picker" popper-class="theme-picker-dropdown" />
      </div> -->
      <div class="drawer-item">
        <span>登录页背景图片<span style="font-size: 12px; color: #de6b3e">(只支持jpg/png格式，且大小不超过2MB,建议图片比例8:5)</span> </span>
        <!-- <selected-import class="filter-top-item right-section2" :name="name" :post-url="url" /> -->
        <el-upload
          class="upload-demo"
          style="margin-top: 10px"
          :action="url"
          :headers="headers"
          :limit="1"
          :before-upload="beforeAvatarUpload"
          :on-success="handleUploadSuccess"
          :on-exceed="handleExceed"
          :on-error="handleUploadError"
          list-type="picture"
        >
          <!-- <div slot="tip" class="el-upload__tip">只支持jpg/png格式，且大小不超过2MB</div> -->
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="drawer-item">
        <span>系统LOGO<span style="font-size: 12px; color: #de6b3e">(只支持jpg/png格式，且大小不超过2MB,建议图片比例7:2)</span> </span>
        <el-upload
          class="upload-demo"
          style="margin-top: 10px"
          :action="urlLogo"
          :headers="headers"
          :limit="limitNumber"
          :before-upload="beforeAvatarUpload"
          :on-success="handleUploadSuccess"
          :on-exceed="handleExceed"
          :on-error="handleUploadError"
          list-type="picture"
        >
          <!-- <div slot="tip" class="el-upload__tip">只支持jpg/png格式，且大小不超过2MB</div> -->
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import selectedImport from '@/components/BulkImport/selectedImport'
import ThemePicker from '@/components/ThemePicker'
import Cookies from 'js-cookie'
export default {
  components: { ThemePicker, selectedImport },
  data() {
    return {
      limitNumber: 1,
      headers: { Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken || '' },
      url: `${process.env.VUE_APP_BASE_API}prepare/api/v1/files/home/image?fileType=login`,
      urlLogo: `${process.env.VUE_APP_BASE_API}prepare/api/v1/files/home/image?fileType=logo`,
      name: 'file',
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    headerBgColor: {
      get() {
        return this.$store.state.settings.headerBgColor
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'headerBgColor',
          value: val
        })
      }
    },
    navBgColor: {
      get() {
        return this.$store.state.settings.navBgColor
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'navBgColor',
          value: val
        })
      }
    },
    navSelectColor: {
      get() {
        return this.$store.state.settings.navSelectColor
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'navSelectColor',
          value: val
        })
      }
    },
    pageBgColor: {
      get() {
        return this.$store.state.settings.pageBgColor
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'pageBgColor',
          value: val
        })
      }
    },
    // tagsView: {
    //   get() {
    //     return this.$store.state.settings.tagsView
    //   },
    //   set(val) {
    //     this.$store.dispatch('settings/changeSetting', {
    //       key: 'tagsView',
    //       value: val
    //     })
    //   }
    // },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      console.log(file, 110)
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 文件超出最大上传数的处理
    handleExceed(file) {
      this.$message.warning(`最多只能上传一张图片`)
    },
    handleUploadSuccess(respose, file, fileList) {
      if (respose.code == 200) {
        // console.log(file, 110)
        this.$message.success(`${respose.message}，重新登陆体验一下吧！`)
        // this.$emit('refreshData')
      } else {
        this.$message.error(respose.message)
      }
    },
    // 模板导入失败
    handleUploadError(err, file, fileList) {
      console.log('err========模板导入失败====================')
      console.log(err)
      this.$message({
        title: '失败',
        message: '失败',
        type: 'error',
        duration: 2000
      })
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file, 110)
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }
  .drawer-switch {
    float: right;
  }
}
</style>
