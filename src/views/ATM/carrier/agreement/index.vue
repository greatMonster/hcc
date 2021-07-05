<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑航司合同</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="contractTable" border stripe>
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column sortable prop="contractName" label="名称" />
        <el-table-column sortable prop="contractDesc" label="描述" />
        <el-table-column sortable prop="carrierBean.carrierName" label="承运人" />
        <el-table-column label="适用期">
          <el-table-column prop="activeFrom" label="激活时间" />
          <el-table-column prop="activeTo" label="结束时间" />
        </el-table-column>
        <!-- <el-table-column
        v-for="(col,index) in cols"
        :prop="col.prop"
        :label="col.label"
        :key="index"
        >
        </el-table-column> -->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              style="width:60px;height:30px;"
              @click="editHandleClick(scope.$index,scope.row)"
            >修 改</el-button>
            <el-button
              type="primary"
              size="small"
              style="width:60px;height:30px;"
              @click="open(scope.$index,scope.row)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加编辑新合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="contractFormVisible">
        <el-form ref="formName" :model="form" :rules="rules">
          <el-form-item label="名称：" :label-width="formLabelWidth">
            <el-input v-model="form.contractName" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth">
            <el-input v-model="form.contractDesc" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="承运人：" :label-width="formLabelWidth">
            <el-select v-model="value" placeholder="请选择" @change="orgnization($event)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="激活时间：" :label-width="formLabelWidth">
            <el-date-picker v-model="form.activeFrom" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="结束时间：" :label-width="formLabelWidth">
            <el-checkbox v-model="enableChecked" @change="enableEndTimeClick">是否选用</el-checkbox>
            <el-date-picker v-model="form.activeTo" value-format="yyyy-MM-dd" :disabled="form.disabled" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="contractFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('formName')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { initTable, add, remove, set, initSelect } from '@/api/agreement'
export default {
  name: 'AgreementATM',
  data() {
    return {
      value: '',
      enableChecked: '',
      title: '',
      contractFormVisible: false,
      formLabelWidth: '120px',
      contractTable: [],
      options: [],
      form: { carrierId: '', contractId: '', contractName: '', contractDesc: '', carrierBean: '', activeFrom: '', activeTo: '', disabled: true },
      rules: {
        contractName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contractDesc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activeFrom: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        activeTo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initTable()
    this.initSelect()
  },
  methods: {
    orgnization(e) {
      this.form.carrierId = e
      // this.form.carrierBean = Object.assign({}, { 'carrierId': e })
    },
    initTable() {
      initTable().then(response => {
        this.contractTable = response.data
      })
    },
    initSelect() { // 下拉框数据
      initSelect().then(response => {
        response.data.forEach(element => {
          this.options.push({ 'value': element.carrierId, 'label': element.carrierName })
        })
      })
    },
    addHandleClick() {
      this.title = '添加'
      this.contractFormVisible = true
    },
    editHandleClick(index, row) {
      this.form.contractId = row.contractId
      this.form = Object.assign({}, row) // copy obj
      this.contractFormVisible = true
      this.title = '编辑'
    },
    // 添加合同后的确定按钮
    handleAddClick() {
      if (this.title === '添加') {
        add(this.form).then(response => {
          if (response.code === '200') {
            this.initTable()
          }
        })
        this.contractFormVisible = false
      } else if (this.title === '编辑') {
        set(this.form).then(response => {
          if (response.code === '200') {
            this.initTable()
          }
        })
        //  this.$refs[formName].resetFields()
        this.$nextTick(() => {
          this.$refs['formName'].clearValidate()
        })
        this.contractFormVisible = false
      }
    },
    enableEndTimeClick(e) {
      if (e === true) {
        this.form.disabled = false
      } else {
        this.form.disabled = true
      }
    },
    open(index, row) {
      var data2 = {
        'contractId': row.contractId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(data2).then(response => {
          if (response.code === '200') {
            this.initTable()
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {

      })
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
<style>
.el-table thead.is-group th {
    background: #0a142f;
}
.el-table--border th, .el-table__fixed-right-patch {
    border-bottom: 1px solid #434B61;
}
.el-table__body tr, .el-table__body td {
    text-align: center;
}
.el-table th>.cell {
    text-align: center;
}
</style>

<style scoped>

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
