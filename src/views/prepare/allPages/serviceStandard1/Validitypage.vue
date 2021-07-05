<template>
  <div class="box">
    <div style="margin:30px 5px">校验结果</div>
    <el-table v-if="offon" :data="tableData" border stripe>
      <el-table-column prop="date" type="index" width="50" sortable />
      <el-table-column prop="flightNo" label="航班号" />
      <el-table-column prop="flightType" label="航班类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row.flightType=='A'?'进港':scope.row.flightType=='D'?'出港':'' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sta" label="时间" />
      <el-table-column v-for="item in tableTitle" :key="item.taskTypeId" :prop="item.taskTypeId+''" :label="item.taskTypeName">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row[item.taskTypeId]=='true'?true:false" class="el-icon-success" />
            <span v-else class="el-icon-error" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :data="tableData" border stripe>
      <el-table-column prop="date" type="index" width="50" sortable />
      <el-table-column prop="flightNo" label="航班号" />
      <el-table-column prop="flightType" label="航班类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row.flightType=='A'?'进港':scope.row.flightType=='D'?'出港':'' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sta" label="时间" />
      <el-table-column v-for="item in tableTitle" :key="item.groupId" :prop="item.groupId+''" :label="item.groupName">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row[item.groupId]==='true'?true:false" class="el-icon-success" />
            <span v-else class="el-icon-error" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ValidityFcn } from '@/api/serviceStandard'
import { ValidityFcn2 } from '@/apiNew/standardNew'
export default {
  data() {
    return {
      tableData: [],
      tableTitle: [],
      offon: this.$route.query.offon
    }
  },

  created() {
    this.initData()
  },
  mounted() {

  },
  methods: {
    initData() {
      if (this.$route.query.offon) {
        var data = {
          airportId: this.$store.state.user.airport.airportId,
          id: this.$route.query.id
        }
        ValidityFcn2(data).then(res => {
          if (res.data.code === '200') {
            this.tableTitle = res.data.data.ruleGroups
            this.tableData = res.data.data.matchResults
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      } else {
        var data = {
          standardDocumentId: JSON.parse(this.$route.query.data).standardDocumentId,
          flightDocumentId: JSON.parse(this.$route.query.data).flightDocument.id,
          fromDate: JSON.parse(this.$route.query.data).date[0],
          toDate: JSON.parse(this.$route.query.data).date[1]
        }
        ValidityFcn(data).then(res => {
          if (res.data.code === '200') {
            this.tableTitle = res.data.data.ruleGroups
            this.tableData = res.data.data.matchResults
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
 .box{
     padding-top: 80px;
 }
.el-icon-error{
    color: red;
    font-size: 20px;
}
.el-icon-success{
    color: green;
     font-size: 20px;
}
</style>
