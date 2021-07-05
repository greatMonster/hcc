<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑合同详情</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addContractClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table border stripe :data="contractShowTable">
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column sortable prop="contractName" label="合同名称" />
        <el-table-column sortable prop="contractDesc" label="合同描述" />
        <el-table-column sortable prop="contractTypeBean.contractTypeName" label="合同类型" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :model="formEdit" :rules="rules">
          <el-form-item prop="contractName" label="合同名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.contractName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="contractDesc" label="合同描述：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.contractDesc" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="contractTypeId" label="合同类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.contractTypeId" placeholder="请选择" @change="orgnization">
              <el-option v-for="item in options" :key="item.contractTypeId" :label="item.contractTypeName" :value="item.contractTypeId" />
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
import { initTable, add, remove, set } from '@/api/agreementDtail'
import { initTable2 } from '@/api/basegreement'
export default {
  name: 'AgreementDtail',
  data() {
    return {
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      contractShowTable: [],
      id: this.$route.query.businessDomainId || '',
      formEdit: { contractName: '', contractBean: this.options, contractDesc: '', contractTypeId: '', value: '', contractId: '' },
      options: [],
      rules: {
        contractName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        contractDesc: [{ required: true, message: '不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '不能为空', trigger: 'change' }]
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
    this.initTable()
    this.initSelect()
  },
  methods: {
    printClick() {},
    importClick() {},
    orgnization(e) {
      this.formEdit.contractTypeId = e
    },
    initTable() {
      var data = {
        airportId: this.airport.airportId,
        businessDomainId: this.id
      }
      initTable(data).then(response => {
        this.contractShowTable = response.data
      })
    },
    initSelect() {
      var data = {
        airportId: this.airport.airportId,
        businessDomainId: this.id
      }
      initTable2(data).then(response => {
        this.options = response.data
      })
    },
    // 添加合同
    addContractClick() {
      this.formEdit.contractName = ''
      this.formEdit.contractDesc = ''
      this.formEdit.contractTypeId = ''
      this.formEdit.value = ''
      this.title = '添加'
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.formEdit = Object.assign({}, row)
      this.title = '修改'
      this.editSkillVisible = true
    },
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formName'].validate(valid => {
          if (valid) {
            this.formEdit.id = this.id
            this.formEdit.airportId = this.airport.airportId
            set(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initTable()
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
        this.$refs['formName'].validate(valid => {
          if (valid) {
            this.formEdit.id = this.id
            this.formEdit.airportId = this.airport.airportId
            add(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initTable()
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
    // handleSelectChange(row) {
    //   console.log(row)
    // },
    open(index, row) {
      var data2 = {
        contractId: row.contractId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then(response => {
            if (response.code === '200') {
              this.initTable()
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
