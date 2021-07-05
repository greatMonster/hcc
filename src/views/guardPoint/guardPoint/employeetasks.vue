<template>
  <div id="app2">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <!-- <label>参数组合：</label>
        <el-select v-model="intlType1" style="width:160px" size="small" placeholder="请选择">
          <el-option v-for="item in regions1" :key="item.id" :label="item.composeName" :value="item.id" />
        </el-select>-->
        <el-form-item label="日期：" prop="date">
          <el-date-picker v-model="ruleForm.date" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData" />
        </el-form-item>
        <el-form-item label="员工姓名：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-button type="primary" size="mini" @click="queryData">搜索</el-button>
        <el-button size="small" @click="specialTaskDistribute">特殊任务派工</el-button>
        <!-- <el-button size="small" @click="showChart">柜台覆盖信息图</el-button> -->
        <el-button size="small" @click="jumpDesk">值守点视角</el-button>
      </el-form>

      <span class="textips">
        <!-- 今日在岗人数 :
        <ins>{{ getStat.peopleCount }}</ins>，-->
        今日进港航班数 :
        <ins>{{ statsVO.flightNum }}</ins
        >， 总任务数 : <ins>{{ statsVO.totalTaskNum }}</ins
        >， 自动派工率 : <ins>{{ statsVO.automaticAssignmentRate }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #3a8ee6; margin-right: 3px" />未分配 : <ins>{{ statsVO.unassignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #1156f0; margin-right: 3px" />已分配 : <ins>{{ statsVO.assignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(103, 194, 58) 50%; margin-right: 3px" />已开始&nbsp;&nbsp;: <ins>{{ statsVO.startedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(67, 162, 43) 50%; margin-right: 3px" />已接收 : <ins>{{ statsVO.receivedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #a4abc0; margin-right: 3px" />已完成 : <ins>{{ statsVO.completedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #99004d; margin-right: 3px" />已取消 : <ins>{{ statsVO.canceledNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #ff3399; margin-right: 3px" />已超时 : <ins>{{ statsVO.timeoutNum }}</ins
        >，
        <span class="warn-style">
          <span style="color: yellow">！</span>告警 : <ins>{{ statsVO.warningNum }}</ins> </span
        >， <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 :
        <ins>{{ statsVO.unassignedLockedNum + statsVO.assignedLockedNum }}</ins>
        总工时利用率 :
        <ins>{{ (totalAvgRate * 100).toFixed(2) }}%</ins>
      </span>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />
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
    <div class="container" @dragend="dragend($event)" @dragover="allowDrop($event)" @drop="onDrop($event)">
      <splitpanes horizontal style="height: 84%">
        <pane size="50">
          <v-gantt-chart
            v-loading="loading"
            :time-lines="timeLines"
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
            <template v-slot:block="{ data, getWidthAbout2Times, getPositonOffset, isInRenderingTimeRange, startTimeOfRenderArea, endTimeOfRenderArea }">
              <div :employeeId="data.employeeCode" :skillId="data.skillId" class="taskList" :style="{ top: 3 + 'px' }">
                <div
                  v-for="(itemin, indexin) in data.guardTaskVOS"
                  :id="indexin"
                  :key="indexin"
                  :employeeId="data.employeeCode"
                  class="gantt-block-item"
                  :style="{ left: getPositonOffset(itemin.beginTime) + 'px', width: getWidthAbout2Times(itemin.beginTime, itemin.endTime, { scale, cellWidth }) + 'px' }"
                  :left="getPositonOffset(itemin.beginTime)"
                  @dragstart="dragstart($event, itemin)"
                >
                  <Test :data="data" :status-list="statusList" :cell-height="cellHeight" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itemin" @changeStatus="changeStatus" />
                  <!-- <span v-if="item.taskDifference==2" class="canceltask" @click="canceltask(item)">
                    <i class="el-icon-error" />
                  </span>-->

                  <!-- 未改，做个记号 -->
                  <!-- <div class="windowTime" :style="{left:getPositonOffset(itemin.windowStartTime) - getPositonOffset(itemin.beginTime)+'px',width:getWidthAbout2Times(itemin.windowStartTime,itemin.windowEndTime,{ scale,cellWidth})+'px'}" />
                  <div class="actualTime" :style="{left:getPositonOffset(itemin.actualInPlace) - getPositonOffset(itemin.beginTime)+'px',width:getWidthAbout2Times(itemin.actualInPlace,itemin.actualEnd,{ scale,cellWidth})+'px'}" />-->
                </div>
                <!-- <div
                  class="gantt-block-item workTime"
                  :style="{ left: getPositonOffset(data.startTime) + 'px', width: getWidthAbout2Times(data.startTime, data.endTime, { scale, cellWidth }) + 'px', background: 'green;' }"
                  :left="getPositonOffset(data.startTime)"
                /> -->
                <div
                  v-for="(itemTime, index) in data.workTimeVOS"
                  :key="index"
                  class="staffTime"
                  :style="{ left: getPositonOffset(itemTime.startTime) + 'px', width: getWidthAbout2Times(itemTime.startTime, itemTime.endTime, { scale, cellWidth }) + 'px' }"
                />
              </div>
            </template>
            <template v-slot:left="{ data }">
              <TestLeft :data="data" />
            </template>
            <template v-slot:title>
              <div class="gantt-header-title-left">今日在岗人数：{{ datasB.length !== 0 ? datasB.length : 0 }}</div>
            </template>
          </v-gantt-chart>
        </pane>
        <pane size="50">
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
            :hide-header="hideHeader2"
            :data-key="dataKey"
            :array-keys="arrayKeys"
            :scroll-to-postion="positionA"
            custom-generate-blocks
            :datas="datasA"
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
                    <Test :data="data" :status-list="statusList" :cell-height="cellHeight2" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itm" @changeStatus="changeStatus" />
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:left="{ data }">
              <LeftBtm :data="data.gtArray[0]" />
            </template>
          </v-gantt-chart>
        </pane>
      </splitpanes>
    </div>
    <!-- 设置特殊任务 -->
    <el-dialog v-dialogDrag title="设置特殊任务" width="70%" :visible.sync="specialVisable">
      <el-form ref="formName" :model="formEdit" :rules="rules">
        <el-form-item prop="taskTypeId" label="任务类型" :label-width="formLabelWidth">
          <el-select v-model="formEdit.taskTypeId" clearable filterable placeholder="请选择" style="width: 200px">
            <el-option v-for="item in codeOptions" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="employeeCode" label="员工名称" :label-width="formLabelWidth">
          <el-select v-model="formEdit.employeeCode" clearable filterable placeholder="请选择" style="width: 200px">
            <el-option v-for="item in employeeOptions" :key="item.employeeCode" :label="item.employeeName" :value="item.employeeCode" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dateRange" label="日期" :label-width="formLabelWidth">
          <!-- <el-input v-model="formEdit.dateRange" placeholder="请输入" /> -->
          <el-date-picker v-model="formEdit.dateRange" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange" />
        </el-form-item>
        <el-form-item v-if="rangeDay" prop="time" label="时间" :label-width="formLabelWidth">
          <!-- <el-input v-model="formEdit.time" placeholder="请输入" /> -->
          <el-time-picker v-model="formEdit.timeRange" arrow-control="true" is-range range-separator="至" start-placeholder="开始时间" format="HH:mm" value-format="HH:mm" end-placeholder="结束时间" placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="formEdit.remark" :rows="2" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="specialVisable = false">取 消</el-button>
        <el-button type="primary" @click="setHandleEditClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Test from './components/test.vue'
import TestLeft from './components/test-left.vue'
import LeftBtm from './components/leftbtm.vue'
import dayjs from 'dayjs'
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
// import { canceltask } from '@/api/busRules'
import { initEmployeeList, addSpecialTask, weifenpei, deskManualDispatching, canceltask } from '@/apiNew/guardPoint'
import { initTableTask } from '@/api/taskType'
import { searchTaskStatus } from '@/apiNew/vehicle'
const scaleList = `30,60,120,240`.split(',').map((n) => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft, LeftBtm, Splitpanes, Pane },
  data() {
    return {
      formEdit: {},
      rules: {
        taskTypeId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        employeeCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dateRange: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      checkInTaskId: '',
      siteId: this.$route.query.siteId,
      rangeDay: false,
      codeOptions: [], //任务类型
      employeeOptions: [], //员工名称
      specialVisable: false,
      totalAvgRate: '',
      ruleForm: { date: this.$route.query.date || this.getNowFormatDate() },
      refreshCount: 0,
      datasBCopy: [],
      statusList: [],
      businessDomainId: this.$route.query.businessDomainId,
      statsVO: {}, // 统计数据
      canceltaskshow: false,
      isNaN: '', // 修bug 用
      taskId: '',
      formLabelWidth: '170px',
      loading: false,
      timeLines: [
        // {
        //   time: dayjs().subtract(dayjs().diff(dayjs(), 'day'), 'day')
        // },
        // {
        //   time: dayjs()
        //     .add(5, 'hour')
        //     .toString(),
        //   color: '#747e80'
        // }
      ],
      // date: '2019-01-15', // 选择日期
      // currentTime: dayjs().subtract(dayjs().diff(dayjs('2019-1-15'), 'day'), 'day'),
      // startTime: '2019-01-15 04:00',
      // endTime: '2019-01-17',
      date: this.getNowFormatDate(), // 选择日期
      currentTime: dayjs(),
      startTime: this.$route.query.date ? dayjs(this.$route.query.date).subtract(24, 'hour').toString() : dayjs(this.$route.query.date).subtract(24, 'hour').toString(),
      endTime: this.$route.query.date ? dayjs(this.$route.query.date).add(1, 'day').add(24, 'hour').toString() : dayjs(this.$route.query.date).add(24, 'hour').add(24, 'hour').toString(),
      bustyleId: '',
      // bustyleId: this.$route.query.skillId ? this.$route.query.skillId : '',\
      isWarn: false,
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
      scrollToTime: dayjs().add(1, 'day').toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideHeader2: true,
      arrayKeys: ['gtArray', 'error'],
      positionB: { x: this.$route.query.data ? localStorage.getItem('scrollx') - 600 : 11800, Y: 10000 },
      positionA: { x: this.$route.query.data ? localStorage.getItem('scrollx') - 600 : 11800, Y: 1000 },
      timer: '',
      type: '',
      state: '',
      routeData: '',
      dropEmployeeId: '',
      dropTaskState: ''
    }
  },
  watch: {
    datasNum(newV) {
      this.datasA = mockDatas(newV)
      this.datasB = mockDatas(newV)
    },
    scrollToY(val) {
      this.positionA = { x: val }
    },
    positionA(newV) {}
  },
  created: function () {
    // this.getTaskState() // 查询状态
    this.init()
    this.searchAllStatus()
    this.taskTypesearch()
  },
  mounted() {
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 200, y: 0 }
    })
  },
  updated: function () {
    // 动态改变行高，自适应行高
    // var _this = this
    // var p = document.querySelectorAll('.gantt-block')
    // p.forEach(function (element, index) {
    //   var setH = element.childNodes ? element.childNodes : ''
    //   var maxH = []
    //   _this.$nextTick(function () {
    //     if (maxH.length > 0) {
    //       var max = Math.max.apply(null, maxH)
    //       element.style.height = max * 34 + 'px'
    //       document.querySelectorAll('.gantt-leftbar-item')[index].style.height = element.style.height
    //       // document.querySelectorAll('.gantt-block-top-space')[index].style.height = '10000px'
    //     }
    //   })
    //   if (setH) {
    //     setH.forEach((element2) => {
    //       maxH.push(parseInt(element2.getAttribute('h')))
    //     })
    //   }
    // })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer) // Vue实例销毁，清除我们的定时器,防止跳转路由时不触发被forDestroy，定时器请不掉
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 200, y: 0 }
    })
  },
  methods: {
    // 任务类型
    taskTypesearch() {
      const data = {
        id: this.businessDomainId,
        airportId: this.siteId
      }
      initTableTask(data).then((response) => {
        this.codeOptions = response.data
      })
    },

    dateChange(val) {
      if (val[0] === val[1]) {
        this.rangeDay = true
      } else {
        this.rangeDay = false
      }
    },

    // 搜索
    queryData() {
      this.assignedTask()
      this.unassignedTask()
    },
    // 创建特殊任务确定按钮
    setHandleEditClick() {
      this.formEdit.beginTime = this.formEdit.dateRange[0]
      this.formEdit.finishTime = this.formEdit.dateRange[1]
      if (this.rangeDay) {
        this.formEdit.startTime = this.formEdit.timeRange[0]
        this.formEdit.endTime = this.formEdit.timeRange[1]
      }
      this.formEdit.airportId = this.$route.query.siteId
      this.formEdit.businessDomainId = this.businessDomainId
      addSpecialTask(this.formEdit)
        .then((response) => {
          this.$message.success('设置成功')
          this.specialVisable = false
          this.listFn()
          this.initList()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },

    // 值守视角
    jumpDesk() {
      this.$router.push({ path: '/dispatching/guardPoint/guardPoint2', query: { businessDomainId: this.businessDomainId, siteId: this.siteId || 10, deskPredictions: this.intlType || '', date: this.ruleForm.date } })
    },
    // 特殊任务派工
    specialTaskDistribute() {
      this.specialVisable = true
    },

    // 查询所有任务状态
    searchAllStatus() {
      const data = {
        airportId: this.siteId
      }
      searchTaskStatus(data).then((response) => {
        this.statusList = response.data.data
      })
    },
    // 任务状态修改后刷新页面
    changeStatus() {
      this.assignedTask()
      this.unassignedTask()
    },
    init() {
      // clearInterval(this.timer)
      this.assignedTask()
      this.unassignedTask()
      // this.getTaskState()
      // this.timer = setInterval(this.init(), 20000)
      // selectData().then(res => {
      //   res.data.data.unshift({ skillId: '', skillName: '全部' })
      // })
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      // this.startTime = dayjs(e).subtract(1, 'day').toString()
      // this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.startTime = dayjs(e).subtract(24, 'hour').toString()
      this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.init()
    },
    changeActive(item, data) {
      if (data.id) {
        this.canceltaskshow = true
      }
    },
    changeLeave(item) {
      this.canceltaskshow = false
    },
    canceltask(item) {
      // 取消任务
      canceltask({ guardTaskId: item.guardTaskId, businessDomainId: this.businessDomainId }).then((response) => {
        this.init()
      })
    },
    assignedTask() {
      // 员工列表
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.loading = true
      var data = {
        airportId: this.siteId || this.$route.query.siteId,
        // deskPredictions: this.intlType1 || this.$route.query.deskPredictions,
        employeeName: this.ruleForm.name || '',
        businessDomainId: this.businessDomainId,
        date: this.ruleForm.date
      }
      initEmployeeList(data).then((response) => {
        this.datasB = []
        this.loading = false
        var data = response.data.data
        this.statsVO = data.statsVO
        if (data.employeeVOList) {
          // this.morningAvgSumRate = data.morningAvgSumRate || ''
          // this.eveningAvgSumRate = data.eveningAvgSumRate || ''
          this.totalAvgRate = data.totalAvgRate || ''
          if (data.employeeVOList.length !== 0) {
            this.datasB = data.employeeVOList
          }
          this.employeeOptions = this.datasB
          // 滚动条定位
          if (response.data.data.employeeVOList) {
            if (this.refreshCount === 0) {
              let data = response.data.data
              let taskArray = []
              let beforeCurrent = []
              let afterCurrent = []
              const time = new Date()
              const hour = time.getHours()
              const minute = time.getMinutes()
              const second = time.getUTCSeconds()
              const currentTime = new Date(this.ruleForm.date + ' ' + `${hour}:${minute}:${second}`).getTime()
              data.employeeVOList.forEach((item) => {
                taskArray = taskArray.concat(item.guardTaskVOS)
              })
              taskArray.forEach((item) => {
                if (new Date(item.beginTime).getTime() > currentTime) {
                  afterCurrent.push(item)
                } else {
                  beforeCurrent.push(item)
                }
              })
              let minItem = {}
              let personRow = null
              if (beforeCurrent.length) {
                var min = new Date(beforeCurrent[0].beginTime).getTime() - currentTime
                for (var i = 0; i < beforeCurrent.length; i++) {
                  var cur = new Date(beforeCurrent[i].beginTime).getTime() - currentTime
                  if (cur > min) {
                    minItem = beforeCurrent[i]
                  } else {
                    minItem = beforeCurrent[0]
                  }
                }
              } else if (afterCurrent.length) {
                var min = new Date(afterCurrent[0].beginTime).getTime() - currentTime
                for (var i = 0; i < afterCurrent.length; i++) {
                  var cur = new Date(afterCurrent[i].beginTime).getTime()
                  if (cur - currentTime > min) {
                    minItem = afterCurrent[i]
                  } else {
                    minItem = afterCurrent[0]
                  }
                }
              }
              data.employeeVOList.forEach((item, index) => {
                if (item.employeeCode === minItem.employeeCode) {
                  personRow = index
                }
              })
              this.positionB = { x: getPositonOffset(minItem.beginTime, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
            }
            this.refreshCount = 1
          }
        } else {
          this.datasB = []
          if (this.ruleForm.name) {
            this.$message({
              type: 'success',
              message: '无匹配数据'
            })
          } else {
            this.$message({
              type: 'success',
              message: '暂无已分配数据'
            })
          }
        }

        if (this.datasB.length === 0) {
          document.getElementsByClassName('gantt-leftbar-item')[0].style.color = 'white'
          document.getElementsByClassName('gantt-leftbar-item')[0].style.paddingTop = '20px'
          document.getElementsByClassName('gantt-leftbar-item')[0].innerHTML = '今日无员工上班，请制作排班表并发布员工日历'
        } else {
          document.getElementsByClassName('gantt-leftbar-item')[0].style.visibility = 'hidden'
        }
        this.datasBCopy = this.datasB
      })
      // this.timer = setInterval(this.assignedTask, 3000)
    },
    unassignedTask() {
      // 未分配
      // clearInterval(this.timer)
      var data = {
        airportId: this.siteId || this.$route.query.siteId,
        businessDomainId: this.businessDomainId,
        date: this.ruleForm.date
      }
      // this.loading = true
      weifenpei(data).then((response) => {
        this.datasA = []
        var data = response.data.data
        if (!data) {
          this.loading = false
          this.$message.success('暂无数据！')
        } else {
          this.loading = false
          // guardSkipVOList.forEach(element => {
          data.forEach((element1) => {
            var gtArray = []
            this.datasA.push({
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
          // })
          // this.Num = this.datasA.length
        }

        this.loading = false
      })
      // this.timer = setInterval(this.init, 20000)
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
      this.cellHeight2 = 170
    },
    scrollLeftB2(val) {
      this.positionB = { Y: val }
    },
    // 拖拉
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev, item) {
      this.checkInTaskId = item.guardTaskId
      this.employeeSearch(item.guardTaskId, item.employeeCode, item.beginTime, item.endTime, item.skillId)
    },
    employeeSearch(taskId, employeeCode, startTime, endTime, skillId) {
      if (!employeeCode) {
        // this.datasB = []
        // this.$message('正在寻找该时段有空的员工……')
        let taskStartTime = new Date(startTime).getTime()
        let taskEndTime = new Date(endTime).getTime()
        var a = []
        for (let i = 0; i < this.datasBCopy.length; i++) {
          let flag = true
          let employeeStartTime = new Date(this.datasBCopy[i].beginTime).getTime()
          let employeeEndTime = new Date(this.datasBCopy[i].endTime).getTime() + 30 * 60 * 1000

          let skillFlag = this.datasBCopy[i].skills.filter((item) => {
            return item.id === skillId
          })
          if (skillFlag.length !== 0) {
            let workTimeEmployee = this.datasBCopy[i].workTimeVOS
            for (let k = 0; k < workTimeEmployee.length; k++) {
              // this.datasBCopy.workTimeVOS.forEach(item => {
              employeeStartTime = new Date(workTimeEmployee[k].startTime).getTime()
              employeeEndTime = new Date(workTimeEmployee[k].endTime).getTime() + 30 * 60 * 1000
              if (taskEndTime > employeeEndTime || taskStartTime < employeeStartTime) {
                flag = false
                continue
              } else {
                flag = true
                break
              }
              // })
            }
            if (flag) {
              for (let j = 0; j < this.datasBCopy[i].guardTaskVOS.length; j++) {
                // 如果冲突则删除该人并跳出循环
                if (!(taskEndTime <= new Date(this.datasBCopy[i].guardTaskVOS[j].beginTime).getTime() || taskStartTime >= new Date(this.datasBCopy[i].guardTaskVOS[j].endTime).getTime())) {
                  flag = false
                  break
                }
              }
            }
            if (flag) {
              a.push(this.datasBCopy[i])
            }
          }

          // if (taskEndTime > employeeEndTime || taskStartTime < employeeStartTime) {
          //   flag = false
          //   continue
          // } else {
          //   for (let j = 0; j < this.datasBCopy[i].guardTaskVOS.length; j++) {
          //     // 如果冲突则删除该人并跳出循环
          //     if (!(taskEndTime <= new Date(this.datasBCopy[i].guardTaskVOS[j].beginTime).getTime() || taskStartTime >= new Date(this.datasBCopy[i].guardTaskVOS[j].endTime).getTime())) {
          //       flag = false
          //       break
          //     }
          //   }
          // }
          // if (flag) {
          //   a.push(this.datasBCopy[i])
          // }
        }
        if (a.length === 0) {
          this.$message({
            type: 'success',
            message: '暂无匹配员工'
          })
          this.datasB = []
        } else {
          this.countDesc = '符合条件人数'
          this.progressVisible = false
          this.datasB = a
        }
      }
    },
    onDrop(event) {
      var data1 = {
        employeeCode: event.target.getAttribute('employeeId') || event.target.childNodes[0].getAttribute('employeeId') || '',
        guardTaskId: this.checkInTaskId,
        businessDomainId: this.businessDomainId
      }
      deskManualDispatching(data1)
        .then((response) => {
          // this.listFn()
          // this.initList()
          this.init()
          this.$message({
            type: 'success',
            message: '分配成功!'
          })
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // },
    dragend(event) {
      // console.log(event.target.getAttribute('class'), 77)
    },
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/busRules' })
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
<style>
.splitpanes {
  background-color: #333e5f;
  /* background-color: #f8f8f8; */
}

.splitpanes__splitter {
  /* background-color: #ccc; */
  background-color: #333e5f;
  position: relative;
}
.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: #1d2a4f;
  opacity: 0;
  z-index: 1;
}
.splitpanes__splitter:hover:before {
  opacity: 1;
}
.splitpanes--vertical > .splitpanes__splitter:before {
  left: -5px;
  right: -5px;
  height: 100%;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -5px;
  bottom: -5px;
  width: 100%;
}
</style>
<style scoped>
#app2 {
  padding-top: 60px;
}
.demo-ruleForm .el-form-item {
  display: inline-block;
  margin-bottom: 0;
}

#app2 /deep/ .gantt-leftbar-defalutItem {
  display: none;
}
#app2 /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
.staffTime {
  position: absolute;
  height: 2px;
  bottom: -3px;
  background: #2b74c0;
}
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
.container >>> .leftbotm,
.container >>> .gantt-leftbar-wrapper {
  width: 200px !important;
  background: #000;
}
.container >>> .gantt-markline-area,
.container >>> .gantt-scroll-x {
  margin-left: 200px !important;
}
.container >>> .gantt-chart {
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
  top: 61%;
  border-top: 1px solid #ccc;
}
.leftbotm p {
  color: #cccccc;
  font-size: 14px;
  text-align: center;
  padding: 5px 10px;
}
.warn-style {
  cursor: pointer;
}
.workTime {
  background: green;
}
</style>
