<template>
  <div style="width:100%;height:100%;backgroun-color:black;padding-top:60px">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="运行">
        <div class="peizhi">
          <h3>基础配置</h3>
          <div>
            <span>
              轮班计划名称：
              <el-input v-if="workloadDocument.name" v-model="workloadDocument.name" size="small" style="width:160px" disabled />
            </span>
            <span>
              工作量文件：
              <el-input v-if="workloadDocument.workloadDocument" v-model="workloadDocument.workloadDocument.name" size="small" style="width:160px" disabled />
            </span>
            <span>
              出勤规则文件：
              <el-input v-if="workloadDocument.rulesetDocument" v-model="workloadDocument.rulesetDocument.name" size="small" style="width:160px" disabled />
            </span>
            <div style="display: inline-block;">
              <span>
                覆盖权重：
                <el-tooltip class="item" effect="dark" content="权重越高，需要排班的人越多。" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-select v-model="workloadDocument.costU" placeholder="请选择" style="width:160px;height:32px" size="mini">
                <el-option v-for="item in optionsCostU" :key="item.costId" :label="item.costName" :value="item.costId" />
              </el-select>
            </div>
            <div style="display: inline-block;margin-left:20px">
              <span>
                覆盖模式：
                <el-tooltip class="item" effect="dark" content="是否覆盖工作量" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-select v-model="workloadDocument.fullCover" placeholder="请选择" style="width:160px;height:32px" size="mini">
                <el-option v-for="item in optionsCover" :key="item.costId" :label="item.costName" :value="item.costId" />
              </el-select>
            </div>
            <span>
              <el-button v-if="offon" type="primary" size="small" @click="recalculation">重新计算</el-button>
              <el-button v-else type="primary" size="small" @click="stopClick">停止计算</el-button>
            </span>
          </div>
        </div>
        <div class="runtime-box">
          <div v-if="noData" style="width: 100%;height: 100px;line-height: 100px;text-align: center;">暂无数据</div>
          <div v-loading="loading" class="runtime-bottom" element-loading-text="数据计算中..." style="min-height:300px">
            <div v-for="(item,i) in lineChartData" :key="i">
              <div class="left">{{ item.role }}</div>
              <div class="right">
                <div v-for="(items,index) in item.datas" :key="index" class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items)">
                  <p>{{ items.day }}</p>
                  <line-chart :chart-data="item.datas[index]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="轮班细节表">
        <div class="shift-box">
          <!-- <div class="shift-top">
            <div class="shift-top1">保存轮班计划</div>
            <div class="shift-top2">导出</div>
            <div class="print-file">打印</div>
          </div>-->
          <div class="shift-bottom">
            <el-table v-loading="loading" :data="tableData" stripe border>
              <el-table-column type="index" width="50" />
              <el-table-column prop="date" label="日期">
                <template slot-scope="scope">{{ scope.row.startTime.substring(0,10) }}</template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间">
                <template slot-scope="scope">{{ scope.row.startTime.substring(11,16) }}</template>
              </el-table-column>
              <el-table-column prop="finishTime" label="结束时间">
                <template slot-scope="scope">{{ scope.row.finishTime.substring(11,16) }}</template>
              </el-table-column>
              <el-table-column prop="duration" label="持续时长(分钟)" />
              <el-table-column prop="employeeTypeName" label="员工类型名称" />
              <el-table-column prop="shiftCount" label="数量" />
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag class="charTitle" :title="lineChartDataBig.day" center :visible.sync="dialogTableVisible" width="60%">
      <h3>
        <!-- {{ lineChartDataBig.day }} -->
        <span>
          <i v-if="lineChartDataBig">工作量覆盖率 : {{ lineChartDataBig.coverage }}%</i>
          <i v-if="lineChartDataBig">工时利用率 : {{ lineChartDataBig.usageRate }}%</i>
          <i v-if="lineChartDataBig">员工不足率 : {{ lineChartDataBig.underStaff }}%</i>
        </span>
      </h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px" />
    </el-dialog>
  </div>
</template>

