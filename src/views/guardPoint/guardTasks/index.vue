<template>
  <div id="app2">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px">
      <label>日期：</label>
      <el-date-picker v-model="date" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData(date)" />
      <el-button type="primary" size="small" style="margin-left: 10px" @click="jumpDesk">资源视角</el-button>
      <span class="textips">
        今日出港航班数 :
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
        <span>
          无人值守点数 :
          <ins>{{ unmatchedTaskNum || 0 }}</ins>
        </span>
        <span>
          任务匹配率 :
          <ins>{{ currentMatchRatio || 0 }}</ins>
        </span>
      </span>
    </div>
    <header class="top-bar">
      <!-- <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />-->
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" />
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width: 15px" />
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size: 12px">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
    </header>
    <div class="container1">
      <v-gantt-chart
        ref="target"
        v-loading="loading"
        :time-lines="timeLines"
        :start-time="startTime"
        :end-time="endTime"
        :cell-width="cellWidth"
        :cell-height="cellHeight2"
        :title-height="titleHeight"
        :scale="scale"
        :title-width="titleWidth"
        show-current-time
        :hide-header="hideHeader"
        :data-key="dataKey"
        :array-keys="arrayKeys"
        :scroll-to-postion="positionA"
        custom-generate-blocks
        :datas="datasB"
        @scrollLeft="scrollLeftA"
        @scrollTop="scrollLeftA2"
      >
        <template v-slot:block="{ data, getWidthAbout2Times, getPositonOffset, isInRenderingTimeRange, startTimeOfRenderArea, endTimeOfRenderArea }">
          <div
            v-for="(item2, index) in data.gtArray"
            :key="index"
            class="gantt-block-item"
            :h="item2.tasks ? item2.tasks.length : ''"
            :style="{ left: getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(item2.start, item2.end, { scale, cellWidth }) + 'px', top: '8px' }"
          >
            <div style="position: relative">
              <div
                v-for="(itm, index2) in item2.tasks"
                :key="index2"
                class="gantt-block-item"
                :style="{ left: getPositonOffset(itm.beginTime) - getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(itm.beginTime, itm.endTime, { scale, cellWidth }) + 'px', 'margin-top': index2 * 22 + 'px' }"
                @dragstart="dragstart($event, itm)"
              >
                <Test :data="data" :cell-height="cellHeight2" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itm" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data.gtArray[0]" />
        </template>
        <template v-slot:title>值守点总数 ( {{ Num }} )</template>
      </v-gantt-chart>
    </div>
  </div>
