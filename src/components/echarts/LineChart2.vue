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
      default: '190px'
    },
    height: {
      type: String,
      default: '200px'
    }, chartData: {
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
    setOptions({ expectedData, actualData, expectedData2, expectedData3, expectedData4, dataX } = {}) {
      this.chart.setOption({
        xAxis: {
          data: dataX,
          position: 'top',
          axisLabel: { show: false },
          axisLine: {
            lineStyle: {
              color: '#232c47'
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
          axisLabel: { show: false },
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#232c47'
            }
          }
        },
        series: [{
          name: '全覆盖模式',
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
          name: '人员3',
          itemStyle: {
            normal: {
              color: '#d48265',
              lineStyle: {
                color: '#d48265',
                width: 1
              }
            }
          },
          type: 'line',
          step: 'end',
          data: expectedData3
        },
        {
          name: '人员4',
          itemStyle: {
            normal: {
              color: '#92c7ae',
              lineStyle: {
                color: '#92c7ae',
                width: 1
              }
            }
          },
          type: 'line',
          step: 'end',
          data: expectedData4
        },
        {
          name: '工作量',
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
          data: actualData
        }]
      })
    }
  }
}
</script>
