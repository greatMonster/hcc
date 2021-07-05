<template>
  <div class="charts-box">
    <div class="coverage">覆盖</div>
    <div class="charts-display">
      <div class="workload">
        <div class="workload-top">
          <div>从</div>
          <div class="span-value">
            <el-date-picker
              v-model="workloadDate"
              type="date"
              placeholder="选择日期"
              default-value="2019-04-15"
              class="recycle-button"
            />
          </div>
          <div class="span-value">开始 为期</div>
          <div class="span-value">
            <el-select v-model="workloadSlect" placeholder="请选择" class="particle-button">
              <el-option
                v-for="item in workloadSlectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="span-value">的工作量</div>
        </div>
        <div class="workload-bottom">
          <div id="myChart" :style="{width: '300px', height: '300px'}" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartsDisplay',
  data() {
    return {
      workloadDate: '',
      workloadSlect: '',
      workloadSlectList: [{ value: 'workloadSlectList1', label: '一周' }, { value: 'workloadSlectList2', label: '两周' }]
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#1B2541',
        textStyle: {
          color: 'white'
        },

        tooltip: {},
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
        },
        yAxis: {},
        series: [
          {
            name: '工作量曲线',
            type: 'line',
            data: [5, 10, 10, 10, 25, 35, 35, 20, 20, 40, 40, 40, 10, 10, 10, 10, 5, 1]
          },
          {
            name: '覆盖量曲线',
            type: 'line',
            data: [1, 5, 5, 5, 15, 15, 15, 15, 15, 45, 45, 45, 10, 10, 5, 1]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
    .workload {
    width: 100%;
    height: 100%;
    }
    .workload-top {
    display: flex;
    width: 100%;
    height: 60px;
    align-items: center;
    box-sizing: border-box;
    padding-left: 10px;
    }
    .span-value {
    margin-left: 10px;
    margin-right: 10px;
    }
    .workload-bottom {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 10px;
    border-top: 2px solid #4f566b;
    }
    .coverage {
        width: 100%;
        height: 40px;
        line-height: 20px;
        box-sizing: border-box;
        padding: 10px;
        color: white;
        background-color: #263257;
    }
    .charts-display {
        width: 100%;
        height: 100%;
        background-color: #232C47;
        color: white;
    }
</style>
