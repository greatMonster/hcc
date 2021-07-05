<template>
  <div class="body">
    <div class="title">
      <div class="titleWord" />
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table :data="distanceRuleTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column prop="sameParent" label="有相同父位置的两位置默认距离（min）" />
        <el-table-column prop="fromTo" label="到达位置（min）" />
        <el-table-column prop="geographyTypeName" label="类型" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <!-- <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加距离弹框 -->
    <div>
      <el-button v-if="ruleDialogVisible" type="text" />

      <el-dialog :title="title" :visible.sync="ruleDialogVisible">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="defaultDistance" label="有相同父位置的两位置间默认距离：" filterable :label-width="formLabelWidth">
            <el-input-number v-model="form.defaultDistance" placeholder="请输入距离时间(单位：min)" style="width:180px" :min="0.1" />
          </el-form-item>
          <el-form-item prop="time" label="从起始到终点的默认距离：" :label-width="formLabelWidth">
            <el-input-number v-model="form.time" placeholder="请输入距离时间(单位：min)" style="width:180px" :min="0.1" />
          </el-form-item>
          <el-form-item prop="geographyType" label="类型：" :label-width="formLabelWidth">
            <el-select v-model="form.geographyType" filterable placeholder="请选择">
              <el-option v-for="item in optionsCatagory" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
import { catagory, initDistanceRules, addDistanceRules, modifyDistanceRules } from '@/api/geoPosition'
export default {
  name: 'DistanceRule',
  data() {
    return {
      formLabelWidth: '250px',
      ruleDialogVisible: false,
      value: '',
      title: '',
      index: '',
      distanceRuleTable: [],
      optionsCatagory: [],
      formRules: {
        defaultDistance: [{ required: true, message: '该选项不能为空' }],
        time: [{ required: true, message: '该选项不能为空' }],
        geographyType: [{ required: true, message: '该选项不能为空' }]
      },
      form: { value1: '', value2: '', value3: '' }
    }
  },
  created() {
    this.catagory()
    this.initTable()
  },
  methods: {
    initTable() {
      initDistanceRules().then(response => {
        if (response.code === '200') {
          this.distanceRuleTable = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    printClick() {},
    importClick() {},
    catagory() {
      catagory().then(response => {
        if (response.code === '200') {
          this.optionsCatagory = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    addHandleClick() {
      this.form.defaultDistance = ''
      this.form.time = ''
      this.geographyType = ''
      this.ruleDialogVisible = true
      this.title = '新增'
    },
    editHandleClick(index, row) {
      this.form.defaultDistance = row.sameParent
      this.form.time = row.fromTo
      this.form.geographyType = row.geographyType
      this.index = row.defaultId
      this.ruleDialogVisible = true
      this.title = '修改'
    },
    handleAddClick(formName) {
      if (this.title === '新增') {
        var data = {
          sameParent: this.form.defaultDistance,
          fromTo: this.form.time,
          geographyType: this.form.geographyType
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDistanceRules(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.ruleDialogVisible = false
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
      } else {
        data = {
          sameParent: this.form.defaultDistance,
          fromTo: this.form.time,
          geographyType: this.form.geographyType,
          defaultId: this.index
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            modifyDistanceRules(data).then(response => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.ruleDialogVisible = false
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
