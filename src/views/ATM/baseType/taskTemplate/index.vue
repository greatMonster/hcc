<template>
  <div class="skillBox">
    <div class="title">
      <div />
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table :data="orgnizationPartTable" border stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="templateName" label="模板名称" />
        <el-table-column prop="templateCode" label=" 模板编码" />
        <el-table-column prop="taskContinuedType" label="任务持续类型">
          <template slot-scope="scope">
            <span v-if="scope.row.taskContinuedType==1">最小持续</span>
            <span v-if="scope.row.taskContinuedType==2">固定</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskContinuedTime" label="任务持续分钟" />
        <el-table-column prop="winStartType" label="窗口开始类型" />
        <el-table-column prop="winStartTime" label="窗口开始时间" />
        <el-table-column prop="winEndType" label="窗口结束类型" />
        <el-table-column prop="winEndTime" label="窗口结束时间" />
        <el-table-column prop="taskTypeName" label="任务类型" />
        <el-table-column prop="itemBeans " label="计费项目(数量)">
          <template slot-scope="scope">
            <span v-for=" (items, idex) in scope.row.itemBeans" :key="idex">{{ items.itemDesc }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="subTaskTemplatesNew " label="子任务">
          <template slot-scope="scope">
            <el-popover placement="bottom" trigger="click">
              <el-table :data="scope.row.subTaskTemplatesNew" height="150" width="300">
                <el-table-column property="subTaskName" label="子任务名字" />
                <el-table-column property="subTaskSeqNum" label="子任务顺序" />
                <el-table-column prop="subTaskMandatory" label="是否强制">
                  <template slot-scope="scope1">
                    <span v-if="scope1.row.subTaskMandatory==0">强制</span>
                    <span v-if="scope1.row.subTaskMandatory==1">不强制</span>
                  </template>
                </el-table-column>
                <el-table-column prop="taskTypeName" label="任务类型名称" />
                <el-table-column prop="itemList" label="计费项目(数量)">
                  <template slot-scope="scope1">
                    <span v-for="(item,index) in scope1.row.itemList" :key="index">{{ item.itemDesc }}&nbsp;&nbsp;</span>
                  </template>
                </el-table-column>
              </el-table>
              <span v-for=" (item , idex) in scope.row.subTaskTemplatesNew" slot="reference" :key="idex">{{ item.subTaskName }}&nbsp;&nbsp;</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="skillBeans " label="技能">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.skillBeans" :key="index">{{ item.skillName }}&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="taskTypeVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form ref="ruleForm" :inline="true" :model="form" style="margin-left:20px" :rules="rules">
          <el-form-item prop="templateName" label="任务名称" :label-width="formLabelWidth">
            <el-input v-model="form.templateName" placeholder="请输入任务名称" style="width:200px" class="format" />
          </el-form-item>
          <el-form-item prop="templateCode" label="任务编码" :label-width="formLabelWidth">
            <el-input v-model="form.templateCode" placeholder="请输入任务名称" class="format" />
          </el-form-item>
          <el-form-item prop="taskContinuedType" label="持续时间类型" :label-width="formLabelWidth">
            <el-select v-model="form.taskContinuedType" placeholder="请选择" class="format">
              <el-option v-for="item in taskContinuedTypeoption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="taskContinuedTime" label="任务持续时间" :label-width="formLabelWidth">
            <el-input v-model="form.taskContinuedTime" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="winStartType" label="任务开始类型">
            <el-select v-model="form.winStartType" placeholder="请选择" class="format">
              <el-option v-for="item in winStartTypeoption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="winStartTime" label="任务开始时间" :label-width="formLabelWidth">
            <el-input v-model="form.winStartTime" placeholder="请输入" class="format" />
          </el-form-item>
          <el-form-item prop="winEndType" label="任务结束类型" :label-width="formLabelWidth">
            <el-select v-model="form.winEndType" placeholder="请选择" class="format">
              <el-option v-for="item in winStartTypeoption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="winEndTime" label="任务结束时间" :label-width="formLabelWidth">
            <el-input v-model="form.winEndTime" placeholder="请输入" class="format" />
          </el-form-item>
          <el-form-item prop="taskTypeId" label="任务类型" :label-width="formLabelWidth">
            <el-select v-model="form.taskTypeId" placeholder="请选择" class="format">
              <el-option v-for="item in taskTypetions" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="subTaskTemplateIds" label="子任务模板" :label-width="formLabelWidth">
            <el-select v-model="form.subTaskTemplateIds" placeholder="请选择" :disabled="form.taskTypeId?false:true" multiple class="format" @visible-change="subTaskChange">
              <el-option v-for="(item,index) in subTasktions" :key="index" :label="item.subTaskName" :value="item.subTaskTemplateId" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="el-icon-d-caret" /> 计费项目
            </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px;" type="primary" icon="el-icon-edit" :append-to-body="true" @click="dialogAdd">添加</el-button>
            <el-table :data="itemList" border stripe>
              <el-table-column prop="billName" label="计费项目" />
              <el-table-column prop="quantity" label="数量" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index,itemList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="el-icon-d-caret" /> 技能
            </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px;" type="primary" icon="el-icon-edit" :append-to-body="true" @click="adddialogAddSkill=true">添加</el-button>
            <el-table :data="skillList" border stripe>
              <el-table-column prop="skillName" label="技能" />
              <el-table-column prop="quantity" label="数量" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index,skillList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAdditem" title="添加计费项目">
      <el-form :model="chargingform">
        <el-form-item label="选择计费项目:" :label-width="formLabelWidth">
          <el-select v-model="chargingform.billingItemId" :disabled="form.taskTypeId?false:true" placeholder="请选择">
            <el-option v-for="(items,indexs) in chargingOptions" :key="indexs" :label="items.billName" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="项目数量：" :label-width="formLabelWidth">
          <el-input v-model="chargingform.quantity" placeholder="请输入" style="width:200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="dialogAdditem=false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitem('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :visible.sync="adddialogAddSkill" title="添加技能">
      <el-form :model="chargingskillform">
        <el-form-item label="选择技能:" :label-width="formLabelWidth">
          <el-select v-model="chargingskillform.skillId" placeholder="请选择" @visible-change="skillChange">
            <el-option v-for="(items,indexs) in skillOptions" :key="indexs" :label="items.name" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="项目数量：" :label-width="formLabelWidth">
          <el-input v-model="chargingskillform.quantity" placeholder="请输入" style="width:200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="adddialogAddSkill=false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitskill()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initData, addDatafcn, wokeTpye, findData, skillData, subTaskData, eitDatafcn, deleteDatafcn } from '@/api/taskTemplate'
export default {
  name: 'TaskTemplate',
  data() {
    return {
      title: '',
      taskTypeVisible: false,
      edittaskVisible: false,
      adddialogAddSkill: false,
      dialogAdditem: false,
      formLabelWidth: '110px',
      orgnizationPartTable: [],
      orgnizations: [],
      skillList: [],
      itemList: [],
      taskTemplateId: '',
      activeNames: '',
      chargingform: {},
      chargingskillform: {},
      taskTypetions: [],
      orgnizationID: '',
      subTasktions: [],
      winEndTypeoption: [],
      chargingOptions: [],
      skillOptions: [],
      taskContinuedTypeoption: [{ label: '固定时间', value: 2 }, { label: '最小持续时间', value: 1 }],
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
      form: { templateName: '', templateCode: '', taskContinuedType: '', taskContinuedTime: '', winStartType: '', winStartTime: '', winEndType: '', winEndTime: '', subTaskTemplateIds: '', taskTypeId: '' },
      rules: {
        templateName: [{ required: true, message: '请输入任务模板名称', trigger: 'blur' }],

        taskContinuedType: [{ required: true, message: '请输入持续时间类型', trigger: 'blur' }],
        taskContinuedTime: [{ required: true, message: '请输入任务持续时间', trigger: 'blur' }],
        winStartType: [{ required: true, message: '请选择任务开始类型', trigger: 'blur' }],
        winStartTime: [{ required: true, message: '请选择任务开始时间', trigger: 'blur' }],
        winEndType: [{ required: true, message: '请选择任务结束类型', trigger: 'blur' }],
        winEndTime: [{ required: true, message: '请选择任务结束时间', trigger: 'blur' }],
        taskTypeId: [{ required: true, message: '请选择任务类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.taskTemplateId = this.$route.query.taskTemplateId
    this.init()
    this.wokeTypeData()
    this.subTaskData()
    this.findData()
    this.skillData()
  },
  mounted() {},
  methods: {
    init() {
      var data = { taskTemplateId: this.taskTemplateId }
      initData(data).then(response => {
        this.orgnizationPartTable = response.data
        this.orgnizations = response.data
      })
    },
    // wokeTypeChange(val) {
    //   if (val) {
    //     this.wokeTypeData()
    //   }
    // },
    wokeTypeData() {
      wokeTpye().then(response => {
        this.taskTypetions = response.data
      })
    },
    subTaskChange(val) {
      if (val) {
        this.subTaskData()
      }
    },
    subTaskData() {
      var data = this.form.taskTypeId
      subTaskData(data).then(response => {
        this.subTasktions = response.data
      })
    },
    skillChange(val) {
      if (val) {
        this.skillData()
      }
    },
    skillData() {
      var data1 = this.form.taskTypeId
      skillData(data1).then(response => {
        this.skillOptions = response.data.data
      })
    },
    // optionChangefind(val) {
    //   if (val) {
    //     this.findData()
    //   }
    // },
    findData() {
      var data = this.form.taskTypeId
      findData(data).then(response => {
        this.chargingOptions = response.data
      })
    },
    optionChange() {},

    remove(index, rows) {
      rows.splice(index, 1)
    },
    dialogAdd() {
      if (!this.form.taskTypeId) {
        this.$message({
          type: 'warning',
          message: '请先选择任务类型'
        })
      } else {
        this.dialogAdditem = true
      }
    },
    clearData() {
      this.itemList = []
      this.skillList = []
      this.form = { taskTypeId: '', templateName: '', templateCode: '', taskContinuedType: '', taskContinuedTime: '', winStartType: '', winStartTime: '', winEndType: '', winEndTime: '', subTaskTemplateIds: '' }
    },
    handleAddClickitem() {
      this.chargingform.billName = this.chargingOptions[this.chargingform.billingItemId].billName
      this.chargingform.billingItemId = this.chargingOptions[this.chargingform.billingItemId].billingItemId
      this.itemList.push(this.chargingform)
      this.dialogAdditem = false
      this.chargingform = {}
    },
    handleAddClickitskill() {
      this.chargingskillform.skillName = this.skillOptions[this.chargingskillform.skillId].name
      this.chargingskillform.skillId = this.skillOptions[this.chargingskillform.skillId].id
      this.skillList.push(this.chargingskillform)
      this.adddialogAddSkill = false
      this.chargingskillform = {}
    },
    cancelClick() {
      this.taskTypeVisible = false
      this.clearData()
    },
    addHandleClick() {
      this.clearData()
      this.title = '添加任务模板'
      this.taskTypeVisible = true
      this.activeNames = ''
    },
    editHandleClick(index, row) {
      var arr = []
      row.subTaskTemplatesNew.forEach(element => {
        arr.push(element.subTaskTemplateId)
      })
      this.form.templateName = row.templateName
      this.form.templateCode = row.templateCode
      this.form.taskContinuedType = row.taskContinuedType
      this.form.winStartType = row.winStartType
      this.form.winStartTime = row.winStartTime
      this.form.winEndType = row.winEndType
      this.form.winEndTime = row.winEndTime
      this.form.taskContinuedTime = row.taskContinuedTime
      this.form.subTaskTemplateIds = arr
      this.form.taskTypeId = row.taskTypeId
      this.skillList = row.skillBeans
      this.itemList = row.itemBeans
      this.taskTypeVisible = true
      this.title = '编辑任务模板'
      this.activeNames = ['1', '2']
      this.taskTemplateId = row.taskTemplateId
    },
    //     // 添加确定按钮
    handleAddClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '添加任务模板') {
            if (this.skillList.length === 0) {
              this.$message({
                message: '技能不能为空',
                type: 'error'
              })
            } else {
              this.form.itemBeans = this.itemList
              this.form.skillBeans = this.skillList
              var addData = this.form
              addDatafcn(addData).then(response => {
                this.init()
              })
              this.taskTypeVisible = false
            }
          } else {
            if (this.skillList.length === 0) {
              this.$message({
                message: '技能不能为空',
                type: 'error'
              })
            } else {
              this.form.itemBeans = this.itemList
              this.form.skillBeans = this.skillList
              var eitData = this.form
              eitData.taskTemplateId = this.taskTemplateId
              eitDatafcn(eitData).then(response => {
                this.init()
              })
              this.taskTemplateId = ''
              this.taskTypeVisible = false
            }
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

          deleteDatafcn(data).then(response => {
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
form {
  padding-top: 30px;
}
.format {
  width: 200px;
  margin-right: 120px;
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
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
