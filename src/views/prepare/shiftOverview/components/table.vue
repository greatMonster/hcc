<template>
  <div>
    <el-table
      :data="tableData"
      border
      stripe
    >
      <el-table-column sortable type="index" width="50" />
      <el-table-column sortable prop="employeeName" label="姓名" />
      <el-table-column sortable prop="employeeId" label="编号" />
      <el-table-column sortable prop="roleBeanList.roleName" label="角色" />
      <el-table-column sortable prop="name" label="技能" />
      <el-table-column sortable prop="organizationName" label="组织" />
      <!-- <el-table-column v-for="(item,index) in cols" :prop="item.prop" :key="index" :label="item.label" width="100" >
        <template slot-scope="scope">
          <div @click="showDiv(scope.row[item.prop])" style="background:red" class="scheduleDiv">
              {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          <div style="background:red" class="scheduleDiv" @click="showDiv(scope.row[fruit])">
            {{ scope.row[fruit] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { initTable } from '@/api/shiftOverview'
export default {
  name: 'Table',
  data() {
    return {
      tableData: [],
      formThead: ['周一', '周二', '周三', '周四']
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() { // init
      initTable().then(response => {
        this.tableData = response.data
        // this.dailyWorkBeanMap = response.dailyWorkBeanMap
      })
    }

  }
}
</script>
<style scoped>

</style>
