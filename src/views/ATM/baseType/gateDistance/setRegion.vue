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
        <el-input v-model="areaName" size="small" clearable placeholder="请输入" style="width:180px" />
      </span>
      <div class="addButton">
        <el-button type="primary" size="small" @click="initable">查 询</el-button>
        <el-button type="primary" size="small" @click="addHandleClick">新 增</el-button>
      </div>
      <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
      </div>-->
    </div>

    <div class="skillShow">
      <div style="text-align:right;color:red">(距离取值优先级：① 点间距离 ② 区域间距离 ③ 默认距离)</div>
      <el-table :data="areaTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column label="区域名称" prop="areaName" />
        <el-table-column label="登机口" prop="gateBeans">
          <template slot-scope="scope">{{ scope.row.gateBeans.reduce((pre, cur) => pre + cur.name + ' ','') }}</template>
        </el-table-column>
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

      <el-dialog :title="title" :visible.sync="attendanceDialogVisible" :show-close="showClose">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="areaName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="form.areaName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="terminalId" label="航站楼：" :label-width="formLabelWidth">
            <el-select v-model="form.terminalId" filterable placeholder="请选择" @change="gateSearch">
              <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="gateIds" label="登机口：" :label-width="formLabelWidth">
            <el-select v-model="form.gateIds" filterable multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in gateOptions" :key="item.gateId" :label="item.gateCode" :value="item.gateId" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initAirpot } from '@/api/basecheckinData'
import { findboardingGateNew } from '@/api/apron'
import { areaInitable, addArea, updateArea, deleteArea } from '@/apiNew/gateDistance'
export default {
  name: 'DefineDistance',
  data() {
    return {
      showClose: false,
      gateOptions: [],
      optionsSiteId: [],
      areaName: '',
      airportId: '',
      optionsAirport: [],
      title: '',
      geographyType: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      index: '',
      name: '',
      optionsCatagory: [],
      areaTable: [],
      form: { gateIds: [], areaName: '', terminalId: '' },
      locationOptions: [],
      formRules: {
        areaName: [{ required: true, message: '请输入', trigger: 'blur' }],
        terminalId: [{ required: true, message: '请选择', trigger: 'change' }],
        gateIds: [{ required: true, message: '请选择', trigger: 'change' }]
        // time: [{ required: true, message: '请输入时间距离' }]
      }
    }
  },
  created() {
    this.initinit()
  },
  methods: {
    // 查询航站楼
    siteChange(e) {
      this.form = { gateIds: [] }
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
        this.form.gateIds = []
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
        this.initable()
        this.siteChange(this.airportId)
      })
    },
    // table初始化
    initable() {
      const data = {
        airportId: this.airportId || '',
        areaName: this.areaName || ''
      }
      areaInitable(data).then(response => {
        this.areaTable = response.data.data
        // this.initTablePosition()
      })
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.title = '新增'
      // if (this.$refs.form) {
      //   this.$refs.form.resetFields()
      // }
      this.form = { gateIds: [], areaName: '', terminalId: '' }
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      // this.index = row.areaId
      this.form = Object.assign(
        {},
        {
          terminalId: row.terminalId,
          areaName: row.areaName,
          gateIds: row.gateBeans.reduce((pre, cur) => {
            pre.push(cur.id)
            return pre
          }, [])
        }
      )
      this.form.areaId = row.areaId
      this.attendanceDialogVisible = true
      this.title = '编辑'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      this.form.airportId = this.airportId
      if (this.title === '新增') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addArea(this.form)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
                this.attendanceDialogVisible = false
                this.initable()
                this.allGate()
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: error.response.data.message || error.response.status + error.response.statusText
                })
              })
          } else {
            return false
          }
        })
      } else if (this.title === '编辑') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateArea(this.form).then(response => {
              this.$message({
                type: 'success',
                message: response.data.message
              })
              this.attendanceDialogVisible = false
              this.initable()
              this.allGate()
            })
          } else {
            return false
          }
        })
      }
    },
    // 取消
    cancelAdd() {
      this.attendanceDialogVisible = false
      this.allGate()
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
            areaId: row.areaId
          }
          deleteArea(data)
            .then(response => {
              this.$message({
                type: 'success',
                message: response.data.message
              })
              this.initable()
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.response.data.message || e.response.status + e.response.statusText
              })
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
