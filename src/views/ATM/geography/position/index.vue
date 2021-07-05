<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div class="addCatagory">
          <span style="height:40px">
            请先选择分类：
            <el-select v-model="geographyType" placeholder="机位" @change="chang">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button type="primary" size="medium" @click="addHandleClick">添加{{ catagoryName }}</el-button>
            <el-button type="primary" size="medium" @click="defaultClick">默认距离</el-button>
          </span>
        </div>
      </div>
      <!-- <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添加{{ catagoryName }}</el-button>
      </div>-->
    </div>

    <div class="skillShow">
      <el-table v-loading="loading" :data="locationTable" border :empty-text="emptyText">
        <el-table-column prop="locationName" label="名称" />
        <el-table-column prop="locationDesc" label="描述" />
        <el-table-column prop="parentName" label="父位置" />
        <el-table-column prop="baseLocation" label="是否是基础位置">
          <template slot-scope="scope">{{ scope.row.baseLocation?'是':'否' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加新合同弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="taskTypeVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="geographyType" label="所属分类：" :label-width="formLabelWidth">
            <el-select v-model="form.geographyType" placeholder="请选择" disabled>
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="locationName" label="位置名称：" :label-width="formLabelWidth">
            <el-input v-model="form.locationName" :disabled="disabled" placeholder="请输入位置名称" />
          </el-form-item>
          <el-form-item prop=" locationDesc" label="描述：" :label-width="formLabelWidth">
            <el-input v-model="form.locationDesc" placeholder="请输入位置描述" />
          </el-form-item>

          <el-form-item prop="parentLocation" label="父位置：" :label-width="formLabelWidth">
            <el-select v-model="form.parentLocation" filterable placeholder="请选择">
              <el-option v-for="item in optionsPosition" :key="item.locationId" :label="item.locationName" :value="item.locationId" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="taskTypeVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="默认距离" :visible.sync="defaultVisible">
        <el-form ref="formDefaul" :model="formDefaul" :rules="formRules2">
          <el-form-item prop="times" label="默认距离：" :label-width="formLabelWidth">
            <el-input v-model="formDefaul.times" placeholder="请输入位置描述" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="defaultVisible=false">取 消</el-button>
          <el-button type="primary" @click="handledefaultClick('formDefaul')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { catagory, initTablePosition, addPositon, modifyPositon, deletePositon, defaultFcn, addDefaultFcn } from '@/api/geoPosition'
export default {
  name: 'Location',
  data() {
    return {
      catagoryName: '',
      loading: true,
      emptyText: '正在加载',
      disabled: false,
      geographyType: '',
      title: '',
      taskTypeVisible: false,
      defaultVisible: false,
      formLabelWidth: '120px',
      options: [],
      formDefaul: {
        times: ''
      },
      locationTable: [],
      optionsPosition: [],
      formRules2: {
        times: [{ required: true, message: '请输入' }]
      },
      form: { locationName: '', locationDesc: '', leftLocation: '', rightLocation: '', parentLocation: '' },
      formRules: {
        locationName: [{ required: true, message: '请输入位置名称' }]
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
    // this.initTable()
  },
  methods: {
    initTable() {
      var data = {
        geographyType: this.geographyType || '1',
        airportId: this.airport.airportId
      }
      initTablePosition(data).then(response => {
        if (response.code === '200') {
          this.locationTable = response.data
          this.optionsPosition = response.data
          this.loading = false
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
          this.options = response.data
          this.geographyType = response.data[1].id
          this.catagoryName = response.data[1].name
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
      this.catagoryName = this.options.find(item => item.id === e).name
      this.initTable()
    },
    defaultClick() {
      var data = {
        geographyType: this.geographyType,
        airportId: this.airport.airportId
      }
      defaultFcn(data).then(res => {
        this.formDefaul.times = res.data.times
      })
      this.defaultVisible = true
    },
    importClick() {},
    addHandleClick() {
      this.disabled = false
      this.form.locationName = ''
      this.form.locationDesc = ''
      this.form.leftLocation = ''
      this.form.rightLocation = ''
      this.form.parentLocation = ''
      this.form.geographyType = this.geographyType
      this.title = '添加位置'
      this.taskTypeVisible = true
    },
    editHandleClick(index, row) {
      if (row.baseLocation === true) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.form.geographyType = this.geographyType
      this.form.locationName = row.locationName
      this.form.locationDesc = row.locationDesc
      this.form.leftLocation = row.leftLocation
      this.form.rightLocation = row.rightLocation
      this.form.parentLocation = row.parentLocation
      this.index = row.locationId
      this.taskTypeVisible = true
      this.title = '编辑位置'
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      if (this.title === '添加位置') {
        var data = {
          locationName: this.form.locationName,
          locationDesc: this.form.locationDesc,
          airportId: this.airport.airportId,
          leftLocation: this.form.leftLocation,
          rightLocation: this.form.rightLocation,
          parentLocation: this.form.parentLocation,
          geographyType: this.geographyType || '1'
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            addPositon(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.initTable()
                this.taskTypeVisible = false
                this.$refs[formName].resetFields()
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
      } else if (this.title === '编辑位置') {
        data = {
          locationName: this.form.locationName,
          locationDesc: this.form.locationDesc,
          airportId: this.airport.airportId,
          leftLocation: this.form.leftLocation,
          rightLocation: this.form.rightLocation,
          parentLocation: this.form.parentLocation,
          geographyType: this.geographyType || '1',
          locationId: this.index
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            modifyPositon(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.initTable()
                this.taskTypeVisible = false
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

    handledefaultClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            times: this.formDefaul.times,
            geographyType: this.geographyType
          }
          addDefaultFcn(data).then(res => {
            if (res.code === '200') {
              this.$message.success(res.message)
              this.defaultVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    //     // 修改行数据按钮
    edituserbleClick() {},
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            locationId: row.locationId
          }
          deletePositon(data).then(response => {
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
    },
    handleRadioClick(e) {
      if (e === '2') {
        this.form.disabled1 = false
        this.form.disabled2 = true
      } else if (e === '3') {
        this.form.disabled1 = true
        this.form.disabled2 = false
      } else if (e === '1') {
        this.form.disabled1 = true
        this.form.disabled2 = true
      }
    }
  }
}
</script>

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
