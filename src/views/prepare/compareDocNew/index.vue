<template>
  <div class="body">
    <div class="work-header">
      <div class="header-box">
        <div class="header-right-bottom-left">
          <p>
            <el-button size="small" type="info" @click="addShift('roster')">添加排班表</el-button>
          </p>
          <p>
            <el-button size="small" type="primary" :loading="coverLoading" @click="show()">比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 较</el-button>
          </p>
        </div>
        <div class="header-right-bottom-right">
          <el-table :data="tableData" stripe @cell-dblclick="confirmApp">
            <el-table-column fixed type="index" label="编号" width="70" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="workloadName" label="工作量" />
            <el-table-column prop="beginDate" label="开始时间" />
            <el-table-column prop="endDate" label="结束时间" />
            <el-table-column prop="color" label="自定义颜色">
              <template slot-scope="scope">
                <el-color-picker v-model="scope.row.color" size="small" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="open(scope.$index, scope.row)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-for="(item, i) in tableData2" :key="i" class="center" style="margin-top: 20px">
      <span>{{ item.rosterName }}</span>
      <el-table :data="item.employeeTypes" stripe border>
        <el-table-column prop="employeeTypeName" label="员工类型" />
        <el-table-column prop="resourceNumber" label="资源需求数量" />
        <el-table-column prop="totalTime" label="工作总时长" />
        <el-table-column prop="averageCover" label="平均任务覆盖率">
          <template slot-scope="scope">{{ scope.row.averageCover | joinData }}</template>
        </el-table-column>
        <el-table-column prop="averageUse" label="平均工时利用率">
          <template slot-scope="scope">{{ scope.row.averageUse | joinData }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="workload-top">
        <div class="span-value">
          <label for>开始与结束日期&nbsp;</label>
          <el-date-picker v-model="searchDate" size="small" style="width: 300px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search2" />
      </div>
      <div class="work-bottom">
        <div v-if="noData" style="font-size: 16px; text-align: center; height: 40px; line-height: 40px; background: #172449">暂无数据</div>
        <!-- <bottom-charts1 :line-chart-data="lineChartData" :loading="chartData.loading" /> -->
        <div v-if="!noData" v-loading="loading" class="runtime-bottom" element-loading-text="数据读取中...">
          <div v-for="(item, i) in lineChartData" :key="i">
            <div class="left">{{ item.role }}</div>
            <div class="right">
              <div v-for="(items, index2) in item.datas" :key="index2" class="datalist" :rowIndex="i" :colIndex="index2" @click="showEchart(items)">
                <p>{{ items.day }}</p>
                <line-chart :chart-data="item.datas[index2]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 弹框 -->
      <el-dialog v-dialogDrag class="charTitle" :title="lineChartDataBig.day" :visible.sync="dialogTableVisible" width="60%" center @close="closeChartdata">
        <h3>
          <span v-if="Array.isArray(lineChartDataBig.kpi)">
            <div v-for="(item, index1) in lineChartDataBig.kpi" :key="index1" :style="{ color: item.color }">
              <i>{{ item.lineName }} :</i>
              <i>工作量覆盖率 : {{ item.coverage }}%</i>
              <i>工时利用率 : {{ item.usageRate }}%</i>
            </div>
          </span>
          <span v-else-if="lineChartDataBig.kpi">
            <i>{{ item.lineName }} :</i>
            <i>工作量覆盖率 : {{ lineChartDataBig.kpi.coverage }}%</i>
            <i>工时利用率 : {{ lineChartDataBig.kpi.usageRate }}%</i>
          </span>
        </h3>
        <LineChartBig :key="Math.random()" :chart-data="lineChartDataBig" style="width: 100%; height: 600px" />
      </el-dialog>
    </div>
    <!-- 添加排班表 -->
    <el-dialog v-dialogDrag class="covercheckbox" :title="title" :visible.sync="dialogTableShiftPlan" width="40%">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 500px">
        <el-checkbox-group v-model="checkedDatas">
          <el-checkbox v-for="(item, index) in checkeData" :key="index" :label="item" :disabled="Number(rosterSettingVersionId) === item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableShiftPlan = false">取 消</el-button>
        <el-button type="primary" @click="covercheckDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { initNewTable, chartDeatils, ContrastData } from '@/apiNew/scheduleDetails'
import bottomCharts1 from './components/bottomCharts1'
import LineChart from '@/components/echarts/LineChartcover'
import LineChartBig from '@/components/echarts/LineChartBigcover'
export default {
  components: { bottomCharts1, LineChart, LineChartBig },
  filters: {
    joinData(val) {
      var str = Number(val * 100).toFixed(1)
      str += '%'
      return str
    }
  },
  data() {
    return {
      noData: false,
      coverLoading: false,
      Workload: {},
      loading: false,
      radiolist: {},
      radioData: [],
      searchDate: ['', ''],
      title: '',
      dialogTableChangcover: false,
      dialogTableShiftPlan: false,
      rosterSettingVersionId: this.$route.query.rosterSettingVersionId,
      dialogTableVisible: false,
      lineChartData: [],
      lineChartDataBig: {},
      chartData: { lineChartData: {}, loading: false, index: Math.random() },
      activeNames: ['1'],
      checkList: [],
      checkeData: [],
      checkedDatas: [],
      tableData: [],
      tableData2: [],
      searchCondition: {}
    }
  },
  created() {
    if (this.rosterSettingVersionId) {
      this.init()
    }
  },
  methods: {
    confirmApp(row) {
      this.Workload = row
    },
    handleData(data) {
      this.checkedDatas = []
      var _this = this
      var noData = false
      console.log(this.tableData, 'tableData2')
      for (let i = 0; i < data.length; i++) {
        if (data[i].dailyCoverResult.length !== 0) {
          noData = true
          break
        }
      }
      if (!noData) {
        this.noData = true
        this.loading = false
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
            element2.coverDetails.forEach((element3) => {
              if (this.tableData.length !== 0) {
                this.tableData.forEach((item) => {
                  if (element3.id === item.id) {
                    element3.color = item.color
                  }
                })
              } else {
                element3.color = '#09f604'
              }
              data2.kpi.push({
                lineName: element3.name,
                coverage: (element3.coverRate * 100).toFixed(2),
                underStaff: (element3.underStaff * 100).toFixed(2),
                usageRate: (element3.usageRate * 100).toFixed(2),
                maxNum: element3.maxNum,
                warnLine: false,
                color: element3.color
              })
              var datax = []
              var datay = []
              element3.details.forEach((element4) => {
                datax.push(element4.time.substring(11, 16))
                datay.push(element4.num)
              })
              data2.aa.push({ y: datay, name: element3.name, backgroundColor: element3.color })
              data2.dataX = datax
            })
            console.log(element2.coverDetails, 6677)
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
            // var obj = {}
            // data2.aa = data2.aa.reduce(function(item, next) {
            //   obj[next.name] ? '' : (obj[next.name] = true && item.push(next))
            //   return item
            // }, [])
            data1.datas.push(data2)
          })
          data1.role = element.employeeType.employeeTypeName
          _this.lineChartData.push(data1)
        })
        _this.chartData = Object.assign({}, this.chartData, {
          lineChartData: _this.lineChartData,
          loading: false
        })
        _this.coverLoading = false
      }
    },

    init() {
      this.loading = true

      // this.chartData.loading = true
      if (this.tableData.length !== 0) {
        var rosterIds = []
        this.tableData.forEach((element) => {
          rosterIds.push(element.id)
        })
      }
      var data = {
        rosterIds: this.tableData.length === 0 ? this.rosterSettingVersionId.toString() : rosterIds.toString(),
        shiftPlanIds: '',
        workloadId: '',
        beginDate: this.searchDate[0] || '',
        endDate: this.searchDate[1] || '',
        tableData: this.tableData
      }
      this.searchCondition = data
      chartDeatils(data)
        .then((response) => {
          this.coverLoading = false
          var data = response.data.data
          if (data[0].dailyCoverResult.length !== 0) {
            this.searchDate = [data[0].dailyCoverResult[0].date, data[0].dailyCoverResult[data[0].dailyCoverResult.length - 1].date]
            if (this.tableData.length === 0) {
              this.tableData = []
              this.tableData.push({
                name: data[0].dailyCoverResult[0].coverDetails[0].name,
                workloadName: data[0].dailyCoverResult[0].coverDetails[0].workloadName,
                id: data[0].dailyCoverResult[0].coverDetails[0].id,
                beginDate: data[0].dailyCoverResult[0].date,
                endDate: data[0].dailyCoverResult[data[0].dailyCoverResult.length - 1].date,
                color: '#09f604'
              })
            }
          }
          this.handleData(data)
          // this.chartData.loading = false
          this.loading = false
        })
        .catch((e) => {
          this.coverLoading = false
          // this.chartData.loading = false
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
      ContrastData(data.rosterIds).then((response) => {
        this.tableData2 = response.data.data
      })
    },
    addShift: function(e) {
      this.dialogTableShiftPlan = true
      this.checkedDatas = []
      this.title = '选择排班表'
      var data = {
        id: this.$route.query.businessDomainId || '',
        name: this.input21 || ''
      }
      initNewTable(data).then((response) => {
        this.checkeData = response.data.data
      })
    },
    covercheckDialog() {
      this.dialogTableShiftPlan = false
      // this.checkedDatas.forEach((element) => {
      //   if (this.tableData.length !== 0) {
      //     this.tableData.forEach((item) => {
      //       if (element.id === item.id) {
      //         element.color = item.color
      //       } else {
      //         element.color = '#09f604'
      //       }
      //     })
      //   } else {
      //     element.color = '#09f604'
      //   }
      // })
      this.tableData = this.tableData.concat(this.checkedDatas)
    },
    show() {
      // 比较覆盖图
      this.loading = true
      this.coverLoading = true
      this.lineChartData = []
      this.init()
    },
    search2() {
      this.lineChartData = []
      this.init()
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = {}
      // console.log(items, 66688)
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeChartdata() {
      // this.lineChartDataBig = {}
    },
    open(index, row) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.coverRadio label {
  display: block;
  color: #fff;
  margin: 10px;
}
.covercheckbox label {
  margin: 10px;
}
/* header */
.header-box {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 5px;
  align-content: center;
  background-color: #172449;
}
.header-right {
  width: 10%;
  height: 100%;
}
.header-right-bottom {
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  padding-left: 20px;
  padding-top: 10px;
}
.header-right {
  width: 78%;
  margin-left: 10px;
}
.header-right-bottom {
  display: flex;
}
.bottom {
  margin-top: 10px;
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
.header-right-bottom-left {
  width: 21%;
  margin-right: 10px;
  padding: 0 7%;
  border-right: 1px solid #425079;
}
.header-right-bottom-right {
  width: 78%;
  height: 150px;
  overflow: auto;
}
</style>
