<template>
  <div id="app">
    <header class="top-bar">
      <label>班组类型：</label><span></span>
          <el-select v-model="value" style="width:120px" size="small" placeholder="请选择">
            <el-option v-for="(item,i) in groupstyle" :key="i" :value="item.value">{{ item.value }}</el-option>
          </el-select>
    
          <label>任务状态：</label><span></span>
          <el-select v-model="value2" style="width:120px" size="small" placeholder="请选择">
            <el-option v-for="(item,i) in status" :key="i" :value="item.value">{{ item.value }}</el-option>
          </el-select>
        
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
    <v-gantt-chart :start-time="startTime" :end-time="endTime" :cell-width="cellWidth" :cell-height="cellHeight" :time-lines="timeLines" :title-height="titleHeight" :scale="scale" :title-width="titleWidth" show-current-time :hide-header="hideHeader"
:data-key="dataKey" :array-keys="arrayKeys" :scroll-to-postion="positionA" :datas="datasA" @scrollLeft="scrollLeftA">
      <template v-slot:block="{data,item}">
        
          <Test :data="data" :update-time-lines="updateTimeLines" :cell-height="cellHeight" :current-time="currentTime" :item="item"  @drop="onDrop($event)"/>
        
      </template>
      <template v-slot:left="{data}">
        <TestLeft :data="data" />
      </template>
      <template v-slot:title>
        <div class="gantt-header-title-left">
      
        </div>
      </template>
    </v-gantt-chart>
    <v-gantt-chart :start-time="startTime" :end-time="endTime" :cell-width="cellWidth" :cell-height="cellHeight" :time-lines="timeLines" :title-height="titleHeight" :scale="scale" :title-width="titleWidth" show-current-time hide-header
:data-key="dataKey" :array-keys="arrayKeys" :scroll-to-postion="positionB" custom-generate-blocks :datas="datasB" style="background:#545454" @scrollLeft="scrollLeftB">
      <template v-slot:block="{data,getPositonOffset,getWidthAbout2Times,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
        <!-- <div class="gantt-block" :style="blockStyle" v-for="(item,index) in data" :key="dataKey?item[dataKey]:index"> -->

        <div v-for="(item,index) in data.gtArray" v-if="isInRenderingTimeRange(item.start)||isInRenderingTimeRange(item.end)" :key="item.id" class="gantt-block-item" :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end)+'px'}" :left="getPositonOffset(item.start)" draggable="true" @dragstart="dragstart($event)" @dragend="dragend($event)" @dragover="allowDrop($event)">
          <Test :data="data" :update-time-lines="updateTimeLines" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
        </div>

        <!-- </div> -->
      </template>
      <template v-slot:title>
          <TestLeft :data="data" />
        </template>
      <template v-slot:title>
        铁胆火车侠日程表2
      </template>
    </v-gantt-chart>
  </div>
</template>

<script>
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import dr from "./dynamic-render.js"

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
          time: dayjs().add(2, 'hour').toString()
        },
        {
          time: dayjs().add(5, 'hour').toString(), color: '#747e80'
        }
      ],
      currentTime: dayjs(),
      startTime: dayjs().subtract(5, 'hour').toString(),
      endTime: dayjs().add(2, 'day').add(2, 'hour').toString(),
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
      value2:'',
      groupstyle: [{ id: '1', value: '可用班组' }, { id: '2', value: '休息班组' }],    
      status: [{ id: '1', value: '已完成' }, { id: '2', value: '未开始' }]
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
    computed: {
    blockStyle() {
      return {
        backgroundSize: `${this.cellWidth}px ${this.cellHeight}px`,
        height: `${this.cellHeight}px`
      };
    }
  },
  methods: {
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
    },

    allowDrop(ev) {
      
      var a = ev.target.style.left + 'px'
      //  var a = ev.target.getAttribute('left') + 'px'
       var b = ev.clientY
       b = 400
        console.log(b)
    },
    dragstart(ev) {
      
      //  alert(3)
      // this.startExchangeIndex = event.target.getAttribute('data-id') || event.target.parentNode.getAttribute('data-id')
      // this.updateTimeLines(this.item.start, this.item.end)
      //  var a = this.generateTimeScale(START_DAY)
      // console.log(this.datasA)
      //        console.log(ev)
      // console.log('拖拽开始', this.startExchangeIndex)
      //  var a = ev.target.getAttribute('left') + 'px'
      // var b = ev.clientX
      // console.log(b,22222)
       var b = ev.clientY
       b = 400
    },
    dragend(ev) {
      //  var a = ev.target.getAttribute('left') + 'px'
      //   ev.target.style.left = a
      // alert(3)
      // const startMemberIndex = parseInt(this.startExchangeIndex.split('-')[1]) - 1
      // const endMemberIndex = parseInt(this.endExchangeIndex.split('-')[1]) - 1
      // this.namelist2[endMemberIndex].name = this.namelist[startMemberIndex].name
      // this.namelist[startMemberIndex] = ''
      //  var a = ev.target.getAttribute('left') + 'px'
      //  var b = ev.clientX
      //  console.log(a,1111)
      // ev.target.style.left = '100px'

      // console.log(a, 2222)
      var b = ev.clientY
       b = 400
      console.log('拖拽结束')
    },
    onDrop(event) {
      var a = event.target.getAttribute('left') + 'px'
      console.log(a, 1111)
      this.endExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      console.log(this.endExchangeIndex, '返回目标id')
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

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #232c47;
}
.gantt-header-title-left {
  background: #3e4660;
  height: 100%;
}
.main-footer {
  /* height: 30px; */
}

>>> .el-slider {
  width: 100px;
}
</style>
