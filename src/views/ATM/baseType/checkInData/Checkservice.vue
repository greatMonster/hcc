<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div />
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="serviceTable" border stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="编号" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.code=='general'?true:false" type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button :disabled="scope.row.code=='general'?true:false" type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item prop="code" label="编号" :label-width="formLabelWidth">
            <el-input v-model="formEdit.code" placeholder="请输入编号" />
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
import { initTable, add, deletefcn, editfcn } from '@/apiNew/service'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      serviceTable: [],
      formEdit: { name: '', code: '' },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }]

      }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initTable().then(response => {
        if (response.data.code == 200) {
          this.serviceTable = response.data.data
        }
      })
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.editSkillVisible = true
    },

    // 修改行数据按钮
    editHandleClick(index, row) {
    //   console.log(row, 99999)

      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit.name = row.name
      this.formEdit.code = row.code
      this.formEdit.id = row.id
    },
    handleEditClick(formEdit) {
      this.$refs[formEdit].validate((valid) => {
        if (valid) {
          if (this.title === '修改') {
            var data1 = {
              name: this.formEdit.name,
              code: this.formEdit.code,
              id: this.formEdit.id
            }
            editfcn(data1).then(response => {
              if (response.data.code === '200') {
                this.$message.success('修改成功')
                this.initTable()
              }
            })
            this.editSkillVisible = false
            this.$refs[formEdit].resetFields()
          } else {
            var data = {
              name: this.formEdit.name,
              code: this.formEdit.code
            }
            add(data).then(response => {
              if (response.data.code === '200') {
                this.$message.success('添加成功')
                this.initTable()
              }
            })
            this.editSkillVisible = false
            this.$refs[formEdit].resetFields()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open(index, row) {
      var data2 = {
        id: row.id
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deletefcn(data2).then(response => {
            if (response.data.code === '200') {
              this.initTable()
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
</style>
