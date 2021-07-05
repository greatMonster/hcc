<template>
  <div class="warp">
    <div class="search">
      <label>站点：</label>
      <el-select v-model="siteId" placeholder="请选择" style="width:160px" size="small" @change="siteChange">
        <el-option v-for="item in optionsSiteId" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
      </el-select>
      <!-- <el-cascader v-model="defaultId" :options="optionsSiteId" :props="{ checkStrictly: true }" placeholder="无锡" size="small" @change="siteChange" /> -->
      <!-- <label>国际/国内：</label> -->
      <el-select v-model="intlType" style="width:160px" size="small" placeholder="请选择" @change="change2">
        <el-option v-for="item in regions" :key="item.checkInBaseId" :label="item.checkInBaseName" :value="item.checkInBaseId" />
      </el-select>
      <el-button type="info" size="small" @click="openBaseData">基础数据</el-button>
      <el-button type="info" size="small" @click="openBaseData2">派工规则</el-button>
      <el-button type="primary" size="mini" @click="restart">重新计算</el-button>
    </div>
    <div class="top">
      <div class="search">
        <p>
          <span>
            处理速率：
            <span style="color: #87a054">{{ passRate }}</span>
          </span>
          <span>
            最长等待时间：
            <span style="color: #87a054">{{ maximumLatency }}</span>
          </span>
          <span>
            柜台最小开放刻度：
            <span style="color: #87a054">{{ gateTimeScale }} 分钟</span>
          </span>
        </p>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="计算中..." style="min-height:300px" class="runtime-bottom">
      <div class="right" style="width:100%">
        <div v-for="(item,i) in lineChartData" :key="i" class="datalist" style="margin-right:20px;cursor:pointer" :rowIndex="i" :colIndex="i">
          <p>{{ item.day }}</p>
          <!-- <p class="waitTime" @click="waitTime(item.day)">排队时间</p> -->
          <div @click="showEchart(item)">
            <LineChartBig :chart-data="item" />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="资源预测波形图" width="70%" :visible.sync="dialogTableVisible" :close="closeImport">
      <h3 style="margin-top: 0;">{{ lineChartDataBig.day }}</h3>
      <LineChartBigTwo :chart-data="lineChartDataBig" style="width:100%;height:600px;cursor:pointer" />
    </el-dialog>
  </div>
</template>

