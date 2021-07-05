<template>
  <section>
    <div class="header-search" style="margin-top:60px">
      <!-- <div>
        <el-select v-model="value" placeholder="请选择文件类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div> -->
      <!-- <div class="search-file" style="margin-left:30px;">
        <span>快速搜索文件</span>
        <el-input v-model="input21" size="small" class="special" placeholder="输入搜索关键字" type="text" suffix-icon="el-icon-search" />
      </div> -->
      <!-- <div style="margin-left:30px;">
        <el-button type="primary" size="small">查 询</el-button>
      </div> -->
      <div class="right-section2">
        <el-button type="primary" size="small" @click="newServiceClick">新 增</el-button>
      </div>
      <!-- <div class="right-section3" @click="refresh">
        <el-button type="primary" size="small" @click="refresh">刷 新</el-button>
      </div> -->
      <div class="right-section2">
        <BulkImport class="filter-top-item" :post-url="postUrl" @refreshData="initable" />
      </div>
    </div>
    <!-- 表格-->
    <div class="table-css">
      <el-table v-loading="listLoading" :data="tableData" border stripe>
        <el-table-column prop="name" label="文件名">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createUser" label="修改人" />
        <el-table-column prop="createTime" label="修改时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :rules="rules" :model="formEdit">
          <el-form-item prop="docname" label="文件名：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.docname" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item v-if="showorkType" prop="workType" label="选择类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.workType" value-key="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>
    </div>
    </div>
  </section>
</template>

<script>
import BulkImport from '@/components/BulkImport' // 导入
import { initTable, addDocument, updateDocument, deleteDocument } from '@/api/setWorkRules'
export default {
  components: {
    BulkImport
  },
  data() {
    return {
      showorkType: true,
      title: '',
      formLabelWidth: '120px',
      editSkillVisible: false,
      listLoading: false,
      options: [{ value: 'SHIFT_PLAN', label: '排班计划' }, { value: 'ROSTER', label: '轮班计划' }],
      input21: '',
      tableData: [],
      formEdit: { docname: '' },
      postUrl: `${process.env.VUE_APP_BASE_API}` + 'api/v1//prepare/adRule/uploadJsonFile',
      jsonFile: 'jsonFile',
      rules: {
        docname: [{ required: true, message: '请输入', trigger: 'blur' }],
        workType: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {},
  created() {
    this.initable()
  },
  methods: {
    initable() {
      // 查询
      this.listLoading = true
      var data = {
        documentType: 'RULESET'
      }
      initTable(data).then(response => {
        this.tableData = response.data.data
        this.listLoading = false
      })
    },
    handleEditClick(formEdit) {
      // 新建规则文件弹框确认按钮
      if (this.title === '新建') {
        this.$refs.formName.validate(valid => {
          if (valid) {
            addDocument(this.formEdit).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.editSkillVisible = false
              this.initable()
            })
          }
        })
      } else {
        this.$refs.formName.validate(valid => {
          if (valid) {
            updateDocument(this.formEdit).then(response => {
              // 编辑文件弹框
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.editSkillVisible = false
              this.initable()
            })
          }
        })
      }
    },
    refresh() {
      this.initable()
    },
    openNext(index, row) {
      this.$router.push({ path: '/prepare/workRulesHidden', query: { id: row.documentId }})
    },
    newServiceClick() {
      // 新建规则文件
      this.title = '新建'
      this.showorkType = true
      this.editSkillVisible = true
    },
    editHandleClick(index, item) {
      // 编辑
      this.title = '编辑'
      this.formEdit.docname = item.name
      this.formEdit.documentId = item.documentId
      this.showorkType = false
      this.editSkillVisible = true
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteDocument(row.documentId).then(response => {
            if (response.code === '200') {
              this.initable()
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
