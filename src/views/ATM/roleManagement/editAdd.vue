<template>
  <div class="user-box">
    <div class="box">
      <el-form ref="formEdit" :model="formEdit" :rules="formEditRules">
        <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
          <el-input v-model="formEdit.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item prop="code" label="角色编码" :label-width="formLabelWidth">
          <el-input v-model="formEdit.code" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item prop="roleType" label="角色类型" :label-width="formLabelWidth">
          <el-select v-model="formEdit.roleType" @change="changeRoleTypeFunc(formEdit.roleType)">
            <el-option v-for="item in roleTypeoptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="flag" key="1" prop="airportIds" label="机场" :label-width="formLabelWidth">
          <el-select v-model="formEdit.airportIds" value-key="airportId" multiple filterable collapse-tags @change="changeAirportFunc">
            <el-option v-for="item in airportIDoptions" :key="item.airportId" :label="item.airportName" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-else key="2" prop="airportIds" label="机场" :label-width="formLabelWidth">
          <el-select v-model="formEdit.airportIds" value-key="airportId" @change="changeAirportFunc">
            <el-option v-for="item in airportIDoptions" :key="item.airportId" :label="item.airportName" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formEdit.roleType !== 'APP'">
          <div class="pageNode">
            <div class="airportBOX">
              <ul @click="chengeActive">
                <li v-for="(item, i) in formEdit.airportIds" :key="i" :data-index="i" :data-item="JSON.stringify(item)" :class="['liStyle', { active: curIdx === i }]">{{ item.airportName }}</li>
              </ul>
            </div>
            <div class="nodeBox">
              <el-tree ref="tree" :data="data" show-checkbox node-key="id" :props="defaultProps" @check="changeCurrentFcn" />
            </div>
          </div>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="small" style="right: 150px" @click="cancel">取 消</el-button>
          <el-button size="small" style="right: 60px" type="primary" @click="handleEditConfirmClick('formEdit')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveData, editData, editSaveData, getRoleType, getPageByRoleType, editDataAirports } from '@/api/rulesManagement'
