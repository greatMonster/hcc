<template>
  <div style="margin-top:60px">
    <div class="add-user">
      <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item label="承运人">
          <el-select v-model="listQuery.carrier" placeholder="请选择" style="width:180px" clearable>
            <el-option v-for="(item,i) in carrierOptions" :key="i" :label="item.carrierName" :value="item.val">
              <span style="float: left">{{ item.carrierName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.val }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="航班号">
          <el-select v-model="listQuery.flightNo" filterable clearable style="width:180px">
            <el-option v-for="item in flightNoArry" :key="item.val" :label="item.val" :value="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="国际/国内">
          <el-select v-model="listQuery.IDflag" filterable clearable style="width:180px">
            <el-option v-for="item in IDOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="detail-style">
      <span>共享航班总数{{ hasRelation }}</span>
    </div>
    <div class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="carrier" label="承运人" />
        <el-table-column prop="actype" label="机号" />
        <el-table-column prop="flightNoJ" label="共享航班号" />
        <el-table-column prop="deptAirport" label="起飞站">
          <template slot="scope">无锡</template>
        </el-table-column>
        <el-table-column prop="arrAirport" label="到达站">
          <template slot="scope">上海</template>
        </el-table-column>
        <el-table-column prop="weekDay" label="班期" />
        <el-table-column prop="validDate" label="有效执行期">
          <template slot="scope">2020年4-7月</template>
        </el-table-column>
        <el-table-column prop="intlFlag" label="国际/国内">
          <template slot-scope="scope">
            <span v-if="scope.row.intlFlag=='D'">国际</span>
            <span v-if="scope.row.intlFlag=='I'">国内</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="throughFlag" label="是否过站">
          <template slot-scope="scope">
            <span v-if="scope.row.throughFlag=='0'">否</span>
            <span v-if="scope.row.throughFlag=='1'">是</span>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import { initTable2, selectData } from '@/api/flightSchedule'
export default {
  name: 'RelationPage',
  data() {
    return {
      acTypeOptions: [],
      carrierOptions: [],
      flightNoArry: [],
      hasRelation: '',
      noRelation: '',
      listQuery: {
        carrier: '',
        flightNo: '',
        acType: ''
      },
      IDOptions: [
        { name: '国际', id: 'I' },
        { name: '国内', id: 'D' }
      ],
      AirportArry: [],
      tableData: [],
      FlightScheduleArry: []
    }
  },
  computed: {},
  created() {
    this.selectData()
    this.initable()
  },
  methods: {
    initable() {
      this.listQuery.documentId = this.$route.query.documentId
      initTable2(this.listQuery).then(response => {
        if (response.data.data) {
          this.tableData = response.data.data.lists
          this.noRelation = response.data.data.noRelation
          this.hasRelation = response.data.data.hasRelation
          this.listLoading = false
        }
      })
    },
    search() {
      this.listQuery.documentId = this.$route.query.documentId
      initTable2(this.listQuery).then(response => {
        if (response.data.data) {
          this.tableData = response.data.data.lists
          this.noRelation = response.data.data.noRelation
          this.hasRelation = response.data.data.hasRelation
          this.listLoading = false
          this.$message.success('查询成功')
        } else {
          this.tableData = []
        }
      })
    },
    selectData() {
      selectData(this.$route.query.documentId).then(res => {
        this.flightNoArry = res.data.data.flightNo
        this.carrierOptions = res.data.data.carrier
        this.AirportArry = res.data.data.acType
      })
    }
  }
}
</script>

<style>
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #0a142f !important;
}
</style>

<style scoped lang="scss">
.add-user {
  background: rgb(23, 36, 73);
  width: 100%;
  padding: 26px 0 0 20px;
  .el-form-item__label {
    width: 100px;
    padding-right: 8px;
  }
  .el-button {
    margin: 0 6px;
  }
  .el-form {
    margin-right: 20px;
    .el-input,
    .el-select {
      width: 150px;
    }
  }
}
.body {
  width: 100%;
  /* min-height: 1000px; */
  /* margin-top: 60px; */
}

.detail-style {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
}
.blank-style {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: white;
  font-family: '宋体';
  font-size: 25px;
  background-color: #232c47;
}
</style>
