<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="add-user" size="small">
        <el-form-item label="开始日期">
          <el-date-picker v-model="listQuery.beginDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="change" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="listQuery.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="change1" />
        </el-form-item>
        <el-form-item label="请假类型">
          <el-select v-model="listQuery.absenceTypeId " clearable style="width:140px">
            <el-option v-for="item in takeOptions" :key="item.absenceTypeId" :label="item.absenceName" :value="item.absenceTypeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="listQuery.employeeName" class="special" clearable size="small" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="sechData()">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <span>总数</span> -->
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div v-show="offon" class="cols">
        <span>
          <ins class="zb" />
          探亲假 ( {{ homeLeaveNum||0 }} )
        </span>
        <span>
          <ins class="yb" />
          病假 ( {{ sickLeaveNum||0 }} )
        </span>
        <span>
          <ins class="xx" />
          产假 ( {{ maternityLeaveNum||0 }} )
        </span>
        <span>
          <ins class="zb2" />
          事假 ( {{ personaLeaveNum||0 }} )
        </span>
        <span>
          <ins class="wb" />
          婚假 ( {{ weddingLeaveNum||0 }} )
        </span>

      </div>
    </div>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="换班">
        <el-table :data="tableData1" border stripe>
          <el-table-column prop="employeeName" label="申请人" />
          <el-table-column prop="exchangedEmployeeName" label="被换班人" />
          <el-table-column prop="time" label="缺勤时间" />
          <el-table-column prop="reason" label="请假理由" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="休息">
        <el-table :data="tableData2" border stripe>
          <el-table-column prop="employeeName" label="申请人" />
          <el-table-column prop="time" label="缺勤时间" />
          <el-table-column prop="reason" label="请假理由" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="请假">
        <el-table :data="tableData3" border stripe>
          <el-table-column prop="employeeName" label="申请人" />
          <el-table-column prop="time" label="缺勤时间" />
          <el-table-column prop="absenceTypeName" label="请假类型" />
          <el-table-column prop="reason" label="请假理由" />

        </el-table></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { initData2, selectData2 } from '@/api/changeLog'
export default {

  data() {
    return {
      airportId: this.$store.state.userInfo.airport.airportId || '',
      businessDomainId: this.$route.query.businessDomainId || 0,
      homeLeaveNum: '',
      maternityLeaveNum: '',
      personaLeaveNum: '',
      sickLeaveNum: '',
      weddingLeaveNum: '',
      listQuery: {
        employeeName: '',
        beginDate: '',
        endDate: '',
        absenceTypeId: '',
        airportId: ''
      },
      offon: '',
      takeOptions: [],
      tableData1: [],
      tableData2: [],
      tableData3: []
    }
  },
  //   watch: {
  //       listQuery
  //   },
  created() {
    this.initData()
    this.selectData()
  },
  methods: {
    initData() {
      this.listQuery.businessDomainId = this.businessDomainId
      this.listQuery.airportId = this.airportId
      initData2(this.listQuery).then(response => {
        this.tableData1 = response.data.data.exchanges
        this.tableData2 = response.data.data.rests
        this.tableData3 = response.data.data.absences
        this.homeLeaveNum = response.data.data.absenceStats.homeLeaveNum
        this.maternityLeaveNum = response.data.data.absenceStats.maternityLeaveNum
        this.personaLeaveNum = response.data.data.absenceStats.personaLeaveNum
        this.sickLeaveNum = response.data.data.absenceStats.sickLeaveNum
        this.weddingLeaveNum = response.data.data.absenceStats.weddingLeaveNum
      })
    },
    sechData() {
      if (this.listQuery.endDate == null) {
        this.listQuery.endDate = ''
      }
      if (this.listQuery.startDate == null) {
        this.listQuery.startDate = ''
      }
      this.listQuery.businessDomainId = this.businessDomainId
      initData2(this.listQuery).then(response => {
        if (response.data.data) {
          this.tableData1 = response.data.data.exchanges
          this.tableData2 = response.data.data.rests
          this.tableData3 = response.data.data.absences
          this.homeLeaveNum = response.data.data.absenceStats.homeLeaveNum
          this.maternityLeaveNum = response.data.data.absenceStats.maternityLeaveNum
          this.personaLeaveNum = response.data.data.absenceStats.personaLeaveNum
          this.sickLeaveNum = response.data.data.absenceStats.sickLeaveNum
          this.weddingLeaveNum = response.data.data.absenceStats.weddingLeaveNum
          this.$message.success('查询成功')
        }
      })
    },
    handleClick(tab, event) {
      if (tab.label === '请假') {
        this.offon = true
      } else {
        this.offon = false
      }
    },
    change(val) {
      if (val == null) {
        this.listQuery.startDate = ''
      }
    },
    change1(val) {
      if (val == null) {
        this.listQuery.endDate = ''
      }
    },
    selectData() {
      selectData2().then(response => {
        if (response.data.data) {
          this.takeOptions = response.data.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  margin-bottom: 2px;
  margin-top: 70px;
  background: #172449;
  padding: 10px;
}
.cols {
  display: inline-block;
text-align: right;
  width: 100%;
  span {
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    margin-right: 20px;
    ins {
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
    }
    ins.zb {
      background: #5677d5;
    }
    ins.zb2 {
      background: #d8a738;
    }
    ins.wb {
      background: #a168ff;
    }
    ins.xx {
      background: #666;
    }
    ins.yb {
      background: #000;
    }
  }
}
.add-user {
  background: rgb(23, 36, 73);
  width: 100%;
  padding: 6px 0 0 20px;
  .el-form-item__label {
    width: 100px;
    padding-right: 8px;
  }
  .el-button {
    margin: 0 6px;
  }
  span {
    padding-left: 10px;
  }
  .el-form {
    .el-input {
      width: 140px;
      margin: 5px 0;
    }

    .el-select {
      width: 140px;
      margin: 5px 0;
    }
  }
}
</style>

