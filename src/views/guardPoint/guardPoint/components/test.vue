<template>
  <div v-if="item">
    <el-popover placement="bottom" trigger="click">
      <div slot="reference" class="plan" :style="{ background: statusColor }" draggable="true">
        <div class="middle">
          <!-- <span>{{ item.deskName }} {{ item.deskCode }}号柜台 {{ item.startTime.split(" ")[1].substring(0,5) }}-{{ item.endTime.split(" ")[1].substring(0,5) }}</span> -->
          <span v-if="item.taskRunningState === 2" style="color: yellow">！</span>
          <span v-if="item.taskStatusId === 8" style="color: #67c13a">
            <!-- //已分配 -->
            <i class="el-icon-lock" />
          </span>
          <span v-if="item.taskStatusId === 9" style="color: #67c13a">
            <i class="el-icon-lock" />
          </span>
          <span>{{ item.taskTypeName ? item.taskTypeName : item.pointName }}</span>
        </div>
      </div>
      <div class="detail">
        <span class="header">{{ item.pointName }}</span>
        <ul>
          <li v-if="item.alarmType">
            <span>告警原因：</span>
            <span>{{ item.alarmType }}</span>
          </li>
          <li>
            <span>任务开始时间：</span>
            <span v-if="item.beginTime">{{ item.beginTime | joinDate }}</span>
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
        <!-- <p style="text-align:right;" @click="targetDetail(item)">航班详情 >></p> -->
      </div>
    </el-popover>
  </div>
</template>
<script>
import dayjs from 'dayjs'
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
    },
  },
  props: {
    data: Object,
    item: Object,
    currentTime: dayjs,
    updateTimeLines: Function,
    cellHeight: Number,
    startTimeOfRenderArea: Number,
  },
  data() {
    return {
      id: this.$route.query.id,
      dayjs: dayjs,
      scrollxthis: '',
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
        case 8:
          return FUTHER_PLAN // 已分配锁定
          break
        case 1:
          return weiFeiPei // 未分配
          break
        case 9:
          return weiFeiPei // 未分配锁定
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
    statusColor2() {
      const { item, currentTime } = this
      const start = dayjs(item.planInPlace)
      const end = dayjs(item.planEnd)
      if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
        return NOW_PLAN2 // NOW
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
    allowDrop(ev) {
      ev.preventDefault()
    },
    // targetDetail(item) {
    //   // 点击详情
    //   this.$router.push({ path: '/dispatching/targetDetail', query: { flightLegId: item.flightLegId } })
    // }
  },
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
