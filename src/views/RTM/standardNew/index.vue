<template>
  <section>
    <div class="header-search" style="margin-top: 60px">
      <div v-loading.fullscreen.lock="fullscreenLoading" class="search-file" style="margin-left: 30px">
        <el-form :inline="true" :model="formSelect" class="demo-form-inline" size="small">
          <el-form-item label="工作类型" class="select">
            <el-select v-model="formSelect.workTypid" clearable placeholder="请选择">
              <el-option v-for="(items, indexs) in options" :key="indexs" :label="items.workTypeName" :value="items.workTypeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formSelect.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initable()">查 询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="newServiceClick">新 增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格-->
    <div class="table-css">
      <el-table v-loading="listLoading" :data="tableData" border stripe style="text-align: left">
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index, scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="workTypeName" label="工作类型" />
        <el-table-column prop="activation" label="是否启用">
          <template slot-scope="scope">
            <el-select v-model="scope.row.activation" placeholder="请选择" size="mini" @change="sndoffon(scope.$index, scope.row)">
              <el-option v-for="(items, index) in offonOptions" :key="index" :label="items.label" :value="items.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ensureLevel" label="保障等级" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
            <el-tooltip content="航班动态与作业标准匹配结果的校验" placement="right">
              <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="ValidityClick(scope.$index, scope.row)">校验 <i class="el-icon-question help-icon" /></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :rules="rules" :model="formEdit">
          <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入" style="width:300px" />
          </el-form-item>
          <el-form-item prop="code" label="编码" :label-width="formLabelWidth">
            <el-input v-model="formEdit.code" placeholder="请输入" style="width:300px" />
          </el-form-item>
          <el-form-item label="保障等级" prop="ensureLevel" :label-width="formLabelWidth">
            <el-select v-model="formEdit.ensureLevel" placeholder="请选择" style="width:300px">
              <el-option v-for="item in LevelOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="offon" prop="workTypeId" label="选择工作类型" :label-width="formLabelWidth">
            <el-select v-model="formEdit.workTypeId" value-key="value" placeholder="请选择" style="width:300px">
              <el-option v-for="item in options" :key="item.workTypeId" :label="item.workTypeName" :value="item.workTypeId" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div> -->
  </section>
</template>
<script>
// import BulkImport from '@/components/BulkImport' // 导入
import { selectData, initTable, addTable, removeData, editTable, ValidityFcn2 } from '@/apiNew/standardNew'
import { offonFcn } from '@/api/realTimeJobRules'
export default {
  components: {
    // BulkImport
  },
  filters: {
    joinData(val) {
      if (val) {
        return '是'
      } else {
        return '否'
      }
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      formSelect: {
        name: '',
        workTypid: ''
      },
      title: '',
      fullscreenLoading: false,
      dialogflight: false,
      offon: false,
      formLabelWidth: '120px',
      editSkillVisible: false,
      listLoading: false,
      options: [],
      LevelOptions: ['1', '2', '3', '4'],
      input21: '',
      tableData: [],
      businessDomainId: this.$route.query.businessDomainId || '',
      formEdit: {
        name: '',
        ensureLevel: '',
        workTypeId: '',
        code: ''
      },
      offonOptions: [
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        ensureLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        workTypeId: [{ required: true, message: '请选择', trigger: 'change' }]

      }
    }
  },
  computed: {},
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.selectData()
        this.initable()
      }
    }
  },
  created() {
    this.selectData()
    this.initable()
  },
  methods: {
    initable() {
      // 查询
      this.listLoading = true
      this.formSelect.businessDomain = this.businessDomainId
      this.formSelect.airportId = this.airport.airportId
      initTable(this.formSelect).then((response) => {
        this.tableData = response.data.data
        this.listLoading = false
      })
    },
    ValidityClick(index, row) {
      this.fullscreenLoading = true
      var data = {
        airportId: this.airport.airportId,
        id: row.id
      }
      ValidityFcn2(data)
        .then((res) => {
          if (res.data.code === '200') {
            this.fullscreenLoading = false
            this.$router.push({ path: '/prepare/allPages/Validitypage', query: { id: row.id, offon: true }})
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
    },
    selectData() {
      const data = {
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      selectData(data).then((response) => {
        if (response.code === '200') {
          this.options = response.data
        }
      })
    },
    handleEditClick(formEdit) {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.formEdit.airportId = this.airport.airportId
          if (this.title === '新增') {
            this.formEdit.businessDomain = this.businessDomainId
            addTable(this.formEdit).then((response) => {
              if (response.data.code === '200') {
                this.$message.success(response.data.message)
                this.initable()
                this.editSkillVisible = false
              }
            })
          } else {
            editTable(this.formEdit).then((response) => {
              if (response.data.code === '200') {
                this.$message.success(response.data.message)
                this.initable()
                this.editSkillVisible = false
              }
            })
          }
        }
      })
    },
    sndoffon(index, row) {
      offonFcn(row.id)
        .then((response) => {
          if (response.data.code === '200') {
            this.$message.success('状态更改成功')
            this.initable()
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch((e) => {
          this.$message.error(e.response.data.message)
          this.initable()
        })
    },
    edit(index, row) {
      this.title = '编辑'
      this.editSkillVisible = true
      this.offon = false
      this.formEdit.code = row.code
      this.formEdit.ensureLevel = row.ensureLevel
      this.formEdit.name = row.name
      this.formEdit.id = row.id
    },
    openNext(index, row) {
      this.$router.push({ path: '/dispatching/serviceStandard/serviceStandard', query: { id: row.id, workTypeId: row.workTypeId, businessDomainId: this.id }})
    },
    newServiceClick() {
      this.title = '新增'
      this.editSkillVisible = true
      this.offon = true
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeData(row.id).then((response) => {
            if (response.data.code === '200') {
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
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
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
  margin-left: 2%;
}
.right-section3 {
  margin-left: 2%;
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
