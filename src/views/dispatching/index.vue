<template>
  <div id="app2">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;margin-top: 60px">
      <label>站点</label>
      <el-select v-model="value" style="width:100px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in groupstyle" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>
      <label>任务状态</label>
      <el-select v-model="value2" style="width:100px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in status" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>
      <el-button class="item-btn" size="small" type="primary" style="background: #3e4660!important;border: 1px solid #000!important;" @click="dialogFormVisible = true"><svg-icon icon-class="peoples" />资源池管理</el-button>
      <span class="textips">
        航班数 : <ins>1231</ins>，已分配任务 : <ins>531</ins>，未分配任务 : <ins>71</ins>，已接收任务 : <ins>431</ins>，未接收任务 : <ins>831</ins>，告警数量 : <ins>121</ins>，已处理告警 : <ins>131</ins>，未处理告警 : <ins>31</ins>
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
    <div
      class="container"
      @dragend="dragend($event)"
      @dragover="allowDrop($event)"
      @drop="onDrop($event)"
    >
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
      >
        <template v-slot:block="{data,getWidthAbout2Times,getPositonOffset,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
          <div v-for="(item,index) in data.gtArray" :key="index" class="gantt-block-item" :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end,{ scale,cellWidth})+'px'}" :left="getPositonOffset(item.start)">
            <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
            <!-- <div class="plan zindex" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:showddd(item.Actualstart,item.Actualend,{ scale,cellWidth})+'px'}" :left="getPositonOffset(item.Actualstart)" /> -->
            <div class="warn" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:showddd(item.Actualstart,item.Actualend,{ scale,cellWidth})+'px'}" :left="getPositonOffset(item.Actualstart)" />
            <div class="progressBar" :data="data.id" :left="getPositonOffset(item.Actualstart)">
              <span v-if="item.Actualstart !==''" class="tasksAccepted"><svg-icon icon-class="user" /></span>
            </div>
            <div class="vvip">
              <span>特</span> <span class="vip">VIP</span>
            </div>
          </div>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <div class="gantt-header-title-left">
            <label style="font-size:12px;margin-left:5px">班组类型：</label>
            <el-select v-model="value" style="width:106px" size="small" placeholder="请选择">
              <el-option v-for="(item,i) in groupstyle" :key="i" :value="item.value">{{ item.value }}</el-option>
            </el-select>
          </div>
        </template>
      </v-gantt-chart>
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
        :scroll-to-postion="positionA"
        :datas="datasA"
        @scrollLeft="scrollLeftA"
      >
        <template v-slot:block="{data,item,getPositonOffset}">
          <div draggable="true" @dragstart="dragstart($event)">
            <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
          </div>
        </template>
      </v-gantt-chart>
      <!-- 添加班组 -->
      <el-dialog title="添加班组" :visible.sync="dialogFormVisible" width="680px">
        <div class="transfer">
          <el-transfer v-model="value1" :data="data" :titles="['可选用班组','已存在班组']" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!--  -->
      <div class="leftbotm" :style="{'width':titleWidth+'px'}">
        <p style=" background: #255e9a;width:60%;margin:auto;margin-top:20px">应到人数:254</p>
        <p style=" background: #255e9a;width:60%;margin:auto">实到人数:251</p>
        <p>( 首发航班:9 )</p>
        <p>( 前站起飞:8 )</p>
        <p><el-button class="item-btn" size="small" type="success">自动分配</el-button></p>
        <p><el-button class="item-btn" size="small" type="success">新建任务</el-button></p>
        <p><i class="el-icon-star-on" /> :  特服信息</p>
        <p><svg-icon icon-class="user" /> : 已接受任务</p>
      </div>
    </div>
  </div></template>
