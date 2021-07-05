<template>
  <el-popover placement="bottom" trigger="hover">
    <!-- :style="{'background':statusColor,'box-shadow':statusColor2,'margin-top':0.1*cellHeight+'px'}" -->
    <div slot="reference" class="plan" :style="{'background': item.name?'#87a054': '#808080'}" @click="onClick">
      <div class="runTime">
        <!-- <span>S:{{startToString}}</span> -->
        <!-- <span>E:{{endToString}}</span> -->
      </div>
      <div class="middle">{{ item.name ? item.name : '无人值机' }}</div>
    </div>

    <div class="detail">
      <span class="header">{{ data.securityName }}</span>
      <ul>
        <li>
          <span>上班时间：</span>
          <span>{{ startToString }}</span>
        </li>
        <li>
          <span>下班时间：</span>
          <span>{{ endToString }}</span>
        </li>
        <!-- <li>
          <span>通道开启：</span><span>{{ openTime }}</span>
        </li>
        <li>
          <span>通道关闭：</span><span>{{ closeTime }}</span>
        </li>-->
      </ul>
    </div>
  </el-popover>
</template>

<script>
import dayjs from 'dayjs'

const NOW_PLAN = 'linear-gradient(rgb(188, 228, 167) 50%, rgb(67, 162, 43) 50%, rgb(177, 232, 166) 100%)'
const FUTHER_PLAN = 'linear-gradient(rgb(135, 191, 249) 50%, #2d93fd 50%, rgb(1, 163, 255) 100%)'
const PAST_PLAN = 'linear-gradient(rgb(178, 184, 202) 50%, rgb(62, 70, 96) 50%, rgb(129, 138, 167) 100%)'
const NOW_PLAN2 = 'rgb(5, 127, 5) 9px 15px 33px -8px inset, rgb(156, 232, 145) 0px 1px 0px, rgb(6, 80, 39) 0px 2px 0px'
const FUTHER_PLAN2 = 'rgb(10, 54, 234) 9px 15px 33px -8px inset, rgb(101, 126, 232) 0px 1px 0px, rgb(35, 54, 165) 0px 2px 0px'
const PAST_PLAN2 = 'rgb(129, 138, 167) 0px 1px 10px 1px inset, rgb(167, 167, 167) 0px 1px 0px, rgb(62, 70, 96) 0px 2px 0px'
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
    statusColor() {
      const { item, currentTime } = this
      const start = dayjs(item.start)
      const end = dayjs(item.end)
      if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
        return NOW_PLAN // NOW
      } else if (end.isBefore(currentTime)) {
        return PAST_PLAN // PAST
      } else {
        return FUTHER_PLAN // Future
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
    onClick() {
      // this.updateTimeLines(this.item.start, this.item.end);
    }
  }
}
</script>

<style lang="scss" scoped>
.middle {
  flex: 1;
  text-align: center;
  font-size: 12px;
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
