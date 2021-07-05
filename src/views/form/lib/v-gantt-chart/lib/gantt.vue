<template>

  <div class="gantt-chart" @wheel="wheelHandle">
    <div class="gantt-container" :style="{height:`calc(100% - ${scrollXBarHeight}px)`,width:`calc(100% - ${scrollYBarWidth}px)`}">

      <div v-show="!hideHeader" class="gantt-header" :style="{width:`calc(100% + ${scrollYBarWidth}px)`}">
        <div class="gantt-header-title" :style="{'line-height':titleHeight+'px',height:titleHeight+'px','width':titleWidth+'px'}">
          <slot name="title">welcome v-gantt-chart</slot>
        </div>
        <div ref="headerTimeline" class="gantt-header-timeline">
          <div class="gantt-timeline-wrapper" :style="{width:(totalWidth+scrollYBarWidth)+'px'}">
            <timeline :start="start" :end="end" :cell-width="cellWidth" :title-height="titleHeight" :scale="scale" />
          </div>
        </div>
      </div>

      <div class="gantt-body" :style="{height:`calc(100% - ${actualHeaderHeight}px)`}">
        <div class="gantt-table">
          <div ref="marklineArea" :style="{marginLeft:titleWidth+'px'}" class="gantt-markline-area">
            <CurrentTime v-if="showCurrentTime" :get-positon-offset="getPositonOffset" />
            <mark-line v-for="(times,index) in timeLines" :key="index" :mark-line-time="times.time" :get-positon-offset="getPositonOffset" :color="times.color" />
          </div>
          <div ref="leftbarWrapper" class="gantt-leftbar-wrapper" :style="{'width':titleWidth+'px',height:`calc(100% + ${scrollXBarHeight}px)`}">
            <LeftBar :datas="datas" :data-key="dataKey" :scroll-top="scrollTop" :height-of-render-aera="heightOfRenderAera" :width-of-render-aera="widthOfRenderAera" :cell-height="cellHeight" :style="{height:(totalHeight+scrollXBarHeight)+'px'}">
              <template v-slot="{data}">
                <slot name="left" :data="data" />
              </template>
            </LeftBar>
          </div>
          <div ref="blocksWrapper" class="gantt-blocks-wrapper">
            <blocks :scroll-top="scrollTop" :scroll-left="scrollLeft" :height-of-render-aera="heightOfRenderAera" :width-of-render-aera="widthOfRenderAera" :array-keys="arrayKeys" :item-key="itemKey" :data-key="dataKey" :datas="datas" :cell-width="cellWidth" :cell-height="cellHeight"
:scale="scale" :get-positon-offset="getPositonOffset" :get-width-about2times="getWidthAbout2Times" :custom-generate-blocks="customGenerateBlocks" :start-time-of-render-area="startTimeOfRenderArea" :end-time-of-render-area="endTimeOfRenderArea" :style="{width:totalWidth+'px'}">
              <template v-if="!customGenerateBlocks" v-slot="{data,item}">
                <slot name="block" :data="data" :item="item" />
              </template>
              <template v-else v-slot="{data,getPositonOffset,getWidthAbout2Times,isInRenderingTimeRange}">
                <slot name="block" :data="data" :getPositonOffset="getPositonOffset" :getWidthAbout2Times="getWidthAbout2Times" :isInRenderingTimeRange="isInRenderingTimeRange" :startTimeOfRenderArea="startTimeOfRenderArea" :endTimeOfRenderArea="endTimeOfRenderArea" />
              </template>
            </blocks>
          </div>
        </div>
      </div>
    </div>

    <div ref="scrollYBar" class="gantt-scroll-y" :style="{width:`${scrollYBarWidth}px`,height:`calc(100% - ${actualHeaderHeight}px`,marginTop:`${actualHeaderHeight}px`}" @scroll="syncScrollY">
      <div :style="{height:totalHeight+'px'}" />
    </div>

    <div ref="scrollXBar" class="gantt-scroll-x" :style="{height:`${scrollXBarHeight}px`,width:`calc(100% - ${titleWidth}px )`,marginLeft:titleWidth+'px'}" @scroll="syncScrollX">
      <div :style="{width:totalWidth+'px'}" />
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mockDatas } from './mock/index.js'
import ResizeObserver from 'resize-observer-polyfill'
import {
  scaleList,
  getBeginTimeOfTimeLine,
  calcScalesAbout2Times
} from './utils/timeLineUtils.js'
import { isDef, warn } from './utils/tool.js'
import {
  getPositonOffset as _getPositonOffset,
  getWidthAbout2Times as _getWidthAbout2Times
} from './utils/gtUtils.js'
import throttle from './utils/throttle.js'
import Timeline from './components/time-line/index.vue'
import CurrentTime from './components/mark-line/current-time.vue'
import LeftBar from './components/left-bar/index.vue'
import Blocks from './components/blocks/index.vue'
import MarkLine from './components/mark-line/index.vue'

