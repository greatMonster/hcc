<template>
  <div class="skillBox">
    <div class="title">
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>
    <div class="airportShow">
      <el-table :data="supportNodeTable" border stripe>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="name" label="节点名称" />
        <el-table-column prop="source" label="节点来源" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改机场弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" @close="closeDialog('formEdit')">
        <el-form ref="formEdit" :model="formEdit" :rules="formRules">
          <el-form-item prop="name" label="节点名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="节点来源" prop="nodeType" :label-width="formLabelWidth">
            <el-radio-group v-model="formEdit.nodeType">
              <el-radio :label="0">RQM</el-radio>
              <el-radio :label="2">外部数据</el-radio>
              <el-radio :label="1">RQM（模板）</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formEdit.nodeType==0" key="1">
            <el-form-item prop="workTypeIds" label="关联工作类型" :label-width="formLabelWidth">
              <el-select v-model="formEdit.workTypeIds" filterable size="small" placeholder="请选择" multiple collapse-tags @change="changeClickFcn">
                <el-option v-for="item in workTypeIdOptions" :key="item.workTypeId" :label="item.workTypeName" :value="item.workTypeId" />
              </el-select>
            </el-form-item>
            <el-form-item prop="taskTypeIds" label="关联任务类型" :label-width="formLabelWidth">
              <el-select v-model="formEdit.taskTypeIds" filterable size="small" placeholder="请选择" multiple collapse-tags>
                <el-option v-for="item in taskTypeIdOptions" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData, editData, addData, remove, workTypeData, taskTypeData } from '@/apiNew/supportNode'
export default {
  data() {
    return {
      title: '',
      nodeId: '',
      workTypeIdOptions: [],
      taskTypeIdOptions: [],
      editSkillVisible: false,
      formLabelWidth: '135px',
      supportNodeTable: [],
      airportName: this.$store.state.user.airportName,
      formEdit: {
        name: '',
        nodeType: 0,
        workTypeIds: '',
        taskTypeIds: ''
      },
      formRules: {
      }
    }
  },
  created() {
    this.initData()
    this.selectDataFcn()
  },
  methods: {
    initData() {
      // 查询
      initData().then(response => {
        if (response.data.code === '200') {
          this.supportNodeTable = response.data.data
        }
      })
    },
    addSkillClick(formName) {
      this.title = '添加'
      this.editSkillVisible = true
      this.formEdit.name = ''
    },
    changeClickFcn() {
      this.formEdit.taskTypeIds = []
      this.taskTypeIdOptions = []
      this.taskTypeDatafcn()
    },

    selectDataFcn() {
      workTypeData().then(res => {
        if (res.data.code === '200') {
          this.workTypeIdOptions = res.data.data
        }
      })
    },
    taskTypeDatafcn() {
      taskTypeData(this.formEdit.workTypeIds).then(res => {
        if (res.data.code === '200') {
          this.taskTypeIdOptions = res.data.data
        }
      })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.nodeId = row.nodeId
      this.formEdit.name = row.name
      this.formEdit.nodeType = row.nodeType
      this.formEdit.workTypeIds = row.workTypeIds
      this.formEdit.taskTypeIds = row.taskTypeIds
    },
    closeDialog(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data2 = {
              name: this.formEdit.name,
              nodeId: this.nodeId,
              workTypeIds: this.formEdit.workTypeIds,
              nodeType: this.formEdit.nodeType,
              taskTypeIds: this.formEdit.taskTypeIds
            }
            editData(data2).then(response => {
              if (response.data.code === '200') {
                this.$message.success('修改成功')
                this.initData()
                this.editSkillVisible = false
                this.$refs[formName].resetFields()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data = {
              name: this.formEdit.name,
              nodeType: this.formEdit.nodeType,
              workTypeIds: this.formEdit.workTypeIds,
              taskTypeIds: this.formEdit.taskTypeIds
            }
            addData(data).then(response => {
              if (response.data.code === '200') {
                this.$message.success('添加成功')
                this.initData()
                this.editSkillVisible = false
                this.$refs[formName].resetFields()
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
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
          remove(row.nodeId).then(response => {
            if (response.data.code === '200') {
              this.initData()
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.el-checkbox-group {
  height: 100%;
  align-items: baseline;
  box-sizing: border-box;
  padding: 0 10px;
}
</style>

<style scoped>

form {
  margin-top: 20px;
  width: 80%;
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
.block {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
