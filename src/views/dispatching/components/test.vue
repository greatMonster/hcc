<template>
  <div>
    <el-popover placement="bottom" trigger="click">
      <div
        slot="reference"
        class="plan"
        :data="data.id"
        :style="{'background':statusColor,'box-shadow':statusColor2,'margin-top':0.1*cellHeight+'px'}"
        draggable="true"
        @dragstart="dragstart($event)"
        @drag="drag($event)"
        @dragend="dragend($event)"
        @dragover="allowDrop($event)"
        @drop="onDrop($event)"
      >
        <!-- <div class="runTime">
        <span></span>
        <span></span>
      </div> -->
        <!-- <span v-if="people ==1" class="tasksAccepted"><svg-icon icon-class="people" /></span> -->
        <div class="middle"> <span>{{ item.taskId }}</span></div>
        <!-- <div class="passenger">{{item.passenger}}人</div> -->
      </div>

      <div class="detail">
        <span class="header">{{ data.id }}</span>
        <p style="color:#e76b75">特服信息：adsfasfadf</p>
        <ul>
          <li>
            <span>任务开始时间：</span><span>{{ startToString }}</span>
          </li>
          <li>
            <span>任务结束时间：</span><span>{{ endToString }}</span>
          </li>
          <li>
            <span>实际开始时间：</span><span>{{ AstartToString }}</span>
          </li>
          <li>
            <span>实际完成时间：</span><span>{{ AendToString }}</span>
          </li>
          <li>
            <span>载员：</span><span>{{ item.passenger }}</span>
          </li>
          <li>
            <span>编号：</span><span>{{ item.id }}</span>
          </li>
        </ul>
        <p style="text-align:right;" @click="targetDetail">详情 >> </p>
      </div>
    </el-popover>
    <!-- <div ref="menu">
      <p>sdfdsf</p>
    </div> -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import { constants } from 'crypto'
// import { getWidthAbout2Times } from './gtUtils.js'

// const getTimes = window.getWidthAbout2Times

// const NOW_PLAN = '#198319'
// const FUTHER_PLAN = '#0031ff'
// const PAST_PLAN = '#818aa7'
// const NOW_PLAN2 = 'inset 0 1px 10px 1px #67c23a, 0 1px 0 #359927, 0 6px 0 #015627, 0 8px 4px 1px #111111'
// const FUTHER_PLAN2 = 'inset 0 1px 10px 1px #29f6ff, 0 1px 0 #1d48fd, 0 6px 0 #2336a5, 0 8px 4px 1px #111111'
// const PAST_PLAN2 = 'inset 0 1px 10px 1px #0a142f, 0 1px 0 #0a142f, 0 6px 0 #0a142f, 0 8px 4px 1px #111111'

const NOW_PLAN = 'linear-gradient(rgb(188, 228, 167) 50%, rgb(67, 162, 43) 50%, rgb(177, 232, 166) 100%)'
const FUTHER_PLAN = 'linear-gradient(rgb(135, 191, 249) 50%, #2d93fd 50%, rgb(1, 163, 255) 100%)'
const PAST_PLAN = 'linear-gradient(rgb(178, 184, 202) 50%, rgb(62, 70, 96) 50%, rgb(129, 138, 167) 100%)'
const NOW_PLAN2 = 'rgb(5, 127, 5) 9px 15px 33px -8px inset, rgb(156, 232, 145) 0px 1px 0px, rgb(6, 80, 39) 0px 6px 0px'
const FUTHER_PLAN2 = 'rgb(10, 54, 234) 9px 15px 33px -8px inset, rgb(101, 126, 232) 0px 1px 0px, rgb(35, 54, 165) 0px 6px 0px'
const PAST_PLAN2 = 'rgb(129, 138, 167) 0px 1px 10px 1px inset, rgb(167, 167, 167) 0px 1px 0px, rgb(62, 70, 96) 0px 6px 0px'

// const Warn_PLAN = '#fb0101'
export default {
  name: 'Test',
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
      dayjs: dayjs,
      people: ''
    }
  },
  computed: {
    statusColor() {
      const { item, currentTime } = this
      const start = dayjs(item.start)
      const end = dayjs(item.end)
      // const Actualstart = dayjs(item.Actualstart)
      // const Actualend = dayjs(item.Actualend)
      if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
        // if (Actualstart !== '') {
        //   return Warn_PLAN
        // } else {
        return NOW_PLAN // NOW
        // }
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
    AstartToString() {
      return dayjs(this.item.Actualend).format('HH:mm')
    },
    AendToString() {
      return dayjs(this.item.Actualstart).format('HH:mm')
    }
  },
  methods: {
    // getTimes(start,end){
    //   return getWidthAbout2Times(start, end)
    // },

    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev) {
      // this.startExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      // console.log(this.startExchangeIndex, '开始id')

    },
    drag(event) {
      // event.preventDefault()
      // var Y = event.pageY
      // event.target.style.top = Y + 'px'
      // console.log(event.target.parentNode.parentNode.parentNode.getAttribute('style'), 4444)
    },
    dragend(event) {
      // var Y = event.pageY
      // event.target.style.top = Y + 'px'
      // console.log(event.target.parentNode.parentNode.parentNode.getAttribute('style'), 33333)
    },
    onDrop(event) {
      // console.log(event.target, 222222)

      var endExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      console.log(endExchangeIndex)
      if (endExchangeIndex) {
        this.$message.error('任务冲突，分配失败')
      }

      console.log(event.target.parentNode.parentNode.parentNode, 555)
      console.log(endExchangeIndex, '返回目标id')
    },
    targetDetail() {
      this.$router.push({ path: 'TargetDetail', query: { aaa: 1 }})
    }

  }
}
</script>

<style lang="scss" scoped>
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
    // text-shadow: 0 0 2px #000;
    font-style: italic
}
.runTime {
  display: flex;
  flex-direction: column;
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 55%;
  // border: 1px solid #f0f0f0;
  border-radius:5px 5px 5px 5px;
  color: #000;
  padding-left:0 5px;
  font-size: 0.8rem;
  // opacity: 0.8;
  cursor: pointer;
  // box-shadow: inset 0px 2px 16px #e9f3f9;
  // background-image: linear-gradient(top, #00B4DD 30%, #00B4DD 51%);
  // box-shadow: inset 0 1px 10px 1px #5c8bee, 0 1px 0 #1d2c4d, 0 6px 0 #1f3053, 0 8px 4px 1px #111111;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  width: 100%;
   top: 9%;
}

.detail {
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