</template>
<script>
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import dayjs from 'dayjs'
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { initTable } from '@/apiNew/guardPoint'
const scaleList = `30,60,120,240`.split(',').map((n) => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft },
  data() {
    return {
      refreshCount: 0,
      statsVO: {},
      unmatchedTaskNum: '',
      currentMatchRatio: '',
      Num: '',
      businessDomainId: this.$route.query.businessDomainId,
      formAddServer: {},
      isNaN: '', // 修bug 用
      loading: false,
      timeLines: [],
      // date: '2020-02-26', // 选择日期
      // currentTime: dayjs().subtract(dayjs().diff(dayjs('2020-02-26'), 'day'), 'day'),
      // startTime: '2020-02-26 04:00',
      // endTime: '2020-02-28',
      date: this.$route.query.date ? this.$route.query.date : this.getNowFormatDate(), // 选择日期
      currentTime: dayjs(),
      startTime: this.$route.query.date ? dayjs(this.$route.query.date).subtract(24, 'hour').toString() : dayjs(this.$route.query.date).subtract(24, 'hour').toString(),
      endTime: this.$route.query.date ? dayjs(this.$route.query.date).add(1, 'day').add(24, 'hour').toString() : dayjs(this.$route.query.date).add(24, 'hour').add(24, 'hour').toString(),
      cellWidth: 50,
      cellHeight: 35,
      cellHeight2: 80,
      titleHeight: 40,
      titleWidth: 200,
      scale: 60,
      datasNum: 100,
      datasA: [],
      datasB: [],
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTimeB: dayjs().subtract(10, 'hour').toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideHeader2: true,
      arrayKeys: ['gtArray', 'error'],
      positionB: { x: this.$route.query.data ? localStorage.scrollx - 600 : 600, Y: 10000 },
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 600, Y: 1000 }
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
    positionA(newV) {}
  },
  created: function () {
    this.unassignedTask()
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
          var max = Math.max.apply(null, maxH)
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
    jumpDesk() {
      this.$router.push({ path: '/dispatching/guardPoint/employeetasks1', query: { businessDomainId: this.businessDomainId, siteId: this.$route.query.siteId, deskPredictions: this.intlType || '', date: this.date } })
    },
    unassignedTask() {
      var data = {
        // siteId: this.siteId || this.$route.query.siteId,
        // deskType: this.intlType
        airportId: this.siteId || this.$route.query.siteId,
        deskPredictions: this.intlType1 || '',
        businessDomainId: this.businessDomainId,
        date: this.date
      }
      this.value = this.value || this.$route.query.siteId.toString()
      this.loading = true
      initTable(data)
        .then((response) => {
          var data = response.data.data
          this.statsVO = data.statsVO
          if (!data.guardSkipVOList) {
            this.loading = false
            this.$message.success('暂无数据！')
          } else {
            var datasC = []
            var guardSkipVOList = data.guardSkipVOList
            this.loading = false
            const transfer = Number(data.currentMatchRatio * 100).toFixed(2)
            this.unmatchedTaskNum = data.unPeople
            this.currentMatchRatio = transfer + '%'
            this.remark = data.totalTaskNum
            guardSkipVOList.forEach((element) => {
              element.guardPointVOList.forEach((element1) => {
                var gtArray = []
                this.datasB.push({
                  gtArray: gtArray
                })
                gtArray.push({
                  id: element1.pointId,
                  taskName: element1.pointName,
                  end: element1.endTime,
                  start: element1.startTime,
                  tasks: element1.guardTaskVOs
                })
              })
            })
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
              data.guardSkipVOList.forEach((item) => {
                deskArray = deskArray.concat(item.guardPointVOList)
              })
              deskArray.forEach((item) => {
                taskArray = taskArray.concat(item.guardTaskVOs)
              })
              taskArray.forEach((item) => {
                if (new Date(item.beginTime).getTime() > currentTime) {
                  afterCurrent.push(item)
                } else {
                  beforeCurrent.push(item)
                }
              })
              let min = null
              let minItem = {}
              let personRow = null
              if (beforeCurrent.length) {
                min = new Date(beforeCurrent[0].beginTime).getTime() - currentTime
                for (var i = 0; i < beforeCurrent.length; i++) {
                  var cur = new Date(beforeCurrent[i].beginTime).getTime() - currentTime
                  if (cur > min) {
                    // 找到离当前时间最近的一个任务
                    minItem = beforeCurrent[i]
                  } else {
                    minItem = beforeCurrent[0]
                  }
                }
              } else if (afterCurrent.length) {
                min = new Date(afterCurrent[0].beginTime).getTime() - currentTime
                for (var i = 0; i < afterCurrent.length; i++) {
                  var cur = new Date(afterCurrent[i].beginTime).getTime()
                  if (cur - currentTime > min) {
                    minItem = afterCurrent[i]
                  } else {
                    minItem = afterCurrent[0]
                  }
                }
              }
              deskArray.forEach((item, index) => {
                if (item.pointId === minItem.pointId) {
                  personRow = index
                }
              })
              this.positionA = { x: getPositonOffset(minItem.beginTime, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
            }
            this.refreshCount = 1
          }
        })
        .catch((e) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message || e.response.data.message || '服务器内部错误'
          })
        })
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
      // alert(val, 666)
      this.positionB = { x: val }
      // this.staticDistance = val
    },
    scrollLeftB(val) {
      this.positionA = { x: val }
    },
    scrollLeftA2(val) {
      this.cellHeight2 = 170
    },
    scrollLeftB2(val) {
      this.positionB = { Y: val }
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      this.startTime = dayjs(e).subtract(1, 'day').toString()
      this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.unassignedTask()
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
/* #app2 /deep/ .splitpanes__splitter {
  background-color: #333e5f;
} */
#app2 {
  padding: 60px 0 0 10px;
}
#app2 /deep/ .gantt-leftbar-defalutItem {
  display: none;
}
#app2 /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
#app2 /deep/ td,
tr,
th {
  text-align: left;
}
#app2 /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
.textips {
  float: right;
  margin-top: 10px;
  margin-right: 15px;
  padding-left: 10px;
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
  /* position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: blue; */
}
/* .container1 {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 70%;
  padding-bottom: 370px;
}
.container1 >>> .gantt-block {
  background: #000;
  border-bottom: 1px solid #2d2d2d;
  height: 80px;
}
.container1 >>> .gantt-header {
  background: #3e4660;
}
.container1 >>> .gantt-timeline-day {
  font-size: 14px;
  color: #ffffff;
}
.container1 >>> .gantt-timeline-scale > div {
  font-size: 0.4rem;
  font-weight: lighter;
  color: #b9bcc5;
}
.container1 >>> .gantt-leftbar,
.container1 >>> .leftbotm,
.container1 >>> .gantt-leftbar-wrapper {
  width: 200px !important;
  background: #000;
}
.container1 >>> .gantt-markline-area,
.container1 >>> .gantt-scroll-x {
  margin-left: 200px !important;
}
.container1 >>> .gantt-chart {
  background: #000;
}
.container1 >>> .gantt-block-item {
  display: block;
  width: 100%;
  height: 6px;
} */
.container1 {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 70%;
}
.container1 >>> .gantt-block {
  background: #000;
  border-bottom: 1px solid #2d2d2d;
}
.container1 >>> .gantt-header {
  background: #3e4660;
}
.container1 >>> .gantt-timeline-day {
  font-size: 14px;
  color: #ffffff;
}
.container1 >>> .gantt-timeline-scale > div {
  font-size: 0.4rem;
  font-weight: lighter;
  color: #b9bcc5;
}
.container1 >>> .gantt-leftbar,
.container1 >>> .gantt-leftbar-wrapper {
  background: #000;
}
.gantt-block-item {
  display: block;
}
</style>
