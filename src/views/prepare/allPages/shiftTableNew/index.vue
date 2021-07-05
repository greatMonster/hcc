<template>
  <section class="body1">
    <div style="height: 60px" />
    <div class="header-search">
      <div class="search-file" style="margin-left: 30px">
        <el-input v-model="input21" class="special" size="small" placeholder="输入搜索关键字" type="text" suffix-icon="el-icon-search" clearable @keyup.enter.native="searchClick" @clear="clear" />
      </div>
      <div style="margin-left: 30px">
        <el-button ref="searchKeyDown" type="primary" size="small" @click="searchClick">查 询</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="shifResultClick">新 增</el-button>
      </div>
      <!-- <div class="right-section2">
        <el-button type="primary" size="small" @click="importClick">导 入</el-button>
      </div>-->
    </div>
    <!-- 表格 -->
    <div v-if="tableData" class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index, scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beginDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column prop="workloadName" label="工作量" />
        <el-table-column prop="rosterRuleVOS" label="出勤规则">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.rosterRuleVOS" :key="i">{{ item.ruleName }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" />
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">{{ scope.row.type == 1 ? '基于工作量' : '基于模板' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="open(scope.$index, scope.row)">删 除</el-button>
            <el-button type="primary" size="small" @click="release(scope.$index, scope.row)" :loading="scope.row.releaseLoading">一键发布</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="blank-style"><i class="el-icon-warning" style="font-size: 23px; color: red" /> 请先导入文件</div>
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
import { initNewTable, deleteSchedule, releaseTable } from '@/apiNew/scheduleDetails'
export default {
  data() {
    return {
      airport: this.$store.state.user.airport,
      releaseLoading: false,
      input21: this.$route.query.searchValue || '', // 搜索
      tableData: [],
      title: '',
      newSchedule: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 一键发布
    release(index, row) {
      this.$set(row, 'releaseLoading', true)
      releaseTable({ rosterId: row.id })
        .then((response) => {
          this.$message.success('发布成功')
          this.$set(row, 'releaseLoading', false)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message || '服务器错误'
          })
          this.$set(row, 'releaseLoading', false)
        })
    },
    importClick() {
      this.$router.push({ path: './importFile' })
    },
    clear() {
      this.init()
    },
    searchClick() {
      var data = {
        id: this.$route.query.businessDomainId || 0,
        name: this.input21 || '',
        airportId: this.airport.airportId
      }
      console.log(data, 111)
      initNewTable(data).then((response) => {
        this.$message.success('查询成功')
        this.tableData = response.data.data
      })
    },
    init() {
      var data = {
        id: this.$route.query.businessDomainId || 0,
        name: this.input21 || '',
        airportId: this.airport.airportId
      }
      initNewTable(data).then((response) => {
        this.tableData = response.data.data
      })
    },
    shifResultClick() {
      // 新建
      this.$router.push({ path: '/prepare/addPage', query: { businessDomainId: this.$route.query.businessDomainId } })
    },
    openNext(index, row) {
      // 跳转到排班表
      this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: row.id, method: row.type, businessDomainId: this.$route.query.businessDomainId, searchValue: this.input21 } })
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            id: row.id
          }
          deleteSchedule(data).then((response) => {
            this.init()
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
.body1 /deep/ td,
tr,
th {
  text-align: left;
}
.body1 /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
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
.right-section2 {
  margin-left: 20px;
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
</style>
