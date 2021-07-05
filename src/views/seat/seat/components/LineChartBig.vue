<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// import resize from './mixins/resize'
// require('echarts/theme/macarons') // echarts theme
export default {
  // mixins: [resize],
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
    setOptions({ expectedData, expectedData2, actualData, dataX } = {}) {
      this.chart.setOption({
        xAxis: {
          data: dataX,
          axisLine: {
            lineStyle: {
              color: '#666'
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
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        series: [{
          name: '预估通过人数',
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
          step: '人员',
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
          step: '人员',
          data: expectedData2
        },
        {
          name: '南京机场国际人数分布',
          symbol: '',
          symbolSize: 0,
          type: 'line',
          step: '工作量',
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
