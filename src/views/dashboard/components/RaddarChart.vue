<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
const animationDuration = 3000
export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '294px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: '#222b44',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          name: { show: true, textStyle: { fontSize: 12 }},
          indicator: [
            { name: '接机', max: 20000 },
            { name: '装卸', max: 20000 },
            { name: '登机', max: 20000 },
            { name: '行李分卸', max: 20000 },
            { name: '清洁', max: 20000 },
            { name: '配餐', max: 20000 },
            { name: '清水车', max: 20000 },
            { name: '行李分捡', max: 20000 },
            { name: '污水车', max: 20000 },
            { name: '加油', max: 20000 }
          ], center: ['50%', '50%']
        },
        legend: {
          right: '0',
          bottom: '0',
          itemGap: 5, // 间隔
          itemWidth: 6, // 图形宽度。
          itemHeight: 6, // 图形高度。
          orient: 'vertical',
          textStyle: { color: '#ccc' },
          data: ['']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1,
              color: 'rgba(135, 160, 84,0.9)'
            }
          },

          data: [
            {
              value: [15000, 15000, 16000, 18000, 17000, 15000, 16000, 17000, 16000, 17000],
              name: '各种指标',
              lineStyle: { // 单项线条样式。
                normal: {
                  color: '#fff'
                }
              }
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
