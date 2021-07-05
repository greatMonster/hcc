<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑基线类型</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="small" @click="addHandleClick">新 增</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table v-loading="listLoading" :data="baselineTable" border stripe>
        <!-- <el-table-column prop="code" label="编号" /> -->
        <el-table-column type="index" />
        <el-table-column prop="name" label="名称" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加编辑新合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="baselineFormVisible">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="name" label="基线类型名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373;color: white;" @click="baselineFormVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleAddClick()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, addBaseline, editBaseline, deleteBaseline } from '@/apiNew/baselineType'
export default {
  name: 'BaselineType',
  data() {
    return {
      listLoading: true,
      rowId: '',
      title: '',
      baselineFormVisible: false,
      formLabelWidth: '120px',
      baselineTable: [],
      form: {},
      rules: {
        name: [{ required: true, message: '请填写基线类型名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      initTable()
        .then(response => {
          this.baselineTable = response.data.data
          this.listLoading = false
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.response.data.message
          })
        })
    },
    addHandleClick() {
      this.title = '新增'
      this.form = {}
      this.baselineFormVisible = true
    },
    editHandleClick(index, row) {
      this.rowId = row.id
      this.form.name = row.name
      this.baselineFormVisible = true
      this.title = '修改'
    },
    // 确定按钮
    handleAddClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert('submit!')
          if (this.title === '新增') {
            var data2 = {
              name: this.form.name
            }
            addBaseline(data2)
              .then(response => {
                this.$message.success('新增成功')
                this.init()
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: error.response.data.message
                })
              })
            this.baselineFormVisible = false
          } else if (this.title === '修改') {
            var data = {
              name: this.form.name,
              id: this.rowId
            }
            editBaseline(data)
              .then(response => {
                this.$message.success('修改成功')
                this.init()
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: error.response.data.message
                })
              })
            this.baselineFormVisible = false
          }
        } else {
        //   console.log('error submit!!')
          return false
        }
      })
    },
    open(index, row) {
      var data2 = {
        id: Number(row.id)
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteBaseline(data2)
            .then(response => {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error.response.data.message
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
.skillBox /deep/ td,
tr,
th {
  text-align: left;
}
.skillBox /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
form {
  margin-top: 20px;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
  font-size: 15px;
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
