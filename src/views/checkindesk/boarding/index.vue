<template>
  <div id="app" style="height: calc(100vh)">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px">
      <!-- <div > -->
      <span class="textips">
        航班数 :
        <ins>{{ getStat.flightNum }}</ins
        >， 总任务数 : <ins>{{ getStat.totalTaskNum }}</ins
        >， 自动派工率 : <ins>{{ getStat.automaticAssignmentRate }}</ins
        >， 工时利用率 : <ins>{{ getStat.percentage }}-</ins>， <span style="display: inline-block; width: 10px; height: 10px; background: #3a8ee6; margin-right: 3px" />未分配 : <ins>{{ getStat.unassignedNum }}</ins
        >，
        <!-- 待分配 :#255e9a
        <ins>{{ getStat.unassignedNum }}</ins>，-->
        <span style="display: inline-block; width: 10px; height: 10px; background: #1156f0; margin-right: 3px" />已分配 : <ins>{{ getStat.assignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(103, 194, 58) 50%; margin-right: 3px" />已开始&nbsp;&nbsp;: <ins>{{ getStat.startedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(67, 162, 43) 50%; margin-right: 3px" />已接收 : <ins>{{ getStat.receivedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #a4abc0; margin-right: 3px" />已完成 : <ins>{{ getStat.completedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #99004d; margin-right: 3px" />已取消 : <ins>{{ getStat.canceledNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #ff3399; margin-right: 3px" />已超时 : <ins>{{ getStat.timeoutNum }}</ins
        >，
        <span class="warn-style" @click="opentaskWarning(7)">
          <span style="color: yellow">！</span>告警 : <ins>{{ getStat.warningNum }}</ins> </span
        >， <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 :
        <ins>{{ getStat.unassignedLockedNum + getStat.assignedLockedNum }}</ins>
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
          <div
            v-for="(item2, index) in data.gtArray"
            :key="index"
            class="gantt-block-item"
            :h="item2.tasks.length"
            :style="{ left: getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(item2.start, item2.end, { scale, cellWidth }) + 'px', top: '8px' }"
          >
            <div style="position: relative">
              <div
                v-for="(itm, index2) in item2.tasks"
                :key="index2"
                class="gantt-block-item"
                :style="{ left: getPositonOffset(itm.expectedStartTime) - getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(itm.expectedStartTime, itm.expectedEndTime, { scale, cellWidth }) + 'px', 'margin-top': index2 * 22 + 'px' }"
              >
                <Test :data="data" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itm" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>登机口总数 ( {{ Num }} )</template>
      </v-gantt-chart>
    </div>
    <!-- 弹框 -->
    <!-- <el-dialog v-dialogDrag title="柜台覆盖信息图表" width="70%" :visible.sync="dialogTableVisible" :close="closeImport">
      <div v-loading="loadingChart">
        <h3 style="margin-top: 0;text-align: center;">{{ lineChartDataBig.day }}</h3>
        <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px;cursor:pointer" />
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { boardGate } from '@/api/checkInData'
import { getStatistics } from '@/apiNew/specialVehicle'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import dayjs from 'dayjs'
const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360`.split(',').map((n) => parseInt(n))
export default {
  name: 'App',
  components: { Test, TestLeft },
  //   components: { Test, TestLeft },
  data() {
    return {
      date: this.$route.query.date,
      refreshCount: 0,
      businessDomainId: this.$route.query.businessDomainId,
      getStat: {},
      lineChartData: [],
      lineChartDataBig: {},
      loadingChart: false,
      dialogTableVisible: false,
      regions1: [],
      intlType1: this.$route.query.deskPredictions,
      bodyHeight: window.innerHeight + 'px',
      kpi: { usableGate: '' },
      loading: false,
      Num: '', // 柜台数
      //   siteId: '',
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
          time: dayjs().add(2, 'hour').toString(),
        },
        {
          time: dayjs().add(5, 'hour').toString(),
          color: '#747e80',
        },
      ],
      // currentTime: dayjs('2019-10-15'),
      // startTime: '2019-10-15',
      // endTime: '2019-10-17',
      currentTime: dayjs(),
      startTime: dayjs().subtract(18, 'hour').toString(),
      endTime: dayjs().add(1, 'day').add(2, 'hour').toString(),
      date: this.getNowFormatDate(),
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 180,
      scale: 15,
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
      positionA: { x: 2500, Y: 100 },
      regions: [],
    }
  },
  watch: {
    datasNum(newV) {
      // this.datasA = mockDatas(newV)
      // this.datasB = mockDatas(newV)
    },
    scrollToY(val) {
      this.positionA = { x: val }
    },
  },
  created() {
    this.securityList()
    this.getStatistics()
  },
  mounted() {
    const dom = document.querySelector('.gantt-chart')
    var _this = this
    dom.addEventListener(
      'scroll',
      function () {
        var p = document.querySelectorAll('.gantt-block')
        p.forEach(function (element, index) {
          var setH = element.childNodes ? element.childNodes : ''
          var maxH = []
          _this.$nextTick(function () {
            if (maxH.length > 0) {
              var max = Math.max.apply(null, maxH) || 1
              element.style.height = max * 34 + 'px'
              document.querySelectorAll('.gantt-leftbar-item')[index].style.height = element.style.height
              // document.querySelectorAll('.gantt-block-top-space')[index].style.height = '10000px'
            }
          })
          if (setH) {
            setH.forEach((element2) => {
              maxH.push(parseInt(element2.getAttribute('h')))
            })
          }
        })
      },
      true
    )
  },
  updated: function () {
    // 动态改变行高，自适应行高
    var _this = this
    var p = document.querySelectorAll('.gantt-block')
    p.forEach(function (element, index) {
      var setH = element.childNodes ? element.childNodes : ''
      var maxH = []
      _this.$nextTick(function () {
        if (maxH.length > 0) {
          var max = Math.max.apply(null, maxH) || 1
          element.style.height = max * 34 + 'px'
          document.querySelectorAll('.gantt-leftbar-item')[index].style.height = element.style.height
          // document.querySelectorAll('.gantt-block-top-space')[index].style.height = '10000px'
        }
      })
      if (setH) {
        setH.forEach((element2) => {
          maxH.push(parseInt(element2.getAttribute('h')))
        })
      }
    })
  },

  methods: {
    opentaskWarning(taskStatus) {
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { businessDomainId: this.businessDomainId, taskStatus: taskStatus } })
      window.open(routeData.href, '_blank')
    },
    getStatistics() {
      // 统计数据
      const skillId = this.intlType1.length > 1 ? '' : this.intlType1
      var data = {
        // skillId: this.intlType1.split(',').length > 1 ? '' : this.intlType1,
        skillId: skillId,
        taskDate: this.date,
        businessDomainId: this.businessDomainId,
        mixStatus: '',
      }
      getStatistics(data).then((response) => {
        this.getStat = response.data.data
      })
    },
    securityList() {
      var data = {
        deskPredictions: this.intlType1,
        date: this.date,
      }
      this.loading = true
      boardGate(data).then((response) => {
        // var data = response.data.data
        var that = this
        this.loading = false
        response.data.data.forEach(function (cur) {
          var gtArray = []
          that.datasB.push({
            gtArray: gtArray,
          })
          // console.log(cur, 6655)
          cur.forEach((element) => {
            gtArray.push({
              taskName: element.code,
              end: element.endTime,
              start: element.startTime,
              tasks: element.tasks,
            })
            // console.log(gtArray, 'gtArray')
          })
          // 初始化页面时滚动条位置
          // if (this.refreshCount === 0) {
          //   let taskArray = []
          //   const beforeCurrent = []
          //   const afterCurrent = []
          //   const time = new Date()
          //   const hour = time.getHours()
          //   const minute = time.getMinutes()
          //   const second = time.getUTCSeconds()
          //   const currentTime = new Date(this.date + ' ' + `${hour}:${minute}:${second}`).getTime()
          //   console.log(this.date, 444)
          //   response.data.data.forEach((item) => {
          //     taskArray = taskArray.concat(item.tasks)
          //   })
          //   taskArray.forEach((item) => {
          //     if (new Date(item.planInPlace).getTime() > currentTime) {
          //       afterCurrent.push(item)
          //     } else {
          //       beforeCurrent.push(item)
          //     }
          //   })
          //   let minItem = {}
          //   let min = null
          //   let personRow = null
          //   if (beforeCurrent.length) {
          //     min = new Date(beforeCurrent[0].planInPlace).getTime() - currentTime
          //     for (var i = 0; i < beforeCurrent.length; i++) {
          //       var cur = new Date(beforeCurrent[i].planInPlace).getTime() - currentTime
          //       if (cur > min) {
          //         minItem = beforeCurrent[i]
          //       } else {
          //         minItem = beforeCurrent[0]
          //       }
          //     }
          //   } else if (afterCurrent.length) {
          //     min = new Date(afterCurrent[0].planInPlace).getTime() - currentTime
          //     for (var i = 0; i < afterCurrent.length; i++) {
          //       var cur = new Date(afterCurrent[i].planInPlace).getTime()
          //       if (cur - currentTime > min) {
          //         minItem = afterCurrent[i]
          //       } else {
          //         minItem = afterCurrent[0]
          //       }
          //     }
          //   }
          //   console.log(beforeCurrent, 555)
          //   console.log(minItem, 666)
          //   response.data.data.forEach((item, index) => {
          //     if (item.code === minItem.code) {
          //       personRow = index
          //     }
          //   })
          //   this.positionA = { x: getPositonOffset(minItem.planInPlace, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
          // }
        })
        // this.datasB = data
        this.Num = this.datasB.length
      })
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
          time: timeA,
        },
        {
          time: timeB,
          color: '#747e80',
        },
      ]
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
    },
  },
}
</script>
 <style lang="scss" scoped>
#app {
  margin-top: 60px;
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
  overflow: hidden;
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

#app {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh);
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding-bottom: 100px;
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
</style>
