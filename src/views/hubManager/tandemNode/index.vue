<template>
  <div class="skillBox">
    <div class="title">
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>
    <div class="airportShow">
      <el-table :data="tandemNodeTable" border stripe>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="startNodeName" label="开始节点" />
        <el-table-column prop="endNodeName" label="结束节点" />
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
          <el-form-item prop="startNode" label="开始节点" :label-width="formLabelWidth">
            <el-select v-model="formEdit.startNode" filterable size="small" placeholder="请选择">
              <el-option v-for="item in NodeDataOptions" :key="item.nodeId" :label="item.name" :value="item.nodeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="结束节点" prop="endNode" :label-width="formLabelWidth">
            <el-select v-model="formEdit.endNode" filterable size="small" placeholder="请选择">
              <el-option v-for="item in NodeDataOptions" :key="item.nodeId" :label="item.name" :value="item.nodeId" />
            </el-select>
          </el-form-item>
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
import { initData, editData, addData, remove, NodeData } from '@/apiNew/tandemNode'
export default {
  data() {
    return {
      title: '',
      relatedNodeId: '',
      NodeDataOptions: [],
      editSkillVisible: false,
      formLabelWidth: '135px',
      tandemNodeTable: [],
      airportName: this.$store.state.user.airportName,
      formEdit: {
        startNode: '',
        endNode: ''
      },
      formRules: {
        startNode: [{ required: true, message: '请选择', trigger: 'change' }],
        endNode: [{ required: true, message: '请选择', trigger: 'change' }]
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
          this.tandemNodeTable = response.data.data
        }
      })
    },
    addSkillClick(formName) {
      this.title = '添加'
      this.editSkillVisible = true
    },
    selectDataFcn() {
      NodeData().then(res => {
        if (res.data.code === '200') {
          this.NodeDataOptions = res.data.data
        }
      })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.relatedNodeId = row.relatedNodeId
      this.formEdit.startNode = row.startNode
      this.formEdit.endNode = row.endNode
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
              startNode: this.formEdit.startNode,
              relatedNodeId: this.relatedNodeId,
              endNode: this.formEdit.endNode
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
              startNode: this.formEdit.startNode,

              endNode: this.formEdit.endNode
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
          remove(row.relatedNodeId).then(response => {
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
