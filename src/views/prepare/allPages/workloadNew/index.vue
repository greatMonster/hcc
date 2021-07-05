<template>
  <div class="body" style="margin-top:60px">
    <div class="header-search">
      <div class="search-file">
        <!-- <span>快速搜索文件</span> -->
        <el-input v-model="input21" size="small" placeholder="输入搜索关键字" suffix-icon="el-icon-search" clearable />
      </div>
      <div style="margin-left:30px;">
        <el-button type="primary" size="small" @click="initableSearch">查 询</el-button>
      </div>
      <div v-if="businessDomainId!=1" class="right-section2">
        <el-button type="primary" size="small" @click="newWorkloadClick">新 增</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="importClick">导 入</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeCn" label="工作量类型" />
        <el-table-column prop="granularityInterval" label="结果粒度" />
        <el-table-column prop="modifyTime" label="更新时间" />
        <!-- <el-table-column prop="createUser" label="创建者" /> -->
        <el-table-column prop="modifyUser" label="修改者" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="modify(scope.$index,scope.row)">修 改</el-button> -->
            <el-button :disabled="scope.row.type=='FIXED_WORKLOAD'||scope.row.type=='PREDICTION_WORKLOAD'" type="primary" size="mini" @click="modifyWorkload(scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增dialog -->
    <div>
      <el-dialog v-dialogDrag title="新增工作量" :visible.sync="dialogTableVisible" width="55%">
        <el-form ref="createForm" :model="createForm" label-width="130px" :label-position="position" :rules="formRules">
          <el-form-item label="工作量类型" prop="radio">
            <el-radio-group v-model="createForm.radio" @change="changeClick('createForm')">
              <el-radio :label="'FLIGHT_WORKLOAD'">航班计划工作量</el-radio>
              <el-radio :label="'GUARD_WORKLOAD'">值守工作量</el-radio>
              <el-radio :label="'HIST_TASK_WORKLOAD'">历史任务</el-radio>
              <el-radio :label="'FLIGHT_DYNAMIC_WORKLOAD'">航班动态工作量</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="createForm.radio=='FLIGHT_WORKLOAD'" key="1">
            <el-form-item label="工作量名称" prop="name">
              <el-input v-model="createForm.name" size="small" maxlength="100" />
            </el-form-item>
            <el-form-item label="航班计划" prop="flightScheduleId">
              <el-select v-model="createForm.flightScheduleId" size="small" @change="flightScheduleChange">
                <el-option v-for="item in flightoptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始与结束日期" prop="topDate">
              <el-date-picker
                v-model="createForm.topDate"
                size="small"

                clearable
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                @change="changeType"
              />
              <span v-if="offon">航班数：{{ datanum }}</span>
            </el-form-item>
            <el-form-item label="作业标准" prop="operationStandardId">
              <el-select v-model="createForm.operationStandardId" filterable size="small" placeholder="请选择">
                <el-option v-for="item in workRulesDocOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="计算粒度" prop="minCalculationInterval">
              <el-input v-model="createForm.minCalculationInterval" size="small" disabled />
            </el-form-item>
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
            <el-form-item label="抽样模式" prop="samplingMode">
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
          </div>
          <div v-if="createForm.radio=='GUARD_WORKLOAD'" key="2">
            <el-form-item label="开始与结束日期" prop="topDate2" required>
              <el-date-picker v-model="createForm.topDate2" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="名称" prop="name2">
              <el-input v-model="createForm.name2" maxlength="100" />
            </el-form-item>
            <el-form-item label="计算结果粒度" prop="minResultInterval2">
              <el-select v-model="createForm.minResultInterval2" placeholder="请选择">
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
            <el-form-item label="抽样模式" prop="samplingMode2">
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
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="el-icon-d-caret" />时间人数设定
                </template>
                <el-button class="filter-item" size="mini" style="margin-bottom: 10px;" type="primary" icon="el-icon-edit" @click="dialogAdd=true">添加</el-button>
                <el-table :data="datalist" border stripe>
                  <el-table-column prop="skill" label="技能">
                    <template slot-scope="scope">
                      <span>{{ scope.row.skill.skillName }}</span>
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
                      <el-button type="primary" size="small" @click="removeList(scope.$index,datalist)">删 除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-if="createForm.radio=='HIST_TASK_WORKLOAD'" key="3">
            <el-form-item label="工作量名称" prop="name3">
              <el-input v-model="createForm.name3" size="small" maxlength="100" style="width:30%" />
            </el-form-item>
            <el-form-item label="员工技能" prop="skillId" required>
              <el-select v-model="createForm.skillId" placeholder="请选择" multiple collapse-tags @change="skillChanged">
                <el-option v-for="(items) in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
              </el-select>
            </el-form-item>
            <el-form-item prop="topDate3" required>
              <div slot="label" style="display:inline-block">
                历史任务时间
                <el-tooltip content="只可选择七天" placement="top">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker
                v-model="createForm.topDate3"
                clearable
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="isDisabled"
                :picker-options="pickerOptions3"
              />
            </el-form-item>
            <el-form-item prop="topDate4" required>
              <div slot="label" style="display:inline-block">
                工作量时间
                <el-tooltip content="对应历史任务中一周的每天循环" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.topDate4" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="计算结果粒度" prop="minResultInterval3">
              <el-select v-model="createForm.minResultInterval3" placeholder="请选择">
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
            <el-form-item label="抽样模式" prop="samplingMode3">
              <el-select v-model="createForm.samplingMode3" placeholder="请选择">
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
          </div>
          <!-- 航班动态工作量 -->
          <div v-if="createForm.radio=='FLIGHT_DYNAMIC_WORKLOAD'" key="4">
            <el-form-item label="工作量名称" prop="name4">
              <el-input v-model="createForm.name4" size="small" maxlength="100" />
            </el-form-item>
            <el-form-item label="员工技能" prop="skillId4" required>
              <el-select v-model="createForm.skillId4" placeholder="请选择" @change="changeSkillClick(createForm.skillId4,skillOptions)">
                <el-option v-for="(items) in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
              </el-select>
            </el-form-item>
            <div v-if="skillFlag">
              <el-form-item label="派工标准" prop="operationStandardId4">
                <el-input v-model="operationStandardId4" size="small" disabled maxlength="100" />
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="派工标准" prop="operationStandardId4">
                <el-select v-model="createForm.operationStandardId4" filterable size="small" placeholder="请选择">
                  <el-option v-for="item in workRulesDocOptions4" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item prop="FlightTime" required>
              <div slot="label" style="display:inline-block">
                航班动态时间
                <el-tooltip content="只可选择七天" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.FlightTime" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item prop="topDate4" required>
              <div slot="label" style="display:inline-block">
                工作量时间
                <el-tooltip content="对应历史任务中一周的每天循环" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.topDate4" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="计算结果粒度" prop="minResultInterval3">
              <el-select v-model="createForm.minResultInterval3" placeholder="请选择">
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
            <el-form-item label="抽样模式" prop="samplingMode3">
              <el-select v-model="createForm.samplingMode3" placeholder="请选择">
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
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDetermin">返 回</el-button>
          <el-button type="primary" size="small" :loading="submitLoading" @click="addConfirmClick('createForm')">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 添加人数和时间 -->
      <el-dialog v-dialogDrag :visible.sync="dialogAdd" title="添加技能" class="delogData">
        <el-form ref="skillform" :model="skillform" :rules="skillrules">
          <el-form-item label="选择技能" prop="skill" :label-width="formLabelWidth">
            <el-select v-model="skillform.skill" placeholder="请选择" value-key="skillId">
              <el-option v-for="(items) in skillOptions" :key="items.skillId" :label="items.skillName" :value="items" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="date" label="时间" :label-width="formLabelWidth">
            <el-time-picker v-model="skillform.date" arrow-control="true" format="HH:mm" value-format="HH:mm:ss" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
          </el-form-item>-->
          <el-form-item prop="startTime" label="开始时间" :label-width="formLabelWidth">
            <vue-timepicker v-model="skillform.startTime" format="HH:mm" />
          </el-form-item>
          <el-form-item prop="finisheTime" label="结束时间" :label-width="formLabelWidth">
            <vue-timepicker v-model="skillform.finisheTime" format="HH:mm" />
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
    </div>
  </div>
