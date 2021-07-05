<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
// require('echarts/theme/macarons') // echarts theme
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '165px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
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
      this.setOptions(this.chartData.details)
    },
    setOptions(data) {
      this.chart.setOption({
        xAxis: {
          data: data.dataX,
          // position: 'top',
          // axisLabel: { show: false },
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },

        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          max: data.maxY,
          // axisLabel: { show: false },
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },
        series: [
          {
            name: data.name,
            itemStyle: {
              normal: {
                color: 'rgb(44,81,111,0.8)',
                lineStyle: {
                  color: 'rgb(44,81,111,0.8)',
                  width: 0
                },
                areaStyle: {
                  color: '#797d86'
                }
              }
            },
            markLine: {
              symbol: 'none', // 去掉警戒线最后面的箭头
              label: {
                position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: data.maxFlow
              },
              data: [{
                silent: false, // 鼠标悬停事件  true没有，false有
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: 'dashed ',
                  color: 'yellow'
                },
                name: '柜台开放峰值：' + data.maxFlow,
                yAxis: data.maxFlow
              }]
            },
            symbolSize: 0,
            type: 'line',
            step: 'end',
            data: data.dataY
          }
        ]
      })
    }
  }
}
</script>
