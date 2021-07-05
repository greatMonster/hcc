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
      default: '350px'
    },
    height: {
      type: String,
      default: '300px'
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
    setOptions({ expectedData, expectedData2, actualData, dataX, actualDataName, expectedDataName, expectedDataName2, leftMax, leftMax2, rightMax } = {}) {
      this.chart.setOption({
        xAxis: {
          data: dataX,
          axisLine: {
            lineStyle: {
              color: '#08f602'
            }
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: 10,
          top: 50,
          containLabel: true
        },
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
            max: Math.floor[(leftMax * (leftMax2 / leftMax) * 100) / 100],
            interval: Math.floor[(((leftMax * (leftMax2 / leftMax)) / 5) * 100) / 100],
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
            max: Math.floor[(rightMax * (leftMax2 / leftMax) * 100) / 100],
            interval: Math.floor[(rightMax * (leftMax2 / leftMax)) / 5],
            position: 'right',
            offset: 5,
            splitLine: { show: false }, // 去除网格线
            axisLine: {
              lineStyle: {
                color: '#08f602'
              }
            }
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
          }
        ]
      })
    }
  }
}
</script>
