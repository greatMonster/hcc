<template>
  <div v-if="item.name" :class="{ target: item.id == id }">
    <el-popover placement="bottom" trigger="hover">
      <!-- <div slot="reference" class="plan" :style="{'background':statusColor,'box-shadow':statusColor2}" draggable="true"> -->
      <div slot="reference" class="plan" :style="{ background: statusColor }" draggable="true">
        <div class="middle">
          <span :title="item.name">
            <span v-if="item.taskRunningState === 2" style="color: yellow">！</span>
            <span v-if="item.taskState === 8" style="color: #67c13a">
              <i class="el-icon-lock" />
            </span>
            <span v-if="item.taskState === 9" style="color: #67c13a">
              <i class="el-icon-lock" />
            </span>
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="detail">
        <span class="header">{{ item.name }}</span>
        <ul>
          <li v-if="item.alarmType">
            <span>告警原因：</span>
            <span>{{ item.alarmType }}</span>
          </li>
          <li>
            <span>任务预计开始时间：</span>
            <span v-if="item.planInPlace">{{ item.planInPlace }}</span>
            <span v-else>{{ item.start }}</span>
          </li>
          <li>
            <span>任务预计结束时间：</span>
            <span v-if="item.planEnd">{{ item.planEnd }}</span>
            <span v-else>{{ item.end }}</span>
          </li>
          <li>
            <span>任务实际开始时间：</span>
            <span v-if="item.actualInPlace">{{ item.actualInPlace }}</span>
          </li>
          <li>
            <span>任务实际结束时间：</span>
            <span v-if="item.actualEnd">{{ item.actualEnd }}</span>
          </li>
          <li>
            <span>机坪：</span>
            <span v-if="item.apron">{{ item.apron }}</span>
            <span v-else> - </span>
          </li>
          <li>
            <span>机位：</span>
            <span v-if="item.position">{{ item.position }}</span>
            <span v-else> - </span>
          </li>
          <li>
            <span>对应技能：</span>
            <span>{{ item.skillName ? item.skillName : '无' }}</span>
          </li>
          <li>
            <span>当前值班人：</span>
            <span>{{ item.employeeName ? item.employeeName : '无' }}</span>
          </li>
        </ul>
        <p style="text-align: right">
          <el-button size="mini" @click="taskSplit(item)">任务拆分</el-button>
          <el-button size="mini" @click="mobileTest(item)">修改状态</el-button>
          <el-button size="mini" @click="targetDetail(item)">任务详情</el-button>
          <el-button size="mini" @click="flightPlan(item)">任务列表</el-button>
        </p>
      </div>
    </el-popover>
    <!-- 任务拆分 -->
    <el-dialog v-dialogDrag title="任务拆分" :visible.sync="splitFormVisible" width="60%" height="500px">
      <el-form ref="formSplit" :model="formSplit" label-width="120px">
        <el-form-item prop="splitTime" label="拆分时间">
          <!-- <el-time-picker
            v-model="formSplit.splitTime"
            :arrow-control="arrowControl"
            type="datetime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间"
            :picker-options="{
              selectableRange: timeRange,
            }"
          /> -->
          <el-time-select v-model="formSplit.splitTime" placeholder="起始时间" :picker-options="{ start: time1, step: '00:01', end: time2 }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="splitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSplitClick()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog v-dialogDrag title="修改状态" :visible.sync="autoDialogVisible" width="60%" height="500px">
      <el-form ref="formAddServer" :model="formAddServer" label-width="120px">
        <el-form-item prop="id" label="任务id">
          <el-input v-model="formAddServer.id" size="small" style="width: 150px" disabled />
        </el-form-item>
        <el-form-item prop="state" label="任务状态">
          <el-select v-model="formAddServer.state">
            <el-option v-for="(itemin, i) in statusList" :key="i" :label="itemin.name" :value="itemin.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="beginTime" label="调整开始时间">
          <el-time-picker v-model="formAddServer.beginTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="调整结束时间">
          <el-time-picker v-model="formAddServer.endTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="autoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddServerClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { testUrlSpecial } from '@/apiNew/specialVehicle'
