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
      default: '160px'
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
        xAxis: [
          {
            type: '',
            data: ['接机', '登机', '清洁', '清水车', '污水车', '装卸', '行李分卸'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        textStyle: {
          color: '#ccc'
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 0,
          top: 10,
          containLabel: true,
          borderColor: '#000'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [2, 2]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          textStyle: {
            color: '#fff'// 字体颜色
          },
          data: ['工作量']
        },
        series: [
          {
            name: '工作量',
            smooth: true,
            type: 'bar',
            barWidth: '20%',
            color: '#87a054',
            data: actualData,
            animationDuration: 1000,
            animationEasing: 'quadraticOut'
          }]
      })
    }
  }
}
</script>
