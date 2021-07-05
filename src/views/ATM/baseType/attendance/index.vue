<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑缺席信息</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="attendanceTable" border stripe>
        <el-table-column prop="absenceName" label="名称" />
        <el-table-column prop="absenceCode" label="编码" />
        <el-table-column prop="absenceColor" label="颜色">
          <template slot-scope="scope">
            <div :style="{'background':scope.row.absenceColor,'width': '15px','height': '15px','margin': '0 auto'}" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑缺席弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="attendanceDialogVisible">
        <el-form ref="form" :model="form">
          <el-form-item prop="absenceName" label="缺席类型名称：" :label-width="formLabelWidth" :rules="{required: true,message: '请输入缺席类型'}">
            <el-input v-model="form.absenceName" placeholder="请输入缺席类型名称" />
          </el-form-item>
          <el-form-item prop="absenceCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="form.absenceCode" placeholder="请输入编码" />
          </el-form-item>
          <el-form-item prop="absenceColor" label="颜色：" :label-width="formLabelWidth">
            <el-color-picker v-model="form.absenceColor" />
          </el-form-item>
          <!-- <el-form-item prop="status" label="状态：" :label-width="formLabelWidth">
            <el-input v-model="form.status" placeholder="请输入缺席信息状态" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="attendanceDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData, addDatafcn, eitDatafcn, deleteDatafcn } from '@/api/absenceType'
export default {
  data() {
    return {
      title: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      attendanceTable: [],
      index: '',
      form: { absenceName: '', absenceCode: '', absenceColor: '#409EFF' }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initData().then(response => {
        if (response.code === '200') {
          this.attendanceTable = response.data
        } else {
          this.$message.error(response.message)
        }
      })
    },
    addHandleClick() {
      this.title = '添加'
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      // this.form.absenceName = ''
      // this.form.absenceCode = ''
      // this.form.absenceColor = '#409EFF'
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.absenceName = row.absenceName
      this.form.absenceCode = row.absenceCode
      this.form.absenceColor = row.absenceColor
      this.index = row.absenceTypeId
      this.attendanceDialogVisible = true
      this.title = '编辑'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '添加') {
            addDatafcn(this.form).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.initTable()
                this.attendanceDialogVisible = false
              } else {
                this.$message.error(response.message)
              }
            })
          } else if (this.title === '编辑') {
            var editData = this.form
            editData.absenceTypeId = this.index
            eitDatafcn(editData).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.attendanceDialogVisible = false
                this.initTable()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    //     // 添加合同的启用状态按钮
    adduserbleClick() {},
    //     // 修改行数据按钮
    edituserbleClick() {},
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            absenceTypeId: row.absenceTypeId
          }
          deleteDatafcn(data).then(response => {
            if (response.code === '200') {
              this.initTable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message.error(response.message)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

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
