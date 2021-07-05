<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div class="addCatagory">
          <span style="height:40px;margin-right:20px">
            请选择分类：
            <el-select v-model="geographyType" placeholder="机位" @change="chang">
              <el-option v-for="item in optionsCatagory" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </span>
          <div class="addButton">
            <el-button type="primary" size="medium" @click="addHandleClick">添加{{ name }}</el-button>
          </div>
        </div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="distanceTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column type="index" />
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label" />
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
      <el-button v-if="attendanceDialogVisible" type="text" />

      <el-dialog :title="title" :visible.sync="attendanceDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="geographyType" label="所属分类：" :label-width="formLabelWidth">
            <el-select v-model="form.geographyType" placeholder="请选择" disabled>
              <el-option v-for="item in optionsCatagory" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="startLocation" label="开始位置：" :label-width="formLabelWidth" @change="catagory">
            <el-select v-model="form.startLocation" filterable placeholder="请选择">
              <el-option v-for="item in locationOptions" :key="item.locationId" :label="item.locationName" :value="item.locationId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="endLocation" label="终点：" :label-width="formLabelWidth">
            <el-select v-model="form.endLocation" filterable placeholder="请选择">
              <el-option v-for="item in locationOptions" :key="item.locationId" :label="item.locationName" :value="item.locationId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="time" label="距离时间：" :label-width="formLabelWidth">
            <el-input-number v-model="form.time" placeholder="请输入距离时间" style="width:180px" :min="0.1" />
          </el-form-item>
          <!-- <el-form-item label="行进类型：" :label-width="formLabelWidth">
            <el-input v-model="form.goWays" type="number" placeholder="请输入行进类型" style="width:180px" />
          </el-form-item>
          <el-form-item label="基础位置" :label-width="formLabelWidth">
            <el-input v-model="form.goWays" type="number" placeholder="请输入行进类型" style="width:180px" />
          </el-form-item>
          <el-form-item label="计量单位：" :label-width="formLabelWidth">
            <el-select v-model="form.measureUnit" placeholder="请选择">
              <el-option v-for="item in measureUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>-->
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
import { catagory, initTableDistance, initTablePosition, addDistance, modifyDistance, deleteDistance } from '@/api/geoPosition'
export default {
  name: 'DefineDistance',
  data() {
    return {
      title: '',
      geographyType: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      index: '',
      name: '',
      optionsCatagory: [],
      distanceTable: [],
      cols: [
        {
          prop: 'fromLocationName',
          label: '开始位置'
        },
        {
          prop: 'toLocationName',
          label: '终点'
        },
        {
          prop: 'times',
          label: '距离时间（min）'
        }
      ],
      form: { startLocation: '', endLocation: '', time: '' },
      locationOptions: [],
      formRules: {
        startLocation: [{ required: true, message: '请选择开始位置' }],
        endLocation: [{ required: true, message: '请选择终点' }],
        time: [{ required: true, message: '请输入时间距离' }]
      },
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
    this.catagory()
    this.initTablePosition()
    // this.initTable()
  },
  methods: {
    async initTable() {
      var data = {
        geographyType: this.geographyType || '',
        airportId: this.airport.airportId
      }
      initTableDistance(data).then(response => {
        this.distanceTable = response.data
        this.initTablePosition()
      })
    },
    initTablePosition() {
      var data = {
        geographyType: this.geographyType || '1',
        airportId: this.airport.airportId
      }
      initTablePosition(data).then(response => {
        if (response.code === '200') {
          this.locationOptions = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    catagory() {
      catagory().then(response => {
        if (response.code === '200') {
          this.optionsCatagory = response.data
          this.geographyType = response.data[0].id
          this.name = response.data[0].name
          this.initTable()
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    chang(e) {
      this.geographyType = e
      this.optionsCatagory.forEach(item => {
        if (item.id === e) {
          this.name = item.name
        }
      })
      this.initTable()
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.form.startLocation = ''
      this.form.endLocation = ''
      this.form.time = ''
      this.form.geographyType = this.geographyType
      this.title = '添加距离'
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.startLocation = row.fromLocation
      this.form.endLocation = row.toLocation
      this.form.time = row.times
      this.index = row.distanceId
      this.form.geographyType = this.geographyType
      this.form.measureUnit = row.measureUnit
      this.attendanceDialogVisible = true
      this.title = '编辑距离'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      if (this.title === '添加距离') {
        var data = {
          fromLocation: this.form.startLocation,
          toLocation: this.form.endLocation,
          times: this.form.time,
          airportId: this.airport.airportId,
          geographyType: this.geographyType || '1'
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDistance(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.attendanceDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.message
                })
              }
            })
          } else {
            return false
          }
        })
      } else if (this.title === '编辑距离') {
        data = {
          fromLocation: this.form.startLocation,
          toLocation: this.form.endLocation,
          times: this.form.time,
          airportId: this.airport.airportId,
          geographyType: this.geographyType || '1',
          distanceId: this.index
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            modifyDistance(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.attendanceDialogVisible = false
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.message
                })
              }
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
            distanceId: row.distanceId
          }
          deleteDistance(data).then(response => {
            if (response.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initTable()
            } else {
              this.$message({
                type: 'error',
                message: response.message
              })
            }
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
.addCatagory {
  display: flex;
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
