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
      default: '300px'
    },
    height: {
      type: String,
      default: '250px'
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
  watch: {
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
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
      this.setOptions(this.chartData)
    },
    setOptions({ number, dataX, maxY, maxFlow, size, name, xtitle, ytitle } = {}) {
      this.chart.setOption({
        xAxis: {
          name: xtitle || '时间',
          data: dataX,
          boundaryGap: false,
          axisLabel: {
            formatter: function(data) {
              var time
              var hours = new Date(data).getHours()
              time = hours < 10 ? '0' + hours : hours
              return time
            },
            // interval: size == 5 ? 24 : 12
            interval: size == 5 ? 24 : size == 30 ? 4 : size == 60 ? 2 : 24
          },
          splitLine: {
            show: false
          },
          axisLine: {
            onZero: true,
            lineStyle: {
              color: '#08f602'
            }
          }
        },
        grid: {
          left: '9%',
          right: '18%',
          bottom: '9%',
          top: '15%',
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
          name: ytitle || '',
          type: 'value',
          gridIndex: 0,
          max: maxY,
          position: 'left',
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#08f602'
            }
          }
        },
        series: [
          {
            name: name,
            symbol: 'none', // 原来为空字符串
            symbolSize: 1,
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
                formatter: maxFlow
              },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dashed ',
                    color: 'yellow'
                  },
                  name: '柜台开放峰值：' + maxFlow,
                  yAxis: maxFlow
                }
              ]
            },
            type: 'line',
            step: 'end',
            data: number
          }
        ]
      })
    }
  }
}
</script>
