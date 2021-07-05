<template>
  <div id="app">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px">
      <label>参数组合：</label>
      <el-select v-model="intlType1" style="width: 320px" size="small" multiple collapse-tags placeholder="请选择" @change="changeParam">
        <el-option v-for="item in regions1" :key="item.id" :label="item.composeName" :value="item.id" />
      </el-select>
      <label>员工姓名</label>
      <el-input v-model="employeeName" placeholder="请输入员工姓名" size="small" style="width: 150px" />
      <label>日期</label>
      <el-date-picker v-model="date" :clearable="isClearable" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData" />
      <el-button type="primary" size="mini" @click="queryData">查询</el-button>
      <el-button size="small" @click="showChart">柜台覆盖信息图</el-button>
      <el-button size="small" @click="jumpDesk">资源视角</el-button>
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
        >&nbsp;&nbsp; <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 : <ins>{{ statsVO.unassignedLockedNum + statsVO.assignedLockedNum }}</ins
        >，
        <!-- <span>
          无人值机数 :
          <ins>{{ unmatchedTaskNum || 0 }}</ins
          >，
        </span> -->
        <span>
          任务匹配率 :
          <ins>{{ currentMatchRatio || 0 }}</ins
          >，
        </span>
        <!-- <span>
          总任务数 :
          <ins>{{ remark || 0 }}</ins>
        </span>-->
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" />
      <label for="cellHeight">cellHeight</label>
      <input v-model.number="cellHeight" type="range" min="20" max="100" />
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width: 15px" />
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size: 12px">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
      <label for="scrollToY">scrollToY</label>
      <input id="scrollToY" v-model.number.lazy="scrollToY" />
    </header>
    <div class="container">
      <v-gantt-chart
        v-loading="loading"
        element-loading-text="计算中..."
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
        custom-generate-blocks
        :scroll-to-postion="positionA"
        :datas="datasB"
      >
        <template v-slot:block="{ data, getWidthAbout2Times, getPositonOffset, isInRenderingTimeRange, startTimeOfRenderArea, endTimeOfRenderArea }">
          <!-- <div
            class="securityType"
            :class="{ securityType2: data.currentStatus }"
            :data="data.id"
            :style="{'margin-top':0.1*cellHeight+'px',width:showddd(data.openTime,data.closeTime,{ scale,cellWidth})+'px'}"
            :left="getPositonOffset(data.openTime)"
          />-->
          <div v-if="!data.gtArray" style="height: 100%; padding-top: 11px">没有任务</div>
          <div
            v-for="(item, index) in data.gtArray"
            :key="index"
            class="gantt-block-item"
            :style="{ left: getPositonOffset(item.start) + 'px', width: getWidthAbout2Times(item.start, item.end, { scale, cellWidth }) + 'px' }"
            :left="getPositonOffset(item.start)"
          >
            <div style="position: relative">
              <div style="height: 40px" @mouseenter="changeActive($event, item)" @mouseleave="changeLeave($event)">
                <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" :statusList="statusList" @changeStatus="changeStatus" />
                <!-- <span v-if="canceltaskshow" class="canceltask" @click="canceltask(item)">
                  <i class="el-icon-error" />
                </span>-->
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="warn" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:showddd(datasB.openTime,datasB.Actualend,{ scale,cellWidth})+'px'}" :left="getPositonOffset(datasB.openTime)" /> -->
        <template v-slot:left="{ data }">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>柜台总数 ( {{ Num }} )</template>
      </v-gantt-chart>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="柜台覆盖信息图表" width="70%" :visible.sync="dialogTableVisible" :close="closeImport">
      <div v-loading="loadingChart">
        <h3 style="margin-top: 0; text-align: center">{{ lineChartDataBig.day }}</h3>
        <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { distribution1, deskChart1, canceltask } from '@/api/checkInData'
