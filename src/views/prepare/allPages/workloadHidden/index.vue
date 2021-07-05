<template>
  <div>
    <section>
      <!-- 第二部分 -->
      <div class="content-box">
        <!-- 选择项描述 -->
        <div class="content-left">
          <!-- 文档 -->
          <div class="doc">
            <div class="doc-title">文档</div>
            <div class="doc-content-box">
              <div class="doc-content1">
                <span>航班计划</span>
                <el-select v-model="FLIGHT_SCHEDULE" placeholder="请选择" class="particle-button" style="width:150px">
                  <el-option v-for="item in flightoptions" :key="item.name" :label="item.name" :value="item.documentId" />
                </el-select>
              </div>
              <div class="doc-content2">
                <span>服务标准</span>
                <el-select v-model="rulesetDocumentId" placeholder="请选择" style="width:150px">
                  <el-option v-for="item in workRulesDocOptions" :key="item.documentId" :label="item.name" :value="item.documentId" />
                </el-select>
              </div>
              <div class="doc-content2">
                工作量名称
                <el-input v-model="shiftPlanName" placeholder="请输入工作量名称" style="width:150px" />
              </div>
            </div>
          </div>
          <!-- 周期 -->
          <div class="recycle">
            <div class="recycle-title">周期</div>
            <div class="recycle-content-box">
              <div class="recycle-content1">
                <span>从日期</span>
                <span>
                  <el-date-picker v-model="fromDate" type="date" placeholder="选择日期" format="yyyy:MM:dd:HH:mm:ss" class="recycle-button" />
                </span>
              </div>
              <div class="recycle-content2">
                <span>到日期</span>
                <span>
                  <el-date-picker v-model="toDate" type="date" placeholder="选择日期" format="yyyy:MM:dd:HH:mm:ss" class="recycle-button" />
                </span>
              </div>
            </div>
          </div>
          <!-- 粒度 -->
          <div class="particle">
            <div class="particle-title">粒度</div>
            <div class="particle-content-box">
              <div class="particle-content1">
                <span>计算</span>
                <span>
                  <el-select v-model="particle01" disabled placeholder="请选择" class="particle-button">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </span>
              </div>
              <div class="particle-content2">
                <span>结果</span>
                <span>
                  <el-select v-model="granularityInterval" placeholder="请选择" class="particle-button">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </span>
              </div>
              <div class="particle-content2">
                <span>抽样模式</span>
                <span>
                  <el-select v-model="workloadSampling" placeholder="请选择" class="particle-button">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </span>
              </div>
            </div>
          </div>
          <div style="text-align: center;width:40%;margin: 14px auto 0;line-height:40px;height:120px;">
            <el-button type="primary" size="mini" @click="generateWorkload">生成工作量</el-button>
            <el-button type="primary" size="mini" @click="mergeWorkload">合并工作量</el-button>
          </div>
        </div>
        <!-- 图表展示 -->
        <div class="content-right">
          <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick2(activeName2)">
            <el-tab-pane label="工作量" name="first">
              <div class="workload">
                <div class="workload-top">
                  <div class="span-value">从</div>
                  <div class="span-value">
                    <el-date-picker v-model="workloadDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" default-value />
                  </div>
                  <div class="span-value">开始 为期</div>
                  <div class="span-value">
                    <el-date-picker v-model="workloadDate2" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" default-value />
                  </div>
                  <div class="span-value">的工作量</div>
                  <el-button @click="search2">查询</el-button>
                </div>
                <div v-loading="listLoading" class="runtime-bottom">
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
            <!-- <el-tab-pane label="航班" name="second">
              <div class="flight">
                <div class="flight-top">
                  <div class="print-file">打印</div>
                  <div class="import-file">导出</div>
                </div>
                <div class="flight-bottom">
                  <el-table v-loading="listLoading" :data="tableData" border stripe>
                    <el-table-column type="index" width="50" />
                    <el-table-column type="expand">
                      <template>
                        <el-table :data="tableData.taskList">
                          <el-table-column v-for="(item,index) in taskTableTitle" :key="index" sortable :label="item.label" :prop="item.prop" />
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column v-for="(item,index) in tableTitle" :key="index" sortable :label="item.label" :prop="item.prop" />
                  </el-table>
                </div>
              </div>
              <el-pagination :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-tab-pane>-->
            <!-- <el-tab-pane label="任务" name="third"> -->
            <!-- <div class="flight target">
                <div class="flight-top">
                  <div class="print-file">打印</div>
                  <div class="import-file">导出</div>
                </div>
                <div class="flight-bottom">
                  <el-table :data="taskList" border stripe>
                    <el-table-column prop="taskName" label="任务名称" />
                    <el-table-column prop="taskStartTime" label="开始时间" />
                    <el-table-column prop="taskEndTime" label="结束时间" />
                    <el-table-column prop="windowsStartTime" label="窗口开始时间" />
                    <el-table-column prop="windowsEndTime" label="窗口结束时间" />
                  </el-table>
                </div>
            </div>-->
            <!-- </el-tab-pane>
            <el-tab-pane label="KPIs" name="fourth">
              <kpi-component />
            </el-tab-pane>-->
            <!-- </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </section>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="工作量波形图" :visible.sync="dialogTableVisible" :before-close="closeImport">
      <h3 style="margin-top: 0;">{{ lineChartDataBig.day }}</h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px" />
    </el-dialog>
  </div>
