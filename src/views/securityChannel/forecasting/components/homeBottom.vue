<template>
  <div>
    <div v-loading="chartDataObject.loading" element-loading-text="计算中..." style="min-height:300px;font-size:14px;" class="runtime-bottom">
      <div class="chart-search">
        <el-switch v-model="switchValue" active-text="按日显示" inactive-text="按周显示" @change="switchChange" />
        <span v-if="dayShow" style="margin-left:20px">
          <label>日期</label>
          <el-date-picker v-model="time" size="small" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </span>
        <span style="margin-left: 20px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="Prediction" />
        </span>
        <span style="margin-left: 20px">
          <el-button type="info" size="small" @click="restart">重新计算</el-button>
        </span>
      </div>
      <div class="right" style="width:100%">
        <div v-if="chartDataObject.noEcharts" class="bottom-nodata">暂无数据</div>
        <div v-for="(item,i) in chartDataObject.lineChartData" :key="i" class="datalist" style="margin-right:20px;cursor:pointer" :rowIndex="i" :colIndex="i">
          <p>{{ item.day }}</p>
          <div @click="showEchart(item)">
            <LineChartBig :chart-data="item" />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.day" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <LineChartBigTwo :chart-data="lineChartDataBig" style="width:100%;height:600px;cursor:pointer" />
    </el-dialog>
  </div>
</template>

<script>
import LineChartBig from '@/components/echarts/checkinEcharts/LineChartBig'
import LineChartBigTwo from '@/components/echarts/checkinEcharts/LineChartBigTwo'
import { produceMonSun } from '@/utils/monSun'
export default {
  name: 'HomeBottom',
  components: { LineChartBig, LineChartBigTwo },
  props: {
    lineChartObject: {
      type: Object,
      required: true,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      switchValue: false,
      dayShow: false,
      time: [],
      byDate: [],
      noEcharts: false,
      lineChartDataBig: {},
      dialogTableVisible: false,
      loading: false,
      lineChartData: [],
      Mon: '',
      Sun: '',
      chartDataObject: {}
    }
  },
  watch: {
    lineChartObject: {
      handler: function() {
        this.initData()
      },
      deep: true
    }
  },
  created() {
    this.produceMonSun()
  },
  methods: {
    initData() {
      this.chartDataObject = this.lineChartObject
      console.log(this.chartDataObject, 'bottom')
    },
    produceMonSun() {
      var Stamp
      Stamp = new Date()
      var num1 = 7 - Stamp.getDay() + 1
      var num2 = 7 - Stamp.getDay() + 7
      this.Mon = produceMonSun(num1)
      this.Sun = produceMonSun(num2)
    },
    switchChange(e) {
      this.time = []
      if (e) {
        this.dayShow = true
        this.time.push(this.Mon, this.Sun)
      } else {
        this.dayShow = false
      }
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.lineChartDataBig.isShow = true
      this.lineChartDataBig.legendData = ['预计到达旅客', '柜台开放数', '可通过人数', '预计排队时间']
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      if (this.lineChartDataBig) {
        this.lineChartDataBig = {}
      }
      this.dialogTableVisible = false
      // location.reload()
    },
    restart() {
      var paramData = {
        switchValue: this.switchValue,
        time: this.time,
        paramName: 'restart'
      }
      this.$emit('calculate', paramData)
    },
    Prediction() {
      var paramData = {
        switchValue: this.switchValue,
        time: this.time,
        paramName: 'search'
      }
      this.$emit('calculate', paramData)
    }
  }
}
</script>

<style scoped>
.chart-search {
  margin-bottom: 15px;
}
.bottom-nodata {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
</style>
