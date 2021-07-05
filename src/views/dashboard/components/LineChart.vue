<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    autoResize: {
      type: Boolean,
      default: true
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
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
    setOptions({ actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
      textStyle: {
          color: '#ccc'
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
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
          axisTick: {
            show: false
          }
        },
        legend: {
          textStyle:{
            color: '#fff'//字体颜色
          },
          data: ['工作量']
        },
        series: [
        {
          name: '工作量',
          smooth: true,
          type: 'line',
          color:'#ccc',
          itemStyle: {
            normal: {
              color: '#ccc',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#6c7782'
              }
            }
          },
          data: actualData,
          animationDuration: 1000,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>