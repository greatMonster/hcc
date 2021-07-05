<template>
  <div class="body">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="175px" class="demo-ruleForm">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>排班类型</span>
        </div>
        <div>
          <el-form-item label="排班表类型" prop="rosterSettingVersionId">
            <el-radio-group v-model="ruleForm.rosterSettingVersionId" @change="chose">
              <el-radio label="1">基于工作量的排班表</el-radio>
              <el-radio label="2">基于模板的排班表</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="shiftTableMode" label="排班表模式" prop="algorithmType">
            <el-radio-group v-model="ruleForm.algorithmType" @change="chose2">
              <el-radio label="1">独立技能排班</el-radio>
              <el-radio label="2">混合技能排班</el-radio>
              <el-radio label="3">混合出勤排班</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排班表名称" prop="name">
            <el-input v-model="ruleForm.name" size="small" style="width: 400px" placeholder="请输入" />
          </el-form-item>
        </div>
      </el-card>
      <div v-if="ruleForm.rosterSettingVersionId == '1'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本参数</span>
          </div>
          <div v-if="ruleForm.algorithmType == '1'">
            <el-form-item label="工作量" prop="workloadId">
              <el-select v-model="ruleForm.workloadId" clearable filterable value-key="label" style="width: 400px" size="small" :disabled="disabled" placeholder="请选择" @visible-change="changeValue1()" @change="changeDate">
                <el-option v-for="item in workload" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤规则" prop="ruleId">
              <el-select v-model="ruleForm.ruleId" value-key="label" style="width: 400px" size="small" :disabled="disabled" placeholder="请选择" @visible-change="adRuleS()" @change="changeDate">
                <el-option v-for="item in adRule" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item prop="workloadModulus">
              <div slot="label" style="display: inline-block">
                  工作强度
                  <el-tooltip class="item" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
              <el-input v-model="ruleForm.workloadModulus" oninput="value=value.replace(/[^\d.]/g,'')" size="small" placeholder="请输入" style="width: 400px" />
              <!-- <el-tooltip class="item" effect="dark" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                <i class="el-icon-question" />
              </el-tooltip> -->
            </el-form-item>
            <el-form-item label="员工类型" prop="employeeTypeWithSkillVOS">
              <el-table ref="multipleTable" :data="employeeType" :header-cell-class-name="cellClass" tooltip-effect="dark" style="width: 400px" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="员工类型" />
                <el-table-column type="selection" width="55" />
              </el-table>
            </el-form-item>
          </div>
          <div v-if="ruleForm.algorithmType == '2'">
            <el-form-item label="工作量" prop="workLoadIds">
              <el-select v-model="ruleForm.workLoadIds" clearable filterable collapse-tags style="width: 400px" size="small" :disabled="disabled" placeholder="请选择" @visible-change="changeValue1()" @change="changeDates">
                <el-option v-for="item in workload" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
              </el-select>
            </el-form-item>
            <el-form-item label="该工作量所需的技能" prop="skill">
              {{ skillsName.length > 0 ? skillsName.join(',') : '' }}
              <!-- <el-table :data="skillDatas" tooltip-effect="dark" style="width: 400px;max-height:250px;overflow-y: auto;" @selection-change="handleSelectionChange2">
                <el-table-column prop="workLoadName" label="工作量" />
                <el-table-column prop="skillName" label="技能" />
                <el-table-column type="selection" width="55" />
              </el-table>-->
            </el-form-item>
            <el-form-item label="参与排班的员工类型" prop="employeeTypeNum" class="special-item">
              <el-table :data="employeeTypeskill" style="width: 550px; max-height: 250px; overflow-y: auto" @selection-change="handleSelectionChange3">
                <el-table-column prop="employeeTypeName" label="员工类型" />
                <el-table-column prop="skillNames" label="技能" />
                <el-table-column prop="num" label="混合技能排班人数上限" />
                <el-table-column type="selection" width="55" />
              </el-table>
              <el-tooltip style="padding-top: 13px; height: 20px" class="item" effect="dark" content="不同资质员工数量请前往：岗位标准-资源类型配置。" placement="bottom">
                <i class="el-icon-question" />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="workloadModulus">
              <div slot="label" style="display: inline-block">
                  工作强度
                  <el-tooltip class="item" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
              <el-input v-model="ruleForm.workloadModulus" size="small" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入" style="width: 400px" />
              <!-- <el-tooltip class="item" effect="dark" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                <i class="el-icon-question" />
              </el-tooltip> -->
            </el-form-item>
            <el-form-item label="出勤规则" prop="ruleId">
              <el-select v-model="valueRule" value-key="label" style="width: 400px" size="small" @change="handleChange">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <!-- <el-cascader v-model="valueRule" style="width: 400px;" size="small" :options="options" :props="optionProps" clearable @change="handleChange" /> -->
            </el-form-item>
          </div>
          <div v-if="ruleForm.algorithmType == '3'">
            <el-form-item label="工作量" prop="workloadId">
              <el-select v-model="ruleForm.workloadId" clearable filterable value-key="label" style="width: 400px" size="small" :disabled="disabled" placeholder="请选择" @visible-change="changeValue1()" @change="changeDate">
                <el-option v-for="item in workload" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤规则" prop="ruleIds">
              <el-select v-model="ruleForm.ruleIds" value-key="label" style="width: 400px" size="small" multiple :multiple-limit="multipleLimit" :disabled="disabled" placeholder="请选择两个规则" @visible-change="adRuleS()" @change="changeDate">
                <el-option v-for="item in adRule" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="规则一对应工作量比例" prop="ruleOneCount">
              <el-input v-model="ruleForm.ruleOneCount" size="small" placeholder style="width: 175px; margin-left: 10px" />
            </el-form-item>
            <el-form-item label="规则二对应工作量比例" prop="ruleTwoCount">
              <el-input v-model="ruleForm.ruleTwoCount" size="small" placeholder style="width: 175px; margin-left: 10px" />
            </el-form-item>
            <el-form-item prop="workloadModulus">
               <div slot="label" style="display: inline-block">
                  工作强度
                  <el-tooltip class="item" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
              <el-input v-model="ruleForm.workloadModulus" size="small" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入" style="width: 400px" />
              <!-- <el-tooltip class="item" effect="dark" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                <i class="el-icon-question" />
              </el-tooltip> -->
            </el-form-item>
            <el-form-item label="员工类型" prop="employeeTypeWithSkillVOS">
              <el-table ref="multipleTable" :data="employeeType" :header-cell-class-name="cellClass" tooltip-effect="dark" style="width: 400px" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="员工类型" />
                <el-table-column type="selection" width="55" />
              </el-table>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>算法设置</span>
          </div>
          <div>
            <!-- <el-form-item label="开始与结束日期" prop="rosterDate">
              <el-date-picker v-model="ruleForm.rosterDate" size="small" style="width:240px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>-->
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker v-model="ruleForm.beginDate" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" size="small" style="width: 190px" :picker-options="pickerOptions" />
            </el-form-item>
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="结束日期" value-format="yyyy-MM-dd" size="small" style="width: 190px" :picker-options="pickerOptions1" />
            </el-form-item>
            <el-form-item>
              <div slot="label">限定人数</div>
              <div class="isUsed">
                <el-checkbox v-model="checked" @change="checkedChange">启用</el-checkbox>
                <el-input v-model="ruleForm.staffNumber" size="small" placeholder="请输入人数" style="width: 175px; margin-left: 10px" :disabled="isDisabled" />
              </div>
            </el-form-item>
            <el-form-item prop="fullCover">
              <div slot="label">覆盖模式</div>
              <el-radio v-model="ruleForm.fullCover" label="0">非全覆盖</el-radio>
              <el-radio v-model="ruleForm.fullCover" label="1">全覆盖</el-radio>
            </el-form-item>
            <el-form-item v-if="ruleForm.fullCover == '0'" prop="costU">
              <div slot="label">
                覆盖权重<el-tooltip class="item" effect="dark" content="权重越大，越接近全覆盖，排班所需的人数就越多。" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </div>
              <el-select v-model="ruleForm.costU" placeholder="请选择" size="small" style="width: 240px">
                <el-option v-for="item in optionsCostU" :key="item.costId" :label="item.costName" :value="item.costId" />
              </el-select>
            </el-form-item>
          </div>
        </el-card>
      </div>
      <div v-if="ruleForm.rosterSettingVersionId == 2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本参数</span>
          </div>
          <div>
            <el-form-item label="工作量" prop="workloadId1">
              <el-select v-model="ruleForm.workloadId" clearable filterable value-key="label" style="width: 400px" size="small" :disabled="disabled" placeholder="请选择" @visible-change="changeValue1()" @change="changeDate">
                <el-option v-for="item in workload" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始与结束日期" prop="rosterDate1">
              <el-date-picker v-model="ruleForm.rosterDate1" size="small" style="width: 340px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="选择员工类型" prop="employeeTypeIds">
              <!-- <el-scrollbar wrap-class="scrollbar-wrapper" style="height:400px"> -->
              <el-table ref="multipleTable11" height="250" :header-cell-class-name="cellClass" stripe :data="employeeType2" style="width: 360px" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="员工类型" />
                <el-table-column type="selection" width="55" />
              </el-table>
              <!-- </el-scrollbar> -->
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
    <div class="foot">
      <el-button size="small" style="right: 150px" @click="goBack">返 回</el-button>
      <el-button size="small" style="right: 60px" type="primary" @click="submitData('ruleForm')">提 交</el-button>
    </div>
  </div>
