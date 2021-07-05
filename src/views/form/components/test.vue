<template>
  <div>
    <el-popover placement="bottom" trigger="hover">
      <div slot="reference" class="plan" :data="data.id" :style="{'background-color':statusColor,'margin-top':0.1*cellHeight+'px'}" draggable="true" @dragstart="dragstart($event)" @dragend="dragend($event)" @dragover="allowDrop($event)" @drop="onDrop($event)" @click="onClick">
        <!-- <div class="runTime">
        <span></span>
        <span></span>
      </div> -->
        <div class="middle">S:{{ startToString }} E:{{ endToString }} 编号{{ item.id }}</div>
        <!-- <div class="passenger">{{item.passenger}}人</div> -->

      </div>

      <div class="detail">
        <span class="header">{{ data.type }}{{ data.name }}{{ data.id }}</span>
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
      </div>
    </el-popover>
    <!-- <div class="plan zindex" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:this.getTimes(this.item.start,this.item.end)+'px'}" ></div> -->
    <!-- <div class="plan zindex" :data="data.id" :style="{'margin-top':0.1*cellHeight+'px',width:150+'px'}" ></div> -->

  </div>
</template>

<script>
import dayjs from 'dayjs'
// import { getWidthAbout2Times } from './gtUtils.js'

// const getTimes = window.getWidthAbout2Times

const NOW_PLAN = '#8dd478'
const FUTHER_PLAN = '#71c7f4'
const PAST_PLAN = '#a8a8a9'
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

    onClick() {
      this.updateTimeLines(this.item.start, this.item.end)
      // var a = getWidthAbout2Times(this.item.start, this.item.end)
      //   console.log(a,99999)
    },
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev) {
      this.startExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      console.log(this.startExchangeIndex, '开始id')
    },
    dragend(ev) {
      var a = ev.target.getAttribute('left') + 'px'
      console.log(a)
      console.log('拖拽结束')
    },
    onDrop(event) {
      this.endExchangeIndex = event.target.getAttribute('style') || event.target.parentNode.getAttribute('style')
      if (this.endExchangeIndex) {
        this.$message.error('任务重合，分配失败')
      }
      console.log(this.endExchangeIndex, '返回目标id')
    }

  }
}
</script>

<style lang="scss" scoped>
// .middle {
//  width: 80%;
//     height: 100%;
//     display: inline-block;
//     vertical-align: middle;
//     text-align: center;
//     background: red

// }
.runTime {
  display: flex;
  flex-direction: column;
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 80%;
  // border: 1px solid #f0f0f0;
  border-radius: 5px;
  color: #192e69;
  padding-left: 5px;
  font-size: 0.8rem;
  // opacity: 0.8;
  cursor: pointer;
  box-shadow: inset 0px 20px 40px #fff;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  width: 100%;
}
.plan.zindex {
  top: 0;
  position: absolute;
  z-index: 0;
  // width:110%;
  background: red;
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
      color: #777;
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
