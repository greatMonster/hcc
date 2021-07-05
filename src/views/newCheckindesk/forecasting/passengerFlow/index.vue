<template>
  <div class="user-box">
    <div class="title">
      <span style="margin-right: 10px">旅客流量</span>
    </div>
    <div class="add-user">
      <div>
        <el-button type="primary" size="small" @click="searchData1('formDeskEdit')">刷 新</el-button>
        <el-button type="primary" size="small" @click="addData('formDeskEdit')">新 增</el-button>
      </div>
    </div>
    <el-table :data="tableData" highlight-current-row border stripe>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <span class="fileName" @click="openNext(scope.$index, scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="airportName" label="机场" />
      <el-table-column prop="flightName" label="航班计划" min-width="180" />
      <el-table-column prop="beginDate" label="开始与结束时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.beginDate }} - {{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="region" label="国内/国际" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.region | filterData }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carriers" label="承运人" min-width="180">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}&nbsp;&nbsp;</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="高端/经济" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceType | filterData2 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="distributionType" label="流量模式" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.distributionType | filterData3 }}</span>
        </template>
      </el-table-column>-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.trafficType === 1" type="primary" size="mini" @click="editData(scope.$index, scope.row)">编 辑</el-button>
          <el-button type="primary" size="mini" @click="deleteData(scope.$index, scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { initData, removeData, carriersData } from '@/api/passengerFlow'
export default {
  name: 'PassengerFlow',
  filters: {
    filterData: function (value) {
      if (value === 'I') {
        return '国际'
      } else if (value === 'D') {
        return '国内'
      } else {
        return '国内/国际'
      }
    },
    filterData2(val) {
      if (val === 'V') {
        return '高端'
      } else if (val === 'C') {
        return '经济'
      } else {
        return '高端/经济'
      }
    },
    filterData3(val) {
      if (val === 'B') {
        return '模式二'
      } else if (val === 'R') {
        return '模式一'
      } else {
        return '混合模式'
      }
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      tableData: []
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.searchData()
        this.select()
      }
    }
  },
  created() {
    this.searchData()
    this.select()
  },
  methods: {
    searchData() {
      const data = {
        airportId: this.airport.airportId
      }
      initData(data).then((response) => {
        if (response.data.code == 200) {
          this.tableData = response.data.data
        }
      })
    },
    searchData1() {
      const data = {
        airportId: this.airport.airportId
      }
      initData(data).then((response) => {
        if (response.data.code == 200) {
          this.tableData = response.data.data
          this.$message.success('刷新成功')
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    addData() {
      this.$router.push({ path: '/newcheckIn/operationPage' })
    },
    editData(index, row) {
      this.$router.push({
        path: '/newcheckIn/operationPage',
        query: { id: row.id, offon: 'edit' }
      })
    },
    deleteData(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeData(row.id).then((response) => {
            if (response.data.code === '200') {
              this.searchData()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.response.data.message
          })
        })
    },
    openNext(index, row) {
      this.$router.push({
        path: '/newcheckIn/detailsPage',
        query: { id: row.id }
      })
    },
    select() {
      const data = {
        airportId: this.airport.airportId,
        nameOrCode: ''
      }
      carriersData(data).then((response) => {
        this.carriersOptions = response.data.data
        sessionStorage.setItem('carriersOptions', JSON.stringify(response.data.data))
      })
    }
  }
}
</script>
<style scoped>
.el-table /deep/ td,
.el-table /deep/ th {
}
</style>
<style lang="scss" scoped>
form {
  margin-top: 10px;
}
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 10px 10px 10px;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px 20px;
  background-color: #263257;
  color: white;
}
.upload-demo {
  margin-left: 20px;
}
.count-box {
  display: inline-block;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  color: white;
  letter-spacing: 2px;
  border-radius: 10px;
}
.count-style {
  color: darkkhaki;
  font-size: 20px;
}
.count-box-gif {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-left: 27%;
}
.count-box-gif img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.add-user {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: left;
  background-color: #232c47;
  div {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
.fileName {
  cursor: pointer;
}
.help-icon {
  font-size: 16px;
  color: #6faee0;
  cursor: pointer;
}
</style>
