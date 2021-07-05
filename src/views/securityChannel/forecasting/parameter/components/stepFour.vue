<template>
  <div>
    <div class="search">
      <el-card :body-style="{ padding: '0px' }" class="box-card">
        <div class="seach-content">
          <!-- <div class="search-content-item">
            <div style="width:33%;letter-spacing:1px">
              值机处理速率(人/小时)
              <span style="color: #87a054">{{ passRate }}</span>
            </div>
            <div style="width:33%;letter-spacing:1px">
              最大排队时间(分钟)
              <span style="color: #87a054">{{ maxQueuingTime }}</span>
            </div>
            <div style="width:33%;letter-spacing:1px">
              柜台最小开放时间(分钟)
              <span style="color: #87a054">{{ minDeskOpenTime }}</span>
            </div>
          </div>-->
          <div class="search-content-item">
            <div class="item1">值机处理速率(人/小时)</div>
            <div class="item2">
              <span style="color: #87a054">&nbsp;{{ passRate }}</span>
            </div>
          </div>
          <div class="search-content-item">
            <div class="item1">最大排队时间(分钟)</div>
            <div class="item2">
              <span style="color: #87a054">&nbsp;{{ maxQueuingTime }}</span>
            </div>
          </div>
          <div class="search-content-item">
            <div class="item1">柜台最小开放时间(分钟)</div>
            <div class="item2">
              <span style="color: #87a054">&nbsp;{{ minDeskOpenTime }}</span>
            </div>
          </div>
          <div class="search-content-item">
            <div class="item1">旅客流量名称</div>
            <div class="item2" style="color: #87a054">
              <span v-for="(item, index) in travelorName" :key="index" class="travelor-style" @click="travelorJump(index, item.id)">{{ item.name }}</span>
            </div>
          </div>
          <div class="search-content-item itemLast">
            <div class="item1">值机柜台列表</div>
            <div class="item2" style="color: #87a054">
              <div v-if="deskList.length > 5">
                <span v-for="(item, index) in deskList.slice(0, 5)" :key="index" class="desk-style">{{ item.name }}</span>
                <span>…</span>
              </div>
              <div v-else>
                <span v-for="(item, index) in deskList" :key="index" class="desk-style">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div v-loading="loading" element-loading-text="计算中..." style="min-height: 300px; font-size: 14px" class="runtime-bottom">
      <div class="chart-search">
        <el-switch v-model="switchValue" active-text="按日显示" inactive-text="按周显示" @change="switchChange" />
        <span v-if="dayShow" style="margin-left: 20px">
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
      <div class="right" style="width: 100%">
        <div v-if="noEcharts" class="bottom-nodata">暂无数据</div>
        <div v-for="(item, i) in lineChartData" :key="i" class="datalist" style="margin-right: 20px; cursor: pointer" :rowIndex="i" :colIndex="i">
          <p>{{ item.day }}</p>
          <div @click="showEchart(item)">
            <LineChartBig :chart-data="item" />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.day" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <LineChartBigTwo :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
    </el-dialog>
  </div>
</template>

