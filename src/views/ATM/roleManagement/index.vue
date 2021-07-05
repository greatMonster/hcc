<template>
  <div class="box">
    <div class="add-user" style="display:flex;justify-content : space-between">
      <el-form :inline="true" :model="formSelect" size="small">
        <el-form-item label="名称">
          <el-input v-model="formSelect.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button size="small" type="primary" @click="addUserClick">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-style">
      <el-table :data="tableData" border :header-row-style="{ 'background-color': 'rgb(10, 20, 47)' }" :row-style="{ 'background-color': '#232c47' }" style="width: 100%;color:white">
        <el-table-column prop="name" label="名称" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { initData, removeData } from '@/api/rulesManagement'
export default {
  data() {
    return {
      formLabelWidth: '170px',

      roleOptions: [],
      formEdit: {},
      formSelect: {
        name: ''
      },
      data: {},
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {},

  created() {
    this.initial()
  },
  methods: {
    addUserClick() {
      this.$router.push({ path: '/ATM/editAdd' })
    },
    initial() {
      initData(this.formSelect.name).then(response => {
        this.tableData = response.data.data
      })
    },
    onSubmit() {
      initData(this.formSelect.name).then(response => {
        this.tableData = response.data.data
        this.$message.success('查询成功')
      })
    },
    handleEditClick(index, row) {
      this.$router.push({ path: '/ATM/editAdd', query: { id: row.id }})
    },
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeData(row.id).then(response => {
            if (response.data) {
              this.initial()
              this.$message({
                type: 'success',
                message: response.data.message
              })
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.response.data.message
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  margin-top: 60px;
}
.add-user {
  width: 100%;
  padding: 20px 0 0 20px;
  .el-form {
    .el-input,
    .el-select {
      width: 150px;
    }
  }
}
.table-style {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