</template>
<script>
import { adRule, timeBetween, employeeType, employeeTypeNew, employeeTypeNewNew, addSchedule, addModelSchedule, moduleEmployeeType, skills, employeeTypeskills, mix, ruleEmployeeType, mixWork } from '@/apiNew/scheduleDetails'
import { initNewTable } from '@/apiNew/workload'
export default {
  name: 'AddPage',
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDateVal
          const endDateVal = this.endDateVal
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 86400000 || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          const beginDateVal = this.ruleForm.beginDate
          const endDateVal = this.endDateVal
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 86400000 || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      airportId: this.$store.state.user.airport.airportId || '',
      beginDateVal: '',
      endDateVal: '',
      skillsName: [],
      shiftTableMode: true,
      multipleLimit: 2,
      businessDomainId: this.$route.query.businessDomainId || '',
      skillIds: [], // 选择的技能
      checked: false,
      disabled: false,
      isDisabled: true,
      options: [],
      workload: [],
      valueRule: '',
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'empTypes'
      },
      adRule: [],
      skillDatas: [],
      employeeTypeskill: [],
      employeeType: [],
      employeeType2: [],
      optionsCostU: [
        { costId: 0.5, costName: '0.5' },
        { costId: 1, costName: '1' },
        { costId: 3, costName: '3' },
        { costId: 5, costName: '5' },
        { costId: 7, costName: '7' },
        { costId: 9, costName: '9' },
        { costId: 10, costName: '10' },
        { costId: 100, costName: '100' },
        { costId: 1000, costName: '1000' }
      ],
      rules: {
        name: [{ required: true, message: '请输入数据', trigger: 'change' }],
        rosterSettingVersionId: [{ required: true, message: '请选择', trigger: 'change' }],
        algorithmType: [{ required: true, message: '请选择', trigger: 'change' }],
        workloadId: [{ required: true, message: '请选择', trigger: 'change' }],
        workLoadIds: [{ required: true, message: '请选择', trigger: 'change' }],
        ruleId: [{ required: true, message: '请选择', trigger: 'change' }],
        rosterDate: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        // employeeType: [{ required: true }],
        employeeTypeWithSkillVOS: [{ required: true, message: '请选择' }],
        employeeTypeIds: [{ required: true, message: '请选择' }],
        employeeTypeNum: [{ required: true, message: '请选择' }],
        rosterDate1: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        ruleOneCount: [{ required: true, message: '请输入数据' }],
        ruleTwoCount: [{ required: true, message: '请输入数据' }],
        ruleIds: [{ required: true, message: '请选择' }],
        workloadModulus: [{ required: true, message: '请输入数据' }],
        endDate: [{ required: true, message: '请选择', trigger: 'change' }],
        beginDate: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      initForm: {},
      ruleForm: {
        airportId: '',
        employeeTypeNum: [],
        algorithmType: '1',
        workLoadIds: '', // 工作量
        skills: [],
        employeeTypeskill: '',
        ruleId: '',
        employeeTypeId: '',
        workloadId: '',
        rosterDate: [],
        rosterDate1: [],
        employeeTypeWithSkillVOS: [],
        employeeTypeIds: [],
        rosterSettingVersionId: '1',
        name: '',
        startDate: null,
        staffNumber: 0,
        fullCover: '1',
        workloadModulus: 1.0,
        costU: 5,
        businessDomainId: this.businessDomainId,
        beginDate: '',
        endDate: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    cellClass(row) {
      if (row.columnIndex === 1) {
        // 你需要判断的条件
        return 'disabledCheck'
      }
    },
    init() {
      this.initForm = {
        ruleId: '',
        workloadId: '',
        rosterDate: ['', ''],
        rosterDate1: ['', ''],
        employeeTypeIds: [],
        employeeTypeWithSkillVOS: [],
        rosterSettingVersionId: '1',
        algorithmType: '',
        name: '',
        startDate: null,
        staffNumber: 0,
        fullCover: '0',
        costU: 5
      }
    },
    chose(e) {
      // 选择方式
      this.$refs.ruleForm.resetFields()
      this.ruleForm.rosterSettingVersionId = e
      if (e === '2') {
        this.selectEmployeeType2()
        this.shiftTableMode = false
      } else {
        this.shiftTableMode = true
      }
    },
    chose2(e) {
      // 选择方式
      // this.$refs.ruleForm.resetFields()
      this.$refs.ruleForm.clearValidate()
      this.ruleForm.algorithmType = e
    },
    changeValue1() {
      // 工作量下拉
      var data = {
        businessDomainId: this.businessDomainId,
        name: '',
        airportId: this.airportId
      }
      initNewTable(data).then((response) => {
        this.workload = response.data.data
      })
    },
    changeDate(e) {
      this.documentWorkloadId()
      this.workload.forEach((item) => {
        if (item.workloadDocumentId === e) {
          // this.ruleForm.rosterDate = [item.startDate.substring(0, 10), item.endDate.substring(0, 10)]
          this.ruleForm.beginDate = item.startDate.substring(0, 10)
          this.ruleForm.endDate = item.endDate.substring(0, 10)
          this.endDateVal = item.endDate.substring(0, 10)
          this.beginDateVal = item.startDate.substring(0, 10)
          this.ruleForm.rosterDate1 = [item.startDate.substring(0, 10), item.endDate.substring(0, 10)]
        }
      })
    },
    changeDates(e) {
      // 多选
      this.valueRule = ''
      this.ruleForm.skills = []
      this.skillsName = []
      this.ruleForm.workLoadIds = e
      this.workload.forEach((item) => {
        if (item.workloadDocumentId === e) {
          // this.ruleForm.rosterDate = [item.startDate.substring(0, 10), item.endDate.substring(0, 10)]
          this.ruleForm.beginDate = item.startDate.substring(0, 10)
          this.ruleForm.endDate = item.endDate.substring(0, 10)
        }
      })
      skills(e).then((response) => {
        this.skillDatas = response.data.data
        response.data.data.forEach((element) => {
          this.ruleForm.skills.push({ workLoadId: element.workLoadId, skillId: element.skillId })
          this.skillsName.push(element.skillName)
        })
        console.log(this.ruleForm.skills, 256)
      })
      const data = {
        businessDomainId: this.businessDomainId,
        ids: e
      }
      employeeTypeskills(data).then((response) => {
        this.employeeTypeskill = response.data.data
      })
      ruleEmployeeType(data).then((response) => {
        this.options = response.data.data
      })
      //   const data2 = {
      //     ids: e
      //   }
      //   timeBetween(data2).then(response => {
      //     this.ruleForm.rosterDate = []
      //     if (response.data.data) {
      //       if (response.data.data.beginDate) {
      //         this.ruleForm.beginDate = response.data.data.beginDate
      //         this.ruleForm.endDate = response.data.data.endDate
      //         this.ruleForm.rosterDate = [response.data.data.beginDate, response.data.data.endDate]
      //       }
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: '工作量没有交集，不能进行计算'
      //       })
      //     }
      //   })
    },
    handleChange(val) {
      // console.log(val, 666)
      this.ruleForm.ruleId = val
      this.options.forEach((item) => {
        if (item.id === val) {
          this.ruleForm.employeeTypeId = item.empTypes[0].id
        }
      })
    },
    adRuleS() {
      // 规则下拉
      adRule(this.businessDomainId).then((response) => {
        this.adRule = response.data.data
      })
    },
    handleSelectionChange(val) {
      // console.log(val, 555)
      // 选择员工类型
      // this.ruleForm.employeeTypeIds = []
      if (this.ruleForm.rosterSettingVersionId === '2') {
        console.log(val)
        if (val.length > 1) {
          this.$message.warning('员工类型为单选')
          this.$refs['multipleTable11'].toggleRowSelection(val[val.length - 1], false)
        } else {
          this.ruleForm.employeeTypeIds = [val[0].id]
        }
      } else {
        this.ruleForm.employeeTypeWithSkillVOS = []
        // val.forEach(element => {
        //   this.ruleForm.employeeTypeWithSkillVOS.push({ id: element.id, skillId: element.skillId })
        // })

        if (val.length > 1) {
          this.$message.warning('员工类型为单选')
          this.$refs['multipleTable'].toggleRowSelection(val[val.length - 1], false)
          // const obj = {}
          // this.ruleForm.employeeTypeWithSkillVOS.reduce((pre, next, index) => {
          //   // console.log(pre, next, 555)
          //   if (obj[next.skillId]) {
          //     obj[next.skillId] = ''
          //     this.$message.warning('同一技能对应的员工类型只能选一个')
          //     this.$refs.multipleTable.toggleRowSelection(val[index], false)
          //   } else {
          //     obj[next.skillId] = true && pre.push(next)
          //   }
          //   return pre
          // }, [])
        } else {
          this.ruleForm.employeeTypeWithSkillVOS = [{ id: val[0].id, skillId: val[0].skillId }]
        }
      }
    },
    handleSelectionChange2(val) {
      // 选择技能
      this.skillIds = []
      this.ruleForm.skills = []
      if (val.length > 3) {
        this.$message({
          type: 'error',
          message: '最多只能选择3个'
        })
      } else {
        val.forEach((element) => {
          this.skillIds.push(element.skillId)
          this.ruleForm.skills.push({ workLoadId: element.workLoadId, skillId: element.skillId })
        })
      }
      const data = {
        businessDomainId: this.businessDomainId,
        ids: this.skillIds
      }
      employeeTypeskills(data).then((response) => {
        this.employeeTypeskill = response.data.data
      })
    },
    handleSelectionChange3(val) {
      // 选择技能
      this.ruleForm.employeeTypeNum = []
      val.forEach((element) => {
        this.ruleForm.employeeTypeNum.push({ id: element.employeeTypeId, num: element.num })
      })
    },
    documentWorkloadId() {
      // 员工类型
      var ruleSetIds = ''
      if (this.ruleForm.algorithmType == '1') {
        ruleSetIds = this.ruleForm.ruleId
      } else if (this.ruleForm.algorithmType == '3') {
        ruleSetIds = this.ruleForm.ruleIds.join(',')
      }
      const data = {
        workloadIds: this.ruleForm.workloadId,
        ruleSetIds: ruleSetIds
      }
      employeeTypeNewNew(data).then((response) => {
        this.employeeType = response.data.data
      })
    },
    checkedChange(e) {
      if (e) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
        this.ruleForm.staffNumber = 0
      }
    },
    // 生成空排班表时的员工类型
    selectEmployeeType2() {
      moduleEmployeeType(this.businessDomainId).then((response) => {
        this.employeeType2 = response.data.data
      })
    },
    submitData(ruleForm) {
      // 新建排班表提交
      // debugger
      if (this.ruleForm.rosterSettingVersionId === '1') {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.ruleForm.businessDomain = Number(this.businessDomainId)
            this.ruleForm.airportId = this.airportId
            // this.ruleForm.algorithmType = '1'
            // this.ruleForm.beginDate = this.ruleForm.rosterDate[0]
            // this.ruleForm.endDate = this.ruleForm.rosterDate[1]
            // this.ruleForm.fullCover = Number(this.ruleForm.fullCover)
            let data = Object.assign({}, this.ruleForm)
            data.fullCover = Number(this.ruleForm.fullCover)
            if (this.ruleForm.algorithmType === '1') {
              addSchedule(data)
                .then((response) => {
                  // this.$message.success('新增成功')
                  this.newSchedule = false
                  this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: response.data.data, method: this.ruleForm.rosterSettingVersionId, businessDomainId: this.businessDomainId } })
                  // this.init()
                })
                .catch((e) => {
                  this.$message({
                    type: 'error',
                    message: e.response.data.message
                  })
                })
            } else if (this.ruleForm.algorithmType === '2') {
              // this.ruleForm.workLoadIds = [this.ruleForm.workLoadIds]
              let data1 = Object.assign({}, this.ruleForm)
              data1.workLoadIds = [this.ruleForm.workLoadIds]
              mix(data1)
                .then((response) => {
                  // this.$message.success('新增成功')
                  this.newSchedule = false
                  this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: response.data.data, method: this.ruleForm.rosterSettingVersionId, businessDomainId: this.businessDomainId } })
                  // this.init()
                })
                .catch((e) => {
                  this.$message({
                    type: 'error',
                    message: e.response.data.message
                  })
                })
            } else {
              mixWork(data)
                .then((response) => {
                  // this.$message.success('新增成功')
                  this.newSchedule = false
                  this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: response.data.data, method: this.ruleForm.rosterSettingVersionId, businessDomainId: this.businessDomainId } })
                  // this.init()
                })
                .catch((e) => {
                  this.$message({
                    type: 'error',
                    message: e.response.data.message
                  })
                })
            }
          } else {
            return false
          }
        })
      } else {
        // 空排班表
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.ruleForm.bussionDomainId = Number(this.businessDomainId)
            this.ruleForm.beginDate = this.ruleForm.rosterDate1[0]
            this.ruleForm.endDate = this.ruleForm.rosterDate1[1]
            this.ruleForm.fullCover = Number(this.ruleForm.fullCover)
            this.ruleForm.airportId = this.airportId
            addModelSchedule(this.ruleForm)
              .then((response) => {
                this.newSchedule = false
                // this.$message.success('新增成功')
                this.$router.push({ path: '/prepare/scheduleGeneratorNew', query: { rosterSettingVersionId: response.data.data, method: this.ruleForm.rosterSettingVersionId } })
                // this.init()
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        })
      }
    },
    goBack() {
      if (JSON.stringify(this.initForm) === JSON.stringify(this.ruleForm)) {
        this.$router.go(-1)
      } else {
        this.$confirm('已填写的数据将不会被保存，确认返回？', '提示', {
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
.el-table /deep/ .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}
.el-table /deep/ .disabledCheck .cell:after {
  content: '选择';
  position: absolute;
  right: 20px;
}

.special-item /deep/ .el-form-item__content {
  display: flex;
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
.body /deep/ .el-card {
  background-color: #172449;
  width: 100%;
  margin: 20px auto;
  font-size: 14px;
}
.body /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.el-card /deep/ .el-card__body {
  padding: 15px 20%;
}
</style>
<style lang="scss" scoped>
.body {
  margin-bottom: 85px;
  // padding: 0 24%;
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
</style>
