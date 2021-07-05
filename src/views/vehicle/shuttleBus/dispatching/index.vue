<template>
  <div id="app2">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px">
      <label>日期：</label>
      <el-date-picker v-model="date" :clearable="isClearable" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData(date)" />
      <label>任务状态：</label>
      <el-select v-model="value2" style="width: 150px" size="small" placeholder="请选择" multiple collapse-tags @change="stateChange">
        <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-button size="small" class="item-btn" type="success" @click="openStandard">派工作业标准</el-button>
      <el-button size="small" class="item-btn" type="success" @click="openRule">自动派工规则</el-button>
      <!-- <el-button v-if="stopstaus === '0'" class="item-btn" size="small" type="success" @click="automaticTask">开始自动派工</el-button> -->
      <el-button size="small" class="item-btn" type="success" @click="startTask">派工</el-button>
      <!-- <el-button v-else class="item-btn" size="small" type="success" @click="stopBusTask">停止自动派工</el-button> -->
      <el-button size="small" class="item-btn" type="success" @click="opentask">任务列表</el-button>
      <el-button class="item-btn" size="small" type="success" @click="showdialogFormake('ruleForm')">新建临时任务</el-button>
      <el-button v-if="taskIsOpen === '0'" size="small" class="item-btn" type="success" @click="startTaskBorn()">开始生成任务</el-button>
      <!-- <el-button v-else size="small" class="item-btn" type="success" @click="stopTaskBorn()">停止生成任务</el-button> -->
      <!-- <el-button size="small" :loading="loadingBtn" class="item-btn" type="success" @click="stopTaskBorn()">生成摆渡车任务</el-button> -->
      <el-button class="item-btn" size="small" type="success" @click="cancelAssignAll">取消已派任务</el-button>
      <el-button class="item-btn" size="small" type="success" @click="taskGenerateTest">任务生成测试</el-button>

      <span class="textips">
        <!-- 今日在岗人数 :
        <ins>{{ getStat.peopleCount }}</ins>，-->
        航班数 :
        <ins>{{ getStat.flightNum }}</ins
        >， 总任务数 : <ins class="warn-style" @click="allTask">{{ getStat.totalTaskNum }}</ins
        >， 自动派工率 : <ins>{{ getStat.automaticAssignmentRate }}</ins
        >，
        <!-- 工时利用率 :
        <ins>{{ getStat.manHourUtilization?(getStat.manHourUtilization * 100).toFixed(1) + '%':'-' }}</ins>，-->
        <span style="display: inline-block; width: 10px; height: 10px; background: #3a8ee6; margin-right: 3px" />未分配 : <ins>{{ getStat.unassignedNum }}</ins
        >，
        <!-- 待分配 :#255e9a
        <ins>{{ getStat.unassignedNum }}</ins>，-->
        <span style="display: inline-block; width: 10px; height: 10px; background: #1156f0; margin-right: 3px" />已分配 : <ins>{{ getStat.assignedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(103, 194, 58) 50%; margin-right: 3px" />已开始&nbsp;&nbsp;: <ins>{{ getStat.startedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: rgb(67, 162, 43) 50%; margin-right: 3px" />已接收 : <ins>{{ getStat.receivedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #a4abc0; margin-right: 3px" />已完成 : <ins>{{ getStat.completedNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #99004d; margin-right: 3px" />已取消 : <ins>{{ getStat.canceledNum }}</ins
        >， <span style="display: inline-block; width: 10px; height: 10px; background: #ff3399; margin-right: 3px" />已超时 : <ins>{{ getStat.timeoutNum }}</ins
        >，
        <span class="warn-style" @click="opentaskWarning(7)">
          <span style="color: yellow">！</span>告警 : <ins>{{ getStat.warningNum }}</ins> </span
        >， <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 :
        <ins>{{ getStat.unassignedLockedNum + getStat.assignedLockedNum }}</ins>
      </span>
      <el-drawer title="告警数量:10" :visible.sync="drawer" :modal="false">
        <ul>
          <li>1.任务：CA1496/--经济(4)--1978--N207L #</li>
        </ul>
      </el-drawer>
    </div>
    <header class="top-bar">
      <label for="titleWith">titleWidth</label>
      <input v-model.number="titleWidth" type="range" min="0" max="250" />
      <label for="cellWidth">cellWidth</label>
      <input v-model.number="cellWidth" type="range" min="20" max="100" />
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader" v-model="hideHeader" type="checkbox" style="width: 15px" />
      <label for="scale">scale</label>
      <select id="scale" v-model.number="scale" style="font-size: 12px" @change="scaleChange">
        <option v-for="i in scaleList" :key="i">{{ i }}</option>
      </select>
      <span>分钟</span>
    </header>
    <div class="container" @dragend="dragend($event)" @dragover="allowDrop($event)" @drop="onDrop($event)" ref="gantt">
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
              <div v-for="(item, index) in data.tasks" :id="index" :key="index" :employeeId="data.code" :skillId="data.skillId" class="taskList" :h="index" :style="{ top: 3 * index + 'px' }">
                <div
                  v-for="(itemin, indexin) in item"
                  :id="indexin"
                  :key="indexin"
                  class="gantt-block-item"
                  :style="{ left: getPositonOffset(itemin.planInPlace) + 'px', width: getWidthAbout2Times(itemin.planInPlace, itemin.planEnd, { scale, cellWidth }) + 'px' }"
                  :left="getPositonOffset(itemin.planInPlace)"
                  @mouseenter="changeActive($event, itemin)"
                  @mouseleave="changeLeave($event)"
                  @dragstart="dragstart($event, itemin)"
                >
                  <Test :data="data" :status-list="statusList" :cell-height="cellHeight" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itemin" @changeStatus="changeStatus" />
                  <!-- 未改，做个记号 -->
                  <div
                    class="windowTime"
                    :style="{ left: getPositonOffset(itemin.windowStartTime) - getPositonOffset(itemin.planInPlace) + 'px', width: getWidthAbout2Times(itemin.windowStartTime, itemin.windowEndTime, { scale, cellWidth }) + 'px' }"
                  />
                  <div
                    class="actualTime"
                    v-if="itemin.taskState === 4 || itemin.taskState === 7"
                    style="position: absolute; top: 0px; background: none"
                    :style="{
                      left: getPositonOffset(itemin.actualInPlace ? itemin.actualInPlace : itemin.planInPlace) - getPositonOffset(itemin.planInPlace) + 'px',
                      width: getWidthAbout2Times(itemin.actualInPlace ? itemin.actualInPlace : itemin.planInPlace, itemin.actualEnd ? itemin.actualEnd : itemin.planEnd, { scale, cellWidth }) + 'px'
                    }"
                  />
                </div>
                <!-- <div class="staffTime" :style="{left:getPositonOffset(data.beginTime)+'px',width:getWidthAbout2Times(data.beginTime,data.endTime,{ scale,cellWidth})+'px'}" /> -->
                <div
                  v-for="(itemTime, index) in data.workTimeVOS"
                  :key="itemTime.startTime"
                  class="staffTime"
                  :style="{ left: getPositonOffset(itemTime.startTime) + 'px', width: getWidthAbout2Times(itemTime.startTime, itemTime.endTime, { scale, cellWidth }) + 'px' }"
                />
              </div>
            </template>
            <template v-slot:left="{ data }">
              <TestLeft :data="data" />
            </template>
            <template v-slot:title>
              <div class="gantt-header-title-left">
                <label style="font-size: 12px; margin-left: 0px">车辆类型：</label>
                <el-select v-model="bustyle" style="width: 106px" size="small" placeholder="请选择" @change="changeBus">
                  <el-option v-for="(item, i) in groupstyle" :key="i" :label="item.typeName" :value="item.typeId">{{ item.typeName }}</el-option>
                </el-select>
              </div>
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
                :employeeId="1"
                class="gantt-block-item"
                :h="item2.tasks.length"
                :style="{ left: getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(item2.start, item2.end, { scale, cellWidth }) + 'px', top: '8px' }"
              >
                <div style="position: relative">
                  <div
                    v-for="(itm, index2) in item2.tasks"
                    :employeeId="1"
                    :key="index2"
                    class="gantt-block-item"
                    :style="{ left: getPositonOffset(itm.planInPlace) - getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(itm.planInPlace, itm.planEnd, { scale, cellWidth }) + 'px', 'margin-top': index2 * 22 + 'px' }"
                    @dragstart="dragstart($event, itm)"
                  >
                    <Test :data="data" :status-list="statusList" :cell-height="cellHeight2" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itm" @changeStatus="changeStatus" />
                  </div>
                </div>
              </div>
            </template>
          </v-gantt-chart>
        </pane>
      </splitpanes>
    </div>
    <!-- 修改规则 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="60%">
      <el-form ref="formEdit" :model="formEdit" :label-width="formLabelWidth">
        <!-- <el-form-item prop="associateType" label="派工类型">
          <el-radio-group v-model="formEdit.skillType">
            <el-radio :label="0">单技能派工</el-radio>
            <el-radio :label="1">混合技能派工</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item prop="beforeTime" label="工作准备时间">
          任务开始前
          <el-input v-model="formEdit.beforeTime" size="small" style="width: 150px" />分钟
        </el-form-item>
        <el-form-item prop="beginTime" label="自动派工开始时间">
          <el-time-picker v-model="formEdit.beginTime" size="small" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="自动派工结束时间">
          <el-time-picker v-model="formEdit.endTime" size="small" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间">
            <!-- <el-input v-model="formEdit.dayend" size="small" /> -->
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
            派工间隔(分钟)
            <el-tooltip class="item" effect="dark" content="指后台派工算法的运行频次" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.timeInterval" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item prop="alarmTime" label="告警时间">
          任务开始前
          <el-input v-model="formEdit.alarmTime" size="small" style="width: 150px" />&nbsp;&nbsp;分钟
        </el-form-item>
        <el-form-item>
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
            页面刷新时间(秒)
            <el-tooltip class="item" effect="dark" content="注意：单位是秒，不是分钟" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.refreshTime" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item>
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
            预派工窗口时间(分钟)
            <el-tooltip class="item" effect="dark" content="指提前多少时间派发任务给员工。考虑到航班动态不断变化，为了提高实操性，建议不要设置太大的数值" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.tp" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item prop="lockingTime" label="任务提前锁定时间(分钟)">
          <el-input v-model="formEdit.lockingTime" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item prop="associateType" label="任务绑定规则">
          <el-radio-group v-model="formEdit.associateType">
            <el-radio :label="0">时间</el-radio>
            <el-radio :label="1">过站</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formEdit.associateType == '1'">
          <span style="margin-left: -170px">
            停场时间(分钟)
            <el-tooltip class="item" effect="dark" content="设定停场时间将航班判定为过站，此时将两个航班任务绑定派工。" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.groundTime" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item v-if="formEdit.associateType == '0'">
          <span style="margin-left: -170px">
            任务绑定时间间隔(分钟)
            <el-tooltip class="item" effect="dark" content="当相同位置两个任务的时间间隔小于设定值时，将会绑定在一起进行派工，以减少员工的移动距离" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.associateTime" size="small" style="width: 60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 生成任务 -->
    <el-dialog v-dialogDrag title="生成任务" :visible.sync="dialogFormake" width="680px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" size="small" class="demo-ruleForm">
        <el-form-item label="航班号" prop="flightNo">
          <el-select v-model="ruleForm.flightNo" filterable placeholder="请选择" @change="flightNoChanged">
            <el-option v-for="item in flightNoOptions" :key="item.id" :label="item.flightNo" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="机位" prop="position">
          <!-- <el-input v-model="ruleForm.position" /> -->
          <el-select v-model="ruleForm.position">
            <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionCode" :value="item.positionId" />
          </el-select>
        </el-form-item>
        <el-form-item label="起飞站" prop="deptAirport">
          <el-input v-model="ruleForm.deptAirport" disabled />
        </el-form-item>
        <el-form-item label="到达站" prop="arrAirport">
          <el-input v-model="ruleForm.arrAirport" disabled />
        </el-form-item>
        <el-form-item label="国际国内:" prop="regionType">
          <el-select v-model="ruleForm.regionType" placeholder="请选择">
            <el-option v-for="(item, i) in intlFlagoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型:" prop="busTypeId">
          <el-select v-model="ruleForm.busTypeId" placeholder="请选择">
            <el-option v-for="(item, i) in groupstyle2" :key="i" :label="item.typeName" :value="item.typeId">{{ item.typeName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进出港:" prop="flightType">
          <el-select v-model="ruleForm.flightType" placeholder="请选择" @change="flightTypevaule">
            <el-option v-for="(item, i) in flightTypeoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机坪:" prop="apron">
          <!-- <el-input v-model="ruleForm.apron" /> -->
          <el-select v-model="ruleForm.apron">
            <el-option v-for="item in apronList" :key="item.apronId" :label="item.apronName" :value="item.apronId" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称：" prop="taskName">
          <el-input v-model="ruleForm.taskName" />
        </el-form-item>
        <el-form-item label="计划到位时间：" prop="planInPlace">
          <el-time-picker v-model="ruleForm.planInPlace" type="datetime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="计划发车时间：" prop="planDepart">
          <el-time-picker v-model="ruleForm.planDepart" type="datetime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="计划结束时间：" prop="planEnd">
          <el-time-picker v-model="ruleForm.planEnd" type="datetime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" @change="endChange" />
          <span v-show="crossDay">+1</span>
        </el-form-item>
        <el-form-item label="任务开始位置：" prop="startPosition">
          <el-input v-model="ruleForm.startPosition" />
        </el-form-item>
        <el-form-item label="任务结束位置：" prop="endPosition">
          <el-input v-model="ruleForm.endPosition" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button size="small" @click="dialogFormake = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 生成任务按钮测试 -->
    <el-dialog v-dialogDrag title="生成任务" :visible.sync="testTaskVisible" width="680px">
      <el-form ref="testForm" :model="testForm" label-width="120px" size="small" class="demo-ruleForm">
        <el-form-item label="航班号" prop="flightNo">
          <!-- <el-select v-model="testForm.flightNo" filterable placeholder="请选择" collapse-tags multiple>
            <el-option v-for="item in flightNoOptions" :key="item.id" :label="item.flightNo" :value="item.id" />
          </el-select> -->
          <el-input v-model="testForm.flightNo" />
        </el-form-item>
        <el-form-item label="开始时间" prop="planStart">
          <el-date-picker v-model="testForm.beginDate" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="结束时间" prop="planEnd">
          <el-date-picker v-model="testForm.endDate" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitTestForm('testForm')">确定</el-button>
        <el-button size="small" @click="testTaskVisible = false">取消</el-button>
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
import { mockDatas } from './mock/index.js'
import dayjs from 'dayjs'
import { getWidthAbout2Times, getPositonOffset } from './components/gtUtils.js'
import { cancelAssignAllTask, canceltask } from '@/api/busRules'
import { find, findposititon } from '@/api/apron'
import { testTaskUrl } from '@/apiNew/specialVehicle'
import {
  getBusParam,
  addBusParam,
  updateBusParam,
  list,
  getFeriyBusTask,
  getStatistics,
  addTemporaryTask,
  addTemporaryTaskData,
  allotTasks,
  allotTasksForce,
  bottomAllotTasks,
  bottomAllotTasksForce,
  stopAutoTask,
  getJobState,
  automaticTask1,
  startTask,
  updateTask,
  searchService,
  carType,
  GeneratingTasksWorkload,
  searchTaskStatus
} from '@/apiNew/vehicle'
const scaleList = `10,15,30,60`.split(',').map((n) => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft, LeftBtm, Splitpanes, Pane },
  data() {
    return {
      airport: this.$store.state.user.airport,
      crossDay: false,
      testForm: { flightNo: '', beginDate: '', endDate: '' },
      testTaskVisible: false,
      addOrUpdate: 0, // 0代表未查询到数据，走新增接口；1代表已有数据，走修改接口
      refreshCount: 0,
      datasBCopy: [],
      statusList: [],
      isClearable: false,
      groupstyle2: [],
      staticDistance: null,
      taskIsOpen: '',
      loadingBtn: false,
      positionList: [],
      apronList: [],
      flightNoOptions: [],
      drawer: false,
      stopstaus: '',
      businessDomainId: this.$route.query.businessDomainId,
      getStat: {}, // 统计数据
      canceltaskshow: false,
      intlFlagoption: [
        { value: '国际', id: 'I' },
        { value: '国内', id: 'D' }
      ],
      busTypeoption: [
        { value: '大摆渡', id: 'BIG_BUS' },
        { value: '出港', id: 'BF_BUS' },
        { value: '小摆渡', id: 'COBUS' }
      ],
      isNaN: '', // 修bug 用
      flightTypeoption: [
        { value: '进港', id: 'A' },
        { value: '出港', id: 'D' }
      ],
      dialogFormake: false,
      ruleForm: {
        // 生成任务
        startPosition: '',
        endPosition: ''
      },
      whichDayOptions: [
        { id: 0, name: '0' },
        { id: 1, name: '1' },
        { id: 2, name: '2' }
      ],
      apronCode: '', // 讥评
      restaurants: [],
      inoutype: '', // 进出港
      data2: '231231',
      taskId: '',
      title: '规则设置',
      formEdit: { associateType: 0 },
      editSkillVisible: false,
      formLabelWidth: '170px',
      loading: false,
      dialogFormVisible: false,
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
      startTime: this.$route.query.data ? dayjs(this.$route.query.data).subtract(2, 'hour').toString() : dayjs(this.getNowFormatDate()).subtract(24, 'hour').toString(),
      endTime: this.$route.query.data ? dayjs(this.$route.query.data).add(1, 'day').add(2, 'hour').toString() : dayjs(this.getNowFormatDate()).add(24, 'hour').add(24, 'hour').toString(),
      bustyle: '全部', // 摆渡车类型
      bustyleId: '',
      // bustyleId: this.$route.query.skillId ? this.$route.query.skillId : '',
      groupstyle: [],
      isWarn: false,
      cellWidth: 50,
      cellHeight: 35,
      cellHeight2: 80,
      titleHeight: 40,
      titleWidth: 200,
      scale: 10,
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
      endExchangeIndex: '',
      value2: [],
      timer: '',
      type: '',
      state: '',
      routeData: '',
      dropEmployeeId: '',
      dropTaskState: '',
      status: [
        { id: 3, label: '已接收' },
        { id: 4, label: '已完成' },
        { id: 6, label: '已超时' },
        { id: 5, label: '已取消' },
        { id: 7, label: '已开始' }
      ],
      rules: {
        flightNo: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
        planInPlace: [{ required: true, message: '请选择计划到位时间', trigger: 'blur' }],
        planDepart: [{ required: true, message: '请选择计划发车时间', trigger: 'blur' }],
        position: [{ required: true, message: '请输入机位', trigger: 'blur' }],
        deptAirport: [{ required: true, message: '请输入起飞站', trigger: 'blur' }],
        arrAirport: [{ required: true, message: '请输入到达站', trigger: 'blur' }],
        regionType: [{ required: true, message: '请选择国际/国内', trigger: 'change' }],
        busTypeId: [{ required: true, message: '请选择车型', trigger: 'change' }],
        flightType: [{ required: true, message: '请选择进出港类型', trigger: 'change' }],
        apron: [{ required: true, message: '请输入机坪', trigger: 'change' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        planEnd: [{ required: true, message: '请选择计划结束时间', trigger: 'change' }],
        // deptArrAirport: [{ required: true, message: '请输入', trigger: 'change' }],
        startPosition: [{ required: true, message: '请输入开始位置', trigger: 'change' }],
        endPosition: [{ required: true, message: '请输入结束位置', trigger: 'change' }]
        // deptApron: [{ required: true, message: '请输入', trigger: 'change' }],
        // intlFlag: [{ required: true, message: '请输入', trigger: 'change' }]
      }
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
    positionA(newV) {},
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.init()
        this.vehicleType()
        this.searchAllStatus()
      }
    }
  },
  created: function () {
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
    // this.getTaskState() // 查询状态
    this.init()
    this.vehicleType()
    this.searchAllStatus()
  },
  mounted() {
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 200, y: 0 }
    })
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
    // scale change
    scaleChange() {
      this.assignedTask()
      this.unassignedTask()
    },
    endChange() {
      const flag = this.checkdate(this.ruleForm.planDepart, this.ruleForm.planEnd)
      if (flag) {
        this.crossDay = true
      } else {
        this.crossDay = false
      }
    },
    checkdate(start, end) {
      var date = new Date()
      var a = start.split(':')
      var b = end.split(':')
      if (date.setHours(Number(a[0]), Number(a[1])) > date.setHours(Number(b[0]), Number(b[1]))) {
        return false
      }
      return true
    },
    // 任务生成测试按钮
    taskGenerateTest() {
      this.testTaskVisible = true
    },
    // 测试按钮生成接口
    submitTestForm() {
      const data = {
        businessDomainId: this.businessDomainId || '',
        beginDate: this.testForm.beginDate,
        endDate: this.testForm.endDate,
        flightNos: this.testForm.flightNo,
        airportId: this.airport.airportId
      }
      testTaskUrl(data)
        .then((response) => {
          this.$message.success('生成成功')
          this.testTaskVisible = false
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 查询所有任务状态
    searchAllStatus() {
      const data = {
        airportId: this.airportId.airportId
      }
      searchTaskStatus(data).then((response) => {
        this.statusList = response.data.data
      })
    },
    // 任务状态修改后刷新页面
    changeStatus() {
      this.assignedTask()
      this.unassignedTask()
      this.getStatistics()
    },
    vehicleType() {
      const data = {
        airportId: this.airport.airportId
      }
      carType(data).then((response) => {
        if (response.data.data) {
          response.data.data.unshift({ skillId: '', typeName: '全部' })
          this.groupstyle = response.data.data
          this.groupstyle2 = response.data.data.slice(1)
        }
      })
    },
    startTaskBorn() {
      // alert('开始生成任务')
      var data = {
        workTypeId: 7,
        state: 1,
        airportId: this.airport.airportId
      }
      updateTask(data).then((response) => {
        // console.log('成功了')
        this.init()
      })
    },
    stopTaskBorn() {
      // alert('停止生成任务')
      //   var data = {
      //     workTypeId: 7,
      //     state: 0
      //   }
      //   updateTask(data).then(response => {
      //     this.init()
      //   })
      const data = {
        airportId: this.airport.airportId
      }
      this.loadingBtn = true
      GeneratingTasksWorkload(data).then((res) => {
        if (res.data.code === '200') {
          this.$message.success('创建成功')
          this.loadingBtn = false
        } else {
          this.$message.error('创建失败')
          this.loadingBtn = false
        }
      })
    },
    stateChange(e) {
      this.value2 = e
      this.init()
    },
    init() {
      // clearInterval(this.timer)
      this.assignedTask()
      this.unassignedTask()
      this.getStatistics()
      this.getTaskState()
      this.getTaskBornState()
      // this.timer = setInterval(this.init(), 20000)
      // selectData().then(res => {
      //   res.data.data.unshift({ skillId: '', skillName: '全部' })
      //   this.groupstyle = res.data.data
      // })
    },
    getTaskBornState() {
      const data = {
        airportId: this.airport.airportId
      }
      searchService(data).then((response) => {
        this.taskIsOpen = response.data.data.serviceOperate
      })
    },
    stopBusTask() {
      // 停止自动派工
      const data = {
        airportId: this.airport.airportId
      }
      stopAutoTask(data).then((response) => {
        this.init()
      })
    },
    getTaskState() {
      // 停止
      const data = {
        airportId: this.airport.airportId
      }
      getJobState(data).then((response) => {
        this.stopstaus = response.data.data
      })
    },
    boardingFcn() {
      this.$router.push({ path: '/dispatching/checkIn/boarding', query: { siteId: this.siteId || 10, deskPredictions: this.intlType || '' } })
    },
    cancelAssignAll() {
      // 取消已派任务
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        airportId: this.airport.airportId
      }
      cancelAssignAllTask(data).then((response) => {
        this.init()
      })
    },
    getStatistics() {
      // 统计数据
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        airportId: this.airport.airportId
      }
      getStatistics(data).then((response) => {
        this.getStat = response.data.data
      })
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      this.startTime = dayjs(e).subtract(1, 'day').toString()
      this.endTime = dayjs(e).add(1, 'day').add(24, 'hour').toString()
      this.init()
    },
    changeBus(e) {
      // 切换摆渡车
      this.bustyleId = e
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
      const data = {
        id: item.id,
        airportId: this.airport.airportId
      }
      canceltask(data).then((response) => {
        clearInterval(this.timer)
        this.assignedTask()
      })
    },
    // 开始派工
    startTask() {
      const data = {
        date: this.date,
        airportId: this.airport.airportId
      }
      startTask(data)
        .then((response) => {
          this.$message.success('开始派工成功')
          this.init()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    automaticTask() {
      // 开始自动派工
      const data = {
        airportId: this.airport.airportId
      }
      automaticTask1().then((response) => {
        this.init()
      })
    },
    openRule() {
      // 规则弹框
      this.editSkillVisible = true
      const data = {
        businessDomainId: this.businessDomainId || 0,
        airportId: this.airport.airportId
      }
      getBusParam(data).then((response) => {
        if (!response.data.data) {
          this.addOrUpdate = 0
        } else {
          this.addOrUpdate = 1
          response.data.data.beginTime = this.calTime(response.data.data.beginTime)
          response.data.data.endTime = this.calTime(response.data.data.endTime)
          response.data.data.whichDay = 0
          this.formEdit = response.data.data
        }
      })
    },
    calTime(time) {
      if (time < 60) {
        if (time < 10) {
          return '00' + ':0' + time
        } else {
          return '00:' + time
        }
      } else if (time > 60) {
        var a = time % 1440
        var b = time / 1440
        this.formEdit.whichDay = b
        var hour = a / 60
        var min = a % 60
        if (hour < 10) {
          hour = '0' + hour
        }
        if (min < 10) {
          min = '0' + min
        }
        return hour + ':' + min
      }
    },
    opentaskWarning(taskStatus) {
      var routeData = this.$router.resolve({ path: '/vehicle/shuttleBus/taskView', query: { taskStatus: taskStatus, name: '', date: this.date } })
      window.open(routeData.href, '_blank')
    },
    // 总任务数跳转至任务列表
    allTask() {
      var routeData = this.$router.resolve({ path: '/vehicle/shuttleBus/taskView', query: { name: '', date: this.date } })
      window.open(routeData.href, '_blank')
    },
    opentask() {
      // 任务视图
      var routeData = this.$router.resolve({ path: '/vehicle/shuttleBus/taskView', query: { name: '', date: this.date } })
      window.open(routeData.href, '_blank')
    },
    openStandard() {
      // 派工标准
      // this.$router.push({ path: '/dispatching/standardNew' })
      this.$router.push({ path: '/vehicle/shuttleBus/serviceStandard' })
    },
    handleEditClick() {
      // 规则弹框确定
      // console.log(this.formEdit, 6688)
      var beginTimes = this.formEdit.beginTime.split(':')
      var endTimes = this.formEdit.endTime.split(':')
      var beginMin = Number(beginTimes[0]) * 60 + Number(beginTimes[1])
      var endMin = Number(endTimes[0]) * 60 + Number(endTimes[1])
      // if (this.formEdit.whichDay === 1) {
      //   endMin += 1440
      // } else if (this.formEdit.whichDay === 2) {
      //   endMin += 2880
      // }
      this.formEdit.beginTime = beginMin
      this.formEdit.endTime = endMin
      this.formEdit.businessDomainId = this.businessDomainId
      this.formEdit.airportId = this.airport.airportId
      if (this.addOrUpdate === 0) {
        addBusParam(this.formEdit).then((response) => {
          this.editSkillVisible = false
          this.$message.success('修改成功')
        })
      } else {
        updateBusParam(this.formEdit).then((response) => {
          this.editSkillVisible = false
          this.$message.success('修改成功')
        })
      }
    },
    assignedTask() {
      // 员工列表
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.loading = true
      if (this.value2.length === 1) {
        this.state = this.value2[0]
      } else if (this.value2.length > 1) {
        this.state = this.value2.join(',')
      } else {
        this.state = ''
      }
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        state: this.state,
        airportId: this.airport.airportId
      }
      list(data).then((response) => {
        this.datasB = []
        this.loading = false
        // 滚动条定位
        if (response.data.data.length) {
          if (this.refreshCount === 0) {
            let taskArray = []
            let beforeCurrent = []
            let afterCurrent = []
            const time = new Date()
            const hour = time.getHours()
            const minute = time.getMinutes()
            const second = time.getUTCSeconds()
            const currentTime = new Date(this.date + ' ' + `${hour}:${minute}:${second}`).getTime()
            // const currentTime = new Date().getTime()
            response.data.data.forEach((item) => {
              taskArray = taskArray.concat(item.tasks)
            })
            taskArray.forEach((item) => {
              if (new Date(item.planInPlace).getTime() > currentTime) {
                afterCurrent.push(item)
              } else {
                beforeCurrent.push(item)
              }
            })
            let minItem = {}
            let personRow = null
            if (beforeCurrent.length) {
              var min = new Date(beforeCurrent[0].planInPlace).getTime() - currentTime
              for (var i = 0; i < beforeCurrent.length; i++) {
                var cur = new Date(beforeCurrent[i].planInPlace).getTime() - currentTime
                if (cur > min) {
                  minItem = beforeCurrent[i]
                } else {
                  minItem = beforeCurrent[0]
                }
              }
            } else if (afterCurrent.length) {
              var min = new Date(afterCurrent[0].planInPlace).getTime() - currentTime
              for (var i = 0; i < afterCurrent.length; i++) {
                var cur = new Date(afterCurrent[i].planInPlace).getTime()
                if (cur - currentTime > min) {
                  minItem = afterCurrent[i]
                } else {
                  minItem = afterCurrent[0]
                }
              }
            }
            response.data.data.forEach((item, index) => {
              if (item.code === minItem.code) {
                personRow = index
              }
            })
            this.positionB = { x: getPositonOffset(minItem.planInPlace, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
          } else {
            this.scrollLeftA()
          }
          this.getStat.peopleCount = response.data.data.length
          this.datasB = response.data.data
          this.refreshCount = 1
          response.data.data.forEach((element) => {
            element.tasks = { 1: element.tasks }
            // if (element.tasks.length === 0) {
            //   element.tasks = { 1: [] }
            // }
          })
        } else {
          this.positionB = { x: 11000, Y: 10000 }
          // this.scrollLeftA()
        }
        if (this.datasB.length === 0) {
          if (document.getElementById('noData')) {
            document.getElementById('noData').style.display = 'block'
          } else {
            var divTemp = document.createElement('div')
            divTemp.setAttribute('id', 'noData')
            divTemp.innerHTML = '今日无员工上班，请制作排班表并发布员工日历'
            divTemp.style.color = 'white'
            divTemp.style.position = 'absolute'
            divTemp.style.width = '192px'
            divTemp.style.zIndex = 999
            divTemp.style.top = this.$refs.gantt.getBoundingClientRect().top + 50 + 'px'
            divTemp.style.fontSize = '12px'
            this.$refs.gantt.appendChild(divTemp)
          }
        } else {
          if (document.getElementById('noData')) {
            document.getElementById('noData').style.display = 'none'
          }
        }
        this.datasBCopy = this.datasB
      })
      // this.timer = setInterval(this.assignedTask, 3000)
    },
    unassignedTask() {
      // 未分配
      clearInterval(this.timer)
      this.staticDistance = dayjs().subtract(2, 'hour').toString()
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        state: this.state,
        airportId: this.airport.airportId
      }
      // this.loading = true
      getFeriyBusTask(data).then((response) => {
        this.datasA = []
        var _this = this
        // console.log(response.data, 'xiang')
        response.data.data.forEach(function (cur) {
          var gtArray = []
          _this.datasA.push({
            gtArray: gtArray
          })
          // console.log(cur, 6655)
          cur.forEach((element) => {
            gtArray.push({
              abbreviation: element.abbreviation,
              id: element.flightNo,
              taskName: element.flightNo,
              end: element.finishTime,
              start: element.startTime,
              tasks: element.tasks,
              cancelFlag: false
            })
            // console.log(gtArray, 'gtArray')
            _this.type = element.taskName
          })
        })
        this.loading = false
      })
      this.timer = setInterval(this.init, 20000)
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
      // console.log(item, 999)
      this.taskId = item.id
      this.dropEmployeeId = item.code
      this.dropTaskState = item.taskState
      this.employeeSearch(item.id, item.code, item.planInPlace, item.planEnd)
    },
    employeeSearch(taskId, employeeCode, startTime, endTime) {
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
          if (taskEndTime > employeeEndTime || taskStartTime < employeeStartTime) {
            flag = false
            continue
          } else {
            for (let j = 0; j < this.datasBCopy[i].tasks[1].length; j++) {
              // 如果冲突则删除该人并跳出循环
              if (!(taskEndTime <= new Date(this.datasBCopy[i].tasks[1][j].planInPlace).getTime() || taskStartTime >= new Date(this.datasBCopy[i].tasks[1][j].planEnd).getTime())) {
                // this.datasBCopy.splice(i, 1)
                flag = false
                break
              }
            }
          }
          if (flag) {
            a.push(this.datasBCopy[i])
          }
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
      var data = {}
      if (event.target.getAttribute('employeeId') === '1' || !event.target.getAttribute('employeeId')) {
        data = {
          taskId: this.taskId,
          date: this.date,
          airportId: this.airport.airportId
        }
        bottomAllotTasks(data)
          .then((response) => {
            // 未确认任务下拖
            if (response.data.data.code === 2) {
              this.$confirm('无对应员工，是否取消该任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  bottomAllotTasksForce(data).then((response) => {
                    this.$message({
                      type: 'success',
                      message: '取消成功'
                    })
                    this.init()
                  })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
            }
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else {
        data = {
          employeeId: event.target.getAttribute('employeeId') || event.target.childNodes[0].getAttribute('employeeId') || '',
          taskId: this.taskId,
          date: this.date,
          airportId: this.airport.airportId
        }
        allotTasks(data)
          .then((response) => {
            // 任务分配
            if (response.data.data.code === 1) {
              this.$message.success('分配成功')
              this.init()
              localStorage.setItem('name', this.taskId)
            } else if (response.data.data.code === 2) {
              this.$confirm('时间冲突, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  allotTasksForce(data).then((response) => {
                    this.$message({
                      type: 'success',
                      message: '分配成功'
                    })
                    this.init()
                  })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
            }
          })
          .catch((error) => {
            // console.log(error.response.data.message, 123456)
            this.$message({
              type: 'error',
              message: error.response.data.message
            })
          })
      }
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
    showdialogFormake(form) {
      // 生成任务
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      addTemporaryTaskData({ flightNo: '', date: this.date,airportId:this.airport.airportId }).then((response) => {
        this.flightNoOptions = response.data.data
      })
      find(this.airport.airportId).then((response) => {
        this.apronList = response.data
      })
      findposititon({airportId:this.airport.airportId}).then((response) => {
        this.positionList = response.data
      })
      this.dialogFormake = true
    },
    flightNoChanged(e) {
      let obj = {}
      obj = this.flightNoOptions.find((item) => {
        return item.id === e
      })
      this.ruleForm.deptAirport = obj.planDeptAirport
      this.ruleForm.arrAirport = obj.planArrAirport
      this.ruleForm.regionType = obj.intlFlag
      this.ruleForm.flightType = obj.flightType
    },
    submitForm() {
      // 新建任务
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.airportId = this.airport.airportId
          addTemporaryTask(this.ruleForm).then((response) => {
            this.dialogFormake = false
            this.$message.success('新增成功')
          })
          this.unassignedTask()
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
</style>
