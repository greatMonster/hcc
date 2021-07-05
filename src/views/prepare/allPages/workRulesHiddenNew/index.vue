<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord" style="display: flex; justify-content: center; margin-right: 90px">
        <div style="font-size: 20px">
          {{ workTypeData.name }}
          ({{ name }})
          <i class="el-icon-edit-outline" style="cursor: pointer" @click="editTitle" />
        </div>
      </div>
      <div style="float: right; margin-right: 90px; display: flex">
        <span style="width: 100px; line-height: 35px">{{ nameData }}</span><el-button type="primary" size="small" @click="addSkillClick">{{ titleBtn }}</el-button>
      </div>
    </div>
    <div class="content" style="padding-bottom: 100px">
      <div v-for="items in editableTabs" :key="items.id" :label="items.name" :name="items.id">
        <div>
          <div class="content-box">
            <div v-for="(item, index) in items.rules" ref="rule1" :key="index" class="rule1">
              <div class="rule1-title">
                <div class="rule1-title-left">
                  <span>{{ item.shortDescription }}</span>
                  <el-popover placement="top-start" width="400" trigger="hover" :content="item.fullDescription">
                    <i slot="reference" class="el-icon-question" />
                  </el-popover>
                </div>
              </div>
              <div v-if="item.id == '1'">
                <R1 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '2'">
                <R2 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '3'">
                <R3 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '4'">
                <R4 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '5'">
                <R5 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '6'">
                <R6 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '7'">
                <R7 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '8'">
                <R8 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '9'">
                <R9 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '10'">
                <R10 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '11'">
                <R11 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '12'">
                <R12 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '13'">
                <R13 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '14'">
                <R14 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '15'">
                <R15 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '16'">
                <R16 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '17'">
                <R17 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '18'">
                <R18 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '19'">
                <R19 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '20'">
                <R20 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '21'">
                <R21 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '22'">
                <R22 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '23'">
                <R23 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '24'">
                <R24 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '25'">
                <R25 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
              <div v-if="item.id == '26'">
                <R26 ref="basisRule" :name="items.id + ''" :parent="item" :data="item.id" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="floot">
        <el-button size="small" style="left: 30%" type="primary" @click="handleConfirmClick()">保存规则</el-button>
        <!-- <el-button size="small" style="right:50%" type="primary" @click="handleCopyClick()">指定规则</el-button> -->
        <!-- <el-select v-model="formEdit.copyId" clearable filterable placeholder="请选择" style=" position: absolute;bottom: 20px;right:30%" @visible-change="selectRules">
          <el-option v-for="(items, indexs) in rulesOptions" :key="indexs" :label="items.name" :value="items.id" />
        </el-select> -->
        <el-button size="small" style="right: 20%" @click="dialogEditVisible">取消</el-button>
      </div>
    </div>

    <!-- 规则组dialog -->
    <div>
      <el-dialog v-dialogDrag title="可选择规则组" :visible.sync="dialogVisible" width="40%" :before-close="cancel">
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" border highlight-current-row @current-change="handleCurrentChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-for="(item, index) in props.row.ruleTemplates" :key="index">
                <p style="display: inline-block">{{ item.shortDescription }}</p>
                <el-popover placement="top-start" width="200" trigger="hover" :content="item.fullDescription">
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="规则" prop="ruleShortName" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button style="background: #495373;color: white;" size="small" @click="cancel">取 消</el-button> -->
          <el-button type="primary" size="small" @click="EditClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog v-dialogDrag title="编辑" :visible.sync="editSkillVisible">
        <el-form :model="formEditTitle">
          <el-form-item prop="fullname" label="名称" :label-width="formLabelWidth">
            <el-input v-model="formEditTitle.fullname" placeholder="请输入" style="width: 200px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formEditTitle')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import R1 from './components/R1'
