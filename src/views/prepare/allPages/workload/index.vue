<template>
  <div class="body" style="margin-top:60px">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="航班计划工作量" name="first">
        <section>
          <div class="header-search">
            <!-- <div>
        <el-select v-model="value" placeholder="请选择文hh件类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
            </div>-->
            <div class="search-file" style="margin-left:30px;">
              <!-- <span>快速搜索文件</span> -->
              <el-input v-model="input21" class="special" size="small" placeholder="输入搜索关键字" type="text" suffix-icon="el-icon-search" />
            </div>
            <div style="margin-left:30px;">
              <el-button type="primary" size="small" @click="searchInput">查 询</el-button>
            </div>
            <div class="right-section2">
              <el-button type="primary" size="small" @click="newWorkloadClick">新 增</el-button>
            </div>
            <!-- <div class="right-section2">
              <i class="el-icon-download" style="color:#00B4DD;font-size:16px" />
            导入-->
            <!-- </div> -->
          </div>
          <!-- 表格 -->
          <div class="table-css">
            <el-table :data="tableData" border stripe>
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
        </section>
      </el-tab-pane>
      <el-tab-pane label="固定工作量">
        <static-workload />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { search, remove, initNewTable } from '@/api/workload'
import staticWorkload from './components/staticWorkload'
export default {
  name: 'Workload2',
  components: {
    staticWorkload
  },
  data() {
    return {
      activeName: 'first',
      input21: '',
      tableData: []
    }
  },
  computed: {},
  created() {
    this.initable()
  },
  methods: {
    handleClick(tab, event) {},
    initable() {
      initNewTable().then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    searchInput() {
      this.tableData = []
      search(this.input21 + '').then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    openNext(index, row) {
      this.$router.push({ path: '/prepare/allPages/workloadHidden/merge', query: { id: row.documentId, name: row.name }})
    },
    newWorkloadClick() {
      this.$router.push({ path: '/prepare/allPages/workloadHidden/merge' })
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          document.onkeydown = function(e) {
            var ev = (typeof event !== 'undefined') ? window.event : e
            if (ev.keyCode === 13) {
              return false
            }
          }
          remove(row.documentId).then(response => {
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

