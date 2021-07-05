<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑工作类型</div>
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
      <el-table :data="workTypeTable" border :header-row-style="{ 'background-color': 'rgb(10, 20, 47)' }" :row-style="{ 'background-color': '#232c47' }" style="width: 100%; color: white">
        <el-table-column prop="workTypeName" label="名称" />
        <el-table-column prop="skillBeans" label="技能">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.skillBeans" :key="i">{{ item.skillName }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="workTypeCode" label="描述" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editWorkVisible">
        <el-form ref="formEdit" :model="formEdit">
          <el-form-item prop="name" label="工作名称" :label-width="formLabelWidth" :rules="{ required: true, message: '请输入工作名称' }">
            <el-input v-model="formEdit.name" placeholder="请输入工作名称" />
          </el-form-item>
          <el-form-item prop="desc" label="工作描述" :label-width="formLabelWidth" :rules="{ required: true, message: '请输入工作描述' }">
            <el-input v-model="formEdit.desc" placeholder="请输入工作描述" />
          </el-form-item>
          <el-form-item prop="skillIds" label="技能" :label-width="formLabelWidth">
            <el-select v-model="formEdit.skillIds" placeholder="请选择" multiple collapse-tags style="width: 300px">
              <el-option v-for="item in skillOptions" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editWorkVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, addData, modifyData, deleteData } from '@/api/workType'
import { skill } from '@/api/skill'
export default {
  name: 'WorkType',
  data() {
    return {
      airport: this.$store.state.user.airport,
      title: '',
      id: this.$route.query.businessDomainId || '',
      skillOptions: [],
      editWorkVisible: false,
      formLabelWidth: '120px',
      workTypeTable: [],
      formEdit: { name: '', desc: '', skillIds: '' },
      workTypeId: '',
      value: ''
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.selectData()
      }
    }
  },
  created() {
    this.initTable()
    this.selectData()
  },
  methods: {
    initTable() {
      const data = {
        id: this.id,
        airportId: this.airport.airportId
      }
      initTable(data).then((response) => {
        if (response.code === '200') {
          this.workTypeTable = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    selectData() {
      const data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
    },

    addHandleClick() {
      this.title = '添加'
      this.formEdit.name = ''
      this.formEdit.desc = ''
      this.formEdit.skillIds = ''
      this.editWorkVisible = true
    },
    // 添加合同的启用状态按钮
    adduserbleClick() {},
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.formEdit.name = row.workTypeName
      this.formEdit.desc = row.workTypeCode
      var arr = []
      row.skillBeans.forEach((element) => {
        arr.push(element.skillId)
      })
      this.formEdit.skillIds = arr
      this.workTypeId = row.workTypeId
      this.editWorkVisible = true
    },
    edituserbleClick() {},
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      var data = {}
      if (this.title === '修改') {
        data = {
          workTypeId: this.workTypeId,
          workTypeName: this.formEdit.name,
          workTypeCode: this.formEdit.desc,
          skillIds: this.formEdit.skillIds,
          airportId: this.airport.airportId
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyData(data).then((response) => {
              if (response.code === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.initTable()
              } else {
                this.$message({
                  type: 'error',
                  message: response.message
                })
              }
            })
            this.editWorkVisible = false
            this.$refs[formName].resetFields()
          } else {
            return false
          }
        })
      } else {
        data = {
          id: this.id,
          workTypeName: this.formEdit.name,
          workTypeCode: this.formEdit.desc,
          skillIds: this.formEdit.skillIds,
          airportId: this.airport.airportId
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
              }
            })
            this.editWorkVisible = false
            this.$refs[formName].resetFields()
          } else {
            return false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            workTypeId: row.workTypeId
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
</style>
