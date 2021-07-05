<template>
  <div class="box">
    <el-form ref="formEdit" :rules="rules" :model="formEdit" :label-width="formLabelWidth">
      <el-card v-for="(item, index) in datas" :key="index" class="box-card">
        <div class="title">{{ item.title }}</div>
        <el-form-item v-if="item.name" prop="name" :label="item.name">
          <el-input v-model="formEdit.name" />
        </el-form-item>
        <!-- <el-form-item v-if="item.airport" prop="airportId" :label="item.airport">
          <el-select v-model="formEdit.airportId" value-key="id" filterable clearable @change="changeAirports" disabled>
            <el-option v-for="items in planDeptAirport" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="item.minWorkHours" prop="minWorkHours" :label="item.minWorkHours">
          <el-input v-model="formEdit.minWorkHours" type="number" />
        </el-form-item>
        <el-form-item v-if="item.maxWorkHours" prop="maxWorkHours" :label="item.maxWorkHours">
          <el-input v-model="formEdit.maxWorkHours" type="number" />
        </el-form-item>
        <el-form-item v-if="item.minRestInterval" prop="minRestInterval" :label="item.minRestInterval">
          <el-input v-model="formEdit.minRestInterval" type="number" />
        </el-form-item>
        <el-form-item v-if="item.passRate" :label="item.passRate" prop="passRate">
          <el-input v-model="formEdit.passRate" type="number" placeholder clearable />
        </el-form-item>
        <el-form-item v-if="item.maxQueuingTime" :label="item.maxQueuingTime" prop="maxQueuingTime">
          <el-input v-model="formEdit.maxQueuingTime" type="number" placeholder clearable />
        </el-form-item>
        <el-form-item v-if="item.minDeskOpenTime" :label="item.minDeskOpenTime" prop="minDeskOpenTime">
          <!-- <el-input v-model="formEdit.minDeskOpenTime" type="number" placeholder clearable /> -->
          <el-select v-model="formEdit.minDeskOpenTime" value-key="id" filterable clearable>
            <el-option label="30" value="30" />
            <el-option label="60" value="60" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.employeeSkill" prop="employeeSkillId">
          <div slot="label" style="display: inline-block">
            技能
            <el-tooltip class="item" content="这里指定本次预测中，安检通道任务所需的员工技能" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <el-select v-model="formEdit.employeeSkillId" value-key="id" clearable placeholder="请选择" @change="changedata">
            <el-option v-for="items in options" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
      </el-card>
    </el-form>
    <div style="height: 10px" />
  </div>
</template>

<script>
import { airports, employeeSkills, detailList } from '@/apiNew/securityChannel'
export default {
  name: 'StepOne',
  data() {
    var maxWorkHoursValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入最长工作时间'))
      } else if (value <= this.formEdit.minWorkHours) {
        callback(new Error('最长工作时间不能小于或等于最短工作时间'))
      } else {
        callback()
      }
    }
    return {
      airport: this.$store.state.user.airport,
      detailData: {},
      routerId: this.$route.query.id,
      businessDomainId: this.$route.query.businessDomainId,
      planDeptAirport: [],
      options: [],
      id: '1', // 后台要传的参数
      datas: [
        {
          title: '基本信息',
          name: '名称',
          airport: '机场',
          airportId: ''
        },
        {
          title: '员工工作时间',
          minWorkHours: '最短工作时间（小时）',
          maxWorkHours: '最长工作时间（小时）',
          minRestInterval: '最短休息间隔（小时）',
          passRate: '处理速率（人/小时）',
          maxQueuingTime: '最大排队时间（分钟）',
          minDeskOpenTime: '工作开始时刻（分钟）'
        },
        {
          title: '员工技能',
          employeeSkill: '技能',
          employeeSkillId: ''
        }
      ],
      formEdit: {
        name: '',
        airportId: '',
        minWorkHours: '',
        maxWorkHours: '',
        minRestInterval: '',
        employeeSkillId: ''
      },
      formLabelWidth: '30%',
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 100, message: '最多不超过100字符', trigger: 'blur' }
        ],
        airportId: [{ required: true, message: '请输入', trigger: 'change' }],
        minWorkHours: [{ required: true, message: '请输入最短工作时间', trigger: 'blur' }],
        maxWorkHours: [{ required: true, validator: maxWorkHoursValidate, trigger: 'blur' }],
        minRestInterval: [{ required: true, message: '请输入最短休息间隔' }],
        passRate: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { type: 'number', message: '必须为数字值' },
        ],
        maxQueuingTime: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { type: 'number', message: '必须为数字值' },
        ],
        minDeskOpenTime: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { type: 'number', message: '必须为数字值' },
        ],
        employeeSkillId: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initAirports()
    this.initEmployeeSkill()
    if (this.routerId) {
      this.detailList()
    } else {
      if (localStorage.getItem('stepOne')) {
        this.formEdit = JSON.parse(localStorage.getItem('stepOne'))
      }
    }
  },
  methods: {
    changeAirports(data) {
      this.formEdit.airportId = data
      localStorage.setItem('airportId', data)
    },
    changedata(data) {
      this.formEdit.employeeSkillId = data
    },
    initEmployeeSkill() {
      const data = {
        businessDomainId: this.businessDomainId || 1,
        airportId: this.airport.airportId
      }
      employeeSkills(data).then((response) => {
        this.options = response.data.data
      })
    },
    initAirports() {
      airports(false).then((response) => {
        this.planDeptAirport = response.data.data
      })
    },
    // 详情
    detailList() {
      if (localStorage.getItem('edit_stepOne')) {
        // console.log(this.options, 888)
        this.formEdit = JSON.parse(localStorage.getItem('edit_stepOne'))
        // this.formEdit.employeeSkillId = Number(this.formEdit.formEdit.employeeSkillId)
      } else {
        const data = {
          intlType: this.routerId,
          airportId: this.airportId
        }
        detailList(data).then((response) => {
          console.log(this.options, 999)
          const data = response.data.data
          this.detailData = data
          data.airportId = data.airportId
          this.formEdit = data
          // this.formEdit.employeeSkillId = Number(data.employeeSkillId)
          localStorage.setItem('detailList', JSON.stringify(data))
          localStorage.setItem('airportId', data.airportId.toString())
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  .el-form {
    margin: auto;
    .el-input,
    .el-select {
      width: 40%;
    }
  }
}
</style>
