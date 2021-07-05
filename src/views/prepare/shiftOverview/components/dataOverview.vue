<template>
  <div>
    <div class="condition-select">
      <el-form ref="formSelect" :inline="true" :model="formSelect" class="demo-form-inline" size="small">
        <!-- <el-form-item label="时间：">
          <el-date-picker
            v-model="formSelect.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="|"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>-->
        <el-form-item prop="realSite" label="站点" class="select">
          <el-select v-model="formSelect.realSite" filterable clearable placeholder="请选择">
            <el-option v-for="item in optionsRealSite" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="restStatus" label="只显示与基线不同" class="select">
          <el-select v-model="formSelect.restStatus" filterable clearable placeholder="请选择">
            <el-option v-for="item in optionsRestStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="absenceType" label="缺勤类型：">
          <el-select v-model="formSelect.absenceType" placeholder="请选择" clearable filterable>
            <el-option v-for="item in optionsAbsenceType" :key="item.absenceTypeId" :label="item.absenceName" :value="item.absenceTypeId">
              <span style="float: left">{{ item.absenceName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="shiftType" label="轮班类型" class="select">
          <el-select v-model="formSelect.shiftType" filterable clearable placeholder="请选择">
            <el-option v-for="item in optionsShiftType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色" class="select">
          <el-select v-model="formSelect.role" filterable clearable placeholder="请选择">
            <el-option v-for="item in optionsRole" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
          <el-button size="small" @click="resetForm('formSelect')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-style">
      <div class="header-filter">
        <!-- <div class="recategory">
          <el-button type="primary" @click="setAllBase">设置整体基线</el-button>
        </div>-->
        <!-- <div> -->
        <div class="baseline-style">
          和基线比较
          <el-select v-model="value" size="small" placeholder="请选择" @change="baseLineClick">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="cols">
          <span>
            <ins class="zb" />早班
          </span>
          <span>
            <ins class="zb2" />中班
          </span>
          <span>
            <ins class="wb" />晚班
          </span>
          <span>
            <ins class="xx" />休息
          </span>
          <span>
            <ins class="yb" />夜班
          </span>
          <span>
            <span style="color: #f55f5f;font-size:19px;margin-right:5px">●</span>全天缺勤
          </span>
          <span>
            <span style="color: #f55f5f;margin-right:5px">◐</span>部分缺勤
          </span>
          <span>
            <i class="el-icon-info" style="margin-right:5px" />与基线不同
          </span>
        </div>
        <!-- </div> -->
      </div>
      <el-table v-loading="loading" :data="tableData" :empty-text="emptyText" stripe border :max-height="tableHeight" style="width: 100%" @row-dblclick="showInformationClick">
        <el-table-column sortable type="index" width="50" />
        <el-table-column sortable prop="employeeName" label="姓名" width="110" />
        <el-table-column sortable prop="employeeId" label="编号" />
        <el-table-column sortable prop="roleName" label="角色">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.roleBeanList" :key="index">
              <span>{{ item.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="name" label="技能">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.skillBeanList" :key="index">
              <span>{{ item.skillName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="organizationName" label="组织" />
        <!-- <el-table-column label="排班情况"> -->
        <el-table-column v-for="(item,index) in formThead" :key="index" :label="item.workDate.split(' ')[0]" width="150">
          <template slot-scope="scope">
            <div>
              <el-popover trigger="click" placement="right" width="200">
                <p @click="cellRoleClick(scope.$index,scope.row,scope.column)">查看基线数据</p>
                <p @click="cellRoleClick(scope.$index,scope.row,scope.column)">设置基线</p>
                <div slot="reference" class="all-edit name-wrapper">
                  <!-- <i style="font-size:10px" class="el-icon-edit" @click.stop="open(scope.$index,scope.row)" /> -->
                  <div v-if="scope.row.dailyWorkBeans[index].startTime" :style="{backgroundColor: scope.row.dailyWorkBeans[index].shiftTypeColor}">
                    <i class="el-icon-info" />
                    {{ scope.row.dailyWorkBeans[index].startTime.split(' ')[1].substring(0,5) }} - {{ scope.row.dailyWorkBeans[index].endTime.split(' ')[1].substring(0,5) }}
                    <span v-if="scope.row.dailyWorkBeans[index].absenceCode">
                      <span v-if="scope.row.dailyWorkBeans[index].absenceCode == '1'" style="color: #f55f5f;font-size:5px">◐</span>
                      <span v-else style="color: #f55f5f;font-size:19px">●</span>
                    </span>
                  </div>
                  <div v-else class="rest-style">
                    <i class="el-icon-info" />休息
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :current-page="page.currentPage4"
          :page-sizes="[15, 30, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 员工信息展示dialog -->
    <div>
      <el-dialog v-dialogDrag title="员工信息" :visible.sync="staffInformationDialog">
        <el-form :model="formInformation">
          <el-form-item label="员工姓名：" :label-width="formLabelWidth">
            <el-input v-model="formInformation.name" readonly />
          </el-form-item>
          <el-form-item label="员工编号：" :label-width="formLabelWidth">
            <el-input v-model="formInformation.sku" readonly />
          </el-form-item>
          <el-form-item label="组织：" :label-width="formLabelWidth">
            <el-input v-model="formInformation.orgnization" readonly />
          </el-form-item>
          <el-form-item label="所有技能：" :label-width="formLabelWidth">
            <el-input v-model="formInformation.skill" readonly />
          </el-form-item>
          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-input v-model="formInformation.role" readonly />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="staffInformationDialog = false">取 消</el-button>
          <el-button type="primary" @click="staffInformationDialog = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 设置基线dialog -->
    <div>
      <el-dialog v-dialogDrag title="设置基线" :visible.sync="baselineDialog">
        <el-form ref="baselineForm" :model="baselineForm">
          <el-form-item prop="baselineType" label="请选择基线类型：" :label-width="formLabelWidth">
            <el-select v-model="baselineForm.baselineType" filterable clearable placeholder="请选择">
              <el-option v-for="item in optionsBaselineType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="baselineDialog = false">取 消</el-button>
          <el-button type="primary" @click="baselineConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { searchTable } from '@/api/shiftOverview'
export default {
  name: 'DataOverview',
  data() {
    return {
      airportId: this.$store.state.userInfo.airport.airportId || '',
      page: {
        currentPage4: 1,
        totalCount: 0,
        pageSize: 15
      },
      emptyText: '正在加载',
      tableHeight: window.innerHeight - 360,
      loading: true,
      value: '',
      staffInformationDialog: false,
      dialogFormVisible: false,
      baselineDialog: false,
      formLabelWidth: '180px',
      optionsAbsenceType: [{ absenceTypeId: '1', absenceName: '全天缺勤' }, { absenceTypeId: '2', absenceName: '部分缺勤' }],
      tableData: [],
      options: [
        {
          value: '选项1',
          label: '基线一'
        },
        {
          value: '选项2',
          label: '基线二'
        }
      ],
      formThead: [],
      optionsShiftType: [{ value: '1', label: '早班' }, { value: '2', label: '中班' }, { value: '3', label: '晚班' }, { value: '4', label: '夜班' }, { value: '5', label: '休息' }],
      optionsRole: [{ value: '1', label: '角色1' }, { value: '2', label: '角色2' }, { value: '3', label: '角色三' }],
      optionsRealSite: [{ value: '1', label: '实时站点1' }, { value: '2', label: '实时站点2' }, { value: '3', label: '实时站点三' }],
      optionsRestStatus: [{ value: '1', label: '是' }, { value: '2', label: '否' }],
      optionsBaselineType: [{ value: '1', label: '基线一' }],
      formSelect: { time: [] },
      formInformation: {},
      baselineForm: {}
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable() {
      // init
      // this.tableData = []
      this.formThead = []
      var data = {
        siteId: this.formSelect.realSite || null,
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage4,
        airportId: this.airportId
      }
      searchTable(data).then(response => {
        if (response.code === '200') {
          this.emptyText = '正在加载'
          this.page.totalCount = response.data.total
          if (response.data.list.length) {
            response.data.list[0].dailyWorkBeans.forEach(element => {
              this.formThead.push(element)
            })
            this.tableData = response.data.list
          } else {
            this.emptyText = '暂无数据'
          }
          this.loading = false
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      this.page.currentPage4 = val
      this.initTable()
    },
    setAllBase() {
      this.baselineDialog = true
    },
    baselineConfirm() {
      this.baselineDialog = false
    },
    // 双击行展示员工详细信息
    showInformationClick(row, column) {
      this.formInformation.name = row.name
      this.formInformation.orgnization = row.orgnization
      this.formInformation.skill = row.skill
      this.formInformation.role = row.role
      this.formInformation.sku = row.sku
      this.staffInformationDialog = true
    },
    onSubmit() {
      // var startDate = Date.parse(this.formSelect.time[0].replace('/-/g', '/'))
      // var endDate = Date.parse(this.formSelect.time[1].replace('/-/g', '/'))
      // var diffDate = endDate - startDate + 1 * 24 * 60 * 60 * 1000
      // var days = diffDate / (1 * 24 * 60 * 60 * 1000)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cellRoleClick(index, row, column) {
      this.baselineDialog = true
    },
    baseLineClick(e) {},
    handleBaselineChange(e) {},
    open(index, row) {
      const h = this.$createElement
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '内容可以是 '), h('i', { style: 'color: teal' }, 'VNode')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.baseline-style {
  width: 25%;
}
.el-form-item {
  margin-bottom: 0;
}
.header-filter {
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #434b61;
  font-size: 15px;
}
.name-wrapper {
  cursor: pointer;
}
.condition-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  border-bottom: 1px solid #434b61;
}
.select {
  margin-left: 10px;
}
.table-style {
  margin-top: 15px;
}
.cols {
  display: inline-block;
  text-align: right;
  width: 75%;
  span {
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    margin-right: 20px;
    ins {
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
    }
    ins.zb {
      background: #5677d5;
    }
    ins.zb2 {
      background: #d8a738;
    }
    ins.wb {
      background: #a168ff;
    }
    ins.xx {
      background: #666;
    }
    ins.yb {
      background: #000;
    }
  }
}
.icon-style {
  position: relative;
  width: 24px;
  height: 17px;
  line-height: 13px;
  margin: -8% auto;
  text-align: center;
  box-sizing: border-box;
  padding: 2px;
  background-color: rgb(77, 77, 77);
  border-radius: 3px;
}
.all-edit {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: rgb(104, 134, 44);
  border: 1px solid #ecd4d4;
  font-size: 12px;
}
.rest-style {
  background: #666666;
  border-radius: 5px;
}
</style>
