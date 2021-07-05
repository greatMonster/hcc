<template>
  <div class="rtm">
    <h4>进港航班</h4>
    <el-table :data="tableData" :span-method="objectSpanMethod" border stripe>
      <el-table-column prop="inOutType" label="航班类型" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.inOutType==1">进港航班</span>
          <span v-else>出港航班</span>
        </template>
      </el-table-column>
      <el-table-column prop="busType" label="车辆类型">
        <template slot-scope="scope">
          <span v-if="scope.row.busType=='BIG'">大摆渡</span>
          <span v-else>其他车辆</span>
        </template>
      </el-table-column>
      <el-table-column prop="busOrder" label="发车车次" />
      <el-table-column prop="inplace" label="到位时间">
        <template slot-scope="scope">
          STA
          <el-input-number v-model="scope.row.inplace" size="mini" @change="handleChange(scope.row)" />分钟
        </template>
      </el-table-column>
      <el-table-column prop="depart" label="发车时间">
        <template slot-scope="scope">
          STA
          <el-input-number v-model="scope.row.depart" size="mini" @change="handleChange(scope.row)" />分钟
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <p>
            发车时间
            <el-input v-model="scope.row.endParamOne" style="width:50px" size="mini" @change="handleChange(scope.row)" />×
            路程时间
            <el-input v-model="scope.row.endParamTwo" style="width:50px" size="mini" @change="handleChange(scope.row)" />分钟
          </p>
        </template>
      </el-table-column>
    </el-table>
    <h4>出港航班</h4>
    <el-table :data="tableData2" :span-method="objectSpanMethod2" border stripe>
      <el-table-column prop="inOutType" label="航班类型" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.inOutType==1">进港航班</span>
          <span v-else>出港航班</span>
        </template>
      </el-table-column>
      <el-table-column prop="busType" label="车辆类型">
        <template slot-scope="scope">
          <span v-if="scope.row.busType=='BIG'">大摆渡</span>
          <span v-else>其他车辆</span>
        </template>
      </el-table-column>
      <el-table-column prop="busOrder" label="发车车次" />
      <el-table-column prop="inplace" label="到位时间">
        <template slot-scope="scope">
          STD
          <el-input-number v-model="scope.row.inplace" size="mini" @change="handleChange(scope.row)" />分钟
        </template>
      </el-table-column>
      <el-table-column prop="depart" label="发车时间">
        <template slot-scope="scope">
          STD
          <el-input-number v-model="scope.row.depart" size="mini" @change="handleChange(scope.row)" />分钟
        </template>
      </el-table-column>
      <el-table-column prop="busCondition" label="该车型出车总数" />
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <p>
            发车时间
            <el-input v-model="scope.row.endParamOne" style="width:50px" size="mini" @change="handleChange(scope.row)" />×
            路程时间
            <el-input v-model="scope.row.endParamTwo" style="width:50px" size="mini" @change="handleChange(scope.row)" />分钟
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRuleParam, updateRuleParam } from '@/api/busRules'
export default {
  name: 'ShuttleBustandard',
  data() {
    return {
      tableData: [],
      tableData2: []
    }
  },
  watch: {},
  created: function() {
    this.init()
  },
  methods: {
    init() {
      getRuleParam().then(response => {
        this.tableData = []
        response.data.forEach(element => {
          if (element.inOutType === 1) {
            this.tableData.push(element)
          } else if (element.inOutType === 2) {
            this.tableData2.push(element)
          }
        })
      })
    },
    handleChange(item) {
      var data = {
        id: item.id,
        inplace: item.inplace,
        depart: item.depart,
        endParamOne: item.endParamOne,
        endParamTwo: item.endParamTwo,
        inOutType: item.inOutType
      }
      updateRuleParam(data).then(response => {
        this.init()
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 7 === 0) {
          return {
            rowspan: 7,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 1) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 5) {
        if (rowIndex % 7 === 0) {
          return {
            rowspan: 7,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 6) {
        if (rowIndex % 21 === 0) {
          return {
            rowspan: 21,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rtm {
  padding: 50px 5px;
  h4 {
    background: #151c3a;
    padding: 10px;
    margin-bottom: 5px;
  }
  .el-table {
    margin-top: 0 !important;
  }
  .el-input-number--mini {
    width: 100px;
  }
}
</style>
