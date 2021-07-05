<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>设置任务</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addContractClick">添 加</el-button>
        <el-button v-if="calcShow" type="primary" size="medium" @click="startDistribute">开启定时生成任务</el-button>
        <el-button v-else type="primary" size="medium" @click="stopDistribute">停止定时生成任务</el-button>
        <el-button v-if="assignShow" type="primary" size="medium" @click="startAssign">开启派工</el-button>
        <el-button v-else type="primary" size="medium" @click="stopAssign">停止派工</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table border stripe :data="contractShowTable" @current-change="handleSelectChange">
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column prop="beginTime" label="任务时间">
          <template slot-scope="scope">{{ scope.row.beginTime }} - {{ scope.row.endTime }}</template>
        </el-table-column>
        <el-table-column prop="skillName" label="技能" />
        <el-table-column sortable prop="num" label="数量" />
        <el-table-column sortable prop="points" label="任务位置">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.points" :key="index">{{ item.name }}&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskTypeName" label="任务类型" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
            <el-button v-if="!scope.row.enable" type="primary" size="small" style="width: 60px; height: 30px" @click="disabledHandleClick(scope.$index, scope.row)">启 用</el-button>
            <el-button v-else type="danger" size="small" style="width: 60px; height: 30px; background-color: red" @click="disabledHandleClick(scope.$index, scope.row)">禁 用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :model="formEdit" :rules="rules">
          <el-form-item prop="beginTime" label="任务开始时间" :label-width="formLabelWidth">
            <vue-timepicker v-model="formEdit.beginTime" format="HH:mm" />
          </el-form-item>
          <el-form-item prop="endTime" label="任务结束时间" :label-width="formLabelWidth">
            <vue-timepicker v-model="formEdit.endTime" format="HH:mm" />
          </el-form-item>
          <el-form-item prop="taskTypeId" label="任务类型" :label-width="formLabelWidth">
            <el-select v-model="formEdit.taskTypeId" clearable filterable placeholder="请选择" style="width: 200px">
              <el-option v-for="item in codeOptions" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="skillId" label="技能" :label-width="formLabelWidth">
            <el-select v-model="formEdit.skillId" clearable filterable placeholder="请选择" style="width: 140px">
              <el-option v-for="item in skillOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="num" label="数量" :label-width="formLabelWidth">
            <!-- <el-input v-model="formEdit.contractTypeCode" placeholder="请输入" /> -->
            <el-input v-model="formEdit.num" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="points" label="任务位置" :label-width="formLabelWidth">
            <el-select v-model="formEdit.pointIds" multiple clearable filterable placeholder="请选择" style="width: 140px">
              <el-option v-for="item in positionOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 开启自动派工设置 -->
    <div>
      <el-dialog v-dialogDrag title="选择任务周期" :visible.sync="distributeVisable">
        <el-form ref="cycleForm" :model="cycleForm" :rules="cycleFormRules">
          <el-form-item prop="cycle" label="请选择任务周期" :label-width="formLabelWidth">
            <el-select v-model="cycleForm.cycle" clearable filterable placeholder="请选择" style="width: 200px">
              <el-option v-for="item in cycleOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="distributeVisable = false">取 消</el-button>
          <el-button type="primary" @click="cycleHandleEditClick('cycleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { searchTaskList, addsetTask, removeSetTask, updateSetTask, searchSkillList, cycleSetTask, startDistribution, stopDistribution, positionList, initStatus, assignStart, assignStop, assignStatus } from '@/apiNew/guardPoint'
