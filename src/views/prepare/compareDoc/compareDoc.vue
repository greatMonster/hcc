<template>
  <div class="body">
    <div class="work-header">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="请选择要比较的文档" name="1">
          <div class="header-box">
            <div class="header-middle">
              <div class="header-middle-title">当前工作量</div>
              <div class="header-middle-bottom">
                <div>名称: {{ Workload.workLoadName }}</div>
                <div>从: {{ Workload.fromDate }}</div>
                <div>到: {{ Workload.toDate }}</div>
                <p>
                  <el-button size="mini" type="primary" @click="changeWorkload">改变工作量</el-button>
                  <el-button size="mini" type="primary" :loading="WorkloadLoading" @click="changeMarkWorkload">比较覆盖图</el-button>
                </p>
              </div>
            </div>
            <div class="header-right">
              <div class="header-right-title">文档</div>
              <div class="header-right-bottom">
                <div class="header-right-bottom-left">
                  <p>
                    <el-button size="mini" type="primary" @click="addShift('shiftPlan')">选择轮班计划</el-button>
                  </p>
                  <p>
                    <el-button size="mini" type="primary" @click="addShift('roster')">选择排班表</el-button>
                  </p>
                  <p>
                    <el-button size="mini" type="primary" :loading="coverLoading" @click="show()">比较覆盖图</el-button>
                  </p>
                </div>
                <div class="header-right-bottom-right">
                  <el-table :data="tableData" stripe @cell-dblclick="confirmApp">
                    <el-table-column fixed type="index" label="序列号" width="70" />
                    <el-table-column prop="coverName" label="名称" />
                    <el-table-column prop="workLoadName" label="工作量" />
                    <el-table-column prop="fromDate" label="从" />
                    <el-table-column prop="toDate" label="到" />
                    <el-table-column prop="color" label="自定义颜色">
                      <template slot-scope="scope">
                        <el-color-picker v-model="scope.row.color" size="mini" />
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="open(scope.$index,scope.row)">删 除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 中间区域KPIs展示 -->
    <!-- <div class="work-middle">
      <kpis-display />
    </div>-->
    <!-- 底部图表展示区域 -->
    <div class="work-bottom">
      <div v-loading="loading" class="runtime-bottom" element-loading-text="数据读取中...">
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
    <!-- 弹框 -->
    <el-dialog v-dialogDrag class="charTitle" title="排班表覆盖图" :visible.sync="dialogTableVisible" width="60%">
      <h3>
        {{ lineChartDataBig.day }}
        <span v-if="Array.isArray(lineChartDataBig.kpi)">
          <div v-for="(item,index) in lineChartDataBig.kpi" :key="index" :style="{ color: item.color}">
            <i>{{ item.lineName }} :</i>
            <i>工作量覆盖率 : {{ item.coverage }}%</i>
            <i>工时利用率 : {{ item.usageRate }}%</i>
            <!-- <i>员工不足率 : {{ item.underStaff }}%</i> -->
          </div>
        </span>
        <span v-else-if="lineChartDataBig.kpi">
          <i>{{ item.lineName }} :</i>
          <i>工作量覆盖率 : {{ lineChartDataBig.kpi.coverage }}%</i>
          <i>工时利用率 : {{ lineChartDataBig.kpi.usageRate }}%</i>
          <!-- <i>员工不足率 : {{ lineChartDataBig.kpi.underStaff }}%</i> -->
        </span>
      </h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px" />
    </el-dialog>
    <el-dialog v-dialogDrag class="covercheckbox" :title="title" :visible.sync="dialogTableShiftPlan" width="40%">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height:500px">
        <el-checkbox-group v-model="checkedDatas">
          <el-checkbox v-for="(item,index) in checkeData" :key="index" :label="item">{{ item.coverName }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableShiftPlan = false">取 消</el-button>
        <el-button type="primary" @click="covercheckDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 改变工作量 -->
    <el-dialog v-dialogDrag class="coverRadio" :title="title" :visible.sync="dialogTableChangcover" width="40%">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height:500px">
        <el-radio-group v-model="radiolist">
          <el-radio v-for="(item,index) in radioData" :key="index" :label="item">{{ item.workLoadName }}</el-radio>
        </el-radio-group>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableChangcover = false">取 消</el-button>
        <el-button type="primary" @click="ChangcoverDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import LineChart from '@/components/echarts/LineChartcover'
import LineChartBig from '@/components/echarts/LineChartBigcover'
import { cover } from '@/api/schedule'
import { shiftPlan, roster, show, workload, change } from '@/api/compareDoc'
export default {
  components: { LineChart, LineChartBig },
  data() {
    return {
      WorkloadLoading: false,
      coverLoading: false,
      Workload: {},
      radiolist: {},
      radioData: [],
      title: '',
      dialogTableChangcover: false,
      dialogTableShiftPlan: false,
      rosterSettingVersionId: this.$route.query.rosterSettingVersionId,
      dialogTableVisible: false,
      loading: false,
      lineChartData: [],
      lineChartDataBig: [],
      activeNames: ['1'],
      checkList: [],
      checkeData: [],
      checkedDatas: [],
      tableData: []
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
      var _this = this
      Object.getOwnPropertyNames(data).forEach(function(cur) {
        // 此处接收单行数据
        var data1 = {}
        data1.role
        data1.datas = []
        Object.getOwnPropertyNames(data[cur]).forEach(function(cur2) {
          // 此处接收单表数据
          var data2 = {}
          data2.dataX = []
          data2.aa = []
          data2.kpi = []
          Object.getOwnPropertyNames(data[cur][cur2]).forEach(function(element) {
            data2.day = cur2
            data2.name = element
            if (data[cur][cur2][element].coverage) {
              data2.kpi.push({
                lineName: element.indexOf('-') > -1 ? element.substring(0, element.indexOf('-')) : element,
                coverage: (data[cur][cur2][element].coverage * 100).toFixed(2),
                underStaff: (data[cur][cur2][element].underStaff * 100).toFixed(2),
                usageRate: (data[cur][cur2][element].usageRate * 100).toFixed(2),
                maxNum: 3,
                warnLine: false,
                color: element.substring(element.indexOf('#'))
              })
            }
            var datax = []
            var datay = []
            for (var key in data[cur][cur2][element].result) {
              datax.push(key.substring(11, 16))
              datay.push(data[cur][cur2][element].result[key])
            }
            data2.dataX = datax
            data2.aa.push({ y: datay, name: element.substring(0, element.indexOf('-') > 0 ? element.indexOf('-') : element.indexOf('coverage') + 9), backgroundColor: element.substring(element.indexOf('#')) })
          })
          data1.datas.push(data2)
        })
        data1.role = cur
        _this.lineChartData.push(data1)
        console.log(_this.lineChartData, 7777777)
      })
      _this.loading = false
      _this.WorkloadLoading = false
      _this.coverLoading = false
    },
    init() {
      this.loading = true
      cover(this.rosterSettingVersionId).then(response => {
        if (response.code === '200') {
          this.handleData(response.data)
        } else {
          this.loading = false
        }
      })
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    checkboxClick: function(e) {
      console.log(e)
    },
    addShift: function(e) {
      this.dialogTableShiftPlan = true
      if (e === 'shiftPlan') {
        this.title = '选择轮班计划'
        shiftPlan(this.checkedDatas).then(response => {
          this.checkeData = response.data
        })
      } else if (e === 'roster') {
        this.title = '选择排班表'
        roster().then(response => {
          this.checkeData = response.data
        })
      }
    },
    covercheckDialog() {
      this.dialogTableShiftPlan = false
      this.checkedDatas.forEach(element => {
        if (!element.color) {
          element.color = '#09f604'
        }
      })
      this.tableData = this.checkedDatas
    },
    show() {
      // 比较覆盖图
      this.loading = true
      this.coverLoading = true
      this.lineChartData = []
      show(this.tableData).then(response => {
        if (response.code === '200') {
          this.handleData(response.data)
        } else {
          this.loading = false
          this.coverLoading = false
        }
      })
    },
    changeWorkload() {
      this.title = '改变工作量'
      this.dialogTableChangcover = true
      this.workload()
    },
    ChangcoverDialog() {
      // 改变工作量
      this.Workload = this.radiolist
      this.dialogTableChangcover = false
    },
    changeMarkWorkload() {
      // 改变工作量生成覆盖图
      let data = []
      const data2 = []
      let mergeData = []
      data = this.checkedDatas
      data2.push(this.radiolist)
      this.loading = true
      this.WorkloadLoading = true
      this.lineChartData = []
      mergeData = data.concat(data2)
      change(mergeData).then(response => {
        if (response.code === '200') {
          this.handleData(response.data)
        } else {
          this.loading = false
          this.WorkloadLoading = false
        }
      })
    },
    workload() {
      workload().then(response => {
        this.radioData = response.data
      })
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
  align-content: center;
}
.header-left,
.header-middle,
.header-right {
  width: 10%;
  height: 100%;
}
.header-left-title,
.header-middle-title,
.header-right-title {
  width: 100%;
  height: 30px;
  line-height: 20px;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
  font-size: 14px;
}
.header-left-radio,
.header-middle-bottom {
  width: 100%;
  height: 150px;
}
.header-middle {
  width: 20%;
  margin-left: 10px;
}
.header-middle-bottom,
.header-right-bottom {
  height: 150px;
  box-sizing: border-box;
  padding-left: 20px;
  padding-top: 10px;
  background-color: rgb(27, 37, 65);
}
.header-right {
  width: 78%;
  margin-left: 10px;
}
.header-right-bottom {
  display: flex;
}
.header-right-bottom-left {
  width: 18%;
  margin-right: 10px;
}
.header-right-bottom-right {
  width: 78%;
  height: 10em;
  overflow: auto;
}
.work-bottom {
  margin-top: 10px;
}
</style>
