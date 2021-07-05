<template>
  <div>
    <div v-if="item.taskRunningState==2" class="plan">
      <el-popover
        placement="bottom"
        width="300"
        trigger="hover"
      >
        <p v-for="(itm,i) in item.alarmMsgs" :key="i">{{ itm }}</p>
        <ul v-for="(itm,i) in item.subTasks" :key="i" style="display:flex;justify-content:space-between;margin-top:10px">
          <li>{{ itm.rtTaskName }}</li>
          <li><el-button size="mini" @click="targetDetail(itm)">任务列表</el-button></li>
        </ul>
        <div slot="reference" class="plan" style="background:red;display:flex;justify-content: center;">
          <span> {{ item.sno?item.sno.toString():'' }}</span> <span> {{ item.taskName }}</span><span> {{ item.eno?item.eno.toString():'' }}</span>
        </div>

      </el-popover>
    </div>
    <div v-else class="plan" style="position:relative">
      <el-popover
        placement="bottom"
        width="200"
        trigger="hover"
      >
        <div class="detail">
          <span class="header">{{ item.name }}</span>
          <ul>
            <li>
              <span>任务开始时间：</span>
              <span v-if="item.planInPlace">{{ item.planInPlace }}</span>
              <span v-else>{{ item.start }}</span>
            </li>
            <li>
              <span>任务结束时间：</span>
              <span v-if="item.planEnd">{{ item.planEnd }}</span>
              <span v-else>{{ item.end }}</span>
            </li>
          </ul>
          <ul v-for="(itm,i) in item.subTasks" :key="i" style="display:flex;justify-content:space-between;margin-top:10px">
            <li>{{ itm.rtTaskName }}</li>
            <li><el-button size="mini" @click="targetDetail(itm)">任务列表</el-button></li>
          </ul>
        </div>
        <div slot="reference" class="plan">
          <div style="background:#87a054;display:flex;justify-content: space-between;">
            <span>{{ item.sno?item.sno.toString():'' }}</span> <span> {{ item.taskName }}</span><span>{{ item.eno?item.eno.toString():'' }}</span>
          </div>

        </div>

      </el-popover>
      <div style="color:#fff;position:absolute;top:-5px;left:45%">
        <span> {{ item.nodeNo }}</span>
      </div>
    </div>

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
      switch (item.taskStatus) {
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
  created() {
  },
  methods: {
    onClick() {
      // this.updateTimeLines(this.item.start, this.item.end);
    },
    targetDetail(data) {
      if (data.businessDomain) {
        this.$router.push({ path: '/vehicle/specialVehicle/dispatching', query: { businessDomainId: data.businessDomain }})
      }
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
  height: 30px;
  line-height: 20px;
}

.detail {

  .header {
    text-align: center;

  }
}

.detail ul {
  list-style: none;

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
