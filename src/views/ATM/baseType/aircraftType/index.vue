<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑技能</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table v-loading="listLoading" :data="skillShowTable" border stripe>
        <el-table-column prop="aircraftTypeName" label="名称" />
        <el-table-column prop="icaoCode" label="ICAO" />
        <el-table-column prop="iataCode" label="IATA" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formEdit" :model="formEdit" :rules="Rules">
          <el-form-item prop="aircraftTypeName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.aircraftTypeName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="icaoCode" label="ICAO：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.icaoCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="iataCode" label="IATA：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.iataCode" placeholder="请输入" />
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
import { initTable, add, remove, set } from '@/api/aircraftType'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      listLoading: true,
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      skillShowTable: [],
      formEdit: {},
      Rules: {
        aircraftTypeName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        icaoCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        iataCode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initable()
  },
  methods: {
    printClick() {},
    importClick() {},
    initable() {
      initTable().then(response => {
        this.skillShowTable = response.data
        this.listLoading = false
      })
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
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
            set(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            add(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
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
      })
        .then(() => {
          remove(this.formEdit).then(response => {
            if (response.code === '200') {
              this.initable()
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