export default {
  name: 'Gantt',

  components: { Timeline, LeftBar, Blocks, MarkLine, CurrentTime },

  props: {
    startTime: {
      default: () => dayjs(),
      validator(date) {
        const ok = dayjs(date).isValid()
        if (!ok) warn(`非法的开始时间 ${date}`)
        return ok
      }
    },
    endTime: {
      default: () => dayjs(),
      validator(date) {
        const ok = dayjs(date).isValid()
        if (!ok) warn(`非法的结束时间 ${date}`)
        return ok
      }
    },
    cellWidth: {
      type: Number,
      default: 50
    },
    cellHeight: {
      type: Number,
      default: 20
    },
    titleHeight: {
      type: Number,
      default: 40
    },
    titleWidth: {
      type: Number,
      default: 200
    },
    scale: {
      type: Number,
      default: 60,
      validator(value) {
        return scaleList.includes(value)
      }
    },
    datas: {
      type: Array,
      default: () => []
    },
    dataKey: {
      type: String,
      default: undefined
    },
    itemKey: {
      type: String,
      default: undefined
    },
    arrayKeys: {
      type: Array,
      default: () => []
    },
    showCurrentTime: {
      type: Boolean,
      default: false
    },
    timeLines: {
      type: Array
    },
    scrollToTime: {
      validator(date) {
        return dayjs(date).isValid()
      }
    },
    scrollToPostion: {
      validator(obj) {
        const validX = isDef(obj.x) ? !Number.isNaN(obj.x) : true
        const validY = isDef(obj.y) ? !Number.isNaN(obj.y) : true
        if (!validX && !validY) {
          warn('scrollToPostion x或y 有值为非Number类型')
          return false
        }
        return true
      }
    },
    hideHeader: {
      type: Boolean,
      default: false
    },
    hideXScrollBar: {
      type: Boolean,
      default: false
    },
    hideYScrollBar: {
      type: Boolean,
      default: false
    },
    customGenerateBlocks: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 缓存节点
      selector: {
        gantt_leftbar: {},
        gantt_table: {},
        gantt_scroll_y: {},
        gantt_timeline: {},
        gantt_scroll_x: {},
        gantt_markArea: {}
      },
      scrollTop: 0,
      scrollLeft: 0,
      // block 区域需要渲染的范围
      // 先渲染出空框架，在mounted后再得到真实的渲染范围，然后在根据范围渲染数据，比之前设置一个默认高度宽度，额外的渲染浪费更少了
      heightOfRenderAera: 0,
      widthOfRenderAera: 0,
      startTimeOfRenderArea: null,
      endTimeOfRenderArea: null,
      scrollBarWitdh: 17
    }
  },

  computed: {
    start() {
      return dayjs(this.startTime)
    },
    end() {
      const { start, widthOfRenderAera, scale, cellWidth } = this
      let end = dayjs(this.endTime)
      const totalWidth = calcScalesAbout2Times(start, end, scale) * cellWidth
      if (start.isAfter(end) || totalWidth <= widthOfRenderAera) {
        end = start.add((widthOfRenderAera / cellWidth) * scale, 'minute')
      }
      return end
    },
    totalWidth() {
      const { cellWidth, totalScales } = this
      return cellWidth * totalScales
    },
    totalScales() {
      const { start, end, scale } = this
      return calcScalesAbout2Times(start, end, scale)
    },
    totalHeight() {
      const { datas, cellHeight } = this
      return datas.length * cellHeight
    },
    beginTimeOfTimeLine() {
      const value = getBeginTimeOfTimeLine(this.start, this.scale)
      return value
    },
    beginTimeOfTimeLineToString() {
      return this.beginTimeOfTimeLine.toString()
    },
    avialableScrollLeft() {
      // 不减这个1，滚动到时间轴尽头后继续滚动会慢慢的溢出
      const { totalWidth, widthOfRenderAera } = this
      return totalWidth - widthOfRenderAera - 1
    },
    avialableScrollTop() {
      const { totalHeight, heightOfRenderAera } = this
      return totalHeight - heightOfRenderAera - 1
    },
    scrollXBarHeight() {
      return this.hideXScrollBar ? 0 : this.scrollBarWitdh
    },
    scrollYBarWidth() {
      return this.hideYScrollBar ? 0 : this.scrollBarWitdh
    },
    actualHeaderHeight() {
      return this.hideHeader ? 0 : this.titleHeight
    }
  },

  watch: {
    scrollLeft() {
      this.getTimeRange()
    },
    widthOfRenderAera() {
      this.getTimeRange()
    },
    cellWidth() {
      this.getTimeRange()
    },
    scrollToTime: {
      handler(newV) {
        if (!newV) {
          return
        }
        const { start, end } = this
        const time = dayjs(newV)
        if (!(time.isAfter(start) && time.isBefore(end))) {
          warn(`当前滚动至${newV}不在${start}和${end}的范围之内`)
          return
        }

        const offset = this.getPositonOffset(newV)
        // immediate 会造成dom 还没有挂载时就进行操作，故需要延迟执行
        this.$nextTick(() =>
          this.syncScrollX(
            {
              target: {
                scrollLeft: offset
              }
            },
            true
          )
        )
      },
      immediate: true
    },
    scrollToPostion: {
      handler(newV) {
        if (!newV) {
          return
        }
        const x = Number.isNaN(newV.x) ? undefined : newV.x
        const y = Number.isNaN(newV.y) ? undefined : newV.y
        this.$nextTick(() => {
          if (isDef(x) && x !== this.scrollLeft) {
            this.syncScrollX({ target: { scrollLeft: x }}, true)
          }
          if (isDef(y) && y !== this.scrollTop) {
            this.syncScrollY({ target: { scrollTop: y }}, true)
          }
        })
      },
      immediate: true
    }
  },

  mounted() {
    this.getSelector()
    // 计算准确的渲染区域范围
    const observeContainer = throttle(entries => {
      entries.forEach(entry => {
        const cr = entry.contentRect
        this.heightOfRenderAera = cr.height
        this.widthOfRenderAera = cr.width
      })
    })
    const observer = new ResizeObserver(observeContainer)
    observer.observe(this.$refs.blocksWrapper)
  },

  methods: {
    /**
     * 计算需要渲染的时间范围
     *
     */
    getTimeRange() {
      if (this.heightOfRenderAera === 0) {
        return
      }

      const {
        beginTimeOfTimeLine,
        scrollLeft,
        cellWidth,
        scale,
        widthOfRenderAera
      } = this

      this.startTimeOfRenderArea = beginTimeOfTimeLine
        .add((scrollLeft / cellWidth) * scale, 'minute')
        .toDate()
        .getTime()
      this.endTimeOfRenderArea = beginTimeOfTimeLine
        .add(((scrollLeft + widthOfRenderAera) / cellWidth) * scale, 'minute')
        .toDate()
        .getTime()
    },
    getWidthAbout2Times(start, end) {
      const options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      }
      return _getWidthAbout2Times(start, end, options)
    },
    /**
     * 为时间线计算偏移
     */
    getPositonOffset(date) {
      const options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      }

      return _getPositonOffset(date, this.beginTimeOfTimeLineToString, options)
    },
    // 缓存节点
    getSelector() {
      this.selector.gantt_leftbar = this.$refs.leftbarWrapper
      this.selector.gantt_table = this.$refs.blocksWrapper
      this.selector.gantt_scroll_y = this.$refs.scrollYBar
      this.selector.gantt_timeline = this.$refs.headerTimeline
      this.selector.gantt_scroll_x = this.$refs.scrollXBar
      this.selector.gantt_markArea = this.$refs.marklineArea
    },
    wheelHandle(event) {
      const { deltaX, deltaY } = event
      this.$nextTick(() => {
        const {
          scrollTop,
          scrollLeft,
          avialableScrollLeft,
          avialableScrollTop
        } = this

        if (deltaY !== 0) {
          if (
            scrollTop + deltaY >= avialableScrollTop &&
            scrollTop !== avialableScrollTop
          ) {
            this.syncScrollY(
              { target: { scrollTop: avialableScrollTop }},
              true
            )
          } else if (
            scrollTop + deltaY < 0 &&
            scrollTop !== 0 /* 滚动为0限制*/
          ) {
            this.syncScrollY({ target: { scrollTop: 0 }}, true)
          } else {
            this.syncScrollY(
              { target: { scrollTop: scrollTop + deltaY }},
              true
            )
          }
        }
        if (deltaX !== 0) {
          if (
            scrollLeft + deltaX >= avialableScrollLeft &&
            scrollLeft !== avialableScrollLeft
          ) {
            this.syncScrollX(
              { target: { scrollLeft: avialableScrollLeft }},
              true
            )
          } else if (
            scrollLeft + deltaX < 0 &&
            scrollLeft !== 0 /* 滚动为0限制*/
          ) {
            this.syncScrollX({ target: { scrollLeft: 0 }}, true)
          } else {
            this.syncScrollX(
              { target: { scrollLeft: scrollLeft + deltaX }},
              true
            )
          }
        }
      })
    },
    // 同步fixleft和block的滚动
    syncScrollY(event, fake = false) {
      const { gantt_leftbar, gantt_table, gantt_scroll_y } = this.selector
      const topValue = event.target.scrollTop
      if (fake) {
        // 会触发一次真的滚动事件event, 后面的代码会在第二个事件中执行
        gantt_scroll_y.scrollTop = topValue
        return
      }
      gantt_leftbar.scrollTop = topValue
      gantt_table.scrollTop = topValue
      this.scrollTop = topValue
      this.$emit('scrollTop', topValue)
    },
    syncScrollX(event, fake = false) {
      const {
        gantt_table,
        gantt_timeline,
        gantt_markArea,
        gantt_scroll_x
      } = this.selector
      const leftValue = event.target.scrollLeft
      if (fake) {
        // 会触发一次真的滚动事件event, 后面的代码会在第二个事件中执行
        gantt_scroll_x.scrollLeft = leftValue
        return
      }
      gantt_table.scrollLeft = leftValue
      gantt_timeline.scrollLeft = leftValue
      gantt_markArea.style.left = '-' + leftValue + 'px'
      this.scrollLeft = leftValue
      this.$emit('scrollLeft', leftValue)
    }
  }
}
</script>

<style lang="scss">
@import "./gantt.scss";
</style>
