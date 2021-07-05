<template>
  <div style="black">
    <el-table
      :data="tableData"
      border
      :header-row-style="{'background-color':'rgb(10, 20, 47)'}"
      :row-style="{'background-color':'#232c47'}"
      style="width: 100%;color:white"
    >
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="user" label="使用者" />
      <el-table-column prop="target" label="任务" />
      <!-- <el-table-column prop="loginType" label="loginType"></el-table-column>
        <el-table-column fixed="right" label="edit">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">修 改</el-button>
          </template>
        </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: 'huahua',
        status: 'Yes',
        user: 'personal',
        target: ''
      }, {
        date: 'huahua',
        status: 'Yes',
        user: 'personal',
        target: ''
      }, {
        date: 'huahua',
        status: 'Yes',
        user: 'personal',
        target: ''
      }]
    }
  }
}
</script>

<style scoped>

</style>