<script>
import LineChartBig from '@/components/echarts/checkinEcharts/LineChartBig'
import LineChartBigTwo from '@/components/echarts/checkinEcharts/LineChartBigTwo'
import { initable, jiuyuanSelectData, Prediction, siteList } from '@/api/checkInData'
export default {
  name: 'SecurityChannel',
  components: { LineChartBig, LineChartBigTwo },
  data() {
    return {
      passRate: '',
      gateTimeScale: '',
      maximumLatency: '',
      defaultId: ['10'],
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
      data1: this.getNowFormatDate(), // 选择日期
      list: [],
      baseData: [],
      regions: []
    }
  },
  watch: {
    value(val) {
      this.value = val
    }
  },
  created() {
    this.initable()
    // this.Prediction()
    this.siteIdList()
  },
  methods: {
    intlTypeList() {
      this.regions = []
      var data = {
        siteId: this.siteId || 10
      }
      jiuyuanSelectData(data).then(response => {
        this.regions = response.data
        this.intlType = response.data[0].checkInBaseId
        this.Prediction()
        this.initable()
      })
    },
    siteIdList() {
      siteList().then(response => {
        this.optionsSiteId = response.data
        this.siteId = response.data[0].siteId
        this.intlTypeList()
      })
    },
    siteChange(e) {
      this.carriers = ''
      this.siteId = e
      if (e.length > 1) {
        this.carriers = e[1]
      }
      this.intlType = ''
      this.intlTypeList()
      // this.initable()
      // this.Prediction()
    },
    initable() {
      // 获取基础数据
      var data = {
        checkInBaseId: this.intlType || ''
      }
      this.baseData = []
      initable(data).then(response => {
        if (response.code === '200') {
          this.passRate = response.data ? response.data.passRate : '--'
          this.gateTimeScale = response.data ? response.data.gateTimeScale : '--'
          this.maximumLatency = response.data ? response.data.maximumLatency : '--'
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: response.message
          })
        }
      })
    },
    Prediction() {
      var _this = this
      // 渲染图表
      var data = {
        checkInBaseId: this.intlType || '',
        flag: this.flag,
        serviceType: 2,
        siteId: this.siteId || 10,
        carriers: this.carriers || '',
        opeDate: this.data1,
        deskServiceTypee: this.deskServiceTypee === '' ? 'C' : this.deskServiceTypee
      }
      this.loading = true
      this.lineChartData = []
      this.dataList = {}
      Prediction(data).then(response => {
        this.loading = false
        if (response.code === '200') {
          if (response.data) {
            this.dataList = response.data
          }
          if (response.data) {
            if (response.data.predictionElementBeanMap) {
              Object.keys(response.data.predictionElementBeanMap).forEach(function(cur2) {
                var object = {}
                object.datas = {}
                object.datas.actualData = []
                object.datas.expectedData2 = []
                object.datas.expectedData = []
                object.datas.waitList = []
                object.datas.dataX = []
                object.datas.actualDataName = '预计到达旅客'
                object.datas.expectedDataName = '可通过人数'
                object.datas.expectedDataName2 = '柜台开放数'
                object.datas.day = cur2
                response.data.predictionElementBeanMap[cur2].forEach(element => {
                  object.datas.actualData.push({ name: element.timeScale, value: [element.timeScale, element.inflowProfile] })
                  object.datas.expectedData.push({ name: element.timeScale, value: [element.timeScale, element.coverCapacity] })
                  object.datas.expectedData2.push({ name: element.timeScale, value: [element.timeScale, element.gateNumber] })
                  // object.datas.waitList.push(element.waitTime)
                  object.datas.waitList.push({ name: element.timeScale, value: [element.timeScale, element.waitTime] })
                  object.datas.dataX.push(element.timeScale.substring(10, 16))
                })
                object.datas.leftMax2 = Math.max.apply(null, object.datas.actualData)
                object.datas.leftMax = Math.max.apply(null, object.datas.expectedData)
                object.datas.rightMax = Math.max.apply(null, object.datas.expectedData2)
                object.datas.maxWaitTime = response.data.maxWaitTime
                object.datas.maxY = response.data.y
                _this.lineChartData.push(object.datas)
              })
            } else {
              this.$message.success('暂无数据！')
            }
          } else {
            this.$message.success('暂无数据！')
          }
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: response.message
          })
        }
      })
    },
    restart() {
      this.flag = 'T'
      this.Prediction()
    },
    change2(value) {
      this.intlType = value
      this.flag = 'F' // 不需要重新计算
      this.Prediction()
      this.initable()
    },
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/checkInData/set', query: { siteId: this.siteId || 10 }})
    },
    openBaseData2() {
      this.$router.push({ path: '/ATM/baseType/checkInRule', query: { siteId: this.siteId || 10 }})
    },
    choesedata() {
      this.flag = 'F'
      this.Prediction()
    },
    // 排队时间
    waitTime(day) {
      alert(day)
    },
    getNowFormatDate() {
      // 获取当天时间
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
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
  background: #232c47;
  padding: 10px;
  margin-bottom: 10px;
  span {
    margin-left: 30px;
  }
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
.warp {
  color: #fff;
  h3 {
    text-align: center;
  }
  .top {
    margin: 0 10px;
    div {
      display: inline-block;
      width: 100%;
      background: #232c47;
      text-align: center;
      padding: 10px 0;
      p {
        margin: 10px 0;
      }
      .num {
        font-size: 25px;
        color: #ccc;
      }
    }
  }
  ul {
    margin: 10px;
    padding: 0;
  }
  li {
    margin-bottom: 10px;
    list-style: none;
    display: flex;
    background: #232c47;
    div.left {
      background: #172449;
      text-align: center;
      margin-right: 10px;
      position: relative;
      flex: 1;
      span {
        position: absolute;
        left: 0;
        top: 50%;
        bottom: 0;
        right: 0;
        margin-top: -10px;
      }
    }
    div.right {
      padding: 10px;
      display: flex;
      text-align: center;
      flex-wrap: wrap;
      flex: 20;
      .item {
        position: relative;
        // border-bottom: 1px solid #62697e;
        p {
          margin: 5px;
          font-size: 12px;
          border-radius: 3px;
          color: #354e95;
        }
        div {
          cursor: pointer;
          border-radius: 3px;
          // border: 3px solid #87a054;
          width: 50px;
          height: 50px;
          background: #87a054;
          text-align: center;
          color: #fff;
          margin: 10px 10px 0 10px;
          align-items: center;
          display: flex;
          justify-content: center;
          &.close {
            background: #babbbf;
            // border: 3px solid #666;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