</template>

<script>
// import echarts from 'echarts'
import { flightoptions, initTable } from '@/api/common'
import LineChartBig from '@/components/echarts/LineChartBig'
import { workloadsetting, searchDate, tabhb, generateWorkload } from '@/api/workload'
import LineChart from '@/components/echarts/LineChart'
import kpiComponent from './components/kpiComponent'
// import { constants } from 'crypto'
export default {
  name: 'WorkloadHidden',
  components: { kpiComponent, LineChart, LineChartBig },
  data() {
    return {
      shiftPlanName: '',
      workloadSampling: '',
      granularityInterval: '',
      particle01: '1min',
      rulesetDocumentId: '',
      workRulesDocOptions: [],
      flightoptions: [], // 航班计划
      taskList: [], // 任务
      dialogTableVisible: false,
      listLoading: false,
      documentId: this.$route.query.id,
      lineChartDataBig: {},
      lineChartData: [],
      editForm: '',
      fromDate: '',
      toDate: '',
      calculate: '',
      FLIGHT_SCHEDULE: '', //
      particle02: '5min',
      result: '',
      contact1: '',
      contact2: '',
      transition01: '',
      transition02: '',
      transition03: '',
      workloadDate: '',
      workloadDate2: '',
      workloadSlect: '',
      options: [{ value: 'MAX', label: 'MAX' }, { value: 'MIN', label: 'MIN' }, { value: 'AVG', label: 'AVG' }],
      options1: [{ value: '1', label: '1min' }, { value: '5', label: '5min' }],
      options2: [{ value: '5', label: '5min' }, { value: '10', label: '10min' }],
      contact1list: [{ value: 'contact1', label: '默认' }, { value: 'contact12', label: '按属性值连接' }],
      contact2list: [{ value: 'contact21', label: '货物类型' }, { value: 'contact22', label: '乘客数' }, { value: 'contact23', label: '货物重量' }],
      transition1: [{ value: 'transition1', label: '启用' }, { value: 'transition2', label: '不启用' }],
      transition2: [{ value: 'transition21', label: '启用' }, { value: 'transition22', label: '不启用' }],
      transition3: [{ value: 'transition31', label: '1min' }, { value: 'transition32', label: '2min' }, { value: 'transition33', label: '3min' }, { value: 'transition34', label: '4min' }],
      workloadSlectList: [{ value: 'workloadSlectList1', label: '一周' }, { value: 'workloadSlectList2', label: '两周' }],
      tableData: [], // 航班
      tableData1: [
        {
          targetBegin: '09:25',
          targetEnd: '10:05',
          windowBegin: '09:02',
          windowEnd: '10:05',
          targetNeeds: '1(Push back)',
          name: 'Push back'
        },
        {
          targetBegin: '08:28',
          targetEnd: '08:45',
          windowBegin: '08:28',
          windowEnd: '08:45',
          targetNeeds: '10(Cleaning)',
          name: 'Cleaning'
        }
      ],
      targettableData: [],
      value3: 'Max',
      activeName2: 'first',
      formLabelWidth: '120px',
      form: {},
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [1, 2],
      // 默认每页显示的条数（可修改）
      PageSize: 1,
      tableTitle: [
        { prop: 'flightNo', label: '航班号' },
        { prop: 'deptAirport', label: '起飞航站' },
        { prop: 'arrAirport', label: '到达航站' },
        { prop: 'deptTime', label: '起飞时间' },
        { prop: 'arrTime', label: '到达时间' },
        { prop: 'seqNum', label: '航段次序' },
        { prop: 'validity', label: '航班有效性' },
        { prop: 'planDeptAgent', label: '计划起飞代理' },
        { prop: 'planArrAgent', label: '计划到达代理' },
        { prop: 'documentId', label: '文件id' },
        { prop: 'weekday', label: '航班周执行时间' },
        { prop: 'beginDate', label: '计划开始日期' },
        { prop: 'endDate', label: '计划结束日期' },
        { prop: 'planSeason', label: '航季' },
        { prop: 'carrier', label: '承运人' },
        { prop: 'intlFlag', label: '国际国内' },
        { prop: 'acType', label: '机型' },
        { prop: 'flightType', label: '航班类型' },
        { prop: 'flightLineId', label: '航线id' }
      ],
      taskTableTitle: [
        { prop: 'taskName', label: '任务名称' },
        { prop: 'taskStartTime', label: '开始时间' },
        { prop: 'taskEndTime', label: '结束时间' },
        { prop: 'windowsStartTime', label: '窗口开始时间' },
        { prop: 'windowsEndTime', label: '窗口结束时间' }
      ]
    }
  },
  created() {
    this.search2()
    // this.workloadsetting()
    // this.handleClick2('second')
    this.flightoptions2() // 航班计划下拉
    this.workRules()
  },
  methods: {
    workloadsetting() {
      // init
      this.listLoading = true
      workloadsetting(this.documentId).then(response => {
        var _this = this
        Object.getOwnPropertyNames(response.data).forEach(function(cur) {
          // 此处接收一行数据
          var data1 = {}
          data1.role
          data1.datas = []
          Object.getOwnPropertyNames(response.data[cur]).forEach(function(cur2) {
            // 此处接收单表数据
            var data2 = {}
            data2.day
            data2.actualData = []
            data2.dataX = []
            response.data[cur][cur2].forEach(element => {
              data2.day = cur2
              data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
              data2.dataX.push(element.startDate.substring(10, 16))
            })
            data1.datas.push(data2)
          })
          data1.role = cur
          _this.lineChartData.push(data1)
        })
      })
      this.listLoading = false
    },
    mergeWorkload() {
      this.$router.push({ path: '/prepare/allPages/workloadHidden/mergeIndex', query: { documentId: this.documentId, name: this.$route.query.name, type: 'skill' } })
    },
    search2() {
      // 时间筛选查询
      this.listLoading = true
      var data = {
        documentId: this.documentId,
        begin: this.workloadDate,
        end: this.workloadDate2
      }
      this.lineChartData = []
      searchDate(data).then(response => {
        this.listLoading = false
        var _this = this
        this.fromDate = response.data.begin
        this.toDate = response.data.end
        this.workloadDate = response.data.begin
        this.workloadDate2 = response.data.end
        var aa = response.data.workloadWaveMap
        Object.getOwnPropertyNames(aa).forEach(function(cur) {
          // 此处接收一行数据
          var data1 = {}
          data1.role
          data1.datas = []
          Object.getOwnPropertyNames(aa[cur]).forEach(function(cur2) {
            // 此处接收单表数据
            var data2 = {}
            data2.maxNum = 3
            data2.warnLine = false
            data2.totalWorkingHours = 3
            data2.titleShow = false
            data2.day
            data2.actualData = []
            data2.dataX = []
            aa[cur][cur2].forEach(element => {
              data2.day = cur2
              data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
              data2.dataX.push(element.startDate)
            })
            data1.datas.push(data2)
            console.log(data2, 6677)
          })
          data1.role = cur.slice(cur.indexOf(',') + 1)
          _this.lineChartData.push(data1)
        })
      })
    },
    handleClick2(val) {
      if (val === 'second') {
        var data = {
          documentId: this.documentId
        }
        this.listLoading = true
        tabhb(data).then(response => {
          // tab 航班
          this.listLoading = false
          this.tableData = response.data.list
          response.data.list.forEach(element => {
            element.taskList.forEach(element2 => {
              this.taskList.push(element2)
            })
          })
        })
      }
    },
    flightoptions2() {
      // 下拉
      flightoptions().then(response => {
        this.flightoptions = response.data
      })
    },
    workRules() {
      // 下拉
      var data = {
        documentType: 'SERVICE_STANDARD'
      }
      initTable(data).then(response => {
        this.workRulesDocOptions = response.data.data
      })
    },
    generateWorkload() {
      // 生成工作量
      var data = {
        flightScheduleDocumentId: this.FLIGHT_SCHEDULE,
        serviceStandardDocumentId: this.rulesetDocumentId,
        fromDate: this.fromDate,
        toDate: this.toDate,
        granularityInterval: this.granularityInterval,
        workloadSampling: this.workloadSampling,
        shiftPlanName: this.shiftPlanName
      }
      this.listLoading = true
      generateWorkload(data).then(response => {
        if (response.data) {
          this.documentId = response.data
          this.lineChartData = []
          this.workloadsetting()
          this.listLoading = false
        }
      })
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},

    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
      // location.reload()
    }
  }
}
</script>

