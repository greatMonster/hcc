<template>
  <div class="body">
    <div class="title">

      <div class="titleWord">
        添加或编辑航班性质
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table :data="terminalTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column prop="flightNatureName" label="名称" />
        <el-table-column prop="caacCode" label="CAAC代码" />
        <el-table-column prop="iataCode" label="IATA代码" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加距离弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="ruleDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="flightNatureName" label="名称" filterable :label-width="formLabelWidth">
            <el-input v-model="form.flightNatureName" placeholder="名称" style="width:180px" />
          </el-form-item>
          <el-form-item prop="caacCode" label=" CAAC代码" :label-width="formLabelWidth">
            <el-input v-model="form.caacCode" placeholder="名称" style="width:180px" />
          </el-form-item>
          <el-form-item prop="iataCode" label="IATA代码" :label-width="formLabelWidth">
            <el-input v-model="form.iataCode" placeholder="名称" style="width:180px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="ruleDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { initData, addDatafcn, eitDatafcn, deleteDatafcn } from '@/api/natureFlight'
export default {
  name: 'DistanceRule',
  data() {
    return {
      flightNatureId: '',
      title: '',
      formLabelWidth: '250px',
      terminalTable: [],
      ruleDialogVisible: false,
      formRules: {
        flightNatureName: [{ required: true, message: '名称不能为空' }],
        caacCode: [{ required: true, message: '该选项不能为空' }],
        iataCode: [{ required: true, message: '该选项不能为空' }]
      },
      form: { flightNatureName: '', caacCode: '', iataCode: '' }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initData().then(response => {
        if (response.data.code === '200') {
          this.terminalTable = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
      })
    },
    addHandleClick() {
      this.form.flightNatureName = ''
      this.form.caacCode = ''
      this.form.iataCode = ''
      this.ruleDialogVisible = true
      this.title = '新增'
    },
    editHandleClick(index, row) {
      this.form.flightNatureName = row.flightNatureName
      this.form.caacCode = row.caacCode
      this.form.iataCode = row.iataCode
      this.flightNatureId = row.flightNatureId
      this.ruleDialogVisible = true
      this.title = '修改'
    },
    handleAddClick(formName) {
      if (this.title === '新增') {
        var data = {
          flightNatureName: this.form.flightNatureName,
          caacCode: this.form.caacCode,
          iataCode: this.form.iataCode
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDatafcn(data).then(response => {
              if (response.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.ruleDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
          } else {
            return false
          }
        })
      } else {
        data = {
          flightNatureName: this.form.flightNatureName,
          caacCode: this.form.caacCode,
          iataCode: this.form.iataCode,
          flightNatureId: this.flightNatureId
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            eitDatafcn(data).then(response => {
              if (response.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.ruleDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        deleteDatafcn(row).then(response => {
          if (response.data.code === '200') {
            this.initTable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style>
/* // 处理input type = number的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<style scoped>
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
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
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
