<template>
  <div class="body">

    <div class="title">
      <div class="titleWord">
        添加或编辑共享航班
      </div>
      <div class="addButton">

        <el-button type="primary" size="small" @click="importClick">导出Excel</el-button>

      </div>
    </div>
    <div class="skillShow">
      <el-table :data="terminalTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column prop="flightNo" label="航班号" />
        <el-table-column prop="carrier" label="承运人" />
        <el-table-column prop="arrAirport" label="起飞站" />
        <el-table-column prop="deptAirport" label="到达站" />
        <el-table-column prop="beginTime" label="有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.beginTime }}--{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 添加距离弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="ruleDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="flightNo" label="航班号" filterable :label-width="formLabelWidth">
            <el-input v-model="form.flightNo" placeholder="航班号" style="width:180px" />
          </el-form-item>
          <el-form-item prop="carrier" label="承运人" :label-width="formLabelWidth">
            <el-input v-model="form.carrier" placeholder="承运人" style="width:180px" />
          </el-form-item>
          <el-form-item prop="arrAirport" label="起飞站" :label-width="formLabelWidth">
            <el-input v-model="form.arrAirport" placeholder="起飞站" style="width:180px" />
          </el-form-item>
          <el-form-item prop="deptAirport" label="到达站" :label-width="formLabelWidth">
            <el-input v-model="form.deptAirport" placeholder="到达站" style="width:180px" />
          </el-form-item>
          <el-form-item prop="date" label="有效期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 40%"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="ruleDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { airportsData, initData, addDatafcn, eitDatafcn, deleteDatafcn, carrierData } from '@/api/sharedFlights'
export default {
  name: 'DistanceRule',
  data() {
    return {
      formLabelWidth: '250px',
      ruleDialogVisible: false,
      value: '',
      title: '',
      index: '',
      flightShareId: '',
      documentId: '',
      optionsCarrier: [],
      terminalTable: [],
      optionsAirport: [],
      formRules: {
        flightNo: [{ required: true, message: '请输入航班号' }],
        carrier: [{ required: true, message: '请输入承运人' }],
        arrAirport: [{ required: true, message: '请输入起飞站' }],
        deptAirport: [{ required: true, message: '请输入到达站' }],
        date: [{ required: true, message: '请选择有效期' }]

      },
      form: { flightNo: '', carrier: '', arrAirport: '', deptAirport: '', date: [] }
    }
  },
  created() {
    this.documentId = this.$route.query.documentId
    this.initTable()
  },
  methods: {
    initTable() {
      initData(this.documentId).then(response => {
        if (response.data.code === '200') {
          this.terminalTable = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
      })
    },
    airports() {
      airportsData().then(response => {
        if (response.data.code === 'ok') {
          this.optionsAirport = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
      })
    },
    carrierts() {
      carrierData().then(response => {
        if (response.data.code === '200') {
          this.optionsCarrier = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
      })
    },
    addHandleClick() {
      this.form.flightNo = ''
      this.form.deptAirport = ''
      this.form.date = []
      this.form.carrier = ''
      this.form.arrAirport = ''
      this.ruleDialogVisible = true
      this.title = '新增'
    },
    editHandleClick(index, row) {
      this.form.flightNo = row.flightNo
      this.form.carrier = row.carrier
      this.form.arrAirport = row.deptAirport
      this.form.deptAirport = row.deptAirport
      this.flightShareId = row.flightShareId
      this.form.date.push(row.beginTime)
      this.form.date.push(row.endTime)
      this.ruleDialogVisible = true
      this.title = '修改'
    },
    handleAddClick(formName) {
      if (this.title === '新增') {
        var data = {
          documentId: this.documentId,
          flightNo: this.form.flightNo,
          carrier: this.form.carrier,
          arrAirport: this.form.arrAirport,
          deptAirport: this.form.deptAirport,
          beginTime: this.form.date[0],
          endTime: this.form.date[1]
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDatafcn(data).then(response => {
              if (response.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.ruleDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
          } else {
            return false
          }
        })
      } else {
        data = {
          flightShareId: this.flightShareId,
          flightNo: this.form.flightNo,
          carrier: this.form.carrier,
          arrAirport: this.form.arrAirport,
          deptAirport: this.form.deptAirport,
          beginTime: this.form.date[0],
          endTime: this.form.date[1]
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            eitDatafcn(data).then(response => {
              if (response.data.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.ruleDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        deleteDatafcn(row).then(response => {
          if (response.data.code === '200') {
            this.initTable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {

      })
    },
    importClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/flightShare/export?documentId=' + this.documentId
    }
  }
}
</script>
<style>
/* // 处理input type = number的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
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
