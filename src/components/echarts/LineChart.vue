<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
// import { number } from 'echarts/lib/export'
// require('echarts/theme/macarons') // echarts theme
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    id: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '250px',
    },
    height: {
      type: String,
      default: '200px',
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
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
    setOptions({ expectedData, actualData, expectedData2, expectedData3, expectedData4, maxNum, warnLine, dataX, yName, firstName, secondName, maxNumAll } = {}) {
      this.chart.setOption({
        xAxis: {
          name: '时间',
          type: 'time',
          data: dataX,
          boundaryGap: false,
          axisLine: {
            onZero: true,
            lineStyle: {
              color: '#09f604',
            },
          },
          axisLabel: {
            // interval: 36,
            formatter: function (data) {
              var time
              var hours = new Date(data).getHours()
              time = hours < 10 ? '0' + hours : hours
              return time
            },
          },
          splitLine: {
            show: false,
          },
          interval: 3600 * 1000 * 3,
        },

        grid: {
          left: 10,
          right: 50,
          bottom: 10,
          top: 40,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          name: yName,
          type: 'value',
          // axisLabel: { show: false },
          max: maxNumAll,
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: '#09f604',
            },
          },
        },
        series: [
          {
            name: firstName || '全覆盖模式',
            symbolSize: 0,
            itemStyle: {
              normal: {
                color: '#e76b75',
                lineStyle: {
                  color: '#e76b75',
                  width: 1,
                },
              },
            },
            type: 'line',
            step: 'end',
            data: expectedData,
          },

          {
            name: '均衡模式',
            itemStyle: {
              normal: {
                color: '#67c23a',
                lineStyle: {
                  color: '#67c23a',
                  width: 1,
                },
              },
            },
            type: 'line',
            step: 'end',
            data: expectedData2,
          },
          {
            name: '人员3',
            itemStyle: {
              normal: {
                color: '#d48265',
                lineStyle: {
                  color: '#d48265',
                  width: 1,
                },
              },
            },
            type: 'line',
            step: 'end',
            data: expectedData3,
          },
          {
            name: '人员4',
            itemStyle: {
              normal: {
                color: '#92c7ae',
                lineStyle: {
                  color: '#92c7ae',
                  width: 1,
                },
              },
            },
            type: 'line',
            step: 'end',
            data: expectedData4,
          },
          {
            name: secondName || '',
            type: 'line',
            step: 'end',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#00c1ee',
                lineStyle: {
                  color: '#00c1ee',
                  width: 0,
                },
                areaStyle: {
                  color: '#00c1ee',
                },
              },
            },

            markLine: {
              symbol: 'none', // 去掉警戒线最后面的箭头
              label: {
                position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                formatter: maxNum,
              },

              data: [
                {
                  silent: true, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dashed ',
                    color: 'yellow',
                  },
                  name: maxNum,
                  yAxis: maxNum,
                },
              ],
            },
            data: actualData,
          },
        ],
      })
    },
  },
}
</script>
