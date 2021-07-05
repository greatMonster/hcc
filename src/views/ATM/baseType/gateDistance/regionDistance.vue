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
        <el-input v-model="name" size="small" clearable placeholder="请输入" style="width:180px" />
      </span>
      <div class="addButton">
        <el-button type="primary" size="small" @click="initTable">查 询</el-button>
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
      <el-table :data="distanceTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column label="起点" prop="fromAreaName" />
        <el-table-column label="终点" prop="toAreaName" />
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
          <el-form-item prop="fromAreaId" label="区域起点：" :label-width="formLabelWidth">
            <el-select v-model="form.fromAreaId" filterable placeholder="请选择">
              <el-option v-for="item in locationOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="toAreaId" label="区域终点：" :label-width="formLabelWidth">
            <el-select v-model="form.toAreaId" filterable placeholder="请选择">
              <el-option v-for="item in locationOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
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
  </div>
</template>

<script>
import { initAirpot } from '@/api/basecheckinData'
import { regionInitable, addRegion, updateRegion, deleteRegion, areaInitable } from '@/apiNew/gateDistance'
export default {
  name: 'DefineDistance',
  data() {
    return {
      name: '',
      airportId: '',
      optionsAirport: '',
      title: '',
      geographyType: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      index: '',
      optionsCatagory: [],
      distanceTable: [],
      form: {},
      locationOptions: [],
      formRules: {
        fromAreaId: [{ required: true, message: '请选择开始位置' }],
        toAreaId: [{ required: true, message: '请选择开始位置' }],
        distanceTime: [{ required: true, message: '请输入' }]
        // time: [{ required: true, message: '请输入时间距离' }]
      }
    }
  },
  created() {
    this.initinit()
  },
  methods: {
    // 机场变化时区域起点和终点做联动
    siteChange(e) {
      const data = {
        airportId: this.airportId,
        areaName: ''
      }
      areaInitable(data)
        .then(response => {
          this.locationOptions = response.data.data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message || e.response.status
          })
        })
    },
    // 查询机场
    initinit() {
      const data = {
        includeTerminals: true
      }
      initAirpot(data)
        .then(response => {
          this.optionsAirport = response.data.data
          this.airportId = response.data.data[0].id
          this.initTable()
          this.siteChange()
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message || e.response.status
          })
        })
    },
    initTable() {
      var data = {
        airportId: this.airportId || '',
        name: this.name
      }
      regionInitable(data).then(response => {
        this.distanceTable = response.data.data
      })
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      // this.form = {}
      this.title = '新增'
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.form = {}
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.areaDistanceId = row.areaDistanceId
      this.form = Object.assign({}, row)
      this.attendanceDialogVisible = true
      this.title = '编辑'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      this.form.airportId = this.airportId
      if (this.title === '新增') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addRegion(this.form)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
                this.attendanceDialogVisible = false
                this.initTable()
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || e.response.status
                })
              })
          } else {
            return false
          }
        })
      } else if (this.title === '编辑') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateRegion(this.form)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
                this.attendanceDialogVisible = false
                this.initTable()
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || e.response.status
                })
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
            areaDistanceId: row.areaDistanceId
          }
          deleteRegion(data)
            .then(response => {
              this.$message({
                type: 'success',
                message: response.data.message
              })
              this.initTable()
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.response.data.message || e.response.status
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
