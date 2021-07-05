<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑任务类型</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="taskTypeTable" border :header-row-style="{ 'background-color': 'rgb(10, 20, 47)' }" :row-style="{ 'background-color': '#232c47' }" style="width: 100%; color: white">
        <el-table-column prop="taskTypeName" label="任务类型名称" />
        <el-table-column prop="taskTypeCode" label="描述" />
        <el-table-column prop="workTypeName" label="工作类型名称" />
        <el-table-column prop="skillBeans" label="技能">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.skillBeans" :key="i">{{ item.skillName }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskCoefficient">
          <template slot="header">
            <span> 任务系数 </span>
            <el-tooltip content="可标识任务的复杂度、员工喜好度等量化指标，用于后续的绩效考核。" placement="top">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加新合同弹框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="taskTypeVisible" @close="closeClick('formEdit')">
      <el-form ref="formEdit" :model="formEdit" :rules="formRules">
        <el-form-item prop="name" label="任务类型名称：" :label-width="formLabelWidth">
          <el-input v-model="formEdit.name" placeholder="请输入任务类型名称" />
        </el-form-item>
        <el-form-item prop="workType" label="关联工作类型：" :label-width="formLabelWidth">
          <el-select v-model="formEdit.workType" placeholder="请选择" @change="workTypeChange">
            <el-option v-for="item in typeOptions" :key="item.workTypeId" :label="item.workTypeName" :value="item.workTypeId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="desc" label="任务类型描述：" :label-width="formLabelWidth">
          <el-input v-model="formEdit.desc" placeholder="请输入任务类型描述" />
        </el-form-item>
        <el-form-item prop="skillIds" label="技能" :label-width="formLabelWidth">
          <el-select v-model="formEdit.skillIds" placeholder="请选择" multiple collapse-tags style="width: 300px" :disabled="formEdit.workType ? false : true">
            <el-option v-for="(item, i) in skillOptions" :key="i" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="taskCoefficient" label="任务系数：" :label-width="formLabelWidth">
          <el-input v-model="formEdit.taskCoefficient" placeholder="请输入任务系数" />
        </el-form-item>
        <el-form-item prop="note" label="备注：" :label-width="formLabelWidth">
          <el-input v-model="formEdit.note" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="taskTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initTableTask, addData, modifyData, deleteData, skill } from '@/api/taskType'
import { initTable } from '@/api/workType'
export default {
  name: 'TaskType',
  data() {
    return {
      airport: this.$store.state.user.airport,
      title: '',
      skillOptions: [],
      id: this.$route.query.businessDomainId || '',
      taskTypeVisible: false,
      edittaskVisible: false,
      formLabelWidth: '120px',
      taskTypeTable: [],
      taskTypeId: '',
      formEdit: { name: '', desc: '', workType: '', skillIds: [], note: '', taskCoefficient: '1' },
      formRules: {
        name: [{ required: true, message: '请输入任务类型名称' }],
        workType: [{ required: true, message: '请选择工作类型' }],
        skillIds: [{ required: true, message: '请选择工作类型' }],
        taskCoefficient: [{ required: true, message: '请输入' }]

      },
      typeOptions: []
      // locationOptions: [
      //   {
      //     value: '1',
      //     label: '第一个位置'
      //   },
      //   {
      //     value: '2',
      //     label: '第一个位置'
      //   }
      // ]
    }
  },
  created() {
    this.initTable()
    this.initWorkType()
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.initWorkType()
      }
    }
  },
  methods: {
    initTable() {
      const data = {
        id: this.id,
        airportId: this.airport.airportId
      }
      initTableTask(data).then((response) => {
        if (response.code === '200') {
          this.taskTypeTable = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    workTypeChange() {
      this.formEdit.skillIds = []
      this.selectData()
    },
    selectData(val) {
      // if (val) {
      const data = {
        id: this.formEdit.workType || '',
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data.data
      })
      // }
    },
    initWorkType() {
      const data = {
        id: this.id,
        airportId: this.airport.airportId
      }
      initTable(data).then((response) => {
        if (response.code === '200') {
          this.typeOptions = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    addHandleClick() {
      this.title = '添加任务类型'
      this.formEdit.name = ''
      this.formEdit.desc = ''
      this.formEdit.workType = ''
      this.formEdit.note = ''
      this.formEdit.taskCoefficient = '1'
      this.formEdit.skillIds = []
      this.taskTypeVisible = true
    },
    async editHandleClick(index, row) {
      this.title = '编辑任务类型'
      this.formEdit.name = row.taskTypeName
      this.formEdit.desc = row.taskTypeCode
      this.formEdit.workType = row.workTypeId
      this.taskTypeId = row.taskTypeId
      this.formEdit.note = row.note
      const data = {
        id: this.formEdit.workType || '',
        airportId: this.airport.airportId
      }
      this.skillOptions = await skill(data).then((response) => {
        return response.data.data
      })
      var arr = []
      row.skillBeans.forEach((element) => {
        arr.push(element.skillId)
      })
      this.formEdit.skillIds = arr
      this.taskTypeVisible = true
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      if (this.title === '添加任务类型') {
        var data = {
          businessDomainId: this.id,
          skillIds: this.formEdit.skillIds,
          taskTypeName: this.formEdit.name,
          workTypeId: this.formEdit.workType,
          taskTypeCode: this.formEdit.desc,
          note: this.formEdit.note,
          airportId: this.airport.airportId,
          taskCoefficient: this.formEdit.taskCoefficient
        
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addData(data).then((response) => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
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
      } else if (this.title === '编辑任务类型') {
        data = {
          taskTypeName: this.formEdit.name,
          workTypeId: this.formEdit.workType,
          taskTypeCode: this.formEdit.desc,
          skillIds: this.formEdit.skillIds,
          taskTypeId: this.taskTypeId,
       
          airportId: this.airport.airportId,
          taskCoefficient: this.formEdit.taskCoefficient,
          note: this.formEdit.note
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyData(data).then((response) => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.initTable()
                this.taskTypeVisible = false
              }
            })
          } else {
            return false
          }
        })
      }
    },
    //     // 添加合同的启用状态按钮
    closeClick(formName) {
      this.$refs[formName].resetFields()
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
            taskTypeId: row.taskTypeId
          }
          deleteData(data).then((response) => {
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
  padding-top: 20px;
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