</template>

<script>
import { remove, removeFlightDynamic, initNewTable, flightoptions, workStandard2, workStandard, addWorkload, init, skill, addWorkload2, addWorkload3, dataNum, historyDate, addDynamicWorkload } from '@/apiNew/workload'
import { timeData } from '@/api/passengerFlow'
import VueTimepicker from 'vue2-timepicker'
export default {
  name: 'Workload2',
  components: { VueTimepicker },
  data() {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          return this.dealDisabledDate(time)
        }
      },
      pickerOptions2: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          return this.dealDisabledDate2(time)
        }
      },
      pickerOptions3: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate) {
            const one = 6 * 24 * 3600 * 1000
            this.maxTime = this.pickerMinDate + one
            this.minTime = this.pickerMinDate - one
            if (this.dateArrayCopy[0] > this.minTime) {
              this.minTime = this.dateArrayCopy[0]
            }
            if (this.dateArrayCopy[this.dateArrayCopy.length - 1] < this.maxTime) {
              this.maxTime = this.dateArrayCopy[this.dateArrayCopy.length - 1]
            }
            return time.getTime() < this.minTime || time.getTime() > this.maxTime
          } else {
            if (this.dateArrayCopy.length === 0) {
              return time.getTime()
            } else {
              if (this.dateArrayCopy.indexOf(time.getTime()) !== -1) {
                return false
              } else {
                return true
              }
            }
          }
        }
      },
      isDisabled: true,
      dateArray: [],
      dateArrayCopy: [],
      offon: false,
      isShow: false,
      businessDomainId: this.$route.query.businessDomainId || '',
      isSearchClick: 1,
      input21: '',
      datanum: '',
      tableData: [],
      activeNames: '1',
      position: 'right',
      skillOptions: [],
      skillform: {
        skill: '',
        date: '',
        reqNum: '',
        startTime: { HH: '00', mm: '00' },
        finisheTime: { HH: '00', mm: '00' }
      },
      formLabelWidth: '180px',
      dialogAdd: false,
      dialogTableVisible: false,
      submitLoading: false,
      skillFlag: false,
      createForm: {
        name4: '',
        skillId: '',
        skillId4: '',
        flightScheduleId: '',
        operationStandardId: '',
        radio: 'FLIGHT_WORKLOAD',
        minResultInterval: 5,
        minResultInterval3: 5,
        minResultInterval2: 5,
        minCalculationInterval: '1分钟',
        samplingMode: 'AVG',
        topDate: ['', ''],
        samplingMode2: 'AVG',
        samplingMode3: 'AVG'
      },
      flightoptions: [],
      datalist: [],
      flightBeginDate: '',
      flightEndDate: '',
      workRulesDocOptions: [],
      workRulesDocOptions4: [],
      operationStandardId4: '摆渡车自定义作业标准',
      options2: [
        { value: 5, label: '5分钟', explanation: '计算结果按照每5分钟展示' },
        { value: 10, label: '10分钟', explanation: '计算结果按照每10分钟展示' }
      ],
      options: [
        { value: 'MAX', label: '最大值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最大值' },
        { value: 'MIN', label: '最小值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取最小值' },
        { value: 'AVG', label: '平均值', explanation: ' 例如:结果粒度是5分钟,这5分钟将产生5个计算结果，取平均值' }
      ],
      formRules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name2: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name4: [{ required: true, message: '不能为空', trigger: 'blur' }],
        topDate: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        topDate2: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        topDate3: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        topDate4: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        FlightTime: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        flightScheduleId: [{ required: true, message: '不能为空', trigger: 'change' }],
        minResultInterval: [{ required: true, message: '不能为空', trigger: 'change' }],
        minResultInterval2: [{ required: true, message: '不能为空', trigger: 'change' }],
        skillId: [{ required: true, message: '不能为空', trigger: 'change' }],
        skillId4: [{ required: true, message: '不能为空', trigger: 'change' }],
        minResultInterval3: [{ required: true, message: '不能为空', trigger: 'change' }],
        operationStandardId: [{ required: true, message: '不能为空', trigger: 'change' }],
        operationStandardId4: [{ required: true, message: '不能为空', trigger: 'change' }],
        samplingMode2: [{ required: true, message: '不能为空', trigger: 'change' }],
        samplingMode3: [{ required: true, message: '不能为空', trigger: 'change' }],
        samplingMode: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      skillrules: {
        skill: [{ required: true, message: '不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        finisheTime: [{ required: true, message: '不能为空', trigger: ['change', 'blur'] }],
        reqNum: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  computed: {},
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initable()
      }

    }
  },
  created() {
    if (this.businessDomainId === '1') {
      this.isShow = false
    } else {
      this.isShow = true
    }
    if (this.$route.query.id) {
      var data = {
        airportId: this.airport.airportId,
        id: this.$route.query.id
      }
      init(data).then((res) => {
        this.tableData = res.data.data
        this.listLoading = false
      })
    } else {
      this.initData()
    }
    this.workrules()
    this.flightSelect()
    this.skillChange()
  },
  methods: {
    // 选择技能时的历史任务时间查询
    skillChanged(val) {
      this.dateArray = []
      const data = {
        skillIds: this.createForm.skillId.join(','),
        businessDomainId: this.businessDomainId
      }
      historyDate(data).then((response) => {
        // console.log(response.data.data)
        this.dateArray = response.data.data
        this.dateArrayCopy = []
        for (let i = 0; i < this.dateArray.length; i++) {
          this.dateArrayCopy.push(new Date(this.dateArray[i]).getTime())
        }
        this.isDisabled = false
      })
    },
    modifyWorkload(row) {
      // 修改工作量
      if (row.type === 'FLIGHT_WORKLOAD' || row.type === 'FIXED_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadDocumentId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'GUARD_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'HIST_TASK_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      }
    },
    importClick() {
      this.$router.push({ path: '/prepare/importFile', query: { businessDomainId: this.businessDomainId }})
    },
    flightChange(e) {
      console.log(e)
    },
    // 航班计划下拉数据
    flightSelect() {
      var data = {
        airportId: this.airport.airportId
      }
      flightoptions(data).then((response) => {
        this.flightoptions = response.data.data
      })
    },
    // 作业标准下拉数据
    workrules() {
      var data = {
        airportId: this.airport.airportId,
        businessDomainId: this.$route.query.businessDomainId
      }
      workStandard(data).then((response) => {
        this.workRulesDocOptions = response.data.data
      })
      workStandard2(data).then((response) => {
        if (response.data.code === '200') {
          this.workRulesDocOptions4 = response.data.data
          this.createForm.operationStandardId4 = response.data.data[0].id
        }
      })
    },
    // 技能下拉数据
    skillChange() {
      var data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        airportId: this.airport.airportId
      }
      skill(data).then((response) => {
        this.skillOptions = response.data
        sessionStorage.setItem('skillOptions', response.data)
      })
    },
    flightScheduleChange() {
      var data = {
        flightScheduleId: this.createForm.flightScheduleId,
        airportId: this.airport.airportId
      }
      timeData(data).then((res) => {
        this.flightBeginDate = res.data.data.beginDate
        this.flightEndDate = res.data.data.endDate
      })
    },
    changeClick(createForm) {
      this.createForm.flightScheduleId = ''
      this.isDisabled = true
      this.createForm.minResultInterval = ''
      this.createForm.minResultInterval = ''
      this.createForm.skillId = ''
      this.createForm.skillId4 = ''
      this.createForm.minResultInterval3 = ''
      this.createForm.samplingMode3 = ''
      this.createForm.samplingMode = ''
      this.createForm.operationStandardId = ''
    },
    changeSkillClick(id, data) {
      data.forEach(element => {
        if (element.skillId === id) {
          if (element.isFerryType) {
            this.skillFlag = true
          } else {
            this.skillFlag = false
            this.createForm.operationStandardId4 = this.workRulesDocOptions4[0].id
          }
        }
      })
    },
    changeType() {
      if (this.createForm.topDate && this.createForm.flightScheduleId) {
        var data = {
          startTime: this.createForm.topDate[0],
          endTime: this.createForm.topDate[1],
          documentId: this.createForm.flightScheduleId
        }
        dataNum(data).then((res) => {
          if (res.data.code === '200') {
            this.offon = true
            this.datanum = res.data.data
          }
        })
      }
    },
    initableSearch() {
      this.isSearchClick = 2
      this.initable()
    },
    initable() {
      var data = {
        businessDomainId: this.$route.query.businessDomainId,
        name: this.input21.toString() || '',
        airportId: this.airport.airportId
      }
      initNewTable(data).then((response) => {
        if (response.data.code === '200') {
          this.tableData = response.data.data
          this.listLoading = false
          if (this.isSearchClick === 2) {
            this.$message.success('查询成功')
          }
        }
      })
    },

    addDatePop() {},
    dealDisabledDate(time) {
      // eslint-disable-next-line no-undef
      if (this.pickerMinDate) {
        const one = 6 * 24 * 3600 * 1000
        this.minTime = this.pickerMinDate - one
        this.maxTime = this.pickerMinDate + one
        return time.getTime() < this.minTime || time.getTime() > this.maxTime
      }
    },
    removeList(index, rows) {
      rows.splice(index, 1)
    },
    initData() {
      var data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        name: this.input21.toString() || '',
        airportId: this.airport.airportId
      }
      // console.log(data, 210)
      initNewTable(data).then((response) => {
        if (response.data.code === '200') {
          this.tableData = response.data.data
          this.listLoading = false
        }
      })
    },
    openNext(index, row) {
      if (row.type === 'FLIGHT_WORKLOAD' || row.type === 'FIXED_WORKLOAD' || row.type === 'PREDICTION_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: row.workloadDocumentId, name: row.name, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'GUARD_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'HIST_TASK_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      }
    },

    newWorkloadClick() {
      this.dialogTableVisible = true
      if (this.$refs.createForm) {
        this.$refs.createForm.resetFields()
      }
    },
    dialogAddbtn(formName) {
      console.log(this.skillform.finisheTime)
      this.$refs[formName].validate((valid) => {
        this.skillform.beginTime = this.skillform.startTime.HH + ':' + this.skillform.startTime.mm
        this.skillform.endTime = this.skillform.finisheTime.HH + ':' + this.skillform.finisheTime.mm
        // this.skillform.beginTime = this.skillform.date[0]
        // this.skillform.endTime = this.skillform.date[1]
        this.skillform.skill.id = this.skillform.skill.skillId
        console.log(this.skillform)
        this.datalist.push(this.skillform)
        this.dialogAdd = false
        this.skillform
      })
      this.skillform = {
        skill: '',
        date: '',
        reqNum: '',
        startTime: { HH: '00', mm: '00' },
        finisheTime: { HH: '00', mm: '00' }
      }
      console.log(this.skillform.finisheTime)
    },
    dealDisabledDate2(time) {
      // eslint-disable-next-line no-undef
      return time.getTime() < Date.parse(new Date(this.flightBeginDate)) || time.getTime() > Date.parse(new Date(this.flightEndDate))
    },
    cancelDetermin() {
      if (this.createForm.name || this.createForm.topDate[0] || this.createForm.flightScheduleId || this.createForm.operationStandardId) {
        this.$confirm('已填写的数据将不会被保存，确认返回？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.dialogTableVisible = false
          })
          .catch(() => {})
      } else {
        this.dialogTableVisible = false
      }
    },
    // 新增提交按钮
    addConfirmClick(formName) {
      if (this.createForm.radio === 'FLIGHT_WORKLOAD' || this.createForm.type === 'FIXED_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            var submitForm = {}
            submitForm = this.createForm
            submitForm.startDate = this.createForm.topDate[0]
            submitForm.endDate = this.createForm.topDate[1]
            submitForm.minCalculationInterval = 1
            submitForm.operationStandardId = Number(submitForm.operationStandardId)
            submitForm.businessDomainId = this.businessDomainId
            submitForm.airportId = this.airport.airportId
            addWorkload(submitForm)
              .then((response) => {
                this.submitLoading = false
                this.dialogTableVisible = false
                this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data.workloadDocumentId, type: response.data.data.type, businessDomainId: this.businessDomainId || '' }})
              })
              .catch((e) => {
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
      } else if (this.createForm.radio === 'GUARD_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            var submitForm2 = {
              documentType: this.createForm.radio,
              workloadName: this.createForm.name2,
              fromDate: this.createForm.topDate2[0],
              toDate: this.createForm.topDate2[1],
              granularityInterval: this.createForm.minResultInterval2,
              samplingMode: this.createForm.samplingMode2,
              reqs: this.datalist,
              airportId: this.airport.airportId,
              businessDomainId: this.businessDomainId
            }
            addWorkload2(submitForm2).then((res) => {
              if (res.data.code === '200') {
                this.$message.success(res.data.message)
                this.submitLoading = false
                this.dialogTableVisible = false
                this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: res.data.data, type: this.createForm.radio, businessDomainId: this.businessDomainId || '' }})
              } else {
                this.submitLoading = false
                this.$message.error(res.data.message)
              }
            })
          }
        })
      } else if (this.createForm.radio === 'HIST_TASK_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            var submitForm2 = {
              documentType: this.createForm.radio,
              workloadName: this.createForm.name3,
              taskFromDate: this.createForm.topDate3[0],
              taskToDate: this.createForm.topDate3[1],
              fromDate: this.createForm.topDate4[0],
              toDate: this.createForm.topDate4[1],
              granularityInterval: this.createForm.minResultInterval3,
              samplingMode: this.createForm.samplingMode3,
              skills: this.createForm.skillId,
              airportId: this.airport.airportId,
              businessDomainId: this.businessDomainId
            }
            addWorkload3(submitForm2).then((res) => {
              if (res.data.code === '200') {
                this.$message.success(res.data.message)
                this.submitLoading = false
                this.dialogTableVisible = false
                this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: res.data.data, type: this.createForm.radio, businessDomainId: this.businessDomainId || '' }})
              } else {
                this.submitLoading = true
                this.$message.error(res.data.message)
              }
            })
          }
        })
      } else if (this.createForm.radio === 'FLIGHT_DYNAMIC_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            var submitForm2 = {
              documentType: this.createForm.radio,
              workloadName: this.createForm.name4,
              dynamicFromDate: this.createForm.FlightTime[0],
              dynamicToDate: this.createForm.FlightTime[1],
              fromDate: this.createForm.topDate4[0],
              toDate: this.createForm.topDate4[1],
              dispatchId: this.skillFlag ? 0 : this.createForm.operationStandardId4,
              granularityInterval: this.createForm.minResultInterval3,
              samplingMode: this.createForm.samplingMode3,
              skills: this.createForm.skillId4,
              airportId: this.airport.airportId,
              businessDomainId: this.businessDomainId
            }
            addDynamicWorkload(submitForm2)
              .then((res) => {
                if (res.data.code === '200') {
                  this.$message.success(res.data.message)
                  this.submitLoading = false
                  this.dialogTableVisible = false
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: res.data.data, type: this.createForm.radio, businessDomainId: this.businessDomainId || '' }})
                } else {
                  this.submitLoading = true
                  this.$message.error(res.data.message)
                }
              })
              .catch((e) => {
                this.submitLoading = false
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        })
      }
    },
    modify(index, row) {
      if (row.type === 'FLIGHT_WORKLOAD' || row.type === 'FIXED_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadDocumentId, name: row.name, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'GUARD_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'HIST_TASK_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew/modifyWorkload', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      } else if (row.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
        this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: row.workloadSettingId, type: row.type, businessDomainId: this.businessDomainId || '' }})
      }
    },
    open(index, row) {
      var data = {
        id: row.workloadSettingId,
        type: row.type
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          if (row.type === 'FLIGHT_DYNAMIC_WORKLOAD') {
            removeFlightDynamic(data).then((response) => {
              // if (response.code === '200') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // }
            })
          } else {
            remove(data).then((response) => {
              // if (response.code === '200') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // }
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.body /deep/ .el-dialog__body {
  padding: 20px auto;
}
.body /deep/ .el-dialog__body input {
  width:350px ;
}

.body /deep/ .cell {
  text-align: center;
  padding-left: 10px;
}
.search-file {
  margin-left: 20px;
}
.delogData /deep/ .vue__time-picker /deep/ input.display-time {
  background-color: #1b2541;
  border: 1px solid #425079;
  color: #fff;
}
.delogData /deep/ .vue__time-picker .dropdown ul li {
  background-color: #1b2541;
  color: #fff;
}
.delogData /deep/ .vue__time-picker .dropdown ul {
  border-left: 1px solid #1b2541;
}
.delogData /deep/ .vue__time-picker .dropdown ul li:not([disabled]).active {
  color: #409eff;
  background-color: #1b2541;

  font-weight: 700;
}
img {
  width: 20px;
  height: 20px;
}
.right-section1,
.right-section2,
.right-section3 {
  display: flex;
  width: 60px;
  height: 80px;
  justify-content: space-around;
  align-items: center;
  font-size: 18px;
  color: white;
  vertical-align: middle;
  margin-left: 14%;
  cursor: pointer;
}
.right-section2 {
  margin-left: 1%;
}
.right-section3 {
  margin-left: 4%;
}
.paginate {
  display: flex;
  width: 100%;
  height: 68px;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: right;
  background-color: #0a142f;
}
.pageFloat {
  display: flex;
  width: 100%;
  padding-top: 10px;
  justify-content: flex-end;
  align-items: center;
}
.pageFloat div {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #232c47;
  color: #989a9c;
}
.version-select {
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
</style>
