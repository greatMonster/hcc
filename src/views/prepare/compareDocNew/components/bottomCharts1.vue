<template>
  <div class="body1">
    <!-- 底部图表展示区域 -->
    <div class="work-bottom">
      <div v-loading="loading" class="runtime-bottom" element-loading-text="数据读取中...">
        <div v-for="(item,i) in lineChartData1" :key="i">
          <div class="left">{{ item.role }}</div>
          <div class="right">
            <div v-for="(items,index2) in item.datas" :key="index2" class="datalist" :rowIndex="i" :colIndex="index2" @click="showEchart(items)">
              <p>{{ items.day }}</p>
              <line-chart :chart-data="item.datas[index2]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag class="charTitle" :title="lineChartDataBig.day" :visible.sync="dialogTableVisible" width="60%" center>
      <h3>
        <span v-if="Array.isArray(lineChartDataBig.kpi)">
          <div v-for="(item,index1) in lineChartDataBig.kpi" :key="index1" :style="{ color: item.color}">
            <i>{{ item.lineName }} :</i>
            <i>工作量覆盖率 : {{ item.coverage }}%</i>
            <i>工时利用率 : {{ item.usageRate }}%</i>
          </div>
        </span>
        <span v-else-if="lineChartDataBig.kpi">
          <i>{{ item.lineName }} :</i>
          <i>工作量覆盖率 : {{ lineChartDataBig.kpi.coverage }}%</i>
          <i>工时利用率 : {{ lineChartDataBig.kpi.usageRate }}%</i>
        </span>
      </h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px" />
    </el-dialog>
  </div>
</template>>

<script>
import LineChart from '@/components/echarts/LineChartcover'
import LineChartBig from '@/components/echarts/LineChartBigcover'
export default {
  name: 'BottomCharts',
  components: { LineChart, LineChartBig },
  props: {
    lineChartData: {
      type: Array,
      required: true,
      default: function() {
        return null
      }
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      lineChartDataBig: [],
      lineChartData1: this.lineChartData,
      dialogTableVisible: false,
      index: ''
    }
  },
  watch: {
    lineChartData: {
      handler: function(ee) {
        ee.array.forEach(element => {
          this.lineChartData1.push(element)
        })
        // console.log(ee, 6661)
      },
      deep: true,
      immediate: true
    },
    loading: {
      handler: function(ee) {
        console.log(ee, 6662)
      },
      immediate: true
    }
  },
  methods: {
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
