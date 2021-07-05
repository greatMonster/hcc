<template>
  <div class="box">
    <div class="add-user" style="display: flex; justify-content: space-between">
      <el-form :inline="true" :model="formSelect" size="small">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="formSelect.userName" />
        </el-form-item>
        <el-form-item label="姓名" label-width="60px">
          <el-input v-model="formSelect.name" />
        </el-form-item>
        <el-form-item label="日期" label-width="60px">
          <el-date-picker v-model="formSelect.date" size="small" style="width: 220px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="|" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button size="small" type="primary" @click="exportClick">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-style">
      <el-table :data="tableData" border :header-row-style="{ 'background-color': 'rgb(10, 20, 47)' }" :row-style="{ 'background-color': '#232c47' }" style="width: 100%; color: white">
        <el-table-column type="index" width="45" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="ipAddress" label="IP地址" />
        <el-table-column prop="modeMessage" label="功能模块" />
        <el-table-column prop="message" label="日志摘要" />
        <el-table-column prop="updateTime" label="操作时间" />
      </el-table>
      <div class="block">
        <span style="padding-left: 10px">共有 {{ page.totalCount }} 条记录</span>
        <!-- <span style="padding-left: 10px">每页 {{ 100 }} 名&nbsp;&nbsp;</span> -->
        <!-- <span>平均日工时:{{ countDetail.avgDailyWorkingHours ? countDetail.avgDailyWorkingHours : '-' }}/月工时:{{ countDetail.avgMonthlyWorkingHours ? countDetail.avgMonthlyWorkingHours : '-' }}</span> -->
        <el-pagination background :current-page="page.currentPage4" :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
      <!-- <el-pagination background :current-page="page.currentPage4" :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
    </div>
  </div>
</template>

<script>
// import { initData, removeData } from '@/api/rulesManagement'
import { initData, removeData } from '@/apiNew/operationLog'
export default {
  data() {
    return {
      date: '',
      page: {
        currentPage4: 1,
        totalCount: 0,
        pageSize: 10,
      },
      formLabelWidth: '170px',
      roleOptions: [],
      formEdit: {},
      formSelect: {
        userName: '',
        name: '',
        date: ['', ''],
      },
      data: {},
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  watch: {},

  created() {
    this.initial()
  },
  methods: {
    exportClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}prepare/api/v1/log/export?startTime=${this.formSelect.date ? this.formSelect.date[0] : ''}&endTime=${this.formSelect.date ? this.formSelect.date[1] : ''}&userName=${
        this.formSelect.userName
      }&name=${this.formSelect.name}`
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      console.log(val)
      this.page.currentPage4 = val
      this.initial()
    },
    addUserClick() {
      this.$router.push({ path: '/ATM/editAdd' })
    },
    initial() {
      this.formSelect.startTime = this.formSelect.date ? this.formSelect.date[0] : ''
      this.formSelect.endTime = this.formSelect.date ? this.formSelect.date[1] : ''
      this.formSelect.pageSize = this.page.pageSize
      this.formSelect.pageNum = this.page.currentPage4
      initData(this.formSelect).then((response) => {
        this.tableData = response.data.data.list
        this.page.totalCount = response.data.data.total
      })
    },
    onSubmit() {
      this.initial()
      // initData(this.formSelect).then((response) => {
      //   this.tableData = response.data.data.list
      //   this.$message.success('查询成功')
      // })
    },
    handleEditClick(index, row) {
      this.$router.push({ path: '/ATM/editAdd', query: { id: row.id } })
    },
  },
}
</script>
<style lang="scss" scoped>
.block {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  font-size: 13px;
}
.box {
  margin-top: 60px;
}
.add-user {
  width: 100%;
  padding: 20px 0 0 20px;
  .el-form {
    .el-input,
    .el-select {
      width: 150px;
    }
  }
}
.table-style {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
