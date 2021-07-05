<template>
  <section>
    <div class="header-search">
      <div v-loading.fullscreen.lock="fullscreenLoading" class="search-file" style="margin-left: 30px">
        <el-input v-model="searchName" class="special" clearable placeholder="输入要搜索的作业标准名" type="text" size="small" suffix-icon="el-icon-search" @clear="clear" />
      </div>
      <div style="margin-left: 30px">
        <el-button type="primary" size="small" @click="search">查 询</el-button>
      </div>
      <div class="right-section2" @click="newServiceClick">
        <el-button type="primary" size="small">新 增</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="copyDataClick">复 制</el-button>
      </div>
    </div>
    <div v-if="tableData.length >= 0" class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="date" type="index" width="50" sortable />
        <el-table-column prop="standardName" label="作业标准名" sortable>
          <template slot-scope="scope">
            <span class="fileName" @click="dblclick(scope.row, $event)">{{ scope.row.standardName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable />
        <el-table-column prop="code" label="编码" sortable />
        <el-table-column prop="createUser" label="创建者" sortable />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
            <el-tooltip content="航班计划与规则匹配结果的校验" placement="left">
              <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="ValidityClick(scope.$index, scope.row)">校验 <i class="el-icon-question help-icon" /></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 -->
    <div v-else class="blank-style"><i class="el-icon-warning" style="font-size: 23px; color: red" /> 请先导入文件</div>
    <!-- <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>-->
    <!-- 新建弹框 -->
    <el-dialog v-dialogDrag title="请输入" :visible.sync="dialogFormVisible">
      <el-form ref="formName" :model="form" :rules="rules">
        <el-form-item prop="standardName" label="服务标准名" :label-width="formLabelWidth">
          <el-input v-model="form.standardName" style="width:40%" size="small" />
        </el-form-item>
        <el-form-item prop="code" label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" style="width:40%" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add('formName')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 复制弹框 -->
    <el-dialog v-dialogDrag title="复制工作量" :visible.sync="copyFormVisible">
      <el-form ref="copyform" :model="copyform" :rules="copyformRules">
        <el-form-item prop="standardName" label="服务标准名" :label-width="formLabelWidth">
          <el-input v-model="copyform.standardName" style="width:40%" size="small" />
        </el-form-item>
        <el-form-item prop="standardId" label="作业标准" :label-width="formLabelWidth">
          <el-select v-model="copyform.standardId" filterable placeholder="请选择" size="small" style="width:40%">
            <el-option v-for="(items, indexs) in standardOptions" :key="indexs" :label="items.standardName" :value="items.standardId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="copy('copyform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag title="校验对象" :visible.sync="dialogflight">
      <el-form ref="formName" :model="formEdit" :rules="rules2">
        <el-form-item label="航班计划" prop="flightDocument" :label-width="formLabelWidth">
          <el-select v-model="formEdit.flightDocument" filterable placeholder="请选择" value-key="id" @change="changeClick(formEdit.flightDocument)">
            <el-option v-for="(items, indexs) in flightOptions" :key="indexs" :label="items.name" :value="items" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formEdit.flightDocument.type==='DAY_FLIGHT_SCHEDULE'" prop="date" label="时间" :label-width="formLabelWidth">
          <el-date-picker v-model="formEdit.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogflight = false">取 消</el-button>
        <el-button type="primary" @click="handleClick('formName')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { initTable, add, deletestand, search, flightPlanData, ValidityFcn, dateData, copyFunc } from '@/api/serviceStandard'
export default {
  data() {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate) {
            const one = 6 * 24 * 3600 * 1000
            this.maxTime = this.pickerMinDate + one
            this.minTime = this.pickerMinDate - one
            if (this.dateArrayCopy[0] > this.minTime) {
              this.minTime = this.dateArrayCopy[0]
            }
            if (this.dateArrayCopy[this.dateArrayCopy.length - 1] < this.maxTime) {
              this.maxTime = this.dateArrayCopy[this.dateArrayCopy.length - 1]
            }
            return time.getTime() < this.minTime || time.getTime() > this.maxTime
          } else {
            if (this.dateArrayCopy.length === 0) {
              return time.getTime()
            } else {
              if (this.dateArrayCopy.indexOf(time.getTime()) !== -1) {
                return false
              } else {
                return true
              }
            }
          }
        }
      },
      standardOptions: [],
      copyFormVisible: false,
      copyform: { standardName: '', standardId: '' },
      dialogflight: false,
      fullscreenLoading: false,
      formLabelWidth: '120px',
      formEdit: {
        flightDocument: '',
        date: ''
      },
      airport: this.$store.state.user.airport,
      flightOptions: [],
      dialogFormVisible: false,
      form: { standardName: '', code: '' },
      options: [
        { value: '选项1', label: '文件一' },
        { value: '选项2', label: '文件二' },
        { value: '选项3', label: '文件三' }
      ],
      value: '全部文件夹',
      searchName: '',
      businessDomainId: this.$route.query.businessDomainId || '',
      tableData: [],
      rules: {
        standardName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      rules2: {
        flightDocument: [{ required: true, message: '不能为空', trigger: 'change' }],
        date: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      copyformRules: {
        standardName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        standardId: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {},
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
    this.flightPlanFcn()
  },
  methods: {
    search() {
      var data = {
        businessDomainId: this.businessDomainId,
        name: this.searchName,
        airportId: this.airport.airportId
      }
      search(data).then((response) => {
        this.tableData = response.data
        this.$message.success('查询成功')
      })
    },
    clear() {
      this.initable()
    },
    initable() {
      var data = {
        businessDomainId: this.businessDomainId,
        name: this.searchName,
        airportId: this.airport.airportId
      }
      initTable(data).then((response) => {
        this.tableData = response.data
        this.standardOptions = response.data
        this.listLoading = false
      })
    },
    add(formName) {
      // 增加规则
      this.$refs['formName'].validate((valid) => {
        if (valid) {
          var Id = {
            businessDomainId: this.businessDomainId,
            standardName: this.form.standardName,
            code: this.form.code,
            standardId: '',
            airportId: this.airport.airportId,
            documentId: ''
          }
          add(Id).then((response) => {
            if (response.code === '200') {
              this.$router.push({ path: './serviceStandard', query: { documentId: response.data, businessDomainId: this.businessDomainId }})
            }
          })
        }
      })
    },
    ValidityClick(index, row) {
      this.formEdit.standardDocumentId = row.documentId
      this.dialogflight = true
    },
    newServiceClick() {
      this.dialogFormVisible = true
    },
    dblclick(row, event) {
      this.$router.push({ path: './serviceStandard', query: { documentId: row.documentId, standardType: '', businessDomainId: this.businessDomainId, airportId: this.airport.airportId }})
    },
    flightPlanFcn() {
      var item = {

        airportId: this.airport.airportId
      }
      flightPlanData(item).then((res) => {
        if (res.data.code === '200') {
          this.flightOptions = res.data.data
        }
      })
    },
    changeClick(data) {
      if (data.type === 'DAY_FLIGHT_SCHEDULE') {
        dateData(data.id).then(res => {
          this.dateArray = res.data.data.dates
          this.dateArrayCopy = []
          this.dateArrayCopy = this.dateArray.map(x => new Date(x).getTime())
        })
      }
    },
    handleClick() {
      this.fullscreenLoading = true
      if (this.formEdit.flightDocument.type === 'CYCLE_FLIGHT_SCHEDULE') {
        var data = {
          standardDocumentId: this.formEdit.standardDocumentId,
          flightDocumentId: this.formEdit.flightDocument.id,
          fromDate: '',
          toDate: ''
        }
        ValidityFcn(data)
          .then((res) => {
            if (res.data.code === '200') {
              this.fullscreenLoading = false
              this.$router.push({ path: '/prepare/allPages/Validitypage', query: { data: JSON.stringify(this.formEdit) }})
            } else {
              this.fullscreenLoading = false
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
          .catch((e) => {
            this.fullscreenLoading = false
            this.$message({
              message: e.response.data.message,
              type: 'error'
            })
          })
      } else {
        var RequestData = {
          standardDocumentId: this.formEdit.standardDocumentId,
          flightDocumentId: this.formEdit.flightDocument.id,
          fromDate: this.formEdit.date[0],
          toDate: this.formEdit.date[1]
        }
        ValidityFcn(RequestData)
          .then((res) => {
            if (res.data.code === '200') {
              this.fullscreenLoading = false
              this.$router.push({ path: '/prepare/allPages/Validitypage', query: { data: JSON.stringify(this.formEdit) }})
            } else {
              this.fullscreenLoading = false
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
          .catch((e) => {
            this.fullscreenLoading = false
            this.$message({
              message: e.response.data.message,
              type: 'error'
            })
          })
      }
    },
    selectVersion(index, data) {},
    open(index, row) {
      var _this = this
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deletestand(row.standardId).then((response) => {
            if (response.code === '200') {
              _this.initable()
              _this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 复制
    copyDataClick(formName) {
      this.copyFormVisible = true
      this.copyform = { standardName: '', standardId: '' }
    },
    copy(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            standardName: this.copyform.standardName,
            standardId: this.copyform.standardId

          }
          copyFunc(data).then((response) => {
            if (response.data.code === '200') {
              this.$message.success(response.data.success)
              this.copyFormVisible = false
            } else {
              this.$message.error(response.data.success)
              this.copyFormVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
.header-search {
  display: flex;
  width: 100%;
  height: 80px;
  color: #989a9c;
  font-size: 16px;
  align-items: center;
  margin-top: 60px;
}
.search-file {
  margin-left: 20px;
}
img {
  width: 20px;
  height: 20px;
}
.right-section1,
.right-section2,
.right-section3 {
  display: flex;
  width: 60px;
  height: 80px;
  justify-content: space-around;
  align-items: center;
  font-size: 18px;
  color: white;
  vertical-align: middle;
  margin-left: 14%;
  cursor: pointer;
}
.right-section2 {
  margin-left: 1%;
}
.right-section3 {
  margin-left: 4%;
}
.blank-style {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: white;
  font-family: '宋体';
  font-size: 25px;
  background-color: #232c47;
}
.paginate {
  display: flex;
  width: 100%;
  height: 68px;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: right;
  background-color: #0a142f;
}
.pageFloat {
  display: flex;
  width: 100%;
  padding-top: 10px;
  justify-content: flex-end;
  align-items: center;
}
.pageFloat div {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #232c47;
  color: #989a9c;
}
.version-select {
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}
</style>
