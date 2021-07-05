<template>
  <div class="warp">
    <div class="search">
      <!-- <label>机场：</label>
      <el-select v-model="siteId" placeholder="请选择" style="width: 160px" size="small" @change="siteChange">
        <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <label>柜台服务参数：</label>
      <el-select v-model="intlType" style="width: 160px" size="small" placeholder="请选择" @change="change2">
        <el-option v-for="item in regions" :key="item.id" :label="item.composeName" :value="item.id" />
      </el-select>
      <!-- <el-button type="info" size="small" @click="openBaseData">旅客流量</el-button>
      <el-button type="info" size="small" @click="openBaseData2">预测参数</el-button>-->
    </div>
    <!-- <home-middle :base-data="baseData" /> -->
    <div class="search">
      <el-card :body-style="{ padding: '0px' }" class="box-card">
        <div slot="header" class="clearfix">
          <el-button style="float: right" size="small" type="primary" @click="paraModify">修 改</el-button>
        </div>
        <div class="seach-content">
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
          <div class="search-content-item">
            <div class="item1">开始与结束日期</div>
            <div class="item2" style="color: #87a054">
              <span>{{ dateRange }}</span>
            </div>
          </div>
          <div class="search-content-item itemLast">
            <div class="item1">值机柜台列表(共{{ deskList.length }}个)</div>
            <div class="item2" style="color: #87a054">
              <div v-if="deskList.length > 5">
                <!-- <el-popover placement="top-start" trigger="hover">
                  <div>共{{ deskList.length }}柜台</div> -->
                <div>
                  <span v-for="(item, index) in deskList.slice(0, 5)" :key="index" class="desk-style">{{ item.name }}</span>
                  <span>...</span>
                </div>
                <!-- </el-popover> -->
              </div>
              <div v-else>
                <span v-for="(item, index) in deskList" :key="index" class="desk-style">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="runtime-bottom">
      <div v-if="offon" class="chart-search">
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
        <span style="margin-left: 20px; float: right">
          <el-button type="primary" size="small" @click="printCLick">打 印</el-button>
        </span>
      </div>
      <div v-else class="chart-search">
        <span style="margin-left: 20px">
          <el-button type="info" size="small" @click="stopClick">停止计算</el-button>
        </span>
        <span style="margin-left: 20px; float: right">
          <el-button type="primary" size="small" @click="printCLick">打 印</el-button>
        </span>
      </div>
      <div ref="print1" v-loading="loading" class="results right" element-loading-text="计算中..." style="min-height: 300px; font-size: 14px">
        <div v-if="noEcharts" class="bottom-nodata">暂无数据</div>
        <div v-for="(item, i) in lineChartData" :key="i" class="datalist" style="margin-right: 20px; cursor: pointer" :rowIndex="i" :colIndex="i">
          <p>{{ item.day }}</p>
          <div @click="showEchart(item)">
            <LineChartBig :chart-data="item" />
          </div>
          <p>{{ item.addDeskNums }}</p>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.day" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <p style="text-align: right; color: #cf9225">
        柜台服务标准完成率：{{ lineChartDataBig.satisfactionPercentage }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出港航班数：{{ lineChartDataBig.totalNumber
        }}<el-button type="info" size="mini" style="margin-left: 5px" @click="deskListCLick(lineChartDataBig.deskList)">值机柜台开放列表</el-button>
      </p>
      <LineChartBigTwo :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
    </el-dialog>
    <!-- 柜台开放列表 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.day" width="50%" :visible.sync="deskTableVisible" center>
      <el-table :data="tableData" border :header-row-style="{ 'background-color': 'rgb(10, 20, 47)' }" height="300" :row-style="{ 'background-color': '#232c47' }" style="width: 100%; color: white">
        <el-table-column prop="deskCode" label="柜台编号" />
        <el-table-column prop="startTime" label="开放时间">
          <template slot-scope="scope">
            {{ scope.row.startTime.substring(10, 16) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="关闭时间">
          <template slot-scope="scope">
            {{ scope.row.endTime.substring(10, 16) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import LineChartBig from '@/components/echarts/checkinEcharts/LineChartBig'
import LineChartBigTwo from '@/components/echarts/checkinEcharts/LineChartBigTwo'
// import homeMiddle from '../components/homeMiddle'
import { initAirpot } from '@/api/basecheckinData'
import { produceMonSun } from '@/utils/monSun'
import { parameterList, initable, Prediction, reCalculate, stopClick } from '@/api/checkInNewHome'
export default {
  name: 'SecurityChannel',
  components: { LineChartBig, LineChartBigTwo },
  data() {
    return {
      airport: this.$store.state.user.airport,
      tableData: [],
      deskTableVisible: false,
      switchValue: false,
      dayShow: false,
      time: [],
      offon: false,
      byDate: [],
      noEcharts: false,
      passRate: '',
      maxQueuingTime: '',
      minDeskOpenTime: '',
      dateRange: '',
      defaultId: ['10'],
      travelorName: [],
      deskList: [],
      jiuyuanShow: true,
      lineChartDataBig: {},
      dialogTableVisible: false,
      optionsSiteId: [],
      siteId: '',
      carriers: '',
      deskServiceTypee: '',
      intlType: '',
      flag: 'F', // 默认f 是数据没有改变不需要重新计算
      value: ['D', 'V'], // 国际国内
      total_gate_hour: '',
      dataList: {},
      loading: false,
      lineChartData: [],
      list: [],
      baseData: {},
      regions: [],
      Mon: '',
      Sun: '',
      timer: ''
    }
  },
  watch: {
    value(val) {
      this.value = val
    },
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.preMonSun()
        // this.siteIdList()
        this.intlTypeList()
      }
    }
  },
  created() {
    this.preMonSun()
    // this.siteIdList()
    this.intlTypeList()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
      this.timer = ''
    }
  },
  methods: {
    deskListCLick(data) {
      this.deskTableVisible = true
      this.tableData = data
    },
    printCLick() {
      this.$print(this.$refs.print1)
    },
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
    intlTypeList() {
      this.regions = []
      this.passRate = ''
      this.minDeskOpenTime = ''
      this.dateRange = ''
      this.maxQueuingTime = ''
      this.travelorName = []
      this.deskList = []
      const data = {
        airportId: this.airport.airportId
      }
      parameterList(data)
        .then((response) => {
          // if (response.data.data) {
          if (response.data.data.length !== 0) {
            // response.data.data.forEach((element) => {
            //   if (element.airportId === this.siteId) {
            //     this.regions.push(element)
            //   }
            // })
            this.regions = response.data.data
            if (this.regions.length !== 0) {
              this.intlType = this.regions[0].id
            } else {
              this.regions = [{ id: '', composeName: '暂无数据' }]
              this.intlType = this.regions[0].id
            }
            this.Prediction()
            this.initable()
          } else {
            this.$message.success('暂无参数组合数据')
          }
          // }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    siteIdList() {
      var data = {
        includeTerminals: false
      }
      this.regions = []
      initAirpot(data)
        .then((response) => {
          if (response.data.data) {
            this.optionsSiteId = response.data.data
            this.siteId = response.data.data[0].id
            this.intlTypeList()
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    siteChange(e) {
      // this.intlType = e
      this.intlTypeList()
    },
    initable() {
      // 获取基础数据
      var data = {
        id: this.intlType || '',
        airportId: this.airport.airportId
      }
      this.baseData = {}
      console.log(this.intlType, 6666)
      if (this.intlType) {
        initable(data)
          .then((response) => {
            // if (response.data.code === '200') {
            if (response.data.data.length !== 0) {
              this.passRate = response.data.data ? response.data.data.passRate : '--'
              this.minDeskOpenTime = response.data.data ? response.data.data.minDeskOpenTime : '--'
              this.dateRange = response.data.data.dateRange ? response.data.data.dateRange : '--'
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
            console.log(e, 666) // "oh, no!"
          })
      }
    },
    paraModify() {
      localStorage.removeItem('edit_stepOne')
      localStorage.removeItem('edit_stepTwo')
      localStorage.removeItem('edit_stepThree')
      var id = this.intlType
      this.$router.push({ path: '/newcheckIn/addPage', query: { id: id }})
    },
    Prediction() {
      clearInterval(this.timer)
      this.timer = null
      var _this = this
      var weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      // 渲染图表
      var data = {
        id: this.intlType || '',
        // id: '30',
        showType: this.switchValue ? 'daily' : 'weekly',
        beginDate: this.time[0] || '',
        endDate: this.time[1] || '',
        airportId: this.airport.airportId
      }
      this.lineChartData = []
      this.dataList = {}
      if (this.intlType) {
        this.loading = true
        Prediction(data)
          .then((response) => {
            if (response.data.code === 'ok') {
              if (response.data) {
                this.dataList = response.data
              }
              this.offon = true
              this.loading = false
              if (response.data.data) {
                if (response.data.data.points) {
                  this.noEcharts = false
                  Object.keys(response.data.data.points).forEach(function(cur2) {
                    // debugger
                    var object = {}
                    var myDate = ''
                    _this.byDate.push(cur2)
                    object.datas = {}
                    object.datas.actualData = []
                    object.datas.expectedData2 = []
                    object.datas.expectedData = []
                    object.datas.waitList = []
                    object.datas.dataX = []
                    object.datas.arryleft = []
                    object.datas.arryleft2 = []
                    object.datas.arryright = []
                    object.datas.actualDataName = '预计到达旅客'
                    object.datas.expectedDataName = '可通过人数'
                    object.datas.expectedDataName2 = '柜台开放数'
                    object.datas.max3Y = response.data.data.maxDesks[cur2]
                    object.datas.totalNum = response.data.data.flightNums[cur2]
                    object.datas.satisfaction = response.data.data.satisfactions ? response.data.data.satisfactions[cur2] : ''
                    object.datas.deskList = response.data.data.tasks ? response.data.data.tasks[cur2] : []
                    if (response.data.data.addDeskNums) {
                      if (response.data.data.addDeskNums[cur2]) {
                        object.datas.addDeskNums = '已超过最大排队时间，建议增加' + response.data.data.addDeskNums[cur2] + '个柜台'
                      } else {
                        object.datas.addDeskNums = ''
                      }
                    }
                    if (!_this.switchValue) {
                      myDate = new Date(Date.parse(cur2.replace(/-/g, ' / ')))
                      object.datas.day = cur2 + '(' + weekDay[myDate.getDay()] + ')'
                    } else {
                      object.datas.day = cur2
                    }
                    response.data.data.points[cur2].forEach((element) => {
                      object.datas.arryleft2.push(element.passengerNumber)
                      object.datas.arryleft.push(element.deskCapacity)
                      object.datas.arryright.push(element.deskNumber)
                      object.datas.actualData.push({ name: element.time, value: [element.time, element.passengerNumber] })
                      object.datas.expectedData.push({ name: element.time, value: [element.time, element.deskCapacity] })
                      object.datas.expectedData2.push({ name: element.time, value: [element.time, element.deskNumber] })
                      object.datas.waitList.push({ name: element.time, value: [element.time, element.waitTime] })
                      object.datas.dataX.push(element.time.substring(10, 16))
                    })
                    object.datas.leftMax2 = Math.max.apply(null, object.datas.arryleft2)
                    object.datas.leftMax = Math.max.apply(null, object.datas.arryleft)
                    object.datas.rightMax = Math.max.apply(null, object.datas.arryright)
                    object.datas.maxWaitTime = response.data.data.maxWaitTime
                    object.datas.maxY = response.data.data.yMax
                    object.datas.max1Y = response.data.data.y1Max
                    object.datas.max2Y = response.data.data.y2Max
                    _this.lineChartData.push(object.datas)
                  })
                  // console.log(_this.lineChartData, 5566)
                } else {
                  clearInterval(this.timer)
                  this.noEcharts = true
                  // this.$message.success('暂无图表数据！')
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
              // this.$message.error(response.data.message)
            }
          })
          .catch((erro) => {
            this.noEcharts = false
            this.loading = false
            this.$message({
              type: 'error',
              message: erro.response.data.message
            })
          })
      } else {
        this.$message.success('暂无组合参数')
      }
    },
    travelorJump(index, id) {
      this.$router.push({ path: '/newcheckIn/detailsPage', query: { id: id }})
    },
    stopClick() {
      var data = {
        id: this.intlType || ''
      }
      if (this.intlType) {
        stopClick(data).then((res) => {
          this.offon = true
          this.loading = false
          this.noEcharts = false
          this.$message.success(res.data.message)
        })
      } else {
        this.$message.warning('请先选择一组组合参数')
      }
    },
    restart() {
      var data = {
        id: this.intlType || ''
      }
      if (this.intlType) {
        this.offon = false
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
      } else {
        this.$message.warning('请先选择一组组合参数')
      }
    },
    change2(value) {
      this.intlType = value
      this.Prediction()
      this.initable()
    },
    // openBaseData() {
    //   this.$router.push({ path: '/newcheckIn/passengerFlow' })
    // },
    // openBaseData2() {
    //   this.$router.push({ path: '/newcheckIn/parameter' })
    // },
    showEchart(items) {
      // 点击显示大图
      console.log(items, 230)
      this.lineChartDataBig = items
      this.lineChartDataBig.totalNumber = items.totalNum
      this.lineChartDataBig.deskList = items.deskList
      this.lineChartDataBig.satisfactionPercentage = (items.satisfaction * 100).toFixed(2) + '%'
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
<style scoped>
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
</style>
