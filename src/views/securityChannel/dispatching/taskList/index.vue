<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>
          <el-date-picker v-model="dateRange" size="mini" style="width: 220px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="|" start-placeholder="开始日期" end-placeholder="结束日期" @change="init" />
        </div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="small" @click="exportClick">导 出</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table v-loading="listLoading" :data="baselineTable" border stripe>
        <el-table-column type="index" />
        <el-table-column prop="taskId" label="任务编号" />
        <el-table-column prop="deskCode" label="柜台编号" />
        <el-table-column prop="employeeCode" label="员工编号">
          <template slot-scope="scope">{{ scope.row.employeeCode ? scope.row.employeeCode : '无人值机' }}</template>
        </el-table-column>
        <el-table-column prop="employeeName" label="员工姓名">
          <template slot-scope="scope">{{ scope.row.employeeName ? scope.row.employeeName : '无人值机' }}</template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { taskListInit } from '@/api/checkInData'
export default {
  name: 'BaselineType',
  data() {
    return {
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId,
      dateRange: [this.$route.query.date, this.$route.query.date],
      listLoading: true,
      baselineTable: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const data = {
        beginDate: this.dateRange[0] || this.$route.query.date,
        endDate: this.dateRange[1] || this.$route.query.date,
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      taskListInit(data)
        .then((response) => {
          this.baselineTable = response.data.data
          this.listLoading = false
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.response.data.message
          })
        })
    },
    exportClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + `rtm/api/v1/desks/tasks/export?beginDate=${this.dateRange[0] || ''}&endDate=${this.dateRange[1] || ''}&businessDomainId=${this.businessDomainId}`
    }
  }
}
</script>
<style scoped>
.skillBox /deep/ td,
tr,
th {
  text-align: left;
}
.skillBox /deep/ .cell {
  text-align: left;
  /* padding: 10px; */
}
.skillBox {
  padding: 0 0 0 10px;
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
  font-size: 15px;
}
.print {
  margin-left: 10%;
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
