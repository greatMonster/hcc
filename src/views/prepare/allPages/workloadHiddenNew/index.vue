<template>
  <div class="body">
    <section>
      <!-- 第二部分 -->
      <div class="button-area">
        <el-button type="primary" size="mini" style="margin-right: 10px" @click="exportClick1">导 出</el-button>
        <el-button type="primary" size="mini" style="margin-right: 10px" @click="renewHandler">调整工作量</el-button>
        <el-button type="primary" size="mini" style="margin-right: 10px" @click="copyWorkloadClick">复制工作量</el-button>
        <el-button type="primary" style="margin-right: 10px" size="mini" @click="mergeWorkload">合并工作量</el-button>
        <el-button type="primary" size="mini" style="margin-right: 10px" @click="splitWorkload">拆分工作量</el-button>
        <!-- <el-button :disabled="type=='FIXED_WORKLOAD'||type=='PREDICTION_WORKLOAD'" type="primary" size="mini" @click="modifyWorkload">修 改</el-button> -->
      </div>
      <div class="search-area">
        <el-form :model="searchForm" label-width="120px" :inline="true" :label-position="position">
          <div v-if="type == 'FLIGHT_WORKLOAD' || type == 'FIXED_WORKLOAD' || type == 'PREDICTION_WORKLOAD'">
            <el-row>
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="工作量名称" label-width="120px">
                  <span>{{ shiftPlanName ? shiftPlanName : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="7" :xl="6">
                <el-form-item label="开始与结束日期">
                  <span v-if="topDate">
                    <span>{{ topDate[0] }} - {{ topDate[1] ? topDate[1] : '' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="9" :xl="8">
                <el-form-item label="航班计划">
                  <span v-if="businessDomainId == 1 || businessDomainId == 106" @click="jumpFlight" class="flight-schedule">{{ FLIGHT_SCHEDULE ? FLIGHT_SCHEDULE.substring(0, 23) : '-' }}</span>
                  <span v-else>{{ FLIGHT_SCHEDULE ? FLIGHT_SCHEDULE.substring(0, 23) : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="10">
                <el-form-item :label="businessDomainId == 1 || businessDomainId == 106 ? '服务标准' : '作业标准'">
                  <span v-if="businessDomainId == 1 || businessDomainId == 106" @click="jumpOperation" class="flight-schedule"
                    >{{ rulesetDocumentId ? rulesetDocumentId.substring(0, 25) : '-' }} <span v-if="flag" style="color: red" title="已被修改或删除">!</span>
                  </span>
                  <span v-else>{{ rulesetDocumentId ? rulesetDocumentId.substring(0, 25) : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="7" :xl="6">
                <el-form-item label="计算粒度">
                  <span>{{ particle01 }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="9" :xl="8">
                <el-form-item label="计算结果粒度">
                  <span>{{ granularityInterval == 5 ? '5分钟' : '10分钟' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="10">
                <el-form-item label="抽样模式">
                  <span v-if="workloadSampling">{{ workloadSampling == 'AVG' ? '平均值' : workloadSampling == 'MAX' ? '最大值' : '最小值' }} <span v-if="flag" title="已被修改或删除">!</span> </span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="type == 'GUARD_WORKLOAD'">
            <el-row>
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="工作量名称">
                  <span>{{ dataData.workloadName ? dataData.workloadName : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="14" :lg="8" :xl="7">
                <el-form-item label="开始与结束日期">
                  <span v-if="dataData.fromDate">
                    <span>{{ dataData.fromDate ? dataData.fromDate.substring(0, 10) : '' }} ~ {{ dataData.toDate ? dataData.toDate.substring(0, 10) : '' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="9">
                <el-form-item label="计算结果粒度" prop="granularityInterval">
                  <span>{{ dataData.granularityInterval == 5 ? '5分钟' : '10分钟' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="抽样模式" prop="samplingMode">
                  <span v-if="dataData.samplingMode">{{ dataData.samplingMode == 'AVG' ? '平均值' : dataData.samplingMode == 'MAX' ? '最大值' : '最小值' }}</span>
                  <span v-else>-</span>
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
            </el-table>
          </div>
          <div v-if="type == 'HIST_TASK_WORKLOAD'">
            <el-row>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="工作量名称">
                  <span>{{ dataData.workloadName ? dataData.workloadName : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="开始与结束日期">
                  <span v-if="dataData.fromDate">
                    <span>{{ dataData.fromDate ? dataData.fromDate.substring(0, 10) : '' }} ~ {{ dataData.toDate ? dataData.toDate.substring(0, 10) : '' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="历史任务时间">
                  <span v-if="dataData.taskFromDate">
                    <span>{{ dataData.taskFromDate ? dataData.taskFromDate.substring(0, 10) : '' }} ~ {{ dataData.taskToDate ? dataData.taskToDate.substring(0, 10) : '' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="技能">
                  <span v-for="(item, i) in skillNames" :key="i">{{ item }} &nbsp;</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="计算结果粒度" prop="granularityInterval">
                  <span>{{ dataData.granularityInterval == 5 ? '5分钟' : '10分钟' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="8">
                <el-form-item label="抽样模式" prop="samplingMode">
                  <span v-if="dataData.samplingMode">{{ dataData.samplingMode == 'AVG' ? '平均值' : dataData.samplingMode == 'MAX' ? '最大值' : '最小值' }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="type == 'FLIGHT_DYNAMIC_WORKLOAD'">
            <el-row>
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="工作量名称" label-width="120px">
                  <span>{{ dataData.workloadName ? dataData.workloadName : '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="7" :xl="6">
                <el-form-item label="派工标准名称">
                  <span>
                    <span>{{ dataData.dispatchName ? dataData.dispatchName : '-' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="9" :xl="8">
                <el-form-item label="开始结束时间">
                  <span v-if="dataData.fromDate">
                    <span>{{ dataData.fromDate ? dataData.fromDate.substring(0, 10) : '' }} ~ {{ dataData.toDate ? dataData.toDate.substring(0, 10) : '' }}</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="10">
                <el-form-item label="航班动态时间">
                  <span>{{ dataData.dynamicFromDate ? dataData.dynamicFromDate.substring(0, 10) : '' }} ~ {{ dataData.dynamicToDate ? dataData.dynamicToDate.substring(0, 10) : '' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="14" :lg="7" :xl="6">
                <el-form-item label="技能名称">
                  <span>{{ dataData.skillName ? dataData.skillName : '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="9" :xl="8">
                <el-form-item label="计算结果粒度">
                  <span>{{ granularityInterval == 5 ? '5分钟' : '10分钟' }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="5" :lg="8" :xl="10">
                <el-form-item label="抽样模式">
                  <span v-if="dataData.samplingMode">{{ dataData.samplingMode == 'AVG' ? '平均值' : dataData.samplingMode == 'MAX' ? '最大值' : '最小值' }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="content-box">
        <!-- 图表展示 -->
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
                <div v-loading="listLoading" class="runtime-bottom">
                  <div v-if="dataBlank" class="no-data">暂无数据</div>
                  <div v-else class="columnName">
                    <div class="columnName1">所需技能项</div>
                    <div style="width: 89%; text-align: center">该技能项的需求量</div>
                  </div>
                  <div v-for="(item, i) in lineChartData" :key="i" style="border-top: 1px solid #4d6cab">
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
            <el-tab-pane v-if="type == 'FLIGHT_WORKLOAD'" label="航班计划工作量明细" name="second">
              <div class="flight">
                <div class="flight-top">
                  <el-button type="primary" size="mini" style="margin-right: 10px" @click="exportClick">导 出</el-button>
                </div>
                <!-- <el-table v-loading="listLoading" :data="tableData" border :row-class-name="setClassName">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-table :data="props.row.tasks" border class="taskList">
                        <el-table-column prop="taskName" label="名称" />
                        <el-table-column prop="beginTime" label="开始时间" />
                        <el-table-column prop="endTime" label="结束时间" />
                        <el-table-column prop="windowsBeginTime" label="窗口开始时间" />
                        <el-table-column prop="windowsEndTime" label="窗口结束时间" />
                        <el-table-column prop="skills" label="技能" />
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" label="编号" sortable width="50" />
                  <el-table-column prop="flightDate" label="航班日期" sortable width="180">
                    <template slot-scope="scope">{{ scope.row.flightDate.substring(0,10) }}</template>
                  </el-table-column>
                  <el-table-column prop="ruleRoute" label="匹配路径" sortable width>
                    <template slot-scope="scope">{{ scope.row.ruleRoute?scope.row.ruleRoute:'不符合工作量生成规则' }}</template>
                  </el-table-column>
                  <el-table-column prop="arrFlightNo" label="进港航班号" sortable width />
                  <el-table-column prop="arrTime" label="计划进港时间" sortable width />
                  <el-table-column prop="deptFlightNo" label="离港航班号" sortable width />
                  <el-table-column prop="deptTime" label="计划离港时间" sortable width />
                </el-table>-->
              </div>
              <!-- <el-pagination :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>
    <!--重新生成工作量弹框 -->
    <el-dialog v-dialogDrag :visible.sync="renewDialogVisible" title="重新生成工作量">
      <el-form ref="renewForm" :model="renewForm" :rules="renewFormrules">
        <el-form-item prop="name" label="新工作量名称" :label-width="formLabelWidth">
          <el-input v-model="renewForm.name" placeholder="请输入工作量名称" />
        </el-form-item>
        <el-form-item prop="workloadModulus" :label-width="formLabelWidth">
          <div slot="label" style="display: inline-block">
            调整系数
            <el-tooltip content="增加20%的工作量则填写1.2" placement="left">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </div>
          <el-input v-model="renewForm.workloadModulus" placeholder="请输入调整系数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="renewBtn('renewForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 复制工作量弹框 -->
    <el-dialog v-dialogDrag :visible.sync="copydialogTableVisible" title="复制工作量">
      <el-form ref="copyForm" :model="copyForm" :rules="copyFormrules">
        <el-form-item prop="workloadName" label="新工作量名称" :label-width="formLabelWidth">
          <el-input v-model="copyForm.workloadName" placeholder="请输入工作量名称" />
        </el-form-item>
        <el-form-item label="相关技能" prop="skillIds" :label-width="formLabelWidth">
          <el-select v-model="copyForm.skillIds" placeholder="请选择" multiple collapse-tags style="width: 350px">
            <el-option v-for="items in skillCopyOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="date" label="开始与结束日期" :label-width="formLabelWidth">
          <el-date-picker v-model="copyForm.date" style="width: 100%" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copydialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyWorkloadBtn('copyForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.bigDay" :visible.sync="dialogTableVisible" :before-close="closeImport" center>
      <p style="text-align: right">
        总量
        <el-tooltip content="工作总量=Σ（单位工作量*单位时长）" placement="top"> <i class="el-icon-question help-icon" /> </el-tooltip>：{{ lineChartDataBig.totalCount }}小时
      </p>
      <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px" />
    </el-dialog>
    <!-- 拆分工作量弹框 -->
    <div>
      <el-dialog v-dialogDrag title="拆分工作量" :visible.sync="dialogTableVisibleSplit" width="60%" height="60%">
        <el-alert type="info" effect="dark">
          <div class="explanation">拆分功能是用于将单个工作量根据时间拆分为两个工作量。</div>
          <div>- 如某员工技能未定义拆分时间段，则不做拆分</div>
        </el-alert>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane v-for="(item, index) in splitData" :key="index" :name="item.name" :label="item.label">
            <el-card v-if="splitCondition" class="box-card">
              <div slot="header" class="clearfix">
                <span>拆分工作量</span>
              </div>
              <div>
                <el-form ref="ruleForm" :rules="rules" :model="item.ruleForm" label-width="150px" class="formstyle">
                  <el-form-item label="时间段" required>
                    <el-col :span="11">
                      <el-form-item prop="from">
                        <el-time-picker
                          v-model="item.ruleForm.time"
                          arrow-control="true"
                          format="HH:mm"
                          value-format="HH:mm"
                          :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }"
                          is-range
                          range-separator="-"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          placeholder="选择时间范围"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="拆分模式" prop="mode">
                    <el-select v-model="item.ruleForm.mode" placeholder="请选择" @change="modeChange">
                      <el-option label="水平拆分" value="line">
                        <span style="float: left">水平拆分</span>
                        <span class="preview-picture">
                          <el-popover placement="right" width="240" trigger="hover">
                            <div>
                              <img src="@/assets/zhiqie.png" alt style="width: 200px; height: 200px" />
                            </div>
                            <div slot="reference">
                              <i class="el-icon-view" />
                            </div>
                          </el-popover>
                          <!-- <i class="el-icon-view" /> -->
                        </span>
                      </el-option>
                      <el-option label="弧形拆分" value="arc">
                        <span style="float: left">弧形拆分</span>
                        <span class="preview-picture">
                          <el-popover placement="right" width="240" trigger="hover">
                            <div>
                              <img src="@/assets/huqie.png" alt style="width: 200px; height: 200px" />
                            </div>
                            <div slot="reference">
                              <i class="el-icon-view" />
                            </div>
                          </el-popover>
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="retainShow" label="保留工作量" prop="retainNum">
                    <el-input v-model.number="item.ruleForm.retainNum" style="width: 200px" />
                  </el-form-item>
                  <el-form-item v-if="splitShow" label="切除工作量" prop="num">
                    <el-input v-model.number="item.ruleForm.num" style="width: 200px" />
                  </el-form-item>
                  <!-- <el-form-item> -->
                  <div class="split-button">
                    <el-button type="primary" size="small" style="float: right; margin-top: 16px" @click="submitForm('ruleForm', index)">提 交</el-button>
                    <el-button type="info" size="small" style="float: right; margin-right: 10px; margin-top: 16px" @click="goBack">返 回</el-button>
                  </div>
                  <!-- </el-form-item> -->
                  <el-form-item />
                </el-form>
              </div>
            </el-card>
            <el-card v-if="splitResult" class="box-card">
              <div slot="header" class="clearfix">
                <span>拆分结果</span>
              </div>
              <div style="padding: 20px">
                <div class="workload-name">
                  工作量一：
                  <span class="split-name" @click="firstJump">{{ firstSplitName }}</span>
                </div>
                <div class="workload-name">
                  工作量二：
                  <span class="split-name" @click="secondJump">{{ secondSplitName }}</span>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogTableVisibleSplit = false">返 回</el-button>
          <el-button size="small" type="primary" @click="splitSubmitClick">提 交</el-button>
        </div>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LineChartBig from './components/LineChartBig'
import { workloadDetails, workloadDetailsNew, cut, flights, renewWorkload, workloadDetails2, initNewTable3, skill, copyWorkload, skillCopy, initFlightDynamicWorkload } from '@/apiNew/workload'
import LineChart from '@/components/echarts/LineChart'
// import kpiComponent from './components/kpiComponent'
import splitWorkload from './components/splitWorkload'

export default {
  name: 'WorkloadHidden',
  components: { LineChart, LineChartBig, splitWorkload },
  filters: {},
  data() {
    return {
      airport: this.$store.state.user.airport,
      pickerOptions1: {
        disabledDate: (time) => {
          var tempDate = new Date(this.topDate[0])
          var endDateBottom = new Date(tempDate)
          endDateBottom.setDate(tempDate.getDate())
          var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
          return time.getTime() > new Date(this.topDate[1]).getTime() || time.getTime() < new Date(datetimeBottom).getTime() // 限制选择的日期（不能选择当天）
        }
      },
      flightScheduleId: '',
      flightDocType: false,
      flag: false,
      operationId: '',
      renewDialogVisible: false,
      renewForm: {},
      renewFormrules: {
        name: [{ required: true, message: '请填写工作量名称', trigger: 'blur' }],
        workloadModulus: [{ required: true, message: '请填写冗余系数', trigger: ['change', 'blur'] }]
      },
      dataDataList: [],
      commonDocumentId: '',
      skillCopyOptions: [],
      copydialogTableVisible: false,
      copyForm: { workloadName: '', skillIds: [], date: '' },
      copyFormrules: {
        workloadName: [{ required: true, message: '请填写工作量名称', trigger: 'blur' }],
        skillIds: [{ required: true, message: '请选择技能', trigger: ['blur', 'change'] }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      dataBlank: false,
      businessDomainId: this.$route.query.businessDomainId,
      searchForm: {},
      type: this.$route.query.type,
      position: 'right',
      topDate: ['', ''],
      bottomDate: ['', ''],
      shiftPlanName: '',
      workloadSampling: '',
      granularityInterval: '5',
      particle01: '1分钟',
      rulesetDocumentId: '',
      dialogTableVisible: false,
      listLoading: false,
      documentId: this.$route.query.id,
      lineChartDataBig: {},
      lineChartData: [],
      dialogTableVisibleSplit: false,
      editForm: '',
      calculate: '',
      skillOptions: [],
      skillNames: [],
      FLIGHT_SCHEDULE: '', //
      particle02: '5min',
      result: '',
      workloadSlect: '',
      options: [
        { value: 'MAX', label: '最大值' },
        { value: 'MIN', label: '最小值' },
        { value: 'AVG', label: '平均值' }
      ],
      options1: [
        { value: '1', label: '1min' },
        { value: '5', label: '5min' }
      ],
      options2: [
        { value: '5', label: '5分钟' },
        { value: '10', label: '10分钟' }
      ],
      value3: 'Max',
      activeName2: 'first',
      formLabelWidth: '120px',
      form: {},
      dataData: {},
      // 拆分工作量
      splitCondition: true,
      splitResult: false,
      splitData: [],
      activeName: '1',
      retainShow: false,
      splitShow: false,
      firstSplitName: '',
      secondSplitName: '',
      firstDocumentId: '',
      secondDocumentId: '',
      documentIdR: this.documentId,
      rules: {
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        retainNum: [
          { required: true, message: '请输入数据', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        mode: [{ required: true, message: '请选择拆分模式', trigger: 'change' }],
        num: [
          { required: true, message: '请输入数据', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      },
      page: {
        pageSize: 20,
        pageNum: '1',
        currentPage: '1',
        total: 0,
        workloadDocumentId: this.$route.query.id
      },
      tableData: []
    }
  },
  created() {
    this.skillChange()
  },
  mounted() {
    this.search2()
    // this.skillCopyList()
  },
  methods: {
    // 航班计划跳转
    jumpFlight() {
      if (this.flightDocType === 'DAY_FLIGHT_SCHEDULE') {
        this.$router.push({ path: '/prepare/flightPlan', query: { documentId: this.flightScheduleId, documentType: this.flightDocType } })
      } else {
        this.$router.push({ path: '/prepare/flightPlanNew', query: { documentId: this.flightScheduleId, airportId: '', newOld: true } })
      }
    },
    // 作业标准跳转
    jumpOperation() {
      if (this.businessDomainId === '1') {
        this.$router.push({ path: '/newcheckIn/details', query: { id: this.operationId, businessDomainId: this.businessDomainId } })
      } else {
        this.$router.push({ path: '/dispatching/securityChannel/details', query: { id: this.operationId, businessDomainId: this.businessDomainId } })
      }
    },
    // 重新生成
    renewHandler() {
      this.renewDialogVisible = true
      this.renewForm = {}
    },
    // 重新生成的确认按钮
    renewBtn() {
      this.renewForm.documentId = this.commonDocumentId
      this.$refs['renewForm'].validate((valid) => {
        if (valid) {
          renewWorkload(this.renewForm)
            .then((response) => {
              this.$message.success('重新生成成功')
              this.$router.push({ path: '/prepare/workloadNew', query: { businessDomainId: this.businessDomainId } })
              this.renewDialogVisible = false
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message || '500 服务器错误'
              })
            })
        }
      })
    },
    // 控制展开行的右箭头是否显示
    setClassName({ row, index }) {
      // 判断展开列表是否有数据，有则展开无则隐藏
      return !row.tasks ? 'expand' : ''
    },
    skillCopyList() {
      skillCopy(this.commonDocumentId).then((response) => {
        this.skillCopyOptions = response.data.data
      })
    },
    copyWorkloadClick() {
      this.copydialogTableVisible = true
      if (this.$refs.copyForm) {
        this.$refs.copyForm.resetFields()
      }
    },
    // 复制工作量确定按钮
    copyWorkloadBtn() {
      this.copyForm.businessDomainId = this.businessDomainId
      this.$refs['copyForm'].validate((valid) => {
        if (valid) {
          var data = {
            fromDate: this.copyForm.date[0],
            toDate: this.copyForm.date[1],
            workloadDocumentId: this.commonDocumentId,
            skillIds: this.copyForm.skillIds,
            workloadName: this.copyForm.workloadName
          }
          this.copyForm.fromDate = this.copyForm.date[0]
          this.copyForm.toDate = this.copyForm.date[1]
          copyWorkload(data)
            .then((response) => {
              this.$message.success('复制成功')
              this.copydialogTableVisible = false
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message || e.response.status + '' + e.response.statusText
              })
            })
        }
      })
    },
    handleClick() {},
    mergeWorkload() {
      // console.log(this.commonDocumentId, 666)
      this.$router.push({
        path: '/prepare/workloadHiddenNew/mergeIndex',
        query: { documentId: this.commonDocumentId, name: this.$route.query.name, type: 'skill', businessDomainId: this.businessDomainId }
      })
    },
    splitWorkload() {
      this.splitData = []
      var data = {
        // id: this.documentId.toString(),
        id: this.commonDocumentId,
        startDate: '',
        endDate: ''
      }
      workloadDetails(data)
        .then((response) => {
          response.data.data.items.forEach((element) => {
            this.splitData.push({
              label: element.skill.name,
              name: element.skill.id.toString(),
              ruleForm: {}
            })
          })
          this.activeName = this.splitData[0].name
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message || e.response.status + '' + e.response.statusText
          })
        })
      this.dialogTableVisibleSplit = true
      // this.$router.push({ path: '/prepare/workloadHiddenNew/splitIndex', query: { documentId: this.documentId } })
    },
    search2() {
      // 时间筛选查询
      if (this.type === 'FLIGHT_WORKLOAD' || this.type === 'FIXED_WORKLOAD' || this.type === 'PREDICTION_WORKLOAD') {
        this.listLoading = true
        this.lineChartData = []
        var data = {
          id: this.documentId,
          startDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : ''
        }
        workloadDetailsNew(data)
          .then((response) => {
            this.listLoading = false
            var _this = this
            if (!response.data.data) {
              this.dataBlank = true
            } else {
              this.operationId = response.data.data.operationStandardId
              this.flightScheduleId = response.data.data.flightScheduleId
              this.flightDocType = response.data.data.flightDocType
              this.commonDocumentId = response.data.data.workloadDocumentId
              this.skillCopyList()
              var startDateBottom = response.data.data.startDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = response.data.data.startDate.substring(0, 10)
              var endDate = response.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.shiftPlanName = response.data.data.name
              this.workloadSampling = response.data.data.samplingMode + ''
              this.FLIGHT_SCHEDULE = response.data.data.flightScheduleName
              this.granularityInterval = response.data.data.minResultInterval
              this.rulesetDocumentId = response.data.data.operationStandardName
              this.workloadSampling = response.data.data.samplingMode
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
              var aa = response.data.data.items
              if (aa.length === 0) {
                this.dataBlank = true
              } else {
                aa.forEach((element) => {
                  var data1 = {}
                  data1.role = element.skill.name
                  data1.datas = []
                  element.dailyWorkloads.forEach((element2) => {
                    var data2 = {}
                    data2.day = element2.date
                    data2.maxNum = element2.maxNum
                    data2.maxTimeLength = element2.maxTimeLength
                    data2.maxStrDate = element2.maxStrDate
                    data2.warnLine = true
                    data2.maxNumAll = element.maxNum
                    data2.yName = '数量'
                    data2.totalWorkingHours = element2.totalWorkingHours
                    data2.titleShow = true
                    data2.actualData = []
                    data2.dataX = []
                    element2.details.forEach((element3) => {
                      // data2.actualData.push(element3.num)
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
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message || e.response.status + '' + e.response.statusText
            })
          })
      } else if (this.type === 'GUARD_WORKLOAD') {
        var _this = this
        this.lineChartData = []
        var dataData = {
          businessDomainId: this.businessDomainId,
          documentId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : ''
        }
        workloadDetails2(dataData).then((res) => {
          if (res.data.code === '200') {
            this.dataDataList = res.data.data.reqs
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              this.operationId = response.data.data.operationStandardId
              this.flightScheduleId = response.data.data.flightScheduleId
              this.flightDocType = response.data.data.flightDocType
              this.commonDocumentId = res.data.data.workloadDocumentId
              this.skillCopyList()
              var startDateBottom = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = res.data.data.fromDate.substring(0, 10)
              var endDate = res.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.dataData = Object.assign({}, res.data.data)
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
              var aa = res.data.data.workloads
              aa.forEach((element) => {
                var data1 = {}
                data1.role = element.skill.name
                data1.datas = []
                element.dailyWorkloads.forEach((element2) => {
                  var data2 = {}
                  data2.day = element2.date
                  data2.maxNum = element2.maxNum
                  data2.maxTimeLength = element2.maxTimeLength
                  data2.maxStrDate = element2.maxStrDate
                  data2.yName = element.resourceName
                  data2.warnLine = false
                  data2.maxNumAll = element.maxNum
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
          businessDomainId: this.businessDomainId,
          workloadSettingId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : ''
        }
        initNewTable3(dataData2).then((res) => {
          if (res.data.code === '200') {
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              this.operationId = response.data.data.operationStandardId
              this.flightScheduleId = response.data.data.flightScheduleId
              this.flightDocType = response.data.data.flightDocType
              this.commonDocumentId = res.data.data.workloadDocumentId
              this.skillCopyList()
              var startDateBottom = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = res.data.data.fromDate.substring(0, 10)
              var endDate = res.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.dataData = Object.assign({}, res.data.data)
              if (this.skillOptions) {
                this.skillOption = sessionStorage.getItem('skillOptions')
              }
              this.skillOptions.forEach((items) => {
                this.dataData.skills.forEach((itm) => {
                  if (items.skillId === itm) {
                    this.skillNames.push(items.skillName)
                  }
                })
              })
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
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
                  data2.maxStrDate = element2.maxStrDate
                  data2.maxTimeLength = element2.maxTimeLength
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
              console.log(this.lineChartData, 666)
            }
          }
        })
      } else if (this.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        var that = this
        this.lineChartData = []
        var dataData2 = {
          businessDomainId: this.businessDomainId,
          workloadSettingId: this.documentId,
          beginDate: this.bottomDate[0] ? this.bottomDate[0] : '',
          endDate: this.bottomDate[1] ? this.bottomDate[1] : ''
        }
        initFlightDynamicWorkload(dataData2).then((res) => {
          if (res.data.code === '200') {
            this.listLoading = false
            if (res.data.data.length === 0) {
              this.dataBlank = true
            } else {
              this.operationId = response.data.data.operationStandardId
              this.flightScheduleId = response.data.data.flightScheduleId
              this.flightDocType = response.data.data.flightDocType
              this.commonDocumentId = res.data.data.workloadDocumentId
              this.skillCopyList()
              var startDateBottom = res.data.data.fromDate.substring(0, 10)
              var tempDate = new Date(startDateBottom)
              var endDateBottom = new Date(tempDate)
              endDateBottom.setDate(tempDate.getDate() + 6)
              var datetimeBottom = endDateBottom.getFullYear() + '-' + (endDateBottom.getMonth() + 1) + '-' + endDateBottom.getDate() + ' '
              this.dataBlank = false
              var startDate = res.data.data.fromDate.substring(0, 10)
              var endDate = res.data.data.endDate
              this.topDate = [startDate ? startDate.substring(0, 10) : '', endDate ? endDate.substring(0, 10) : '']
              this.dataData = Object.assign({}, res.data.data)
              if (this.skillOptions) {
                this.skillOption = sessionStorage.getItem('skillOptions')
              }
              this.skillOptions.forEach((items) => {
                this.dataData.skills.forEach((itm) => {
                  if (items.skillId === itm) {
                    this.skillNames.push(items.skillName)
                  }
                })
              })
              if (!this.bottomDate[0]) {
                this.bottomDate = [startDateBottom, datetimeBottom]
              }
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
                  data2.maxTimeLength = element2.maxTimeLength
                  data2.maxStrDate = element2.maxStrDate
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
              // console.log(this.lineChartData, 666)
            }
          }
        })
      }
    },
    skillChange() {
      var data = {
        airportId: this.airport.airportId,
        businessDomainId: this.businessDomainId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
    },
    handleClick2(val) {
      if (val === 'second') {
        this.listLoading = true
        this.page.workloadDocumentId = this.$route.query.id
        // flights(this.page).then(response => {
        //   if (response.data.data) {
        //     this.tableData = response.data.data.list
        //     this.page = response.data.data
        //   }
        this.listLoading = false
        // })
      }
    },
    exportClick1() {
      if (this.type === 'HIST_TASK_WORKLOAD') {
        window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/workloads/' + this.commonDocumentId + '/export'
      } else {
        window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/workloads/' + this.commonDocumentId + '/export'
      }
    },
    exportClick() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/workloads/' + this.documentId + '/tasks/export'
    },
    // modifyWorkload() {
    //   // 修改工作量
    //   if (this.type === 'FLIGHT_WORKLOAD' || this.type === 'FIXED_WORKLOAD') {
    //     this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: this.$route.query.id, type: this.type, businessDomainId: this.businessDomainId || '' } })
    //   } else if (this.type === 'GUARD_WORKLOAD') {
    //     this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: this.$route.query.id, type: this.type, businessDomainId: this.businessDomainId || '' } })
    //   } else if (this.type === 'HIST_TASK_WORKLOAD') {
    //     this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: this.$route.query.id, type: this.type, businessDomainId: this.businessDomainId || '' } })
    //   }
    // },
    // 拆分工作量时拆分模式设置
    modeChange(e) {
      if (e === 'line') {
        this.retainShow = true
        this.splitShow = false
      } else {
        this.retainShow = false
        this.splitShow = true
      }
    },
    // 提交拆分工作量数据
    submitForm(formName, index) {
      this.$refs[formName][index].validate((valid) => {
        if (valid) {
          // debugger
          var data = []
          this.splitData.forEach((element) => {
            if (Object.keys(element.ruleForm).length > 2) {
              var yNumber = element.ruleForm.mode === 'line' ? element.ruleForm.retainNum : element.ruleForm.num
              data.push({
                // id: this.documentId,
                id: this.commonDocumentId,
                mode: element.ruleForm.mode,
                beginTime: element.ruleForm.time[0],
                endTime: element.ruleForm.time[1],
                yNumber: yNumber,
                skillId: element.name
              })
            }
          })
          cut(data)
            .then((response) => {
              this.$parent.dialogTableVisibleSplit = true
              this.splitCondition = false
              this.splitResult = true
              this.firstSplitName = response.data.data[0].name
              this.secondSplitName = response.data.data[1].name
              this.firstDocumentId = response.data.data[0].id
              this.secondDocumentId = response.data.data[1].id
              this.$message({
                message: response.data.message,
                type: 'success'
              })
              // this.$router.push({ path: '/prepare/allPages/workload' })
              // }
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message || e.response.status + '' + e.response.statusText
              })
            })
        } else {
          return false
        }
      })
    },
    // 拆分工作量提交后第一个跳转
    firstJump() {
      this.$router.push({
        path: '/prepare/workloadHiddenNew',
        query: { id: this.firstDocumentId, name: this.firstSplitName, type: 'FIXED_WORKLOAD', businessDomainId: this.businessDomainId }
      })
    },
    secondJump() {
      this.$router.push({
        path: '/prepare/workloadHiddenNew',
        query: { id: this.secondDocumentId, name: this.secondSplitName, type: 'FIXED_WORKLOAD', businessDomainId: this.businessDomainId }
      })
    },
    // 取消按钮
    goBack() {
      this.dialogTableVisibleSplit = false
      // this.$router.go(-1)
    },
    showEchart(items, skill) {
      // 点击显示大图
      console.log(items, 'items')
      this.lineChartDataBig = items
      this.lineChartDataBig.totalCount = items.totalWorkingHours
      this.lineChartDataBig.bigDay = skill + ' ' + items.day
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
      // location.reload()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleClick2('second')
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.page.currentPage = val
      this.handleClick2('second')
    }
  }
}
</script>

<style scoped>
.body >>> .el-dialog__body {
  padding: 30px 100px;
}
.el-pagination {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #263257;
  left: 0;
  margin: 0;
  padding: 10px;
}
.el-table /deep/ th {
  background: #09163e;
}
.el-table >>> .expand .el-table__expand-column .cell {
  display: none;
}
.taskList /deep/ th {
  background: #263257;
  border-bottom: 1px solid #273252;
}
.taskList /deep/th > .cell {
  padding: 0;
  border-bottom: 1px solid #09163e;
}
.taskList /deep/td {
  padding: 0;
  background: #1a2748;
}
.flight-schedule {
  color: #409eff;
}
.flight-schedule:hover {
  cursor: pointer;
}
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
  margin: 10px 0;
  padding: 10px;
}

.search-area /deep/ .el-col {
  height: 40px;
}
.body /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  font-size: 14px;
  margin: 10px 0;
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
  /* justify-content: space-around; */
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
  height: 200px;
}

.flight-top {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 35px 15px;
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
/* // 拆分工作量 */
.box-card {
  width: 80%;
  margin: 0 auto;
}

.box-card /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}

.box-card /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.body1 /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  font-size: 14px;
  margin: 10px 0;
}

.explanation {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.preview-picture {
  float: right;
  color: #8492a6;
  font-size: 13px;
  color: aqua;
}

.columnName {
  display: flex;
  height: 30px;
  // align-items: center;
  margin-top: 10px;
  background-color: #172449;
  font-size: 14px;
}

.columnName1 {
  width: 10%;
  margin-left: 5px;
  border-right: 1px solid #4d6cab;
}

.preview-picture:hover {
  color: blue;
}

.split-name {
  color: rgb(37, 145, 216);
}

.split-name:hover {
  color: aqua;
  cursor: pointer;
  text-decoration: underline;
}
.workload-name {
  height: 30px;
  line-height: 30px;
}
.split-button {
  width: 60%;
  height: 66px;
  position: fixed;
  left: 20%;
  background-color: #0a132f;
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
.right {
  border-left: 1px solid #4d6cab;
}
.runtime-bottom {
  margin-top: 0;
}
</style>
