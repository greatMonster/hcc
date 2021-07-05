<template>
  <div>
    <el-card class="box-card">
      <div class="title">查询面板</div>
      <el-form :inline="true" :model="listQuery" class="add-user" size="small">
        <!-- <el-form-item label="机场">
          <el-select v-model="listQuery.airportId" filterable disabled clearable style="width: 140px">
            <el-option v-for="item in planDeptAirport" :key="item.id" :label="item.name" :value="item.id + ''" />
          </el-select> -->
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="listQuery.name" placeholder clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="航班计划">
          <el-select v-model="listQuery.flightScheduleId" filterable clearable style="width: 140px">
            <el-option v-for="item in planOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分布模式">
          <el-select v-model="listQuery.distributionType" filterable clearable style="width: 140px">
            <el-option v-for="item in disoptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="sechData()">查 询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="title">旅客流量列表</div>
      <el-table ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" @select="rowSelect">
        <el-table-column type="selection" label="全选" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="airportName" label="机场" />
        <el-table-column prop="flightName" label="航班计划" />
        <el-table-column prop="startTime" label="开始与结束日期" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.beginDate ? scope.row.beginDate.substring(0, 10) : '' }} ~ {{ scope.row.endDate ? scope.row.endDate.substring(0, 10) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="国内/国际">
          <template slot-scope="scope">
            <div v-if="scope.row.region">
              <span v-if="scope.row.region == 'D'">国内</span>
              <span v-if="scope.row.region == 'I'">国际</span>
              <span v-if="scope.row.region == 'D/I'">国内/国际</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="carriers" label="承运人">
          <template slot-scope="scope">
            <!-- {{ scope.row.carriers.toString() }} -->
            <div v-if="scope.row.carriers">
              <div v-if="scope.row.carriers.length > 1">
                <el-popover trigger="hover" placement="right" width="150">
                  <p style="overflow: auto; height: 100px; word-break: break-word">
                    <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}&nbsp;&nbsp;</span>
                  </p>
                  <div slot="reference">
                    <span>{{ scope.row.carriers[0] }}...</span>
                  </div>
                </el-popover>
              </div>
              <div v-else>
                <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceType" label="高端/经济" />
        <el-table-column prop="distributionType" label="分布模式">
          <template slot-scope="scope">
            <span v-if="scope.row.distributionType == 'B'">二项分布</span>
            <span v-else-if="scope.row.distributionType == 'R'">平均分布</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div class="title">
        <el-button type="primary" size="mini" @click="editHandleClick()">预 览</el-button>
      </div>
      <div v-loading="listLoading" class="runtime-bottom">
        <div v-for="(item, i) in lineChartData" :key="i" class="item" @click="showEchart(item)">
          <p>{{ item.date }}</p>
          <line-chart :chart-data="item" />
        </div>
      </div>
    </el-card>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag title="旅客流量分布图表" :visible.sync="dialogTableVisible" :before-close="closeImport">
      <h3 style="margin-top: 0">{{ lineChartDataBig.date }}</h3>
      <LineChart :chart-data="lineChartDataBig" style="width: 100%; height: 400px" />
    </el-dialog>
    <el-dialog v-dialogDrag title="粒度选择" width="50%" :visible.sync="dialogVisible" center>
      <el-select v-model="interval" placeholder="请选择" style="margin-left: 100px">
        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusbtnClick()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { airports, flightPlan, search, mergerResult } from '@/apiNew/checkInData'
import LineChart from '@/components/echarts/LineChartNew'
export default {
  name: 'StepThree',
  components: { LineChart },
  data() {
    return {
      airport: this.$store.state.user.airport,
      interval: '5',
      dialogVisible: false,
      sizeOptions: [
        {
          name: '5分钟',
          value: '5'
        },
        {
          name: '30分钟',
          value: '30'
        },
        {
          name: '60分钟',
          value: '60'
        }
      ],
      storageData: JSON.parse(localStorage.getItem('stepThree')),
      disabled: true,
      routerId: this.$route.query.id,
      disoptions: [
        { name: '二项分布', id: 'B' },
        { name: '平均分布', id: 'R' }
      ],
      planOptions: [],
      dialogTableVisible: false,
      listLoading: false,
      lineChartDataBig: {},
      lineChartData: [],
      value: [1],
      listQuery: {
        airportId: '',
        name: '',
        flightScheduleId: '',
        distributionType: ''
      },
      tableData: [],
      planDeptAirport: [],
      formEdit: {},
      formLabelWidth: '30%',
      flowIds: []
    }
  },
  created() {
    this.initAirports()
    this.initPlanOptions()
    if (this.$route.query.id) {
      this.datas = JSON.parse(localStorage.getItem('detailList'))
      this.tableData = this.datas.traffics
    } else {
      if (this.storageData) {
        this.tableData = this.storageData.tableData
      }
    }
    this.listQuery.airportId = localStorage.getItem('airportId')
    this.sechData()
  },
  methods: {
    statusbtnClick() {
      this.mergerResult(this.flowIds.toString())
    },
    sechData() {
      this.listQuery.airportId = this.airport.airportId
      search(this.listQuery).then((response) => {
        this.tableData = response.data.data
      })
    },
    initAirports(data) {
      airports(false).then((response) => {
        this.planDeptAirport = response.data.data
      })
    },
    initPlanOptions() {
      const data = {
        airportId: this.airport.airportId
      }
      flightPlan(data).then((response) => {
        this.planOptions = response.data.data
      })
    },
    rowSelect(rows, row) {
      // console.log(rows, rows.length && rows.indexOf(row) !== -1, '选择某行时')
      const checked = rows.length && rows.indexOf(row) !== -1
      if (checked) {
        const firstTime = rows[0].beginDate + rows[0].endDate
        const selectedTime = row.beginDate + row.endDate
        this.flowIds = []
        if (firstTime === selectedTime) {
          rows.forEach((element) => {
            this.flowIds.push(element.id)
          })
        } else {
          this.$message({
            type: 'warning',
            message: '当前所选旅客流量和已勾选数据的开始结束日期不一致，请重新勾选'
          })
          this.$refs.multipleTable.toggleRowSelection(row, false)
          rows.pop()
          this.flowIds = []
          rows.forEach((element) => {
            this.flowIds.push(element.id)
          })
        }
      } else {
        // rows.pop()
        this.flowIds = []
        rows.forEach((element) => {
          this.flowIds.push(element.id)
        })
      }
      // console.log(this.flowIds, '已选id')
    },
    handleSelectionChange(item) {
      let icount = 0
      if (item.length === this.tableData.length) {
        this.flowIds = []
        const firstTime = item[0].beginDate + item[0].endDate
        for (let i = 1; i < item.length; i++) {
          const selectedTime = item[i].beginDate + item[i].endDate
          if (firstTime !== selectedTime) {
            this.$message.error('所选旅客流量起止日期不一致，请重新选择')
            icount++
            break
          }
        }
        if (icount === 0) {
          item.forEach((element) => {
            this.flowIds.push(element.id)
          })
        } else {
          for (let j = 0; j < item.length; j++) {
            this.$refs.multipleTable.toggleRowSelection(item[j], false)
          }
        }
      }
    },
    editHandleClick() {
      this.dialogVisible = true
      // this.mergerResult(this.flowIds.toString())
    },
    mergerResult(val) {
      this.lineChartData = []
      this.dialogVisible = false
      // 合成图片
      console.log(val, 'val')
      if (val) {
        this.listLoading = true
        var data = {
          flowIds: val,
          interval: this.interval,
          airportId: this.airport.airportId
        }
        mergerResult(data)
          .then((response) => {
            this.listLoading = false
            if (response.data.code === '200') {
              const data = response.data.data.daily
              this.lineChartData = []
              data.forEach((element) => {
                const dataX = []
                const dataY = []
                this.lineChartData.push({
                  date: element.date,
                  details: {
                    maxY: response.data.data.maxY,
                    maxFlow: element.maxFlow,
                    dataX: dataX,
                    dataY: dataY,
                    date: element.date,
                    name: '旅客流量'
                  }
                })
                element.details.forEach((item) => {
                  dataX.push(item.time.substring(10, 16))
                  dataY.push(item.number)
                })
              })
            }
          })
          .catch((e) => {
            this.listLoading = false
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else {
        this.$message.warning('请选择正确的旅客流量')
      }
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeImport() {
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
    }
  }
}
</script>
<style>
.el-table /deep/ td,
.el-table /deep/ th {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.el-form {
  margin: auto;
  .el-input,
  .el-select {
    width: 40%;
  }
}
.item {
  display: inline-block;
}
</style>
