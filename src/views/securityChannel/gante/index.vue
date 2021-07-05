<template>
  <div id="app">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;">
      <label>站点：</label>
      <el-select v-model="value" style="width:100px" size="small" placeholder="请选择" @change="change">
        <el-option v-for="item in groupstyle" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
      </el-select>
      <label>国际/国内：</label>
      <el-select v-model="intlType" style="width:100px" size="small" placeholder="请选择" @change="change2">
        <el-option v-for="item in regions" :key="item.region" :label="item.name" :value="item.region" />
      </el-select>
      <el-button type="info" size="small" @click="openBaseData2">修改基础数据</el-button>
      <el-button type="info" size="small" @click="openBaseData">修改派工规则</el-button>
      <el-button @click="yuce">资源预测</el-button>
      <!-- <label>航班：</label>
      <el-select
        v-model="value2"
        clearable
        style="width:100px"
        size="small"
        placeholder="请选择"
        @change="change2"
      >
        <el-option
          v-for="item in regions"
          :key="item.region"
          :label="item.name"
          :value="item.region"
        />
      </el-select>-->
      <el-button type="primary" size="mini" @click="restart">重新计算</el-button>
      <el-button type="info" size="small" @click="linkTO">班组视图</el-button>
      <span class="textips">
        <span>
          可用通道 :
          <ins>{{ kpi.usableGate || 0 }}</ins>
        </span>
        <span>
          开放通道 :
          <ins>{{ kpi.opeGate || 0 }}</ins>
        </span>
        <!-- <span>航班数 : <ins>9</ins></span>
        <span>旅客量 : <ins>57</ins></span> <span>最长等待时间 : <ins>20</ins></span>-->
        <span>
          可用人员 :
          <ins>{{ kpi.employeeCount || 0 }}</ins>
        </span>
        <span>
          班组数 :
          <ins>{{ kpi.employeeGroupCount || 0 }}</ins>
        </span>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250">
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
        <template v-slot:title>安检通道总数 ( {{ Num }} )</template>
      </v-gantt-chart>
    </div>
  </div>
</template>
<script>
import { getWidthAbout2Times } from './components/gtUtils.js'
import { securityList, restart } from '@/api/securitychannel'
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
      kpi: { usableGate: '' },
      loading: false,
      Num: '', // 班组数
      siteId: '1',
      value: '',
      intlType: 'D', // 国际国内
      groupstyle: [],
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
      cellHeight: 50,
      titleHeight: 40,
      titleWidth: 250,
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
      positionA: {},
      regions: [
        { name: '国内', region: 'D' },
        { name: '国际', region: 'I' }
      ]
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
    yuce() {
      this.$router.push({ path: '/dispatching/securityChannel/forecasting/forecastings' })
    },
    securityList() {
      var data = {
        siteId: this.siteId,
        region: this.intlType
      }
      this.loading = true
      securityList(data).then(response => {
        this.loading = false
        this.kpi = []
        if (response.data.kpi) {
          this.kpi = response.data.kpi
        }
        this.datasB = response.data.list
        this.Num = this.datasB.length
        response.data.list.forEach(function(element2, i) {
          var gtArray = []
          element2.dutyTaskBeans.forEach(element => {
            var name2 = ''
            if (element.employeeGroupBean) {
              name2 = element.employeeGroupBean.employeeGroupName
            }
            gtArray.push({
              end: element.planEndTime,
              start: element.planStarTime,
              name: name2
            })
            element2.gtArray = gtArray
            // console.log(gtArray, 3333)
          })
        })
        console.log(this.datasB)
      })
    },
    site() {
      site().then(response => {
        // console.log(response.data, 6688)
        this.groupstyle = [response.data]
        this.value = response.data.siteId
      })
    },
    change(item) {
      this.siteId = item
      this.securityList()
    },
    change2(item) {
      this.intlType = item
      this.securityList()
    },
    restart() {
      // 重新计算
      this.datasB = []
      this.loading = true
      restart().then(response => {
        this.securityList()
        this.loading = false
      })
    },
    openBaseData() {
      // 修改派工规则
      this.$router.push({ path: '/ATM/baseType/securityChannelgante' })
    },
    openBaseData2() {
      // 修改基础数据
      this.$router.push({ path: '/ATM/baseType/securityChannel/set', query: { intlType: this.intlType, airportId: 706 }})
      // this.$router.push({ path: '/ATM/baseType/securityChannel/set', query: {intlType: this.intlType, airportId: this.siteId} })
    },
    linkTO() {
      // 跳转到班组视图
      this.$router.push({ path: '/dispatching/securityChannel/staffView', query: { intlType: this.intlType }})
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

<style scoped>
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
}
</style>
