<template>
  <div v-if="item.taskName" :class="{target:item.id == id}">
    <el-popover placement="bottom" trigger="click">
      <div
        slot="reference"
        class="plan"
        :style="{'background':statusColor,'box-shadow':statusColor2}"
        draggable="true"
      >
        <div class="middle"> <span>{{ item.taskName }}</span></div>
      </div>
      <div class="detail">
        <span class="header">{{ item.taskName }}</span>
        <ul>
          <li><span>任务开始时间：</span><span v-if="item.planInPlace">{{ item.planInPlace | joinDate }}</span><span v-else>{{ item.start | joinDate }}</span>
          </li>
          <li><span>任务结束时间：</span><span v-if="item.planEnd">{{ item.planEnd | joinDate }}</span><span v-else>{{ item.end | joinDate }}</span>
          </li>
          <li>
            <span>任务状态 :</span>{{ item.taskState==2?'已分配':'未分配' }}<br>
            <span>开始位置 :</span>{{ item.startPosition }}<br>
            <span>结束位置 :</span>{{ item.endPosition }}<br>
            <span>计划到位时间 :</span>{{ item.planInPlace }}<br>
            <span>计划发车时间 :</span>{{ item.planDepart }}<br>
            <span>计划结束时间:</span>{{ item.planEnd }}<br>
            <span>车型 :</span>{{ item.busType }}<br>
            <span>技能 :</span>{{ item.skillId }}<br>
            <span>创建时间 :</span>{{ item.createDate }}<br>
            <span>进港出港 :</span>{{ item.flightType }}<br>
            <span>国际国内 :</span>{{ item.intlFlag | joinDate2 }}<br>
            <span>起飞站-到达站 :</span>{{ item.deptArrAirport }}<br>
            <span>车次 :</span>{{ item.checi }}<br>
            <span>出发机坪 :</span>{{ item.deptApron }}<br>
            <span>到达机坪 :</span>{{ item.arrApron }}<br>
          </li>
          <li>
            <span>skillId：</span><span>{{ item.skillId }}</span>
          </li>
          <li>
            <span>编号：</span><span>{{ item.id }}{{ item.TargetDetail }}</span>
          </li>
          <li>
            <div v-for="(itm,index) in item.tasks" :key="index" class="taskState">
              <div :class="{allocation:itm.taskState==2,unallocated:itm.taskState==1}" :staus="itm.taskState">
                {{ itm.taskName }} ({{ itm.planInPlace | joinDate }} - {{ itm.planEnd | joinDate }}) {{ itm.employeeName }}
              </div>
            </div>
          </li>
        </ul>
        <p style="text-align:right;">
          <el-button @click="targetDetail(item,'dynamic')">详情(航班动态)</el-button>
          <el-button @click="targetDetail(item,'plan')">详情(航班计划)</el-button>
        </p>
      </div>
    </el-popover>
  </div>
</template>
<script>
import dayjs from 'dayjs'
const NOW_PLAN = 'linear-gradient(rgb(188, 228, 167) 50%, rgb(67, 162, 43) 50%, rgb(177, 232, 166) 100%)'
const FUTHER_PLAN = 'linear-gradient(rgb(135, 191, 249) 50%, #2d93fd 50%, rgb(1, 163, 255) 100%)'
const PAST_PLAN = 'linear-gradient(rgb(178, 184, 202) 50%, rgb(62, 70, 96) 50%, rgb(129, 138, 167) 100%)'
const NOW_PLAN2 = 'rgb(5, 127, 5) 9px 15px 33px -8px inset, rgb(156, 232, 145) 0px 1px 0px, rgb(6, 80, 39) 0px 0px 0px'
const FUTHER_PLAN2 = 'rgb(10, 54, 234) 9px 15px 33px -8px inset, rgb(101, 126, 232) 0px 1px 0px, rgb(35, 54, 165) 0px 0px 0px'
const PAST_PLAN2 = 'rgb(129, 138, 167) 0px 1px 10px 1px inset, rgb(167, 167, 167) 0px 1px 0px, rgb(62, 70, 96) 0px 0px 0px'
export default {
  name: 'Test',
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
    startTimeOfRenderArea: Number
  },
  data() {
    return {
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
    }
  },
  created() { // 目标任务
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
    targetDetail(item, type) { // 点击详情
      this.$router.push({ path: '/dispatching/targetDetail', query: { flightLegId: item.flightLegId, type: type }})
    }
  }
}
</script>
<style lang="scss" scoped>
.target{
  .middle{
  background:red
  }
}
.tasksAccepted{
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
    span{
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
  border-radius:3px;
  color: #000;
  padding-left:0 5px;
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
