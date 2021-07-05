<template>
  <div class="user-box">
    <div class="box">
      <el-card class="box-card">
        <div class="title">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <span>基本信息</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="text-align: right">
                <el-button type="primary" size="small" @click="editData()">修 改</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div>
            <p>名称 ：</p>
            <span>{{ formEdit.name }}</span>
          </div>
          <div>
            <p>机场 ：</p>
            <span>{{ formEdit.airportName }}</span>
          </div>
          <div>
            <p>航班计划 ：</p>
            <span>{{ formEdit.flightName }}</span>
          </div>
          <div>
            <p>开始结束日期 ：</p>
            <span>{{ formEdit.beginDate | joinData }} - {{ formEdit.endDate | joinData }}</span>
          </div>
          <div>
            <p>国际/国内 ：</p>
            <span>{{ formEdit.region | filterData }}</span>
          </div>
          <div>
            <p class="leftP">承运人 ：</p>
            <p class="rightP">{{ arr | filterData3 }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="title">航班人数</div>
        <div class="content">
          <div>
            <p>高端/经济 ：</p>
            <span>{{ formEdit.serviceType | filterData2 }}</span>
          </div>
          <div>
            <p>客座率 ：</p>
            <span>{{ formEdit.loadRate }}%</span>
          </div>
          <div>
            <p>通程率 ：</p>
            <span>{{ formEdit.skipRate }}%</span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="title">旅客分布</div>
        <div v-for="(item, index) in formEdit.binomialConfigurations" :key="index" class="content">
          <div>
            <p>时间区段{{ index }} ：</p>
            <span>{{ item.beginTime }} - {{ item.endTime }}</span>
          </div>
          <div>
            <p>提前到达时间最大值{{ index }}(分钟) ：</p>
            <span>{{ item.earlyArrival }}</span>
          </div>
          <div>
            <p>航班截载时间{{ index }}(分钟) ：</p>
            <span>{{ item.lastArrival }}</span>
          </div>
          <div>
            <p>流量模式{{ index }} ：</p>
            <span>{{ item.distributionType | filterData4 }}</span>
          </div>
          <div v-if="item.peakPoint">
            <p>客流峰值 ：</p>
            <span>{{ item.peakPoint }}</span>
          </div>
          <div v-if="item.distributionRatio">
            <p>模式二占比 ：</p>
            <span>{{ item.distributionRatio }}</span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <el-button size="small" type="primary" @click="previewBig('formEdit')">预览</el-button>
        <div v-show="noff" class="boxChart">
          <div v-for="(item, i) in lineChartData" :key="i" style="display: flex; height: 250px; align-items: center">
            <div class="left">{{ item.role }}</div>
            <div class="right">
              <div v-for="(items, index) in item.datas" :key="index" class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items, item.role, items.kpiName11)">
                <p style="text-align: center">{{ items.day }}</p>
                <line-chart :chart-data="item.datas[index]" />
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog v-dialogDrag :title="lineChartDataBig.title" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <p style="text-align: right; color: #cf9225">{{ lineChartDataBig.kpiName }}</p>
      <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px" />
    </el-dialog>
    <el-dialog v-dialogDrag title="粒度选择" width="50%" :visible.sync="dialogVisible" center>
      <el-select v-model="interval" placeholder="请选择" style="margin-left: 100px">
        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusbtnClick()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import LineChart from '@/components/echarts/LineChart'
