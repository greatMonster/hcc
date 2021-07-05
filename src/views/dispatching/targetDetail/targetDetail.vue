<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="概况" name="first">
        <div class="left">
          <p><span>航班号 :</span>{{ TargetDetail.flightNo }}</p>
          <p><span>起飞航站 :</span>{{ TargetDetail.deptAirport }}</p>
          <p><span>到达航站 :</span>{{ TargetDetail.arrAirport }}</p>
          <p><span>起飞时间 :</span>{{ TargetDetail.deptTime }}</p>
          <p><span>到达时间 :</span>{{ TargetDetail.arrTime }}</p>
          <p><span>航段次序 :</span>{{ TargetDetail.seqNum }}</p>
          <p><span>航班有效性 :</span>{{ TargetDetail.validity==true?'是':'否' }}</p>
          <p><span>计划起飞代理:</span>{{ TargetDetail.planDeptAgent }}</p>
          <p><span>计划到达代理:</span>{{ TargetDetail.planArrAgent }}</p>
          <p><span>航班具体时间:</span>{{ TargetDetail.flightDate }}</p>
          <p><span>航季 :</span>{{ TargetDetail.planSeason }}</p>
          <p><span>承运人 :</span>{{ TargetDetail.carrier }}</p>
        </div>
        <div class="left">
          <p><span>国际国内 :</span>{{ TargetDetail.intlFlag | joinDate }}</p>
          <p><span>机型 :</span>{{ TargetDetail.acType }}</p>
          <p><span>航班类型 :</span>{{ TargetDetail.flightType }}</p>
          <p><span>关联航班号 :</span>{{ TargetDetail.linkedFlightNo }}</p>
          <p><span>停场时间 :</span>{{ TargetDetail.groundTime }}</p>
          <p><span>离港时间标注 :</span>{{ TargetDetail.dept_time_idx }}</p>
          <p><span>进港时间标注 :</span>{{ TargetDetail.arr_time_idx }}</p>
          <p><span>机号 :</span>{{ TargetDetail.tailNo }}</p>
        </div>
        <div class="left">
          <p>航班 -- 车辆 -- 时刻 </p>
          <div v-for="(item,index) in TargetDetail.taskEntities" :key="index" class="taskState">
            <div :class="{allocation:item.taskState==2,unallocated:item.taskState==1}" :staus="item.taskState">
              {{ item.taskName }}:
              ( {{ item.planInPlace | joinDate2 }} - {{ item.planEnd | joinDate2 }} ) -
              {{ item.employeeName }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getTaskInfo, getTaskInfoCopy } from '@/api/busRules'
export default {
  name: 'TargetDetail',
  filters: {
    joinDate: function(value) {
      switch (value) {
        case 'I':
          value = '国际'
          break
        case 'D':
          value = '国内'
          break
        case 'I/D':
          value = '国际/国内'
          break

        default:
          break
      }
      return value
    },
    joinDate2: function(value) {
      value = value.substring(11, 16)
      return value
    }
  },

  data() {
    return {
      flightLegId: this.$route.query.flightLegId,
      type: this.$route.query.type,
      TargetDetail: [],
      activeName: 'first',
      tableData: [{
        date: '任务1',
        name: 'sfdf',
        address: '2016-05-04'
      }],
      tableData3: [{
        date: '任务1',
        name: '没有足够的时间进行全面清洁',
        address: '没有足够的时间进行全面清洁'
      }]

    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.type === 'dynamic') {
        getTaskInfoCopy
        getTaskInfoCopy(this.flightLegId).then(response => {
          this.TargetDetail = response.data
        })
      } else if (this.type === 'plan') {
        getTaskInfo(this.flightLegId).then(response => {
          this.TargetDetail = response.data
        })
      }
    },
    handleClick(tab, event) {
      // console.log(this.$route.params.TargetDetail)
    }
  }
}
</script>

<style lang="scss" scoped>
  // .tab-container {
  //   margin: 0 5px;
  // }
  .left{
      display: inline-block;
      width: 30%;
      padding:10px;
      background: #232c47;
      margin:10px;
      border-radius: 10px;
      vertical-align: top;
      p{ padding:10px;}
      ins{
      text-decoration: none;
      background: #87a054;
      border-radius: 4px;
      padding: 5px;
      span{color: #fff;}
      }
      span{
          margin-right:10px;
          color: #919ec3;
      }
  }
</style>
