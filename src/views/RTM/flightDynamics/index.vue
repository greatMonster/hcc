<template>
  <div v-title class="header_home user_reg" :data-title="browserTitle">
    <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="add-user" size="small">
          <el-form-item label="航班开始日期">
            <el-date-picker v-model="listQuery.flightDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="selectData()" />
          </el-form-item>
          <el-form-item label="航班结束日期">
            <el-date-picker v-model="listQuery.flightEndDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="selectData()" />
          </el-form-item>
          <el-form-item label="承运人" prop="carrier">
            <el-select v-model="listQuery.carrier" filterable placeholder="请选择" :filter-method="filterFCN">
              <el-option v-for="(item, index) in carrierOptions" :key="index" :label="item.name" :value="item.code">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 5%">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="承运人" prop="carrier">
            <el-select v-model="listQuery.carrier" placeholder="请选择" filterable :filter-method="filterFCN">
              <el-option v-for="(item,i) in carrierOptions" :key="i" :label="item.name" :value="item.code">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="出发航站">
            <el-select v-model="listQuery.planDeptAirport" filterable clearable style="width: 140px">
              <el-option v-for="item in planDeptAirport" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="到达航站">
            <el-select v-model="listQuery.planArrAirport" filterable clearable style="width: 140px">
              <el-option v-for="item in planArrAirport" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="远近机位">
            <el-select v-model="listQuery.positionFlag" filterable clearable style="width: 140px">
              <el-option v-for="item in positionFlagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="机型">
            <el-select v-model="listQuery.actype" filterable clearable style="width: 140px">
              <el-option v-for="item in acTypeOptions" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.flightStatus" clearable style="width: 140px">
              <el-option v-for="item in takeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="国际/国内">
            <el-select v-model="listQuery.intlFlag" clearable style="width: 140px">
              <el-option v-for="item in intlFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="航班性质">
            <el-select v-model="listQuery.flightNatureCode" filterable clearable style="width: 140px">
              <el-option v-for="item in attributOptions" :key="item.caacCode" :label="item.flightNatureName" :value="item.caacCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="航班号">
            <el-input v-model="listQuery.flightNo" size="small" style="width: 140px" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="sechData()">查 询</el-button>
            <BulkImport
              v-loading.fullscreen.lock="fullscreenLoading"
              class="filter-top-item"
              element-loading-text="正在导入"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :post-url="postUrl"
              style="display: inline-block"
              :headers-data="headersData"
              @refreshData="sechData"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border stripe height="580">
        <el-table-column v-if="tableData.length == 0 ? false : true" type="index" width="50" label="序号" sortable="custom" />

        <el-table-column v-for="(item2, index2) in tableTitle" :key="index2" :label="item2" min-width="120">
          <template slot-scope="scope">
            <span v-if="item2 == '国际国内'">{{ scope.row[item2] | formatDate }}</span>
            <span v-else-if="item2 == '航班日期'">{{ scope.row[item2] | joinTime }}</span>
            <span v-else-if="item2 == '计划到达时刻'">{{ scope.row[item2] | joinTime2 }}</span>
            <span v-else-if="item2 == '计划起飞时刻'">{{ scope.row[item2] | joinTime2 }}</span>
            <span v-else-if="item2 == '计飞站'">
              <el-popover placement="top-start" trigger="hover">
                <span style="width: auto">{{ scope.row[item2] ? scope.row[item2].name : '' }}</span>
                <span slot="reference">{{ scope.row[item2] ? scope.row[item2].code : '' }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2 == '承运人'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2].name }}</span>
                <span slot="reference">{{ scope.row[item2].code }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2 == '航班类型'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2] == 'A' ? '进港' : '出港' }}</span>
                <span slot="reference">{{ scope.row[item2] }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2 == '计到站'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2] ? scope.row[item2].name : '' }}</span>
                <span slot="reference">{{ scope.row[item2] ? scope.row[item2].code : '' }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2 == '实到站'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2] ? scope.row[item2].name : '' }}</span>
                <span slot="reference">{{ scope.row[item2] ? scope.row[item2].code : '' }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2 == '实飞站'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2] ? scope.row[item2].name : '' }}</span>
                <span slot="reference">{{ scope.row[item2] ? scope.row[item2].code : '' }}</span>
              </el-popover>
            </span>
            <span v-else>{{ scope.row[item2] }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="航班id" label="航班id" />
        <el-table-column fixed="right" width="100" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" style="width: 60px; height: 30px" @click="editClick(scope.$index, scope.row)">编 辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; flex-direction: row-reverse">
        <el-pagination background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        <span style="margin: 20px; line-height: 30px"> 靠桥率：{{ bridgeRatio }} </span>
      </div>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAdditem" title="属性编辑">
      <el-form ref="form" :model="attributeData" :inline="true">
        <el-form-item v-for="(item, index) in attributeData.data" :key="item.attributeCode" :prop="'data.' + index + '.value'" :label="item.attributeName">
          <div v-if="item.isLookup === true">
            <el-select v-model="item.value" filterable style="width: 200px">
              <el-option v-for="(itm, i) in item.typeValues" :key="i" :label="itm.key" :value="itm.value" />
            </el-select>
          </div>
          <div v-else>
            <el-input v-if="item.attributeType === 'INT'" v-model.number="item.value" placeholder="请输入正确信息" style="width: 200px" />
            <el-input v-if="item.attributeType === 'STRING'" v-model="item.value" placeholder="请输入正确信息" style="width: 200px" />
            <el-date-picker v-if="item.attributeType === 'DATE'" v-model="item.value" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 200px" />
            <el-time-picker v-if="item.attributeType === 'DATETIME'" v-model="item.value" placeholder="选择时间" style="width: 200px" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="dialogAdditem = false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitem('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import BulkImport from '@/components/BulkImport/indexLoding2' // 导入
import { initData, selectData, attributOptionsFcn, attributeFcn, SaveAttributeFcn, filterDataFCN } from '@/api/flightDynamics'
import { mapGetters } from 'vuex'
export default {
  components: {
    BulkImport
  },
  filters: {
    formatDate(val) {
      if (val === 'I') {
        return '国际'
      } else if (val === 'D') {
        return '国内'
      }
    },
    joinTime(val) {
      if (val) {
        return val.slice(0, 10)
      }
    },
    joinTime2(val) {
      if (val) {
        return val.slice(11, 16)
      }
    }
  },
  data() {
    return {
      positionFlagOptions: [
        { id: 1, name: '远机位' },
        { id: 2, name: '近机位' }
      ],
      airport: this.$store.state.user.airport,
      fullscreenLoading: false,
      browserTitle: sessionStorage.getItem('browserTitle'),
      visible2: false,
      page: {
        pageSize: 20,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      dialogAdditem: false,
      attributOptions: [],
      bridgeRatio: '0%',
      typeId: '',
      listQuery: {
        carrier: '',
        flightDate: '',
        flightNo: '',
        intlFlag: '',
        flightNatureCode: '',
        flightEndDate: '',
        planDeptAirport: '',
        planArrAirport: '',
        actype: '',
        flightStatus: ''
      },
      headersData: {
        Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
      },
      flightID: '',
      intlFlagOptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' }
      ],
      takeOptions: [
        { label: '全部', value: '' },
        { label: '首发', value: '1' },
        { label: '航后', value: '2' },
        { label: '过站', value: '3' }
      ],
      optionData: [],
      postUrl: `${process.env.VUE_APP_BASE_API}` + 'api/v1/rtm/RtFlightDynamicImport/importFlightDynamic',
      acTypeOptions: [],
      carrierOptions: [],
      planArrAirport: [],
      planDeptAirport: [],
      tableData: [],
      chargingform: {},
      tableTitle: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季', '国际/国内', '是否过站', '班期', '机号', '机位'],
      tableTitle2: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季', '国际/国内', '是否过站', '班期', '机号', '机位'],
      attributeData: {
        data: []
      }
    }
  },
  computed: {
    ...mapGetters(['router'])
  },

  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.$router.push('/')
      }
    }
  },
  created() {
    var now = new Date()
    var monthValue = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
    var dayValue = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    this.listQuery.flightDate = now.getFullYear() + '-' + monthValue + '-' + dayValue
    this.listQuery.flightEndDate = now.getFullYear() + '-' + monthValue + '-' + dayValue
    attributOptionsFcn(true).then((res) => {
      if (res.data.code === '200') {
        this.attributOptions = res.data.data
      }
    })
    this.sechData()
    this.selectData()
  },
  methods: {
    selectData() {
      var data = {
        startDate: this.listQuery.flightDate || '',
        endDate: this.listQuery.flightEndDate || '',
        airportId: this.airport.airportId || ''
      }
      selectData(data).then((response) => {
        this.bridgeRatio = response.data.bridgeRatio
        this.acTypeOptions = response.data.acTypeList
        this.carrierOptions = response.data.carrierList
        this.planArrAirport = response.data.planArrAirportList
        this.planDeptAirport = response.data.planDeptAirportList
      })
    },
    sechData() {
      // debugger
      this.tableData = []
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.pageNum = this.page.pageNum
      this.listQuery.airportId = this.airport.airportId
      initData(this.listQuery).then(response => {
        if (response.data) {
          this.page.total = response.data.total
          this.tableData = response.data.list
          this.tableTitle = []
          if (this.tableData.length !== 0) {
            this.tableData.forEach((element) => {
              //   delete element.航班id
              this.tableTitle = Object.keys(element)
            })
            this.tableTitle.forEach((itm, i) => {
              if (itm === '航班id') {
                this.tableTitle.splice(i, 1)
              }
            })
          } else {
            this.$message.success('暂无数据')
          }
        }
      })
    },
    filterFCN(val) {
      var data2 = {
        startDate: this.listQuery.flightDate,
        endDate: this.listQuery.flightEndDate,
        nameOrCode: val
      }
      this.listQuery.carrier = val
      filterDataFCN(data2).then((res) => {
        this.carrierOptions = res.data.data
      })
    },
    handleAddClickitem(formName) {
      var data = {}
      this.attributeData.data.forEach((item) => {
        this.$set(data, item.attributeCode, item.value)
      })
      data.id = this.flightID
      SaveAttributeFcn(data).then((res) => {
        if (res.data.code === '200') {
          this.$message.success(res.data.message)
          this.dialogAdditem = false
          this.sechData()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    editClick(index, data) {
      this.flightID = data.航班id
      attributeFcn(data.航班id).then((res) => {
        this.attributeData.data = res.data.data
      })
      this.dialogAdditem = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.sechData()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.sechData()
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  margin-bottom: 2px;
  margin-top: 70px;
  background: #172449;
  padding: 10px;
}
.add-user {
  background: rgb(23, 36, 73);
  width: 100%;
  padding: 6px 0 0 20px;
  .el-form-item__label {
    width: 100px;
    padding-right: 8px;
  }
  .el-button {
    margin: 0 6px;
  }
  span {
    padding-left: 10px;
  }
  .el-form {
    .el-input {
      width: 140px;
      margin: 5px 0;
    }

    .el-select {
      width: 140px;
      margin: 5px 0;
    }
  }
}
</style>

