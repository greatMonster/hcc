<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-form
          :inline="true"
          :model="listQuery"
          class="add-user"
          size="small"
        >
          <el-form-item label="航班号" :label-width="formLabelWidth">
            <el-input v-model="listQuery.flightNo" />
          </el-form-item>
          <!-- <el-form-item label="承运人">
            <el-input v-model="listQuery.carrier" />
          </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="sechData()"
            >查 询</el-button>
            <el-button
              v-if="type=='manager'"
              type="primary"
              size="small"
              @click="securityLevelFcn()"
            >保障等级</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="statusNav">
          <el-switch
            v-model="flightType"
            class="statusLeft"
            active-text="我的航班"
            inactive-text="所有航班"
            @change="flightTypeFcn"
          />
          <div class="statusRight">
            <span
              :class="{ active: shows == '1' }"
              @click="finishFtn"
            >已完成 ({{ completed||0 }})</span>
            <span
              :class="{ active: shows == '2' }"
              @click="immatureFtn"
            >未完成 ({{ undone||0 }})</span>
          </div>
        </div>
        <div />
      </div>
      <div class="navBot" style="display:flex;justify-content: space-between;width:100%;padding: 0 10px">
        <span />
        <span @click="dataClick"><i class="el-icon-s-operation" style="font-size: 22px;" /></span>
      </div>
      <el-table :data="tableData" style="width: 100%" height="650" :row-class-name="tableRowClassName">>
        <el-table-column width="30">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.warning" class="item" effect="dark" placement="top" content="任务预警" popper-class="draw_atooltip">
              <span style="color:red">●</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="35">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.ensureLevel" class="item" effect="dark" placement="top" content="保障等级" popper-class="draw_atooltip2">
              <span style="background:yellow;color:#000">{{ scope.row.ensureLevel }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="30">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.special" class="item" effect="dark" placement="top" content="轮椅服务" popper-class="draw_atooltip2">
              <span style="color:green">特</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <span v-if="scope.row.guest" style="color:yellow">vip</span>
          </template>
        </el-table-column>

        <el-table-column prop="flightNo" label="航班号">
          <template slot-scope="scope">
            <span style="text-decoration:underline;cursor:pointer;" @click="openNext(scope.row)">
              {{ scope.row.flightNo }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="acType" label="机型" />
        <el-table-column prop="acPos" label="机位" />
        <el-table-column prop="tailNo" label="机号" />
        <el-table-column prop="flightSTD" label="计划起飞时间" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.flightSTD?scope.row.flightSTD.slice(10,16):'' }}
          </template>
        </el-table-column>
        <el-table-column prop="flightETD" label="预计起飞时间" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.flightETD?scope.row.flightETD.slice(10,16):'' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="关联航班" min-width="200">
          <template slot-scope="scope">
            <span :class="{active:scope.row.linkedFlightDelay}">
              {{ scope.row.linkFlightNoETD }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="passengerNum">
          <template slot="header">
            <span>
              旅客
            </span>
            <el-tooltip content="旅客（订座/值机）" placement="top">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="baggageNum" label="行李(件)" min-width="90" />
        <el-table-column prop="guestNum" label="VIP" />
        <el-table-column prop="delay" label="延误原因" />
        <el-table-column v-for="(item,i) in show" :key="i" prop="item" :label="item">
          <template slot-scope="scope">
            {{ scope.row.result[i] }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" @mouseout="selectStyle2(scope.row.flightId)">
          <template slot-scope="scope">
            <div @mouseenter="selectStyle(scope.row.flightId)">
              {{ scope.row.remark||'无' }}
              <i
                v-show="falg == scope.row.flightId"
                class="el-icon-edit"
                @click="handClick(scope.row )"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      <!-- 添加备注对话框 -->
      <div>
        <el-dialog
          v-dialogDrag
          title="添加备注"
          :visible.sync="dialogRemarksVisible"
        >
          <el-form :model="formRemarks">
            <el-form-item label="添加备注：">
              <el-input
                v-model="formRemarks.textarea"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRemarksVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRemarksConfirmClick">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 保障等级 -->
      <div>
        <el-dialog v-dialogDrag title="调整保障等级" :visible.sync="dialogSecurityVisible">
          <el-form ref="formSecurity" :model="formSecurity" :rules="formRules">
            <el-form-item label="保障等级：" prop="ensureLevel">
              <el-select v-model="formSecurity.ensureLevel" filterable placeholder="请选择" @change="leavelDataFcn">
                <el-option v-for="item in LevelOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间：" prop="beginTime">
              <el-time-picker v-model="formSecurity.beginTime" placeholder="请选择时间" value-format="HH:mm" format="HH:mm" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSecurityVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSecurityClick">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog
          v-dialogDrag
          title="选择业务节点"
          :visible.sync="chekboxVisible"
        >
          <div style="width:80%;margin:0 auto;">
            <el-checkbox-group v-model="businessDATA" style="display:flex">
              <el-checkbox v-for=" (item) in business" :key="item.businessDomainId" :label="item.businessDomainId" :checked="item.choose">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="chekboxVisible = false">取 消</el-button>
            <el-button type="primary" @click="chekboxVisibleClick">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>

import { initTable, businessData, editBusinessData, editRemark, leavelData, EditleavelData } from '@/api/earlyWarning'
export default {
  data() {
    return {
      chekboxVisible: false,
      flightType: false,
      dialogRemarksVisible: false,
      dialogSecurityVisible: false,
      undone: '0',
      completed: '0',
      taskType: false,
      type: this.$route.query.type,
      shows: '2',
      falg: '',
      LevelOptions: ['1', '2', '3', '4'],
      formSecurity: {
        ensureLevel: '1',
        beginTime: ''
      },
      formRules: {
        ensureLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        beginTime: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      flightId: '',
      business: [],
      businessDATA: [],
      show: [],
      formLabelWidth: '66px',
      checkList: [],
      page: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      listQuery: {
        carrier: '',
        flightNo: ''
      },
      formRemarks: {
        textarea: ''
      },
      // eslint-disable-next-line no-sparse-arrays
      tableData: [],
      airport: this.$store.state.user.airport
    }
  },
  computed: {},
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
      }

    }
  },
  created() {
    this.init()
    this.leavelDataFcn()
  },
  methods: {
    init() {
      this.listQuery.flightType = this.flightType
      this.listQuery.taskType = this.taskType
      this.listQuery.airportId = this.airport.airportId
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.pageNum = this.page.pageNum
      initTable(this.listQuery).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data.bean.hmFlightBeans
          this.show = res.data.data.bean.show
          this.page.total = res.data.data.total
          this.undone = res.data.data.bean.undone
          this.completed = res.data.data.bean.completed
        }
      })
      businessData().then(res => {
        this.business = res.data.data
      })
    },
    sechData() {
      this.listQuery.flightType = this.flightType
      this.listQuery.taskType = this.taskType
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.airportId = this.airport.airportId
      this.listQuery.pageNum = this.page.pageNum
      initTable(this.listQuery).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data.bean.hmFlightBeans
          this.show = res.data.data.bean.show
          this.page.total = res.data.data.total
          this.undone = res.data.data.bean.undone
          this.completed = res.data.data.bean.completed
          this.$message.success('查询成功')
        }
      })
    },
    leavelDataFcn() {
      leavelData(this.formSecurity).then(res => {
        this.formSecurity.beginTime = res.data.data.beginTime
      })
    },
    securityLevelFcn() {
      this.dialogSecurityVisible = true
    },
    addSecurityClick() {
      this.$refs['formSecurity'].validate(valid => {
        if (valid) {
          EditleavelData(this.formSecurity).then(res => {
            if (res.data.code === '200') {
              this.$message.success(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
            this.dialogSecurityVisible = false
          })
        }
      })
    },
    tableRowClassName({ row }) {
      if (row.executionStatus === 'true') {
        return 'warning-row'
      }
    },

    finishFtn() {
      this.shows = '1'
      this.taskType = true
      this.listQuery.flightType = this.flightType
      this.listQuery.airportId = this.airport.airportId
      this.listQuery.taskType = this.taskType
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.pageNum = this.page.pageNum
      initTable(this.listQuery).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data.bean.hmFlightBeans
          this.show = res.data.data.bean.show
          this.page.total = res.data.data.total
          this.undone = res.data.data.bean.undone
          this.completed = res.data.data.bean.completed
        }
      })
    },
    immatureFtn() {
      this.shows = '2'
      this.taskType = false
      this.listQuery.flightType = this.flightType
      this.listQuery.taskType = this.taskType
      this.listQuery.airportId = this.airport.airportId
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.pageNum = this.page.pageNum
      initTable(this.listQuery).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data.bean.hmFlightBeans
          this.show = res.data.data.bean.show
          this.page.total = res.data.data.total
          this.undone = res.data.data.bean.undone
          this.completed = res.data.data.bean.completed
        }
      })
    },
    flightTypeFcn() {
      this.listQuery.flightType = this.flightType
      this.listQuery.taskType = this.taskType
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.airportId = this.airport.airportId
      this.listQuery.pageNum = this.page.pageNum
      initTable(this.listQuery).then(res => {
        if (res.data.code === '200') {
          this.tableData = res.data.data.bean.hmFlightBeans
          this.show = res.data.data.bean.show
          this.page.total = res.data.data.total
          this.undone = res.data.data.bean.undone
          this.completed = res.data.data.bean.completed
        }
      })
    },
    selectStyle(data) {
      this.falg = data
    },
    selectStyle2() {
      this.falg = ''
    },
    handClick(data) {
      this.dialogRemarksVisible = true
      this.formRemarks.textarea = data.remark
      this.flightId = data.flightId
    },
    addRemarksConfirmClick() {
      var data = {
        remark: this.formRemarks.textarea,
        flightId: this.flightId
      }
      editRemark(data).then(res => {
        if (res.data.code === '200') {
          this.$message.success('修改成功')
          this.init()
        }
      })

      this.dialogRemarksVisible = false
    },
    dataClick() {
      this.chekboxVisible = true
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.init()
    },
    chekboxVisibleClick() {
      editBusinessData(this.businessDATA).then(res => {
        if (res.data.code === '200') {
          this.$message.success('修改成功')
          this.init()
        }
      })

      this.chekboxVisible = false
    },
    openNext(data) {
      this.$router.push({ path: '/hubManager/details', query: { flightId: data.flightId, flightNo: data.flightNo }})
    }
  }
}
</script>
<style >
.statusNav /deep/ .el-switch__label {
  font-size: 17px;
}
  .el-table .warning-row {
    background:orangered;
  }
 .draw_atooltip2.el-tooltip__popper[x-placement^='top'] .popper__arrow::after {
      border-top-color: green;
      opacity: 0.8;
    }

 .draw_atooltip2.el-tooltip__popper[x-placement^='top'] .popper__arrow{
  border-top-color: green;
  opacity: 0.8;

}
.active{
   color:yellow
}
.draw_atooltip2{
        width: 100px!important;
    height: 50px!important;
    text-align: center;
    font: 18px/25px '';
    background: green !important;
      opacity: 0.8;
}
 .draw_atooltip.el-tooltip__popper[x-placement^='top'] .popper__arrow::after {
      border-top-color: red;
      opacity: 0.8;
    }

 .draw_atooltip.el-tooltip__popper[x-placement^='top'] .popper__arrow{
  border-top-color: red;
  opacity: 0.8;

}
.draw_atooltip{
    width: 100px!important;
    height: 50px!important;
    text-align: center;
    font: 18px/25px '';
    background: red !important;
      opacity: 0.8;
}
</style>
<style lang="scss" scoped>
.statusNav {
  font: 500 16px/30px "";
  display: flex;
  justify-content: space-between;

  .statusLeft {
    height: 30px;
  }
.navBot{
    display: flex;
    justify-content: space-between;
}
  .statusRight {
    .active {
      border-bottom: orangered 2px solid;
    }
    span {
      cursor: pointer;
      margin-bottom: 5px;
      display: inline-block;
      width: 100px;
      margin-right: 5px;
    }
  }
}

.filter-container {
  margin-bottom: 2px;
  margin-top: 70px;

  padding: 10px;
}
.add-user {
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