import R2 from './components/R2'
import R3 from './components/R3'
import R4 from './components/R4'
import R5 from './components/R5'
import R6 from './components/R6'
import R7 from './components/R7'
import R8 from './components/R8'
import R9 from './components/R9'
import R10 from './components/R10'
import R11 from './components/R11'
import R12 from './components/R12'
import R13 from './components/R13'
import R14 from './components/R14'
import R15 from './components/R15'
import R16 from './components/R16'
import R17 from './components/R17'
import R18 from './components/R18'
import R19 from './components/R19'
import R20 from './components/R20'
import R21 from './components/R21'
import R22 from './components/R22'
import R23 from './components/R23'
import R24 from './components/R24'
import R25 from './components/R25'
import R26 from './components/R26'
import { selectData, initTableData, initrulse, initrulseData, editData } from '@/api/workRulesNew'
import { _debounce } from '@/utils'
export default {
  name: 'WorkRulesHiddenNew',
  components: {
    R1,
    R2,
    R3,
    R4,
    R5,
    R6,
    R7,
    R8,
    R9,
    R10,
    R11,
    R12,
    R13,
    R14,
    R15,
    R16,
    R17,
    R18,
    R19,
    R20,
    R21,
    R22,
    R23,
    R24,
    R25,
    R26
  },

  data() {
    return {
      airport: this.$store.state.user.airport,
      off: false,
      landName: '',
      isLandId: '',
      nameData: '',
      name: '',
      rulesitem1: {},
      Options: [],
      titleBtn: '',
      ruleID: '',
      tableData: [],
      formLabelWidth: '120px',
      data: [],
      editSkillVisible: false,
      title: '',
      arr: [],
      rulesOptions: [],
      formEdit: {},
      formEditTitle: {},
      multipleSelection: [],
      dataID: '',
      workTypeData: {},
      dialogVisible: false,
      landDialogVisible: false,
      editableTabsValue: '',
      editableTabs: [],
      tabIndex: 2
    }
  },
  created() {
    this.initTableData()
    this.select()
    if (this.$route.query.offon) {
      // debugger
      this.workTypeData = JSON.parse(this.$route.query.data)
      console.log(this.workTypeData)
      this.name = this.workTypeData.id.name
      this.ruleID = this.workTypeData.id.id
      this.titleBtn = '选择规则组'
      this.editableTabs.push({
        name: this.workTypeData.name,
        id: this.workTypeData.id.id + '',
        rules: []
      })
    } else {
      this.workTypeData.name = this.$route.query.name
      this.dataID = this.$route.query.id
      this.titleBtn = '选择规则组'
      this.initData()
      for (let j = 0; j < this.Options.length; j++) {
        for (let i = 0; i < this.arr.length; i++) {
          if (this.Options[j].id == this.arr[i]) {
            this.Options.splice(j, 1)
          }
        }
      }
    }
  },
  //   updated() {
  //     for (let j = 0; j < this.Options.length; j++) {
  //       for (let i = 0; i < this.arr.length; i++) {
  //         if (this.Options[j].id == this.arr[i]) {
  //           this.Options.splice(j, 1)
  //         }
  //       }
  //     }
  //   },
  methods: {
    initData() {
      const data = {
        id: this.$route.query.id,
        airportId: this.airport.airportId
      }
      initrulseData(data).then((response) => {
        this.editableTabs.push(response.data.data.employeeTypes[0])
        this.name = this.editableTabs[0].name
        this.nameData = response.data.data.employeeTypes[0].groupName
        this.editableTabsValue = this.editableTabs[0].id.toString()
        this.arr = []
        for (let i = 0; i < response.data.data.employeeTypes.length; i++) {
          this.arr.push(response.data.data.employeeTypes[i].id)
        }
      })
    },
    addSkillClick() {
      this.dialogVisible = true
    },
    dialogEditVisible() {
      this.$router.go(-1)
    },
    cancel() {
      this.dialogVisible = false
    },
    selectRules() {
      this.rulesOptions = []
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].id != parseInt(this.editableTabsValue)) {
          this.rulesOptions.push(this.editableTabs[i])
        }
      }
    },
    EditClick() {
      this.editableTabs[0].rules = this.rulesitem1.ruleTemplates
      this.editableTabs[0].groupId = this.rulesitem1.id
      this.dialogVisible = false
    },
    cancelAddLand() {
      this.landDialogVisible = false
    },
    // 加载规则模板数据
    initTableData() {
      const data = {
        airportId: this.airport.airportId
      }
      initTableData(data).then((response) => {
        this.tableData = response.data.data
      })
    },
    handleCurrentChange(val) {
      this.nameData = val.name
      this.rulesitem1 = val
    },
    // 员工类型
    select() {
      const data = {
        id: this.$route.query.businessDomain,
        airportId: this.airport.airportId
      }
      selectData(data).then((response) => {
        this.Options = response.data.data
      })
    },
    handleConfirmClick: _debounce(function(_type, index, item) {
      if (this.editableTabs.length) {
        if (this.$route.query.offon || this.$route.query.type === '复制') {
          var obj = {}
          this.editableTabs.forEach((item) => {
            if (item.rules.length) {
              item.rules = []
            }
          })
          this.$refs.basisRule.forEach((element) => {
            for (let i = 0; i < this.editableTabs.length; i++) {
              if (element.$attrs.name == this.editableTabs[i].id) {
                obj = {
                  id: element.$attrs.data,
                  shortDescription: element.parent.shortDescription,
                  parameterBean: element.data.parameterBean,
                  fullDescription: element.parent.fullDescription
                }
                this.editableTabs[i].rules.push(obj)
              }
            }
          })
          this.workTypeData.employeeTypes = this.editableTabs
          this.workTypeData.businessDomain = this.$route.query.businessDomain
          this.workTypeData.airportId = this.airport.airportId
          initrulse(this.workTypeData)
            .then((response) => {
              if (response.data.code == '200') {
                this.$message.success('添加成功')
                this.$router.go(-1)
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch((error) => {
              this.$message.error(error.data.message)
            })
        } else {
          var obj1 = {}
          this.editableTabs.forEach((item) => {
            item.rules = []
          })
          this.$refs.basisRule.forEach((element) => {
            for (let i = 0; i < this.editableTabs.length; i++) {
              if (element.$attrs.name == this.editableTabs[i].id) {
                obj1 = {
                  id: element.$attrs.data,
                  shortDescription: element.parent.shortDescription,
                  parameterBean: element.data.parameterBean,
                  fullDescription: element.parent.fullDescription
                }
                this.editableTabs[i].rules.push(obj1)
              }
            }
          })
          this.workTypeData.id = this.dataID
          this.workTypeData.employeeTypes = this.editableTabs
          this.workTypeData.businessDomain = this.$route.query.businessDomain
          this.workTypeData.airportId = this.airport.airportId
          editData(this.workTypeData)
            .then((response) => {
              if (response.data.code == '200') {
                this.$message.success('修改成功')
                this.$router.go(-1)
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch((error) => {
              this.$message.error(error.data.message)
            })
          //   this.checkData(this.workTypeData.employeeTypes)
        }
      } else {
        this.$message.error('请添加员工类型与规则')
      }
    }, 1000),
    // checkData(data) {

    // },
    editTitle() {
      this.editSkillVisible = true
      this.formEditTitle = {
        fullname: this.workTypeData.name
      }
    },
    handleEditClick() {
      this.workTypeData.name = this.formEditTitle.fullname
      this.editSkillVisible = false
    },
    handleLandEditClick() {
      this.data = []
      for (let i = 0; i < this.formEdit.Id.length; i++) {
        for (let j = 0; j < this.Options.length; j++) {
          if (this.formEdit.Id[i] == this.Options[j].id) {
            this.data.push(this.Options[j])
          }
        }
      }
      this.editableTabsValue = this.formEdit.Id[0].toString()
      for (let k = 0; k < this.data.length; k++) {
        this.editableTabs.push({
          name: this.data[k].name,
          id: this.data[k].id + '',
          rules: []
        })
      }
      this.landDialogVisible = false
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
.skillBox /deep/ td,
tr,
th {
  text-align: left;
}
.skillBox /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
</style>
<style scoped lang="scss">
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
.content {
  width: 97%;
  min-height: 800px;
  height: 100%;
  margin: auto;
}
.title {
  width: 100%;
  height: 90px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 5px;
  background-color: #0a142f;
  border-bottom: #495371 solid 1px;
}
.floot {
  background: #172449;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0 24px;
  width: 100%;
  height: 80px;

  .el-button {
    position: absolute;
    bottom: 20px;
  }
}
.rule1-title {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #263257;
  font-size: 14px;
  color: white;
}
.titleWord {
  width: 100%;
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