export default {
  data() {
    return {
      formLabelWidth: '170px',
      titled: '',
      curIdx: 0,
      options: [],
      flag: true,
      roleTypeoptions: [],
      formEdit: {
        name: '',
        code: '',
        roleType: '',
        airportIds: []
      },
      airportData: [],
      airportId: '',
      formEditRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择', trigger: 'change' }],
        airportIds: [{ required: true, message: '请选择', trigger: 'change' }]
      },

      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    this.getRoleTypefunc()
    this.airportIDoptions = this.userInfo.role.airports

    if (this.$route.query.id) {
      await this.editData()
      var data = {
        airportId: this.formEdit.airportIds[0].airportId,
        roleType: this.formEdit.roleType
      }
      await this.selectTree(data)
      var list = {
        id: this.$route.query.id,
        airportId: this.formEdit.airportIds[0].airportId
      }
      await this.editDataAirportsfunc(list)
    }
  },

  methods: {
    changeCurrentFcn() {
      this.formEdit.airportIds.forEach((item) => {
        if (item.airportId == this.airportId) {
          item.selectedIds = this.$refs.tree.getCheckedKeys()
        }
      })
      console.log(this.formEdit.airportIds)
    },
    editData() {
      return new Promise((resolve, reject) => {
        editData(this.$route.query.id).then((response) => {
          console.log(this.formEdit)
          console.log(response)
          if (response.data.data.roleType !== 'APP') {
            this.formEdit = {
              name: response.data.data.name,
              code: response.data.data.code,
              roleType: response.data.data.roleType,
              airportIds: response.data.data.airports
            }
          } else {
            this.formEdit = {
              name: response.data.data.name,
              code: response.data.data.code,
              roleType: response.data.data.roleType,
              airportIds: response.data.data.airports[0]
            }
          }

          resolve()
        })
      })
    },
    changeRoleTypeFunc(data) {
      this.data = []
      if (data == 'APP') {
        this.formEdit.airportIds = []
        this.flag = false
      } else {
        this.formEdit.airportIds = []
        this.flag = true
      }
    },
    cancel() {
      this.$confirm('本次修改的数据将丢失，确认不保存？', '提示', {
        confirmButtonText: '不保存',
        cancelButtonText: '返回'
      })
        .then(() => {
          this.$router.push({ path: '/ATM/roleManagement' })
        })
        .catch(() => {})
    },
    handleEditClick(index, row) {},
    handleEditConfirmClick() {
      this.$refs['formEdit'].validate((valid) => {
        var status = true
        if (valid) {
          if (this.formEdit.roleType !== 'APP') {
            var arr = this.formEdit.airportIds
            for (let i = 0; i < arr.length; i++) {
              if (!arr[i].selectedIds || !arr[i].selectedIds.length) {
                this.$message.warning(arr[i].airportName + '未配菜单权限')
                status = false
                return false
              }
            }
          }
          if (status) {
            if (this.$route.query.id) {
              var treeData1 = {
                id: this.$route.query.id,
                name: this.formEdit.name,
                code: this.formEdit.code,
                roleType: this.formEdit.roleType,
                airports: this.formEdit.roleType !== 'APP' ? this.formEdit.airportIds : [this.formEdit.airportIds]
              }
              editSaveData(treeData1).then((response) => {
                if (response.data) {
                  this.$message.success(response.data.message)
                  this.$router.push({ path: '/ATM/roleManagement' })
                } else {
                  this.$message.error(response.data.message)
                }
              })
            } else {
              var treeData = {
                name: this.formEdit.name,
                code: this.formEdit.code,
                roleType: this.formEdit.roleType,
                airports: this.formEdit.roleType !== 'APP' ? this.formEdit.airportIds : [this.formEdit.airportIds]
              }
              saveData(treeData).then((response) => {
                if (response.data) {
                  this.$message.success('新增成功')
                  this.$router.push({ path: '/ATM/roleManagement' })
                } else {
                  this.$message.error(response.data.message)
                }
              })
            }
          }
        }
      })
    },
    getRoleTypefunc() {
      getRoleType().then((res) => {
        if (res.data.code === '200') {
          this.roleTypeoptions = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    changeAirportFunc() {
      if (this.formEdit.airportIds.length) {
        var data = {
          airportId: this.formEdit.airportIds[0].airportId,
          roleType: this.formEdit.roleType
        }
        this.airportId = this.formEdit.airportIds[0].airportId
        this.selectTree(data)
      }
      console.log(this.formEdit.airportIds)
    },
    chengeActive(e) {
      this.$refs.tree.setCheckedKeys([])
      const tar = e.target
      const className = tar.className
      if (className.includes('liStyle')) {
        this.curIdx = parseInt(tar.dataset.index)

        this.airportId = JSON.parse(tar.dataset.item).airportId
        var data = {
          airportId: this.airportId,
          roleType: this.formEdit.roleType
        }
        this.selectTree(data)
        if (JSON.parse(tar.dataset.item).selectedIds) {
          this.$refs.tree.setCheckedKeys(JSON.parse(tar.dataset.item).selectedIds)
        }
        // if (JSON.parse(tar.dataset.item).pages) {
        //   var list = {
        //     id: this.$route.query.id,
        //     airportId: this.airportId
        //   }
        //   this.editDataAirportsfunc(list)
        // }
      }
    },
    editDataAirportsfunc(list) {
      editDataAirports(list).then((res) => {
        this.$refs.tree.setCheckedKeys(res.data.data)
      })
    },
    selectTree(data) {
      return new Promise((resolve, reject) => {
        getPageByRoleType(data).then((res) => {
          if (res.data.code === '200') {
            this.data = res.data.data
          }
          resolve()
        })
      })
    },
    dialogEdit() {}
  }
}
</script>
<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 10px 10px 10px;
}

.box {
  margin: 30px 0;
  margin-bottom: 80px;

  .el-form {
    width: 60%;
    margin: 100px auto;
    .pageNode {
      display: flex;

      .airportBOX {
        height: 350px;
        border: #fff solid 1px;
        width: 30%;
        padding: 0 20px;
        margin-left: 30px;
        margin-right: 20px;
        overflow-y: auto;
        ul {
          margin-top: 2px;
          padding: 0;
          .liStyle {
            text-align: center;
            //   background-color:#409EFF ;
            border: #409eff solid 1px;
            border-radius: 5px;
            margin-bottom: 2px;
          }
          .liStyle.active {
            background-color: #409eff;
          }
        }
      }
      .nodeBox {
        border: #fff solid 1px;
        height: 350px;
        overflow-y: auto;
        width: 30%;
        position: relative;
        .nodeBoxFootbar {
          position: absolute;
          width: 100%;
          height: 50px;
          bottom: 0;
          background: #1d2a4f;
          z-index: 999;
        }
      }
    }
    .el-tree {
    }
    .el-input,
    .el-select {
      width: 40%;
    }
  }
}
.el-tree-node__labe {
  margin-left: 6px;
}
.boxChart {
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
}
</style>
