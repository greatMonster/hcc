<template>
  <div class="box">
    <div class="add-user" style="display: flex; justify-content: space-between">
      <el-form :inline="true" :model="formSelect" size="small">
        <el-form-item label="用户">
          <el-input v-model="formSelect.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formSelect.name" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formSelect.status" clearable placeholder="请选择">
            <el-option v-for="(items, indexs) in statusOptions" :key="indexs" :label="items.label" :value="items.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formSelect.roles" multiple clearable collapse-tags placeholder="请选择">
            <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit('search')">查询</el-button>
          <el-button size="small" type="primary" @click="addUserClick">新增</el-button>
          <el-button size="small" type="primary" @click="ImportTemplate">模板</el-button>
          <selected-import class="filter-top-item right-section2" :user-type="userType" :name="name" :post-url="url" @refreshData="onSubmit" />
        </el-form-item>
        <el-form-item>
          <el-switch v-model="activeSwitch" active-text="PC端用户" inactive-text="移动端用户" @change="changeClick" />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeSwitch" class="table-style">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">有效</span>
            <span v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditClick(scope.$index, scope.row)">修 改</el-button>
            <el-button v-if="scope.row.status" type="primary" size="mini" @click="open(scope.$index, scope.row)">禁 用</el-button>
            <el-button v-else type="primary" size="mini" @click="open(scope.$index, scope.row)">恢 复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="table-style">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="organizationName" label="部门" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == -1">已禁用</span>
            <span v-if="scope.row.status == 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditClick(scope.$index, scope.row)">修 改</el-button>
            <el-button v-if="scope.row.status" type="primary" size="mini" @click="open(scope.$index, scope.row)">禁 用</el-button>
            <el-button v-else type="primary" size="mini" @click="open(scope.$index, scope.row)">恢 复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑用户信息弹框 -->
    <div>
      <el-dialog :title="titled" :visible.sync="dialogEditVisible">
        <el-form ref="formEdit" :rules="formEditRules" :model="formEdit">
          <p style="text-align: right; color: red">(移动端用户名为手机号)</p>
          <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
            <el-input v-model="formEdit.username" placeholder="请输入6-25个字符" :disabled="offon" />
          </el-form-item>
          <el-form-item prop="name" label="名字" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入名字" />
          </el-form-item>
          <el-form-item prop="phone" label="手机号" :label-width="formLabelWidth">
            <el-input v-model="formEdit.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="formEdit.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item prop="roleId" label="请先选择角色" :label-width="formLabelWidth">
            <el-select v-model="formEdit.roleId" placeholder="请选择">
              <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="password" label="输入密码" :label-width="formLabelWidth">
            <el-input v-model="formEdit.password" placeholder="请输入6-25个字符" show-password />
          </el-form-item>
          <el-form-item prop="pswagain" label="重新输入密码" :label-width="formLabelWidth">
            <el-input v-model="formEdit.pswagain" placeholder="请输入内容" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="dialogEdit">取 消</el-button>
          <el-button type="primary" @click="handleEditConfirmClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import selectedImport from '@/components/BulkImport/selectedImport'
