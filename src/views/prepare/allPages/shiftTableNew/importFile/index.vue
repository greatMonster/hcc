<template>
  <div class="body">
    <div class="search">
      <el-alert type="info" description="导入功能是用于将固定工作量导入系统，如需创建基于任务的工作量，请使用新增功能。" effect="dark" />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>导入操作说明</span>
        </div>
        <div class="seach-content">
          <div class="text item">
            1. 下载&nbsp;
            <span class="import-style" @click="viewClick">导入模板</span>
          </div>
          <div class="text item">
            2.
            上传的文件一共三列，均为必填。第一列需是每个时刻的日期，相邻时间需按照5分钟粒度间隔，第二列需是技能名,技能名需要在系统内存在，第三列需是当前时刻所需技能数，技能数为整数。
          </div>
          <div class="text item">
            <span>3.&nbsp;</span>
            <selected-import class="filter-top-item right-section2" :name="name" :post-url="url" @refreshData="initTable" />
          </div>
        </div>
      </el-card>
      <el-alert v-if="errorShow" title="错误提示" type="error" style="margin-top:10px;">
        <div slot>
          <div class="text">
            错误详情：
            <div v-for="(item, index) in errorMessage" :key="index" style="padding-left:20px">{{ item }}</div>
          </div>
          <div v-if="hasUrl" class="text loadErrorFile" @click="errorFile">查看错误文件</div>
        </div>
      </el-alert>
    </div>
    <!-- <div class="search">
      <el-card class="box-card">
        <div class="seach-content">
          <div class="text item">消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示，消息提示</div>
        </div>
      </el-card>
    </div>-->
  </div>
</template>

<script>
import selectedImport from '@/components/BulkImport/selectedImport'
export default {
  name: 'ImportFile',
  components: {
    selectedImport
  },
  data() {
    return {
      active: 1,
      address: '',
      errorMessage: [],
      hasUrl: false,
      stepData: [
        { index: 1, title: '步骤1', icon: 'el-icon-edit' },
        {
          index: 2,
          title: '步骤2',
          icon: 'el-icon-edit'
        },
        { index: 3, title: '步骤3', icon: 'el-icon-edit' }
      ],
      name: 'file',
      url: `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/workloads/import?businessDomainId=' + 1,
      errorShow: false
    }
  },
  created() {
    // this.initTable()
  },
  methods: {
    stepClick(index) {
      this.active = index
    },
    initTable(params) {
      if (params.result === 'success') {
        this.$message.success('导入成功')
        this.errorShow = false
      } else {
        this.errorShow = true
        if (JSON.parse(params.response.message).data) {
          this.hasUrl = true
          this.errorMessage = JSON.parse(params.response.message).message.split('|')
          this.address = JSON.parse(params.response.message).data.errorFileUri
        } else {
          this.hasUrl = false
          this.errorMessage = [JSON.parse(params.response.message).message]
        }
      }
    },
    viewClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/workloads/importTemplate'
    },
    errorFile() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/files/' + this.address
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
  letter-spacing: 1px;
}

.item {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  padding: 18px 0;
}

.import-style {
  color: #81c3ef;
}
.import-style:hover {
  text-decoration: underline;
  color: #409eff;
  cursor: pointer;
}

.loadErrorFile {
  height: 30px;
  line-height: 30px;
  color: #409eff;
}

.loadErrorFile:hover {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}
.box-card {
  width: 480px;
  margin: 0 auto;
}
.search {
  /* background-color: #172449; */
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.cont {
  width: 65%;
  margin: 30px auto;
  border: 1px solid #425079;
  padding: 60px;
}
.search /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}
.search /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}

.body /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.seach-content {
  width: 96%;
  height: 100%;
  padding: 10px 10px;
  margin: 0 auto;
}
</style>
