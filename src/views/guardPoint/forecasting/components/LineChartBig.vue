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
      default: '380px'
    },
    height: {
      type: String,
      default: '500px'
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
  destroyed() {
    this.chartData = {}
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, expectedData2, isShow, legendData, actualData, dataX, actualDataName, expectedDataName, expectedDataName2, waitList, realWaitList, maxY, maxWaitTime, leftMax, leftMax2, rightMax, max1Y, max2Y, max3Y } = {}) {
      this.chart.setOption({
        legend: {
          show: !!isShow,
          data: legendData,
          textStyle: {
            color: 'white'
          }
        },
        xAxis: [
          {
            type: 'time',
            // data: dataX,
            boundaryGap: false,
            axisLabel: {
              // show: false,
              // rotate: 30,
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
            interval: 3600 * 1000 * 2,
            axisLine: {
              onZero: true,
              lineStyle: {
                color: '#08f602'
              }
            }
          },
          {
            type: 'time',
            // show: false,
            // data: dataX,
            gridIndex: 1,
            axisLabel: {
              show: false,
              rotate: 30,
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
            interval: 3600 * 1000 * 2,
            boundaryGap: false,
            axisLine: {
              onZero: true,
              lineStyle: {
                color: '#08f602'
              }
            },
            position: 'top'
          }
        ],
        grid: [
          {
            left: '12%',
            right: '12%',
            bottom: 10,
            top: 50,
            height: '35%'
            // containLabel: true
          },
          {
            left: '12%',
            right: '12%',
            gridIndex: 1,
            top: '55%',
            height: '35%'
            // containLabel: true
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            name: '人数/人',
            type: 'value',
            gridIndex: 0,
            // max: Math.floor[(leftMax * (leftMax2 / leftMax) * 100) / 100],
            // interval: Math.floor[(((leftMax * (leftMax2 / leftMax)) / 5) * 100) / 100],
            max: max1Y,
            interval: Math.floor(max1Y / 5),
            position: 'left',
            splitLine: { show: false }, // 去除网格线
            axisLine: {
              lineStyle: {
                color: '#08f602'
              }
            }
          },
          {
            name: expectedDataName2,
            type: 'value',
            gridIndex: 0,
            // max: Math.floor[(rightMax * (leftMax2 / leftMax) * 100) / 100],
            // interval: Math.floor[(rightMax * (leftMax2 / leftMax)) / 5],
            max: max2Y,
            position: 'right',
            offset: 5,
            splitLine: { show: false }, // 去除网格线
            axisLine: {
              lineStyle: {
                color: '#08f602'
              }
            }
          },
          {
            gridIndex: 1,
            name: '排队时间(min)',
            type: 'value',
            position: 'left',
            min: 0,
            max: maxY,
            interval: maxY / 5,
            splitLine: { show: false }, // 去除网格线
            axisLine: {
              lineStyle: {
                color: '#08f602'
              }
            },
            inverse: true
          },
          {
            // name: expectedDataName2,
            show: false,
            type: 'value',
            gridIndex: 1,
            min: 0,
            max: 10,
            interval: Math.floor[(rightMax * (leftMax2 / leftMax)) / 5],
            position: 'right',
            offset: 5,
            splitLine: { show: false }, // 去除网格线
            axisLine: {
              lineStyle: {
                color: '#08f602'
              }
            },
            inverse: true
          }
        ],
        series: [
          {
            name: expectedDataName,
            symbol: '',
            symbolSize: 2,
            itemStyle: {
              normal: {
                color: '#00c1ee',
                lineStyle: {
                  color: '#00c1ee',
                  width: 2
                }
              }
            },
            type: 'line',
            step: expectedDataName,
            data: expectedData
          },
          {
            name: actualDataName,
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
            type: 'line',
            step: actualData,
            data: actualData
          },
          {
            name: expectedDataName2,
            yAxisIndex: 1,
            symbol: '',
            symbolSize: 0,
            type: 'line',
            position: 'right',
            step: actualDataName,
            itemStyle: {
              normal: {
                color: '#00c1ee',
                lineStyle: {
                  color: '#00c1ee',
                  width: 0
                }
                // areaStyle: {
                //   color: '#000'
                // }
              }
            },
            data: expectedData2
          },
          {
            name: '预计排队时间',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 2,
            symbol: '',
            symbolSize: 2,
            itemStyle: {
              normal: {
                color: '#797d86',
                lineStyle: {
                  color: '#797d86',
                  width: 2
                }
              }
            },
            // hoverAnimation: false,
            step: actualDataName,
            data: waitList,
            markLine: {
              silent: false,
              symbol: 'none',
              data: [
                {
                  yAxis: maxWaitTime
                }
              ],
              label: {
                normal: {
                  formatter: maxWaitTime // 这儿设置基线名称
                }
              },
              lineStyle: {
                normal: {
                  type: 'solid',
                  color: 'red' // 这儿设置基线颜色
                }
              }
            }
          },
          {
            name: '实时排队时间',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 2,
            symbol: '',
            symbolSize: 2,
            itemStyle: {
              normal: {
                color: '#00c1ee',
                lineStyle: {
                  color: '#00c1ee',
                  width: 2
                }
              }
            },
            // hoverAnimation: false,
            step: actualDataName,
            data: realWaitList
          }
        ]
      })
    }
  }
}
</script>
