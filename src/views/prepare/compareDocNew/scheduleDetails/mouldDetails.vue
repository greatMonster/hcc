<template>
  <div class="body">
    <div class="search-area">
      <el-form :model="searchForm" label-width="80px" :inline="true" :label-position="position">
        <el-form-item label="名称" label-width="50px">
          <el-input v-model="searchForm.name" size="small" disabled />
        </el-form-item>
        <el-form-item label="排班区间">
          <el-input v-model="searchForm.topDate" disabled size="small" />
        </el-form-item>
        <el-form-item label="工作量">
          <el-select v-model="searchForm.workloadId" size="small" placeholder="请选择" class="particle-button" style="width: 100%">
            <el-option v-for="item in workloadList" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" size="small" :title="titleName" @click="applyClick">应 用</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <div class="workload-top">
        <div class="span-value">
          <label for>开始与结束日期&nbsp;</label>
          <el-date-picker v-model="searchDate" size="small" style="width: 300px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search2" />
      </div>
      <div v-if="noData" style="font-size: 16px; text-align: center; height: 40px; line-height: 40px; background: #172449">暂无数据</div>
      <bottom-charts v-if="!noData" :chart-data="chartData" :loading="chartData.loading" />
    </div>
    <div class="foot">
      <el-button size="small" style="right: 150px" @click="goBack">返 回</el-button>
      <el-button size="small" style="right: 60px" type="primary" @click="jumpCover">比较覆盖</el-button>
    </div>
  </div>
</template>
<script>
import { initNewTable } from '@/apiNew/workload'
import { chartDeatils, detailsData } from '@/apiNew/scheduleDetails'
import bottomCharts from '../components/bottomCharts'
export default {
  components: { bottomCharts },
  data() {
    return {
      noData: false,
      titleName: 'hahha',
      workloadList: [],
      searchForm: {},
      searchDate: ['', ''],
      rosterSettingVersionId: this.$route.query.rosterSettingVersionId,
      lineChartData: [],
      chartData: {},
      position: 'right'
    }
  },
  created() {
    if (this.rosterSettingVersionId) {
      this.init()
      this.detailsData()
      this.workloadSelect()
    }
  },
  methods: {
    detailsData() {
      var data = {
        id: this.rosterSettingVersionId
      }
      detailsData(data)
        .then((response) => {
          var data = response.data.data
          data.topDate = data.beginDate + '/' + data.endDate
          this.searchForm = data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    workloadSelect() {
      var data = {
        id: this.$route.query.businessDomainId || 1,
        name: ''
      }
      initNewTable(data).then((response) => {
        this.workloadList = response.data.data
      })
    },
    handleData(data) {
      var _this = this
      if (data[0].dailyCoverResult.length !== 0) {
        this.searchDate = [data[0].dailyCoverResult[0].date, data[0].dailyCoverResult[data[0].dailyCoverResult.length - 1].date]
      }
      var noData = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].dailyCoverResult.length !== 0) {
          noData = true
          break
        }
      }
      if (!noData) {
        this.noData = true
        this.loading = false
        _this.WorkloadLoading = false
        _this.coverLoading = false
      } else {
        data.forEach((element) => {
          var data1 = {}
          data1.role
          data1.datas = []
          element.dailyCoverResult.forEach((element2) => {
            var data2 = {}
            data2.dataX = []
            data2.aa = []
            data2.kpi = []
            data2.name = element.employeeType.employeeTypeName
            data2.day = element2.date
            element2.coverDetails &&
              element2.coverDetails.forEach((element3) => {
                data2.kpi.push({
                  lineName: element3.name,
                  coverage: (element3.coverRate * 100).toFixed(2),
                  underStaff: (element3.underStaff * 100).toFixed(2),
                  usageRate: (element3.usageRate * 100).toFixed(2),
                  maxNum: element3.maxNum,
                  warnLine: true,
                  maxLackingNum: element3.maxLackingNum
                })
                var datax = []
                var datay = []
                element3.details.forEach((element4) => {
                  datax.push(element4.time.substring(11, 16))
                  datay.push(element4.num)
                })
                data2.aa.push({ y: datay, name: element.employeeType.employeeTypeName, backgroundColor: element.employeeType.employeeTypeName })
                data2.dataX = datax
              })
            var datax1 = []
            var dataWorkload = []
            if (element2.workloadDetails) {
              element2.workloadDetails.details.forEach((element5) => {
                dataWorkload.push(element5.num)
                datax1.push(element5.time.substring(11, 16))
              })
              data2.aa.push({ y: dataWorkload, name: 'workLoad', backgroundColor: 'workLoad' })
            }
            if (data2.dataX.length === 0) {
              data2.dataX = datax1
            }

            data1.datas.push(data2)
          })
          data1.role = element.employeeType.employeeTypeName
          _this.lineChartData.push(data1)
        })
        _this.chartData = { lineChartData: _this.lineChartData, loading: false }
        _this.WorkloadLoading = false
        _this.coverLoading = false
      }
    },
    init() {
      // this.loading = true
      this.chartData.loading = true
      var data = {
        rosterIds: this.rosterSettingVersionId.toString(),
        shiftPlanIds: '',
        workloadId: this.searchForm.workloadId || '',
        beginDate: this.searchDate[0] || '',
        endDate: this.searchDate[1] || ''
      }
      chartDeatils(data)
        .then((response) => {
          this.handleData(response.data.data)
          this.chartData.loading = false
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    search2() {
      this.lineChartData = []
      this.init()
    },
    applyClick() {
      this.chartData.loading = true
      this.WorkloadLoading = true
      this.lineChartData = []
      this.chartData = {}
      this.init()
    },
    goBack() {
      this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, method: this.searchForm.type, businessDomainId: this.$route.query.businessDomainId } })
    },
    jumpCover() {
      this.$router.push({ path: '/prepare/compareDocNew', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, businessDomainId: this.$route.query.businessDomainId } })
    }
  }
}
</script>
<style scoped>
/* header */
.search-area {
  background: #172449;
  margin: 20px 0;
  padding: 10px;
}

.search-area /deep/ .el-col {
  height: 40px;
}
.workload-top {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  font-size: 14px;
  margin-bottom: -9px;
  background-color: #172449;
}

.span-value {
  margin-left: 10px;
  margin-right: 10px;
}
.foot {
  background: #172449;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0 24px;
  width: 100%;
  height: 80px;
}
.foot .el-button {
  position: absolute;
  bottom: 20px;
}
</style>
