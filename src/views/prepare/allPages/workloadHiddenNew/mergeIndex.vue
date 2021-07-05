<template>
  <div class="body">
    <div class="content-box" />
    <el-alert type="info" description="合并功能是用于将多个工作量合并为一个工作量。" effect="dark" />
    <ul class="chartdiv">
      <li>
        <div class="workload">
          <!-- <div class="workload-top"> -->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>合并后的工作量</span>
            </div>
            <div>
              <el-form ref="saveForm" :rules="rules" :model="saveForm" label-width="120px" :inline="true">
                <el-form-item prop="name" label="文件名" label-width="80px">
                  <el-input v-model="saveForm.name" size="small" />
                </el-form-item>
                <el-form-item prop="skillId" label="员工技能" label-width="80px">
                  <el-select v-model="saveForm.skillId" size="small" placeholder="请选择">
                    <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="计算结果粒度" prop="minResultInterval">
                  <el-select v-model="saveForm.minResultInterval" placeholder="请选择" size="small">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        <el-tooltip class="item" effect="dark" :content="item.explanation" placement="top-start">
                          <span>
                            <i class="el-icon-question" />
                          </span>
                        </el-tooltip>
                      </span>
                    </el-option>
                  </el-select>
                  <!-- <el-select v-model="saveForm.minResultInterval" size="small" placeholder="请选择" style="width:100%" class="particle-button">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>-->
                </el-form-item>
                <el-form-item prop="samplingMode" label="抽样模式" label-width="80px">
                  <el-select v-model="saveForm.samplingMode" placeholder="请选择" size="small">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        <el-tooltip class="item" effect="dark" :content="item.explanation" placement="top-start">
                          <span>
                            <i class="el-icon-question" />
                          </span>
                        </el-tooltip>
                      </span>
                    </el-option>
                  </el-select>
                  <!-- <el-select v-model="saveForm.samplingMode" size="small" placeholder="请选择" :disabled="disabled">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>-->
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <!-- </div> -->
        </div>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>待合并的工作量</span>
          </div>
          <div class="middle-area">
            <div class="middle-left">
              <el-form ref="form" v-loading="listLoading" :model="form" label-width="120px" :inline="true">
                <el-form-item prop="workloadDocumentId" label="工作量">
                  <el-select v-model="form.workloadDocumentId" value-key="workloadDocumentId" size="small" placeholder="请选择工作量文档" @change="workloadOptions(form)">
                    <el-option v-for="item in workloadDocOptions" :id="item.name" :key="item.workloadDocumentId" :label="item.name" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button class="btnTop" type="primary" size="small" @click="onSubmit('form')">确定</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="middle-right">
              <!-- <div>已选择列表：</div> -->
              <el-table :data="workloadList" border stripe>
                <el-table-column prop="name" label="工作量" />
                <el-table-column fixed="right" label="操作" width="150">
                  <template slot-scope="scope">
                    <i class="el-icon-delete delete-item" @click="listItemDelete(scope.$index,scope.row)" />
                    <!-- <el-button type="primary" size="mini" @click="listItemDelete(scope.$index,scope.row)">删 除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </li>
      <li>
        <div class="workload">
          <div v-if="dataBlank" class="no-data">暂无数据</div>
          <div v-for="(Outitem,Outindex) in lineChartData" :key="Outindex" v-loading="listLoading" class="runtime-bottom">
            <div class="runtime-left">{{ Outitem.workloadName }}</div>
            <div v-for="(item,i) in Outitem.list" :key="i" class="content" style="margin-bottom:10px">
              <div v-if="Outitem.style =='list'" class="left">
                <el-checkbox v-model="checkList" :label="item.roleId2" @change="checkedChange(item)">{{ item.role }}</el-checkbox>
              </div>
              <div v-else class="left">{{ item.role }}</div>
              <div class="right">
                <div v-for="(items,index) in item.datas" :key="index" class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items, item.role)">
                  <p>{{ items.day }}</p>
                  <line-chart :chart-data="item.datas[index]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="left1">
          <el-button size="small" type="primary" @click="mergeWorkloads">预览</el-button>
        </div>
      </li>
    </ul>
    <!-- 工作量大波形图 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.bigDay" :visible.sync="dialogTableVisible" :before-close="closeImport" center>
      <p style="text-align: right">总量：{{ lineChartDataBig.totalCount }}小时</p>
      <LineChartBig :chart-data="lineChartDataBig" style="width:600px;height:600px" />
    </el-dialog>
    <div class="foot">
      <el-button size="small" style="right:60px" type="primary" :loading="submitLoading" @click="save">确 定</el-button>
      <el-button size="small" style="right:150px" @click="goBack">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { initTable } from '@/api/setWorkRules'