import { mapGetters } from 'vuex'
import { initData, select, addData, editData, statusData, unblaockData } from '@/api/userManagement'
export default {
  components: {
    selectedImport
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/
      if (value.length < 6 || value.length > 12) {
        callback(new Error('密码应在6-12位'))
      } else if (this.formEdit.username === value) {
        callback('用户名称和密码不能相同')
      } else if (!reg.test(value)) {
        callback('密码长度6~12位之间,必须包括大小写字母、数字和特殊字符组合')
      } else {
        callback()
      }
    }
    return {
      activeSwitch: true,
      name: 'file',
      url: `${process.env.VUE_APP_BASE_API}` + 'api/v1/users/addUser?userType=',
      titled: '',
      id: '',
      offon: false,
      dialogEditVisible: false,
      formLabelWidth: '170px',
      formSelect: { username: '', name: '', status: '', roleId: '' },
      statusOptions: [
        { value: false, label: '已禁用' },
        { value: true, label: '有效' }
      ],
      roleOptions: [],

      formEdit: {
        username: '',
        name: '',
        roleId: '',
        password: '',
        phone: '',
        email: ''
      },
      formEditRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        pswagain: [{ required: true, trigger: 'blur', message: '请重新输入密码' }],
        username: [{ required: true, trigger: 'blur', message: '请重新输入用户名' }],
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        roleId: [{ required: true, trigger: 'change', message: '请选择角色' }]
      },
      userType: '',
      data: {},
      tableData: []
    }
  },
  watch: {
    getUserData: function (li) {
      this.formEdit.username = li.data.username
      this.formEdit.name = li.data.name
      this.formEdit.phone = li.data.phone
      this.formEdit.email = li.data.email
      this.formEdit.roleId = li.data.roleId
      this.id = li.data.id
    },
    deep: true
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['getUserData'])
  },
  created() {
    this.selectData()
    this.init()
  },
  methods: {
    ImportTemplate() {
      // window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/users/template'
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/users/template'
    },
    addUserClick() {
      this.titled = '添加新用户'
      this.dialogEditVisible = true
      this.offon = false
      this.clearData()
    },
    init() {
      if (this.activeSwitch) {
        this.userType = 'MANAGER'
      } else {
        this.userType = 'APP'
      }
      this.formSelect.userType = this.userType
      this.formEdit.userType = this.userType
      this.url = `${process.env.VUE_APP_BASE_API}` + 'api/v1/users/addUser?userType=' + this.userType
      initData(this.formSelect).then((response) => {
        this.tableData = response.data.data
      })
    },
    changeClick() {
      this.init()
      this.selectData()
    },
    onSubmit(params) {
      if (params !== 'search') {
        console.log(params.result, 6666)
        if (params.result === 'success') {
          this.$message.success('导入成功')
        } else {
          this.$message.error(JSON.parse(params.response.message).message)
          return
        }
      }
      if (this.activeSwitch) {
        this.userType = 'MANAGER'
      } else {
        this.userType = 'APP'
      }
      this.formSelect.userType = this.userType
      initData(this.formSelect).then((response) => {
        this.$message.success('查询成功')
        this.tableData = response.data.data
      })
    },
    handleEditClick(index, row) {
      this.titled = '修改用户'
      this.clearData()
      this.offon = true
      this.$store.dispatch('getData', row.id)
      this.dialogEditVisible = true
    },
    handleEditConfirmClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.titled === '添加新用户') {
            if (this.formEdit.password !== this.formEdit.pswagain) {
              this.dialogEditVisible = true
              this.$message({
                message: '俩次输入的密码不相符',
                type: 'error'
              })
            } else {
              this.formEdit.userType = this.userType
              delete this.formEdit.pswagain
              addData(this.formEdit).then((response) => {
                this.$message.success('新增成功')
                this.init()
                this.clearData()
              })
              this.dialogEditVisible = false
            }
          } else {
            this.dialogEditVisible = false
            if (this.formEdit.password === '' && this.formEdit.pswagain === '') {
              delete this.formEdit.password
              delete this.formEdit.pswagain
              this.formEdit.id = this.id
              editData(this.formEdit).then((response) => {
                this.$message.success('修改成功')
                this.init()
                this.clearData()
              })
            } else {
              if (this.formEdit.password !== this.formEdit.pswagain) {
                this.dialogEditVisible = true
                this.$message({
                  message: '俩次输入的密码不相符',
                  type: 'error'
                })
              } else {
                delete this.formEdit.pswagain
                this.formEdit.id = this.id
                editData(this.formEdit).then((response) => {
                  this.$message.success('修改成功')
                  this.init()
                  this.clearData()
                })
              }
            }
          }
        } else {
          return false
        }
      })
    },
    selectData() {
      select(this.userType).then((response) => {
        this.roleOptions = response.data.data
      })
    },
    open(index, row) {
      if (row.status === true) {
        statusData(row.id).then((response) => {
          this.init()
        })
      } else if (row.status === false) {
        unblaockData(row.id).then((response) => {
          this.init()
        })
      }
    },
    dialogEdit() {
      this.dialogEditVisible = false
    },
    clearData() {
      this.formEdit = {
        username: '',
        name: '',
        roleId: '',
        password: '',
        pswagain: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-top-item {
  float: right;
  margin-left: 5px;
}
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
