<template>
  <div class="ruleBox">
    <div class="contentBox1">
      <!-- 右侧规则内容 -->
      <div class="contentBoxRight">
        <div class="fitContent">
          <!-- 任务 -->
          <div class="addTarget">
            <div class="targetTitle">
              <span style="width: 186px; line-height: 50px">针对每个航班的任务配置</span>
              <div class="targetContent">
                <el-button type="primary" size="small" @click="addTarget">新增</el-button>
              </div>
            </div>
            <div class="targetBox" style="overflow: auto; height: 38vh">
              <el-card v-for="(item, index) in initData" :key="index" class="box-card" style="margin-bottom: 30px">
                <div slot="header" class="clearfix">
                  <span>{{ item.templateName }}</span>
                  <el-button style="float: right; margin-left: 20px" type="info" size="small" @click="deleteData(item.dispatchTaskId)">删除</el-button>
                  <el-button style="float: right" type="primary" size="small" @click="detailClick(item)">编辑</el-button>
                </div>
                <div class="text item">
                  <div style="width: 100%; height: 20px; border-bottom: 1px solid #fff; margin: 0 auto">
                    <span style="float: left; width: 40%">基本信息</span>
                    <span style="width: 30%">子任务信息</span>
                    <span style="float: right; width: 30%">计费项目</span>
                  </div>
                  <div style="width: 100%; margin: 0 auto; display: flex">
                    <div style="width: 40%">
                      <p>
                        <span class="leftp">任务持续类型：</span>
                        <span>{{ item.taskContinuedType === 1 ? '最小持续时间' : '固定时间' }}</span>
                      </p>
                      <p>
                        <span class="leftp">任务持续时间(分钟)：</span>
                        <span>{{ item.taskContinuedTime }}</span>
                      </p>
                      <p>
                        <span class="leftp">任务开始类型：</span>
                        <span>{{ item.winStartTypeName }}</span>
                      </p>
                      <p>
                        <span class="leftp">任务开始时间(分钟)：</span>
                        <span>{{ item.winStartTime }}</span>
                      </p>
                      <p>
                        <span class="leftp">任务结束类型：</span>
                        <span>{{ item.winEndTypeName }}</span>
                      </p>
                      <p>
                        <span class="leftp">任务结束时间(分钟)：</span>
                        <span>{{ item.winEndTime }}</span>
                      </p>
                      <p v-for="(itm, i) in item.skillBeans" :key="i">
                        <span style="width: 25%; text-align: right; display: inline-block">所需技能：</span>
                        <span>{{ itm.skillName }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>该技能所需数量：</span>
                        <span>{{ itm.quantity }}</span>
                      </p>
                    </div>
                    <div style="flex: 1">
                      <p v-for="(itm, i) in item.subTaskTemplates" :key="i">
                        <span>{{ itm.subTaskName }}</span>
                      </p>
                    </div>
                    <div style="width: 30%">
                      <p v-for="(itm, i) in item.itemBeans" :key="i">
                        <span>{{ itm.billName }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加任务dialog -->
    <div>
      <el-dialog :title="title" :visible.sync="dialogTableVisible">
        <div class="concretContent">
          <el-form :model="formAdd">
            <el-form-item label="选择任务类型:" :label-width="formLabelWidth">
              <el-select v-model="formAdd.workTypeId" placeholder="请选择" @visible-change="wokeTypeChange">
                <el-option v-for="(items, indexs) in wokeTypeOptions" :key="indexs" :label="items.taskTypeName" :value="items.taskTypeId" />
              </el-select>
            </el-form-item>
            <el-form :model="formAdd">
              <el-form-item label="选择任务模板:" :label-width="formLabelWidth">
                <el-select v-model="formAdd.templateId" placeholder="请选择" :disabled="formAdd.workTypeId ? false : true" @visible-change="taskChange">
                  <el-option v-for="(items, indexs) in absenceOptions" :key="indexs" :label="items.templateName" :value="items.taskTemplateId" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button style="background-color: #495373; color: white" @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="addConfirmTarget(formAdd)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { skill } from '@/api/skill'
import { taskRule, update2, selectTskeTpe, selectwokeType, addWoke, delFcn } from '@/api/realTimeJobRules'
export default {
  name: 'RuleGrouo',
  // eslint-disable-next-line vue/require-prop-types
  props: ['parent', 'tasktypeid', 'groupid', 'aiportId'],
  data() {
    return {
      taskId: '',
      ruleId: '',
      options: [],
      initData: [],
      title: '',
      title2: '',
      input: '',
      input2: '',
      radio: '',
      orgnizationPartTable: [],
      absenceOptions: [],
      wokeTypeOptions: [],
      taskRuletable: [],
      targetName: '',
      dialogFormVisible: false,
      showEdit: true,
      dialogTableVisible: false,
      formLabelWidth: '160px',
      targetList: [],
      formAdd: { templateId: '', workTypeId: '' },
      formRequire: { quantity: '', skillName: [] },
      rules: {
        quantity: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ],
        skillName: [{ required: true, message: '不能为空' }]
      }
    }
  },
  watch: {
    parent: {
      handler: function() {
        this.taskRule()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.skill()
  },
  methods: {
    // skill() {
    //   // 技能下拉框
    //   var data = {
    //     businessDomainId: this.$route.query.businessDomainId,
    //     airportId: this.$store.state.user.airport.airportId
    //   }
    //   skill(data).then((response) => {
    //     this.options = response.data
    //   })
    // },
    taskRule() {
      // 右下角任务查询
      if (this.parent) {
        var data = {
          ruleId: this.parent,
          airportId: this.$store.state.user.airport.airportId
        }
        taskRule(data).then((response) => {
          this.initData = response.data.data
          var typeOptions = this.$store.state.someStaticData.typeOptions
          if (this.initData) {
            this.initData.forEach((item) => {
              typeOptions.forEach((element) => {
                if (item.winStartType === element.value) {
                  item.winStartTypeName = element.label
                }
                if (item.winEndType === element.value) {
                  item.winEndTypeName = element.label
                }
              })
            })
          }
        })
      } else {
        this.orgnizationPartTable = []
      }
    },
    taskChange() {
      var data = {
        taskTypeId: this.formAdd.workTypeId,
        airportId: this.airportId
      }
      selectwokeType(data).then((response) => {
        this.absenceOptions = response.data
      })
    },
    wokeTypeChange() {
      const data = {
        ruleId: this.tasktypeid,
        airportId: this.airportId
      }
      selectTskeTpe(data).then((response) => {
        this.wokeTypeOptions = response.data
      })
    },
    detailClick(item) {
      this.$router.push({ path: '/dispatching/detail', query: { tasktypeid: this.tasktypeid, ruleId: this.parent, data: JSON.stringify(item), groupId: this.groupid }})
    },
    addTarget() {
      if (this.parent) {
        this.$router.push({ path: '/dispatching/detail', query: { tasktypeid: this.tasktypeid, ruleId: this.parent, title: '新增', groupId: this.groupid }})
      } else {
        this.$message.error('请选择规则树')
      }
    },
    addConfirmTarget(formAdd) {
      this.formAdd.airportId = this.airportId
      if (this.title === '添加任务') {
        this.formAdd.ruleId = this.parent
        addWoke(this.formAdd).then((response) => {
          this.taskRule()
          this.dialogTableVisible = false
        })
      } else {
        update2(this.formAdd).then((response) => {
          this.taskRule()
          this.dialogTableVisible = false
        })
      }
    },
    deleteData(id) {
      delFcn(id).then((response) => {
        if (response.data.code == 200) {
          this.initData.forEach((element, i) => {
            if (id == element.dispatchTaskId) {
              this.initData.splice(i, 1)
              this.$message.success('删除成功')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-card /deep/ {
  margin: 0;
}
.el-card__header /deep/ {
  padding: 10px 20px;
}
.clearfix {
  line-height: 30px;
}
.leftp {
  width: 45%;
  text-align: right;
  display: inline-block;
}
.el-input__inner {
  width: 200px;
  border: none !important;
  background: none;
}
.el-radio {
  color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: #232c47 !important;
}
.el-table__empty-block {
  background-color: #232c47;
}
</style>

<style lang="scss" scoped>
@import '../index.scss';
</style>
