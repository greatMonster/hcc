<template>
  <div id="app2">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px; padding-top: 60px">
      <!-- <el-page-header content="员工视角" @back="goBack" /> -->
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <label>参数组合：</label>
        <el-select v-model="intlType1" style="width: 160px" multiple collapse-tags size="small" placeholder="请选择">
          <!-- <el-option v-for="item in regions1" :key="item.id" :label="item.composeName" :value="item.id" /> -->
          <el-option v-for="item in regions1" :key="item.id" :label="item.composeName" :value="item.id" />
        </el-select>
        <el-form-item label="员工姓名：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="日期：" prop="name">
          <el-date-picker v-model="ruleForm.date" :clearable="isClearable" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData" />
        </el-form-item>
        <el-button type="primary" size="mini" @click="queryData">查询</el-button>
        <el-button size="small" @click="showChart">安检通道覆盖信息图</el-button>
        <el-button size="small" @click="jumpDesk">安检通道视角</el-button>
      </el-form>

      <span class="textips">
        当日出港航班数 :
        <ins>{{ statsVO.flightNum }}</ins
        >，总任务数 : <ins>{{ statsVO.totalTaskNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #3a8ee6; margin-right: 3px" />未分配 : <ins>{{ statsVO.unassignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #1156f0; margin-right: 3px" />已分配 : <ins>{{ statsVO.assignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(103, 194, 58) 50%; margin-right: 3px" />已开始&nbsp;&nbsp;: <ins>{{ statsVO.startedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(67, 162, 43) 50%; margin-right: 3px" />已接收 : <ins>{{ statsVO.receivedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #a4abc0; margin-right: 3px" />已完成 : <ins>{{ statsVO.completedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #99004d; margin-right: 3px" />已取消 : <ins>{{ statsVO.canceledNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #ff3399; margin-right: 3px" />已超时 : <ins>{{ statsVO.timeoutNum }}</ins
        >， <span style="color: yellow">！</span>告警 : <ins>{{ statsVO.warningNum }}</ins
        >， <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 : <ins>{{ statsVO.assignedLockedNum + statsVO.unassignedLockedNum }}</ins
        >， 总工时利用率 :
        <ins>{{ (totalAvgRate * 100).toFixed(2) }}%</ins>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" />
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width: 15px" />
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size: 12px" @change="scaleChange">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
    </header>
    <div class="container" @dragend="dragend($event)" @dragover="allowDrop($event)" @drop="onDrop($event)" ref="gantt">
      <v-gantt-chart
        v-loading="loading"
        :start-time="startTime"
        :end-time="endTime"
        :cell-width="cellWidth"
        :cell-height="cellHeight"
        :title-height="titleHeight"
        :scale="scale"
        :title-width="titleWidth"
        show-current-time
        :hide-header="hideHeader"
        :data-key="dataKey"
        :array-keys="arrayKeys"
        :scroll-to-postion="positionB"
        custom-generate-blocks
        :datas="datasB"
        @scrollLeft="scrollLeftB"
        @scrollTop="scrollLeftB2"
      >
        <template v-slot:block="{ data, getWidthAbout2Times, getPositonOffset, isInRenderingTimeRange, startTimeOfRenderArea, endTimeOfRenderArea }">
          <div :employeeId="data.groupId" :employeeName="data.groupName" :skillId="data.skillId" class="taskList" :style="{ top: 3 + 'px' }">
            <div
              v-for="(item, index) in data.securityTaskVOS"
              :id="index"
              :key="index"
              :employeeId="data.groupId"
              class="gantt-block-item"
              :style="{ left: getPositonOffset(item.startTime) + 'px', width: getWidthAbout2Times(item.startTime, item.endTime, { scale, cellWidth }) + 'px' }"
              :left="getPositonOffset(item.startTime)"
              @dragstart="dragstart($event, item)"
              @mouseenter="changeActive($event, item)"
              @mouseleave="changeLeave($event)"
            >
              <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" :statusList="statusList" @changeStatus="changeStatus" />
              <!-- <div class="windowTime" :style="{left:getPositonOffset(itemin.windowStartTime) - getPositonOffset(itemin.planInPlace)+'px',width:getWidthAbout2Times(itemin.windowStartTime,itemin.windowEndTime,{ scale,cellWidth})+'px'}" /> -->
              <!-- <div class="actualTime" :style="{left:getPositonOffset(itemin.actualInPlace) - getPositonOffset(itemin.planInPlace)+'px',width:getWidthAbout2Times(itemin.actualInPlace,itemin.actualEnd,{ scale,cellWidth})+'px'}" /> -->
            </div>
            <!-- <div class="gantt-block-item workTime" :style="{left:getPositonOffset(data.startTime)+'px',width:getWidthAbout2Times(data.startTime,data.endTime,{ scale,cellWidth})+'px',background:'green;'}" :left="getPositonOffset(data.startTime)" /> -->
            <div
              v-for="(itemTime, index) in data.workTimeVOS"
              :key="itemTime.startTime"
              class="gantt-block-item workTime"
              :style="{ left: getPositonOffset(itemTime.startTime) + 'px', width: getWidthAbout2Times(itemTime.startTime, itemTime.endTime, { scale, cellWidth }) + 'px' }"
            />
          </div>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <div class="gantt-header-title-left">{{ countDesc }}：{{ datasB.length !== 0 ? datasB.length : 0 }}</div>
        </template>
      </v-gantt-chart>
      <v-gantt-chart
        ref="target"
        v-loading="loading"
        :start-time="startTime"
        :end-time="endTime"
        :cell-width="cellWidth"
        :cell-height="cellHeight"
        :title-height="titleHeight"
        show-current-time
        :scale="scale"
        :title-width="titleWidth"
        :hide-header="hideHeader2"
        :data-key="dataKey"
        :array-keys="arrayKeys"
        :scroll-to-postion="positionA"
        custom-generate-blocks
        :datas="datasA"
        @scrollLeft="scrollLeftA"
        @scrollTop="scrollLeftA2"
      >
        <template v-slot:block="{ data, getWidthAbout2Times, getPositonOffset, isInRenderingTimeRange, startTimeOfRenderArea, endTimeOfRenderArea }">
          <div v-if="data.securityTaskVOS.length < 1" :employeeId="1" :employeeName="1" style="height: 100%; padding-top: 11px">无任务</div>
          <div
            v-else
            v-for="(item2, index) in data.securityTaskVOS"
            :key="index"
            :employeeId="1"
            :employeeName="1"
            class="gantt-block-item"
            :style="{ left: getPositonOffset(item2.startTime) + 'px', width: getWidthAbout2Times(item2.startTime, item2.endTime, { scale, cellWidth }) + 'px', top: '8px' }"
          >
            <div style="position: relative">
              <div @dragstart="dragstart($event, item2)" @mouseenter="changeActive($event, item2)" @mouseleave="changeLeave($event)">
                <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item2" :statusList="statusList" @changeStatus="changeStatus" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:left="{ data }">
          <LeftBtm :data="data" />
        </template>
      </v-gantt-chart>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="安检通道覆盖信息图表" width="70%" :visible.sync="dialogTableVisible" :close="closeImport">
      <div v-loading="loadingChart">
        <h3 style="margin-top: 0">{{ lineChartDataBig.day }}</h3>
        <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
      </div>
    </el-dialog>
    <!-- 进度条 -->
    <el-dialog v-dialogDrag title="进度" width="20%" :visible.sync="progressVisible" :show-close="showClose">
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 300px">
        <el-progress type="dashboard" :percentage="percentage" :color="colors" :width="progressWidth" />
        <p>{{ dragSuccessText }}</p>
        <p>请点击确定重新刷新员工列表</p>
      </div>
      <div class="dialog-footer" style="text-align: center">
        <!-- <el-button style="background: #495373;color: white;" @click="progressVisible=false">取 消</el-button> -->
        <el-button type="primary" @click="searchHandleAddClick('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import LeftBtm from './components/leftbtm.vue'
// import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { deskManualDispatching1 } from '@/api/checkInData'
import { queryList } from '@/apiNew/securityChannel'
import { searchTaskStatus } from '@/apiNew/vehicle'
import { ByEmployeeGroup1, deskChart1, canceltask, noPersonTask1 } from '@/apiNew/securityDispatching'
import LineChartBig from '../channelView/components/LineChartBig'
const scaleList = `15,30,60`.split(',').map((n) => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft, LeftBtm, LineChartBig },
  data() {
    return {
      airportId: this.$route.query.siteId,
      businessDomainId: this.$route.query.businessDomainId,
      airport: this.$store.state.user.airport,
      refreshCount: 0,
      statusList: [],
      isClearable: false,
      datasBCopy: [],
      progressWidth: 100,
      countDesc: '当日在岗资源数',
      showClose: false,
      employeeName11: '',
      dragSuccessText: '',
      employeeCodeV: null,
      statsVO: {},
      progressVisible: false,
      percentage: 10,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      lineChartData: [],
      lineChartDataBig: {},
      loadingChart: false,
      dialogTableVisible: false,
      intlType1: this.$route.query.deskPredictions.split(',').map(Number),
      regions1: [],
      optionsSiteId: [],
      morningAvgSumRate: null,
      eveningAvgSumRate: '',
      totalAvgRate: '',
      getStat: {}, // 统计数据
      canceltaskshow: false,
      intlFlagoption: [
        { value: '国际', id: 'I' },
        { value: '国内', id: 'D' }
      ],
      regions: [
        { name: '国内经济', region: 'D' },
        { name: '国际经济', region: 'I' },
        { name: '高端', region: 'D/I' }
      ],
      ruleForm: {
        date: this.$route.query.date ? this.$route.query.date : this.getNowFormatDate(),
        name: '',
        value: ['', ''],
        startTime: '',
        endTime: '',
        siteId: ''
      },
      intlType: 'D',
      serviceType: 'C',
      isNaN: '', // 修bug 用
      flightTypeoption: [
        { value: '进港', id: 'A' },
        { value: '出港', id: 'D' }
      ],
      dialogFormake: false,
      apronCode: '', // 讥评
      restaurants: [],
      inoutype: '', // 进出港
      data2: '231231',
      taskId: '',
      checkInTaskId: '',
      title: '规则设置',
      formEdit: {},
      editSkillVisible: false,
      formLabelWidth: '150px',
      loading: false,
      dialogFormVisible: false,
      timeLines: [
        {
          time: dayjs().add(2, 'hour').toString()
        },
        {
          time: dayjs().add(5, 'hour').toString(),
          color: '#000'
        }
      ],
      date: this.$route.query.date ? this.$route.query.date : this.getNowFormatDate(), // 选择日期
      currentTime: dayjs(),
      startTime: this.$route.query.date ? dayjs(this.$route.query.date).subtract(24, 'hour').toString() : dayjs(this.$route.query.date).subtract(24, 'hour').toString(),
      endTime: this.$route.query.date ? dayjs(this.$route.query.date).add(1, 'day').add(24, 'hour').toString() : dayjs(this.$route.query.date).add(24, 'hour').add(24, 'hour').toString(),
      // date: '2019-11-11', // 选择日期
      // currentTime: dayjs('2019-11-11'),
      // startTime: '2019-11-11',
      // endTime: '2019-11-12',
      bustyle: '国内经济', // 摆渡车类型
      bustyleId: '',
      // bustyleId: this.$route.query.skillId ? this.$route.query.skillId : '',
      groupstyle: [
        { id: '', value: '全部' },
        { id: '324', value: '大摆渡' },
        { id: '326', value: '北方' },
        { id: '325', value: 'COBUS2700' }
      ],
      isWarn: false,
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 180,
      scale: 30,
      datasNum: 100,
      datasA: [],
      datasB: [],
      dataKey: 'index',
      scaleList: scaleList,
      scrollToTime: dayjs().add(1, 'day').toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideHeader2: true,
      arrayKeys: ['gtArray', 'error'],
      positionB: { x: this.$route.query.data ? localStorage.scrollx - 600 : 3200, Y: 10000 },
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 3200, Y: 10 },
      endExchangeIndex: '',
      value2: '',
      type: '',
      routeData: '',
      status: [
        { id: '1', value: '已完成' },
        { id: '2', value: '未开始' }
      ],
      rules: {
        flightNo: [{ required: true, message: '请输入', trigger: 'blur' }],
        taskName: [{ required: true, message: '请输入', trigger: 'blur' }],
        planInPlace: [{ required: true, message: '请输入', trigger: 'blur' }],
        planDepart: [{ required: true, message: '请输入', trigger: 'blur' }],
        planEnd: [{ required: true, message: '请输入', trigger: 'change' }],
        deptArrAirport: [{ required: true, message: '请输入', trigger: 'change' }],
        flightType: [{ required: true, message: '请输入', trigger: 'change' }],
        startPosition: [{ required: true, message: '请输入', trigger: 'change' }],
        endPosition: [{ required: true, message: '请输入', trigger: 'change' }],
        deptApron: [{ required: true, message: '请输入', trigger: 'change' }],
        busType: [{ required: true, message: '请输入', trigger: 'change' }],
        intlFlag: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  watch: {},
  created: function () {
    this.intlTypeList()
    this.initList()
    this.listFn()
    this.searchAllStatus()
  },
  mounted: function () {
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: 0 }
    })
  },
  methods: {
    // scale change
    scaleChange() {
      this.initList()
      this.listFn()
    },
    // 查询所有任务状态
    searchAllStatus() {
      const data = {
        airportId: this.airport.airportId
      }
      searchTaskStatus(data).then((response) => {
        this.statusList = response.data.data
      })
    },
    // 任务状态修改后刷新页面
    changeStatus() {
      this.initList()
      this.listFn()
    },
    goBack() {
      window.history.back()
    },
    jumpDesk() {
      this.$router.push({ path: '/dispatching/securityChannel/channelTasks', query: { siteId: this.$route.query.siteId || 10, date: this.ruleForm.date, deskPredictions: this.intlType1.join(',') || '', businessDomainId: this.businessDomainId } })
    },
    intlTypeList() {
      this.regions1 = []
      const data = {
        airportId: this.airport.airportId || ''
      }
      queryList(data)
        .then((response) => {
          if (response.data.data.length !== 0) {
            response.data.data.forEach((element) => {
              if (element.airportId == this.$route.query.siteId) {
                this.regions1.push(element)
              }
            })
            this.intlType1 = this.$route.query.deskPredictions.split(',').map(Number)
          } else {
            this.$message.success('暂无参数组合数据')
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    siteIdList() {
      this.optionsSiteId = [
        {
          value: '9',
          label: '国航'
        },
        {
          value: '10',
          label: '无锡'
        }
      ]
    },
    showChart() {
      var _this = this
      // 渲染图表
      var data = {
        airportId: this.$route.query.siteId || '',
        ids: this.intlType1.join(',') || '',
        date: this.ruleForm.date,
        businessDomainId: this.businessDomainId
      }
      this.loadingChart = true
      this.lineChartData = []
      this.lineChartDataBig = {}
      this.dataList = {}
      deskChart1(data).then((response) => {
        this.loadingChart = false
        var data1 = response.data.data
        if (response.data.code === '200') {
          if (!data1) {
            this.lineChartDataBig = {}
            // this.$message.success('暂无数据！')
          } else {
            this.dataList = response.data.data
            this.noEcharts = false
            Object.keys(response.data.data.points).forEach(function (cur2) {
              var object = {}
              object.datas = {}
              object.datas.actualData = []
              object.datas.expectedData2 = []
              object.datas.expectedData = []
              object.datas.waitList = []
              object.datas.realWaitList = []
              object.datas.arryleft = []
              object.datas.arryleft2 = []
              object.datas.arryright = []
              object.datas.dataX = []
              object.datas.actualDataName = '预计到达旅客'
              object.datas.expectedDataName = '可通过人数'
              object.datas.expectedDataName2 = '柜台开放数'
              object.datas.day = cur2
              response.data.data.points[cur2].forEach((element) => {
                // console.log(element, 'element')
                object.datas.arryleft2.push(element.passengerNumber)
                object.datas.arryleft.push(element.deskCapacity)
                object.datas.arryright.push(element.openDesks)
                object.datas.actualData.push({ name: element.time, value: [element.time, element.passengerNumber] })
                object.datas.expectedData.push({ name: element.time, value: [element.time, element.deskCapacity] })
                object.datas.expectedData2.push({ name: element.time, value: [element.time, element.openDesks] })
                object.datas.waitList.push({ name: element.time, value: [element.time, element.waitTime] })
                object.datas.realWaitList.push({ name: element.time, value: [element.time, element.waitingTime] })
                object.datas.dataX.push(element.time.substring(10, 16))
              })
              object.datas.leftMax2 = Math.max.apply(null, object.datas.arryleft2)
              object.datas.leftMax = Math.max.apply(null, object.datas.arryleft)
              object.datas.rightMax = Math.max.apply(null, object.datas.arryright)
              object.datas.maxWaitTime = response.data.data.maxWaitTime
              object.datas.maxY = response.data.data.ymax
              // object.datas.maxY = response.data.data.yMax
              object.datas.max1Y = response.data.data.y1Max
              object.datas.max2Y = response.data.data.y2Max
              object.datas.isShow = true
              object.datas.legendData = ['预计到达旅客', '柜台开放数', '可通过人数', '预计排队时间', '实时排队时间']
              _this.lineChartData.push(object.datas)
              _this.lineChartDataBig = object.datas
            })
          }
        } else {
          this.lineChartDataBig = {}
          this.$message({
            type: 'error',
            showClose: true,
            message: response.message
          })
        }
        this.$nextTick(() => {
          console.log(this.lineChartData.length, 'linechartbig')
          // if (JSON.stringify(this.lineChartDataBig) !== '{}') {
          if (this.lineChartData.length !== 0) {
            // debugger
            this.dialogTableVisible = true
          } else {
            this.$message.success('暂无图表数据')
          }
        })
      })
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
      // location.reload()
    },
    siteChange(e) {
      this.siteId = e
      this.initList()
      this.listFn()
    },
    queryData() {
      this.listFn()
      this.initList()
    },
    handleChange(value) {
      // 国际国内切换
      if (value === 'D') {
        this.intlType = 'D'
        this.serviceType = 'C'
      } else if (value === 'I') {
        this.intlType = 'I'
        this.serviceType = 'C'
      } else if (value === 'D/I') {
        this.intlType = 'D/I'
        this.serviceType = 'V'
      }
      this.datasA = []
      this.datasB = []
      this.initList()
      this.listFn()
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      this.startTime = dayjs(e).subtract(24, 'hour').toString()
      this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.datasA = []
      this.datasB = []
      this.initList()
      this.listFn()
      // this.getStatistics()
    },
    changeBus(e) {
      // 切换摆渡车
      this.bustyleId = e
      this.datasA = []
      this.datasB = []
      this.initList()
      this.listFn()
      this.getStatistics()
    },
    changeActive(item, item1) {
      if (item1.taskStatusId !== 5) {
        this.canceltaskshow = true
      }
    },
    changeLeave(item) {
      this.canceltaskshow = false
    },
    canceltask(item) {
      // 取消任务
      if (item.taskStatusId !== 5) {
        this.$confirm('确认取消这条任务吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            canceltask({ taskId: item.taskId })
              .then((response) => {
                this.listFn()
                this.initList()
                this.$message.success('已取消')
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          })
          .catch(() => {})
      } else {
        this.$message.warning('已是取消状态')
      }
    },
    opentask() {
      // 任务视图
      var routeData = this.$router.resolve({ path: '/dispatching/taskView', query: { name: 123 } })
      window.open(routeData.href, '_blank')
    },
    listFn() {
      // 员工列表
      this.loading = true
      this.$store.commit('changSiteId', this.$route.query.siteId)
      this.$store.commit('changDeskPreditons', this.intlType1)
      // this.datasB = []
      var data = {
        airportId: this.siteId || this.$route.query.siteId,
        deskPredictions: this.intlType1.join(',') || this.$route.query.deskPredictions,
        // deskPredictions: '346,362',
        employeeName: this.ruleForm.name || '',
        date: this.ruleForm.date || '',
        businessDomainId: this.businessDomainId
      }
      ByEmployeeGroup1(data)
        .then((response) => {
          var data = response.data.data
          this.statsVO = data.statsVO
          this.countDesc = '当日在岗资源数'
          if (data.employeeVOList) {
            // 第一次刷新页面滚动条定位到最早开始的一个任务
            if (this.refreshCount === 0) {
              let taskArray = []
              let beforeCurrent = []
              let afterCurrent = []
              const time = new Date()
              const hour = time.getHours()
              const minute = time.getMinutes()
              const second = time.getUTCSeconds()
              const currentTime = new Date(this.ruleForm.date + ' ' + `${hour}:${minute}:${second}`).getTime()
              // const currentTime = new Date().getTime()
              data.employeeVOList.forEach((item) => {
                taskArray = taskArray.concat(item.securityTaskVOS)
              })
              taskArray.forEach((item) => {
                if (new Date(item.startTime).getTime() > currentTime) {
                  afterCurrent.push(item)
                } else {
                  beforeCurrent.push(item)
                }
              })
              let min = null
              let minItem = {}
              let personRow = null
              if (beforeCurrent.length) {
                min = new Date(beforeCurrent[0].startTime).getTime() - currentTime
                for (var i = 0; i < beforeCurrent.length; i++) {
                  var cur = new Date(beforeCurrent[i].startTime).getTime() - currentTime
                  if (cur > min) {
                    // 找到离当前时间最近的一个任务
                    minItem = beforeCurrent[i]
                  } else {
                    minItem = beforeCurrent[0]
                  }
                }
              } else if (afterCurrent.length) {
                min = new Date(afterCurrent[0].startTime).getTime() - currentTime
                for (var i = 0; i < afterCurrent.length; i++) {
                  var cur = new Date(afterCurrent[i].startTime).getTime()
                  if (cur - currentTime > min) {
                    minItem = afterCurrent[i]
                  } else {
                    minItem = afterCurrent[0]
                  }
                }
              }
              data.employeeVOList.forEach((item, index) => {
                if (item.groupId === minItem.groupId) {
                  personRow = index
                }
              })
              this.positionB = { x: getPositonOffset(minItem.startTime, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
            }
            this.morningAvgSumRate = data.morningAvgSumRate || ''
            this.eveningAvgSumRate = data.eveningAvgSumRate || ''
            this.totalAvgRate = data.totalAvgRate || ''
            var taskMap = []
            taskMap[1] = data.employeeVOList
            if (data.employeeVOList.length !== 0) {
              data.employeeVOList.forEach((item) => {
                if (!item.securityTaskVOS) {
                  item.securityTaskVOS = []
                }
              })
              this.datasB = data.employeeVOList
            }

            if (this.datasB.length === 0) {
              if (document.getElementById('noData')) {
                document.getElementById('noData').style.display = 'block'
              } else {
                var divTemp = document.createElement('div')
                divTemp.setAttribute('id', 'noData')
                divTemp.innerHTML = '今日无员工上班，请制作排班表并发布员工日历'
                divTemp.style.color = 'white'
                divTemp.style.position = 'absolute'
                divTemp.style.width = '192px'
                divTemp.style.zIndex = 999
                divTemp.style.top = this.$refs.gantt.getBoundingClientRect().top + 50 + 'px'
                divTemp.style.fontSize = '12px'
                this.$refs.gantt.appendChild(divTemp)
              }
            } else {
              if (document.getElementById('noData')) {
                document.getElementById('noData').style.display = 'none'
              }
            }
            this.datasBCopy = this.datasB
            this.refreshCount = 1
            // this.progressVisible = false
          } else {
            this.datasB = []
            if (this.ruleForm.name) {
              this.$message({
                type: 'success',
                message: '无匹配数据'
              })
            } else {
              this.$message({
                type: 'success',
                message: '暂无已分配数据'
              })
            }
          }
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    initList() {
      // 未分配
      var data = {
        airportId: this.siteId || this.$route.query.siteId,
        deskPredictions: this.intlType1.join(',') || '',
        employeeName: this.ruleForm.name || '',
        intlType: this.intlType || '',
        date: this.ruleForm.date || '',
        businessDomainId: this.businessDomainId
      }
      // this.datasA = []
      // this.loading = true
      noPersonTask1(data)
        .then((response) => {
          var data = response.data.data
          if (response.data.code === '200') {
            // this.datasA = []
            if (data.length > 0) {
              this.datasA = data
            } else {
              this.loading = false
              this.$message({
                type: 'success',
                message: '暂无未分配数据'
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: 'sss'
            })
          }
        })
        .catch((e) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
      this.loading = false
      // })
    },
    showddd(start, end, { scale, cellWidth }) {
      return getWidthAbout2Times(start, end, { scale, cellWidth })
    },
    updateTimeLines(timeA, timeB) {
      this.timeLines = [
        {
          time: timeA
        },
        {
          time: timeB,
          color: '#000'
        }
      ]
    },
    scrollLeftA(val) {
      this.positionB = { x: val }
    },
    scrollLeftB(val) {
      this.positionA = { x: val }
    },
    scrollLeftA2(val) {
      this.scrollToPostion = { Y: 0 }
    },
    scrollLeftB2(val) {
      this.positionB = { Y: val }
    },
    // 拖拉
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev, itemin) {
      // this.taskId = itemin.id
      this.checkInTaskId = itemin.taskId
      this.employeeCodeV = itemin.groupId
      this.employeeName11 = itemin.groupName
      console.log(itemin, 110)
      this.employeeSearch(itemin.taskId, itemin.groupId, itemin.startTime, itemin.endTime)
    },
    employeeSearch(taskId, employeeCode, startTime, endTime) {
      if (!employeeCode) {
        var data = {
          airportId: this.$route.query.siteId || '',
          deskPredictions: this.intlType1.join(','),
          taskId: taskId
        }
        // this.datasB = []
        // this.$message('正在寻找该时段有空的员工……')
        let taskStartTime = new Date(startTime).getTime()
        let taskEndTime = new Date(endTime).getTime()
        var a = []
        for (let i = 0; i < this.datasBCopy.length; i++) {
          let flag = true
          let employeeStartTime = new Date(this.datasBCopy[i].startTime).getTime()
          let employeeEndTime = new Date(this.datasBCopy[i].endTime).getTime() + 30 * 60 * 1000
          if (taskEndTime > employeeEndTime || taskStartTime < employeeStartTime) {
            flag = false
            continue
          } else {
            for (let j = 0; j < this.datasBCopy[i].securityTaskVOS.length; j++) {
              // 如果冲突则删除该人并跳出循环
              if (!(taskEndTime <= new Date(this.datasBCopy[i].securityTaskVOS[j].startTime).getTime() || taskStartTime >= new Date(this.datasBCopy[i].securityTaskVOS[j].endTime).getTime())) {
                // this.datasBCopy.splice(i, 1)
                flag = false
                break
              }
            }
          }
          if (flag) {
            a.push(this.datasBCopy[i])
          }
        }
        if (a.length === 0) {
          this.$message({
            type: 'success',
            message: '暂无匹配员工'
          })
          this.datasB = []
        } else {
          this.countDesc = '符合条件人数'
          this.progressVisible = false
          this.datasB = a
        }

        // dragSearch(data)
        //   .then(response => {
        //     var data = response.data.data
        //     this.statsVO = data.statsVO
        //     if (data.employeeVOList.length > 0) {
        //       this.morningAvgSumRate = data.morningAvgSumRate || ''
        //       this.eveningAvgSumRate = data.eveningAvgSumRate || ''
        //       this.totalAvgRate = data.totalAvgRate || ''
        //       var taskMap = []
        //       taskMap[1] = data.employeeVOList
        //       if (data.employeeVOList.length !== 0) {
        //         this.datasB = data.employeeVOList
        //       }
        //       this.countDesc = '符合条件人数'
        //       this.progressVisible = false
        //     } else {
        //       this.datasB = []
        //       this.$message({
        //         type: 'success',
        //         message: '暂无匹配员工'
        //       })
        //     }
        //     this.loading = false
        //   })
        //   .catch(e => {
        //     this.$message({
        //       type: 'error',
        //       message: e.response.data.message
        //     })
        //   })
      }
    },
    onDrop(event) {
      console.log(event.target, 5522)
      // console.log(this.employeeCodeV, 5566)
      var data1 = {}
      if (event.target.getAttribute('employeeId') === '1' || event.target.childNodes[0].getAttribute('employeeId') === '1') {
        data1 = {
          employeeId: '',
          checkInTaskId: this.checkInTaskId,
          employeeName: '',
          date: this.ruleForm.date
        }
      } else {
        data1 = {
          // employeeId: this.employeeCodeV ? '' : event.target.getAttribute('employeeId') || event.target.childNodes[0].getAttribute('employeeId') || '',
          employeeId: event.target.getAttribute('employeeId') || event.target.childNodes[0].getAttribute('employeeId') || '',
          // employeeId: this.employeeCode ? this.employeeCode : '',
          checkInTaskId: this.checkInTaskId,
          // employeeName: this.employeeName11 ? '' : event.target.getAttribute('employeeName') || event.target.childNodes[0].getAttribute('employeeName') || ''
          employeeName: event.target.getAttribute('employeeName') || event.target.childNodes[0].getAttribute('employeeName') || '',
          date: this.ruleForm.date
        }
      }
      // deskManualDispatching2(data1)
      //   .then((response) => {
      //     // 任务拖拽分配
      //     var data = response.data.data
      //     if (!data) {
      //       this.dragUrl(data1)
      //     } else {
      //       this.$confirm('已超出该员工正常工作时间，继续分配需要该员工加班, 确认继续?', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         type: 'warning',
      //       })
      //         .then(() => {
      //           this.dragUrl(data1)
      //         })
      //         .catch(() => {
      //           this.$message({
      //             type: 'info',
      //             message: '已取消',
      //           })
      //         })
      //     }
      //   })
      //   .catch((e) => {
      //     this.$message({
      //       type: 'error',
      //       message: e.response.data.message,
      //     })
      //   })
      deskManualDispatching1(data1)
        .then((response) => {
          // console.log(data, 110)
          if (data1.employeeName) {
            this.progressVisible = true
            this.percentage = 60
            setTimeout(() => {
              this.percentage = 100
            }, 500)
            this.dragSuccessText = `已成功分配给${data1.employeeName}`
          } else {
            this.progressVisible = true
            this.percentage = 60
            setTimeout(() => {
              this.percentage = 100
            }, 500)
            this.dragSuccessText = `已成功取消`
            this.$message.success('已成功取消')
            // this.listFn()
            // this.initList()
          }
          this.employeeCode = null
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 拖拽接口
    dragUrl(data) {
      // this.percentage = 10
      deskManualDispatching1(data)
        .then((response) => {
          // console.log(data, 110)
          if (data.employeeName) {
            this.progressVisible = true
            this.percentage = 60
            setTimeout(() => {
              this.percentage = 100
            }, 500)
            this.dragSuccessText = `已成功分配给${data.employeeName}`
          } else {
            this.progressVisible = true
            this.percentage = 60
            setTimeout(() => {
              this.percentage = 100
            }, 500)
            this.dragSuccessText = `已成功取消`
            this.$message.success('已成功取消')
            // this.listFn()
            // this.initList()
          }
          this.employeeCode = null
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    searchHandleAddClick() {
      if (this.datasA.length < 4) {
        this.datasA = []
      }
      this.listFn()
      this.initList()
      this.progressVisible = false
    },
    dragend(event) {},
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/busRules' })
    },
    flightTypevaule(e) {
      // 进出港选择
      this.inoutype = e
    },
    handleSelect(item) {
      this.apronCode = item.apronCode
    },
    showdialogFormake() {
      // 生成任务
      this.dialogFormake = true
    },
    getNowFormatDate() {
      // 获取当天时间
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  }
}
</script>
<style scoped>
.demo-ruleForm .el-form-item {
  display: inline-block;
  margin-bottom: 0;
}
.flights {
  display: block;
  height: 100%;
  border: 1px solid #255e9a;
}
.Unallocated {
  background: #fff;
  height: 10px;
  margin-bottom: 5px;
}
.taskList {
  height: 26px;
  position: relative;
}
.workTime {
  background-color: green;
}
.canceltask {
  position: absolute;
  right: -12px;
  color: #0f72f5;
  z-index: 2;
  cursor: pointer;
}
.textips {
  float: right;
  font-size: 15px;
  margin-top: 10px;
  margin-right: 15px;
}
.none {
  display: none;
}
body {
  font: 12px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
label {
  margin-left: 15px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: middle;
}
input[type='range'] {
  width: 100px;
}
ins {
  color: #f56c6c;
  text-decoration: none;
}
.top-bar {
  color: #fff;
  background: #818aa7;
  font-size: 12px;
}
.top-bar input,
.top-bar select {
  background: #3e4660;
  border: none;
  color: #fff;
}
.redwarn {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: blue;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 75%;
}

.container >>> .gantt-block {
  background: #000;
  border-bottom: 1px solid #2d2d2d;
  height: 80px;
}
.container >>> .gantt-header {
  background: #3e4660;
}
.container >>> .gantt-timeline-day {
  font-size: 14px;
  color: #ffffff;
}
.container >>> .gantt-timeline-scale > div {
  font-size: 0.4rem;
  font-weight: lighter;
  color: #b9bcc5;
}
.container >>> .gantt-leftbar,
.container >>> .gantt-leftbar-wrapper {
  background: #000;
  border-top: 1px solid #ccc;
}
.container >>> .gantt-chart {
  /* height: 90%; */
  background: #000;
}
.container >>> .gantt-block-item {
  display: block;
  width: 100%;
  height: 6px;
}

.vvip {
  z-index: 999;
  position: absolute;
  color: #02ff00;
  right: -36px;
  font-size: 12px;
  top: 7px;
  display: block;
  text-shadow: 0 0 0px #fff;
}
.vvip span.vip {
  color: #f9ff00;
}
.warn {
  bottom: 3%;
  height: 6%;
  position: absolute;
  z-index: 0;
  background: #0cbb0a;
}
.progressBar {
  top: 25%;
  height: 10%;
  position: absolute;
  z-index: 2;
  left: -12px;
}
.progressBar svg {
  color: #fff;
  width: 0.6rem;
  text-shadow: 0 0 5px #000;
}
.item-btn {
  background: #255e9a;
  border-color: #0c5098;
}
.transfer {
  margin: 40px 0 0 40px;
}

.leftbotm {
  position: absolute;
  background: #000;
  height: 100%;
  left: 10px;
  z-index: 200;
  top: 55%;
  border-top: 1px solid #ccc;
}
.leftbotm p {
  color: #cccccc;
  font-size: 14px;
  text-align: center;
  padding: 5px 10px;
}
.open {
  width: 10px;
  height: 10px;
  background: #6a9512;
  display: inline-block;
  border-radius: 3px;
}
.open2 {
  width: 10px;
  height: 10px;
  background: #8400ff;
  display: inline-block;
  border-radius: 3px;
}
.open3 {
  width: 10px;
  height: 10px;
  background: #847f7f;
  display: inline-block;
  border-radius: 3px;
}
</style>
