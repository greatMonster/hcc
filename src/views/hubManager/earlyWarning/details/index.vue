<template>
  <div id="app">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;">
      <div style="display:flex;width:50%;justify-content:space-between">
        <span>
          航班号：{{ flightNo }}
        </span>
        <span>
          预计出发时间：{{ detailsData.etd || '' }}
        </span>
        <span>
          登机口：{{ detailsData.deptGate }}
        </span>
        <span>
          机位：{{ detailsData.deptAcPos }}
        </span>
        <span>
          机坪：{{ detailsData.apronName }}
        </span>
        <span>
          正常：
          <ins style="background:#87a054" />
        </span>
        <span>
          预警：
          <ins style="background:#cc8a1d" />
        </span>
        <span>
          告警：
          <ins style=" background:red" />
        </span>
      </div>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="300">
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100">
      <label for="cellHeight">cellHeight</label>
      <input v-model.number="cellHeight" type="range" min="20" max="100">
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width:15px">
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size:12px">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
      <label for="scrollToY">scrollToY</label>
      <input id="scrollToY" v-model.number.lazy="scrollToY">
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
        <template v-slot:block="{data,getWidthAbout2Times,getPositonOffset}">
          <div v-for="(item2,index) in data.gtArray" :key="index" class="gantt-block-item" :h="2" :style="{left:getPositonOffset(item2.start)+'px',width:getWidthAbout2Times(item2.start,item2.end,{ scale,cellWidth})+'px'}">
            <div>
              <Test :data="data" :item="item2" />
            </div>
          </div>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <div style="display:flex;justify-content:space-around;font-size:14px">
            <span>任务名称</span>
            <span>开始时间</span>
            <span>结束时间</span>
          </div>
        </template>
      </v-gantt-chart>
    </div>
  </div>
</template>
<script>
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { initTask, detailsData } from '@/api/earlyWarning'
// import { getStatistics } from '@/apiNew/specialVehicle'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import dayjs from 'dayjs'
const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360`.split(',').map(n => parseInt(n))
export default {
  name: 'App',
  components: { Test, TestLeft },
  data() {
    return {
      flightNo: this.$route.query.flightNo,
      getStat: {},
      flightId: this.$route.query.flightId,
      bodyHeight: window.innerHeight + 'px',
      loading: false,
      groupstyle: [],
      currentMatchRatio: '',
      remark: '',
      detailsData: {},
      unmatchedTaskNum: '',
      deskRegion: '',
      serviceType: '',
      timeLines: [
        {
          time: dayjs()
            .add(2, 'hour')
            .toString()
        },
        {
          time: dayjs()
            .add(5, 'hour')
            .toString(),
          color: '#747e80'
        }
      ],
      // currentTime: dayjs('2019-10-15'),
      // startTime: '2019-10-15',
      // endTime: '2019-10-17',
      currentTime: dayjs(),
      startTime: dayjs()
        .subtract(18, 'hour')
        .toString(),
      endTime: dayjs()
        .add(1, 'day')
        .add(2, 'hour')
        .toString(),
      date: this.getNowFormatDate(),
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 250,
      scale: 15,
      datasNum: 100,
      dateTime: '',
      datasB: [],
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, 'day')
        .toString(),
      //   scrollToPostion: { x: 500, y: 500 },
      hideHeader: false,
      arrayKeys: ['gtArray', 'error'],
      scrollToY: 500,
      positionA: { x: 1000, Y: 100 },
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
    this.securityList()
    this.detailsFan()
  },
  updated: function() {
    // 动态改变行高，自适应行高
    var _this = this
    var p = document.querySelectorAll('.gantt-block')
    p.forEach(function(element, index) {
      var setH = element.childNodes ? element.childNodes : ''
      var maxH = []
      _this.$nextTick(function() {
        if (maxH.length > 0) {
          var max = Math.max.apply(null, maxH) || 1
          element.style.height = max * 34 + 'px'
          document.querySelectorAll('.gantt-leftbar-item')[index].style.height = element.style.height
        }
      })
      if (setH) {
        setH.forEach(element2 => {
          maxH.push(parseInt(element2.getAttribute('h')))
        })
      }
    })
  },
  methods: {
    securityList() {
      var data = {
        flightId: this.flightId,
        flightNo: this.flightNo
      }
      this.flightId
      this.loading = true
      initTask(data).then(response => {
        // var data = response.data.data
        var that = this
        this.loading = false
        response.data.data.forEach(function(cur) {
          var gtArray = []
          that.datasB.push({
            gtArray: gtArray
          })
          gtArray.push({
            taskName: cur.nodeName,
            eno: cur.eno,
            sno: cur.sno,
            nodeNo: cur.nodeNo,
            end: cur.planEnd,
            start: cur.planBegin,
            actualEnd: cur.actualEnd,
            actualBegin: cur.actualBegin,
            taskRunningState: cur.taskRunningState,
            alarmMsgs: cur.alarmMsgs,
            subTasks: cur.subTasks
          })
        })
        if (response.data.data.length) {
          this.positionA = { x: getPositonOffset(response.data.data[0].planBegin, this.startTime, { scale: 15, cellWidth: 50 }) }
        }
      })
    },
    detailsFan() {
      detailsData(this.flightId).then(res => {
        this.detailsData = res.data.data
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
          color: '#747e80'
        }
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
    }
  }
}
</script>

<style scoped>
#app /deep/ .gantt-leftbar {
  /* height: 0px !important; */
  border-bottom: none !important;
}
.container /deep/ .gantt-leftbar {
  outline: none !important;
  border: 1px solid #2d2d2d;
}
</style>
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
.textips span ins {
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
span{

  ins {
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
    }
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

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.warn-style {
  cursor: pointer;
}
</style>
