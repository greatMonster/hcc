<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑航司信息</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="small" @click="exportClick">下载模板</el-button>
        <selected-import class="button-padding filter-top-item right-section2" :name="name" :post-url="url" @refreshData="importClick" />
        <el-button class="button-padding" type="primary" size="small" @click="correlateBusiness">关联业务</el-button>
        <el-button class="button-padding" type="primary" size="small" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="orgnizationTable" border stripe>
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column sortable prop="carrierName" label="承运人名称" />
        <el-table-column sortable prop="iataCode" label="二字码" />
        <el-table-column sortable prop="icaoCode" label="三字码" />
        <el-table-column sortable prop="carrierType" label="承运人类型">
          <template slot-scope="scope">
            <span v-if="scope.row.carrierType==1">自已</span>
            <span v-if="scope.row.carrierType==2">客户</span>
            <span v-if="scope.row.carrierType==3">第三方</span>
          </template>
        </el-table-column>
        <!-- <el-table-column sortable prop="contactPerson" label="承运人联系人" />
        <el-table-column sortable prop="address" label="承运人地址" />
        <el-table-column sortable prop="phone" label="手机" />
        <el-table-column sortable prop="email" label="邮箱" />
        <el-table-column sortable prop="fax" label="传真号" />-->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加新合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="orgnizationDialogVisible">
        <el-form ref="formName" :model="form" :rules="rules">
          <el-form-item prop="carrierName" label="承运人名称：" :label-width="formLabelWidth">
            <el-input v-model="form.carrierName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="iataCode" label="二字码：" :label-width="formLabelWidth">
            <el-input v-model="form.iataCode" placeholder="请输入" maxlength="2" />
          </el-form-item>
          <el-form-item prop="icaoCode" label="三字码：" :label-width="formLabelWidth">
            <el-input v-model="form.icaoCode" placeholder="请输入" maxlength="3" />
          </el-form-item>
          <el-form-item prop="carrierType" label="承运人类型：" :label-width="formLabelWidth">
            <el-select v-model="form.carrierType" placeholder="请选择" @change="carrierType">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="contactPerson" label="承运人联系人：" :label-width="formLabelWidth">
            <el-input v-model="form.contactPerson" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="address" label="承运人地址：" :label-width="formLabelWidth">
            <el-input v-model="form.address" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="手机：" :label-width="formLabelWidth">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="fax" label="传真：" :label-width="formLabelWidth">
            <el-input v-model="form.fax" placeholder="请输入传真好号" />
          </el-form-item>
          <el-form-item prop="email" label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="orgnizationDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('formName')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, add, remove, set } from '@/api/organization'
import selectedImport from '@/components/BulkImport/selectedImport'
export default {
  name: 'Orgnization',
  components: {
    selectedImport
  },
  data() {
    return {
      name: 'file',
      url: `${process.env.VUE_APP_BASE_API}` + 'api/v1/adm/carrier/inputFile',
      title: '',
      orgnizationDialogVisible: false,
      dialogAbbrevFormVisible: false,
      formLabelWidth: '120px',
      checkList: ['Requested by Airline'],
      orgnizationTable: [],
      form: {
        carrierName: '',
        iataCode: '',
        icaoCode: '',
        carrierType: '',
        contactPerson: '',
        address: '',
        phone: '',
        fax: '',
        email: '',
        carrierId: ''
      },
      typeOptions: [
        { value: '1', label: '自己' },
        { value: '2', label: '客户' },
        { value: '3', label: '第三方' }
      ],
      value: '',
      rules: {
        carrierName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        iataCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        icaoCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // contactPerson: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // phone: [
        //   { required: true, message: '不能为空' }
        //   // { type: 'number', message: '手机号必需为数字', trigger: 'blur' }
        // ],
        carrierType: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    // 下载模板
    exportClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/adm/carrier/carrierTemplate'
    },
    // 导入
    importClick(params) {
      if (params.result === 'success') {
        this.$message.success('导入成功')
        this.initTable()
      } else {
        this.$message.error('导入失败')
      }
    },
    // 关联业务
    correlateBusiness() {
      this.$router.push({ path: './correlateBusiness' })
    },
    carrierType(e) {
      this.form.carrierType = e
    },
    initTable() {
      initTable().then(response => {
        this.orgnizationTable = response.data
      })
    },
    addHandleClick() {
      this.form.carrierName = ''
      this.form.iataCode = ''
      this.form.icaoCode = ''
      // this.form.contactPerson = ''
      // this.form.address = ''
      // this.form.phone = ''
      this.form.carrierType = ''
      // this.form.email = ''
      this.title = '添加'
      this.orgnizationDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form = row.carrierId
      this.form = Object.assign({}, row) // copy obj
      this.orgnizationDialogVisible = true
      this.title = '编辑'
    },
    //     // 添加组织后的确定按钮
    handleAddClick(formName) {
      if (this.title === '添加') {
        this.$refs['formName'].validate(valid => {
          if (valid) {
            add(this.form).then(response => {
              if (response.code === '200') {
                this.initTable()
                this.$message.success('添加成功')
              }
            })
            this.orgnizationDialogVisible = false
          }
        })
      } else if (this.title === '编辑') {
        this.$refs['formName'].validate(valid => {
          if (valid) {
            set(this.form).then(response => {
              if (response.code === '200') {
                this.$message.success('编辑成功')
                this.initTable()
              }
            })
            this.orgnizationDialogVisible = false
          }
        })
      }
    },
    handlechangeClick(e) {
      // console.log(e)
      if (e === true) {
        this.form.disabled = false
      } else {
        this.form.disabled = true
      }
    },
    open(index, row) {
      var data2 = {
        carrierId: row.carrierId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then(response => {
            if (response.code === '200') {
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
<style>
.el-dialog {
  min-width: 900px;
}
</style>

<style scoped>
form {
  margin-top: 20px;
}
.addButton {
  width: 75%;
  display: flex;
  justify-content: flex-end;
}
.addButton .button-padding {
  margin-left: 6px;
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
  font-size: 16px;
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
