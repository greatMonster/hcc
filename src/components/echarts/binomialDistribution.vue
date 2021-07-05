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
      default: '250px'
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
  //   mounted() {
  //     this.initChart()
  //   },
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
    setOptions({ datax, datay } = {}) {
      this.chart.setOption({
        xAxis: {
          data: datax,
          boundaryGap: false,
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
          right: '15%',
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
          type: 'value',
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
            symbol: 'none', // 原来为空字符串
            symbolSize: 1,
            type: 'line',
            smooth: true,
            data: datay
          }
        ]
      })
    }
  }
}
</script>
