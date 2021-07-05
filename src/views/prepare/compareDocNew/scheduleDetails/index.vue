<template>
  <div class="body">
    <div class="search-area">
      <el-form :model="searchForm" label-width="120px" :inline="true" :label-position="position">
        <el-row>
          <el-col :md="24" :lg="24" :xl="24">
            <el-form-item label="名称" label-width="120px">
              <span>{{ detailInfo.name?detailInfo.name:'-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="14" :lg="7" :xl="6">
            <el-form-item label="工作量" label-width="100px">
              <span>{{ detailInfo.workloadName?detailInfo.workloadName.substring(0,12):'-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="9" :xl="8">
            <el-form-item label="出勤规则" label-width="100px">
              <span>{{ detailInfo.ruleName?detailInfo.ruleName.substring(0,18):'-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="8" :xl="10">
            <el-form-item label="排班区间" label-width="80px">
              <span v-if="detailInfo.beginDate">
                <span>{{ detailInfo.beginDate }} - {{ detailInfo.endDate?detailInfo.endDate:'' }}</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="14" :lg="7" :xl="6">
            <el-form-item label="限定人数">
              <span>{{ detailInfo.staffNumber ? detailInfo.staffNumber: '不限定人数' }}</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="9" :xl="8">
            <el-form-item label="覆盖权重" label-width="100px">
              <span>{{ detailInfo.weights }}</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="8" :xl="10">
            <el-form-item label="覆盖模式" label-width="80px">
              <span v-if="detailInfo.type">{{ detailInfo.fullCover=='0'?'非全覆盖':'全覆盖' }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottom">
      <div class="workload-top">
        <div class="span-value">
          <label for>开始与结束日期&nbsp;</label>
          <el-date-picker v-model="searchDate" size="small" style="width:300px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search2" />
        <el-button type="primary" style="margin-left:30px;" size="small" @click="seeClick">查看排班统计</el-button>
      </div>
      <div v-if="noData" style="font-size:16px;text-align:center;height:40px;line-height:40px;background:#172449">暂无数据</div>
      <bottom-charts v-if="!noData" :chart-data="chartData" :loading="chartData.loading" />
    </div>
    <div class="foot">
      <el-button size="small" style="right:150px" @click="goBack">返 回</el-button>
      <el-button size="small" style="right:60px" type="primary" @click="jumpCover">比较覆盖</el-button>
    </div>
    <div>
      <el-dialog v-dialogDrag title="排班统计表" :visible.sync="landDialogVisible" width="40%" :before-close="cancelAddLand">
        <div v-for="(item, i) in tableData " :key="i">
          <span>{{ item.employeeTypeName }}</span>
          <el-table ref="multipleTable" :data="item.days" style="width: 100%" border show-summary :summary-method="((param)=> getSummaries(param,i))" highlight-current-row @current-change="handleCurrentChange">
            <el-table-column type="index" width="50" />
            <el-table-column label="日期" prop="day" />
            <el-table-column label="出勤工时" prop="totalDayTime" />
            <el-table-column label="任务覆盖率" prop="coverage">
              <template slot-scope="scope">
                {{ scope.row.coverage |joinData }}
              </template>
            </el-table-column>
            <el-table-column label="工时利用率" prop="usageRate">
              <template slot-scope="scope">
                {{ scope.row.usageRate |joinData }}
              </template>
            </el-table-column>

          </el-table>

        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { chartDeatils, detailsData, statisticsData } from '@/apiNew/scheduleDetails'
import bottomCharts from '../components/bottomCharts'
export default {
  components: { bottomCharts },
  filters: {
    joinData(val) {
      var str = Number(val * 100).toFixed(1)
      str += '%'
      return str
    }
  },
  data() {
    return {
      detailInfo: {},
      tableData: [],
      landDialogVisible: false,
      noData: false,
      searchDate: ['', ''],
      rosterSettingVersionId: this.$route.query.rosterSettingVersionId,
      lineChartData: [],
      chartData: {},
      searchForm: {},
      position: 'right'
    }
  },
  created() {
    if (this.rosterSettingVersionId) {
      this.init()
      this.detailsData()
    }
  },
  methods: {
    detailsData() {
      var data = {
        id: this.rosterSettingVersionId
      }
      detailsData(data)
        .then(response => {
          this.detailInfo = response.data.data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    confirmApp(row) {
      this.Workload = row
    },
    seeClick() {
      var data = {
        rosterIds: this.rosterSettingVersionId.toString(),
        beginDate: this.searchDate[0] || '',
        endDate: this.searchDate[1] || ''
      }
      statisticsData(data).then(response => {
        if (response.data.code == 200) {
          this.tableData = response.data.data
        }
      })
      this.landDialogVisible = true
    },
    cancelAddLand() {
      this.landDialogVisible = false
    },
    handleCurrentChange() {},
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
        // this.loading = false
        _this.chartData.loading = false
        _this.WorkloadLoading = false
        _this.coverLoading = false
      } else {
        data.forEach(element => {
          var data1 = {}
          data1.role
          data1.datas = []
          element.dailyCoverResult.forEach(element2 => {
            var data2 = {}
            data2.dataX = []
            data2.aa = []
            data2.kpi = []
            data2.name = element.employeeType.employeeTypeName
            data2.day = element2.date
            data2.maxRosterNum = element.maxRosterNum
            element2.coverDetails.forEach(element3 => {
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
              element3.details.forEach(element4 => {
                datax.push(element4.time.substring(11, 16))
                datay.push(element4.num)
              })
              data2.aa.push({ y: datay, name: element.employeeType.employeeTypeName, backgroundColor: element.employeeType.employeeTypeName })
              // if (element2.workloadDetails) {
              //   element2.workloadDetails.details.forEach(element5 => {
              //     dataWorkload.push(element5.num)
              //   })
              //   data2.aa.push({ y: dataWorkload, name: 'workLoad', backgroundColor: 'workLoad' })
              // }
              data2.dataX = datax
            })
            var datax1 = []
            var dataWorkload = []
            if (element2.workloadDetails) {
              element2.workloadDetails.details.forEach(element5 => {
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
        this.loading = false
      }
    },
    init() {
      // this.loading = true
      this.chartData.loading = true
      var data = {
        rosterIds: this.rosterSettingVersionId.toString(),
        shiftPlanIds: '',
        workloadId: '',
        beginDate: this.searchDate[0] || '',
        endDate: this.searchDate[1] || ''
      }
      chartDeatils(data)
        .then(response => {
          this.loading = true
          this.handleData(response.data.data)
          this.chartData.loading = false
        })
        .catch(e => {
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
    goBack() {
      this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, method: this.detailInfo.type, businessDomainId: this.$route.query.businessDomainId }})
    },
    jumpCover() {
      this.$router.push({ path: '/prepare/compareDocNew', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, businessDomainId: this.$route.query.businessDomainId }})
    },
    toPercent(point) {
      var str = Number(point * 100).toFixed(1)
      str += '%'
      return str
    },
    getSummaries(param, i) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }

        switch (column.property) {
          case 'totalDayTime':
            sums[index] = this.tableData[i].totalTime // 值取自后台
            break
          case 'coverage':
            sums[index] = Number(this.tableData[i].totalCover * 100).toFixed(1) + '%' // 值取自后台
            break
          case 'usageRate':
            sums[index] = Number(this.tableData[i].totalUser * 100).toFixed(1) + '%' // 值取自后台
            break
          default:
            break
        }
      })
      return sums
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
