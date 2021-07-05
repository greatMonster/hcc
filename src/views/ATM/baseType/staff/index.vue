<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div v-if="offon">添加或编辑员工类型</div>
        <div v-if="!offon">本页面只可浏览，如要编辑请至各业务模块下操作</div>
      </div>
      <div class="addButton">
        <el-button v-if="offon" type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="empTypeName" label="名称" />
        <el-table-column prop="contractBean.contractName" label="合同详情" />
        <el-table-column prop="roleBean.roleName" label="角色" />
        <el-table-column prop="defaultCount" label="混合技能排班指定人数" />
        <el-table-column v-if="offon" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改角色弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" @close="closeDialog('formEdit')">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="empTypeName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.empTypeName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="contractId" label="合同详情：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.contractId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in empType" :key="item.contractId" :label="item.contractName" :value="item.contractId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="roleId" label="角色：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.roleId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="defaultCount" label="混合技能排班人数上限：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.defaultCount" type="tel" autocomplete="off" maxlength="3" placeholder="请输入" />
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
import { initTable } from '@/api/agreementDtail'
import { select, add, remove, set, role } from '@/api/staff'
export default {
  name: 'Staff',
  data() {
    return {
      listLoading: true,
      rowId: '',
      select2: [],
      offon: false,
      currentPage: 4,
      title: '',
      id: this.$route.query.businessDomainId || '',
      isIndeterminate: true,
      editSkillVisible: false,
      formLabelWidth: '180px',
      skillShowTable: [],
      formEdit: { empTypeName: '', roleId: '', defaultCount: '', contractId: '' },
      empType: [],
      options: [],
      rules: {
        empTypeName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initable()
      }

    }
  },
  created() {
    if (this.$route.query.businessDomainId) {
      this.offon = true
    }
    this.initable()
    this.initTable()
    this.role()
  },
  methods: {
    initable() {
      var data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      // 查询
      select(data).then(response => {
        this.skillShowTable = response.data
        this.listLoading = false
      })
    },
    initTable() {
      var data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      initTable(data).then(response => {
        this.empType = response.data
      })
    },
    role() {
      var data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      role(data).then(response => {
        this.options = response.data
        this.listLoading = false
      })
    },
    // 分页
    handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`)
    }, //
    printClick() {},
    importClick() {},
    addSkillClick(formName) {
      this.title = '添加'
      this.editSkillVisible = true
      if (this.$refs.formEdit) {
        this.$refs.formEdit.resetFields()
      }
      this.formEdit.empTypeName = ''
      this.formEdit.contractId = ''
      this.formEdit.roleId = ''
      this.formEdit.defaultCount = ''
    },
    // 是否允许多个值
    userbleClick() {},
    adduserbleClick() {},
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.formEdit.empTypeName = ''
      this.formEdit.empTypeName = row.empTypeName
      this.formEdit.contractId = ''
      if (row.contractBean) {
        this.formEdit.contractId = row.contractBean.contractId
      }
      this.formEdit.employeeTypeId = row.employeeTypeId
      this.formEdit.roleId = ''
      this.formEdit.roleId = row.roleId
      this.formEdit.defaultCount = ''
      this.formEdit.defaultCount = row.defaultCount
      this.editSkillVisible = true
      // this.rowId = row.roleId
    },
    closeDialog(formName) {
      // this.$refs[formName].resetFields()
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            this.formEdit.airportId = this.airport.airportId
            set(this.formEdit).then(response => {
              this.$message.success('修改成功')
              this.initable()
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            this.formEdit.id = this.id
            this.formEdit.airportId = this.airport.airportId
            add(this.formEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.initable()
              }
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    open(index, row) {
      var data2 = {
        employeeTypeId: row.employeeTypeId,
        del: 1
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then(response => {
            if (response.code === '200') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'success',
                message: response.message
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.el-checkbox-group {
  height: 100%;
  align-items: baseline;
  box-sizing: border-box;
  padding: 0 10px;
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
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
.block {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
