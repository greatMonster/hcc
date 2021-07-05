<template>
  <div id="app">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;">
      <!-- <label>站点：</label>
      <el-select v-model="value" style="width:150px" size="small" placeholder="请选择" @change="change">
        <el-option v-for="item in groupstyle" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
      </el-select>-->
      <label>柜台类别：</label>
      <el-select v-model="intlType" style="width:100px" size="small" placeholder="请选择" @focus="intlTypeList" @change="handleChange">
        <el-option v-for="item in regions" :key="item.deskType" :label="item.deskTypeName" :value="item.deskType" />
      </el-select>
      <span class="textips">
        <span>
          无人值机 :
          <ins>{{ unmatchedTaskNum || 0 }}</ins>
        </span>
        <span>
          任务匹配率 :
          <ins>{{ currentMatchRatio || 0 }}</ins>
        </span>
        <span>
          柜台通道最长排队时间 :
          <ins>{{ remark || 0 }} min</ins>
        </span>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" >
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" >
      <label for="cellHeight">cellHeight</label>
      <input v-model.number="cellHeight" type="range" min="20" max="100" >
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width:15px" >
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size:12px">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
      <label for="scrollToY">scrollToY</label>
      <input id="scrollToY" v-model.number.lazy="scrollToY" >
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
        <template v-slot:block="{data,getWidthAbout2Times,getPositonOffset,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
          <div
            class="securityType"
            :class="{ securityType2: data.currentStatus }"
            :data="data.id"
            :style="{'margin-top':0.1*cellHeight+'px',width:showddd(data.openTime,data.closeTime,{ scale,cellWidth})+'px'}"
            :left="getPositonOffset(data.openTime)"
          />
          <div v-for="(item,index) in data.gtArray" :key="index" class="gantt-block-item" :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end,{ scale,cellWidth})+'px'}" :left="getPositonOffset(item.start)">
            <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
          </div>
        </template>
        <!-- <div class="warn" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:showddd(datasB.openTime,datasB.Actualend,{ scale,cellWidth})+'px'}" :left="getPositonOffset(datasB.openTime)" /> -->
        <template v-slot:left="{data}">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>柜台总数 ( {{ Num }} )</template>
      </v-gantt-chart>
    </div>
  </div>
</template>
<script>
import { getWidthAbout2Times } from './components/gtUtils.js'
import { distribution, intlTypeList } from '@/api/checkInData'
import { site } from '@/api/common'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
// import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360`.split(',').map(n => parseInt(n))
export default {
  name: 'App',
  components: { Test, TestLeft },
  data() {
    return {
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
      startTime: this.$route.query.data
        ? dayjs(this.$route.query.data)
          .subtract(2, 'hour')
          .toString()
        : dayjs()
          .subtract(9, 'hour')
          .toString(),
      endTime: this.$route.query.data
        ? dayjs(this.$route.query.data)
          .add(1, 'day')
          .add(2, 'hour')
          .toString()
        : dayjs()
          .add(1, 'day')
          .add(2, 'hour')
          .toString(),
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
      scrollToTime: dayjs()
        .add(1, 'day')
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ['gtArray', 'error'],
      scrollToY: 700,
      positionB: {},
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 600, Y: 10 },
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
    this.site()
    this.securityList()
  },
  methods: {
    intlTypeList() {
      this.regions = []
      var data = {
        siteId: this.siteId || this.$route.query.siteId
      }
      intlTypeList(data).then(response => {
        this.regions = response.data
      })
    },
    securityList() {
      var data = {
        siteId: this.siteId || this.$route.query.siteId,
        deskType: this.intlType
      }
      this.value = this.value || this.$route.query.siteId.toString()
      this.loading = true
      distribution(data).then(response => {
        if (response.data.checkInIsLandBeans.length < 1) {
          this.$message.success('暂无分配信息！')
        }
        var datasC = []
        var checkInIsLandBeans = response.data.checkInIsLandBeans
        this.loading = false
        const transfer = Number(response.data.currentMatchRatio * 100).toFixed(2)
        this.unmatchedTaskNum = response.data.unmatchedTaskNum
        this.currentMatchRatio = transfer + '%'
        this.remark = response.data.maximumLatency
        for (let i = 0; i < checkInIsLandBeans.length; i++) {
          for (let j = 0; j < checkInIsLandBeans[i].checkInDeskBeans.length; j++) {
            datasC.push(checkInIsLandBeans[i].checkInDeskBeans[j])
          }
        }
        console.log('datasC: ', datasC)
        this.datasB = datasC
        datasC.forEach(element => {
          var gtArray = []
          element.checkInTaskBeanList.forEach(element2 => {
            var employeeName = element2.employeeName
            gtArray.push({
              end: element2.endTime,
              start: element2.startTime,
              name: employeeName
            })
            element.gtArray = gtArray
          })
        })
        this.Num = this.datasB.length
      })
    },
    handleChange(value) {
      this.intlType = value
      this.securityList()
    },
    site() {
      site().then(response => {
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
    }
  }
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
.textips span ins {
  color: #f56c6c;
  text-decoration: none;
}
#app {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
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

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
