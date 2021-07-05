<template>
  <div class="dashboard-editor-container">

    <template v-for="(item,i) in lineChartData">
      <line-chart :key="i" :chart-data="item" />
    </template>

  </div>
</template>

<script>
import LineChart from '@/components/echarts/LineChart'

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart
  },
  data() {
    return {
      lineChartData: []
    }
  },
  created() {
    const data = [
      {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      }
    ]
    this.lineChartData = data
  },
  methods: {
    // handleSetLineChartData(type) {
    //    this.lineChartData = lineChartData[type];
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
