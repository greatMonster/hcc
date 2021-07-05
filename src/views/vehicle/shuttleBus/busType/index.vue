<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑摆渡车类型</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addContractClick('formName')">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table border stripe :data="contractShowTable" @current-change="handleSelectChange">
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column sortable prop="name" label="车辆类型" />
        <el-table-column prop="passNumber" label="载客人数" />
        <el-table-column prop="offsetNumber" label="多载人数" />
        <el-table-column prop="skill" label="所需员工技能">
          <template slot-scope="scope">{{ scope.row.skill.name }}</template>
        </el-table-column>
        <el-table-column prop="guestHonour" label="上客时间" />
        <el-table-column prop="abbreviation" label="标识简称" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改合同弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :model="formEdit" :rules="rules">
          <el-form-item prop="name" label="车辆类型名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="passNumber" label="载客数量" :label-width="formLabelWidth">
            <el-input v-model.number="formEdit.passNumber" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="offsetNumber" label="多载人数" :label-width="formLabelWidth">
            <el-input v-model.number="formEdit.offsetNumber" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="skill" label="员工技能" :label-width="formLabelWidth">
            <!-- <el-input v-model="formEdit.contractTypeCode" placeholder="请输入" /> -->
            <el-select v-model="formEdit.skillId" clearable filterable placeholder="请选择" style="width: 140px">
              <el-option v-for="item in skillOptions" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="abbreviation" label="标识简称" :label-width="formLabelWidth">
            <el-input v-model.number="formEdit.abbreviation" style="width: 50%" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="guestHonour" label="上客时间" :label-width="formLabelWidth"> <el-input v-model.number="formEdit.guestHonour" style="width: 50%" placeholder="请输入" />分钟 </el-form-item>
          <el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
            <el-input v-model="formEdit.remarks" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { query1, add, update, remove } from '@/apiNew/busType'
import { skill } from '@/api/skill'
export default {
  name: 'BaseAgreement',
  data() {
    return {
      airport: this.$store.state.user.airport,
      skillOptions: [],
      codeOptions: [
        { code: 'FULL', name: '全职' },
        { code: 'PART', name: '兼职' }
      ],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      id: this.$route.query.businessDomainId || '',
      contractShowTable: [],
      formEdit: { skillId: [] },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        passNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
        offsetNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
        skill: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        guestHonour: [{ required: true, message: '不能为空', trigger: 'blur' }],
        abbreviation: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initTable()
    this.skillList()
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.skillList()
      }
    }
  },
  methods: {
    printClick() {},
    importClick() {},
    skillList() {
      const data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
    },
    initTable() {
      const data = {
        id: this.id,
        airportId: this.airport.airportId
      }
      query1(data).then((response) => {
        this.contractShowTable = response.data.data
      })
    },
    // 添加合同
    addContractClick(formName) {
      this.formEdit.skillId = ''
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.title = '添加'
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.formEdit = Object.assign({}, { id: row.id, guestHonour: row.guestHonour, name: row.name, offsetNumber: row.offsetNumber, passNumber: row.passNumber, remarks: row.remarks, skillId: row.skill.id, abbreviation: row.abbreviation }) // copy obj
      this.editSkillVisible = true
    },
    edituserbleClick() {},
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      this.formEdit.skill = { id: this.formEdit.skillId, name: '' }
      if (this.title === '修改') {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            this.formEdit.airportId = this.airport.airportId
            update(this.formEdit)
              .then((response) => {
                this.$message.success('修改成功')
                this.initTable()
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            this.formEdit.airportId = this.airport.airportId
            add(this.formEdit)
              .then((response) => {
                this.$message.success('添加成功')
                this.initTable()
                this.editSkillVisible = false
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        })
      }
    },
    handleSelectChange(row) {
      console.log(row)
    },
    open(index, row) {
      var data2 = {
        id: row.id,
        airportId: this.airport.airportId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then((response) => {
            this.initTable()
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
