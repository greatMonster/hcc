<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>关联业务</div>
      </div>
      <!-- <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>-->
    </div>

    <div class="skillShow">
      <el-table :data="correlationTable" border stripe>
        <el-table-column prop="carrierName" label="航司名称" />
        <el-table-column v-for="(item, index) in columns" :key="index" :label="item.name">
          <template slot-scope="scope">
            <!-- <div v-if="scope.column.id != 'el-table_1_column_1'"> -->
            <el-checkbox :checked="scope.row.business[index].checked" @change="((val) => isUsed(val,scope.row,index))">启用</el-checkbox>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { initCorrelationTable, isUsed } from '@/api/organization'
export default {
  name: 'Orgnization',
  data() {
    return {
      correlationTable: [],
      columns: []
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      initCorrelationTable().then(response => {
        this.correlationTable = response.data.correlationTable
        this.columns = response.data.columns.label
      })
    },
    isUsed(value, row, index) {
      var data = {
        carrierId: row.carrierId,
        businessCode: this.columns[index].id,
        label: value
      }
      isUsed(data).then(response => {
        if (response.code === '200') {
          this.$message.success('操作成功！')
          this.initTable()
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>
<style>
.el-dialog {
  min-width: 900px;
}
</style>

<style scoped>
form {
  margin-top: 20px;
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
  font-size: 16px;
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
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
