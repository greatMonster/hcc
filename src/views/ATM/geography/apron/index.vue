<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>机坪</div>
        <div class="importExcel">
          <el-button size="small" type="info" @click="backpage">返回</el-button>
        </div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table
        :data="skillShowTable"
        border
        stripe
      >
        <el-table-column prop="apronName" label="名称" />
        <el-table-column prop="apronCode" label="编码" />
        <el-table-column prop="apronNote" label="备注" />
        <el-table-column prop="defaultFerryTime" label="默认摆渡进场时间" />
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="apronName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.apronName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="apronCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.apronCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="apronNote" label="备注：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.apronNote" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="defaultFerryTime" label="默认摆渡进场时间：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.defaultFerryTime" placeholder="请输入" />
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
import { find, add, set, remove } from '@/api/apron'
export default {
  name: 'CheckInData',
  data() {
    return {
      title: '',
      apronId: '',
      editSkillVisible: false,
      formLabelWidth: '150px',
      skillShowTable: [],
      formEdit: { apronName: '', apronCode: '', apronNote: '', defaultFerryTime: '' },
      islandName: [],
      rules: {
        apronName: [
          { required: true, message: '不能为空' }
        ],
        apronCode: [
          { required: true, message: '不能为空' }
        ],
        apronNote: [
          { required: true, message: '不能为空' }
        ],
        defaultFerryTime: [
          { required: true, message: '不能为空' }
        ]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initable()
      }

    }
  },
  created() {
    this.initable()
  },
  methods: {
    backpage() {
      this.$router.go(-1)
    },

    initable() {
      var data = {
        airportId: this.airport.airportId
      }
      find(data).then(response => {
        this.skillShowTable = response.data.data
      })
    },

    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.formEdit.apronName = ''
      this.formEdit.apronCode = ''
      this.formEdit.apronNote = ''
      this.formEdit.defaultFerryTime = ''
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data = {
              apronId: this.formEdit.apronId,
              apronName: this.formEdit.apronName,
              apronCode: this.formEdit.apronCode,
              apronNote: this.formEdit.apronNote,
              defaultFerryTime: this.formEdit.defaultFerryTime,
              airportId: this.airport.airportId
            }
            set(data).then(response => {
              if (response.data.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data = {
              apronName: this.formEdit.apronName,
              apronCode: this.formEdit.apronCode,
              apronNote: this.formEdit.apronNote,
              defaultFerryTime: this.formEdit.defaultFerryTime,

              airportId: this.airport.airportId
            }
            add(data).then(response => {
              if (response.data.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
              } else {
                this.$message.error(response.data.message)
              }
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(row).then(response => {
          if (response.data.code === '200') {
            this.initable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {

      })
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
