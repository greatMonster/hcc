<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑舱车关联性</div>
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="服务舱类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type.join(',') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="busType" label="车辆类型">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.busType" :key="index">{{ item.name }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultBusType.name" label="默认车型" />
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
          <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="type" label="服务舱类型" :label-width="formLabelWidth">
            <el-select v-model="formEdit.type" clearable multiple filterable placeholder="请选择" style="width: 240px">
              <el-option v-for="item in cangOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item prop="busType" label="车辆类型" :label-width="formLabelWidth">
            <!-- <el-input v-model="formEdit.contractTypeCode" placeholder="请输入" /> -->
            <el-select v-model="formEdit.busType" clearable multiple filterable placeholder="请选择" style="width: 240px" @change="busTypeChange">
              <el-option v-for="item in busOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="defaultBusType" label="默认车型" :label-width="formLabelWidth">
            <el-select v-model="formEdit.defaultBusType" clearable filterable placeholder="请选择" style="width: 240px">
              <el-option v-for="item in defaultBusOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
import { query, add, update, remove } from '@/apiNew/busRelated'
import { query1 } from '@/apiNew/busType'
export default {
  name: 'BaseAgreement',
  data() {
    return {
      airport: this.$store.state.user.airport,
      defaultBusOptions: [],
      codeOptions: [
        { code: 'FULL', name: '全职' },
        { code: 'PART', name: '兼职' }
      ],
      cangOptions: [
        { code: 'F', name: 'F舱（头等）' },
        { code: 'P', name: 'P仓（豪华头等）' },
        { code: 'J', name: 'J仓（公务）' },
        { code: 'C', name: 'C仓（公务）' },
        { code: 'G', name: 'G仓（超级经济）' },
        { code: 'Y', name: 'Y仓（经济）' }
      ],
      busOptions: [],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      id: this.$route.query.businessDomainId || '',
      contractShowTable: [],
      formEdit: {},
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        busType: [{ required: true, message: '不能为空', trigger: 'change' }],
        defaultBusType: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.busType()
      }
    }
  },
  created() {
    this.initTable()
    this.busType()
  },
  methods: {
    printClick() {},
    importClick() {},
    busType() {
      const data = {
        airportId: this.airport.airportId
      }
      query1(data).then((response) => {
        this.busOptions = response.data.data
      })
    },
    busTypeChange(val) {
      console.log(val)
      // debugger
      for (let i = 0; i < val.length; i++) {
        if (this.busOptions.length > 0) {
          this.busOptions.forEach((item) => {
            if (item.id === val[i]) {
              this.defaultBusOptions[i] = { id: item.id, name: item.name }
            }
          })
        }
      }
    },
    initTable() {
      const data = {
        airportId: this.airport.airportId
      }
      query(data)
        .then((response) => {
          this.contractShowTable = response.data.data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 添加舱车
    addContractClick(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.title = '添加'
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.defaultBusOptions = [row.defaultBusType]
      const name = row.name
      const defaultBusType = row.defaultBusType.id
      const busType = []
      for (let i = 0; i < row.busType.length; i++) {
        busType[i] = row.busType[i].id
      }
      this.formEdit = Object.assign({}, { name: name, defaultBusType: defaultBusType, busType: busType, type: row.type, id: row.id }) // copy obj
      this.editSkillVisible = true
    },
    edituserbleClick() {},
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      if (this.formEdit.busType.length > 0) {
        for (let i = 0; i < this.formEdit.busType.length; i++) {
          this.formEdit.busType[i] = { id: this.formEdit.busType[i], name: '' }
        }
      }
      this.formEdit.defaultBusType = { id: this.formEdit.defaultBusType, name: '' }
      this.formEdit.airportId = this.airport.airportId
      if (this.title === '修改') {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            update(this.formEdit)
              .then((response) => {
                this.$message.success('修改成功')
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
      } else {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
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
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
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
