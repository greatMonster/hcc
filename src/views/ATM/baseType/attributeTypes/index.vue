<template>
  <div class="user-config">
    <div class="user-title">
      添加或编辑属性类型
      <span style="padding-left: 30px">
        <el-button style="width: 70px; height: 30px" type="primary" size="small" @click="addClick">添加</el-button>
      </span>
    </div>
    <div class="user-oparation">
      <el-table v-loading="listLoading" :data="tableData1" border stripe>
        <el-table-column prop="typeName" label="属性类型名" />
        <el-table-column prop="typeCode" label="属性类型编码" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="maxLength" label="最大长度" />
        <!-- <el-table-column label="查找值">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" />
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修改</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <div>
      <!-- <el-dialog v-dialogDrag title="编 辑" :visible.sync="dialogEditVisible"> -->
      <el-dialog v-dialogDrag :title="title" :visible.sync="editPropertyVisible">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item label="属性类型名：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.typeName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="属性类型编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.typeCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="数据类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.dataType" placeholder="请选择" @visible-change="initselect">
              <el-option v-for="item in addDataType" :key="item.dataTypeCode" :label="item.dataTypeCode" :value="item.dataTypeCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="最大长度：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.maxLength" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="isLookup：" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.isLookup" @change="handleCheckedCitiesChange">备选项</el-checkbox>
          </el-form-item>
          <el-form-item v-show="formEdit.isLookup == true" label="查找值：" :label-width="formLabelWidth">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="postUrl"
              accept=".xls,.xlsx"
              :limit="limit"
              :multiple="isMultiple"
              :on-change="fileChange"
              :on-preview="handlePreview"
              :file-list="fileList"
              :on-remove="handleRemove"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px" size="small" type="info" @click="exportFileModel">模板下载</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <el-input v-for="(item, index) in formEdit.values" :key="index" v-model="formEdit.values[index]" placeholder="请输入" style="margin-bottom: 5px" />
            <el-button type="info" size="small" @click="addInput"> + </el-button>
          </el-form-item>
          <!-- <el-form-item label="查找值：" :label-width="formLabelWidth">
            <div class="searchValue">
              <el-select v-model="formEdit.value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button type="primary" style="margin-left: 20px" @click="handleImportClick">Import</el-button>
            </div>
          </el-form-item> -->

          <!-- <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="formAdd.checked">允许多个值</el-checkbox>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editPropertyVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formName')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, add1, remove, set1, initselect } from '@/api/attributeTypes'
import axios from 'axios'
export default {
  data() {
    return {
      limit: 1,
      isMultiple: false,
      file: '',
      fileList: [],
      postUrl: `${process.env.VUE_APP_BASE_API}prepare/attribute/insertAttributeType`,
      title: '',
      listLoading: true,
      airport: this.$store.state.user.airport,
      addPropertyVisible: false,
      formLabelWidth: '120px',
      editPropertyVisible: false,
      // value: '1',
      // dataTypeValue: '1',
      addDataType: [],
      tableData1: [],
      // formAdd: { code: '', propertyName: '', dataTypeValue: '1', maxLength: '', value: '1', checked: false },
      formEdit: { isLookup: false, typeName: '', typeCode: '', typeId: '', dataType: '', maxLength: '', values: [] },
      rules: {
        typeName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        typeCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dataType: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initable()
  },
  methods: {
    // 模板下载
    exportFileModel() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/attributeTemplate'
    },
    fileChange(file, fileList) {
      this.file = file.raw
    },
    // delete file
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleCheckedCitiesChange(value) {
      this.formEdit.isLookup = value
    },
    printClick() {},
    importClick() {},
    initable() {
      var data = {

        airportId: this.airport.airportId
      }
      initTable(data).then((response) => {
        this.tableData1 = response.data
        this.listLoading = false
      })
    },
    initselect() {
      // 数据类型下拉框
      initselect().then((response) => {
        this.addDataType = response.data
        this.listLoading = false
      })
    },
    addInput() {
      // 添加input
      this.formEdit.values.push('')
    },
    // 添加按钮
    addClick() {
      this.title = '添加'
      this.editPropertyVisible = true
      this.formEdit.typeName = ''
      this.formEdit.typeCode = ''
      this.formEdit.dataType = ''
      this.formEdit.maxLength = ''
      this.formEdit.isLookup = false
      this.formEdit.values = []
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editPropertyVisible = true
      // console.log(row, 9999)
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            const attributes = []
            if (this.formEdit.values.length) {
              for (let i = 0; i < this.formEdit.values.length; i++) {
                attributes[i] = { value: this.formEdit.values[i], key: this.formEdit.values[i] }
              }
            }
            // console.log(this.formEdit.values, 300)
            const formData = new FormData()
            for (const key in this.formEdit) {
              if (key === 'values') {
                formData.append('attributes', JSON.stringify(attributes))
                // formData.append(key, this.formEdit[key])
              } else {
                formData.append(key, this.formEdit[key])
              }
            }
            // this.fileListAdd.map(item => {
            formData.append('file', this.file)
            // console.log(formData, 221)
            if (!formData.has('sysType')) {
              formData.append('sysType', 'EXTEND')
            }
            // })
            set1(formData)
              .then((response) => {
                // if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.data.message
                })
                // }
                this.editPropertyVisible = false
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || '500，服务器错误'
                })
              })
          }
        })
      } else {
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            const formData = new FormData()
            const attributes = []
            if (this.formEdit.values.length) {
              for (let i = 0; i < this.formEdit.values.length; i++) {
                attributes[i] = { value: this.formEdit.values[i], key: this.formEdit.values[i] }
                // data.append(`values[${i}].title`, item.title)
              }
            }
            // console.log(this.formEdit.values, 300)
            for (const key in this.formEdit) {
              if (key === 'values') {
                formData.append('attributes', JSON.stringify(attributes))
                // formData.append(key, this.formEdit[key])
              } else {
                formData.append(key, this.formEdit[key])
              }
            }
            // this.fileListAdd.map(item => {

            formData.append('airportId', this.airport.airportId)
            formData.append('file', this.file)
            if (!formData.has('sysType')) {
              formData.append('sysType', 'EXTEND')
            }
            // })
            add1(formData)
              .then((response) => {
                // if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.editPropertyVisible = false
                // }
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || '500,服务器错误'
                })
              })
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
          remove(row.typeId).then((response) => {
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
.user-config {
  width: 100%;
  height: 100%;
  color: white;
  margin-top: 60px;
}
.user-title {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 14px;
  background-color: #0a142f;
}
.searchValue {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