<script>
import LineChartBig from '@/components/echarts/checkinEcharts/LineChartBig'
import LineChartBigTwo from '@/components/echarts/checkinEcharts/LineChartBigTwo'
import { produceMonSun } from '@/utils/monSun'
// import { initable, Prediction, reCalculate } from '@/api/checkInNewHome'
import { detailList, Prediction, reCalculate } from '@/apiNew/securityChannel'
export default {
  name: 'SecurityChannel',
  components: { LineChartBig, LineChartBigTwo },
  props: {
    addParamIdJump: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      switchValue: false,
      dayShow: false,
      time: [],
      byDate: [],
      noEcharts: false,
      passRate: '',
      maxQueuingTime: '',
      minDeskOpenTime: '',
      defaultId: ['10'],
      travelorName: [],
      deskList: [],
      lineChartDataBig: {},
      dialogTableVisible: false,
      intlType: '',
      dataList: {},
      loading: false,
      lineChartData: [],
      list: [],
      baseData: [],
      regions: [],
      Mon: '',
      Sun: '',
      timer: '',
      paramId: this.$route.query.id,
      addParamId: this.addParamIdJump
    }
  },
  watch: {
    value(val) {
      this.value = val
    },
    addParamIdJump: {
      handler: function () {
        console.log(this.addParamIdJump)
        this.restart()
        console.log(555)
      },
      deep: true
    }
  },
  created() {
    this.preMonSun()
    this.restart()
    // this.Prediction()
    this.initable()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
      this.timer = ''
    }
  },
  methods: {
    preMonSun() {
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
    initable() {
      // 获取基础数据
      // var data = {
      //   id: this.paramId || this.addParamId
      // }
      this.baseData = []
      const data = {
        intlType: this.paramId || this.addParamId,
        airportId: this.airport.airportId
      }
      detailList(data)
        .then((response) => {
          // if (response.data.code === '200') {
          if (response.data.data.length !== 0) {
            this.passRate = response.data.data ? response.data.data.passRate : '--'
            this.minDeskOpenTime = response.data.data ? response.data.data.minDeskOpenTime : '--'
            this.maxQueuingTime = response.data.data ? response.data.data.maxQueuingTime : '--'
            this.travelorName = response.data.data.traffics
            this.deskList = response.data.data.desks
          } else {
            this.$message.success('暂无核心参数数据')
          }
          // } else {
          //   this.$message({
          //     type: 'error',
          //     showClose: true,
          //     message: response.message
          //   })
          // }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: e.response.data.message
          })
        })
    },
    Prediction() {
      clearInterval(this.timer)
      this.timer = null
      var _this = this
      var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      // 渲染图表
      var data = {
        id: this.paramId || this.addParamId,
        // id: '30',
        showType: this.switchValue ? 'daily' : 'weekly',
        beginDate: this.time[0] || '',
        endDate: this.time[1] || '',
        airportId: this.airport.airportId
      }
      this.loading = true
      this.lineChartData = []
      this.dataList = {}
      Prediction(data)
        .then((response) => {
          if (response.data.code === 'ok') {
            if (response.data) {
              this.dataList = response.data
            }
            this.loading = false
            if (response.data.data) {
              if (response.data.data.points) {
                this.noEcharts = false
                Object.keys(response.data.data.points).forEach(function (cur2) {
                  var object = {}
                  var myDate = ''
                  _this.byDate.push(cur2)
                  object.datas = {}
                  object.datas.actualData = []
                  object.datas.expectedData2 = []
                  object.datas.expectedData = []
                  object.datas.waitList = []
                  object.datas.dataX = []
                  object.datas.actualDataName = '预计到达旅客'
                  object.datas.expectedDataName = '可通过人数'
                  object.datas.expectedDataName2 = '柜台开放数'
                  object.datas.max3Y = response.data.data.maxDesks[cur2]
                  if (!_this.switchValue) {
                    myDate = new Date(Date.parse(cur2.replace(/-/g, ' / ')))
                    object.datas.day = weekDay[myDate.getDay()]
                  } else {
                    object.datas.day = cur2
                  }
                  response.data.data.points[cur2].forEach((element) => {
                    object.datas.actualData.push({ name: element.time, value: [element.time, element.passengerNumber] })
                    object.datas.expectedData.push({ name: element.time, value: [element.time, element.deskCapacity] })
                    object.datas.expectedData2.push({ name: element.time, value: [element.time, element.deskNumber] })
                    object.datas.waitList.push({ name: element.time, value: [element.time, element.waitTime] })
                    object.datas.dataX.push(element.time.substring(10, 16))
                  })
                  object.datas.leftMax2 = Math.max.apply(null, object.datas.actualData)
                  object.datas.leftMax = Math.max.apply(null, object.datas.expectedData)
                  object.datas.rightMax = Math.max.apply(null, object.datas.expectedData2)
                  object.datas.maxWaitTime = response.data.data.maxWaitTime
                  object.datas.maxY = response.data.data.yMax
                  object.datas.max1Y = response.data.data.y1Max
                  object.datas.max2Y = response.data.data.y2Max
                  _this.lineChartData.push(object.datas)
                })
              } else {
                clearInterval(this.timer)
                this.noEcharts = true
                this.$message.success('暂无图表数据！')
              }
            } else {
              console.log('buok')
            }
          } else if (response.data.code === 'running') {
            // code为running时轮询查询该接口，直至查询成功
            this.timer = setInterval(() => {
              this.Prediction()
              this.loading = true
            }, 60000)
          } else {
            clearInterval(this.timer)
            this.loading = false
            this.$message.error(response.data.message)
          }
        })
        .catch((e) => {
          this.noEcharts = false
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    travelorJump(index, id) {
      this.$router.push({ path: '/dispatching/securityChannel/detailsPage', query: { id: id } })
    },
    restart() {
      this.addParamId = this.addParamIdJump
      var data = {
        id: this.paramId || this.addParamId,
        airportId: this.airport.airportId
      }
      reCalculate(data)
        .then((response) => {
          this.Prediction()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  background-color: #172449;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}
.search /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}
.search /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.seach-content {
  width: 96%;
  height: 100%;
  padding: 10px 10px;
  margin: 0 auto;
}
.bottom-nodata {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
.search-content-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}
.search-content-item .item1 {
  width: 20%;
  letter-spacing: 1px;
}
.search-content-item .item2 {
  width: 80%;
  letter-spacing: 1px;
}
.itemLast {
  margin-bottom: 10px;
}
.travelor-style {
  padding-left: 5px;
  color: #8ba0ef;
}
.travelor-style:hover {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.desk-style {
  padding-left: 5px;
}
.card-button {
  text-align: center;
  border-top: 1px solid #425079;
  padding: 10px 0;
}
.chart-search {
  margin-bottom: 15px;
}
.waitTime {
  cursor: pointer;
  text-align: center;
  font-size: 13px;
}
.waitTime:hover {
  text-decoration: underline;
  color: #6f9fd0;
}
.green {
  color: #87a054;
}
</style>
