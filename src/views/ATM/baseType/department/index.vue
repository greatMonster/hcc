<template>
  <div class="skillBox">
    <div class="title">
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="orgnizationPartTable" border stripe>
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="taskTypeVisible">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="organizationName" label="组织名称：" :label-width="formLabelWidth" style="width:400px">
            <el-input v-model="form.organizationName" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item prop="organizationDesc" label="描述：" :label-width="formLabelWidth" style="width:400px">
            <el-input v-model="form.organizationDesc" placeholder="请输入组织描述" />
          </el-form-item>
          <el-form-item prop="parentId" label="上级组织：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.parentOrganizationId" placeholder="请选择" style="width:280px">
              <el-option v-for="item in orgnizations" :key="item.organizationId" :label="item.organizationName" :value="item.organizationId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="businessDomainId" label="业务领域：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.businessDomainId" placeholder="请选择" style="width:280px">
              <el-option v-for="item in businessDomainIdoptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="taskTypeVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData, addDatafcn, eitDatafcn, deleteDatafcn, selectfcn } from '@/api/department'
export default {
  name: 'OrgnizationPart',
  data() {
    return {
      title: '',
      taskTypeVisible: false,
      edittaskVisible: false,
      formLabelWidth: '120px',
      orgnizationPartTable: [],
      businessDomainIdoptions: [],
      orgnizations: [],
      orgnizationID: '',
      cols: [
        {
          prop: 'organizationName',
          label: '名称'
        },
        {
          prop: 'organizationDesc',
          label: '描述'
        },
        {
          prop: 'parentName',
          label: '隶属于'
        },
        {
          prop: 'businessDomainName',
          label: '业务领域'
        }
      ],
      form: { organizationName: '', organizationDesc: '', parentOrganizationId: '', businessDomainId: '' },
      rules: {
        organizationName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        organizationDesc: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        businessDomainId: [{ required: true, message: '请选择业务领域', trigger: 'change' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.init()
      }

    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      selectfcn().then(response => {
        this.businessDomainIdoptions = response.data.data
      })
      var data = {
        airportId: this.airport.airportId
      }
      initData(data).then(response => {
        this.orgnizationPartTable = response.data
        this.orgnizations = response.data
      })
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.form.organizationName = ''
      this.form.organizationDesc = ''
      this.form.parentName = ''
      this.form.businessDomainId = ''
      this.title = '添加组织'
      this.taskTypeVisible = true
    },
    editHandleClick(index, row) {
      this.form.organizationName = row.organizationName
      this.form.organizationDesc = row.organizationDesc
      this.form.parentName = row.parentName
      this.form.businessDomainId = row.businessDomainId
      this.taskTypeVisible = true
      this.title = '编辑组织'
      this.orgnizationID = row.organizationId
    },
    //     // 添加确定按钮
    handleAddClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '添加组织') {
            var addData = this.form
            addData.airportId = this.airport.airportId
            addDatafcn(addData).then(response => {
              this.init()
            })
            this.taskTypeVisible = false
          } else {
            var eitData = this.form
            eitData.airportId = this.airport.airportId
            eitData.organizationId = this.orgnizationID
            eitDatafcn(eitData).then(response => {
              this.init()
            })
            this.orgnizationID = ''
            this.taskTypeVisible = false
          }
        } else {
          return false
        }
      })
    },

    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            organizationId: row.organizationId
          }
          deleteDatafcn(data).then(response => {
            if (response.code === '200') {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    handleRadioClick(e) {
      if (e === '2') {
        this.form.disabled1 = false
        this.form.disabled2 = true
      } else if (e === '3') {
        this.form.disabled1 = true
        this.form.disabled2 = false
      } else if (e === '1') {
        this.form.disabled1 = true
        this.form.disabled2 = true
      }
    }
  }
}
</script>
<style scoped>
.skillBox /deep/ form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style scoped>
form {
  padding-top: 30px;
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