<script>
import { shiftPlan, shiftPlanShift, recalculation, byLoop, stopClick } from '@/api/workload' // 渲染图表
import { bySettingId } from '@/api/makeShiftPlan'
// import cssRuleTop from '@/components/cssRule/cssRuleTop.vue'
import LineChart from '@/components/echarts/LineChart'
import LineChartBig from '@/components/echarts/LineChartBig'
export default {
  name: 'ShiftResultHidden',
  components: { LineChart, LineChartBig },
  data() {
    return {
      documentId: this.$route.query.shiftPlanDocumentId,
      loading: false,
      offon: false,
      timer: '',
      lineChartDataBig: '',
      workloadDocument: {},
      dialogTableVisible: false,
      lineChartData: [],
      lineChartData2: [],
      tableData: [],
      noData: false,
      tableData3: [
        { label: '平均轮班时长', value: '86:40' },
        { label: '已覆盖工时', value: '80:00' },
        { label: '未覆盖工作量峰值', value: '12' },
        { label: '工作量峰值', value: '30' },
        { label: '轮班数', value: '121' },
        { label: '冗余工时', value: '08:20' },
        { label: '轮班成本', value: '231312' },
        { label: '总轮班时长', value: '356:00' },
        { label: '工作量覆盖率', value: '0.88' },
        { label: '总工时', value: '340' }
      ],
      optionsCostU: [
        { costId: '0.5', costName: '0.5' },
        { costId: '1', costName: '1' },
        { costId: '3', costName: '3' },
        { costId: '5', costName: '5' },
        { costId: '7', costName: '7' },
        { costId: '9', costName: '9' },
        { costId: '10', costName: '10' },
        { costId: '100', costName: '100' },
        { costId: '1000', costName: '1000' }
      ],
      optionsCover: [
        { costId: 0, costName: '非全覆盖' },
        { costId: 1, costName: '全覆盖' }
      ],
      tableData1: [
        { label: '覆盖率', value: '0.8' },
        { label: '劳动生产率', value: '0.89' },
        { label: '工时利用率', value: '0.78' },
        { label: '测算人数', value: '06:40' },
        { label: '人均保障', value: '06:40' }
      ],
      options: [
        {
          value: '选项1',
          label: '员工类型'
        },
        {
          value: '选项2',
          label: '员工类型和日期'
        },
        {
          value: '选项3',
          label: '技能和日期'
        }
      ],
      value: '员工类型'
    }
  },
  created() {
    this.workloadsetting()
    this.bySettingIdFn()
    this.byLoop()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    workloadsetting() {
      // init
      this.loading = true
      shiftPlan(this.documentId).then(response => {
        var _this = this
        if (response.data.data.length === 0) {
          this.noData = true
        } else {
          this.noData = false
          response.data.data.forEach(function(cur) {
            // 此处接收一行数据
            var data1 = {}
            data1.role
            data1.datas = []
            cur.dailyCoverResult.forEach(function(cur2) {
              // 此处接收单表数据
              var data2 = {}
              data2.day
              data2.actualData = []
              data2.dataX = []
              data2.expectedData = []
              data2.expectedData2 = []
              // response.data[cur][cur2].forEach(element => {
              data2.day = cur2.date
              cur2.coverDetails.forEach(function(cur3) {
                data2.maxNum = cur3.maxNum
                data2.warnLine = false
                data2.firstName = cur3.resourceName
                data2.secondName = cur2.workloadDetails.resourceName
                data2.coverage = (cur3.coverRate * 100).toFixed(2)
                data2.underStaff = (cur3.underStaff * 100).toFixed(2)
                data2.usageRate = (cur3.usageRate * 100).toFixed(2)
                cur3.details.forEach(function(cur4) {
                  data2.dataX.push(cur4.time)
                  data2.expectedData.push({ name: cur4.time, value: [cur4.time, cur4.num] })
                })
                // console.log(data2,'员工不足率')
                // data2.actualData.push({ name: element.startTime, value: [element.startTime, element.workload] })
              })
              var datax1 = []
              cur2.workloadDetails.details.forEach(element => {
                datax1.push(element.time)
                data2.actualData.push({ name: element.time, value: [element.time, element.num] })
              })
              if (data2.dataX.length === 0) {
                data2.dataX = datax1
              }
              data1.datas.push(data2)
            })
            data1.role = cur.employeeType.employeeTypeName
            _this.lineChartData.push(data1)
          })
        }
        _this.offon = true

        _this.loading = false
      })
    },
    showEchart(items) {
      // 点击显示大图
      // console.log(items, 'items')
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    bySettingIdFn() {
      bySettingId(this.documentId).then(response => {
        if (response.data.data) {
          this.workloadDocument = response.data.data
          switch (response.data.data.speedMode) {
            case '1':
              this.workloadDocument.speedMode = '速度最优'
              break
            case '2':
              this.workloadDocument.speedMode = '速度优先'
              break
            case '3':
              this.workloadDocument.speedMode = '均衡模式'
              break
            case '4':
              this.workloadDocument.speedMode = '搜索结果优先'
              break
            case '5':
              this.workloadDocument.speedMode = '搜索结果最优'
              break
            default:
              break
          }
          switch (response.data.data.employeeMode) {
            case '1':
              this.workloadDocument.employeeMode = '人员不足最优'
              break
            case '2':
              this.workloadDocument.employeeMode = '人员不足偏好'
              break
            case '3':
              this.workloadDocument.employeeMode = '均衡模式'
              break
            case '4':
              this.workloadDocument.employeeMode = '人员过剩偏好'
              break
            case '5':
              this.workloadDocument.employeeMode = '人员过剩最优'
              break
            case '6':
              this.workloadDocument.employeeMode = '全覆盖'
              break
            default:
              break
          }
        }
        // console.log(this.workloadDocument, 44)
      })
    },
    handleClick(tab) {
      if (tab.index === '1') {
        // 轮班
        this.loading = true
        shiftPlanShift(this.documentId).then(response => {
          this.loading = false
          this.tableData = response.data.data
        })
      }
    },
    byLoop() {
      // 轮状态
      this.offon = false
      clearInterval(this.timer)
      byLoop().then(response => {
        if (response.data) {
          if (response.data.calculateStatus === 'complete') {
            clearInterval(this.timer)
            this.documentId = response.data.shiftPlanDocumentId
            this.shiftPlanDocumentId2 = response.data.shiftPlanDocumentId
            this.workloadsetting()
            this.offon = true
          }
          if (response.data.calculateStatus === 'calculating') {
            this.timer = setInterval(this.byLoop, 3000)
            this.loading = true

            this.loadingtext = '已计算　' + response.data.duration / 1000 + '　秒'
          }
          if (response.data.calculateStatus === 'exception') {
            clearInterval(this.timer)
            this.loading = false
            this.loadingtext = ''
            this.offon = true
            this.noData = true
            this.$message.error(response.data.message)
          }
          if (response.data.calculateStatus === 'interrupt') {
            clearInterval(this.timer)
            this.loading = false
            this.loadingtext = ''
            this.offon = true
            this.noData = true
          }
        }
      })
    },
    recalculation() {
      this.loading = true
      this.offon = false
      this.noData = false
      this.lineChartData = []
      var data = {
        shiftPlanSettingId: this.documentId,
        costU: this.workloadDocument.costU,
        fullCover: this.workloadDocument.fullCover
      }
      recalculation(data).then(res => {
        if (res.data.code == 200) {
          this.byLoop()
        }
      })
    },
    stopClick() {
      stopClick().then(rea => {
        this.loading = false
        this.offon = true
        this.noData = true
        clearInterval(this.timer)
      })
    },
    timestampToTime(cjsj) {
      var date = new Date(cjsj) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes()
      // var s = date.getSeconds()
      return Y + M + D + h + m
    }
  }
}
</script>
<style lang="scss" scoped>
.peizhi {
  padding: 10px;
  h3 {
    font-weight: none !important;
  }
  span {
    margin: 0 10px;
  }
}

// .bg-color {
//   background-color: #232c47;
//   width: 100%;
//   height: 60px;
//   font-size: 16px;
// }
// .header-left,
// .header-middle,
// .header-right {
//   width: 100%;
//   height: 60px;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   border-right: 1px solid #434B61;
//   color: #0a9fc8;
// }
// .header-left1 {
//   display: flex;
//   flex-direction: column;
//   height: 60px;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// }
// .img-style {
//   width: 14px;
//   height: 14px;
// }

/* 这里是轮班样式 */
.shift-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 14px;
  color: white;
}
.shift-top {
  width: 100%;
  height: 40px;
  display: flex;
  align-content: center;
}
.shift-top1,
.shift-top2,
.print-file {
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid white;
  letter-spacing: 2px;
}
.shift-top2,
.print-file {
  margin-left: 15px;
}
.shift-bottom {
  margin-top: 10px;
}
</style>