import LineChartBig from '@/components/echarts/LineChartBig'
import { previewData } from '@/api/passengerFlow'
import { initData2, previewData1, previewData2, carriersData } from '@/api/passengerFlow1'
export default {
  components: {
    LineChart,
    LineChartBig
  },
  filters: {
    filterData: function (value) {
      if (value === 'I') {
        return '国际'
      } else if (value === 'D') {
        return '国内'
      } else {
        return '国内/国际'
      }
    },
    filterData2(val) {
      if (val === 'V') {
        return '高端'
      } else if (val === 'C') {
        return '经济'
      } else {
        return '高端/经济'
      }
    },
    joinData(val) {
      if (val) {
        return val.slice(0, 10)
      } else {
        return ''
      }
    },
    filterData3(val) {
      return val.toString()
    },
    filterData4(val) {
      if (val === 'B') {
        return '模式二'
      } else if (val === 'R') {
        return '模式一'
      }
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      dialogVisible: false,
      interval: '5',
      sizeOptions: [
        {
          name: '5分钟',
          value: '5'
        },
        {
          name: '30分钟',
          value: '30'
        },
        {
          name: '60分钟',
          value: '60'
        }
      ],
      arr: [],
      noff: false,
      arrData: [],
      typeData: true,
      alldata: [],
      chargingform: {},
      Options: [5, 10, 30],
      adddialog: false,
      lineChartData: [],
      lineChartDataBig: {},
      dialogTableVisible: false,
      id: '',
      formEditdata: [],
      formLabelWidth: '30%',
      formEdit: {
        airportId: '',
        name: '',
        region: 'D/I',
        flightScheduleId: '',
        carriers: '',
        skipRate: '',
        loadRate: '',
        serviceType: 'C/V',
        lastArrival: '',
        earlyArrival: '',
        distributionType: '',
        binomialConfigurations: [{ peakPoint: '0', beginTime: '08:00', endTime: '09:00', isAdd: true, isDelete: false }]
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.carriersGet()
    // this.initData()
  },
  methods: {
    carriersGet() {
      // debugger
      var data = {
        nameOrCode: '',
        airportId: this.airport.airportId
      }
      carriersData(data).then((response) => {
        this.arrData = response.data.data
        this.initData()
      })
    },
    initData() {
      // this.arrData = JSON.parse(sessionStorage.getItem('carriersOptions'))
      const data = {
        id: this.$route.query.id,
        airportId: this.airport.airportId
      }
      initData2(data).then((response) => {
        this.formEdit = response.data.data[0]
        for (let i = 0; i < response.data.data[0].carriers.length; i++) {
          for (let j = 0; j < this.arrData.length; j++) {
            if (response.data.data[0].carriers[i] === this.arrData[j].iataCode) {
              this.arr.push(this.arrData[j].name)
            }
          }
        }
      })
    },
    showEchart(items, role, kpiName) {
      // 点击显示大图
      this.lineChartDataBig = {}
      // this.lineChartDataBig = items
      // this.dialogTableVisible = true
      this.lineChartDataBig = items
      this.lineChartDataBig.title = role + ' ' + items.day
      this.lineChartDataBig.kpiName = kpiName
      this.dialogTableVisible = true
    },
    dialogEditVisible() {
      this.$router.push({ path: '/dispatching/securityChannel/passengerFlow' })
    },
    editData() {
      this.$router.push({ path: '/dispatching/securityChannel/operationPage', query: { id: this.id, offon: 'edit' } })
    },
    handleChange() {},
    closeImport() {
      // 关闭显示大图
      if (this.lineChartDataBig) {
        this.lineChartDataBig = {}
      }
      this.dialogTableVisible = false
      // location.reload()
    },
    statusbtnClick() {
      this.dialogVisible = false
      this.noff = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.boxChart')
      })
      this.alldata = []
      this.lineChartData = []
      this.formEdit.interval = this.interval
      this.formEdit.luggageRate = 47
      this.formEdit.selfServiceRate = 60
      this.formEdit.serverRate = 100
      this.formEdit.airportId = this.airport.airportId
      previewData(this.formEdit)
        .then((response) => {
          if (response.data.data) {
            var aa = response.data.data
            aa.forEach((element) => {
              var data1 = {}
              data1.role = element.date
              data1.datas = []
              element.flightFlowDetails.name = '航班波'
              element.flightFlowDetails.kpiName = '航班总数：' + element.flightFlowDetails.total + '架次'
              element.flightSeatFlowDetails.name = '离港座位'
              element.flightSeatFlowDetails.kpiName = '座位总数：' + element.flightSeatFlowDetails.total + '个'
              element.trafficDetails.name = '安检通道旅客流量'
              element.trafficDetails.kpiName = '旅客总数：' + element.trafficDetails.total + '个'
              var dataChart = [element.flightFlowDetails, element.flightSeatFlowDetails, element.trafficDetails]
              dataChart.forEach((element2) => {
                var data2 = {}
                data2.day = element2.name
                data2.kpiName11 = element2.kpiName
                data2.maxNum = element2.maxFlow
                data2.maxNumAll = element2.maxFlow
                data2.yName = element2.descY ? element2.descY : ''
                data2.warnLine = false
                data2.totalWorkingHours = element2.totalWorkingHours ? element2.totalWorkingHours : ''
                data2.titleShow = false
                data2.actualData = []
                data2.dataX = []
                element2.details.forEach((element3) => {
                  data2.actualData.push({ name: element3.time, value: [element3.time, element3.number] })
                  data2.dataX.push(element3.time)
                })
                data1.datas.push(data2)
              })
              this.lineChartData.push(data1)
            })
          }
          loading.close()
        })
        .catch((e) => {
          loading.close()
          this.$message({
            type: 'error',
            message: e.response.data.message || '服务器错误'
          })
        })
    },
    dadas() {
      console.log(this.$store.state)
    },
    previewBig() {
      this.dialogVisible = true
    },
    previewBig1() {
      this.typeData = true
      this.adddialog = true
    },
    handleAddClickit1() {
      this.adddialog = false
      this.noff = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.boxChart')
      })
      this.alldata = []
      this.formEdit.size = this.chargingform.num
      this.formEdit.airportId = this.airport.airport
      previewData1(this.formEdit)
        .then((response) => {
          if (response.data.data) {
            var previewarr = response.data.data.daily
            previewarr.forEach((item) => {
              var dataX = []
              var number = []
              for (let i = 0; i < item.details.length; i++) {
                dataX.push(item.details[i].time)
                number.push(item.details[i].number)
              }
              this.alldata.push({
                size: this.chargingform.num,
                date: item.date,
                maxY: response.data.data.maxY,
                maxFlow: item.maxFlow,
                dataX: dataX,
                number: number
              })
            })
          } else {
            loading.close()
          }
          loading.close()
        })
        .catch((e) => {
          this.$message.error(e.response)
          loading.close()
        })
    },
    previewBig2() {
      this.typeData = false
      this.adddialog = true
    },
    handleAddClickit2(formName) {
      this.adddialog = false
      this.noff = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.boxChart')
      })
      this.alldata = []
      this.formEdit.size = this.chargingform.num
      this.formEdit.airportId = this.airport.airportId
      previewData2(this.formEdit).then((response) => {
        if (response.data.data) {
          var previewarr = response.data.data.daily
          previewarr.forEach((item) => {
            var dataX = []
            var number = []
            for (let i = 0; i < item.details.length; i++) {
              dataX.push(item.details[i].time)
              number.push(item.details[i].number)
            }
            this.alldata.push({
              size: this.chargingform.num,
              date: item.date,
              maxY: response.data.data.maxY,
              maxFlow: item.maxFlow,
              dataX: dataX,
              number: number
            })
          })
        }
        loading.close()
      })
    }
  }
}
</script>
<style scoped>
.controlDialog /deep/ .el-dialog__body {
  padding: 20px 32px 10px 6%;
}
.controlDialog /deep/ .el-dialog__header {
  padding-top: 30px;
}
.controlDialog /deep/ .el-dialog {
  width: 60%;
}
</style>
<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 10px 10px 10px;
}

.box {
  font-size: 14px;
  margin: 30px 0;
  margin-bottom: 80px;
  .content {
    margin: 0 auto;
    width: 60%;
    div {
      line-height: 0.15;
      overflow: hidden;
      p {
        display: inline-block;
        width: 35%;
        text-align: right;
      }
      .leftP {
        float: left;
        width: 35%;

        text-align: right;
      }
      .rightP {
        margin-top: 5px;
        line-height: 1.5em;
        float: left;
        width: 30%;
        text-align: left;
      }
    }
  }
}

.boxChart {
  height: 600px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}
.floot {
  background: #172449;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0 24px;
  width: 100%;
  height: 80px;

  .el-button {
    position: absolute;
    bottom: 20px;
  }
}
.grid-content {
  line-height: 26px;
}
.left {
  font-size: 14px;
}
.right {
  display: flex;
  // border-left: 1px solid #4d6cab;
}
</style>