<script>
// import Mock from 'mockjs'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import { getWidthAbout2Times } from './components/gtUtils.js'
import { initList } from '@/api/dispatching'
// import { constants } from 'crypto'
// const Random = Mock.Random
const scaleList = `15,30,60`
  .split(',')
  .map(n => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      console.log(data, 888888)
      return data
    }
    return {
      loading: true,
      data2: [1, 2],
      data: generateData(),
      value1: [1, 4],
      dialogFormVisible: false,
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
          color: '#000'
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
      isWarn: false,
      cellWidth: 50,
      cellHeight: 40,
      titleHeight: 40,
      titleWidth: 180,
      scale: 15,
      datasNum: 69,
      datasA: [],
      datasB: [],
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, 'day')
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ['gtArray', 'error'],
      scrollToY: 600,
      positionB: { x: 600 },
      positionA: { x: 600 },
      endExchangeIndex: '',
      value: '',
      value2: '',
      type: '',
      groupstyle: [
        { id: '1', value: '全部班组' },
        { id: '2', value: '可用班组' }
      ],
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
  created: function() {
    this.initList()
  },
  methods: {
    initList() {
      initList().then(response => {
        this.loading = false
        console.log(this.datasB, 9)
        var _this = this
        Object.getOwnPropertyNames(response.data).forEach(function(cur) {
          var gtArray = []
          _this.datasA.push({
            gtArray: gtArray
          })
          _this.datasB.push({
            gtArray: gtArray,
            type: _this.type
          })
          response.data[cur].forEach(element => {
            _this.type = element.taskName
            gtArray.push({
              Actualend: element.taskEndTime,
              Actualstart: element.taskStartTime,
              taskId: element.taskName,
              end: element.windowsEndTime,
              start: element.windowsStartTime
            })
          })
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
      this.positionB = { x: val }
    },
    scrollLeftB(val) {
      this.positionA = { x: val }
    },
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev) {

    },
    onDrop(event) {
      alert(2)
      console.log(event.target, 9999999)

      var endExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      console.log(endExchangeIndex)
      if (endExchangeIndex) {
        this.$message.error('任务冲突，分配失败')
      }
      alert(3)
      console.log(event.target.parentNode.parentNode.parentNode, 555)
      console.log(endExchangeIndex, '返回目标id')
    }
  }
}
</script>
<style scoped>
.textips{
  float: right;
    margin-top: 10px;
    margin-right: 15px;
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
input[type="range"] {
  width: 100px;
}
ins{color: #f56c6c;text-decoration: none}
.top-bar {
  color: #fff;
  background: #818aa7;
  font-size: 12px;

}
.top-bar input,.top-bar select{
    background: #3e4660;
    border: none;
    color: #fff;}
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
}
.container >>> .gantt-block {
  background:#000;
  border-bottom: 1px solid #2d2d2d
}
.container >>> .gantt-header {
  background:#3e4660;
}
.container >>> .gantt-timeline-day {
    font-size: 14px;
    color: #ffffff;
}
.container >>> .gantt-timeline-scale>div {
    font-size: .4rem;
    font-weight: lighter;
    color: #b9bcc5;}
.container >>> .gantt-leftbar,.container >>> .gantt-leftbar-wrapper{
  background: #000
}
.gantt-block-item {
  display: block;
}
.vvip{
    z-index: 999;
    position: absolute;
    color: #02ff00;
    right: -36px;
    font-size: 12px;
    top: 7px;
    display:block;
    text-shadow: 0 0 0px #fff;
}
.vvip span.vip{
      color: #f9ff00
    }
.warn {
  bottom:3%;
  height: 6%;
  position: absolute;
  z-index: 0;
  background: #0cbb0a;
}
.progressBar {
  top:25%;
  height: 10%;
  position: absolute;
  z-index: 2;
  left: -12px;
}
.progressBar svg{
  color: #fff;
    width: .6rem;
    text-shadow: 0 0 5px #000;
}
.item-btn{
  background:#255e9a;
  border-color:#0c5098;
}
.transfer{margin: 40px 0 0 40px;}

.leftbotm{
  position: absolute;
    background: #000;
    height: 100%;
    left: 10px;
    z-index: 200;
    top: 54%;
    border-top: 1px solid #ccc;
}
.leftbotm p{
    color: #cccccc;
    font-size: 14px;
    text-align:center;
    padding:5px 10px;
  }
</style>
