<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑航线信息</div>
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
        <el-table-column prop="lineName" label="名称" />
        <el-table-column prop="lineCode" label="编号" />
        <el-table-column prop="lineTypeName" label="类型" />
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
          <el-form-item prop="lineName" label="航线名称：" :label-width="formLabelWidth" :rules="{required: true,message: '请输入航线名称',trigger: 'blur'}">
            <el-input v-model="form.lineName" placeholder="请输入航线名称" />
          </el-form-item>
          <el-form-item prop="lineCode" label="编号：" :label-width="formLabelWidth" :rules="{required: true,message: '请输入编号（如 WEX-PUX 格式）',trigger: 'blur'}">
            <el-input v-model="form.lineCode" placeholder="请输入编号（如：WEX-PUX 格式）" />
          </el-form-item>
          <el-form-item prop="lineType" label="类型：" :label-width="formLabelWidth" :rules="{required: true,message: '请选择航线类型',trigger: 'change'}">
            <el-select v-model="form.lineType" placeholder="请选择" style="width:280px">
              <el-option v-for="item in navlineOptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
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
import { initData, addDatafcn, eitDatafcn, deleteDatafcn } from '@/api/navLine'
export default {
  data() {
    return {
      title: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      attendanceTable: [],
      navlineOptions: [{ id: 'D', value: '国内' }, { id: 'I', value: '国际' }, { id: 'R', value: '地区' }],
      index: '',
      form: { lineName: '', lineCode: '', lineType: '' }
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
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.lineName = row.lineName
      this.form.lineCode = row.lineCode
      this.form.lineType = row.lineType
      this.index = row.lineId
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
            editData.lineId = this.index
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
            lineId: row.lineId
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