import { parameterList } from '@/api/checkInNewHome'
import { searchTaskStatus } from '@/apiNew/vehicle'
import { site } from '@/api/common'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import LineChartBig from '../forecasting/components/LineChartBig'
// import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360`.split(',').map((n) => parseInt(n))
export default {
  name: 'App',
  components: { Test, TestLeft, LineChartBig },
  data() {
    return {
      refreshCount: 0,
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId,
      statusList: [],
      isClearable: false,
      date: this.$route.query.date ? this.$route.query.date : this.getNowFormatDate(),
      statsVO: {},
      canceltaskshow: false,
      employeeName: '',
      lineChartData: [],
      lineChartDataBig: {},
      loadingChart: false,
      dialogTableVisible: false,
      regions1: [],
      intlType1: this.$route.query.deskPredictions.split(',').map(Number),
      bodyHeight: window.innerHeight + 'px',
      kpi: { usableGate: '' },
      loading: false,
      Num: '', // 柜台数
      siteId: '',
      value: '',
      intlType: '', // 柜台类别
      groupstyle: [],
      currentMatchRatio: '',
      remark: '',
      unmatchedTaskNum: '',
      deskRegion: '',
      serviceType: '',
      timeLines: [
        {
          time: dayjs().add(2, 'hour').toString()
        },
        {
          time: dayjs().add(5, 'hour').toString(),
          color: '#747e80'
        }
      ],
      // currentTime: dayjs('2019-10-15'),
      // startTime: '2019-10-15',
      // endTime: '2019-10-17',
      currentTime: dayjs(),
      startTime: this.$route.query.date ? dayjs(this.$route.query.date).subtract(24, 'hour').toString() : dayjs().subtract(24, 'hour').toString(),
      endTime: this.$route.query.date ? dayjs(this.$route.query.date).add(1, 'day').add(24, 'hour').toString() : dayjs().add(1, 'day').add(24, 'hour').toString(),
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 180,
      scale: 30,
      datasNum: 100,
      // datasB: mockDatas(100),
      datasB: [],
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTime: dayjs().add(1, 'day').toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ['gtArray', 'error'],
      scrollToY: 700,
      positionB: {},
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 3200, Y: 10 },
      regions: []
    }
  },
  watch: {
    datasNum(newV) {
      // this.datasA = mockDatas(newV)
      // this.datasB = mockDatas(newV)
    },
    scrollToY(val) {
      this.positionA = { x: val }
    }
  },
  created() {
    // this.site()
    this.intlTypeList()
    this.securityList()
    this.searchAllStatus()
  },
  mounted: function () {
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: 0 }
    })
  },
  methods: {
    // 查询所有任务状态
    searchAllStatus() {
      searchTaskStatus().then((response) => {
        this.statusList = response.data.data
      })
    },
    // 任务状态修改后刷新页面
    changeStatus() {
      this.securityList()
    },
    queryData() {
      this.securityList()
    },
    changeParam(e) {
      this.intlType1 = e
      // this.securityList()
    },
    jumpDesk() {
      this.$router.push({ path: '/dispatching/checkIn/employeetasks', query: { siteId: this.$route.query.siteId || 10, date: this.date, deskPredictions: this.intlType1.join(',') || '', businessDomainId: this.businessDomainId } })
    },
    intlTypeList() {
      this.regions1 = []
      const data = {
        airportId: this.airport.airportId || ''
      }
      parameterList(data)
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
    securityList() {
      this.canceltaskshow = false
      this.$store.commit('changSiteId', Number(this.$route.query.siteId))
      this.$store.commit('changDeskPreditons', this.intlType1)
      // this.datasB = []
      var data = {
        airportId: this.siteId || this.$route.query.siteId,
        deskPredictions: this.intlType1.join(',') || '',
        employeeName: this.employeeName,
        date: this.date
      }
      this.value = this.value || this.$route.query.siteId.toString()
      this.loading = true
      distribution1(data)
        .then((response) => {
          var data = response.data.data
          this.statsVO = data.statsVO
          if (!data.checkInIsLandBeans) {
            this.loading = false
            this.$message.success('暂无数据！')
          } else {
            var datasC = []
            var checkInIsLandBeans = data.checkInIsLandBeans
            this.loading = false
            const transfer = Number(data.currentMatchRatio * 100).toFixed(2)
            this.unmatchedTaskNum = data.unPeople
            this.currentMatchRatio = transfer + '%'
            this.remark = data.totalTaskNum
            for (let i = 0; i < checkInIsLandBeans.length; i++) {
              for (let j = 0; j < checkInIsLandBeans[i].checkInDeskBeans.length; j++) {
                datasC.push(checkInIsLandBeans[i].checkInDeskBeans[j])
              }
            }
            console.log('datasC: ', datasC)
            this.datasB = datasC
            datasC.forEach((element) => {
              var gtArray = []
              element.checkInTaskBeans.forEach((element2) => {
                var employeeName = element2.employeeName
                gtArray.push({
                  end: element2.endTime,
                  start: element2.startTime,
                  name: employeeName,
                  taskStatusId: element2.taskStatusId,
                  taskId: element2.taskId,
                  taskRunningState: element2.taskRunningState,
                  alarmType: element2.alarmType
                })
                element.gtArray = gtArray
              })
            })
            console.log(this.datasB, 110)
            this.Num = this.datasB.length
            // 第一次刷新页面滚动条定位到最早开始的一个任务
            if (this.refreshCount === 0) {
              let taskArray = []
              let deskArray = []
              let beforeCurrent = []
              let afterCurrent = []
              const time = new Date()
              const hour = time.getHours()
              const minute = time.getMinutes()
              const second = time.getUTCSeconds()
              const currentTime = new Date(this.date + ' ' + `${hour}:${minute}:${second}`).getTime()
              data.checkInIsLandBeans.forEach((item) => {
                deskArray = deskArray.concat(item.checkInDeskBeans)
              })
              deskArray.forEach((item) => {
                taskArray = taskArray.concat(item.checkInTaskBeans)
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
              deskArray.forEach((item, index) => {
                if (item.deskId === minItem.deskId) {
                  personRow = index
                }
              })
              console.log(minItem, 656)
              this.positionA = { x: getPositonOffset(minItem.startTime, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
            }
            this.refreshCount = 1
          }
        })
        .catch((e) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    showChart() {
      var _this = this
      // 渲染图表
      var data = {
        airportId: this.$route.query.siteId || '',
        ids: this.intlType1.join(',') || '',
        date: this.date || '',
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
    handleChange(value) {
      this.intlType = value
      this.securityList()
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
                this.securityList()
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
    site() {
      site().then((response) => {
        this.groupstyle = response.data
      })
    },
    change(item) {
      this.siteId = item
      this.securityList()
    },
    scrollLeftA(val) {
      this.positionB = { x: val }
    },
    scrollLeftB(val) {
      this.positionA = { x: val }
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
          color: '#747e80'
        }
      ]
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      this.startTime = dayjs(e).subtract(24, 'hour').toString()
      this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.datasA = []
      this.datasB = []
      this.securityList()
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
<style>
.el-tag.el-tag--info {
  overflow: hidden;
}
</style>
<style scoped>
#app /deep/ .gantt-leftbar {
  /* height: 0px !important; */
  border-bottom: none !important;
}
.container /deep/ .gantt-leftbar {
  outline: none !important;
  border: 1px solid #2d2d2d;
}
.container >>> .gantt-block-item {
  display: block;
  width: 100%;
  height: 6px;
}
.container >>> .gantt-chart {
  /* position: static; */
}
</style>
<style lang="scss" scoped>
#app {
  padding-top: 60px;
}
.textips {
  float: right;
  margin-top: 10px;
  margin-right: 15px;
}
.textips span {
  margin-right: 5px;
}
.textips ins {
  color: #f56c6c;
  text-decoration: none;
}
#app {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 129px);
}
.container >>> .gantt-block {
  background: #000;
  border-bottom: 1px solid #2d2d2d;
}
.container >>> .gantt-blocks-wrapper {
  background: #000;
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
  outline: 1px solid #3e4660;
}
.container >>> .gantt-header-title {
  background: #3e4660;
}
.securityType {
  bottom: 20%;
  height: 60%;
  position: absolute;
  z-index: 0;
}
.securityType2 {
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
label {
  margin-left: 10px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: middle;
}
input[type='range'] {
  width: 100px;
}
.top-bar {
  background: #818aa7;
  font-size: 12px;
}
.canceltask {
  position: absolute;
  right: -5px;
  color: #0f72f5;
  top: -7px;
  z-index: 2;
  cursor: pointer;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
