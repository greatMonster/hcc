<template>
  <div class="body">
    <div class="condition-select">
      <el-form ref="formSelect" :inline="true" :model="formSelect" class="demo-form-inline" size="small">
        <div class="col-padding">
          <el-form-item prop="name" label="员工姓名" label-width="70px">
            <el-input v-model="formSelect.name" clearable type="text" placeholder="请输入员工姓名" style="width: 170px" />
          </el-form-item>
          <el-form-item prop="code" label="员工编号" label-width="70px">
            <el-input v-model="formSelect.code" clearable type="text" placeholder="请输入员工编号" style="width: 170px" />
          </el-form-item>
          <el-form-item prop="gender" label="性别" label-width="45px">
            <el-select v-model="formSelect.gender" size="mini" clearable filterable placeholder="请选择" style="width: 220px">
              <el-option v-for="item in sexOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="organizationId" label="部门" class="select" label-width="45px">
            <el-select v-model="formSelect.organizationId" size="mini" clearable filterable placeholder="请选择" style="width:220px">
              <el-option v-for="item in optionsOrgnization" :key="item.organizationId" :label="item.organizationName" :value="item.organizationId" />
            </el-select>
          </el-form-item>-->
          <el-form-item prop="dateRange" label="日期" label-width="45px">
            <el-date-picker v-model="formSelect.dateRange" size="mini" style="width: 220px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="|" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
            <el-button size="small" type="primary" @click="exportFile">导出</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="skillShow" ref="headerFilter">
      <el-table :data="reportlTable" border strip style="width: 100%" :max-height="tableHeight">
        <el-table-column prop="code" label="员工编号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="dateRange" label="起止日期" width="180" />
        <el-table-column prop="groupName" label="班组名称" />
        <el-table-column prop="workingHours" width="90">
          <template slot="header">
            总工时
            <el-tooltip content="选定日期内的总工时" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="taskHours" width="100">
          <template slot="header">
            有效工时
            <el-tooltip content="选定日期内完成任务的总时长" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="useRatio" width="110">
          <template slot="header">
            工时利用率
            <el-tooltip content="工时利用率=有效工时/总工时*100%" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="normalTaskNum" label="正常任务数" width="100" />
        <el-table-column prop="normalRate" width="110">
          <template slot="header">
            任务正常率
            <el-tooltip content="任务正常率=正常任务数/总任务数" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="workDays" label="出勤天数" />
        <el-table-column prop="sickLeave" label="病假" />
        <el-table-column prop="personalLeave" label="事假" />
        <el-table-column prop="homeLeave" label="探亲假" />
        <el-table-column prop="restLeave" label="调休" />
        <el-table-column prop="otherLeave" label="其他" />
        <el-table-column prop="taskNum" width="100">
          <template slot="header">
            总任务数
            <el-tooltip content="选定时间内被分配任务数量" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="abnormalTaskNum" width="110">
          <template slot="header">
            异常任务数
            <el-tooltip content="选定时间内异常任务总量（异常任务包括：未按时开始、未按时接收、未按时结束状态的任务）" placement="right">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="notReceivedOnTime" label="未按时接受任务" width="120" />
        <el-table-column prop="notStartedOnTime" label="未按时开始任务" width="120" />
        <el-table-column prop="notFinishedOnTime" label="未按时结束任务" width="120" />
      </el-table>
      <el-pagination background :current-page="page.currentPage4" :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script>
import { initTableData } from '@/apiNew/assessmentReport'
import { initData } from '@/api/department'
import axios from 'axios'
export default {
  name: 'DistanceRule',
  data() {
    return {
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId,
      tableHeight: null,
      reportlTable: [],
      page: {
        currentPage4: 1,
        totalCount: 0,
        pageSize: 100
      },
      formSelect: { dateRange: ['', ''] },
      sexOptions: [
        { id: 1, name: '男' },
        { id: 2, name: '女' }
      ],
      optionsOrgnization: []
    }
  },
  created() {
    // this.airports()
    this.initTable()
    this.departmentList()
    // this.carrierts()
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.departmentList()
      }
    }
  },
  methods: {
    exportFile() {
      this.formSelect.businessDomainId = this.businessDomainId
      this.formSelect.airportId = this.airport.airportId
      axios({
        method: 'post',
        url: '/rtm/api/v1/tasks/useRatio/export', // 请求地址
        data: this.formSelect, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          // 处理返回的文件流
          // console.log(res, 212)
          const content = res.data
          const blob = new Blob([content])
          const fileName = '员工考核报表.xlsx'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            // console.log(elink, 6655)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    departmentList() {
      const data = {
        airportId: this.airport.airportId
      }
      initData(data).then((response) => {
        this.optionsOrgnization = response.data
      })
    },
    initTable() {
      // this.formSelect.pageSize = this.page.pageSize
      // this.formSelect.pageNum = this.page.currentPage4
      this.formSelect.beginDate = this.formSelect.dateRange[0]
      this.formSelect.endDate = this.formSelect.dateRange[1]
      this.formSelect.businessDomainId = this.businessDomainId
      this.formSelect.businessDomainId = this.airport.airportId
      this.formSelect.airportId = this.airport.airportId
      initTableData(this.formSelect || '')
        .then((response) => {
          this.reportlTable = response.data.data.list
          this.page.totalCount = response.data.data.total
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.headerFilter.getBoundingClientRect().top - 75
      })
    },
    onSubmit() {
      this.initTable()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.formSelect.pageSize = this.page.pageSize
      this.formSelect.pageNum = this.page.currentPage4
      this.initTable()
    },
    handleCurrentChange(val) {
      this.page.currentPage4 = val
      this.formSelect.pageSize = this.page.pageSize
      this.formSelect.pageNum = this.page.currentPage4
      this.initTable()
    }
  }
}
</script>
<style>
/* // 处理input type = number的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<style scoped>
.body {
  margin: 0;
  padding: 60px 0 0 0;
}
.condition-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 3px 0 3px;
  border-bottom: 1px solid #434b61;
}
.col-padding {
  width: 100%;
  padding: 5px 0 0 5px;
  background: #151c3a;
}
form {
  margin-top: 20px;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.importExcel {
  margin-left: 2%;
}
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
