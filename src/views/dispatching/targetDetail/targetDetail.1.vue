<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="概况" name="first">
        <div class="left">

          <p><span>航班号 :</span>{{ TargetDetail.flightNo }}</p>
          <p><span>任务名 :</span>{{ TargetDetail.taskName }}</p>
          <p><span>任务状态 :</span>{{ TargetDetail.taskState }}</p>
          <p><span>开始位置 :</span>{{ TargetDetail.startPosition }}</p>
          <p><span>结束位置 :</span>{{ TargetDetail.endPosition }}</p>
          <p><span>计划到位时间 :</span>{{ TargetDetail.planInPlace }}</p>
          <p><span>计划发车时间 :</span>{{ TargetDetail.planDepart }}</p>
          <p><span>计划结束时间:</span>{{ TargetDetail.planEnd }}</p>
          <p><span>实际到位时间:</span>{{ TargetDetail.actualInPlace }}</p>
          <p><span>实际发车时间:</span>{{ TargetDetail.actualDepart }}</p>
          <p><span>实际结束时间:</span>{{ TargetDetail.actualEnd }}</p>
        </div>
        <div class="left">
          <p><span>车型 :</span>{{ TargetDetail.busType }}</p>
          <p><span>技能 :</span>{{ TargetDetail.skillId }}</p>
          <p><span>员工 :</span>{{ TargetDetail.employeeId }}</p>
          <p><span>创建时间 :</span>{{ TargetDetail.createDate }}</p>
          <p><span>进港出港 :</span>{{ TargetDetail.flightType }}</p>
          <p><span>国际国内 :</span>{{ TargetDetail.intlFlag | joinDate }}</p>
          <p><span>起飞站-到达站 :</span>{{ TargetDetail.deptArrAirport }}</p>
          <p><span>车次 :</span>{{ TargetDetail.checi }}</p>
          <p><span>出发机坪 :</span>{{ TargetDetail.deptApron }}</p>
          <p><span>到达机坪 :</span>{{ TargetDetail.arrApron }}</p>
          <p><span>航班计划的主键id :</span>{{ TargetDetail.flightLegId }}</p>
        </div>
        <!-- <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="任务名" />
          <el-table-column prop="name" label="状态" />
          <el-table-column prop="address" label="资源状况" />
          <el-table-column prop="address" label="位置" />
          <el-table-column prop="address" label="已暂停" />
          <el-table-column prop="address" label="任务领导" />
          <el-table-column prop="address" label="组" />
          <el-table-column prop="address" label="开始时间" />
          <el-table-column prop="address" label="结束时间" />
          <el-table-column prop="address" label="进站F/N" />
          <el-table-column prop="address" label="出站f/n" />
          <el-table-column prop="address" label="A/C Reg" />
          <el-table-column prop="address" label="设备" />
        </el-table> -->
      </el-tab-pane>
      <!-- <el-tab-pane label="时间" name="second">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="address" label="开始时间" />
          <el-table-column prop="address" label="结束时间" />
          <el-table-column prop="address" label="实际开始时间" />
          <el-table-column prop="address" label="实际结束时间" />
          <el-table-column prop="address" label="持续时间" />
        </el-table>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="分配" name="third">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="address" label="团队ID" />
          <el-table-column prop="address" label="团队名称" />
          <el-table-column prop="address" label="状态" />
          <el-table-column prop="address" label="实际行动" />
          <el-table-column prop="address" label="实际结束" />
          <el-table-column prop="address" label="HC小组" />
          <el-table-column prop="address" label="能力" />
        </el-table>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="计费项目" name="third2">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="address" label="计费项目" />
        </el-table>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="限制" name="third3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="address" label="限制项目" />
        </el-table>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="备注" name="fourth">
        <el-table :data="tableData3" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="date" label="类型" />
          <el-table-column prop="address" label="值" />
        </el-table>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="工作日志" name="five">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="address" label="时间" />
          <el-table-column prop="address" label="活动" />
          <el-table-column prop="address" label="用户" />
          <el-table-column prop="address" label="原因" />
          <el-table-column prop="address" label="评论" />
        </el-table>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { getTaskInfo } from '@/api/busRules'
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
    }
  },
  data() {
    return {
      flightLegId: this.$route.query.flightLegId,
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
      getTaskInfo(this.flightLegId).then(response => {
        this.TargetDetail = response.data
      })
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
      width: 40%;
      padding: 20px;
      background: #232c47;
      margin: 20px;
      border-radius: 10px;
      vertical-align: top;
      p{ padding: 10px;}
      span{
          margin-right:10px;
              color: #919ec3;
      }
  }
</style>
