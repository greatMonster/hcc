<template>
  <div class="skillBox">
    <div class="title">
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="orgnizationPartTable" border stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="subTaskName" sortable label="子任务名称" />
        <el-table-column prop="subTaskSeqNum" sortable label="子任务顺序" />
        <el-table-column prop="subTaskMandatory" label="是否强制">
          <template slot-scope="scope">
            <span v-if="scope.row.subTaskMandatory==0">强制</span>
            <span v-if="scope.row.subTaskMandatory==1">不强制</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskTypeName" label="任务类型名称" />
        <el-table-column prop="itemList" label="计费项目(数量)">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.itemList" :key="index">{{ item.itemDesc }}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="taskTypeVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form ref="ruleForm" :model="form" style="margin-left:200px" :rules="rules">
          <el-form-item prop="subTaskName" label="任务名称：" :label-width="formLabelWidth" style="width:400px">
            <el-input v-model="form.subTaskName" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item prop="subTaskSeqNum" label="任务顺序：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.subTaskSeqNum" placeholder="请选择" style="width:280px">
              <el-option v-for="item in SeqNumtions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="subTaskMandatory" label="是否强制：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.subTaskMandatory" placeholder="请选择" style="width:280px">
              <el-option v-for="item in subTasktions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="taskTypeId" label="任务类型：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.taskTypeId" placeholder="请选择" style="width:280px">
              <el-option v-for="item in taskTypetions" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId" />
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
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAddSkill" title="添加子任务">
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
        <el-button @click="dialogAddSkill = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddbtn('chargingform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initData, findData, wokeTpye, addDatafcn, eitDatafcn, delDatafcn } from '@/api/subtaskTemplate'
export default {
  name: 'SubtaskTemplate',
  data() {
    return {
      title: '',
      taskTypeVisible: false,
      edittaskVisible: false,
      formLabelWidth: '120px',
      orgnizationPartTable: [],
      activeNames: '',
      subTaskTemplateId: '',
      orgnizations: [],
      taskTypetions: [],
      dialogAddSkill: false,
      itemList: [],

      chargingform: {},
      chargingOptions: [],
      subTasktions: [{ value: 0, label: '强制' }, { value: 1, label: '不强制' }],
      SeqNumtions: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' }],
      form: { subTaskName: '', subTaskSeqNum: '', subTaskMandatory: '', taskTypeId: '' },
      rules: {
        subTaskName: [{ required: true, message: '请输入任务名称', trigger: ['change'] }],
        subTaskSeqNum: [{ required: true, message: '请输入任务顺序', trigger: ['blur', 'change'] }],
        subTaskMandatory: [{ required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }],
        taskTypeId: [{ required: true, message: '请输入任务类型', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.init()
    this.findData()
    this.wokeTypeData()
  },
  methods: {
    init() {
      initData().then(response => {
        this.orgnizationPartTable = response.data
        this.orgnizations = response.data
      })
    },
    // optionChange(val) {
    //   if (val) {
    //     this.findData()
    //   }
    // },
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
    findData() {
      var data = this.form.taskTypeId
      findData(data).then(response => {
        this.chargingOptions = response.data
      })
    },
    addHandleClick() {
      this.title = '添加子任务模板'
      this.taskTypeVisible = true
    },
    editHandleClick(index, row) {
      // debugger
      this.form.subTaskName = row.subTaskName
      this.form.subTaskSeqNum = row.subTaskSeqNum
      this.form.subTaskMandatory = row.subTaskMandatory
      this.form.taskTypeId = row.taskTypeId
      this.subTaskTemplateId = row.subTaskTemplateId
      this.itemList = row.itemList
      this.taskTypeVisible = true
      this.title = '编辑子任务模板'
      this.activeNames = '1'
    },
    //     // 添加确定按钮
    handleAddClick(formName) {
      // debugger
      this.$refs[formName].validate(valid => {
        if (valid) {
          // debugger
          if (this.title === '添加子任务模板') {
            this.form.itemList = this.itemList
            const addData = this.form

            addDatafcn(addData).then(response => {
              this.init()
              this.cleardata()
              this.activeNames = ''
            })
            this.taskTypeVisible = false
          } else {
            this.form.itemList = this.itemList
            this.form.subTaskTemplateId = this.subTaskTemplateId
            var eitData = this.form
            eitDatafcn(eitData).then(response => {
              this.init()
              this.cleardata()
            })
            this.activeNames = ''
            this.subTaskTemplateId = ''
            this.taskTypeVisible = false
          }
        } else {
          return false
        }
      })
    },
    cancelClick() {
      this.taskTypeVisible = false
      this.cleardata()
    },
    cleardata() {
      this.form = { subTaskName: '', subTaskSeqNum: '', subTaskMandatory: '', taskTypeId: '' }
      this.itemList = []
    },
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            subTaskTemplateId: row.subTaskTemplateId
          }
          delDatafcn(data).then(response => {
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
    },
    dialogAddbtn() {
      // debugger
      this.chargingform.billName = this.chargingOptions[this.chargingform.billingItemId].billName
      this.chargingform.billingItemId = this.chargingOptions[this.chargingform.billingItemId].billingItemId
      this.itemList.push(this.chargingform)
      this.dialogAddSkill = false
      this.chargingform = {}
    },
    dialogAdd() {
      if (!this.form.taskTypeId) {
        this.$message({
          type: 'warning',
          message: '请先选择任务类型'
        })
      } else {
        this.dialogAddSkill = true
      }
    },
    remove(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style scoped>
form {
  padding-top: 30px;
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
