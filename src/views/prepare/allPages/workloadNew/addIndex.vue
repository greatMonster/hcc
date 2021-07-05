<template>
  <div class="body">
    <p class="title"><i class="el-icon-setting" /> 生成工作量</p>
    <div class="box-item">
      <p class="title">
        <!-- <el-button v-if="disabled" size="mini" type="primary" @click="onStop()">停止计算</el-button> -->
      </p>
      <div>
        <el-form ref="createForm" :model="createForm" label-width="130px" :label-position="position" :rules="formRules" style="width: 75%; margin: 0 auto">
          <el-form-item label="工作量类型" prop="radio">
            <el-radio-group v-model="radio" @change="radioChange">
              <el-radio :label="'FLIGHT_WORKLOAD'">航班计划工作量</el-radio>
              <el-radio :label="'GUARD_WORKLOAD'">值守工作量</el-radio>
              <el-radio :label="'HIST_TASK_WORKLOAD'">历史任务</el-radio>
              <el-radio :label="'FLIGHT_DYNAMIC_WORKLOAD'">航班动态工作量</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="radio == 'FLIGHT_WORKLOAD'">
            <el-form-item label="工作量名称" prop="name">
              <el-input v-model="createForm.name" size="small" maxlength="100" />
            </el-form-item>
            <el-form-item label="航班计划" prop="flightScheduleId">
              <el-select v-model="createForm.flightScheduleId" size="small" @change="flightChange">
                <el-option v-for="item in flightoptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始与结束日期" prop="topDate">
              <el-date-picker v-model="createForm.topDate" size="small" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
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
          <div v-else-if="radio == 'GUARD_WORKLOAD'">
            <el-form-item label="开始与结束日期" prop="topDate2" required>
              <el-date-picker v-model="createForm.topDate2" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="工作量名称" prop="name2">
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
            <el-collapse v-model="activeNames" style="width: 65%">
              <el-collapse-item name="1">
                <template slot="title"> <i class="el-icon-d-caret" />时间人数设定 </template>
                <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="dialogAdd = true">添加</el-button>
                <el-table :data="datalist" border stripe>
                  <el-table-column prop="skill" label="技能">
                    <template slot-scope="scope">
                      <span>{{ scope.row.skill.skillName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.date[0].slice(0, 5) }}-{{ scope.row.date[1].slice(0, 5) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reqNum" label="人数" />
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small" @click="removeList(scope.$index, datalist)">删 除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else-if="radio == 'HIST_TASK_WORKLOAD'">
            <el-form-item label="工作量名称" prop="name3">
              <el-input v-model="createForm.name3" size="small" />
            </el-form-item>
            <el-form-item label="员工技能" prop="skillId">
              <el-select v-model="createForm.skillId" placeholder="请选择" multiple collapse-tags @change="skillChanged">
                <el-option v-for="items in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
              </el-select>
            </el-form-item>
            <el-form-item prop="topDate3" required>
              <div slot="label" style="display: inline-block">
                历史任务时间
                <el-tooltip content="只可选择七天" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.topDate3" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item prop="topDate4" required>
              <div slot="label" style="display: inline-block">
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
          <div v-else-if="radio == 'FLIGHT_DYNAMIC_WORKLOAD'">
            <el-form-item label="工作量名称" prop="FlightName">
              <el-input v-model="createForm.FlightName" size="small" maxlength="100" />
            </el-form-item>
            <el-form-item label="员工技能" prop="skillId" required>
              <el-select v-model="createForm.skillId" placeholder="请选择" @change="skillChanged2">
                <el-option v-for="items in skillOptions" :key="items.skillId" :label="items.skillName" :value="items.skillId" />
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
            <el-form-item prop="FlightTopDate" required>
              <div slot="label" style="display: inline-block">
                航班动态时间
                <el-tooltip content="只可选择七天" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.FlightTopDate" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>

            <el-form-item prop="FlightTopDate2" required>
              <div slot="label" style="display: inline-block">
                工作量时间
                <el-tooltip content="对应历史任务中一周的每天循环" placement="left">
                  <i class="el-icon-question help-icon" />
                </el-tooltip>
              </div>
              <el-date-picker v-model="createForm.FlightTopDate2" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="计算结果粒度" prop="FlightminResultInterval">
              <el-select v-model="createForm.FlightminResultInterval" placeholder="请选择">
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
            <el-form-item label="抽样模式" prop="FlightsamplingMode">
              <el-select v-model="createForm.FlightsamplingMode" placeholder="请选择">
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
          <el-form-item>
            <div style="margin-left: 45%" class="btnTop">
              <el-button @click="cancelDetermin">返 回</el-button>
              <el-button type="primary" :loading="submitLoading" @click="addConfirmClick('createForm')">提 交</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- 添加人数和时间 -->
        <el-dialog v-dialogDrag :visible.sync="dialogAdd" title="添加技能">
          <el-form ref="skillform" :model="skillform" :rules="skillrules">
            <el-form-item label="选择技能" prop="skill" :label-width="formLabelWidth">
              <el-select v-model="skillform.skill" placeholder="请选择" value-key="skillId">
                <el-option v-for="items in skillOptions" :key="items.skillId" :label="items.skillName" :value="items" />
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
      </div>
    </div>
    <!-- <div class="rightbox">
        <div class="box-item">
          <p class="title">优化配置</p>
          <div class="item">
            <p>最小成本：</p>
            <cssRuleTop />
            <el-slider v-model="value1" :step="20" show-stops @change="show(value1)" />
            <p>员工过剩：</p>
            <cssRuleTop />
            <el-slider v-model="value2" :step="20" show-stops @change="show(value2)" />
            <p>员工不足：</p>
            <cssRuleTop />
            <el-slider v-model="value3" :step="20" show-stops @change="show(value3)" />
            <p>偏好优先：</p>
            <cssRuleTop />
            <el-slider v-model="value4" :step="20" show-stops @change="show(value4)" />
            <p />
          </div>
        </div>
    </div>-->
    <!-- <div class="footer">
        <el-button type="primary" @click="onSubmit('form')">确认创建</el-button>
    </div>-->
  </div>
</template>

<script>
import { remove, initNewTable, flightoptions, workStandard, addWorkload, workStandard2, init, skill, addWorkload2, addWorkload3, historyDate, addDynamicWorkload } from '@/apiNew/workload'
export default {
  name: 'AddIndex',
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
      isDisabled: true,
      dateArray: [],
      operationStandardId4: '摆渡车自定义作业标准',
      dateArrayCopy: [],
      radio: 'FLIGHT_WORKLOAD',
      businessDomainId: this.$route.query.businessDomainId || '',
      isSearchClick: 1,
      input21: '',
      tableData: [],
      activeNames: '1',
      position: 'right',
      skillFlag: false,
      workRulesDocOptions4: [],
      skillOptions: [],
      skillform: {
        skill: '',
        date: '',
        reqNum: ''
      },
      formLabelWidth: '180px',
      dialogAdd: false,
      dialogTableVisible: false,
      submitLoading: false,
      // createForm: { minResultInterval: 5, minResultInterval3: 5, minResultInterval2: 5, skillId: '', minCalculationInterval: '1分钟', samplingMode: 'AVG', topDate: ['', ''], samplingMode2: 'AVG', samplingMode3: 'AVG' },
      createForm: { minCalculationInterval: '1分钟' },
      flightoptions: [],
      datalist: [],
      workRulesDocOptions: [],
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
        name: [{ required: true, message: '请输入工作量名称', trigger: 'blur' }],
        FlightName: [{ required: true, message: '请输入工作量名称', trigger: 'blur' }],
        name2: [{ required: true, message: '请输入工作量名称', trigger: 'blur' }],
        name3: [{ required: true, message: '请输入工作量名称', trigger: 'blur' }],
        topDate: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        topDate2: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        topDate3: [{ required: true, message: '请选择历史任务时间', trigger: ['change', 'blur'] }],
        FlightTopDate: [{ required: true, message: '请选择历史任务时间', trigger: ['change', 'blur'] }],
        topDate4: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        FlightTopDate2: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        flightScheduleId: [{ required: true, message: '请选择航班计划', trigger: 'change' }],
        minResultInterval: [{ required: true, message: '请选择计算结果粒度', trigger: 'change' }],
        minResultInterval2: [{ required: true, message: '请选择粒度', trigger: 'change' }],
        skillId: [{ required: true, message: '请选择技能', trigger: 'change' }],

        minResultInterval3: [{ required: true, message: '请选择粒度', trigger: 'change' }],
        FlightminResultInterval: [{ required: true, message: '请选择粒度', trigger: 'change' }],
        operationStandardId: [{ required: true, message: '请选择作业标准', trigger: 'change' }],
        samplingMode2: [{ required: true, message: '请选择抽样模式', trigger: 'change' }],
        samplingMode3: [{ required: true, message: '请选择抽样模式', trigger: ['change', 'blur'] }],
        samplingMode: [{ required: true, message: '请选择抽样模式', trigger: 'change' }],
        FlightsamplingMode: [{ required: true, message: '请选择抽样模式', trigger: 'change' }]
        // skillId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      skillrules: {
        skill: [{ required: true, message: '请选择技能', trigger: 'blur' }],
        date: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        reqNum: [{ required: true, message: '请输入人数', trigger: 'change' }]
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
      }

    }
  },
  created() {
    if (this.$route.query.id) {
      init(this.$route.query.id).then((res) => {
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
    radioChange(e) {
      this.$refs.createForm.clearValidate()
      // this.createForm = { minResultInterval: 5, minResultInterval3: 5, minResultInterval2: 5, skillId: '', minCalculationInterval: '1分钟', samplingMode: 'AVG', topDate: ['', ''], samplingMode2: 'AVG', samplingMode3: 'AVG' }
    },
    flightChange(e) {},
    // 航班计划下拉数据
    flightSelect() {
      var item = {
        businessDomainId: this.businessDomainId,

        airportId: this.airport.airportId
      }
      flightoptions(item).then((response) => {
        this.flightoptions = response.data.data
      })
    },
    // 作业标准下拉数据
    workrules() {
      var item = {
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      workStandard(item).then((response) => {
        this.workRulesDocOptions = response.data.data
      })
      workStandard2(item).then((response) => {
        if (response.data.code === '200') {
          this.workRulesDocOptions4 = response.data.data
          this.createForm.operationStandardId4 = response.data.data[0].id
        }
      })
    },
    // 技能下拉数据
    skillChange() {
      var item = {
        businessDomainId: this.businessDomainId,

        airportId: this.airport.airportId
      }
      skill(item).then((response) => {
        this.skillOptions = response.data
      })
    },
    // 选择技能时的历史任务时间查询
    skillChanged(val) {
      this.dateArray = []
      const data = {
        airportId: this.airport.airportId,
        skillIds: this.createForm.skillId.join(','),
        businessDomainId: this.businessDomainId
      }
      historyDate(data).then((response) => {
        this.dateArray = response.data.data
        this.dateArrayCopy = []
        for (let i = 0; i < this.dateArray.length; i++) {
          this.dateArrayCopy.push(new Date(this.dateArray[i]).getTime())
        }
        this.isDisabled = false
      })
    },
    skillChanged2(val) {
      this.workRulesDocOptions4.forEach(element => {
        if (element.skillId === val) {
          if (element.isFerryType) {
            this.skillFlag = true
          } else {
            this.skillFlag = false
            this.createForm.operationStandardId4 = this.workRulesDocOptions4[0].id
          }
        }
      })
    },
    dealDisabledDate(time) {
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
    initableSearch() {
      this.isSearchClick = 2
      this.initable()
    },
    initable() {
      var data = {
        businessDomainId: this.businessDomainId,
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
        if (response.data.code == 200) {
          this.tableData = response.data.data
          this.listLoading = false
        }
      })
    },
    newWorkloadClick() {
      this.dialogTableVisible = true
      if (this.$refs.createForm) {
        this.$refs.createForm.resetFields()
      }
    },
    dialogAddbtn(formName) {
      this.$refs[formName].validate((valid) => {
        this.skillform.beginTime = this.skillform.date[0]
        this.skillform.endTime = this.skillform.date[1]
        this.skillform.skill.id = this.skillform.skill.skillId
        this.datalist.push(this.skillform)
        this.dialogAdd = false
        this.skillform
      })
      this.skillform = {
        skill: '',
        date: '',
        reqNum: ''
      }
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
      this.createForm.radio = this.radio
      if (this.createForm.radio === 'FLIGHT_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var submitForm = {}
            this.submitLoading = true
            submitForm = this.createForm
            submitForm.startDate = this.createForm.topDate[0]
            submitForm.endDate = this.createForm.topDate[1]
            submitForm.minCalculationInterval = 1
            submitForm.operationStandardId = Number(submitForm.operationStandardId)
            submitForm.businessDomainId = this.businessDomainId
            addWorkload(submitForm)
              .then((response) => {
                this.submitLoading = false
                this.dialogTableVisible = false
                this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: response.data.data.workloadDocumentId, name: response.data.data.name, businessDomainId: this.businessDomainId || '' }})
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
            var submitForm2 = {
              documentType: this.createForm.radio,
              workloadName: this.createForm.name2,
              fromDate: this.createForm.topDate2[0],
              toDate: this.createForm.topDate2[1],
              granularityInterval: this.createForm.minResultInterval2,
              samplingMode: this.createForm.samplingMode2,
              reqs: this.datalist,
              businessDomainId: this.businessDomainId
            }
            addWorkload2(submitForm2)
              .then((res) => {
                if (res.data.code === '200') {
                  this.$message.success(res.data.message)
                  this.dialogTableVisible = false
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: res.data.data, type: this.createForm.radio, businessDomainId: this.businessDomainId || '' }})
                } else {
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
      } else if (this.createForm.radio === 'HIST_TASK_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
              businessDomainId: this.businessDomainId
            }
            addWorkload3(submitForm2)
              .then((res) => {
                if (res.data.code === '200') {
                  this.$message.success(res.data.message)
                  this.dialogTableVisible = false
                  this.$router.push({ path: '/prepare/workloadHiddenNew', query: { id: res.data.data, type: this.createForm.radio, businessDomainId: this.businessDomainId || '' }})
                } else {
                  this.$message.error(res.data.message)
                }
              })
              .catch((e) => {
                this.submitLoading = false
                if (e.response.data.code == 500) {
                  e.response.data.message = '500 服务器内部错误'
                }
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        })
      }
      if (this.createForm.radio === 'FLIGHT_DYNAMIC_WORKLOAD') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            var submitForm2 = {
              documentType: this.createForm.radio,
              workloadName: this.createForm.FlightName,
              dynamicFromDate: this.createForm.FlightTopDate[0],
              dynamicToDate: this.createForm.FlightTopDate[1],
              fromDate: this.createForm.FlightTopDate2[0],
              toDate: this.createForm.FlightTopDate2[1],
              dispatchId: this.skillFlag ? 0 : this.createForm.operationStandardId4,
              granularityInterval: this.createForm.FlightminResultInterval,
              samplingMode: this.createForm.FlightsamplingMode,
              skills: this.createForm.skillId,
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
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(row.workloadSettingId).then((response) => {
            // if (response.code === '200') {
            this.initable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 30px;
  .el-select,
  .el-input {
    width: 50%;
  }
}
.title {
  font-size: 20px;
  margin-top: 0;
  padding-top: 10px;
}
.addBtn button {
  padding: 7px 11px;
  margin-left: 0;
}
.btnTop {
  margin-top: 30px;
}
.btnTop {
  margin-top: 30px;
}
.box-item {
  width: 100%;
  // border: 1px solid #8a91aa;
  margin-bottom: 20px;
  color: #fff;
  div.item {
    padding: 0 30px;
    p {
      font-size: 14px;
    }
  }
  p.title {
    // background: #caceda;
    padding: 5px 10px;
    font-size: 15px;
    color: #0a142f;
    margin: 0;
  }
  .demonstration {
    font-size: 15px;
  }
  form {
    padding: 38px;
  }
}
.footer {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 5px 50px;
  margin-top: 20px;
}
</style>
