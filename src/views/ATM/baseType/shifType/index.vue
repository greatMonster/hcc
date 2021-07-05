<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑轮班类型</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="shiftTypeTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column prop="shiftName" label="轮班类型" />
        <el-table-column prop="shiftCode" label="编码" />
        <el-table-column prop="fromTime" label="开始时间">
          <template slot-scope="scope">{{ scope.row.fromTime?scope.row.fromTime.substr(0,5): '' }}</template>
        </el-table-column>
        <el-table-column prop="color" label="颜色" center>
          <template slot-scope="scope">
            <!-- <el-color-picker v-model="scope.row.color" size="mini" /> -->
            <div :style="{'background':scope.row.color,'width': '15px','height': '15px','margin': '0 auto'}" />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="priority" label="优先级" />
        <el-table-column prop="status" label="状态" />-->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formEdit" :model="formEdit" :rules="formRules">
          <el-form-item prop="shiftName" label="轮班类型名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.shiftName" placeholder="请输入轮班类型名" />
          </el-form-item>
          <el-form-item prop="shiftCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.shiftCode" placeholder="请输入编码" />
          </el-form-item>
          <el-form-item prop="fromTime" label="开始时间：" :label-width="formLabelWidth">
            <el-time-select v-model="formEdit.fromTime" placeholder="起始时间" :picker-options="{ start: '00:00:00',step: '00:05:00',end: '24:00:00'}" />
            <!-- <el-time-picker v-model="formEdit.fromTime" arrow-control="true" clearable format="HH:mm" value-format="HH:mm:ss" placeholder="选择时间" /> -->
          </el-form-item>
          <!-- <el-form-item prop="endTime" label="到期日期：" :label-width="formLabelWidth">
            <el-date-picker v-model="formEdit.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
          </el-form-item>-->
          <el-form-item prop="color" label="颜色：" :label-width="formLabelWidth">
            <el-color-picker v-model="formEdit.color" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData, addDatafcn, eitDatafcn, deleteDatafcn } from '@/api/shiftType'
export default {
  name: 'ShiftType',
  data() {
    return {
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      index: '',
      shiftTypeTable: [],
      formEdit: { shiftName: '', shiftCode: '', fromTime: '', color: '#409EFF' },
      formRules: {
        shiftName: [{ required: true, message: '请输入轮班类型' }]
        // fromTime: [{ required: true, message: '请选择起始时间' }]
      }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initData().then(response => {
        if (response.code === '200') {
          this.shiftTypeTable = response.data
        } else {
          this.$message.error(response.message)
        }
      })
    },
    printClick() {},
    importClick() {},
    addClick() {
      this.editSkillVisible = true
      this.title = '添加'
      this.formEdit.shiftName = ''
      this.formEdit.shiftCode = ''
      this.formEdit.fromTime = ''
      this.formEdit.color = '#409EFF'
    },
    // 添加合同的启用状态按钮
    adduserbleClick() {},
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.formEdit.shiftName = row.shiftName
      this.formEdit.shiftCode = row.shiftCode
      this.formEdit.fromTime = row.fromTime ? row.fromTime.substring(0, 5) : ''
      this.formEdit.color = row.color
      this.title = '修改'
      this.editSkillVisible = true
      this.index = row.shiftTypeId
    },
    edituserbleClick() {},
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '修改') {
            var editData = this.formEdit
            editData.shiftTypeId = this.index
            editData.fromTime = this.formEdit.fromTime + ':00'
            eitDatafcn(editData).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.initTable()
                this.editSkillVisible = false
                // this.$refs[formName].resetFields()
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            var addData = this.formEdit
            addData.fromTime = this.formEdit.fromTime + ':00'
            addDatafcn(addData).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.initTable()
                this.editSkillVisible = false
                // this.$refs[formName].resetFields()
              } else {
                this.$message.error(response.message)
              }
            })
          }
        }
      })
    },
    handleSelectChange(row) {
    //   console.log(row)
    },
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            shiftTypeId: row.shiftTypeId
          }
          deleteDatafcn(data).then(response => {
            if (response.code === '200') {
              this.initTable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
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
</style>
