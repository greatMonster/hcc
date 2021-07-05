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
      default: '200px'
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
    setOptions({ expectedData, expectedData2, actualData, maxNum, totalWorkingHours, warnLine, titleShow, dataX, yName, firstName, secondName } = {}) {
      this.chart.setOption({
        xAxis: {
          neme: '时间',
          type: 'time',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          },
          axisLabel: {
            // interval: 23,
            formatter: function(data) {
              var time
              var hours = new Date(data).getHours()
              var minutes = new Date(data).getMinutes()
              time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes)
              return time
            }
          },
          splitLine: {
            show: false
          },
          interval: 3600 * 1000 * 2
        },
        grid: {
          left: 10,
          bottom: 10,
          right: 50,
          top: 40,
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
          name: yName,
          type: 'value',
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },
        series: [
          {
            name: firstName || '全覆盖模式',
            symbol: '',
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#e76b75',
                lineStyle: {
                  color: '#e76b75',
                  width: 1
                }
              }
            },
            type: 'line',
            step: 'end',
            data: expectedData
          },
          {
            name: '均衡模式',
            symbol: '',
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#67c23a',
                lineStyle: {
                  color: '#67c23a',
                  width: 1
                }
              }
            },
            type: 'line',
            step: 'end',
            data: expectedData2
          },
          {
            name: secondName || '',
            symbol: '',
            symbolSize: 0,
            type: 'line',
            step: 'end',
            itemStyle: {
              normal: {
                color: '#00c1ee',
                lineStyle: {
                  color: '#00c1ee',
                  width: 0
                },
                areaStyle: {
                  color: '#00c1ee'
                }
              }
            },
            markLine: {
              symbol: 'none', // 去掉警戒线最后面的箭头
              label: {
                position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: '峰值：' + maxNum
              },
              data: [
                {
                  silent: true, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dashed ',
                    color: 'yellow'
                  },
                  name: maxNum,
                  yAxis: maxNum
                }
              ]
            },
            data: actualData
          }
        ]
      })
    }
  }
}
</script>