import { searchTaskStatus } from '@/apiNew/vehicle'
import { split, updateTaskStatus } from '@/api/checkInData'
const NOW_PLAN = 'rgb(67, 162, 43)'
const FUTHER_PLAN = '#1156f0'
const PAST_PLAN = '#a4abc0'
const NOW_PLAN2 = 'rgb(5, 127, 5) 9px 15px 33px -8px inset, rgb(156, 232, 145) 0px 1px 0px, rgb(6, 80, 39) 0px 0px 0px'
const FUTHER_PLAN2 = 'rgb(10, 54, 234) 9px 15px 33px -8px inset, rgb(101, 126, 232) 0px 1px 0px, rgb(35, 54, 165) 0px 0px 0px'
const PAST_PLAN2 = 'rgb(129, 138, 167) 0px 1px 10px 1px inset, rgb(167, 167, 167) 0px 1px 0px, rgb(62, 70, 96) 0px 0px 0px'
// const warning = 'red'
const weiFeiPei = '#3a8ee6' // 未分配
const unconfirm = '#ff3399' // 已超时
const hasStarted = 'rgb(103, 194, 58)' // 已开始
// const hasconfirm = '#66ffff'
const hasCanceled = '#99004d' // 已取消
export default {
  name: 'Test',
  filters: {
    joinDate2: function (value) {
      switch (value) {
        case 'I':
          value = '国际'
          break
        case 'D':
          value = '国内'
          break
        case 'I/D':
          value = '国际/国内'
          break

        default:
          break
      }
      return value
    },
    joinDate: function (value) {
      if (value) {
        value = value.substring(11, 16)
      }
      return value
    }
  },
  props: {
    data: Object,
    item: Object,
    currentTime: dayjs,
    updateTimeLines: Function,
    cellHeight: Number,
    startTimeOfRenderArea: Number,
    statusList: Array
  },
  data() {
    return {
      arrowControl: true,
      timeRange: '18:30:00 - 20:30:00',
      time1: '',
      time2: '',
      arrowControl: true,
      startTime: '',
      endTime: '',
      formSplit: {},
      splitFormVisible: false,
      autoDialogVisible: false,
      formAddServer: {},
      businessDomainId: this.$route.query.businessDomainId || '',
      workTypeOptions: [
        { id: 3, label: '已接收' },
        { id: 4, label: '已完成' },
        { id: 5, label: '已取消' },
        { id: 7, label: '已开始' }
      ],
      id: this.$route.query.id,
      dayjs: dayjs,
      scrollxthis: ''
    }
  },
  computed: {
    statusColor() {
      const { item, currentTime } = this
      const start = dayjs(item.planInPlace)
      const end = dayjs(item.planEnd)
      // if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
      //   return NOW_PLAN // NOW
      // } else if (end.isBefore(currentTime)) {
      //   return PAST_PLAN // PAST
      // } else {
      //   return FUTHER_PLAN // Future
      // }
      switch (item.taskState) {
        case 3:
          return NOW_PLAN // NOW 已接收
          break
        case 4:
          return PAST_PLAN // PAST 已完成
          break
        case 2:
          return FUTHER_PLAN // Future 已分配未接收
          break
        case 1:
          return weiFeiPei // 未分配
          break
        case 6:
          return unconfirm // 已超时
          break
        case 7:
          return hasStarted
          break
        case 5:
          return hasCanceled // 已取消
          break
        case 8:
        case 9:
          return 'black' // 已取消
          break
      }
    },
    statusColor2() {
      const { item, currentTime } = this
      const start = dayjs(item.planInPlace)
      const end = dayjs(item.planEnd)
      // if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
      //   return NOW_PLAN2 // NOW
      // } else if (end.isBefore(currentTime)) {
      //   return PAST_PLAN2 // PAST
      // } else {
      //   return FUTHER_PLAN2 // Future
      // }
      switch (item.taskState) {
        case 3:
          return NOW_PLAN2 // NOW 已接收
          break
        case 4:
          return PAST_PLAN2 // PAST 已完成
          break
        case 2:
          return FUTHER_PLAN2 // Future 已分配未接收
          break
        case 1:
          return weiFeiPei // 未分配
          break
        case 6:
          return unconfirm // 已超时
          break
        case 7:
          return hasStarted
          break
        case 5:
          return hasCanceled // 已取消
          break
      }
    },
    startToString() {
      return dayjs(this.item.start).format('HH:mm')
    },
    endToString() {
      return dayjs(this.item.end).format('HH:mm')
    }
  },
  created() {
    // console.log(this.statusList, 223)
    // 目标任务
    var target = document.querySelector('.target')
    // console.log(target, 2228887787)
    if (target) {
      var a = target.parentNode.parentNode.parentNode.style.left
      var b = a.substring(0, a.indexOf('px'))
      localStorage.setItem('scrollx', b)
      return
    }
  },
  methods: {
    // 任务拆分
    taskSplit(item) {
      this.formSplit.id = item.id
      this.formSplit.taskCategory = item.taskCategory
      const startTime = item.planInPlace.substring(10, 16)
      const endTime = item.planEnd.substring(10, 16)
      this.time1 = startTime
      this.time2 = endTime
      // this.timeRange = startTime + '-' + endTime
      this.splitFormVisible = true
    },
    handleSplitClick() {
      // const data = {
      //   id: item.taskId,
      //   splitTime: this.formSplit.splitTime,
      //   taskCategory: item.taskCategory
      // }
      // this.formSplit.splitTime = this.formSplit.splitTime.HH + ':' + this.formSplit.splitTime.mm
      split(this.formSplit)
        .then((response) => {
          this.$message.success('任务拆分成功')
          this.splitFormVisible = false
          this.$emit('changeStatus')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    mobileTest(item) {
      this.autoDialogVisible = true
      this.formAddServer.id = item.id
      this.formAddServer.taskCategory = item.taskCategory
      this.formAddServer.flag = 0
      this.formAddServer.taskDate = item.taskDate
    },
    handleAddServerClick() {
      updateTaskStatus(this.formAddServer)
        .then((response) => {
          // alert('修改任务成功')
          this.$message.success('状态修改成功')
          this.autoDialogVisible = false
          this.$emit('changeStatus')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    allowDrop(ev) {
      ev.preventDefault()
    },
    targetDetail(item) {
      // 点击详情
      // this.$router.push({ path: '/vehicle/specialVehicle/targetDetail', query: { flightLegId: item.id } })
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/targetDetail', query: { flightLegId: item.id } })
      window.open(routeData.href, '_blank')
    },
    flightPlan(item) {
      // 任务视图
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { id: item.id, businessDomainId: this.businessDomainId } })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.target {
  .middle {
    background: red;
  }
}
.tasksAccepted {
  color: #000;
  width: 16px;
  display: block;
  z-index: 2;
}
.middle {
  width: 100%;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-size: 12px;
  color: #fff;
  padding-top: 2px;
  // text-shadow: 0 0 2px #000;
  font-style: italic;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.runTime {
  display: flex;
  flex-direction: column;
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  // height: 44%;
  // border: 1px solid #f0f0f0;
  border-radius: 3px;
  color: #000;
  padding-left: 0 5px;
  font-size: 10px;
  // opacity: 0.8;
  cursor: pointer;
  // box-shadow: inset 0px 2px 16px #e9f3f9;
  // background-image: linear-gradient(top, #00B4DD 30%, #00B4DD 51%);
  // box-shadow: inset 0 1px 10px 1px #5c8bee, 0 1px 0 #1d2c4d, 0 6px 0 #1f3053, 0 8px 4px 1px #111111;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  width: 100%;
  top: 35%;
}

.detail {
  margin-top: 10px;
  .header {
    text-align: center;
    font-size: 1rem;
  }
}

.detail ul {
  list-style: none;
  padding: 0px;
  li {
    span {
      display: inline-block;
      // width: 80px;
      color: #fff;
      font-size: 0.8rem;
    }
    span:first-child {
      text-align: right;
    }
  }
}
</style>
