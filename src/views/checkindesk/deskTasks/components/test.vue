<template>
  <el-popover placement="bottom" trigger="hover" width="200px">
    <!-- :style="{'background':statusColor,'box-shadow':statusColor2,'margin-top':0.1*cellHeight+'px'}" -->
    <!-- <div slot="reference" class="plan" :style="{'background': item.name?'#87a054': '#808080'}" @click="onClick"> -->
    <div slot="reference" class="plan" :style="{'background':statusColor,border:'1px solid #272829'}" draggable="true">
      <div class="middle">
        <span v-if="item.taskRunningState === 2" style="color: yellow;">！</span>
        <span v-if="item.taskStatusId === 8" style="color:#67c13a">
          <i class="el-icon-lock" />
        </span>
        <span v-if="item.taskStatusId === 9" style="color:#67c13a">
          <i class="el-icon-lock" />
        </span>
        {{ item.name ? item.name : '无人值机' }}
      </div>
    </div>

    <div class="detail">
      <span class="header">{{ data.securityName }}</span>
      <ul>
        <li>
          <span>开始时间：</span>
          <span>{{ startToString }}</span>
        </li>
        <li>
          <span>结束时间：</span>
          <span>{{ endToString }}</span>
        </li>
        <li v-if="item.alarmType">
          <span>告警原因：</span>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.alarmType }}</div>
        </li>
      </ul>
      <p style="text-align:right;">
        <el-button size="mini" @click="canceltask(item)">取消任务</el-button>
      </p>
    </div>
  </el-popover>
  <!-- </div> -->
</template>

<script>
import dayjs from 'dayjs'
import { canceltask } from '@/api/checkInData'
import { updateTaskStatus } from '@/api/checkInData'
const NOW_PLAN = 'linear-gradient(rgb(188, 228, 167) 50%, rgb(67, 162, 43) 50%, rgb(177, 232, 166) 100%)'
// const FUTHER_PLAN = 'linear-gradient(rgb(135, 191, 249) 50%, #2d93fd 50%, rgb(1, 163, 255) 100%)'
const FUTHER_PLAN = '#1156f0'
const PAST_PLAN = 'linear-gradient(rgb(178, 184, 202) 50%, rgb(62, 70, 96) 50%, rgb(129, 138, 167) 100%)'
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
  props: {
    data: Object,
    item: Object,
    currentTime: dayjs,
    // updateTimeLines: Function,
    cellHeight: Number,
    startTimeOfRenderArea: Number,
    statusList: Array
  },
  data() {
    return {
      autoDialogVisible: false,
      formAddServer: {},
      dayjs: dayjs
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    statusColor() {
      // console.log(this.data, 666)
      // eslint-disable-next-line no-unused-vars
      const { item, currentTime } = this
      // eslint-disable-next-line no-unused-vars
      const start = dayjs(item.planInPlace)
      // eslint-disable-next-line no-unused-vars
      const end = dayjs(item.planEnd)
      // if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
      //   return NOW_PLAN // NOW
      // } else if (end.isBefore(currentTime)) {
      //   return PAST_PLAN // PAST
      // } else {
      //   return FUTHER_PLAN // Future
      // }
      switch (item.taskStatusId) {
        case 3:
          return NOW_PLAN // NOW 已接收
          // eslint-disable-next-line no-unreachable
          break
        case 4:
          return PAST_PLAN // PAST 已完成

          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return FUTHER_PLAN // Future 已分配未接收

          // eslint-disable-next-line no-unreachable
          break
        case 1:
          return weiFeiPei // 未分配

          // eslint-disable-next-line no-unreachable
          break
        case 6:
          return unconfirm // 已超时

          // eslint-disable-next-line no-unreachable
          break
        case 7:
          return hasStarted

          // eslint-disable-next-line no-unreachable
          break
        case 5:
          return hasCanceled // 已取消

          // eslint-disable-next-line no-unreachable
          break
      }
    },
    statusColor2() {
      const { item, currentTime } = this
      const start = dayjs(item.start)
      const end = dayjs(item.end)
      // const Actualstart = dayjs(item.Actualstart)
      // const Actualend = dayjs(item.Actualend)
      if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
        // if (Actualstart !== '') {
        //   return Warn_PLAN
        // } else {
        return NOW_PLAN2 // NOW
        // }
      } else if (end.isBefore(currentTime)) {
        return PAST_PLAN2 // PAST
      } else {
        return FUTHER_PLAN2 // Future
      }
    },
    startToString() {
      return dayjs(this.item.start).format('HH:mm')
    },
    endToString() {
      return dayjs(this.item.end).format('HH:mm')
    },
    openTime() {
      return dayjs(this.data.openTime).format('HH:mm')
    },
    closeTime() {
      return dayjs(this.data.closeTime).format('HH:mm')
    }
  },
  methods: {
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
      // this.formAddServer.taskState = item.taskState
    },
    handleAddServerClick(e) {
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
    onClick() {
      // this.updateTimeLines(this.item.start, this.item.end);
    }
  }
}
</script>

<style lang="scss" scoped>
.middle {
  width: 100%;
  flex: 1;
  text-align: center;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.runTime {
  display: flex;
  flex-direction: column;
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 80%;
  width: 100%;
  top: 35%;
  border-radius: 3px;
  padding-left: 0 5px;
  border: 1px solid #000;
  // border-radius: 5px;
  color: #fff;
  font-size: 0.8rem;
  // opacity: 0.8;
}

.detail {
  padding-top: 10px;
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
      width: 80px;
      color: #fff;
      font-size: 0.8rem;
    }
    span:first-child {
      text-align: right;
    }

    span:last-child {
    }
  }
}
</style>
