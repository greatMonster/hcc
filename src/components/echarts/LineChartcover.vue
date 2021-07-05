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
    setOptions(y) {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.dataX,
          // position: 'top',
          axisLabel: {
            interval: 35,
            formatter: function (data) {
              return data.substring(0, 2)
            }
          },
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 10,
          top: 20,
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
          max: this.chartData.maxRosterNum,
          // axisLabel: { show: false },
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#09f604'
            }
          }
        },
        series: this.seriesData(this.chartData.aa, this.chartData.kpi)
        // [
        // {
        //   name: '全覆盖模式',
        //   itemStyle: {
        //     normal: {
        //       color: '#e76b75',
        //       lineStyle: {
        //         color: '#e76b75',
        //         width: 1
        //       }
        //     }
        //   },
        //   type: 'line',
        //   step: '人员',
        //   data: this.chartData.expectedData
        // },
        // {
        //   name: '均衡模式',
        //   itemStyle: {
        //     normal: {
        //       color: '#67c23a',
        //       lineStyle: {
        //         color: '#67c23a',
        //         width: 1
        //       }
        //     }
        //   },
        //   type: 'line',
        //   step: '人员',
        //   data: this.chartData.expectedData2
        // },
        // {
        //   name: '人员3',
        //   itemStyle: {
        //     normal: {
        //       color: '#d48265',
        //       lineStyle: {
        //         color: '#d48265',
        //         width: 1
        //       }
        //     }
        //   },
        //   type: 'line',
        //   step: '人员',
        //   data: this.chartData.expectedData3
        // },
        // {
        //   name: '人员4',
        //   itemStyle: {
        //     normal: {
        //       color: '#92c7ae',
        //       lineStyle: {
        //         color: '#92c7ae',
        //         width: 1
        //       }
        //     }
        //   },
        //   type: 'line',
        //   step: '人员',
        //   data: this.chartData.expectedData4
        // },
        // {
        //   name: '工作量',
        //   type: 'line',
        //   step: '工作量',
        //   symbol: 'none',
        //   itemStyle: {
        //     normal: {
        //       color: '#00c1ee',
        //       lineStyle: {
        //         color: '#00c1ee',
        //         width: 0
        //       },
        //       areaStyle: {
        //         color: '#00c1ee'
        //       }
        //     }
        //   },
        //   data: this.chartData.actualData
        // }
        // ]
      })
    },
    seriesData(data, data1) {
      var serie = []
      // console.log(data1, 666777)
      for (var i = 0; i < data.length; i++) {
        if (data[i].name === 'workLoad') {
          var item = {
            symbol: '',
            symbolSize: 0,
            // name: data[i].name,
            name: '工作量',
            itemStyle: {
              normal: {
                color: data[i].backgroundColor,
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
                formatter: data1[0] ? data1[0].maxNum : '',
                show: false
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
        } else {
          var item2 = {
            symbol: '',
            symbolSize: 0,
            name: data[i].name,
            itemStyle: {
              normal: {
                color: data[i].backgroundColor
              }
            },
            markLine: {
              symbol: 'none', // 去掉警戒线最后面的箭头
              label: {
                position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: data1[0] ? data1[0].maxNum : '',
                show: data1[0].warnLine
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

          serie.push(item2)
        }
      }
      return serie
    }
  }
}
</script>