import LineChartBig from '@/components/echarts/LineChartBig'
// import { mergeWorkloads, mergeworkloads, saveMergeResult, flightDateSkill, searchDateforSkill, saveMergeResultSkill } from '@/api/workload'
import { workloadDetails, initNewTable2, previewWorkload, saveMergeResultSkill, skillList } from '@/apiNew/workload'
import LineChart from '@/components/echarts/LineChart'
export default {
  name: 'MergeIndex',
  components: { LineChart, LineChartBig },
  data() {
    return {
      airport: this.$store.state.user.airport,
      submitLoading: false,
      dataBlank: false,
      businessDomainId: this.$route.query.businessDomainId,
      workloadNameTop: '',
      workloadList: [],
      workloads: [],
      skill: this.$route.query.type,
      disabled: false,
      saveForm: {},
      roleIdsoptions: this.checkList,
      options: [
        { value: 'MAX', label: '最大值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最大值' },
        { value: 'MIN', label: '最小值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最小值' },
        { value: 'AVG', label: '平均值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取平均值' }
      ],
      options2: [
        { value: 5, label: '5分钟', explanation: '计算结果按照每5分钟展示' },
        { value: 10, label: '10分钟', explanation: '计算结果按照每10分钟展示' }
      ],
      savedialogTableVisible: false,
      documentSkillIds: [],
      workloadName: this.$route.query.name,
      form: {},
      workloadDocOptions: [],
      checkList: [],
      roleOptions: [],
      roleOptions2: [],
      workRulesDocOptions: [],
      flightoptions: [], // 航班计划
      dialogTableVisible: false,
      listLoading: false,
      documentId: this.$route.query.documentId,
      lineChartDataBig: {},
      lineChartData: [],
      lineChartDataMerge: [],
      result: '',
      end: '',
      begin: '',
      complete: '',
      results: {},
      rules: {
        name: [{ required: true, message: '请输入合并后的工作量名称', trigger: 'blur' }],
        // skillId: [{ required: true, message: '请选择技能', trigger: 'change' }],
        minResultInterval: [{ required: true, message: '请选择最小结果粒度', trigger: 'change' }],
        samplingMode: [{ required: true, message: '请选择抽样模式', trigger: 'change' }]
      }
    }
  },
  created() {
    // this.init()
    this.workload()
    this.skillList()
    this.search2()
  },
  methods: {
    search2() {
      // this.lineChartData = []
      var data = {
        id: this.documentId,
        startDate: '',
        endDate: ''
      }
      workloadDetails(data).then(response => {
        this.listLoading = false
        var list = []
        if (response.data.data.length === 0) {
          this.$message.success('暂无数据')
          this.dataBlank = true
        } else {
          this.dataBlank = false
          var aa = response.data.data.items
          aa.forEach(element => {
            var data1 = { role: '', documentId: response.data.data.workloadDocumentId, datas: [], roleId2: response.data.data.workloadDocumentId + ',' + element.skill.id }
            data1.role = element.skill.name
            element.dailyWorkloads.forEach(element2 => {
              var data2 = {}
              data2.day = element2.date
              data2.maxNum = element2.maxNum
              data2.yName = element.resourceName
              data2.warnLine = false
              data2.totalWorkingHours = element2.totalWorkingHours
              data2.titleShow = false
              data2.actualData = []
              data2.dataX = []
              element2.details.forEach(element3 => {
                data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                data2.dataX.push(element3.time)
              })
              data1.datas.push(data2)
            })
            list.push(data1)
          })
          this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'list' })
          list.forEach(element => {
            this.checkList.push(element.roleId2)
          })
        }
      })
    },
    intervalOptions(item) {},
    save(saveForm) {
      var workloads = {}
      for (var item of this.checkList) {
        var [workloadId, skillId] = item.split(',')
        var workload = workloads[workloadId] || { id: Number(workloadId) }
        workload.skillIds = workload.skillIds || []
        if (workload.skillIds.indexOf(skillId) < 0) {
          workload.skillIds.push(Number(skillId))
        }
        workloads[workloadId] = workload
      }
      var results = {}
      results.workloads = Object.values(workloads)
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.saveForm.businessDomainId = Number(this.businessDomainId)
          this.saveForm.workloads = results.workloads
          saveMergeResultSkill(this.saveForm)
            .then(response => {
              if (response.data.code === '200') {
                this.submitLoading = false
                if (response.data.data.type === 'FLIGHT_WORKLOAD' || response.data.data.type === 'FIXED_WORKLOAD' || response.data.data.type === 'PREDICTION_WORKLOAD') {
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data.workloadDocumentId, name: response.data.data.name, type: response.data.data.type, businessDomainId: this.businessDomainId || '' }})
                } else if (response.data.data.type === 'GUARD_WORKLOAD') {
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.workloadSettingId, type: response.data.data.type, businessDomainId: this.businessDomainId || '' }})
                } else if (response.data.data.type === 'HIST_TASK_WORKLOAD') {
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data.workloadSettingId, type: response.data.data.type, businessDomainId: this.businessDomainId || '' }})
                }
                this.$message.success(response.data.message)
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch(e => {
              this.submitLoading = false
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        } else {
          return false
        }
      })
    },
    skillList() {
      var data = {
        airportId: this.airport.airportId,
        businessDomainId: this.businessDomainId
      }
      skillList(data).then(response => {
        this.roleOptions = response.data.data
      })
    },
    mergeWorkloads() {
      var workloads = {}
      for (var item of this.checkList) {
        var [workloadId, skillId] = item.split(',')
        var workload = workloads[workloadId] || { id: Number(workloadId) }
        workload.skillIds = workload.skillIds || []
        if (workload.skillIds.indexOf(skillId) < 0) {
          workload.skillIds.push(Number(skillId))
        }
        workloads[workloadId] = workload
      }
      var results = {}
      results.workloads = Object.values(workloads)
      var data = {
        workloads: results.workloads
      }
      if (this.checkList.length > 0) {
        if (this.skill === 'skill') {
          previewWorkload(data)
            .then(response => {
              this.listLoading = false
              var list = []
              var aa = response.data.data.items
              aa.forEach(element => {
                var data1 = { role: '', documentId: response.data.data.workloadDocumentId, datas: [], roleId2: response.data.data.workloadDocumentId + ',' + element.skill.id }
                this.workloadName = '合并后的工作量'
                data1.role = element.skill.name
                element.dailyWorkloads.forEach(element2 => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.totalWorkingHours = element2.totalWorkingHours
                  data2.titleShow = false
                  data2.actualData = []
                  data2.dataX = []
                  element2.details.forEach(element3 => {
                    // data2.actualData.push(element3.num)
                    data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                    data2.dataX.push(element3.time)
                  })
                  data1.datas.push(data2)
                })
                list.push(data1)
              })
              if (this.complete === 1) {
                var _this = this
                this.lineChartData.forEach(function(element, index) {
                  if (element.style === 'total') {
                    _this.lineChartData.splice(index, 1)
                  }
                })
                this.$nextTick(() => {
                  this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
                })
              } else {
                this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
                this.complete = 1
              }
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        }
      } else {
        this.$message.error('请选择要合并的工作量')
      }
    },
    workloadOptions(item) {},
    workload() {
      // 工作量下拉
      var data = {
        id: this.businessDomainId || 0,
        documentId: this.documentId,
        airportId: this.airport.airportId
      }
      initNewTable2(data).then(response => {
        this.workloadDocOptions = response.data.data
      })
    },
    checkedChange(item) {
      // 复选框选中把数据传到角色下拉
      this.checkList.forEach(element => {
        var skillId = element
        if (skillId === item.skillId) {
          this.roleOptions.push({ value: skillId, label: item.role })
        }
      })
    },
    onSubmit() {
      // 添加工作量
      // this.checkList = []
      this.workloadName = this.form.workloadDocumentId.name
      this.documentId = this.form.workloadDocumentId.workloadDocumentId
      this.workloadList.push({ id: this.form.workloadDocumentId.workloadDocumentId, name: this.form.workloadDocumentId.name })
      // this.gzldialogTableVisible = false
      if (this.skill === 'skill') {
        this.search2()
      }
    },
    listItemDelete(id) {
      this.workloadList.splice(id, 1)
      this.lineChartData.splice(id + 1, 1)
    },
    workRules() {
      var data = {
        // 下拉
        documentType: 'SERVICE_STANDARD'
      }
      initTable(data).then(response => {
        this.workRulesDocOptions = response.data.data
      })
    },
    showEchart(items, skill) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.lineChartDataBig.totalCount = items.totalWorkingHours
      this.lineChartDataBig.bigDay = items.day + ' ' + skill
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
    },
    goBack() {
      console.log(this.saveForm, 666)
      if (this.workloadList.length === 0 && JSON.stringify(this.saveForm) == '{}') {
        this.$router.go(-1)
      } else {
        this.$confirm('已填写的数据将不会被保存，确认取消？', '提示', {
          confirmButtonText: '不保存',
          cancelButtonText: '返回'
        })
          .then(() => {
            this.$router.go(-1)
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style scoped>
.body /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  font-size: 14px;
  margin: 10px 0;
}
.body /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}
.body /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.el-card /deep/ .el-card__body {
  padding: 15px 15px 0;
}
.body /deep/ td,
tr,
th {
  text-align: left;
}
.body /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.body {
  font-size: 14px;
}

.middle-area {
  width: 100%;
  display: flex;
  align-items: center;
  // background: #425079;
}

.middle-left,
.middle-right {
  width: 50%;
  height: 150px;
  overflow: auto;
  padding: 0 20px;
}

.middle-left {
  // display: flex;
  // align-items: center;
  border-right: 1px solid #172449;
}

.list-item {
  display: flex;
  // margin-bottom: 10px;
  align-items: center;

  div {
    width: 75%;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
  }
}

.delete-item {
  color: #f56c6a;
}

.delete-item:hover {
  color: red;
  cursor: pointer;
}
.content-box {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background: #0a142f;
  height: 100%;
  margin-top: 60px;
}
.workload {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.workload-top {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.span-value {
  margin-left: 10px;
  margin-right: 10px;
}

.runtime-bottom {
  height: 100%;
  margin-top: 10px;
  background: #425079;
  overflow: hidden;

  .runtime-left {
    float: left;
    width: 14%;
  }

  .content {
    float: right;
    width: 85%;
    background: #172449;
  }

  .left {
    padding-left: 5px;
  }
}
.workload-bottom {
  width: 100%;
  // max-height: 600px;
  margin-top: 2px;
  box-sizing: border-box;
  padding: 20px 0;
  // border-top: 2px solid #4f566b;
  overflow: auto;
  .role {
    width: 100%;
    height: 250px;
    line-height: 250px;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 12px;
  }
}

.chartdiv {
  li {
    // background: #263257;
  }

  div.left1 {
    display: inline-block;
    width: 18%;
    padding: 16px;
    margin-bottom: 20px;
    vertical-align: top;
  }
}

.foot {
  background: #172449;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0 24px;
  width: 100%;
  height: 80px;

  .el-button {
    position: absolute;
    bottom: 20px;
  }
}
.no-data {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  text-align: center;
}
.left {
  font-size: 14px;
  width: 16%;
}
.runtime-bottom div.left {
  width: 16%;
}
.runtime-bottom div.right {
  width: 83%;
}
</style>
