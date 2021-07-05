<template>
  <div class="indexcont">
    <div class="item" style="background: #222b44;margin-bottom: 10px;margin-top:60px">
      <el-select v-model="value" placeholder="请选择" size="medium" style="width:120px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="value2" style="width:140px" size="medium" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions" />
      <span>最早出港： 20:52:14</span>
      <span>最晚回港： 20:52:14</span>
      <el-popover placement="bottom" trigger="hover">
        <p>今日总值班: 张小明/13845214545</p>
        <p>今日总值班: 张小明/13845214545</p>
        <p>今日总值班: 张小明/13845214545</p>
        <span slot="reference">
          今日值班经理: 张小明/13845214545
          <i class="el-icon-caret-bottom" />
        </span>
      </el-popover>
    </div>
    <!-- 运行健康状态 -->
    <div class="item">
      <div class="circle">
        <span>
          运行
          <br >健康状态
        </span>
        <el-progress type="circle" :width="90" :percentage="percentage" :color="colors" />
      </div>
      <div class="itemRight">
        <table width="100%">
          <tr>
            <td colspan="2">
              <img src="@/icons/svg/md-airplane.png" style="width:50px;float:left" >
              <p>航班总量</p>
              <span class="ft28">3070</span>
            </td>
            <td>
              <p>已实飞</p>
              <span class="ft28">68</span>
            </td>
            <td>
              <p>正常未飞</p>
              <span class="ft28">20</span>
            </td>
            <td>
              <p>应飞未飞</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="3" style="background:rgb(231, 107, 117)">
              <img src="@/icons/svg/airplane.png" style="height:50px;" >
              <p>>4延误</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="3">
              <p>运行正点率</p>
              <el-progress type="circle" :width="60" :percentage="percentage" :color="colors" />
            </td>
            <td rowspan="3">
              <p>保障正点率</p>
              <el-progress type="circle" :width="60" :percentage="percentage" :color="colors" />
            </td>
            <td rowspan="3">
              <p>客座率</p>
              <el-progress type="circle" :width="60" :percentage="percentage" :color="colors" />
            </td>
            <td>
              <p>已实飞旅客人数</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="3" style="background:rgb(231, 107, 117)">
              <img src="@/icons/svg/cry.png" style="height:50px;" >
              <p>投诉事件</p>
              <p>
                <span>2</span>12%
              </p>
            </td>
            <td>
              <p>不正常行李</p>
              <span class="ft28">13</span>
            </td>
            <td>
              <p>关联旅客： 22</p>
              <p>关联航班： 22</p>
            </td>
          </tr>
          <tr>
            <td rowspan="2">
              <p>不正常航班</p>
              <span class="ft28">13</span>
            </td>
            <td>
              <p>
                取消
                <span class="ft28">5</span>
              </p>
            </td>
            <td rowspan="2">
              <p>返航</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="2">
              <p>实飞误飞</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="2">
              <p>
                <span>2h</span> 138
              </p>
              <p>
                <span>2h-4h</span> 138
              </p>
            </td>
            <td rowspan="2">
              <p>过安检旅客人数</p>
              <span class="ft28">13</span>
            </td>
            <td rowspan="2">
              <p>VIP旅客</p>
            </td>
            <td>
              <p>
                <span>待飞</span> 545
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                备降
                <span class="ft28">5</span>
              </p>
            </td>
            <td>
              <p>
                <span>总数</span> 12
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- end -->
    <div class="item">
      <div class="circle">
        <span>
          全中心
          <br >到岗率
        </span>
        <el-progress type="circle" :width="90" :percentage="percentage" :color="colors" />
      </div>
      <div class="itemRight">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="24" :lg="12">
            <table width="100%">
              <tr>
                <td rowspan="2">
                  <span style="position: absolute;left: 0;">
                    <i class="el-icon-s-custom" />
                  </span>
                  <p>在编人数</p>
                  <span class="ft28">11553</span>
                </td>
                <td rowspan="2" width="120">
                  <div class="item">
                    <el-carousel :interval="5000" height="80px" arrow="always" style="width:180px">
                      <el-carousel-item v-for="item in 2" :key="item">
                        <div>
                          旅服中心
                          <p>33</p>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </td>
                <td>
                  <p>
                    <span class="lt">轮班</span>2121
                  </p>
                </td>
                <td>
                  <p>
                    <span class="lt">在岗</span>2121
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span class="lt">考勤</span>2121
                  </p>
                </td>
                <td>
                  <p>
                    <span class="lt">请假</span>2121
                  </p>
                </td>
              </tr>
            </table>
            <div class="itemVip">
              <div class="item" style="height:180px">
                <el-scrollbar style="height:100%;">
                  <p>VIP信息</p>
                  <el-table :data="tableData">
                    <el-table-column prop="date" label="等级" />
                    <el-table-column prop="name" label="数量" />
                    <el-table-column prop="address" label="预计保障" />
                    <el-table-column prop="address2" label="航班号" />
                  </el-table>
                </el-scrollbar>
              </div>
              <div class="item" style="height:180px">
                <el-scrollbar style="height:100%;">
                  <p>特服类型统计图</p>
                  <el-table :data="tableData">
                    <el-table-column prop="date" label="等级" />
                    <el-table-column prop="name" label="数量" />
                    <el-table-column prop="address" label="预计保障" />
                    <el-table-column prop="address2" label="航班号" />
                  </el-table>
                </el-scrollbar>
              </div>
            </div>
            <div class="ppc">
              <span class="span">PPC</span>
              <div>
                <h3>联程值机率</h3>
                <div class="ppcBox">
                  <p>三大枢纽</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="10" :color="colors" />
                </div>
              </div>
              <div>
                <h3>中转衔接成功率</h3>
                <div class="ppcBox">
                  <p>旅客</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="20" :color="colors" />
                </div>
              </div>
              <div>
                <h3>关仓门正常率</h3>
                <div class="ppcBox">
                  <p>首发航班</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="40" :color="colors" />
                </div>
              </div>
              <div>
                <h3>保障原因占比</h3>
                <div class="ppcBox">
                  <p>上海两场</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="60" :color="colors" />
                </div>
              </div>
              <div>
                <div class="ppcBox">
                  <p>客户满意度</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="60" :color="colors" />
                </div>
              </div>
              <div>
                <div class="ppcBox">
                  <p>运行正点率</p>
                  <el-progress type="circle" :stroke-width="3" :width="60" :percentage="80" color="#85b724" />
                </div>
              </div>
            </div>
            <div class="itemRight" style="width:100%;height:220px; margin-top: 15px;">
              <div class="item">
                <p style="text-align: left;">任务统计数据</p>
                <Chart :chart-data="lineChartData" />
              </div>
            </div>
          </el-col>

          <!-- <el-col :xs="24" :sm="24" :lg="6"/> -->
          <el-col :xs="24" :sm="24" :lg="12">
            <div style="margin-bottom:20px">
              <div class="itemRight" style="width: 40%;vertical-align: top;">
                <div class="item">
                  <p style="text-align: left;">运行品质模型</p>
                  <raddar-chart />
                </div>
              </div>
              <div class="item raddar" style="width: 59%;display: inline-block;vertical-align: middle;">
                <div v-for="(item,index) in raddartable" :key="index">
                  <div class="left">
                    <div>
                      <p>{{ item.name }}</p>
                      <p>{{ item.data }}</p>
                    </div>
                  </div>
                  <div class="right">
                    <span>
                      <b>{{ item.rase }}</b>%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="itemRight tablelist" style="width:100%">
              <div class="item">
                <div class="lt" style="width:17%; margin-top: 80px;">
                  <el-progress type="circle" :width="60" :percentage="percentage" :color="colors" />
                  <p>
                    利用率：
                    <i>48</i>%
                  </p>
                </div>
                <div class="lt" style=" width: 9%;background: #0a142f;margin-top: 33px;height:205px;">
                  <p>
                    <svg-icon icon-class="peoples" style="float:none" />
                  </p>
                  <br >
                  <p>总人数：3829</p>
                </div>
                <div class="lt" style="width: 74%;">
                  <el-table border :data="tableData3" stripe style="width: 100%">
                    <el-table-column prop="date" label="总人数" />
                    <el-table-column prop="name" label="员工轮班人数" />
                    <el-table-column prop="address" label="实际考勤人数" />
                    <el-table-column prop="address2" label="请假" />
                  </el-table>
                </div>
                <!-- <line-chart :chart-data="lineChartData" /> -->
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
import Chart from './components/MixChart'
import RaddarChart from './components/RaddarChart'
// import LineChart from './components/LineChart'
// import pie from './components/pie'
export default {
  name: 'Dashboard',
  components: {
    RaddarChart,
    // LineChart,
    Chart
  },
  data() {
    return {
      percentage: 20,
      colors: [{ color: '#f56c6c', percentage: 20 }, { color: '#e6a23c', percentage: 40 }, { color: '#1989fa', percentage: 60 }, { color: '#5cb87a', percentage: 80 }, { color: '#85b724', percentage: 100 }],
      width: '100px',
      raddartable: [
        { name: '接机', data: '12/12', rase: '12' },
        { name: '装卸', data: '12/12', rase: '12' },
        { name: '登机', data: '12/12', rase: '12' },
        { name: '行李分卸', data: '12/12', rase: '12' },
        { name: '清洁', data: '12/12', rase: '12' },
        { name: '配餐', data: '12/12', rase: '12' },
        { name: '清水车', data: '12/12', rase: '12' },
        { name: '行李分捡', data: '12/12', rase: '12' },
        { name: '污水车', data: '12/12', rase: '12' },
        { name: '加油', data: '12/12', rase: '12' }
      ],
      lineChartData: lineChartData.newVisitis,
      value: '上海虹桥',
      value2: new Date(),
      options: [
        {
          value: '选项1',
          label: '上海'
        },
        {
          value: '选项2',
          label: '上海浦东'
        }
      ],
      tableData: [
        {
          date: 'V1',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: 'V1',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: 'V1',
          name: '35',
          address: '200m',
          address2: '758'
        }
      ],
      tableData3: [
        {
          date: '旅服中心',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: '站坪中心',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: '装卸中心',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: '行李中心',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: '地控中心',
          name: '35',
          address: '200m',
          address2: '758'
        },
        {
          date: '载重中心',
          name: '35',
          address: '200m',
          address2: '758'
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // },
  methods: {}
}
</script>

<style lang="scss" scoped>
// 重构
.itemRight.tablelist {
  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding: 20px !important;
  }
}
.ppc {
  > div {
    width: 15%;
    display: inline-block;
    h3 {
      margin: 0;
      background: #222b44;
      padding: 7px 0;
      font-weight: normal;
      font-size: 16px;
    }
    .ppcBox {
      border: 1px solid #394871;
      padding: 10px 0;
    }
  }
  .span {
    background: #222b44;
    width: 30px;
    word-break: break-all;
    padding: 10px;
    vertical-align: bottom;
    line-height: 31px;
  }
}
.el-popover {
  p {
    margin: 10px 0;
  }
}
.ft28 {
  font-size: 24px;
}
.circle {
  text-align: center;
  display: inline-block;
  position: relative;
  width: 7%;
  vertical-align: top;
  span {
    position: absolute;
    top: 11px;
    left: 11px;
    width: 96px;
    font-size: 14px;
    text-align: center;
  }
}
.itemRight {
  width: 92%;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  .item {
    background: #222b44;
    .item_left {
      display: inline-block;
      font-size: 14px;
      i,
      span,
      p {
        margin: 5px;
      }
      span {
        font-size: 24px;
      }
    }
  }
}
i.el-icon-s-custom {
  padding: 5px;
  border-radius: 50%;
  border: 1px solid #7a7f8e;
  color: #7a7f8e;
  font-size: 30px;
  margin: 0 10px;
}
.lt {
  float: left;
}
table td {
  background: #222b44;
  text-align: center;
}
.el-carousel__item div {
  line-height: 40px;
  p {
    font-size: 24px;
  }
}
.itemVip {
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
  .item {
    width: 49.8%;
    background: #222b44;
    border-radius: 3px;
    margin-left: 1px;
    float: left;
  }
}

.indexcont {
  color: #fff;
  // min-width: 1600px;
}
.svg-icon {
  font-size: 50px;
  color: #7a7f8e;
  float: left;
}
.top {
  padding: 10px;
  // min-width: 1900px;
  overflow: hidden;
  margin-bottom: 10px;
  span {
    display: inline-block;
    vertical-align: middle;
    padding: 5px 20px;
  }
  p {
    margin: 5px 0;
  }
  .progress {
    width: 200px;
  }
}
.item {
  padding: 10px;
  overflow: hidden;
  span {
    display: inline-block;
    vertical-align: middle;
    padding: 5px 20px;
  }
  p {
    margin: 5px 0;
  }
  .progress {
    width: 200px;
  }
}
.left,
.right {
  width: 49%;
  // min-width: 940px;
  display: inline-block;
  margin-top: 20px;
  float: left;
  vertical-align: top;
}

.hubmanage {
  display: flex;
}
// .itemLeft,
// .itemRight {
//   display: inline-block;
//   vertical-align: top;
// }
.itemLeft {
  margin: 0 30px;
}

.item.complaints {
  width: 150px;
  background: #6c471c;
  text-align: center;
  vertical-align: middle;
}
.raddar {
  div {
    float: left;
    width: 49%;
    background: #87a054;
    border-radius: 2px;
    margin: 1px;
    p {
      white-space: nowrap;
    }
    span {
      display: block;
      padding: 13px;
      font-size: 20px;
      b {
        font-size: 30px;
        font-weight: normal;
      }
    }
  }
}
p {
  margin: 0;
}
</style>
