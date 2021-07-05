<template>
  <section>
    <div class="header-search">
      <!-- <div class="search-file" style="margin-left:30px;">
        <el-input
          v-model="input21"
          class="special"
          placeholder="输入搜索关键字"
          type="text"
          suffix-icon="el-icon-search"
        />
      </div>-->
      <selected-import class="filter-top-item right-section2" :name="name" :post-url="url" @refreshData="initTable" />
      <div class="right-section2">
        <el-button type="primary" size="small" @click="exportClick">导出</el-button>
      </div>
      <div class="right-section3">
        <el-button type="info" size="small" @click="viewClick">查看导入模板</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-css">
      <el-table :data="tableData" border stripe highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="name" label="文件名">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人" width="130" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="lastModifyUser" label="修改人" width="130" />
        <el-table-column prop="lastModifyTime" label="修改时间" />
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>-->
  </section>
</template>

<script>
import { initStaticTable, remove } from '@/api/workload'
import selectedImport from '@/components/BulkImport/selectedImport'
export default {
  name: 'StaticWorkload',
  components: {
    selectedImport
  },
  data() {
    return {
      options: [{ value: '选项1', label: '文件一' }, { value: '选项2', label: '文件二' }, { value: '选项3', label: '文件三' }],
      value: '全部文件夹',
      name: 'file',
      url: `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/workload/import/fixedWorkloads',
      input21: '',
      tableData: []
    }
  },
  computed: {},
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initStaticTable().then(response => {
        this.tableData = response.data
      })
    },
    openNext(index, row) {
      this.$router.push({ path: '/prepare/allPages/workloadHidden', query: { id: row.documentId } })
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(row.documentId).then(response => {
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
    },
    handleCurrentChange(currentRow) {
      this.documentIndex = currentRow.documentId
    },
    exportClick() {
      if (this.documentIndex) {
        window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/workload/export/fixedWorkloads?documentId=' + this.documentIndex
      } else {
        this.$message.error('请先选择要导出的文件！')
      }
    },
    viewClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/workload/export/fixedWorkLoads/mode'
    }
  }
}
</script>

<style scoped>
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
  margin-left: 20px;
}
.right-section3 {
  margin-left: 4%;
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
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
</style>
