<template>
  <div id="app2">
    <div style="color: #fff; background: #3e4660; padding: 8px 0; font-size: 14px; margin-top: 60px">
      <label>日期&nbsp;：</label>
      <el-date-picker v-model="date" size="small" type="date" placeholder="选择日期" :clearable="clear" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData(date)" />
      <!-- <label v-if="businessDomainId == '1' || businessDomainId == '102'">派工展示：</label>
      <el-select v-if="businessDomainId == '1' || businessDomainId == '102'" v-model="mixStatus" style="width: 150px" size="small" placeholder="请选择" @change="stateChange">
        <el-option v-for="item in mixStatusOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <label>任务状态：</label>
      <el-select v-model="value2" style="width: 150px" size="small" placeholder="请选择" multiple collapse-tags @change="stateChange">
        <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <label>员工姓名：</label>
      <el-input v-model="nameOrCode" size="small" style="width: 150px" @change="nameSearch" />
      <!-- <el-button size="small" @click="dialogFormVisible = true">
        <svg-icon icon-class="peoples" />资源池管理
      </el-button>-->
      <!-- <el-button size="small" @click="openBaseData">基础数据</el-button> -->
      <!-- <el-button class="item-btn" size="small" type="success" @click="openStandard">派工作业标准</el-button> -->
      <!-- <el-button class="item-btn" size="small" type="success" @click="openRule">自动派工规则</el-button> -->
      <el-button v-if="stopstaus === '0'" class="item-btn" size="small" type="success" @click="autoAllotTask">开始自动派工</el-button>
      <el-button v-else class="item-btn" size="small" type="success" @click="stopAllotTask">停止自动派工</el-button>
      <el-button class="item-btn" size="small" type="success" @click="opentask">任务列表</el-button>
      <el-button class="item-btn" size="small" type="success" @click="showdialogFormake('ruleForm')">新建临时任务</el-button>
      <el-button class="item-btn" size="small" type="success" @click="automaticTask">生成任务</el-button>
      <el-button class="item-btn" size="small" type="success" @click="cancelAssignAll">取消已派任务</el-button>
      <el-button v-if="businessDomainId == 1" class="item-btn" size="small" type="success" @click="boardingFcn">登机口视角</el-button>
      <el-button class="item-btn" size="small" type="success" @click="taskGenerateTest">任务生成测试</el-button>
      <span class="textips">
        当日在岗人数 :
        <ins>{{ datasB.length !== 0 ? datasB.length : 0 }}</ins
        >， 航班数 : <ins>{{ getStat.flightNum }}</ins
        >， 总任务数 : <ins class="warn-style" @click="allTask">{{ getStat.totalTaskNum }}</ins
        >， 自动派工率 : <ins>{{ getStat.automaticAssignmentRate }}</ins
        >， 工时利用率 : <ins>{{ getStat.percentage }}-</ins>， <span style="display: inline-block; width: 10px; height: 10px; background: #3a8ee6; margin-right: 3px" />未分配 : <ins>{{ getStat.unassignedNum }}</ins
        >，
        <!-- 待分配 :#255e9a
        <ins>{{ getStat.unassignedNum }}</ins>，-->
        <span style="display: inline-block; width: 10px; height: 10px; background: #1156f0; margin-right: 3px" />已分配 : <ins>{{ getStat.assignedNum }}</ins
        >，
        <!-- 已分配 :#255d9a
        <ins>{{ getStat.unreceivedNum }}</ins>，-->
        <span style="display: inline-block; width: 10px; height: 10px; background: rgb(103, 194, 58) 50%; margin-right: 3px" />已开始 : <ins>{{ getStat.startedNum }}</ins
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
        <pane size="50" style="margin-bottom: 1px">
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
                  :employeeId="data.code"
                  class="gantt-block-item"
                  :style="{ left: getPositonOffset(itemin.planInPlace) + 'px', width: getWidthAbout2Times(itemin.planInPlace, itemin.planEnd, { scale, cellWidth }) + 'px' }"
                  :left="getPositonOffset(itemin.planInPlace)"
                  @mouseenter="changeActive($event, itemin)"
                  @mouseleave="changeLeave($event)"
                  @dragstart="dragstart($event, itemin)"
                >
                  <Test :data="data" :cell-height="cellHeight" class="iii" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itemin" :status-list="statusList" @changeStatus="changeStatus" />
                  <!-- <span v-if="canceltaskshow && itemin.taskState==2" class="canceltask" @click="canceltask(itemin)">
                <i class="el-icon-error" />
                  </span>-->
                  <!-- 未改，做个记号 -->
                  <div
                    class="windowTime"
                    :style="{ left: getPositonOffset(itemin.windowStartTime) - getPositonOffset(itemin.planInPlace) + 'px', width: getWidthAbout2Times(itemin.windowStartTime, itemin.windowEndTime, { scale, cellWidth }) + 'px' }"
                  />
                  <div
                    v-if="itemin.taskState === 4 || itemin.taskState === 7"
                    class="actualTime"
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
              <TestLeft :data="data" @updateChange="updateChange" />
            </template>
            <template v-slot:title>
              <div class="gantt-header-title-left">
                <label style="font-size: 12px; margin-left: 0px">任务类型：</label>
                <el-select v-model="bustyle" style="width: 106px" size="small" placeholder="请选择" @change="changeBus">
                  <el-option v-for="item in groupstyle" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
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
                class="gantt-block-item"
                :employeeId="1"
                :h="item2.tasks.length"
                :style="{ left: getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(item2.start, item2.end, { scale, cellWidth }) + 'px', top: '8px' }"
              >
                <div style="position: relative">
                  <div
                    v-for="(itm, index2) in item2.tasks"
                    :key="index2"
                    :employeeId="1"
                    class="gantt-block-item"
                    :style="{ left: getPositonOffset(itm.planInPlace) - getPositonOffset(item2.start) + 'px', width: getWidthAbout2Times(itm.planInPlace, itm.planEnd, { scale, cellWidth }) + 'px', 'margin-top': index2 * 22 + 'px' }"
                    @dragstart="dragstart($event, itm)"
                  >
                    <Test :data="data" :cell-height="cellHeight2" :update-time-lines="updateTimeLines" :current-time="currentTime" :item="itm" :status-list="statusList" @changeStatus="changeStatus" />
                  </div>
                </div>
              </div>
            </template>
            <!-- <template v-slot:left="{data2}">
          <LeftBtm :data="data2" />
            </template>-->
          </v-gantt-chart>
        </pane>
      </splitpanes>
    </div>
    <!-- 开始自动派工dialog -->
    <el-dialog v-dialogDrag :title="autoTitle" :visible.sync="autoDialogVisible" width="60%" height="500px">
      <div style="height: 400px">
        <!-- <el-button type="primary" size="small" style="float: right;margin-bottom:10px" @click="addServer">添加服务</el-button> -->
        <el-table :data="autoTableData" :max-height="400">
          <el-table-column prop="workTypeName" label="工作类型">
            <template slot-scope="scope">
              {{ scope.row.workTypeName }}
              <span class="detail-jump" @click="detailJump(scope.row)">详情</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskTypeName" label="任务类型" />
          <el-table-column label="服务操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.generateStatus === 0" size="small" type="primary" @click="startAutoTask(scope.row.taskTypeId, scope.$index)">开启生成任务</el-button>
              <el-button v-else size="small" type="primary" @click="stopAutoTask(scope.row.taskTypeId, scope.$index)">停止生成任务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

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
          任务开始前(分钟)
          <el-input v-model="formEdit.beforeTime" size="small" style="width: 150px" />
        </el-form-item>
        <el-form-item prop="beginTime" label="自动派工开始时间">
          <el-time-picker v-model="formEdit.beginTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="自动派工结束时间">
          <el-time-picker v-model="formEdit.endTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间" />
          <!-- <el-select v-model="formEdit.whichDay" size="small" style="width:60px" @change="flightTypevaule">
            <el-option v-for="item in whichDayOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>-->
        </el-form-item>
        <!-- <el-form-item prop="timeInterval" label="派工间隔(分钟)">
          <el-input v-model="formEdit.timeInterval" size="small" style="width: 60%" />
        </el-form-item> -->
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
          任务开始前(分钟)
          <el-input v-model="formEdit.alarmTime" size="small" style="width: 150px" />&nbsp;&nbsp;
        </el-form-item>
        <!-- <el-form-item prop="refreshTime" label="刷新时间(秒)">
          <el-input v-model="formEdit.refreshTime" size="small" style="width: 60%" />
        </el-form-item> -->
        <el-form-item>
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
            页面刷新时间(秒)
            <el-tooltip class="item" effect="dark" content="注意：单位是秒，不是分钟" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.refreshTime" size="small" style="width: 60%" />
        </el-form-item>
        <!-- <el-form-item prop="tp" label="预派工窗口时间(分钟)">
          <el-input v-model="formEdit.tp" size="small" style="width: 60%" />
        </el-form-item> -->
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
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
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
        <el-form-item v-if="businessDomainId == 111">
          <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
            最大任务数
            <el-tooltip class="item" effect="dark" content="一个人能同时监控的最大任务数" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model.number="formEdit.taskCountMax" size="small" style="width: 60%" />
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
        <el-form-item label="国际国内" prop="regionType">
          <el-select v-model="ruleForm.regionType" placeholder="请选择">
            <el-option v-for="(item, i) in intlFlagoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="ruleForm.taskType" size="small" placeholder="请选择">
            <el-option v-for="item in taskTypeOptions" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工技能" prop="skillId">
          <el-select v-model="ruleForm.skillId" placeholder="请选择" @visible-change="skillOptionsGet">
            <el-option v-for="(item, i) in skillOptions" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进出港" prop="flightType">
          <el-select v-model="ruleForm.flightType" placeholder="请选择" @change="flightTypevaule">
            <el-option v-for="(item, i) in flightTypeoption" :key="i" :label="item.value" :value="item.id">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="ruleForm.taskName" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStart">
          <el-time-picker v-model="ruleForm.planStart" :arrow-control="arrowControl" format="HH:mm" value-format="HH:mm" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEnd">
          <el-time-picker v-model="ruleForm.planEnd" :arrow-control="arrowControl" format="HH:mm" value-format="HH:mm" placeholder="选择时间" @change="endChange" />
          <span v-show="crossDay">+1</span>
        </el-form-item>
        <el-form-item label="任务开始位置" prop="startPosition">
          <el-select v-model="ruleForm.startPosition">
            <el-option v-for="item in apronList" :key="item.apronId" :label="item.apronName" :value="item.apronId" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务结束位置" prop="endPosition">
          <el-select v-model="ruleForm.endPosition">
            <el-option v-for="item in apronList" :key="item.apronId" :label="item.apronName" :value="item.apronId" />
          </el-select>
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
import { searchTaskStatus, skillByTask } from '@/apiNew/vehicle'
import { cancelAssignAllTask, canceltask, getJiweiByKeyWord, getDengjikouByKeyWord, getJiPingByKeyWord } from '@/api/busRules'
import { skill } from '@/api/skill'
import { find, findposititon } from '@/api/apron'
import {
  testTaskUrl, // 任务生成测试
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
  getJobState,
  updateTask,
  taskType,
  searchService,
  autoAllotTasks,
  stopAllotTasks,
  getWorkTypeId,
  searchMixData
} from '@/apiNew/specialVehicle'
const scaleList = `10,15,30,60`.split(',').map((n) => parseInt(n))
export default {
  name: 'App2',
  components: { Test, TestLeft, LeftBtm, Splitpanes, Pane },
  data() {
    return {
      airport: this.$store.state.user.airport,
      clear: false,
      crossDay: false,
      testForm: { flightNo: '', beginDate: '', endDate: '' },
      testTaskVisible: false,
      arrowControl: true,
      addOrUpdate: 0, // 0代表未查询到数据，走新增接口；1代表已有数据，走修改接口
      mixStatus: '',
      mixStatusOptions: [],
      statusList: [],
      refreshCount: 0,
      datasBCopy: [],
      nameOrCode: '',
      skillOptions: [],
      isArrow: true,
      startPositionOptions: [],
      staticDistance: null,
      workTypeIdArray: [],
      stopstaus: '',
      positionList: [],
      apronList: [],
      flightNoOptions: [],
      businessDomainId: this.$route.query.businessDomainId,
      autoTitle: '派工任务生成服务',
      autoDialogVisible: false,
      autoTableData: [
        { taskName: '特车', workTypeId: 2, workType: '特车', jobState: 0 },
        { taskName: '污水车', workTypeId: 2, workType: '污水车', jobState: 0 }
      ],
      formAddServer: {},
      isShuttlesOptions: [
        { label: '摆渡车', id: '1' },
        { label: '非摆渡车', id: '0' }
      ],
      workTypeOptions: [
        { label: '特车', id: '0' },
        { label: '摆渡车', id: '1' }
      ],
      drawer: false,
      // stopstaus: '',
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
      // date: '2020-02-26', // 选择日期
      // currentTime: dayjs().subtract(dayjs().diff(dayjs('2020-02-26'), 'day'), 'day'),
      // startTime: '2020-02-26 04:00',
      // endTime: '2020-02-28',
      date: this.$route.query.data ? this.$route.query.data : this.getNowFormatDate(), // 选择日期
      currentTime: dayjs(),
      startTime: this.$route.query.data ? dayjs(this.$route.query.data).subtract(2, 'hour').toString() : dayjs(this.getNowFormatDate()).subtract(24, 'hour').toString(),
      endTime: this.$route.query.data ? dayjs(this.$route.query.data).add(1, 'day').add(2, 'hour').toString() : dayjs(this.getNowFormatDate()).add(24, 'hour').add(24, 'hour').toString(),
      bustyle: '全部', // 摆渡车类型
      bustyleId: '',
      // bustyleId: this.$route.query.skillId ? this.$route.query.skillId : '',
      groupstyle: [],
      taskTypeOptions: [],
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
      dataKey: 'index',
      scaleList: scaleList,
      scrollToTimeB: dayjs().subtract(10, 'hour').toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideHeader2: true,
      arrayKeys: ['gtArray', 'error'],
      positionB: { x: this.$route.query.data ? localStorage.scrollx - 600 : 6500, Y: 10000 },
      positionA: { x: this.$route.query.data ? localStorage.scrollx - 600 : 6500, Y: 1000 },
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
        planStart: [{ required: true, message: '请选择计划开始时间', trigger: 'blur' }],
        skillId: [{ required: true, message: '请选择员工技能', trigger: 'change' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        planEnd: [{ required: true, message: '请选择计划结束时间', trigger: 'change' }]
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
        this.getTaskState() // 查询状态
        this.taskTypeList()
        this.getWorkTypeIds()
        this.searchAllStatus1()
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
    this.getTaskState() // 查询状态
    this.taskTypeList()
    this.getWorkTypeIds()
    this.searchAllStatus1()
    // if (this.businessDomainId === 1 || this.businessDomainId === 102) {
    //   this.searchMixStatus()
    // } else {
    this.init()
    // }
  },
  mounted: function () {
    console.log(this.$children, 110)
    this.$nextTick(() => {
      this.positionB = { x: getPositonOffset(dayjs().format('YYYY-MM-DD HH:mm:ss'), this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: 0 }
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
  methods: {
    updateChange() {
      // 修改员工时间后刷新
      this.assignedTask()
    },
    endChange() {
      const flag = this.checkdate(this.ruleForm.planStart, this.ruleForm.planEnd)
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
      if (date.setHours(Number(a[0]), Number(a[1])) < date.setHours(Number(b[0]), Number(b[1]))) {
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
    // 派工展示下拉数据
    searchMixStatus() {
      searchMixData({ businessDomainId: this.businessDomainId, airportId: this.airport.airportId })
        .then((response) => {
          this.mixStatusOptions = response.data.data
          this.mixStatus = response.data.data[0].id
          this.init()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message || '500，服务器错误'
          })
        })
    },
    // 查询所有任务状态
    searchAllStatus1() {
      searchTaskStatus({ airportId: this.airport.airportId }).then((response) => {
        this.statusList = response.data.data
      })
    },
    // 任务状态修改后刷新页面
    changeStatus() {
      this.init()
    },
    getWorkTypeIds() {
      getWorkTypeId({ businessDomainId: this.businessDomainId, airportId: this.airport.airportId }).then((response) => {
        response.data.data.forEach((element) => {
          this.workTypeIdArray.push(element.id)
        })
      })
    },
    autoAllotTask() {
      // alert('kaishipaigong')
      const data = {
        airportId: this.airport.airportId
      }
      autoAllotTasks(data)
        .then((response) => {
          this.stopstaus = '1'
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    stopAllotTask() {
      // alert('tingzhipaigong')
      const data = {
        airportId: this.airport.airportId
      }
      stopAllotTasks(data)
        .then((response) => {
          this.stopstaus = '0'
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    taskTypeList() {
      taskType({ businessDomainId: this.businessDomainId, airportId: this.airport.airportId }).then((response) => {
        this.groupstyle.push({ id: '', name: '全部' })
        response.data.data.forEach((element) => {
          this.groupstyle.push(element)
          this.taskTypeOptions.push(element)
        })
      })
    },
    detailJump(row) {
      this.$router.push({ path: '/dispatching/serviceStandard/serviceStandard', query: { id: row.dispatchId, workTypeId: row.workTypeId } })
    },
    startAutoTask(id, index) {
      var data = {
        taskTypeId: id,
        state: 1,
        airportId: this.airport.airportId
      }
      updateTask(data).then((response) => {
        this.init()
        this.automaticTaskUrl()
      })
    },
    stopAutoTask(id, index) {
      // alert('停止生成任务')
      var data = {
        taskTypeId: id,
        state: 0,
        airportId: this.airport.airportId
      }
      updateTask(data).then((response) => {
        this.init()
        this.automaticTaskUrl()
      })
    },
    // 开始自动派工按钮
    automaticTask() {
      this.autoDialogVisible = true
      this.automaticTaskUrl()
    },
    automaticTaskUrl() {
      var data = {
        ids: this.workTypeIdArray.join(','),
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      searchService(data).then((response) => {
        this.autoTableData = response.data.data
      })
    },
    stateChange(e) {
      // this.value2 = e
      this.init()
      // this.assignedTask()
      // this.unassignedTask()
    },
    nameSearch(val) {
      // alert(666)
      this.nameOrCode = val
      this.init()
    },
    init() {
      // clearInterval(this.timer)
      this.assignedTask()
      this.unassignedTask()
      this.getStatistics()
      // this.timer = setInterval(this.init(), 20000)
    },
    getTaskState() {
      // 停止
      getJobState({ airportId: this.airport.airportId }).then((response) => {
        // if (response.code === '200') {
        this.stopstaus = response.data.data
        // }
      })
    },
    cancelAssignAll() {
      // 取消已派任务
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        airportId: this.airport.airportId
      }
      this.$confirm('确认取消所有已分配任务吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          cancelAssignAllTask(data).then((response) => {
            this.init()
          })
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getStatistics() {
      // 统计数据
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        businessDomainId: this.businessDomainId,
        mixStatus: this.mixStatus,
        airportId: this.airport.airportId
      }
      getStatistics(data).then((response) => {
        this.getStat = response.data.data
      })
    },
    changeData(e) {
      // 切换日期
      this.refreshCount = 0
      this.startTime = dayjs(e).subtract(5, 'hour').toString()
      this.endTime = dayjs(e).add(2, 'day').add(2, 'hour').toString()
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
    boardingFcn() {
      var data = ''
      if (this.bustyleId) {
        data = this.bustyleId
      } else {
        data = []
        this.groupstyle.forEach((item) => {
          if (item.id) {
            data.push(item.id)
          }
        })
      }
      // console.log(data)
      this.$router.push({ path: '/dispatching/checkIn/boarding', query: { deskPredictions: data, businessDomainId: this.businessDomainId, date: this.date } })
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
      canceltask(item.id).then((response) => {
        clearInterval(this.timer)
        this.assignedTask()
      })
    },
    openRule() {
      this.$router.push({ path: '' })
      // // 规则弹框
      // this.editSkillVisible = true
      // const data = {
      //   businessDomainId: this.businessDomainId || 0,
      //   airportId: this.airport.airportId
      // }
      // getBusParam(data).then((response) => {
      //   // console.log(response, 3232)
      //   if (!response.data.data) {
      //     this.addOrUpdate = 0
      //   } else {
      //     this.addOrUpdate = 1
      //     response.data.data.beginTime = this.calTime(response.data.data.beginTime)
      //     response.data.data.endTime = this.calTime(response.data.data.endTime)
      //     response.data.data.whichDay = 0
      //     this.formEdit = response.data.data
      //   }
      // })
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
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { businessDomainId: this.businessDomainId, taskStatus: taskStatus } })
      window.open(routeData.href, '_blank')
    },
    // 总任务数跳转至任务列表
    allTask() {
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { businessDomainId: this.businessDomainId } })
      window.open(routeData.href, '_blank')
    },
    opentask() {
      // 任务视图
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { businessDomainId: this.businessDomainId, date: this.date } })
      window.open(routeData.href, '_blank')
    },
    openStandard() {
      // 派工标准
      this.$router.push({ path: '/dispatching/standardNew', query: { businessDomainId: this.businessDomainId } })
    },
    // handleEditClick() {
    //   // 规则弹框确定
    //   // console.log(this.formEdit, 6688)
    //   var beginTimes = this.formEdit.beginTime.split(':')
    //   var endTimes = this.formEdit.endTime.split(':')
    //   var beginMin = Number(beginTimes[0]) * 60 + Number(beginTimes[1])
    //   var endMin = Number(endTimes[0]) * 60 + Number(endTimes[1])
    //   if (this.formEdit.whichDay === 1) {
    //     endMin += 1440
    //   } else if (this.formEdit.whichDay === 2) {
    //     endMin += 2880
    //   }
    //   this.formEdit.beginTime = beginMin
    //   this.formEdit.endTime = endMin
    //   this.formEdit.businessDomainId = this.businessDomainId
    //   this.formEdit.airportId = this.airport.airportId
    //   if (this.addOrUpdate === 0) {
    //     addBusParam(this.formEdit).then((response) => {
    //       this.editSkillVisible = false
    //       this.$message.success('修改成功')
    //     })
    //   } else {
    //     updateBusParam(this.formEdit).then((response) => {
    //       this.editSkillVisible = false
    //       this.$message.success('修改成功')
    //     })
    //   }
    // },
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
        nameOrCode: this.nameOrCode,
        taskDate: this.date,
        state: this.state,
        businessDomainId: this.businessDomainId,
        mixStatus: this.mixStatus,
        airportId: this.airport.airportId
      }
      list(data).then((response) => {
        this.datasB = []
        this.loading = false
        if (response.data.data.length === 0) {
          this.$message.success('暂无已分配数据')
          this.positionB = { x: 6500, Y: 10000 }
        }
        if (response.data) {
          // 初始化页面时滚动条位置
          if (this.refreshCount === 0) {
            let taskArray = []
            const beforeCurrent = []
            const afterCurrent = []
            const selectedCurrent = []
            const time = new Date()
            const hour = time.getHours()
            const minute = time.getMinutes()
            const second = time.getUTCSeconds()
            const currentTime = new Date(this.date + ' ' + `${hour}:${minute}:${second}`).getTime()
            const currentTime0 = new Date(this.date + ' ' + `00:00:00`).getTime()
            const currentTime24 = new Date(this.date + ' ' + `23:59:59`).getTime()
            response.data.data.forEach((item) => {
              taskArray = taskArray.concat(item.tasks)
            })
            taskArray.forEach((item) => {
              if (new Date(item.planInPlace).getTime() < currentTime0 && new Date(item.planEnd).getTime() >= currentTime0) {
                selectedCurrent.push(item)
              } else if (new Date(item.planInPlace).getTime() > currentTime0 && new Date(item.planEnd).getTime() <= currentTime24) {
                selectedCurrent.push(item)
              } else if (new Date(item.planInPlace).getTime() < currentTime24 && new Date(item.planEnd).getTime() > currentTime24) {
                selectedCurrent.push(item)
              }
              if (new Date(item.planInPlace).getTime() > currentTime) {
                afterCurrent.push(item)
              } else {
                beforeCurrent.push(item)
              }
            })
            let minItem = {}
            let min = null
            let personRow = null
            if (selectedCurrent.length) {
              // 如果所选择日期有任务保证定位到所选择日期那天
              min = Math.abs(new Date(selectedCurrent[0].planInPlace).getTime() - currentTime)
              for (let i = 0; i < selectedCurrent.length; i++) {
                const cur = Math.abs(new Date(selectedCurrent[i].planInPlace).getTime() - currentTime)
                if (cur < min) {
                  min = cur
                  minItem = selectedCurrent[i]
                }
              }
            } else if (beforeCurrent.length) {
              // 所选日期无任务定位到前一天最近的那个任务
              min = new Date(beforeCurrent[0].planInPlace).getTime() - currentTime
              for (let i = 0; i < beforeCurrent.length; i++) {
                const cur = new Date(beforeCurrent[i].planInPlace).getTime() - currentTime
                if (cur > min) {
                  min = cur
                  minItem = beforeCurrent[i]
                }
                // else {
                //   minItem = beforeCurrent[0]
                // }
              }
            } else if (afterCurrent.length) {
              // 所选日期无任务定位到后一天最近的那个任务
              min = new Date(afterCurrent[0].planInPlace).getTime() - currentTime
              for (let i = 0; i < afterCurrent.length; i++) {
                const cur = new Date(afterCurrent[i].planInPlace).getTime()
                if (cur - currentTime < min) {
                  min = cur
                  minItem = afterCurrent[i]
                }
                // else {
                //   minItem = afterCurrent[0]
                // }
              }
            }
            // console.log(beforeCurrent, 555)
            // console.log(minItem, 666)
            response.data.data.forEach((item, index) => {
              if (item.code === minItem.code) {
                personRow = index
              }
            })
            this.positionB = { x: getPositonOffset(minItem.planInPlace, this.startTime, { scale: this.scale, cellWidth: this.cellWidth }) - 100, y: personRow * 35 }
          } else {
            this.scrollLeftA()
          }
          this.refreshCount = 1
          this.datasB = response.data.data
          response.data.data.forEach((element) => {
            element.tasks = { 1: element.tasks }
            this.loading = false
            // if (element.tasks.length === 0) {
            //   element.tasks = { 1: [] }
            // }
          })
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
      // this.positionB = { x: this.staticDistance + 6500 }
      this.staticDistance = dayjs().subtract(2, 'hour').toString()
      // var deptTime = new Date().getHours()
      // this.startTime = dayjs()
      //   .subtract(deptTime, 'hour')
      //   .toString()
      var data = {
        skillId: this.bustyleId,
        taskDate: this.date,
        state: this.state,
        businessDomainId: this.businessDomainId,
        mixStatus: this.mixStatus,
        airportId: this.airport.airportId
      }
      // this.loading = true
      getFeriyBusTask(data).then((response) => {
        this.datasA = []
        var _this = this
        if (response.data.data.length === 0) {
          this.$message.success('暂无未分配数据')
        }
        response.data.data.forEach(function (cur) {
          var gtArray = []
          _this.datasA.push({
            gtArray: gtArray
          })
          // console.log(cur, 6655)
          cur.forEach((element) => {
            gtArray.push({
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
    scaleChange() {
      this.assignedTask()
      this.unassignedTask()
    },
    scrollLeftA(val) {
      this.positionB = { x: val }
      // this.staticDistance = val
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
      this.taskId = item.id
      this.dropEmployeeId = item.code
      this.dropTaskState = item.taskState
      this.employeeSearch(item.id, item.code, item.planInPlace, item.planEnd, item.skillId)
    },
    employeeSearch(taskId, employeeCode, startTime, endTime, skillId) {
      if (!employeeCode) {
        // this.datasB = []
        // this.$message('正在寻找该时段有空的员工……')
        const taskStartTime = new Date(startTime).getTime()
        const taskEndTime = new Date(endTime).getTime()
        var a = []
        // debugger
        for (let i = 0; i < this.datasBCopy.length; i++) {
          let flag = true
          let employeeStartTime = null
          let employeeEndTime = null
          const skillFlag = this.datasBCopy[i].skills.filter((item) => {
            // debugger
            return item.id === skillId
          })
          if (skillFlag.length !== 0) {
            const workTimeEmployee = this.datasBCopy[i].workTimeVOS
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
      // console.log(this.datasB, a, 123456)
    },
    onDrop(event) {
      var data = {}
      // console.log(event.target.getAttribute('employeeId'), 10)
      if (event.target.getAttribute('employeeId') === '1' || !event.target.getAttribute('employeeId')) {
        // console.log(667)
        data = {
          taskId: this.taskId,
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
                      message: '取消分配成功'
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
            // console.log(e.response)
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else {
        data = {
          employeeId: event.target.getAttribute('employeeid') || event.target.childNodes[0].getAttribute('employeeid') || '',
          // skillId: event.target.getAttribute('skillId') || event.target.childNodes[0].getAttribute('skillId'),
          taskId: this.taskId,
          airportId: this.airport.airportId
          // taskDate: this.date
        }
        // console.log(event.target, 666)
        allotTasks(data)
          .then((response) => {
            // 任务分配
            if (response.data.data.code === 1) {
              this.$message.success('分配成功')
              this.init()
              localStorage.setItem('name', this.taskId)
            } else if (response.data.data.code === 2) {
              this.$confirm(response.data.data.message, {
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
            this.$message({
              type: 'error',
              message: error.response.data.message
            })
          })
      }
    },
    dragend(event) {},
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/busRules' })
    },
    flightTypevaule(e) {
      // 进出港选择
      this.inoutype = e
    },
    handleSelect(item) {
      this.apronCode = item.apronCode
    },
    skillOptionsGet() {
      skillByTask({ taskTypeId: this.ruleForm.taskType || '' }).then((response) => {
        this.skillOptions = response.data.data
      })
    },
    showdialogFormake(form) {
      // 生成任务
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      const data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
      addTemporaryTaskData({ flightNo: '', date: this.date, airportId: this.airport.airportId }).then((response) => {
        this.flightNoOptions = response.data.data
      })
      find(data).then((response) => {
        this.apronList = response.data
      })
      findposititon(data).then((response) => {
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
          this.ruleForm.taskDate = this.date
          // this.ruleForm.deptApron = this.apronCode
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
}

.splitpanes__splitter {
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
/* #app2 /deep/ .splitpanes__splitter {
  background-color: #333e5f;
} */
#app2 /deep/ .gantt-leftbar-defalutItem {
  display: none;
}
#app2 /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
#app2 /deep/ td,
tr,
th {
  text-align: left;
}
#app2 /deep/ .cell {
  text-align: left;
  padding-left: 10px;
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
.detail-jump {
  display: inline-block;
  margin-left: 10px;
  color: #2b74c0;
}
.detail-jump:hover {
  text-decoration: underline;
  cursor: pointer;
}
.warn-style {
  cursor: pointer;
}
</style>
