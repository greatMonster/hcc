<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="index" element-loading-text="拼命加载中...">
    <el-row>
      <el-button type="primary" class="button" @click="downloadFile()">{{ name }}</el-button>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {
  name: 'ExcelExport',
  props: {
    name: {
      type: String,
      default: '导 出'
    },
    urlData: {
      type: String,
      default: ''
    },
    typeData: {
      type: String,
      default: 'get'
    },
    formData: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    return {
      fullscreenLoading: false // 加载中
    }
  },
  mounted() {
    console.log(this.formData, 132132)
  },
  methods: {
    downloadFile: function() {
      // 按钮导出
      if (this.typeData === 'get') {
        axios
          .get(this.urlData, {
            responseType: 'blob', // 或者responseType: 'blob'
            params: this.formData,
            headers: {
              Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
            }
          })
          .then((res) => {
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
            const objectUrl = URL.createObjectURL(blob)
            window.location.href = objectUrl
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (this.typeData === 'post') {
        debugger
      }
      this.$emit('exportClick', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-table th > .cell {
  text-align: center;
}
.button {
}
</style>
