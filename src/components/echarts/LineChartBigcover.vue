<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
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
      handler: function () {
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
    setOptions({ expectedData, expectedData2, actualData, dataX, kpi } = {}) {
      this.chart.setOption({
        xAxis: {
          data: dataX,
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          },
          axisLabel: {
            // 文字斜
            interval: 23
            // rotate: 30
          }
        },
        grid: {
          left: 10,
          bottom: 10,
          right: 10,
          top: 25,
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
          offset: 5,
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },
        series: this.seriesData(this.chartData.aa, this.chartData.kpi)
      })
    },
    seriesData(data, data1) {
      var serie = []
      for (var i = 0; i < data.length; i++) {
        var item = null
        if (data[i].name === 'workLoad') {
          item = {
            symbol: '',
            symbolSize: 0,
            // name: data[i].name,
            name: '工作量',
            itemStyle: {
              normal: {
                color: data[i].backgroundColor,
                lineStyle: {
                  color: '#0a94bc',
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
                formatter: data1[0] ? data1[0].maxNum : '',
                show: data1[0] ? data1[0].warnLine : false
              },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dashed ',
                    color: 'yellow',
                    opacity: data1[0] ? (data1[0].warnLine ? 1 : 0) : 0
                  },
                  name: data1[0] ? data1[0].maxNum : '',
                  yAxis: data1[0] ? data1[0].maxNum : ''
                }
              ]
            },
            type: 'line',
            step: 'end',
            data: data[i].y
          }
          serie.push(item)
        } else {
          item = {
            symbol: '',
            symbolSize: 1,
            name: data[i].name,
            itemStyle: {
              normal: {
                color: data[i].backgroundColor,
                lineStyle: {
                  color: '#09f604',
                  width: 2
                },
                areaStyle: {
                  color: 'none',
                  opacity: 1
                }
              }
            },
            markLine: {
              symbol: 'none', // 去掉警戒线最后面的箭头
              label: {
                position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: data1[0] ? data1[0].maxNum : '',
                show: data1[0] ? data1[0].warnLine : false
              },
              lineStyle: {
                opacity: data1[0] ? (data1[0].warnLine ? 1 : 0) : 0
              },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dashed ',
                    color: 'yellow'
                  },
                  name: data1[0] ? data1[0].maxNum : '',
                  yAxis: data1[0] ? data1[0].maxNum : ''
                }
              ]
            },
            type: 'line',
            step: 'end',
            data: data[i].y
          }
          serie.push(item)
        }
      }
      return serie
    }
  }
}
</script>
