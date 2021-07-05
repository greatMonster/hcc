<template>
  <div v-if="item">
    <el-popover placement="bottom" trigger="hover">
      <!-- <div slot="reference" class="plan" :style="{background: typeof(item.modifyStatus)=='boolean'?item.modifyStatus?'#87a054':'#8400ff':'#847f7f'}" draggable="true"> -->
      <div slot="reference" class="plan" :style="{'background':statusColor}" draggable="true">
        <div class="middle">
          <span v-if="item.taskRunningState === 2" style="color: yellow;">！</span>
          <span v-if="item.taskStatusId === 8" style="color:#67c13a;">
            <i class="el-icon-lock" />
          </span>
          <span v-if="item.taskStatusId === 9" style="color:#67c13a">
            <i class="el-icon-lock" />
          </span>
          {{ item.deskName }} {{ item.deskCode }}柜台
        </div>
      </div>
      <div class="detail">
        <span class="header">{{ item.deskCode }}号柜台</span>
        <ul>
          <li v-if="item.alarmType">
            <span>告警原因：</span>
            <span>{{ item.alarmType }}</span>
          </li>
          <li>
            <span>任务开始时间：</span>
            <span v-if="item.startTime">{{ item.startTime | joinDate }}</span>
          </li>
          <li>
            <span>任务结束时间：</span>
            <span v-if="item.endTime">{{ item.endTime | joinDate }}</span>
          </li>
          <li>
            <span>对应技能：</span>
            <span v-if="item.skillName">{{ item.skillName || '无' }}</span>
          </li>
          <li>
            <span>当前值班人：</span>
            <span v-if="item.employeeName">{{ item.employeeName || '无' }}</span>
          </li>
        </ul>
        <p style="text-align:right;">
          <el-button size="mini" @click="taskSplit(item)">任务拆分</el-button>
          <el-button size="mini" @click="canceltask(item)">取消任务</el-button>
          <el-button size="mini" @click="mobileTest(item)">修改状态</el-button>
        </p>
        <!-- <p style="text-align:right;" @click="targetDetail(item)">航班详情 >></p> -->
      </div>
    </el-popover>
    <!-- 任务拆分 -->
    <el-dialog v-dialogDrag title="任务拆分" :visible.sync="splitFormVisible" width="60%" height="500px">
      <el-form ref="formSplit" :model="formSplit" label-width="120px">
        <el-form-item prop="splitTime" label="拆分时间">
          <el-time-picker v-model="formSplit.splitTime" :arrow-control="arrowControl" type="datetime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" :picker-options="{
      selectableRange: timeRange
    }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="splitFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleSplitClick()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog v-dialogDrag title="修改状态" :visible.sync="autoDialogVisible" width="60%" height="500px">
      <el-form ref="formAddServer" :model="formAddServer" label-width="120px">
        <el-form-item prop="id" label="任务id">
          <el-input v-model="formAddServer.id" size="small" style="width:150px" />
        </el-form-item>
        <el-form-item prop="state" label="任务状态">
          <el-select v-model="formAddServer.state">
            <el-option v-for="(itemin,i) in statusList" :key="i" :label="itemin.name" :value="itemin.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="autoDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleAddServerClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { canceltask, split } from '@/api/checkInData'
import VueTimepicker from 'vue2-timepicker'
import { updateTaskStatus } from '@/api/checkInData'
const NOW_PLAN = 'rgb(67, 162, 43)'
// const FUTHER_PLAN = 'linear-gradient(rgb(135, 191, 249) 50%, #2d93fd 50%, rgb(1, 163, 255) 100%)'
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
  components: { VueTimepicker },
  filters: {
    joinDate2: function(value) {
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
    joinDate: function(value) {
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
      timeRange: '18:30:00 - 20:30:00',
      arrowControl: true,
      startTime: '',
      endTime: '',
      formSplit: {},
      splitFormVisible: false,
      autoDialogVisible: false,
      formAddServer: {},
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
      switch (item.taskStatusId) {
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
    // 目标任务
    var target = document.querySelector('.target')
    if (target) {
      var a = target.parentNode.parentNode.parentNode.style.left
      var b = a.substring(0, a.indexOf('px'))
      console.log(b, 222)
      localStorage.setItem('scrollx', b)
      return
    }
  },
  methods: {
    // 任务拆分
    taskSplit(item) {
      this.formSplit.id = item.taskId
      this.formSplit.taskCategory = item.taskCategory
      const startTime = item.startTime.substring(10, 20)
      const endTime = item.endTime.substring(10, 20)
      this.timeRange = startTime + '-' + endTime
      console.log(this.timeRange, 'start')
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
        .then(response => {
          this.$message.success('任务拆分成功')
          this.splitFormVisible = false
          this.$emit('changeStatus')
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    canceltask(item) {
      // 取消任务
      if (item.taskStatusId !== 5) {
        this.$confirm('确认取消这条任务吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            canceltask({ taskId: item.taskId })
              .then(response => {
                // this.securityList()
                this.$emit('changeStatus')
                this.$message.success('已取消')
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          })
          .catch(() => {})
      } else {
        this.$message.warning('已是取消状态')
      }
    },
    mobileTest(item) {
      console.log(item, 32)
      this.autoDialogVisible = true
      this.formAddServer.id = item.taskId
      this.formAddServer.taskCategory = item.taskCategory
      this.formAddServer.flag = 0
      // this.formAddServer.taskState = item.taskState
    },
    handleAddServerClick() {
      updateTaskStatus(this.formAddServer)
        .then(response => {
          // alert('修改任务成功')
          this.$message.success('状态修改成功')
          this.autoDialogVisible = false
          this.$emit('changeStatus')
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    allowDrop(ev) {
      ev.preventDefault()
    }
    // targetDetail(item) {
    //   // 点击详情
    //   this.$router.push({ path: '/dispatching/targetDetail', query: { flightLegId: item.flightLegId } })
    // }
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
  height: 18px;
  vertical-align: middle;
  text-align: center;
  font-size: 12px;
  color: #fff;
  padding-top: 2px;
  // text-shadow: 0 0 2px #000;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  border: 1px solid #272829;
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
