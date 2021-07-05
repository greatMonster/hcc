<template>
  <div class="skillBox">
    <div class="title">
      <span style="margin-right:20px">
        机场：
        <el-select v-model="airportId" placeholder="请选择" style="width:150px" size="small" @change="siteChange">
          <el-option v-for="item in optionsAirport" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <span>
        名称：
        <el-input v-model="name" size="small" placeholder="请输入" style="width:180px" />
      </span>
      <div class="addButton">
        <el-button type="primary" size="small" @click="initTable">查 询</el-button>
        <el-button type="primary" size="small" @click="addHandleClick">新 增</el-button>
        <el-button type="primary" size="small" @click="setDefaultValue">设置默认距离</el-button>
      </div>
      <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
      </div>-->
    </div>

    <div class="skillShow">
      <el-table :data="distanceTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column label="起点" prop="fromGateName" />
        <el-table-column label="终点" prop="toGateName" />
        <el-table-column label="距离" prop="distanceTime" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">编 辑</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加距离弹框 -->
    <div>
      <el-button v-if="attendanceDialogVisible" type="text" />

      <el-dialog :title="title" :visible.sync="attendanceDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="terminalId" label="航站楼：" :label-width="formLabelWidth">
            <el-select v-model="form.terminalId" filterable placeholder="请选择" @change="gateSearch">
              <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="fromGateId" label="起点：" :label-width="formLabelWidth">
            <el-select v-model="form.fromGateId" filterable collapse-tags placeholder="请选择">
              <el-option v-for="item in gateOptions" :key="item.gateId" :label="item.gateCode" :value="item.gateId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="toGateId" label="终点：" :label-width="formLabelWidth">
            <el-select v-model="form.toGateId" filterable collapse-tags placeholder="请选择">
              <el-option v-for="item in gateOptions" :key="item.gateId" :label="item.gateCode" :value="item.gateId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="distanceTime" label="距离（分钟）：" :label-width="formLabelWidth">
            <el-input v-model.number="form.distanceTime" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="attendanceDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 设置默认值 -->
    <div>
      <el-dialog title="编辑默认距离" :visible.sync="defaultDialog">
        <el-form ref="formDefault" :model="formDefault" :rules="formDefaultRules">
          <el-form-item prop="defaultValue" label="默认距离（分钟）：" :label-width="formDefaultLabelWidth">
            <el-input v-model.number="formDefault.defaultValue" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="defaultDialog=false">取 消</el-button>
          <el-button type="primary" @click="handleSetDefault('formDefault')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initAirpot } from '@/api/basecheckinData'
import { findboardingGateNew } from '@/api/apron'
import { dotInitable, addDot, updateDot, deleteDot, defaultValueSearch, defaultValueSet } from '@/apiNew/gateDistance'
export default {
  name: 'DefineDistance',
  data() {
    return {
      formDefaultLabelWidth: '180px',
      name: '',
      optionsSiteId: [],
      airportId: '',
      optionsAirport: [],
      gateOptions: [],
      defaultDialog: false,
      formDefault: { defaultValue: '' },
      formDefaultRules: {
        defaultValue: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      title: '',
      geographyType: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      index: '',
      optionsCatagory: [],
      distanceTable: [],
      form: { terminalId: '', fromGateId: '', toGateId: '', distanceTime: '' },
      locationOptions: [],
      formRules: {
        terminalId: [{ required: true, message: '请选择', trigger: 'change' }],
        fromGateId: [{ required: true, message: '请选择', trigger: 'change' }],
        toGateId: [{ required: true, message: '请选择', trigger: 'change' }],
        distanceTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initinit()
    // this.initTable()
  },
  methods: {
    // 查询航站楼
    siteChange(e) {
      this.form = { fromGateId: '', toGateId: '' }
      const data = {
        includeTerminals: true
      }
      initAirpot(data).then(response => {
        if (response.data.data) {
          response.data.data.forEach(element => {
            if (element.id === e) {
              this.optionsSiteId = element.terminals
            }
          })
          this.allGate()
        }
      })
    },
    // 查询机场
    initinit() {
      const data = {
        includeTerminals: true
      }
      initAirpot(data).then(response => {
        this.optionsAirport = response.data.data
        this.airportId = response.data.data[0].id
        // this.optionsSiteId = response.data.data[0].terminals
        // this.siteId = response.data.data[0].terminals[0].id
        this.initTable()
        this.siteChange(this.airportId)
      })
    },
    // 初始化即查询登机口
    allGate() {
      const data = {
        terminalId: '',
        airportId: this.airportId || ''
      }
      findboardingGateNew(data).then(response => {
        this.gateOptions = response.data
      })
    },
    // 切换航站楼时登机口下拉数据
    gateSearch() {
      if (this.form.terminalId) {
        this.form.fromGateId = ''
        this.form.toGateId = ''
        const data = {
          terminalId: this.form.terminalId || '',
          airportId: this.airportId || ''
        }
        findboardingGateNew(data).then(response => {
          this.gateOptions = response.data
        })
      } else {
        this.$message.warning('请先选择航站楼')
      }
    },
    setDefaultValue() {
      this.defaultDialog = true
      this.$nextTick(() => {
        const data = {
          airportId: this.airportId
        }
        defaultValueSearch(data).then(response => {
          this.formDefault.defaultValue = response.data.data.defaultValue
        })
      })
    },
    // 设置默认值的确定按钮
    handleSetDefault(formName) {
      const data = {
        airportId: this.airportId,
        defaultValue: this.formDefault.defaultValue
      }
      defaultValueSet(data).then(response => {
        this.$message.success('设置成功')
        this.defaultDialog = false
      })
    },
    initTable() {
      const data = {
        airportId: this.airportId || '',
        name: this.name || ''
      }
      dotInitable(data).then(response => {
        this.distanceTable = response.data.data
      })
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.title = '新增'
      this.form = { terminalId: '', fromGateId: '', toGateId: '', distanceTime: '' }
      if (this.$refs.form) {
        // this.$refs.form.resetFields()
        this.$refs.form.clearValidate()
      }
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.gateDistanceId = row.gateDistanceId
      this.form = Object.assign({}, row)
      this.attendanceDialogVisible = true
      this.title = '编辑'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      if (this.title === '新增') {
        this.form.airportId = this.airportId
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDot(this.form).then(response => {
              // if (response.code === '200') {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.attendanceDialogVisible = false
              this.initTable()
              this.allGate()
              // } else {
              //   this.$message({
              //     type: 'error',
              //     message: response.message
              //   })
              // }
            })
          } else {
            return false
          }
        })
      } else if (this.title === '编辑') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateDot(this.form).then(response => {
              // if (response.code === '200') {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
              this.attendanceDialogVisible = false
              this.initTable()
              this.allGate()
              // } else {
              //   this.$message({
              //     type: 'error',
              //     message: response.message
              //   })
              // }
            })
          } else {
            return false
          }
        })
      }
    },
    //     // 添加合同的启用状态按钮
    adduserbleClick() {},
    //     // 修改行数据按钮
    edituserbleClick() {},
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            gateDistanceId: row.gateDistanceId
          }
          deleteDot(data).then(response => {
            // if (response.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initTable()
            // } else {
            //   this.$message({
            //     type: 'error',
            //     message: response.message
            //   })
            // }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
form {
  margin-top: 20px;
}
.addButton {
  margin-left: 10px;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
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
