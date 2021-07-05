<template>
  <div class="warp">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="add-user" size="small">
        <el-form-item>
          <el-button type="primary" size="small" @click="sechData()">刷 新</el-button>
          <el-button type="primary" size="small" @click="addPage()">新 增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="skillShow">
      <el-table :data="showTable" border stripe>
        <el-table-column prop="composeName" label="名称" width="250">
          <template slot-scope="scope">
            <a @click="linktoDetail(scope.row)">{{ scope.row.composeName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="airportNameChn" label="机场" width="200" />
        <el-table-column prop="dateRange" label="开始与结束日期" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.dateRange }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="passRate" label="处理速率(人/小时)" width="160" />
        <el-table-column prop="maxQueuingTime" label="最大排队时间(分钟)" width="160">
          <template slot-scope="scope">
            {{ Number(scope.row.maxQueuingTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="flowName" label="旅客流量名称" min-width="100" />
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="deleteHandleClick(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryList, deleteData } from '@/apiNew/checkInData'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      airport: this.$store.state.user.airport,
      listQuery: {
        carrier: ''
      },
      showTable: [],
      formEdit: {}
    }
  },
  created() {
    this.initable()
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
  methods: {
    sechData() {
      this.initable()
      this.$message.success('刷新成功')
    },
    deleteHandleClick(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          document.onkeydown = function (e) {
            var ev = typeof event !== 'undefined' ? window.event : e
            if (ev.keyCode === 13) {
              return false
            }
          }
          deleteData(row.id).then((response) => {
            this.initable()
            this.$message({
              type: 'success',
              message: response.data.message
            })
          })
        })
        .catch(() => {})
    },
    addPage() {
      localStorage.removeItem('stepOne')
      localStorage.removeItem('stepTwo')
      localStorage.removeItem('stepThree')
      this.$router.push({ path: '/newcheckIn/addPage' })
    },
    editHandleClick(index, row) {
      localStorage.removeItem('edit_stepOne')
      localStorage.removeItem('edit_stepTwo')
      localStorage.removeItem('edit_stepThree')
      this.$router.push({ path: '/newcheckIn/addPage', query: { id: row.id } })
    },
    initable() {
      const data = {
        airportId: this.airport.airportId
      }
      queryList(data)
        .then((response) => {
          this.showTable = response.data.data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    linktoDetail(data) {
      this.$router.push({ path: '/newcheckIn/details', query: { id: data.id } })
    }
  }
}
</script>

<style scoped>
.el-table /deep/ td,
.el-table /deep/ th {
  padding-left: 10px;
}
.filter-container {
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
