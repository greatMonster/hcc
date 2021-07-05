<template>
  <div class="warp">
    <div class="search">
      <el-date-picker v-model="data1" type="date" placeholder="选择日期" size="small" value-format="yyyy-MM-dd" @change="choesedata" />
      <label>国际/国内：</label>
      <el-select v-model="intlType" style="width:100px" size="small" placeholder="请选择" @change="change2">
        <el-option v-for="item in regions" :key="item.region" :label="item.name" :value="item.region" />
      </el-select>
      <el-button type="info" size="small" @click="openBaseData">基础数据</el-button>
      <el-button type="primary" size="mini" @click="restart">重新计算</el-button>
    </div>
    <div class="top">
      <div class="search">
        <p>
          <span>处理速率：{{ baseData.passRate }}</span>
          <span>最长等待时间：{{ baseData.maximumLatency }} 分钟</span>
          <!-- <span>
            最大通道数：{{ Math.round(dataList.maxGateOpe) }}
          </span>
          <span>客座率：{{ baseData.load*100 }} %</span>-->
          <!-- <span>
            通道利用率：{{ dataList.totalGateHour }}
          </span>-->
          <span>通道间隔刻度：{{ baseData.gateTimeScale }} 分钟</span>
        </p>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="计算中..." style="min-height:300px" class="runtime-bottom">
      <div class="right" style="width:100%">
        <div v-for="(item,i) in lineChartData" :key="i" class="datalist" style="margin-right:20px;cursor:pointer" :rowIndex="i" :colIndex="i" @click="showEchart(item)">
          <p>{{ item.day }}</p>
          <LineChartBig :chart-data="item" />
        </div>
      </div>
      <!-- <div v-for="(item,index) in lineChartData" :key="index">
        <LineChartBig :chart-data="item" style="width:100%;height:700px" />
      </div>-->
    </div>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="资源预测波形图" width="70%" :visible.sync="dialogTableVisible" :before-close="closeImport">
      <h3 style="margin-top: 0;">{{ lineChartDataBig.day }}</h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px;cursor:pointer" />
    </el-dialog>
    <!-- <div class="top">
      <div v-loading="loading" class="runtime-bottom" element-loading-text="数据读取中...">
        <el-row v-for="(item,i) in lineChartData" :key="i">
          <el-col v-for="(items,index) in item.datas" :key="index" :span="3">
            <div class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items)">
              <p>{{ items.day }}</p>
              <line-chart :chart-data="item.datas[index]" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>-->
  </div>
</template>

<script>
// import LineChart from '@/components/echarts/LineChart'
import LineChartBig from './components/LineChartBig'
import { Prediction, initable } from '@/api/securitychannel'

export default {
  name: 'SecurityChannel',
  components: { LineChartBig },
  data() {
    return {
      dialogTableVisible: false,
      lineChartDataBig: [],
      flag: 'F', // 默认f 是数据没有改变不需要重新计算
      intlType: 'D', // 国际国内
      total_gate_hour: '',
      dataList: {},
      loading: false,
      lineChartData: [],
      data1: this.getNowFormatDate(), // 选择日期
      list: [],
      regions: [{ name: '国内', region: 'D' }, { name: '国际', region: 'I' }],
      baseData: {}
    }
  },
  created() {
    this.initable()
    this.Prediction()
  },
  methods: {
    initable() {
      var data = {
        intlType: this.intlType,
        airportId: 706
      }
      // 获取基础数据
      initable(data).then(response => {
        // if (response.code === '200') {
        response.data.forEach(element => {
          console.log(element, 888)
          if (element.intlType === this.intlType) {
            this.baseData = element
          }
        })
        // } else {
        //   this.$message({
        //     type: 'error',
        //     showClose: true,
        //     message: response.message
        //   })
        // }
        // response.data.forEach(element => {
        //   if (element.intlType === this.intlType) {
        //     this.baseData = element
        //   }
        // })
      })
    },
    Prediction() {
      // 渲染图表
      var data = {
        intlType: this.intlType,
        flag: this.flag,
        serviceType: 1,
        siteId: 10,
        deskServiceTypee: '',
        opeDate: this.data1
      }
      this.loading = true
      this.lineChartData = []
      Prediction(data).then(response => {
        this.loading = false
        var _this = this
        if (response.code === '200') {
          if (response.data) {
            this.dataList = response.data
          } else {
            this.$message.success('暂无数据')
          }
          Object.keys(response.data.predictionElementBeanMap).forEach(function(cur2) {
            var object = {}
            object.datas = {}
            object.datas.actualData = []
            object.datas.expectedData2 = []
            object.datas.expectedData = []
            object.datas.dataX = []
            object.datas.actualDataName = '旅客分布'
            object.datas.expectedDataName = '可通过人数'
            object.datas.expectedDataName2 = '柜台开放数'
            object.datas.day = cur2
            response.data.predictionElementBeanMap[cur2].forEach(element => {
              object.datas.actualData.push(element.inflowProfile)
              object.datas.expectedData.push(element.coverCapacity)
              object.datas.expectedData2.push(element.gateNumber)
              object.datas.dataX.push(element.timeScale.substring(10, 16))
            })
            object.datas.leftMax2 = Math.max.apply(null, object.datas.actualData)
            object.datas.leftMax = Math.max.apply(null, object.datas.expectedData)
            object.datas.rightMax = Math.max.apply(null, object.datas.expectedData2)
            _this.lineChartData.push(object.datas)
          })
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: response.message
          })
        }

        // this.loading = false
        // if (response.data) {
        //   this.dataList = response.data
        // }
        // var object = {}
        // object.actualData = []
        // object.expectedData2 = []
        // object.expectedData = []
        // object.dataX = []
        // object.actualDataName = '旅客分布'
        // object.expectedDataName = '可通过人数'
        // object.expectedDataName2 = '通道开放数'
        // this.dataList.predictionElementBeans.forEach(element => {
        //   object.actualData.push(element.inflowProfile)
        //   object.expectedData.push(element.coverCapacity)
        //   object.expectedData2.push(element.gateNumber)
        //   object.dataX.push(element.timeScale.substring(10, 16))
        // })
        // object.leftMax2 = Math.max.apply(null, object.actualData)
        // object.leftMax = Math.max.apply(null, object.expectedData)
        // object.rightMax = Math.max.apply(null, object.expectedData2)
        // this.lineChartData.push(object)
        // console.log(object, 888)
      })
    },
    restart() {
      this.loading = true
      this.flag = 'T'
      this.Prediction()
    },
    change2(item) {
      // 国际国内切换
      this.flag = 'F'
      this.intlType = item
      this.Prediction()
      this.initable()
    },
    choesedata() {
      this.flag = 'F'
      this.Prediction()
    },
    openBaseData() {
      // 跳转基础数据
      this.$router.push({ path: '/ATM/baseType/securityChannel/set' })
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
      // alert(555)
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
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
.green {
  color: #87a054;
}
.warp {
  margin-top: 60px;
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
