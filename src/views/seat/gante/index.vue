<template>
  <div id="app2">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;margin-top:60px">
      <label>站点：</label>
      <el-select v-model="value" style="width:100px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in groupstyle" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>
      <el-date-picker v-model="datePicker" type="date" placeholder="选择日期" size="small" />
      <el-button class="item-btn" size="small" type="primary" @click="openBaseData2">修改参数</el-button>
      <el-button class="item-btn" size="small" type="primary" @click="parameters">生成任务</el-button>
      <span class="textips">
        航班数 :
        <ins>1231</ins>，已分配任务 :
        <ins>531</ins>，未分配任务 :
        <ins>71</ins>，已接收任务 :
        <ins>431</ins>，未接收任务 :
        <ins>831</ins>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250">
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100">
      <label for="cellHeight">cellHeight</label>
      <input v-model.number="cellHeight" type="range">
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
    <div class="container" @dragend="dragend($event)" @dragover="allowDrop($event)" @drop="onDrop($event)">
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
        <template v-slot:block="{data,cellHeight,customGenerateBlocks,getWidthAbout2Times,getPositonOffset,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
          <div v-for="(test,tindex) in data.gtarry2" :key="tindex" class="taskList" :style="{height:(80/data.gtarry2.length)+'px'}">
            <div v-for="(item,index) in test.gtArray" :key="index" class="gantt-block-item" :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end,{ scale,cellWidth})+'px'}" :left="getPositonOffset(item.start)">
              <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="item" />
            </div>
          </div>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <div class="gantt-header-title-left">班组总数（12）</div>
        </template>
      </v-gantt-chart>
      <v-gantt-chart
        v-loading="loading"
        :start-time="startTime"
        :end-time="endTime"
        :cell-width="cellWidth"
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
            <Test :data="data" :current-time="currentTime" :item="item" />
          </div>
        </template>
      </v-gantt-chart>
      <!-- 生成任务 -->
      <el-dialog title="生成任务" :visible.sync="dialogFormVisible" width="680px">
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择日期：">
            <el-date-picker
              v-model="ruleForm.date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            /> 至
            <el-date-picker
              v-model="ruleForm.ToDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="选择" prop="documentId">
            <el-select v-model="ruleForm.documentId" placeholder="请选择">
              <el-option v-for="(item,i) in groupstyle" :key="i" :label="item.name" :value="item.documentId">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
          <div style="text-align: right">
            <el-button type="primary" @click="submitForm(ruleForm)">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!--  -->
      <div class="leftbotm" :style="{'width':titleWidth+'px'}">
        <p style="text-align: left;">航班管控人数:251</p>
        <p style="text-align: left;">开放席位数:254</p>
        <p style="text-align: left;">( 起飞航班:9 )</p>
        <p style="text-align: left;">( 停场航班:8 )</p>
        <p><el-button class="item-btn" size="small" type="success">自动分配</el-button></p>
      </div>
    </div>
  </div>
</template>
<script>
// import Mock from 'mockjs'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import { getWidthAbout2Times } from './components/gtUtils.js'
import { initData, addseat, makeSeat } from '@/api/seat'
// const Random = Mock.Random
const scaleList = `1,15,30,60`.split(',').map(n => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft },
  data() {
    return {
      groupstyle: [],
      ruleForm: {
        documentId: '',
        date: '',
        ToDate: ''
      },
      datePicker: '',
      customGenerateBlocks: true,
      loading: true,
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
      startTime: '2019-07-14',
      endTime: '2019-07-18',
      isWarn: false,
      cellWidth: 50,
      cellHeight: 80,
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
      scrollToY: 10,
      positionB: { x: 1200 },
      positionA: { x: 1200 },
      endExchangeIndex: '',
      value: '',
      type: ''
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
      initData().then(response => {
        this.loading = false
        var _this = this
        console.log(response.data.assigned, 666)
        Object.getOwnPropertyNames(response.data.assigned).forEach(function(cur) {
          var object = {}
          Object.getOwnPropertyNames(response.data.assigned[cur]).forEach(function(cur2) {
            object.name = '席位' + response.data.assigned[cur].seatNumber + '(' + response.data.assigned[cur].userInfoBean.name + ')'
            object.gtarry2 = []
            Object.getOwnPropertyNames(response.data.assigned[cur].assignedBean).forEach(function(cur3) {
              var a = {}
              a.gtArray = []
              response.data.assigned[cur].assignedBean[cur3].forEach(element => {
                a.gtArray.push({ start: element.planStarTime, end: element.planEndTime, name: element.taskName, taskStatus: element.taskStatus })
              })
              object.gtarry2.push(a)
            })
            object.row = object.gtarry2.length
          })
          console.log(object, 33)
          _this.datasB.push(object)
        })
        console.log(this.datasB, '已分配任务')
        var unAssigned = response.data.unAssigned // 未分配任务
        // assigned.forEach(element => {
        //   var object = {}
        //   object.name = element.seatNumber
        //   object.gtArray = []
        //   element.assignedBean.forEach(element => {
        //     object.gtArray.push({ start: element.planStarTime, end: element.planEndTime, name: element.memo, taskStatus: element.taskStatus })
        //   })
        //   this.datasB.push(object)
        // })
        unAssigned.forEach(element => {
          var object = {}
          object.gtArray = []
          // while (Date.parse(element.planEndTime) < Date.parse(element.planStarTime)) {
          //   object.gtArray.push({ start: element.planStarTime, end: element.planEndTime, name: element.memo })
          // }
          object.gtArray.push({ start: element.planStarTime, end: element.planEndTime, name: element.taskName, taskStatus: element.taskStatus })
          this.datasA.push({ name: element.memo, gtArray: object.gtArray })
        })
        // console.log(this.datasA, 22)
      })
    },
    parameters() {
      // 生成弹出框下拉框请求
      this.dialogFormVisible = true
      addseat().then(response => {
        this.groupstyle = response.data
      })
    },
    submitForm(ruleForm) { // 设置参数生成席位
      makeSeat(ruleForm).then(response => {
      })
      this.dialogFormVisible = false
    },
    openBaseData2() {
      this.$router.push({ path: '/ATM/baseType/seatSet' })
    },
    showddd(start, end, { scale, cellWidth }) {
      return getWidthAbout2Times(start, end, { scale, cellWidth })
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
    dragstart(ev) {},
    onDrop(event) {
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
.taskList{
    height: 30px;
    /* margin-bottom: 5px; */
    /* border-bottom: 1px solid #3e4660; */
}
.textips {
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

.container >>> .gantt-header-title {
  background: #3e4660;
}
.container >>> .gantt-chart {
  height: 500px;
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
}
.container >>> .gantt-block {
  background: #000;
  border-bottom: 1px solid #2d2d2d;
  /* height: auto!important; */
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
}
.gantt-block-item {
  display: block;
  height: auto;
  margin-top: 2px
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
  top: 63%;
  border-top: 1px solid #ccc;
}
.leftbotm p {
  color: #cccccc;
  font-size: 14px;
  text-align: center;
  padding: 5px 18px;
}
</style>
