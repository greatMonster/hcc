<template>
  <div class="body">
    <section>
      <div class="search-area">
        <el-form ref="createForm" :model="createForm" label-width="120px" :inline="true" :label-position="position" :rules="createRules">
          <div v-if="type === 'FLIGHT_WORKLOAD' || type == 'FIXED_WORKLOAD'">
            <el-row>
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="工作量名称" label-width="120px" prop="name">
                  <el-input v-model="createForm.name" size="small" style="width: 240px" @change="saveName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="8" :xl="7">
                <el-form-item label="开始与结束日期" prop="topDate">
                  <el-date-picker v-model="createForm.topDate" size="small" style="width: 230px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="9">
                <el-form-item label="航班计划" label-width="120px" prop="flightScheduleId">
                  <el-select v-model="createForm.flightScheduleId" size="small" disabled placeholder="请选择" class="particle-button" style="width: 100%">
                    <el-option v-for="item in flightoptions" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="作业标准" label-width="90px" prop="operationStandardId">
                  <el-select v-model="createForm.operationStandardId" disabled size="small" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in workRulesDocOptions" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="8" :xl="7">
                <el-form-item label="计算粒度" prop="minCalculationInterval">
                  <el-input v-model="createForm.minCalculationInterval" disabled style="width: 230px" size="small" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="9">
                <el-form-item label="计算结果粒度" prop="minResultInterval">
                  <el-select v-model="createForm.minResultInterval" placeholder="请选择">
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
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="抽样模式" label-width="90px" prop="samplingMode">
                  <el-select v-model="createForm.samplingMode" placeholder="请选择">
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
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else-if="type == 'GUARD_WORKLOAD'" class="search-area">
            <el-row>
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="工作量名称" label-width="120px" prop="workloadName">
                  <el-input v-model="createForm.workloadName" size="small" style="width: 240px" />
                </el-form-item>
              </el-col>
              <el-col :md="14" :lg="8" :xl="7">
                <el-form-item label="开始与结束日期" prop="topDate2">
                  <el-date-picker v-model="createForm.topDate2" size="small" style="width: 230px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
              </el-col>

              <el-col :md="5" :lg="8" :xl="9">
                <el-form-item label="计算结果粒度" prop="granularityInterval">
                  <el-select v-model="createForm.granularityInterval" placeholder="请选择">
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
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="抽样模式" label-width="90px" prop="samplingMode">
                  <el-select v-model="createForm.samplingMode2" placeholder="请选择">
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
                </el-form-item>
              </el-col>
            </el-row>
            <el-table :data="dataDataList" border stripe style="margin-top: 20px">
              <el-table-column prop="skill" label="技能">
                <template slot-scope="scope">
                  <span>{{ scope.row.skill.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.beginTime }}-{{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reqNum" label="人数" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editList(scope.$index, scope.row, dataDataList)">编 辑</el-button>
                  <el-button type="primary" size="small" @click="removeList(scope.$index, dataDataList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="type === 'HIST_TASK_WORKLOAD' || 'FLIGHT_DYNAMIC_WORKLOAD'">
            <el-row>
              <el-col :md="8" :lg="8" :xl="8">
                <el-form-item label="工作量名称" label-width="120px" prop="workloadName">
                  <el-input v-model="createForm.workloadName" size="small" style="width: 240px" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :lg="8" :xl="8">
                <el-form-item label="开始与结束日期" prop="topDate3">
                  <el-date-picker v-model="createForm.topDate3" size="small" style="width: 230px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :lg="8" :xl="8">
                <el-form-item label="历史时间" prop="topDate4">
                  <el-date-picker v-model="createForm.topDate4" size="small" style="width: 230px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="选择技能" prop="skills" :label-width="formLabelWidth">
                  <el-select v-model="createForm.skills" size="small" multiple collapse-tags placeholder="请选择">
                    <el-option v-for="items in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="计算结果粒度" prop="granularityInterval">
                  <el-select v-model="createForm.granularityInterval" size="small" placeholder="请选择">
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
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="抽样模式" label-width="90px" prop="samplingMode">
                  <el-select v-model="createForm.samplingMode" size="small" placeholder="请选择">
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
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="content-box">
        <div class="content-right">
          <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick2(activeName2)">
            <el-tab-pane label="工作量" name="first">
              <div class="workload">
                <div class="workload-top">
                  <div class="span-value">
                    <label for>开始与结束日期&nbsp;</label>
                    <el-date-picker
                      v-model="bottomDate"
                      size="small"
                      :picker-options="pickerOptions1"
                      style="width: 300px"
                      clearable
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </div>
                  <el-button type="primary" icon="el-icon-search" size="small" @click="search2" />
                </div>
                <div v-loading="listLoading" class="runtime-bottom" element-loading-background="rgba(0, 0, 0, 0.8)">
                  <div v-if="dataBlank" class="no-data">暂无数据</div>
                  <div v-for="(item, i) in lineChartData" :key="i">
                    <div class="left">{{ item.role }}</div>
                    <div class="right">
                      <div v-for="(items, index) in item.datas" :key="index" class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items, item.role)">
                        <p>{{ items.day }}</p>
                        <line-chart :chart-data="item.datas[index]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>
    <el-dialog v-dialogDrag :visible.sync="dialogAdd" title="添加技能">
      <el-form ref="skillform" :model="skillform" :rules="skillrules">
        <el-form-item label="选择技能" prop="skillId" :label-width="formLabelWidth">
          <el-select v-model="skillform.skillId" placeholder="请选择">
            <el-option v-for="items in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="date" label="时间" :label-width="formLabelWidth">
          <el-time-picker v-model="skillform.date" arrow-control="true" format="HH:mm" value-format="HH:mm:ss" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
        </el-form-item>
        <el-form-item prop="reqNum" label="人数" :label-width="formLabelWidth">
          <el-input v-model="skillform.reqNum" placeholder="请输入数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddbtn('skillform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.bigDay" :visible.sync="dialogTableVisible" :before-close="closeImport" center>
      <p style="text-align: right">总量：{{ lineChartDataBig.totalCount }}小时</p>
      <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px" />
    </el-dialog>
    <div class="foot">
      <el-button size="small" style="right: 150px" @click="goBack">返 回</el-button>
      <el-button size="small" style="right: 60px" type="primary" :loading="submitClick" @click="saveWorkload">提 交</el-button>
    </div>
  </div>
</template>

<script>
import LineChartBig from '@/components/echarts/LineChartBig'
import { workloadDetails, workStandard, flightoptions, modifyWorkload, modifyWorkloadName, workloadDetails2, modifyWorkload2, skill, modifyWorkload3, modifyFlightDynamic, initNewTable3, initFlightDynamicWorkload } from '@/apiNew/workload'
import LineChart from '@/components/echarts/LineChart'
import { _debounce } from '@/utils'
export default {
  name: 'WorkloadHidden',
  components: { LineChart, LineChartBig },
  data() {
    return {
      airport: this.$store.state.user.airport,
      submitClick: false,
      pickerOptions1: {
        disabledDate: (time) => {
          // const tempDate = new Date(this.createForm.topDate[0])
          // var endDateBottom = new Date(tempDate)
          // endDateBottom.setDate(tempDate.getDate())
          // var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
          // return time.getTime() > new Date(this.createForm.topDate[1]).getTime() || time.getTime() < new Date(datetimeBottom).getTime() // 限制选择的日期
        }
      },
      dialogAdd: false,
      skillform: {
        skill: '',
        date: '',
        reqNum: ''
      },
      dataBlank: false,
      position: 'right',
      id: this.$route.query.businessDomainId || '',
      type: this.$route.query.type || '',
      topDate: ['', ''],
      bottomDate: ['', ''],
      dataDataList: [],
      skillOptions: [],
      dialogTableVisibleSplit: false,
      shiftPlanName: '',
      workloadSampling: '',
      fullscreenLoading: false,
      particle01: '1min',
      rulesetDocumentId: '',
      workRulesDocOptions: [],
      flightoptions: [], // 航班计划
      dialogTableVisible: false,
      listLoading: false,
      documentId: this.$route.query.id,
      lineChartDataBig: {},
      workloadDocumentId: '',
      lineChartData: [],
      createForm: { minResultInterval: 5, minCalculationInterval: '1分钟' },
      skillrules: {
        skillId: [{ required: true, message: '请选择技能', trigger: 'blur' }],
        date: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        reqNum: [{ required: true, message: '请输入人数', trigger: 'change' }]
      },
      options: [
        { value: 'MAX', label: '最大值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最大值' },
        { value: 'MIN', label: '最小值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最小值' },
        { value: 'AVG', label: '平均值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取平均值' }
      ],
      options2: [
        { value: 5, label: '5分钟', explanation: '计算结果按照每5分钟展示' },
        { value: 10, label: '10分钟', explanation: '计算结果按照每10分钟展示' }
      ],
      activeName2: 'first',
      formLabelWidth: '120px',
      form: {},
      initForm: {},
      createRules: {
        topDate: [{ required: true, message: '请选择开始与结束日期', trigger: 'change' }],
        minResultInterval: [{ required: true, message: '请选择最小结果粒度', trigger: 'change' }],
        samplingMode: [{ required: true, message: '请选择抽样模式', trigger: 'blur' }],
        granularityInterval: [{ required: true, message: '请选择最小结果粒度', trigger: 'change' }],
        topDate2: [{ required: true, message: '请选择开始与结束日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.flightoptions2() // 航班计划下拉
    this.workRules()
    this.search2()
    this.skillChange()
  },
  methods: {
    handleClick() {},
    search2() {
      // 时间筛选查询
      if (this.type === 'FLIGHT_WORKLOAD' || this.type === 'FIXED_WORKLOAD') {
        this.listLoading = true
        this.lineChartData = []
        var data = {
          id: this.documentId,
          startDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : '',
          airportId: this.airport.airportId
        }
        workloadDetails(data)
          .then((response) => {
            this.listLoading = false
            if (response.data.data.length === 0) {
              this.dataBlank = true
            } else {
              var startDate = response.data.data.startDate.substring(0, 10)
              var tempDate = new Date(startDate)
              var endDate = new Date(tempDate)
              endDate.setDate(tempDate.getDate() + 6)
              var datetime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' '
              this.dataBlank = false
              this.initForm.name = response.data.data.name
              this.initForm.topDate = [response.data.data.startDate.substring(0, 10), response.data.data.endDate.substring(0, 10)]
              this.initForm.flightScheduleId = response.data.data.flightScheduleId
              this.initForm.operationStandardId = response.data.data.operationStandardId
              this.initForm.minCalculationInterval = '1分钟'
              this.initForm.minResultInterval = response.data.data.minResultInterval
              this.initForm.samplingMode = response.data.data.samplingMode ? response.data.data.samplingMode : ''
              this.workloadDocumentId = response.data.data.documentId
              var _this = this
              var startDate = response.data.data.startDate
              var endDate = response.data.data.endDate
              response.data.data.minCalculationInterval = '1分钟'
              response.data.data.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.createForm = Object.assign(
                {},
                {
                  name: response.data.data.name,
                  topDate: response.data.data.topDate,
                  flightScheduleId: response.data.data.flightScheduleId,
                  operationStandardId: response.data.data.operationStandardId,
                  minCalculationInterval: response.data.data.minCalculationInterval,
                  minResultInterval: response.data.data.minResultInterval,
                  samplingMode: response.data.data.samplingMode ? response.data.data.samplingMode : ''
                }
              )
              this.bottomDate = [startDate, datetime]
              if (new Date(this.initForm.topDate[1]).getTime() - new Date(datetime).getTime() > 0) {
                this.bottomDate[1] = datetime
              } else {
                this.bottomDate[1] = this.initForm.topDate[1]
                // console.log(new Date(this.initForm.topDate[1]).getTime(), new Date(datetime).getTime(), 6363)
              }
              // if (!this.bottomDate[0]) {
              //   this.bottomDate = [startDate, datetime]
              // } else {
              //   this.bottomDate = [startDate, datetime]
              // }
              var aa = response.data.data.items
              aa.forEach((element) => {
                var data1 = {}
                data1.role = element.skill.name
                data1.datas = []
                element.dailyWorkloads.forEach((element2) => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.maxNumAll = element.maxNum
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.totalWorkingHours = element2.totalWorkingHours
                  data2.titleShow = false
                  data2.actualData = []
                  data2.dataX = []
                  element2.details.forEach((element3) => {
                    data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                    data2.dataX.push(element3.time)
                  })
                  data1.datas.push(data2)
                })
                _this.lineChartData.push(data1)
              })
            }
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else if (this.type === 'GUARD_WORKLOAD') {
        this.lineChartData = []
        var dataData = {
          businessDomainId: this.id,
          documentId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : '',
          airportId: this.airport.airportId
        }
        workloadDetails2(dataData).then((res) => {
          if (res.data.code === '200') {
            this.dataDataList = res.data.data.reqs
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              var startDate = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDate)
              var endDate = new Date(tempDate)
              endDate.setDate(tempDate.getDate() + 6)
              var datetime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1) + '-' + endDate.getDate() + ' '
              this.dataBlank = false
              this.initForm.workloadName = res.data.data.name
              this.$set(this.initForm, 'topDate2', [res.data.data.fromDate.slice(0, 10), res.data.data.toDate.slice(0, 10)])
              this.initForm.granularityInterval = res.data.data.granularityInterval
              this.initForm.samplingMode2 = res.data.data.samplingMode2
              var _this = this
              this.workloadDocumentId = res.data.data.documentId
              this.createForm = Object.assign(
                {},
                {
                  workloadName: res.data.data.workloadName,
                  granularityInterval: res.data.data.granularityInterval,
                  samplingMode2: res.data.data.samplingMode
                }
              )
              this.$set(this.createForm, 'topDate2', [res.data.data.fromDate.slice(0, 10), res.data.data.toDate.slice(0, 10)])
              this.bottomDate = [startDate, datetime]
              if (new Date(this.initForm.topDate2[1]).getTime() - new Date(datetime).getTime() > 0) {
                this.bottomDate[1] = datetime
              } else {
                this.bottomDate[1] = this.initForm.topDate[1]
                // console.log(new Date(this.initForm.topDate[1]).getTime(), new Date(datetime).getTime(), 6363)
              }
              // if (!this.bottomDate[0]) {
              //   this.bottomDate = [startDate, datetime]
              // } else {
              //   this.bottomDate = [startDate, datetime]
              // }
              var aa = res.data.data.workloads
              aa.forEach((element) => {
                var data1 = {}
                data1.role = element.skill.name
                data1.datas = []
                element.dailyWorkloads.forEach((element2) => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.maxNumAll = element.maxNum
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.totalWorkingHours = element2.totalWorkingHours
                  data2.titleShow = false
                  data2.actualData = []
                  data2.dataX = []
                  element2.details.forEach((element3) => {
                    data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                    data2.dataX.push(element3.time)
                  })
                  data1.datas.push(data2)
                })
                _this.lineChartData.push(data1)
              })
            }
          }
        })
      } else if (this.type === 'HIST_TASK_WORKLOAD') {
        var that = this
        this.lineChartData = []
        var dataData2 = {
          businessDomainId: this.id,
          workloadSettingId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : '',
          airportId: this.airport.airportId
        }
        initNewTable3(dataData2).then((res) => {
          if (res.data.code === '200') {
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              var startDateBottom = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = res.data.data.fromDate.substring(0, 10)
              var endDate = res.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.createForm = Object.assign({}, res.data.data)
              this.createForm.skllls = res.data.data.skllls
              this.$set(this.createForm, 'topDate3', [res.data.data.fromDate.slice(0, 10), res.data.data.toDate.slice(0, 10)])
              this.$set(this.createForm, 'topDate4', [res.data.data.taskFromDate.slice(0, 10), res.data.data.taskToDate.slice(0, 10)])
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
              this.workloadDocumentId = res.data.data.documentId
              var aa = res.data.data.workloads
              aa.forEach((element) => {
                var data1 = {}
                data1.role = element.skill.name
                data1.datas = []
                element.dailyWorkloads.forEach((element2) => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.maxNumAll = element.maxNum
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.totalWorkingHours = element2.totalWorkingHours
                  data2.titleShow = false
                  data2.actualData = []
                  data2.dataX = []
                  element2.details.forEach((element3) => {
                    data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                    data2.dataX.push(element3.time)
                  })
                  data1.datas.push(data2)
                })
                that.lineChartData.push(data1)
              })
            }
          }
        })
      } else if (this.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        var that = this
        this.lineChartData = []
        var dataData2 = {
          businessDomainId: this.id,
          workloadSettingId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : '',
          airportId: this.airport.airportId
        }
        initFlightDynamicWorkload(dataData2).then((res) => {
          if (res.data.code === '200') {
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              var startDateBottom = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = res.data.data.fromDate.substring(0, 10)
              var endDate = res.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.createForm = Object.assign({}, res.data.data)
              this.createForm.skllls = res.data.data.skllls
              this.$set(this.createForm, 'topDate3', [res.data.data.fromDate.slice(0, 10), res.data.data.toDate.slice(0, 10)])
              this.$set(this.createForm, 'topDate4', [res.data.data.dynamicFromDate.slice(0, 10), res.data.data.dynamicToDate.slice(0, 10)])
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
              this.workloadDocumentId = res.data.data.documentId
              var aa = res.data.data.workloads
              aa.forEach((element) => {
                var data1 = {}
                data1.role = element.skill.name
                data1.datas = []
                element.dailyWorkloads.forEach((element2) => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.maxNumAll = element.maxNum
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.totalWorkingHours = element2.totalWorkingHours
                  data2.titleShow = false
                  data2.actualData = []
                  data2.dataX = []
                  element2.details.forEach((element3) => {
                    data2.actualData.push({ name: element3.time, value: [element3.time, element3.num] })
                    data2.dataX.push(element3.time)
                  })
                  data1.datas.push(data2)
                })
                that.lineChartData.push(data1)
              })
            }
          }
        })
      }
    },
    skillChange() {
      const data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
    },
    editList(index, row, rows) {
      this.dialogAdd = true

      this.skillform = Object.assign(
        {},
        {
          skillId: row.skill.id,
          date: row.beginTime,
          reqNum: row.reqNum
        }
      )
      this.$set(this.skillform, 'date', [row.beginTime + ':00', row.endTime + ':00'])
      rows.splice(index, 1)
    },
    removeList(index, rows) {
      rows.splice(index, 1)
    },
    dialogAddbtn(formName) {
      this.$refs[formName].validate((valid) => {
        this.skillform.beginTime = this.skillform.date[0]
        this.skillform.endTime = this.skillform.date[1]
        this.skillOptions.forEach((item) => {
          if (this.skillform.skillId === item.skillId) {
            this.skillform.skillName = item.skillName
          }
        })

        this.skillform.skill = {
          id: this.skillform.skillId,
          name: this.skillform.skillName
        }
        this.dataDataList.push(this.skillform)
        this.dialogAdd = false
        this.skillform
      })
      this.skillform = {
        skill: '',
        date: '',
        reqNum: ''
      }
    },
    handleClick2(val) {},
    flightoptions2() {
      // 下拉
      const data = {
        airportId: this.airport.airportId
      }
      flightoptions(data).then((response) => {
        this.flightoptions = response.data.data
      })
    },
    workRules() {
      // 下拉
      const data = {
        businessDomainId: this.id,
        airportId: this.airport.airportId
      }
      workStandard(data).then((response) => {
        this.workRulesDocOptions = response.data.data
      })
    },
    showEchart(items, skill) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.lineChartDataBig.totalCount = items.totalWorkingHours
      this.lineChartDataBig.bigDay = skill + ' ' + items.day
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
    },
    saveName() {
      modifyWorkloadName({ id: this.documentId, name: this.createForm.name })
        .then((response) => {
          this.$message.success('名称修改成功')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message || e.response.status + '' + e.response.statusText
          })
        })
    },
    saveWorkload: _debounce(function (_type, index, item) {
      if (this.type === 'FLIGHT_WORKLOAD' || this.type === 'FIXED_WORKLOAD') {
        var data = {
          id: this.documentId,
          workloadDocumentId: this.workloadDocumentId,
          businessDomainId: this.id,
          startDate: this.createForm.topDate[0] || '',
          endDate: this.createForm.topDate[1] || '',
          minCalculationInterval: 1,
          minResultInterval: this.createForm.minResultInterval,
          samplingMode: this.createForm.samplingMode,
          airportId: this.airport.airportId
        }
        this.listLoading = true
        this.submitClick = true
        modifyWorkload(data)
          .then((response) => {
            this.submitClick = false
            this.$message.success('修改成功')
            //   loading.close()
            this.fullscreenLoading = false
            this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data.workloadDocumentId, type: this.$route.query.type, businessDomainId: this.id || '' } })
          })
          .catch((e) => {
            //   loading.close()
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: e.response.data.message || e.response.status + '' + e.response.statusText
            })
          })
      } else if (this.type === 'GUARD_WORKLOAD') {
        var data2 = {
          workloadDocumentId: this.workloadDocumentId,
          workloadSettingId: this.documentId,
          workloadName: this.createForm.workloadName,
          granularityInterval: this.createForm.granularityInterval,
          samplingMode: this.createForm.samplingMode2,
          businessDomainId: this.id,
          fromDate: this.createForm.topDate2[0] || '',
          toDate: this.createForm.topDate2[1] || '',
          reqs: this.dataDataList,
          airportId: this.airport.airportId
        }
        this.listLoading = true
        this.submitClick = true
        modifyWorkload2(data2)
          .then((response) => {
            this.submitClick = false
            this.$message.success('修改成功')
            //   loading.close()
            this.fullscreenLoading = false
            this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data, type: this.$route.query.type, businessDomainId: this.id || '' } })
          })
          .catch((e) => {
            //   loading.close()
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: e.response.data.message || e.response.status + '' + e.response.statusText
            })
          })
      } else if (this.type === 'HIST_TASK_WORKLOAD') {
        var data3 = {
          workloadDocumentId: this.workloadDocumentId,
          workloadSettingId: this.documentId,
          workloadName: this.createForm.workloadName,
          granularityInterval: this.createForm.granularityInterval,
          samplingMode: this.createForm.samplingMode,
          businessDomainId: this.id,
          fromDate: this.createForm.topDate3[0] || '',
          toDate: this.createForm.topDate3[1] || '',
          taskFromDate: this.createForm.topDate4[0] || '',
          taskToDate: this.createForm.topDate4[1] || '',
          skills: this.createForm.skills,
          airportId: this.airport.airportId
        }
        this.listLoading = true
        this.submitClick = true
        modifyWorkload3(data3)
          .then((response) => {
            this.submitClick = false
            this.$message.success('修改成功')
            //   loading.close()
            this.fullscreenLoading = false
            this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data, type: this.$route.query.type, businessDomainId: this.id || '' } })
          })
          .catch((e) => {
            //   loading.close()
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: e.response.data.message || e.response.status + '' + e.response.statusText
            })
          })
      } else if (this.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        var data3 = {
          workloadDocumentId: this.workloadDocumentId,
          workloadSettingId: this.documentId,
          workloadName: this.createForm.workloadName,
          granularityInterval: this.createForm.granularityInterval,
          samplingMode: this.createForm.samplingMode,
          businessDomainId: this.id,
          fromDate: this.createForm.topDate3[0] || '',
          toDate: this.createForm.topDate3[1] || '',
          dynamicFromDate: this.createForm.topDate4[0] || '',
          dynamicToDate: this.createForm.topDate4[1] || '',
          skills: this.createForm.skills,
          airportId: this.airport.airportId
        }
        this.listLoading = true
        this.submitClick = true
        modifyFlightDynamic(data3)
          .then((response) => {
            this.submitClick = false
            this.$message.success('修改成功')
            //   loading.close()
            this.fullscreenLoading = false
            this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data, type: this.$route.query.type, businessDomainId: this.id || '' } })
          })
          .catch((e) => {
            //   loading.close()
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: e.response.data.message || e.response.status + '' + e.response.statusText
            })
          })
      }
    }, 1000),
    goBack() {
      if (JSON.stringify(this.initForm) === JSON.stringify(this.createForm)) {
        this.$router.go(-1)
      } else {
        this.$confirm('已修改的数据将不会被保存，确认返回？', '提示', {
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

<style>
.button-area {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #172449;
}

.search-area {
  background: #172449;
  margin: 20px 0;
  padding: 10px;
}

.search-area /deep/ .el-col {
  height: 40px;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #0a142f;
}

.el-tabs--border-card > .el-tabs__header {
  background-color: #263257;
}

.el-tabs--border-card > .el-tabs__content {
  background-color: rgb(27, 37, 65);
  color: white;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #232c47;
}

.el-dialog__header {
  background-color: #0a142f;
  color: white;
}

.el-dialog__title {
  color: white;
}

.el-dialog__body {
  background: #232c47;
}

.el-dialog__footer {
  background: #0a142f;
}
</style>

<style lang="scss" scoped>
.formstyle {
  margin-top: 20px;
}

.bg-color {
  background-color: #232c47;
  width: 100%;
  height: 60px;
}

.header-left,
.header-middle,
.header-middle2 {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-right: 1px solid #ccc;
  font-size: 12px;
  color: #0a9fc8;
}

.header-left1 {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 60px;
  justify-content: center;
  align-items: center;
}

.left-top {
  width: 14px;
  height: 14px;
  margin-bottom: 2px;
}

.img-style {
  width: 14px;
  height: 14px;
}

.header-right {
  justify-content: flex-start;
}

.header-middle,
.header-middle2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60px;
}

.header-middle-top,
.header-middle-bottom {
  display: flex;
  width: 140px;
  height: 20px;
  align-items: center;
}

.margin-sty {
  margin-left: 5px;
}

.header-middle2 {
  flex-direction: row;
}

.header-middle2-top,
.header-middle2-bottom {
  display: flex;
  flex-direction: column;
  width: 120px;
  justify-content: center;
  align-items: center;
}

.header-right {
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
}

.rule-box {
  width: 100%;
  height: 100%;
  background-color: #0a142f;
  box-sizing: border-box;
  padding: 20px;
}

.header-right-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content-box {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background: #0a142f;
  height: 100%;
}

.content-left {
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  font-size: 14px;
  color: white;
}

.recycle-button {
  width: 132px;
}
.staticload-content1 {
  width: 100%;
  height: 20px;
  line-height: 20px;
}

.content-right {
  // width: 82%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.workload {
  width: 100%;
  height: 100%;
}

.workload-top {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  font-size: 14px;
}

.span-value {
  margin-left: 10px;
  margin-right: 10px;
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

.flight {
  width: 100;
  height: 100%;
}

.flight-top {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 15px;
}

.print-file,
.import-file {
  width: 80px;
  height: 30px;
  line-height: 20px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid white;
  text-align: center;
}

.import-file {
  margin-left: 30px;
}

.flight-bottom {
  margin-top: 10px;
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
}
</style>
