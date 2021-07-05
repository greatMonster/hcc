<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">

        <span style="padding-left: 20px">
          <!-- <el-button type="primary" size="small" @click="search2">查 询</el-button> -->
        </span>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="paneClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.id" v-loading="bloading" :label="item.name" :name="item.id">
          <div class="addButton">
            <el-button type="primary" size="small" @click="addSkillClick('formEdit')">新增值守点</el-button>
          </div>
          <el-table :data="initDataTable" border stripe :max-height="tableHeight" row-key="id" class="aaa">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="名称" />
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="open(scope.$index, scope.row)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 值守点名dialog -->
    <div>
      <el-dialog v-dialogDrag :title="titleLand" :visible.sync="landDialogVisible" width="40%" :before-close="cancelAddLand">
        <el-form ref="formLandEdit" :label-position="labelPosition" :model="formLandEdit" :rules="rulesLand" label-width="110px">
          <el-form-item prop="name" label="作业场地名称">
            <el-input v-model="formLandEdit.name" placeholder="请输入" maxlength="100" />
          </el-form-item>
          <el-form-item prop="businessDomainId" label="业务领域">
            <el-select v-model="formLandEdit.businessDomainId" placeholder="请选择" style="width: 150px" size="small">
              <el-option v-for="item in domainIds" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" size="small" @click="cancelAddLand">取 消</el-button>
          <el-button type="primary" size="small" @click="handleLandEditClick('formLandEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 增加监护点 -->
    <div class="controlDialog">
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="50%" :before-close="cancelEditClick" class="dialog-form">
        <el-form ref="formEdit" :model="formEdit" :label-position="labelPosition" :rules="rules" label-width="110px">
          <el-form-item prop="name" label="值守点名称">
            <el-input v-model="formEdit.name" placeholder="请输入" maxlength="100" style="width: 100%" />
          </el-form-item>
          <el-form-item prop="SkipPadName" label="属于">
            <el-input v-model="formEdit.SkipPadName" placeholder="请输入" disabled maxlength="100" style="width: 100%" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" size="small" @click="cancelEditClick">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, skipPadData, addSkipPad, searchDomainID, removeSkipPad, addMonitorPoint, removePoint } from '@/api/dutyPoint'

