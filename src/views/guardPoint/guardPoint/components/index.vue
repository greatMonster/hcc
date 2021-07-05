<template>
  <div id="app2">
    <div style="color:#fff;background: #3e4660; padding:8px 0;font-size:14px;margin-top:60px">
      <label>日期：</label>
      <el-date-picker v-model="date" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:140px" @change="changeData(date)" />
      <label>任务状态：</label>
      <el-select v-model="value2" style="width:100px" size="small" placeholder="请选择">
        <el-option v-for="(item,i) in status" :key="i" :value="item.value">{{ item.value }}</el-option>
      </el-select>
      <el-button size="small" @click="dialogFormVisible = true">
        <svg-icon icon-class="peoples" />资源池管理
      </el-button>
      <el-button size="small" @click="openBaseData">基础数据</el-button>
      <el-button size="small" @click="openRule">规则设置</el-button>
      <el-button size="small" @click="opentask">航班任务</el-button>
      <span class="textips">
        航班数 :
        <ins>{{ getStat.flightNo }}</ins>，已分配任务 :
        <ins>{{ getStat.taskHasFenpei }}</ins>，未分配任务 :
        <ins>{{ getStat.taskNoFenpei }}</ins>，已接收任务 :
        <ins>{{ getStat.taskHasFenpei }}</ins>，未接收任务 :
        <ins>{{ getStat.taskHasFenpei }}</ins>，告警数量 :
        <ins>{{ getStat.alarmNo }}</ins>，已处理告警 :
        <ins>{{ getStat.alarmHasHandle }}</ins>，未处理告警 :
        <ins>{{ getStat.alarmNoHandle }}</ins>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" />
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width:15px" />
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size:12px">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
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
        @scrollTop="scrollLeftB2"
      >
        <template v-slot:block="{data,getWidthAbout2Times,getPositonOffset,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
          <div v-for="(item,index) in data.taskMap" :id="index" :key="index" :employeeId="data.employeeId" :skillId="data.skillId" class="taskList" :h="index" :style="{top:3*index+'px'}">
            <div
              v-for="(itemin,indexin) in item"
              :id="indexin"
              :key="indexin"
              class="gantt-block-item"
              :style="{left:getPositonOffset(itemin.planInPlace)+'px',width:getWidthAbout2Times(itemin.planInPlace,itemin.planEnd,{ scale,cellWidth})+'px'}"
              :left="getPositonOffset(itemin.planInPlace)"
              @mouseenter="changeActive($event)"
              @mouseleave="changeLeave($event)"
            >
              <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="itemin" />
              <span v-if="canceltaskshow && itemin.taskState==2" class="canceltask" @click="canceltask(itemin)">
                <i class="el-icon-error" />
              </span>
              <div class="windowTime" :style="{left:getPositonOffset(itemin.windowStartTime) - getPositonOffset(itemin.planInPlace)+'px',width:getWidthAbout2Times(itemin.windowStartTime,itemin.windowEndTime,{ scale,cellWidth})+'px'}" />
              <div class="actualTime" :style="{left:getPositonOffset(itemin.actualInPlace) - getPositonOffset(itemin.planInPlace)+'px',width:getWidthAbout2Times(itemin.actualInPlace,itemin.actualEnd,{ scale,cellWidth})+'px'}" />
            </div>
          </div>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <div class="gantt-header-title-left">
            <label style="font-size:12px;margin-left:0px">车辆类型：</label>
            <el-select v-model="bustyle" style="width:106px" size="small" placeholder="请选择" @change="changeBus">
              <el-option v-for="(item,i) in groupstyle" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
            </el-select>
          </div>
        </template>
      </v-gantt-chart>
      <!-- <v-gantt-chart
        ref="target"
        v-loading="loading"
        :start-time="startTime"
        :end-time="endTime"
        :cell-width="cellWidth"
        :cell-height="cellHeight"
        :title-height="titleHeight"
        :scale="scale"
        :title-width="titleWidth"
        show-current-time
        :hide-header="hideHeader2"
        :data-key="dataKey"
        :array-keys="arrayKeys"
        :scroll-to-postion="positionA"
        custom-generate-blocks
        :datas="datasA"
        @scrollLeft="scrollLeftA"
        @scrollTop="scrollLeftA2"
      >
        <template v-slot:block="{data,getWidthAbout2Times,getPositonOffset,isInRenderingTimeRange,startTimeOfRenderArea,endTimeOfRenderArea}">
          <div v-for="(item2,index) in data.gtArray" :key="index" class="gantt-block-item" :h="item2.tasks.length" :style="{left:getPositonOffset(item2.start)+'px',width:getWidthAbout2Times(item2.start,item2.end,{ scale,cellWidth})+'px',top:'8px'}">
            <div style="position:relative">
              <div
                v-for="(itm,index2) in item2.tasks"
                :key="index2"
                class="gantt-block-item"
                :style="{left:(getPositonOffset(itm.planInPlace) - getPositonOffset(item2.start))+'px',width:getWidthAbout2Times(itm.planInPlace,itm.planEnd,{ scale,cellWidth})+'px','margin-top':index2*22+'px'}"
                @dragstart="dragstart($event,itm)"
              >
                <Test :data="data" :cell-height="cellHeight" :current-time="currentTime" :item="itm" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:left="{data2}">
          <LeftBtm :data="data2" />
        </template>
      </v-gantt-chart>-->
      <!--  -->
      <!-- <div class="leftbotm" :style="{'width':titleWidth+'px'}">
        <p>
          <el-button class="item-btn" size="small" type="success" @click="automaticTask">重新分配</el-button>
        </p>
        <p>
          <el-button class="item-btn" size="small" type="success" @click="cancelAssignAll">取消分配</el-button>
        </p>
        <p>
          <el-button class="item-btn" size="small" type="success" @click="showdialogFormake">新建任务</el-button>
        </p>
      </div>-->
      <!-- 修改规则 -->
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="50%">
        <el-form ref="formEdit" :model="formEdit" :label-width="formLabelWidth">
          <el-form-item prop="tpre" label="工作准备时间：">
            <el-input v-model="formEdit.tpre" />
          </el-form-item>
          <el-form-item prop="tp" label="预派工窗口时间：">
            <el-input v-model="formEdit.tp" />
          </el-form-item>
          <el-form-item prop="daystart" label="当天任务开始时刻：">
            <el-input v-model="formEdit.daystart" />
          </el-form-item>
          <el-form-item prop="dayend" label="当天任务结束时刻：">
            <el-input v-model="formEdit.dayend" />
          </el-form-item>
          <el-form-item prop="tpInterval" label="派工间隔：">
            <el-input v-model="formEdit.tpInterval" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 生成任务 -->
      <el-dialog v-dialogDrag title="生成任务" :visible.sync="dialogFormake" width="680px">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" size="small" class="demo-ruleForm">
          <el-form-item label="航班号：" prop="flightNo">
            <el-input v-model="ruleForm.flightNo" />
          </el-form-item>
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="ruleForm.taskName" />
          </el-form-item>
          <el-form-item label="计划到位时间：" prop="planInPlace">
            <el-date-picker v-model="ruleForm.planInPlace" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="计划到位时间：" prop="planDepart">
            <el-date-picker v-model="ruleForm.planDepart" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="计划结束时间：" prop="planEnd">
            <el-date-picker v-model="ruleForm.planEnd" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="起飞站-到达站：" prop="deptArrAirport">
            <el-input v-model="ruleForm.deptArrAirport" />
          </el-form-item>
          <el-form-item label="进出港:" prop="flightType">
            <el-select v-model="ruleForm.flightType" placeholder="请选择" @change="flightTypevaule">
              <el-option v-for="(item,i) in flightTypeoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始位置：" prop="startPosition">
            <el-autocomplete v-model="ruleForm.startPosition" prefix-icon="el-icon-search" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="结束位置：" prop="endPosition">
            <el-autocomplete v-model="ruleForm.endPosition" prefix-icon="el-icon-search" :fetch-suggestions="querySearchAsyncEnd" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="机坪:" prop="deptApron">
            <el-autocomplete v-model="ruleForm.deptApron" prefix-icon="el-icon-search" :fetch-suggestions="querySearchAsyncdept" placeholder="请输入内容" @select="handleSelect" />
          </el-form-item>
          <el-form-item label="车型:" prop="busType">
            <el-select v-model="ruleForm.busType" placeholder="请选择">
              <el-option v-for="(item,i) in busTypeoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国际国内:" prop="intlFlag">
            <el-select v-model="ruleForm.intlFlag" placeholder="请选择">
              <el-option v-for="(item,i) in intlFlagoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
            </el-select>
          </el-form-item>
          <div style="text-align: right">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="dialogFormake = false">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import LeftBtm from './components/leftbtm.vue'
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import { getWidthAbout2Times } from './components/gtUtils.js'
import {
  cancelAssignAllTask,
  getStatistics,
  automaticTask,
  allotTasksForce,
  canceltask,
  getFeriyBusTask,
  list,
  getBusParam,
  updateBusParam,
  allotTasks,
  addTemporaryTask,
  getJiweiByKeyWord,
  getDengjikouByKeyWord,
  getJiPingByKeyWord
} from '@/api/busRules'
const scaleList = `15,30,60`.split(',').map(n => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft, LeftBtm },
  data() {
    return {
      getStat: {}, // 统计数据
      canceltaskshow: false,
      intlFlagoption: [{ value: '国际', id: 'I' }, { value: '国内', id: 'D' }],
      busTypeoption: [{ value: '大摆渡', id: 'BIG_BUS' }, { value: '出港', id: 'BF_BUS' }, { value: '小摆渡', id: 'COBUS' }],
      isNaN: '', // 修bug 用
      flightTypeoption: [{ value: '进港', id: 'A' }, { value: '出港', id: 'D' }],
      dialogFormake: false,
      ruleForm: {
        // 生成任务
        startPosition: '',
        endPosition: ''
      },
      apronCode: '', // 讥评
      restaurants: [],
      inoutype: '', // 进出港
      data2: '231231',
      taskId: '',
      title: '规则设置',
      formEdit: {},
      editSkillVisible: false,
      formLabelWidth: '150px',
      loading: false,
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
      date: '2019-01-15', // 选择日期
      // date: this.$route.query.data ? this.$route.query.data : this.getNowFormatDate(), // 选择日期
      currentTime: dayjs('2019-01-15'),
      // currentTime: dayjs(),
      // startTime: this.$route.query.data ? dayjs(this.$route.query.data).subtract(2, 'hour').toString() : dayjs().subtract(5, 'hour').toString(),
      // endTime: this.$route.query.data ? dayjs(this.$route.query.data).add(1, 'day').add(2, 'hour').toString() : dayjs().add(2, 'day').add(2, 'hour').toString(),
      startTime: '2019-01-15',
      endTime: '2019-01-17',
      bustyle: '全部', // 摆渡车类型
      bustyleId: '',
      // bustyleId: this.$route.query.skillId ? this.$route.query.skillId : '',
      groupstyle: [{ id: '', value: '全部' }, { id: '324', value: '大摆渡' }, { id: '326', value: '北方' }, { id: '325', value: 'COBUS2700' }],
      isWarn: false,
      cellWidth: 50,
      cellHeight: 30,
      titleHeight: 40,
      titleWidth: 180,
      scale: 15,
      datasNum: 100,
      datasA: [],
      datasB: [],
      dataKey: 'id',
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, 'day')
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideHeader2: true,
      arrayKeys: ['gtArray', 'error'],
      positionB: { x: this.$route.query.data ? localStorage.scrollx - 600 : 600, Y: 10000 },
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 600, Y: 10 },
      endExchangeIndex: '',
      value2: '',
      type: '',
      routeData: '',
      status: [{ id: '1', value: '已完成' }, { id: '2', value: '未开始' }],
      rules: {
        flightNo: [{ required: true, message: '请输入', trigger: 'blur' }],
        taskName: [{ required: true, message: '请输入', trigger: 'blur' }],
        planInPlace: [{ required: true, message: '请输入', trigger: 'blur' }],
        planDepart: [{ required: true, message: '请输入', trigger: 'blur' }],
        planEnd: [{ required: true, message: '请输入', trigger: 'change' }],
        deptArrAirport: [{ required: true, message: '请输入', trigger: 'change' }],
        flightType: [{ required: true, message: '请输入', trigger: 'change' }],
        startPosition: [{ required: true, message: '请输入', trigger: 'change' }],
        endPosition: [{ required: true, message: '请输入', trigger: 'change' }],
        deptApron: [{ required: true, message: '请输入', trigger: 'change' }],
        busType: [{ required: true, message: '请输入', trigger: 'change' }],
        intlFlag: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  // watch: {
  // positionB(newV) {
  //   console.log(newV)
  // }

  // datasNum(newV) {
  //   console.log(newV, 888)
  //   this.datasA = mockDatas(newV)
  //   this.datasB = mockDatas(newV)
  // },
  // scrollToY(val) {
  //   console.log(val, 888)
  //   this.positionA = { x: val }
  // }
  // },
  watch: {
    // datasA(val, oldVal) {
    //   // this.initList()
    // },
    datasNum(newV) {
      this.datasA = mockDatas(newV)
      this.datasB = mockDatas(newV)
    }
    // bustyleId: {
    //   handler: function(val, oldval) {
    //     this.$store.commit('ruleId', { id: this.bustyleId })
    //     // console.log(val, this.$store.state, 999999)
    //   },
    //   deep: true// 对象内部的属性监听，也叫深度监听
    // }
  },
  created: function() {
    var skillId = this.$route.query.skillId
    if (skillId) {
      switch (skillId) {
        case '324':
          this.bustyle = '大摆渡'
          break
        case '':
          this.bustyle = '全部'
          break
        case '326':
          this.bustyle = '北方'
          break
        case '325':
          this.bustyle = 'COBUS2700'
          break
        default:
          break
      }
    }
    this.initList()
    this.listFn()
    this.getStatistics()
    this.$nextTick(function() {
      // 上下拉窗口
      // console.log(document.querySelector('.gantt-scroll-x'))
      // document.querySelector('.gantt-scroll-x').addEventListener('click', function() {
      //   alert()
      // }, false)
      // console.log(document.querySelectorAll('.setheight'))
      // target 动态监控单个任务
    })
    // console.log(this.$route.query.data)
    // this.$store.commit('ruleId', { id: this.bustyleId })
    // console.log(this.$store.state, 444)

    // window.addEventListener('scrollTop', function(e) {
    //   alert(e)
    // })
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
          var max = Math.max.apply(null, maxH)
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
    // 上下拉
    // var ismoving = false
    // var down = ''
    // var move = ''
    // var header = document.querySelectorAll('.gantt-header')[1]
    // var scroll = document.querySelectorAll('.gantt-chart')[1]
    // header.addEventListener('mousedown', function(e) {
    //   down = e.clientY
    //   ismoving = true
    // })
    // header.addEventListener('mousemove', function(e) {
    //   if (ismoving) {
    //     move = e.clientY
    //     console.log(scroll.style.height)
    //     // var b = scroll.offsetHeight
    //     scroll.setAttribute('height', (down - move) + '%')
    //   }
    // })
    // header.addEventListener('mouseup', function(e) {
    //   ismoving = false
    // })
  },
  methods: {
    cancelAssignAll() {
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date
      }
      cancelAssignAllTask(data).then(response => {})
    },
    getStatistics() {
      // 统计数据
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date
      }
      getStatistics(data).then(response => {
        this.getStat = response.data
      })
    },
    changeData(e) {
      // 切换日期
      this.startTime = dayjs(e)
        .subtract(5, 'hour')
        .toString()
      this.endTime = dayjs(e)
        .add(2, 'day')
        .add(2, 'hour')
        .toString()
      this.datasA = []
      this.datasB = []
      this.initList()
      this.listFn()
      this.getStatistics()
    },
    changeBus(e) {
      // 切换摆渡车
      this.bustyleId = e
      this.datasA = []
      this.datasB = []
      this.initList()
      this.listFn()
      this.getStatistics()
    },
    changeActive(item) {
      // console.log(item.target.parentNode)
      // console.log(item.target.parentNode.setAttribute('style', 'height: 80px'))
      this.canceltaskshow = true
    },
    changeLeave(item) {
      this.canceltaskshow = false
    },
    canceltask(item) {
      // 取消任务
      canceltask(item.id).then(response => {
        this.listFn()
      })
    },
    automaticTask() {
      // 自动分配
      this.loading = true
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date
      }
      automaticTask(data).then(response => {
        this.loading = false
        this.initList()
        this.listFn()
      })
    },
    openRule() {
      // 规则弹框
      this.editSkillVisible = true
      getBusParam().then(response => {
        this.formEdit = response.data
      })
    },
    opentask() {
      // 任务视图
      var routeData = this.$router.resolve({ path: '/dispatching/taskView', query: { name: 123 } })
      window.open(routeData.href, '_blank')
    },
    handleEditClick() {
      // 规则弹框确定
      updateBusParam(this.formEdit).then(response => {
        this.editSkillVisible = false
      })
    },
    listFn() {
      // 员工列表
      this.loading = true
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date
      }
      // this.datasB = []
      list(data).then(response => {
        if (response.data) {
          this.datasB = response.data
          response.data.forEach(element => {
            if (Object.keys(element.taskMap).length === 0) {
              element.taskMap = { 1: [] }
            }
          })
        }
        // this.loading = false
      })
    },
    initList() {
      // 未分配
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date
      }
      // this.loading = true
      getFeriyBusTask(data).then(response => {
        var _this = this
        // alert()
        Object.getOwnPropertyNames(response.data).forEach(function(cur) {
          var gtArray = []
          _this.datasA.push({
            gtArray: gtArray
          })
          response.data[cur].forEach(element => {
            gtArray.push({
              id: element.flightNo,
              taskName: element.flightNo,
              end: element.rightTime,
              start: element.leftTime,
              tasks: element.tasks
            })
            _this.type = element.taskName
          })
        })
        this.loading = false
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
    scrollLeftA2(val) {
      this.scrollToPostion = { Y: 0 }
      console.log(this.scrollToPostion.Y, 22)
    },
    scrollLeftB2(val) {
      console.log(val, 224)
      this.positionB = { Y: val }
    },
    // 拖拉
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev, item) {
      this.taskId = item.id
    },
    onDrop(event) {
      // event.target.parentNode.setAttribute('style', 'height:80px')
      console.log(event.target.childNodes[0], 7)
      var data = {
        employeeId: event.target.getAttribute('employeeId') || event.target.childNodes[0].getAttribute('employeeId'),
        skillId: event.target.getAttribute('skillId') || event.target.childNodes[0].getAttribute('skillId'),
        taskId: this.taskId
      }
      allotTasks(data).then(response => {
        // 任务分配
        if (response.code === '200') {
          this.$message.success('分配成功')
          this.listFn()
          this.initList()
          localStorage.setItem('name', this.taskId)

          // window.addEventListener('setItemEvent', function(e) {
          //   alert(e.newValue)
          // })
        } else if (response.code === '1004') {
          // this.$message.error('时间冲突，分配失败')
          this.$confirm('时间冲突, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              allotTasksForce(data).then(response => {
                if (response.code === '200') {
                  // this.datasA = []
                  this.listFn()
                  this.initList()
                  this.$message({
                    type: 'success',
                    message: '分配成功!'
                  })
                } else {
                  this.$message.error('分配失败')
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          this.$message.error(response.message)
        }
      })
    },
    dragend(event) {
      // console.log(event.target.getAttribute('class'), 77)
    },
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/busRules' })
    },
    flightTypevaule(e) {
      // 进出港选择
      this.inoutype = e
    },
    // 模糊搜索 开始位置
    querySearchAsync(queryString, cb) {
      this.restaurants = []
      if (this.inoutype === 'A') {
        this.ruleForm.endPosition = '3'
        getJiweiByKeyWord(queryString).then(response => {
          // 机位
          response.data.forEach(element => {
            this.restaurants.push({ value: element })
          })
        })
      } else if (this.inoutype === 'D') {
        getDengjikouByKeyWord(queryString).then(response => {
          response.data.forEach(element => {
            this.restaurants.push({ value: element })
          })
        })
        this.ruleForm.endPosition = ''
      }
      var restaurants = this.restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(restaurants)
      }, 500 * Math.random())
    },
    // 模糊搜索 结束位置
    querySearchAsyncEnd(queryString, cb) {
      this.restaurants = []
      if (this.inoutype === 'A') {
        this.ruleForm.endPosition = '3'
      } else if (this.inoutype === 'D') {
        this.ruleForm.endPosition = ''
        getJiweiByKeyWord(queryString).then(response => {
          // 机位
          response.data.forEach(element => {
            this.restaurants.push({ value: element })
          })
        })
      }
      var restaurants = this.restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(restaurants)
      }, 1000 * Math.random())
    },
    // 模糊搜索 机平
    querySearchAsyncdept(queryString, cb) {
      this.restaurants = []
      getJiPingByKeyWord(queryString).then(response => {
        // 机平
        response.data.forEach(element => {
          this.restaurants.push({ value: element.apronName, apronCode: element.apronCode })
        })
      })
      var restaurants = this.restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(restaurants)
      }, 1000 * Math.random())
    },
    handleSelect(item) {
      this.apronCode = item.apronCode
    },
    showdialogFormake() {
      // 生成任务
      this.dialogFormake = true
    },
    submitForm() {
      // 生成任务
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.deptApron = this.apronCode
          addTemporaryTask(this.ruleForm).then(response => {
            this.dialogFormake = false
          })
          this.initList()
        }
      })
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
.flights {
  display: block;
  height: 100%;
  border: 1px solid #255e9a;
}
.Unallocated {
  background: #fff;
  height: 10px;
  margin-bottom: 5px;
}
.taskList {
  height: 26px;
  position: relative;
}
.canceltask {
  position: absolute;
  right: -12px;
  color: #0f72f5;
  z-index: 2;
  cursor: pointer;
}
.textips {
  float: right;
  margin-top: 10px;
  margin-right: 15px;
}
.none {
  display: none;
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
  height: 100%;
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
.container >>> .gantt-leftbar,
.container >>> .gantt-leftbar-wrapper {
  background: #000;
}
.container >>> .gantt-chart {
  /* height: 90%; */
  background: #000;
}
.container >>> .gantt-block-item {
  display: block;
  width: 100%;
  height: 6px;
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
  top: 55%;
  border-top: 1px solid #ccc;
}
.leftbotm p {
  color: #cccccc;
  font-size: 14px;
  text-align: center;
  padding: 5px 10px;
}
</style>
