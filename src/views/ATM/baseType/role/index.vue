<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div v-if="offon">添加或编辑角色</div>
        <div v-if="!offon">本页面只可浏览，如要编辑请至各业务模块下操作</div>
      </div>
      <div class="addButton">
        <el-button v-if="offon" type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="roleName" label="名称" />
        <el-table-column label="技能">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.skillBeans" :key="index">{{ item.skillName }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleDesc" label="描述" />
        <!-- <el-table-column prop="roleCode" label="编码" /> -->
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
        <el-form ref="formEdit" :model="formEdit" :rules="formRules">
          <el-form-item prop="roleName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.roleName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="skillBeans" label="技能：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.skillBeans" multiple placeholder="请选择" style="width:500px;">
              <el-option v-for="item in options" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="roleDesc" label="描述：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.roleDesc" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item prop="roleCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.roleCode" placeholder="请输入" />
          </el-form-item>-->
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
import { skill } from '@/api/skill'
import { select, add, remove, set } from '@/api/role'
export default {
  name: 'RoleAdmin',
  data() {
    var that = this
    var roleSkillValidate = (rule, value, callback) => {
      const skillNames = []
      let i = 0
      if (that.formEdit.skillBeans.length !== 0) {
        that.options.forEach(item => {
          that.formEdit.skillBeans.forEach(element => {
            if (element === item.skillId) {
              skillNames.push(item.skillName)
            }
          })
        })
        skillNames.find(item2 => {
          if (item2 === value) {
            i = 1
            return false
          }
        })
      }
      if (i === 1) {
        callback(new Error('角色名称不能与技能名称重复'))
      } else {
        callback()
      }
    }
    var skillRoleValidate = (rule, value, callback) => {
      const skillNames = []
      let i = 0
      that.options.forEach(item => {
        value.forEach(element => {
          if (element === item.skillId) {
            skillNames.push(item.skillName)
          }
        })
      })
      if (this.formEdit.roleName) {
        skillNames.find(item2 => {
          if (item2 === this.formEdit.roleName) {
            i = 1
            return false
          }
        })
      }
      if (i === 1) {
        callback(new Error('角色名称不能与技能名称重复'))
      } else {
        callback()
      }
    }
    return {
      rowId: '',
      value: '',
      id: this.$route.query.businessDomainId || '',
      currentPage: 4,
      title: '',
      offon: false,
      isIndeterminate: true,
      editSkillVisible: false,
      formLabelWidth: '120px',
      skillShowTable: [],
      formEdit: {
        roleName: '',
        skillBeans: [],
        roleDesc: '',
        roleCode: ''
      },
      formRules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }, { validator: roleSkillValidate }],
        skillBeans: [{ required: true, message: '请选择技能', trigger: 'change' }, { validator: skillRoleValidate }],
        roleDesc: [{ required: true, message: '请填写描述', trigger: 'blur' }]
        // roleCode: [{ required: true, message: '请填写角色编码', trigger: 'blur' }]
      },
      options: [],
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.select()
      }

    }
  },
  created() {
    if (this.$route.query.businessDomainId) {
      this.offon = true
    }
    this.select()
    this.skill()
  },
  methods: {

    select() {
      // 查询
      var data = {
        id: this.id,
        airportId: this.airport.airportId
      }
      select(data).then(response => {
        this.skillShowTable = response.data

        this.listLoading = false
      })
    },
    skill() {
      var data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      skill(data).then(response => {
        this.options = response.data
        this.listLoading = false
      })
    },
    // 分页
    handleSizeChange(val) {

    },
    handleCurrentChange(val) {

    }, //

    addSkillClick(formName) {
      this.title = '添加'
      this.value = []
      this.formEdit = { roleName: '', skillBeans: [], roleDesc: '', roleCode: '' }
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      // debugger
      this.title = '修改'
      this.editSkillVisible = true
      this.rowId = row.roleId
      var skillIds = []
      row.skillBeans.forEach(item => {
        if (item.skillId) {
          skillIds.push(item.skillId)
        }
      })
      this.formEdit.roleName = row.roleName
      this.formEdit.skillBeans = skillIds
      this.formEdit.roleDesc = row.roleDesc
      this.formEdit.roleCode = row.roleCode
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var role = {
              airportId: this.airport.airportId,
              businessDomainId: this.id,
              roleName: this.formEdit.roleName,
              roleDesc: this.formEdit.roleDesc,
              roleCode: this.formEdit.roleCode,
              roleId: this.rowId + '',
              skillIds: this.formEdit.skillBeans
            }

            set(role).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.select()
                this.editSkillVisible = false
                this.$refs[formName].resetFields()
              } else {
                this.$message({
                  type: 'error',
                  message: response.message
                })
              }
            })
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var role = {
              skillIds: this.formEdit.skillBeans,
              roleName: this.formEdit.roleName,
              roleDesc: this.formEdit.roleDesc,
              roleCode: this.formEdit.roleCode,
              airportId: this.airport.airportId,
              businessDomainId: this.id
            }
            add(role).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.select()
              }
            })
            this.editSkillVisible = false
            this.$refs[formName].resetFields()
          }
        })
      }
    },
    open(index, row) {
      var data2 = {
        roleId: row.roleId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then(response => {
            if (response.code === '200') {
              this.select()
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
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