export default {
  name: 'CheckInData',

  data() {
    return {
      domainIds: [],
      SkipPadName: '',
      labelPosition: 'right',
      bloading: true,
      // 标签页
      editableTabsValue: '',
      editableTabs: [],
      initDataTable: [],
      tabIndex: 2,
      titleLand: '新增值守区域',
      landDialogVisible: false,
      formLandEdit: { name: '' },
      rulesLand: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      isAlways: false,
      // 参数
      isLandId: '',
      landName: '',
      rowContent: '',
      deskId: '',
      isLandId11: '',
      tableHeight: window.innerHeight - 240,
      optionsSiteId: [],
      optionsAirport: [],
      siteId: '',
      initTime: '',
      title: '增加值守点',
      editSkillVisible: false,
      formLabelWidth: '82px',
      // skillShowTable: [],
      formEdit: {
        name: '',
        SkipPadName: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.search()
      }

    }
  },
  created() {
    this.searchDomainIds()
  },

  methods: {
    searchDomainIds() {
      searchDomainID()
        .then((response) => {
          this.domainIds = response.data.data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message || '500, 服务器错误'
          })
        })
    },
    openTypeChange(e) {
      this.initTime = ''
      this.times = []
      if (e === 0) {
        this.isAlways = true
      } else {
        this.isAlways = false
      }
    },
    search() {
      var data = {
        airportId: this.airport.airportId
      }
      initTable(data).then((response) => {
        if (response.data.data.length) {
          response.data.data.forEach((item) => {
            item.id = item.id + ''
          })
          var arr = []
          this.editableTabs = response.data.data
          if (response.data.data) {
            response.data.data.forEach((element) => {
              arr.push(element.id)
            })
          }
          // this.editableTabsValue = this.editableTabsValue === '0' ? response.data.data[0].id : this.editableTabsValue
          if (arr.indexOf(this.editableTabsValue) === -1 || this.editableTabsValue === '0') {
            this.editableTabsValue = response.data.data[0].id
          }
          this.SkipPadName = this.SkipPadName ? this.SkipPadName : this.editableTabs[0].name
          var data = {
            id: this.editableTabsValue
          }
          skipPadData(data).then((item) => {
            this.initDataTable = item.data.data
          })
          this.bloading = false
        } else {
          this.editableTabs = []
          this.bloading = false
        }
      })
    },
    // 查询按钮
    search2() {
      var data = {
        includeDesks: true,
        airportId: this.airport.airportId,
        terminalId: this.siteId
      }
      initTable(data).then((response) => {
        if (response.data.data.length) {
          response.data.data.forEach((item) => {
            item.id = item.id + ''
          })
          this.editableTabs = response.data.data
          if (!this.editableTabsValue) {
            this.editableTabsValue = response.data.data[0].id
            this.SkipPadName = response.data.data[0].name
          }
          var data = {
            id: this.editableTabsValue
          }
          skipPadData(data).then((item) => {
            this.initDataTable = item.data.data
          })
          this.bloading = false
        } else {
          this.editableTabs = []

          this.bloading = false
        }
      })
    },
    cancelEditClick() {
      if (Object.keys(this.formEdit).length === 1 && !this.formEdit.name) {
        this.editSkillVisible = false
      } else {
        this.$confirm('本次新增的数据将丢失，确认不保存？', '提示', {
          confirmButtonText: '不保存',
          cancelButtonText: '返回'
        })
          .then(() => {
            this.editSkillVisible = false
            this.formEdit = {
              name: '',
              SkipPadName: ''
            }
          })
          .catch(() => {})
      }
    },
    // 动态新增标签页
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        // this.isLandId = targetName
        this.formLandEdit.name = ''
        if (this.$refs.formLandEdit) {
          this.$refs.formLandEdit.resetFields()
        }
        this.landDialogVisible = true
      }
      if (action === 'remove') {
        this.$confirm('此操作将删除该岛以及其下的所有柜台，确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            var data = {
              airportId: this.airport.airportId,
              skipPadId: targetName
            }
            removeSkipPad(data).then((response) => {
              if (response.data.code === '200') {
                const tabs = this.editableTabs
                let activeName = this.editableTabsValue
                if (activeName === targetName) {
                  tabs.forEach((tab, index) => {
                    if (tab.id === targetName) {
                      const nextTab = tabs[index + 1] || tabs[index - 1]
                      if (nextTab) {
                        activeName = nextTab.id
                      }
                    }
                  })
                }
                this.editableTabsValue = activeName
                this.editableTabs = tabs.filter((tab) => tab.id !== targetName)
                this.search2()
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              }
            })
          })
          .catch(() => {})
      }
    },
    paneClick(targetName) {
      this.isLandId = targetName.name
      this.SkipPadName = targetName.label
      var data = {
        id: targetName.name
      }
      skipPadData(data).then((item) => {
        this.initDataTable = item.data.data
      })
    },
    cancelAddLand() {
      if (this.formLandEdit.name) {
        this.$confirm('本次新增的数据将丢失，确认不保存？', '提示', {
          // cancelButtonClass: 'cancelStyle',
          confirmButtonText: '不保存',
          cancelButtonText: '返回'
        })
          .then(() => {
            this.landDialogVisible = false
            this.formLandEdit.name = ''
          })
          .catch(() => {})
      } else {
        this.landDialogVisible = false
      }
    },
    handleLandEditClick(formName) {
      var data = {
        airportId: this.airport.airportId,
        name: this.formLandEdit.name,
        businessDomainId: this.formLandEdit.businessDomainId
      }
      this.$refs['formLandEdit'].validate((valid) => {
        if (valid) {
          addSkipPad(data).then((response) => {
            if (response.data.code === '200') {
              this.$message.success('新增成功')
              this.editableTabsValue = response.data.data + ''
              this.landDialogVisible = false
              this.formLandEdit.name = ''
              this.search()
            }
          })
        }
      })
    },
    // 添加按钮
    addSkillClick(formName) {
      if (this.$refs.formEdit) {
        this.$refs.formEdit.resetFields()
      }
      this.formEdit.SkipPadName = this.SkipPadName
      this.editSkillVisible = true
    },

    // 新增弹框的确定按钮
    handleEditClick(formName) {
      this.formEdit.airportId = this.airport.airportId
      this.formEdit.skipPadId = this.editableTabsValue
      this.$refs['formEdit'].validate((valid) => {
        if (valid) {
          addMonitorPoint(this.formEdit)
            .then((response) => {
              if (response.data.code === '200') {
                this.search()
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
                this.editSkillVisible = false
              }
              this.formEdit.name = ''
              this.$refs['formEdit'].resetFields()
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        }
      })
    },
    open(index, row) {
      var data = {
        monitorPointId: row.id,
        skipPadId: this.editableTabsValue
      }
      this.$confirm('此操作将删除该数据，确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '返回'
      })
        .then(() => {
          removePoint(data).then((response) => {
            if (response.data.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.search()
            } else {
              this.$message.error(response.data.message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作'
          })
        })
    }
  }
}
</script>
<style>
.controlDialog /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
.cancelStyle {
  background: #495371;
  color: black !important;
}
</style>
<style scoped>
.skillBox /deep/ td,
tr,
th {
  text-align: center;
}
.skillBox /deep/ .cell {
  text-align: center;
  padding-left: 10px;
}

.addButton {
  /* text-align: right; */
  margin-bottom: 10px;
}
form {
  margin-top: 20px;
}
.addTime {
  background: #409eff;
  width: 50px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 5px;
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
