<template>
  <div class="skillBox">
    <div style="overflow: hidden">
      <div style="height: 100%; margin-bottom: 110px">
        <div class="title">
          <div style="float: left" />
          <div style="float: right; line-height: 40px">
            <el-select v-model="formAdd.templateId" placeholder="请选择任务模板" @visible-change="taskChange" @change="dataChange">
              <el-option v-for="(items, indexs) in absenceOptions" :key="indexs" :label="items.templateName" :value="items.taskTypeId" />
            </el-select>
            <!-- <el-button style="float: right;margin-top: 5px;margin-right: 40px;margin-left: 25px;" type="primary" :append-to-body="true" size="mini" class="filter-item" @click="editPage">编辑</el-button> -->
          </div>
        </div>
        <div class="skillShow">
          <el-form ref="ruleForm" :inline="true" :model="form" :rules="rules">
            <el-form-item prop="templateName" label="任务名称" :label-width="formLabelWidth">
              <el-input v-model="form.templateName" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
            <el-form-item prop="templateCode" label="任务编码" :label-width="formLabelWidth">
              <el-input v-model="form.templateCode" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
            <el-form-item prop="taskContinuedType" label="持续时间类型" :label-width="formLabelWidth">
              <el-select v-model="form.taskContinuedType" placeholder="请选择" class="format" :disabled="form.offon ? false : true">
                <el-option v-for="item in taskContinuedTypeoption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="taskContinuedTime" label="任务持续时间(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.taskContinuedTime" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
            <el-form-item prop="winStartType" label="任务开始类型" :label-width="formLabelWidth">
              <el-select v-model="form.winStartType" placeholder="请选择" class="format" :disabled="form.offon ? false : true">
                <el-option v-for="item in winStartTypeoption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="winStartTime" label="任务开始时间(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.winStartTime" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
            <el-form-item prop="winEndType" label="任务结束类型" :label-width="formLabelWidth">
              <el-select v-model="form.winEndType" placeholder="请选择" class="format" :disabled="form.offon ? false : true">
                <el-option v-for="item in winStartTypeoption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="winEndTime" label="任务结束时间(分钟)" :label-width="formLabelWidth">
              <el-input v-model="form.winEndTime" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
            <el-form-item prop="taskNum" label="任务数量" :label-width="formLabelWidth">
              <el-input v-model="form.taskNum" placeholder="请输入" class="format" :disabled="form.offon ? false : true" />
            </el-form-item>
          </el-form>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>子任务</span>
              <el-button style="float: right; margin-bottom: 10px" type="primary" :append-to-body="true" size="mini" class="filter-item" :disabled="form.offon ? false : true" @click="dialogAdd1">添 加</el-button>
            </div>
            <el-table :data="subTaskList" border stripe>
              <el-table-column prop="subTaskName" label="子任务" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" :disabled="form.offon ? false : true" @click="remove(scope.$index, subTaskList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>计费项目</span>
              <el-button style="float: right; margin-bottom: 10px" type="primary" :append-to-body="true" size="mini" class="filter-item" :disabled="form.offon ? false : true" @click="dialogAdd">添 加</el-button>
            </div>
            <el-table :data="itemList" border stripe>
              <el-table-column prop="billName" label="计费项目" />
              <el-table-column prop="quantity" label="数量" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" :disabled="form.offon ? false : true" @click="remove(scope.$index, itemList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>技 能</span>
              <el-button style="float: right; margin-bottom: 10px" type="primary" :append-to-body="true" size="mini" class="filter-item" :disabled="form.offon ? false : true" @click="adddialogAddSkill = true">添 加</el-button>
            </div>
            <el-table :data="skillList" border stripe>
              <el-table-column prop="skillName" label="技能" />
              <el-table-column prop="quantity" label="数量" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" :disabled="form.offon ? false : true" @click="remove(scope.$index, skillList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <div slot="footer" class="floot">
          <el-button style="background: #495373; color: white; right: 150px" size="small" @click="cancelClick">取 消</el-button>
          <el-button size="small" style="right: 60px" type="primary" @click="handleAddClick('ruleForm')">确 定</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAddsubTask" title="添加子任务">
      <el-form :model="Taskform">
        <el-form-item label="选择子任务:" :label-width="formLabelWidth">
          <el-select v-model="Taskform.subTaskTemplateId" placeholder="请选择" :disabled="form.offon ? false : true" @visible-change="subTaskChange">
            <el-option v-for="(item, index) in subTasktions" :key="index" :label="item.subTaskName" :value="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="dialogAddsubTask = false">取 消</el-button>
        <el-button type="primary" @click="handlesubTaskitem('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :visible.sync="dialogAdditem" title="添加计费项目">
      <el-form :model="chargingform">
        <el-form-item label="选择计费项目:" :label-width="formLabelWidth">
          <el-select v-model="chargingform.billingItemId" placeholder="请选择">
            <el-option v-for="(items, indexs) in chargingOptions" :key="indexs" :label="items.billName" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="项目数量：" :label-width="formLabelWidth">
          <el-input v-model="chargingform.quantity" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="dialogAdditem = false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitem('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :visible.sync="adddialogAddSkill" title="添加技能">
      <el-form :model="chargingskillform">
        <el-form-item label="选择技能:" :label-width="formLabelWidth">
          <el-select v-model="chargingskillform.skillId" placeholder="请选择">
            <el-option v-for="(items, indexs) in skillOptions" :key="indexs" :label="items.name" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="项目数量：" :label-width="formLabelWidth">
          <el-input v-model="chargingskillform.quantity" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="adddialogAddSkill = false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitskill()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initData, wokeTpye, findData, skillData, subTaskData, deleteDatafcn } from '@/api/taskTemplate'
import { taskTypeData, addDatafcn, eitDatafcn } from '@/api/realTimeJobRules'
export default {
  name: 'TaskTemplate',
  data() {
    return {
      airport: this.$store.state.user.airport,
      title: '',
      formAdd: {},
      edittaskVisible: false,
      adddialogAddSkill: false,
      dialogAddsubTask: false,
      absenceOptions: [],
      dialogAdditem: false,
      formLabelWidth: '150px',
      orgnizationPartTable: [],
      orgnizations: [],
      skillList: [],
      itemList: [],
      subTaskList: [],
      taskTemplateId: '',
      activeNames: '',
      Taskform: {},
      chargingform: {},
      chargingskillform: {},
      taskTypetions: [],
      orgnizationID: '',
      subTasktions: [],
      winEndTypeoption: [],
      chargingOptions: [],
      skillOptions: [],
      taskContinuedTypeoption: [
        { label: '固定时间', value: 2 },
        { label: '最小持续时间', value: 1 }
      ],
      winStartTypeoption: [
        { label: '计划起飞前', value: 'beforeSTD' },
        { label: ' 计划起飞后', value: 'afterSTD' },
        { label: '预计起飞前', value: 'beforeETD' },
        { label: '预计起飞后', value: 'afterETD' },
        { label: '实际起飞前', value: 'beforeATD' },
        { label: ' 实际起飞后', value: 'afterATD' },
        { label: '计划到达前', value: 'beforeSTA' },
        { label: '计划到达后', value: 'afterSTA' },
        { label: '预计到达前', value: 'beforeETA' },
        { label: '预计到达后', value: 'afterETA' },
        { label: '实际到达前', value: 'beforeATA' },
        { label: ' 实际到达后', value: 'afterATA' }
      ],
      form: { offon: true, templateName: '', taskNum: 1, templateCode: '', taskContinuedType: '', taskContinuedTime: '', winStartType: '', winStartTime: '', winEndType: '', winEndTime: '', subTaskTemplateIds: '' },
      rules: {
        templateName: [{ required: true, message: '请输入任务模板名称', trigger: 'blur' }],
        templateCode: [{ required: true, message: '请输入任务编码', trigger: 'blur' }],
        taskContinuedType: [{ required: true, message: '请输入持续时间类型', trigger: 'blur' }],
        taskContinuedTime: [{ required: true, message: '请输入任务持续时间', trigger: 'blur' }],
        winStartType: [{ required: true, message: '请选择任务开始类型', trigger: 'blur' }],
        winStartTime: [{ required: true, message: '请选择任务开始时间', trigger: 'blur' }],
        winEndType: [{ required: true, message: '请选择任务结束类型', trigger: 'blur' }],
        winEndTime: [{ required: true, message: '请选择任务结束时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.$route.query.title) {
      this.form.offon = true
    } else {
      var data = JSON.parse(this.$route.query.data)
      this.form.templateName = data.templateName
      this.form.templateCode = data.templateCode
      this.form.taskNum = data.taskNum
      this.form.taskContinuedType = data.taskContinuedType
      this.form.winStartType = data.winStartType
      this.form.winStartTime = data.winStartTime
      this.form.winEndType = data.winEndType
      this.form.winEndTime = data.winEndTime
      this.form.taskContinuedTime = data.taskContinuedTime
      this.subTaskList = data.subTaskTemplates
      this.skillList = data.skillBeans
      this.itemList = data.itemBeans
    }

    // this.wokeTypeData()
    this.subTaskData()
    this.findData()
    this.skillData()
  },
  mounted() {},
  methods: {
    init() {
      var data = { taskTemplateId: this.taskTemplateId }
      initData(data).then((response) => {
        this.orgnizationPartTable = response.data
        this.orgnizations = response.data
      })
    },
    taskChange() {
      var data = { taskTypeId: this.$route.query.tasktypeid, airportId: this.airport.airportId }
      taskTypeData(data).then((response) => {
        this.absenceOptions = response.data.data
      })
    },
    dataChange() {
      this.absenceOptions.forEach((item) => {
        if (this.formAdd.templateId == item.taskTypeId) {
          this.form.templateName = item.templateName
          this.form.templateCode = item.templateCode
          this.form.taskContinuedType = item.taskContinuedType
          this.form.winStartType = item.winStartType
          this.form.winStartTime = item.winStartTime
          this.form.winEndType = item.winEndType
          this.form.winEndTime = item.winEndTime
          this.form.taskContinuedTime = item.taskContinuedTime
          this.subTaskList = item.subTaskTemplates
          this.skillList = item.skillBeans
          this.itemList = item.itemBeans
        }
      })
      this.formAdd.templateId
    },
    wokeTypeData() {
      const data = {
        airportId: this.airport.airportId
      }
      wokeTpye(data).then((response) => {
        this.taskTypetions = response.data
      })
    },
    subTaskChange(val) {
      if (val) {
        this.subTaskData()
      }
    },
    subTaskData() {
      var data = {
        tasktypeid: this.$route.query.tasktypeid,
        airportId: this.airport.airportId
      }
      subTaskData(data).then((response) => {
        this.subTasktions = response.data
      })
    },
    skillData() {
      var data = {
        tasktypeid: this.$route.query.tasktypeid,
        airportId: this.airport.airportId
      }
      skillData(data).then((response) => {
        this.skillOptions = response.data.data
      })
    },
    findData() {
      // 任务类型iddd
      var data = {
        tasktypeid: this.$route.query.tasktypeid,
        airportId: this.airport.airportId
      }
      findData(data).then((response) => {
        this.chargingOptions = response.data
      })
    },
    optionChange() {},

    remove(index, rows) {
      rows.splice(index, 1)
    },
    editPage() {
      // this.form.offon = true
    },
    dialogAdd() {
      this.dialogAdditem = true
    },
    dialogAdd1() {
      this.dialogAddsubTask = true
    },
    clearData() {
      this.itemList = []
      this.skillList = []
      this.subTaskList = []
      this.form = { taskTypeId: '', templateName: '', templateCode: '', taskContinuedType: '', taskContinuedTime: '', winStartType: '', winStartTime: '', winEndType: '', winEndTime: '', subTaskTemplateIds: '' }
    },
    handleAddClickitem() {
      this.chargingform.billName = this.chargingOptions[this.chargingform.billingItemId].billName
      this.chargingform.billingItemId = this.chargingOptions[this.chargingform.billingItemId].billingItemId
      this.itemList.push(this.chargingform)
      this.dialogAdditem = false
      this.chargingform = {}
    },
    handlesubTaskitem() {
      this.Taskform = this.subTasktions[this.Taskform.subTaskTemplateId]
      // this.Taskform.subTaskTemplateId = this.subTasktions[this.Taskform.subTaskTemplateId].subTaskTemplateId
      this.subTaskList.push(this.Taskform)
      this.dialogAddsubTask = false
      this.Taskform = {}
    },
    handleAddClickitskill() {
      this.chargingskillform.skillName = this.skillOptions[this.chargingskillform.skillId].name
      this.chargingskillform.skillId = this.skillOptions[this.chargingskillform.skillId].id
      this.skillList.push(this.chargingskillform)
      this.adddialogAddSkill = false
      this.chargingskillform = {}
    },
    cancelClick() {
      this.$router.go(-1)
    },

    //     // 添加确定按钮
    handleAddClick(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.$route.query.title) {
            this.form.subTaskTemplates = this.subTaskList
            this.form.itemBeans = this.itemList
            this.form.skillBeans = this.skillList
            this.form.taskTypeId = this.$route.query.tasktypeid
            this.form.id = this.$route.query.ruleId
            this.form.airportId = this.airport.airportId
            var addData = this.form
            addDatafcn(addData).then((response) => {
              if (response.data.code == 200) {
                this.$message.success('新增成功')
                if (this.$store.state.serviceStandard.id) {
                  this.$router.push({
                    path: '/dispatching/serviceStandard/serviceStandard',
                    query: { id: this.$store.state.serviceStandard.id, workTypeId: this.$store.state.serviceStandard.workTypeId, taskTypeId: this.$route.query.tasktypeid, ruleId: this.$route.query.ruleId, groupId: this.$route.query.groupId }
                  })
                } else {
                  this.$router.push({
                    path: '/dispatching/serviceStandard/serviceStandard',
                    query: { id: sessionStorage.getItem('id'), workTypeId: sessionStorage.getItem('workTypeId'), taskTypeId: this.$route.query.tasktypeid, ruleId: this.$route.query.ruleId, groupId: this.$route.query.groupId }
                  })
                }
              }
            })
          } else {
            this.form.subTaskTemplates = this.subTaskList
            this.form.itemBeans = this.itemList
            this.form.skillBeans = this.skillList
            this.form.taskTypeId = this.$route.query.tasktypeid
            this.form.ruleId = this.$route.query.ruleId
            this.form.dispatchTaskId = JSON.parse(this.$route.query.data).dispatchTaskId
            this.form.taskTemplateId = this.$route.query.taskTemplateId
            this.form.airportId = this.airport.airportId
            var eitData = this.form
            eitDatafcn(eitData).then((response) => {
              if (response.data.code == 200) {
                this.$message.success('编辑成功')
                this.$router.go(-1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // winStartTypeChange() {},
    // winEndTypeChange() {},
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = row.taskTemplateId

          deleteDatafcn(data).then((response) => {
            if (response.code === '200') {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
form .el-form-item__label /deep/ {
  width: 110px;
  text-align: right;
}

form .format {
  width: 250px;
}
</style>
<style scoped lang="scss">
form {
  width: 55%;
  margin: auto;
}
.format {
  width: 250px;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
}
.box-card {
  width: 60%;
  margin: auto;
  margin-bottom: 30px;
}

.floot {
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
