<template>
  <div class="warp">
    <div class="search">
      <el-date-picker v-model="data1" type="date" placeholder="选择日期" size="small" value-format="yyyy-MM-dd" @change="choesedata" />
      <label>国际/国内：</label>
      <el-cascader v-model="value" size="small" :options="options" @change="change2(value)" />
      <el-button type="info" size="small"@click="openBaseData">修改基础数据</el-button>
      <el-button type="info" size="small" @click="openBaseData2">修改派工规则</el-button>
      <el-button type="primary" size="mini" @click="restart">重新计算</el-button>
    </div>
    <div class="top">
      <div class="search">
        <p>
          <span>自助值机率：{{ baseData.selfServiceRate*100 }}%</span>
          <span>处理速率：{{ baseData.passRate }}</span>
          <span>最长等待时间：{{ baseData.maximumLatency }} 分钟</span>
          <span>柜台间隔刻度：{{ baseData.gateTimeScale }} 分钟</span>
        </p>
      </div>
    </div>
    <!-- <div v-loading="loading" element-loading-text="计算中..." class="top" style="min-height:300px">
      <div v-for="(item,index) in lineChartData" :key="index">
        <LineChartBig :chart-data="item" style="width:100%;height:700px" />
      </div>
    </div>-->
    <!-- 小图表 -->
    <div class="top">
      <div v-loading="loading" class="runtime-bottom" element-loading-text="数据读取中...">
        <el-row>
          <el-col v-for="(item,index) in lineChartData" :key="index" :span="3">
            <div class="datalist" :rowIndex="index" :colIndex="index" @click="showEchart(item)">
              <!-- <p>{{ item }}</p> -->
              <line-chart :chart-data="item" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/echarts/LineChart'
import LineChartBig from './components/LineChartBig'
import { Prediction } from '@/api/securitychannel'
import { initable } from '@/api/checkInData'
export default {
  name: 'SecurityChannel',
  components: { LineChartBig, LineChart },
  data() {
    return {
      deskServiceTypee: 'C',
      intlType: 'D',
      flag: 'F', // 默认f 是数据没有改变不需要重新计算
      value: ['D', 'C'], // 国际国内
      total_gate_hour: '',
      dataList: {},
      loading: false,
      lineChartData: [],
      data1: this.getNowFormatDate(), // 选择日期
      list: [],
      regions: [{ name: '国内', region: 'D' }, { name: '国际', region: 'I' }],
      baseData: {},
      options: [
        {
          value: 'D',
          label: '国内',
          children: [
            {
              value: 'V',
              label: '高端'
            },
            {
              value: 'C',
              label: '经济'
            }
          ]
        },
        {
          value: 'I',
          label: '国际',
          children: [
            {
              value: 'V ',
              label: '高端 '
            },
            {
              value: 'C',
              label: '经济 '
            }
          ]
        }
      ]
    }
  },
  created() {
    this.initable()
    this.Prediction()
  },
  methods: {
    initable() {
      // 获取基础数据
      initable().then(response => {
        response.data.forEach(element => {
          if (element.intlType === this.intlType) {
            this.baseData = element
          }
        })
      })
    },
    Prediction() {
      // 渲染图表
      var data = {
        intlType: this.intlType === '' ? 'D' : this.intlType,
        flag: this.flag,
        serviceType: 2,
        airportId: 526,
        opeDate: this.data1,
        deskServiceTypee: this.deskServiceTypee === '' ? 'C' : this.deskServiceTypee
      }
      this.loading = true
      this.lineChartData = []
      Prediction(data).then(response => {
        this.loading = false
        if (response.data) {
          this.dataList = response.data
        }
        const dL = this.dataList.predictionElementBeans
        const result = []
        for (var i = 0; i < dL.length; i += 288) {
          result.push(dL.slice(i, i + 288))
        }
        const _this = this
        Object.getOwnPropertyNames(result).forEach(function(cur) {
          var object = {}
          object.actualData = []
          object.expectedData2 = []
          object.expectedData = []
          object.dataX = []
          object.actualDataName = '旅客分布'
          object.expectedDataName = '可通过人数'
          object.expectedDataName2 = '柜台开放数'
          result[cur].forEach(element => {
            object.actualData.push(element.inflowProfile)
            object.expectedData.push(element.coverCapacity)
            object.expectedData2.push(element.gateNumber)
            object.dataX.push(element.timeScale.substring(10, 16))
          })
          object.leftMax2 = Math.max.apply(null, object.actualData)
          object.leftMax = Math.max.apply(null, object.expectedData)
          object.rightMax = Math.max.apply(null, object.expectedData2)
          console.log(object, 9)
          _this.lineChartData.push(object)
        })
      })
    },
    restart() {
      this.flag = 'T'
      this.Prediction()
    },
    change2(value) {
      // 国际国内切换
      this.value = value
      this.intlType = value[0]
      this.deskServiceTypee = value[1]
      this.Prediction()
      this.initable()
    },
    openBaseData() {
      this.$router.push({ path: '/ATM/baseType/checkInData' })
    },
    openBaseData2() {
      this.$router.push({ path: '/ATM/baseType/checkInRule' })
    },
    choesedata() {
      this.Prediction()
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
      // this.lineChartDataBig = items
      // this.dialogTableVisible = true
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
