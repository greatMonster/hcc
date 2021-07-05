<template>
  <el-popover placement="bottom" trigger="hover">
    <!-- :style="{'background':statusColor,'box-shadow':statusColor2,'margin-top':0.1*cellHeight+'px'}" -->
    <!-- <div slot="reference" class="plan" :style="{'background': item.employeeName?'#87a054': '#808080'}"> -->
    <div slot="reference" class="plan" :style="{ background: statusColor, border: '1px solid #272829' }" draggable="true">
      <div class="middle">
        <span v-if="item.taskRunningState === 2" style="color: yellow">！</span>
        <span v-if="item.taskStatus === 8" style="color: #67c13a">
          <i class="el-icon-lock" />
        </span>
        <span v-if="item.taskStatus === 9" style="color: #67c13a">
          <i class="el-icon-lock" />
        </span>
        {{ item.employeeName ? item.employeeName : '无人值班' }}
      </div>
    </div>

    <div class="detail">
      <span class="header">{{ data.code }}</span>
      <ul>
        <li v-if="item.alarmType">
          <span>告警原因：</span>
          <span>{{ item.alarmType }}</span>
        </li>
        <li>
          <span>任务开始时间：</span>
          <span v-if="item.expectedStartTime">{{ item.expectedStartTime }}</span>
          <!-- <span v-else>{{ item.start }}</span> -->
        </li>
        <li>
          <span>任务结束时间：</span>
          <span v-if="item.expectedEndTime">{{ item.expectedEndTime }}</span>
          <!-- <span v-else>{{ item.end }}</span> -->
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
        <el-button @click="targetDetail(item)">任务详情</el-button>
        <el-button @click="flightPlan(item)">任务列表</el-button>
        <!-- <el-button @click="mobileTest(item)">终端测试</el-button> -->
      </p>
    </div>
  </el-popover>
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
  props: {
    data: Object,
    item: Object,
    currentTime: dayjs,
    // updateTimeLines: Function,
    cellHeight: Number,
    startTimeOfRenderArea: Number
  },
  data() {
    return {
      dayjs: dayjs,
      businessDomainId: this.$route.query.businessDomainId
    }
  },
  computed: {
    statusColor() {
      // console.log(this.data, 666)
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
      switch (item.taskStatus) {
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
      return dayjs(this.item.expectedStartTime).format('HH:mm')
    },
    endToString() {
      return dayjs(this.item.expectedEndTime).format('HH:mm')
    }
    // openTime() {
    //   return dayjs(this.data.openTime).format('HH:mm')
    // },
    // closeTime() {
    //   return dayjs(this.data.closeTime).format('HH:mm')
    // }
  },
  methods: {
    onClick() {
      // this.updateTimeLines(this.item.start, this.item.end);
    },
    targetDetail(item) {
      // 点击详情
      // this.$router.push({ path: '/vehicle/specialVehicle/targetDetail', query: { flightLegId: item.id } })
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/targetDetail', query: { flightLegId: item.id }})
      window.open(routeData.href, '_blank')
    },
    flightPlan(item) {
      console.log(this.businessDomainId, 5252255)
      // 任务视图
      var routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/taskView', query: { id: item.id, businessDomainId: this.businessDomainId }})
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
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
  border-radius: 3px;
  color: #000;
  padding-left: 0 5px;
  font-size: 10px;
  cursor: pointer;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  width: 100%;
  top: 35%;
  height: 20px;
  line-height: 20px;
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
      // width: 120px;
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