<style>
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #0a142f;
}
.el-tabs--border-card > .el-tabs__header {
  background-color: #263257;
}
.el-tabs--border-card > .el-tabs__content {
  background-color: rgb(27, 37, 65);
  color: white;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #232c47;
}
.el-dialog__header {
  background-color: #0a142f;
  color: white;
}
.el-dialog__title {
  color: white;
}
.el-dialog__body {
  background: #232c47;
}
.el-dialog__footer {
  background: #0a142f;
}
</style>

<style lang="scss" scoped>
.formstyle {
  margin-top: 20px;
}
.bg-color {
  background-color: #232c47;
  width: 100%;
  height: 60px;
}
.header-left,
.header-middle,
.header-middle2 {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-right: 1px solid #ccc;
  font-size: 12px;
  color: #0a9fc8;
}
.header-left1 {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 60px;
  justify-content: center;
  align-items: center;
}
.left-top {
  width: 14px;
  height: 14px;
  margin-bottom: 2px;
}
.img-style {
  width: 14px;
  height: 14px;
}
.header-right {
  justify-content: flex-start;
}
.header-middle,
.header-middle2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60px;
}
.header-middle-top,
.header-middle-bottom {
  display: flex;
  width: 140px;
  height: 20px;
  /* justify-content: space-around; */
  align-items: center;
}
.margin-sty {
  margin-left: 5px;
}
.header-middle2 {
  flex-direction: row;
}
.header-middle2-top,
.header-middle2-bottom {
  display: flex;
  flex-direction: column;
  width: 120px;
  justify-content: center;
  align-items: center;
}
.header-right {
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
}
.rule-box {
  width: 100%;
  height: 100%;
  background-color: #0a142f;
  box-sizing: border-box;
  padding: 20px;
}
.header-right-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.content-box {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  // padding: 10px 0;
  background: #0a142f;
  // max-height: 700px;
  // overflow: auto;
  height: 100%;
  // overflow: scroll
  margin-top: 60px;
}
.content-left {
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  // border-right: 3px solid #4f566b;
  font-size: 14px;
  color: white;
}
.doc,
.recycle,
.particle,
.contact,
.transition,
.staticload {
  width: 100%;
  height: 100%;
  background-color: #232c47;
  text-align: center;
}
.doc-title,
.recycle-title,
.contact-title,
.staticload-title,
.transition-title,
.particle-title {
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding-left: 5px;
  background-color: #263257;
}
.doc-content-box,
.recycle-content-box,
.particle-content-box,
.contact-content-box,
.transition-content-box,
.staticload-content-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0px;
}
.doc-content1,
.doc-content2,
.recycle-content1,
.recycle-content2,
.particle-content1,
.particle-content2,
.contact-content1,
.contact-content2,
.transition-content1,
.transition-content2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  // width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
}
.doc-content2,
.recycle-content2,
.particle-content2,
.contact-content2,
.transition-content2 {
  margin-top: 10px;
}
.doc-button,
.recycle-button,
.particle-button,
.contact-button,
.transition-button {
  width: 132px;
  height: 35px;
  line-height: 3px;
  text-align: center;
  background-color: #1b2541;
  color: white;
}
.recycle-button {
  width: 132px;
}
.recycle,
.particle,
.contact,
.transition,
.staticload {
  margin-top: 20px;
}
.staticload-content1 {
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.content-right {
  width: 82%;
  height: 100%;
  box-sizing: border-box;
  // padding: 0 15px;
}
.workload {
  width: 100%;
  height: 100%;
}
.workload-top {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
}
.span-value {
  margin-left: 10px;
  margin-right: 10px;
}
.workload-bottom {
  width: 100%;
  // max-height: 600px;
  margin-top: 2px;
  box-sizing: border-box;
  padding: 20px 0;
  // border-top: 2px solid #4f566b;
  overflow: auto;
  .role {
    width: 100%;
    height: 250px;
    line-height: 250px;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 12px;
  }
}
.flight {
  width: 100;
  height: 100%;
}
.flight-top {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 15px;
}
.print-file,
.import-file {
  width: 80px;
  height: 30px;
  line-height: 20px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid white;
  text-align: center;
}
.import-file {
  margin-left: 30px;
}
.flight-bottom {
  margin-top: 10px;
}
</style>
