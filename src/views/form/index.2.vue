<template>
  <div id="app">
    <header class="top-bar">
      <label>班组类型：</label>
      <span />
      <el-select v-model="value" style="width:120px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in groupstyle" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>

      <label>任务状态：</label>
      <span />
      <el-select v-model="value2" style="width:120px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in status" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>
      <el-button size="small">自动分配</el-button>
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100">
      <label for="cellHeight">cellHeight</label>
      <input v-model.number="cellHeight" type="range" min="20" max="100">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250">
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox">
      <label for="datasNum">datasNum</label>
      <input id="datasNum" v-model.number.lazy="datasNum">
      <label for="scrollToY">scrollToY</label>
      <input id="scrollToY" v-model.number.lazy="scrollToY">
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>minute</span>
    </header>
    <div class="container" />
    <v-gantt-chart
      :start-time="startTime"
      :end-time="endTime"
      :cell-width="cellWidth"
      :cell-height="cellHeight"
      :time-lines="timeLines"
      :title-height="titleHeight"
      :scale="scale"
      :title-width="titleWidth"
      show-current-time
      :hide-header="hideHeader"
      :data-key="dataKey"
      :array-keys="arrayKeys"
      :scroll-to-postion="positionA"
      :datas="datasA"
      @scrollLeft="scrollLeftA"
    >
      <template v-slot:block="{data,item,getPositonOffset}">
        <Test :data="data" :update-time-lines="updateTimeLines" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
      </template>
      <template v-slot:left="{data}">
        <TestLeft :data="data" />
      </template>
      <template v-slot:title>
        <div class="gantt-header-title-left" />
      </template>
    </v-gantt-chart>
    <v-gantt-chart
      :start-time="startTime"
      :end-time="endTime"
      :cell-width="cellWidth"
      :cell-height="cellHeight"
      :time-lines="timeLines"
      :title-height="titleHeight"
      :scale="scale"
      :title-width="titleWidth"
      show-current-time
      hide-header
      :data-key="dataKey"
      :array-keys="arrayKeys"
      :scroll-to-postion="positionB"
      custom-generate-blocks
      :datas="datasB"
      style="background:#545454"
      @scrollLeft="scrollLeftB"
    >
      <template v-slot:block="{data,getPositonOffset,getWidthAbout2Times,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
        <div v-for="(item,index) in data.gtArray" v-if="isInRenderingTimeRange(item.start)||isInRenderingTimeRange(item.end)" :key="item.id" class="gantt-block-item" :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end)+'px'}" :left="getPositonOffset(item.start)">
          <Test :data="data" :update-time-lines="updateTimeLines" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
          <div class="plan zindex" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:150+'px'}" />
        </div>

      </template>
      <template v-slot:title>
        <TestLeft :data="data" />
      </template>
      <template v-slot:title>铁胆火车侠日程表2</template>
    </v-gantt-chart>
  </div>
</template>

<script>
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'

// import { getWidthAbout2Times } from './components/gtUtils.js'

const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360,720,1440`
  .split(',')
  .map(n => parseInt(n))
export default {
  name: 'App',
  components: { Test, TestLeft },
  data() {
    return {
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
      currentTime: dayjs(),
      startTime: dayjs()
        .subtract(5, 'hour')
        .toString(),
      endTime: dayjs()
        .add(2, 'day')
        .add(2, 'hour')
        .toString(),
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 250,
      scale: 60,
      datasNum: 10,
      datasA: mockDatas(100),
      datasB: mockDatas(100),
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, 'day')
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ['gtArray', 'error'],
      scrollToY: 100,
      positionB: {},
      positionA: {},
      endExchangeIndex: '',
      value: '',
      value2: '',
      groupstyle: [
        { id: '1', value: '可用班组' },
        { id: '2', value: '休息班组' }
      ],
      status: [{ id: '1', value: '已完成' }, { id: '2', value: '未开始' }],
      arg: { scale: this.scale, cellWidth: this.cellWidth }
    }
  },
  watch: {
    datasNum(newV) {
      this.datasA = mockDatas(newV)
      this.datasB = mockDatas(newV)
    },
    scrollToY(val) {
      this.positionA = { x: val }
    }
  },
  created: function() {
  },

  methods: {

    // showddd() {
    //   return getWidthAbout2Times()
    // },
    onClick() {
      // this.updateTimeLines(this.item.Actualstart, this.item.Actualend)
    },
    show(e) {
      console.log(e.target)
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
    scrollLeftA(val) {
      this.positionB = { x: val }
    },
    scrollLeftB(val) {
      this.positionA = { x: val }
    }
  }
}
</script>

<style scoped>
body {
  font: 12px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  height: calc(100vh - 2px);
}

label {
  margin-left: 15px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: middle;
}
input[type="range"] {
  width: 100px;
}
.top-bar {
  padding: 5px;
  color: #fff;
  background: #818aa7;
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
  background: #232c47;
}
.gantt-block-item {
  display: block;
}
.gantt-header-title-left {
  background: #3e4660;
  height: 100%;
}
.main-footer {
  /* height: 30px; */
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 80%;
  border-radius: 5px;
  color: #192e69;
  padding-left: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: inset 0px 20px 40px #fff;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  width: 100%;
}
.plan.zindex {
  top: 0;
  position: absolute;
  z-index: 0;
  background: #ce2e2e;
  box-shadow: inset 0px 0px 0px #fff;
}
>>> .el-slider {
  width: 100px;
}
</style>