import { initTableTask } from '@/api/taskType'
import VueTimepicker from 'vue2-timepicker'
export default {
  name: 'BaseAgreement',
  components: { VueTimepicker },
  data() {
    return {
      assignShow: true,
      calcShow: true,
      businessDomainId: this.$route.query.businessDomainId || '',
      skillOptions: [],
      distributeVisable: false,
      positionOptions: [],
      cycleOptions: [
        { id: 1, name: '一天' },
        { id: 7, name: '七天' }
      ],
      codeOptions: [],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      id: this.$route.query.siteId || '',
      contractShowTable: [],
      formEdit: {},
      cycleForm: {},
      cycleFormRules: {},
      rules: {
        contractTypeName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        contractTypeDesc: [{ required: true, message: '不能为空', trigger: 'blur' }],
        contractTypeCode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initTable()
    this.skillList()
    this.positionSearch()
    this.initstatus()
    this.taskTypesearch()
    this.searchAssignStatus()
  },
  methods: {
    taskTypesearch() {
      initTableTask({ id: this.businessDomainId, airportId: this.id }).then((response) => {
        this.codeOptions = response.data
      })
    },
    // 定时生成任务状态
    initstatus() {
      const data = {
        airportId: this.id,
        businessDomainId: this.businessDomainId
      }
      initStatus(data).then((response) => {
        if (response.data.data === 'NORMAL') {
          this.calcShow = false
        } else {
          this.calcShow = true
        }
      })
    },
    // 派工状态
    searchAssignStatus() {
      assignStatus({ airportId: this.id, businessDomainId: this.businessDomainId }).then((res) => {
        if (res.data.data === 'NORMAL') {
          this.assignShow = false
        } else {
          this.assignShow = true
        }
      })
    },
    positionSearch() {
      const data = {
        airportId: this.id
      }
      positionList(data).then((response) => {
        this.positionOptions = response.data.data
      })
    },
    skillList() {
      searchSkillList({ businessDomain: this.businessDomainId || 103, airportId: this.id }).then((response) => {
        this.skillOptions = response.data.data
      })
    },
    printClick() {},
    importClick() {},
    initTable() {
      searchTaskList({ airportId: this.id, businessDomainId: this.businessDomainId }).then((response) => {
        this.contractShowTable = response.data.data
      })
    },
    // 添加合同
    addContractClick() {
      // this.formEdit.skillId = ''
      // this.formEdit.num = ''
      // this.formEdit.pointIds = []
      this.title = '添加'
      if (this.$refs['formName'] === 'undefined') {
        this.$refs['formName'].restFields()
      }
      this.formEdit.beginTime = { HH: '00:00', mm: '00:00' }
      this.formEdit.endTime = { HH: '00:00', mm: '00:00' }
      this.editSkillVisible = true
    },
    disabledHandleClick(index, row) {
      const enabled = row.enable === 1 ? 0 : 1
      // const data = {
      //   id: row.guardTaskSettingId,
      //   enable: enabled
      // }
      const ids = []
      row.points.forEach((element) => {
        ids.push(element.id)
      })
      row.id = row.guardTaskSettingId
      row.enable = enabled
      row.pointIds = row.ids
      row.businessDomainId = this.businessDomainId
      updateSetTask(row)
        .then((response) => {
          this.initTable()
          this.$message({
            type: 'success',
            message: '状态修改成功'
          })
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      // this.formEdit.id = row.guardTaskSettingId
      this.title = '修改'
      const ids = []
      row.points.forEach((element) => {
        ids.push(element.id)
      })
      this.formEdit = Object.assign(
        {},
        {
          beginTime: { HH: row.beginTime.split(':')[0], mm: row.beginTime.split(':')[1] },
          endTime: { HH: row.endTime.split(':')[0], mm: row.endTime.split(':')[1] },
          skillId: row.skillId,
          num: row.num,
          pointIds: ids,
          id: row.guardTaskSettingId,
          taskTypeId: row.taskTypeId
        }
      ) // copy obj
      this.editSkillVisible = true
    },
    edituserbleClick() {},
    startDistribute() {
      this.distributeVisable = true
    },
    cycleHandleEditClick() {
      const data = {
        airportId: Number(this.id),
        dayNum: this.cycleForm.cycle,
        businessDomainId: this.businessDomainId
      }
      cycleSetTask(data).then((response) => {
        // alert('success')
        this.distributeVisable = false
        this.$message.success('设置成功，已开启定时生成任务')
        this.startDistribute1()
        // this.$router.push({ path: '/dispatching/guardPoint/guardPoint', query: { airportId: this.id } })
      })
    },
    // 开始定时生成任务
    startDistribute1() {
      const data = {
        airportId: this.id,
        businessDomainId: this.businessDomainId
      }
      startDistribution(data).then((response) => {
        this.calcShow = false
      })
    },
    // 停止定时生成任务
    stopDistribute() {
      const data = {
        airportId: this.id,
        businessDomainId: this.businessDomainId
      }
      stopDistribution(data).then((response) => {
        this.calcShow = true
        this.$message.success(response.data.message)
      })
    },
    // 开始派工
    startAssign() {
      assignStart({ airportId: this.id, businessDomainId: this.businessDomainId })
        .then((res) => {
          this.assignShow = false
          this.$message.success(res.data.message)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 停止派工
    stopAssign() {
      assignStop({ airportId: this.id, businessDomainId: this.businessDomainId })
        .then((res) => {
          this.assignShow = true
          this.$message.success(res.data.message)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      this.formEdit.beginTime = this.formEdit.beginTime.HH + ':' + this.formEdit.beginTime.mm
      this.formEdit.endTime = this.formEdit.endTime.HH + ':' + this.formEdit.endTime.mm
      this.formEdit.airportId = this.id
      this.formEdit.businessDomainId = this.businessDomainId
      if (this.title === '修改') {
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            updateSetTask(this.formEdit).then((response) => {
              this.$message.success('修改成功')
              this.initTable()
            })
            this.editSkillVisible = false
          }
        })
      } else {
        // this.formEdit.id = this.id
        this.$refs['formName'].validate((valid) => {
          if (valid) {
            // this.formEdit.beginTime = this.formEdit.timeRange[0]
            // this.formEdit.endTime = this.formEdit.timeRange[1]
            // this.formEdit.airportId = this.id
            this.formEdit.businessDomainId = this.businessDomainId
            this.formEdit.airportId = this.id
            addsetTask(this.formEdit).then((response) => {
              this.$message.success('添加成功')
              this.initTable()
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    handleSelectChange(row) {
      console.log(row)
    },
    open(index, row) {
      var data2 = {
        id: row.guardTaskSettingId,
        businessDomainId: this.businessDomainId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeSetTask(data2).then((response) => {
            this.initTable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.skillBox /deep/ .vue__time-picker input.display-time {
  background: #1b2541;
  color: white;
  border: 1px solid #425079;
}
form {
  padding-top: 20px;
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
</style>
