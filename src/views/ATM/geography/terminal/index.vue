<template>
  <div class="body">
    <div class="title">
      <div class="titleWord">添加或编辑航站楼</div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table :data="terminalTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="carrierVOList" label="关联航司">
          <template slot-scope="scope">
            <span v-for="(item,i) in scope.row.carrierVOList " :key="i">{{ item.carrierName }}&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加距离弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="ruleDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="name" label="航站楼名称" filterable :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="航站楼名称" style="width:180px" />
          </el-form-item>
          <el-form-item prop="carrierId" label="停靠航司" :label-width="formLabelWidth">
            <el-select v-model="form.carrierId" filterable placeholder="请选择" multiple collapse-tags :filter-method="filterFCN">
              <el-option v-for="item in optionsCarrier" :key="item.carrierId" :label="item.carrierName" :value="item.carrierId">
                <span style="float: left">{{ item.carrierName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.iataCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="airportId" label="所属机场" :label-width="formLabelWidth">
            <el-select v-model="form.airportId" filterable placeholder="请选择">
              <el-option v-for="item in optionsAirport" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
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
import { initData, addDatafcn, eitDatafcn, deleteDatafcn, carrierData } from '@/api/terminal'
export default {
  name: 'DistanceRule',
  data() {
    return {
      formLabelWidth: '250px',
      ruleDialogVisible: false,
      value: '',
      title: '',
      index: '',
      optionsCarrier: [],
      terminalTable: [],
      optionsAirport: [],
      formRules: {
        name: [{ required: true, message: '名称不能为空' }],
        carrierId: [{ required: true, message: '该选项不能为空' }]
      },
      form: { name: '', carrierId: '' },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
      }

    }
  },
  created() {
    this.initTable()
    this.carrierts()
  },
  methods: {
    initTable() {
      initData(this.airport.airportId).then(response => {
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
    filterFCN(v) {
      var data = v

      carrierData(data).then(response => {
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
    carrierts() {
      var data = ''
      carrierData(data).then(response => {
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
      this.form.name = ''
      this.form.airportId = ''
      this.form.carrierId = []
      this.carrierId = ''
      this.ruleDialogVisible = true
      this.title = '新增'
    },
    editHandleClick(index, row) {
      this.form.name = row.name
      this.form.carrierId = []
      row.carrierVOList.forEach(item => {
        this.form.carrierId.push(item.carrierId)
      })
      this.id = row.id
      this.ruleDialogVisible = true
      this.title = '修改'
    },
    handleAddClick(formName) {
      if (this.title === '新增') {
        var carrierVOList = []
        this.form.carrierId.forEach(element => {
          carrierVOList.push({ carrierId: element })
        })
        var data = {
          name: this.form.name,
          carrierVOList: carrierVOList,
          airportId: this.airport.airportId
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
        carrierVOList = []
        this.form.carrierId.forEach(element => {
          carrierVOList.push({ carrierId: element })
        })
        data = {
          name: this.form.name,
          airportId: this.airport.airportId,
          carrierVOList: carrierVOList,
          id: this.id
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
      })
        .then(() => {
          deleteDatafcn(row).then(response => {
            if (response.data.code === '200') {
              this.initTable()
              this.$message({
                type: 'success',
                message: '删除成功'
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
