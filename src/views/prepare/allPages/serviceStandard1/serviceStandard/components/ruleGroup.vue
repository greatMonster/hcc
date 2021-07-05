<template>
  <div class="ruleBox">
    <div class="contentBox">
      <!-- 右侧规则内容 -->
      <div class="contentBoxRight">
        <div class="fitContent">
          <!-- 任务 -->
          <div class="addTarget">
            <div class="targetTitle">
              <span style="width: 186px; line-height: 50px;">针对每个航班的任务配置</span>
              <div class="targetContent">
                <el-button type="primary" size="small" @click="addTarget">添加任务</el-button>
              </div>
            </div>
            <div v-for="(item,index) in taskRuletable" :key="index" class="targetBox">
              <div class="targetTitle">
                <span>{{ item.name }}</span>
                <span>
                  <el-button type="primary" style="width:70px;height:30px;line-height:7px" @click="editTarget(item)">编 辑</el-button>
                  <el-button type="primary" style="width:70px;height:30px;line-height:7px" @click="deleteTarget(item)">删 除</el-button>
                </span>
              </div>
              <div class="contentConcret">
                <!-- <div v-if="item.isAbsolute==true" class="contentConcret1">最小持续时间：{{ item.duration }}分钟</div> -->
                <!-- <div v-else class="contentConcret1">任务持续时长：{{ item.duration }}分钟</div> -->
                <div class="contentConcret1">任务持续时长：{{ item.duration }}分钟</div>
                <div v-if="item.templateConstraints[0]">
                  <div v-if="item.templateConstraints[0].isStartConstraint">
                    <div class="contentConcret3">任务窗口开始时间为： {{ item.templateConstraints[0].name }} {{ item.templateConstraints[0].offsetDuration }} 分钟</div>
                    <div v-if="item.templateConstraints[1]" class="contentConcret3">任务窗口结束时间为： {{ item.templateConstraints[1].name }} {{ item.templateConstraints[1].offsetDuration }} 分钟</div>
                  </div>
                  <div v-else>
                    <div v-if="item.templateConstraints[1]" class="contentConcret3">任务窗口开始时间为： {{ item.templateConstraints[1].name }} {{ item.templateConstraints[1].offsetDuration }} 分钟</div>
                    <div v-if="item.templateConstraints[0]" class="contentConcret3">任务窗口结束时间为： {{ item.templateConstraints[0].name }} {{ item.templateConstraints[0].offsetDuration }} 分钟</div>
                  </div>
                </div>
                <div class="contentConcret4">
                  要求：
                  <el-table :data="item.templateSkills2" border stripe>
                    <el-table-column prop="skillName" label="技能" />
                    <el-table-column prop="quantity" label="所需数量" />
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加任务dialog -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="dialogTableVisible" width="60%" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <div>
          <el-form ref="formAdd" :model="formAdd" :rules="rules2">
            <el-form-item label="名 称：" prop="name" :label-width="formLabelWidth">
              <el-input v-model="formAdd.name" />
            </el-form-item>
            <el-form-item label="任务持续时长：" prop="duration" :label-width="formLabelWidth">
              <!-- <el-radio-group v-model="radio"> -->
              <!-- <el-radio label="1">
                  <div class="miniBox">
                    <span>最小持续时间</span>
                    <el-input ref="radio1" v-model="input" />分钟
                  </div>
              </el-radio>-->
              <!-- <el-radio label="2"> -->
              <!-- <div class="fixedBox"> -->
              <!-- <span>任务持续时长</span> -->
              <el-input v-if="false" ref="radio2" v-model="formAdd.duration" style="width:80%" />
              <el-input ref="radio2" v-model="formAdd.duration" style="width:80%" @change="timeChange" />分钟
              <!-- </div> -->
              <!-- </el-radio> -->
              <!-- </el-radio-group> -->
            </el-form-item>
            <el-form-item label="任务窗口开始时间为：" :label-width="formLabelWidth" required>
              <el-row>
                <el-col :span="7">
                  <el-form-item prop="beginTime">
                    <el-select v-if="formAdd.templateConstraints" v-model="formAdd.beginTime" placeholder="请选择">
                      <el-option v-for="item in targetEndOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="8">
                  <el-form-item prop="durationBegin">
                    <el-input v-model="formAdd.durationBegin" style="width:80px" />分钟
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <div class="targetStart">
                <span>
                  <el-select v-if="formAdd.templateConstraints" v-model="formAdd.templateConstraints[0].constraintType" placeholder="请选择">
                    <el-option v-for="item in targetEndOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </span>
                <span>
                  <el-input v-model="formAdd.templateConstraints[0].offsetDuration" style="width:80px" />分钟
                </span>
                <span style="color: white" />
              </div>-->
            </el-form-item>
            <el-form-item label="任务窗口结束时间为：" :label-width="formLabelWidth" required>
              <el-row>
                <el-col :span="7">
                  <el-form-item prop="endTime">
                    <el-select v-if="formAdd.templateConstraints" v-model="formAdd.endTime" placeholder="请选择" @change="forceChange">
                      <el-option v-for="item in targetEndOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="8">
                  <el-form-item prop="durationEnd">
                    <el-input v-if="formAdd.templateConstraints" v-model="formAdd.durationEnd" style="width:80px" />分钟
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <div class="targetStart">
                <span>
                  <el-select v-if="formAdd.templateConstraints" v-model="formAdd.templateConstraints[1].constraintType" placeholder="请选择">
                    <el-option v-for="item in targetEndOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-input v-if="formAdd.templateConstraints" v-model="formAdd.templateConstraints[1].offsetDuration" style="width:80px" />分钟
                </span>
                <span style="color: white" />
              </div>-->
            </el-form-item>
            <el-form-item label="任务数量：" prop="taskNumber" :label-width="formLabelWidth">
              <el-input v-model="formAdd.taskNumber" style="width:320px" />
            </el-form-item>
            <el-form-item label="要 求：" :label-width="formLabelWidth">
              <span>
                <el-button type="primary" @click="addRequirement">增 加</el-button>
              </span>
              <el-table :data="formAdd.templateSkills2" border stripe>
                <el-table-column prop="skillName" label="技能" />
                <el-table-column prop="quantity" label="所需数量" />
                <!-- <el-table-column prop="skillId" label="技能id">
                  <template slot-scope="scope">{{ scope.row.obj }}</template>
                </el-table-column>-->
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button style="height:30px;line-height:5px;background-color:#495373;color:#fff" @click="editRowClick(scope.$index, scope.row)">编 辑</el-button> -->
                    <el-button style="height:30px;line-height:5px;background-color:#495373;color:#fff" @click="deleteRowClick(scope.$index, scope.row)">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button style="background-color:#495373;color:white" @click="dialogTableVisible = false">取 消</el-button> -->
          <el-button style="background-color:#495373;color:white" @click="cancelConfirmTarget">取 消</el-button>
          <el-button type="primary" @click="addConfirmTarget('formAdd')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 添加任务dialog内嵌套的弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title2" :visible.sync="dialogFormVisible" width="60%">
        <el-form ref="formRequire" :model="formRequire" :rules="rules">
          <el-form-item prop="skillType" label="技能类型：" :label-width="formLabelWidth">
            <el-select v-model="formRequire.skillType" size="small" filterable placeholder="请选择" style="width:220px">
              <el-option v-for="item in optionsSkill" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="技能" prop="skillName" :label-width="formLabelWidth">
            <el-select v-model="formRequire.skillName" multiple value-key="skillId" placeholder="请选择" @visible-change="skill">
              <el-option v-for="item in options" :key="item.skillId" :label="item.skillName" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="所需数量" prop="quantity" :label-width="formLabelWidth">
            <el-input v-model.number="formRequire.quantity" />
          </el-form-item>
        </el-form>
        <div v-if="title2=='增加'" slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="closeRequireDialogClick(formRequire.skillName)">确 定</el-button>
        </div>
        <div v-else slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="closeRequireDialogClick(formRequire)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { skill, ruleSkillSearch } from '@/api/skill'
import { taskRule, addRenWu, deleteById, update2 } from '@/api/serviceStandard'
export default {
  name: 'RuleGrouo',
  props: ['parent'],
  data() {
    return {
      optionsSkill: [
        { typeId: 'GROUP', typeName: '班组技能' },
        { typeId: 'PERSONAL', typeName: '员工技能' }
      ],
      airportId: this.$route.query.airportId,
      showClose: false,
      taskId: '',
      ruleId: '',
      options: [],
      title: '',
      title2: '',
      input: '',
      input2: '',
      radio: '',
      taskRuletable: [],
      targetName: '',
      dialogFormVisible: false,
      showEdit: true,
      dialogTableVisible: false,
      formLabelWidth: '170px',
      targetList: [],
      targetEndOptions: [
        { value: 'beforeARR', label: '进港前' },
        { value: 'afterARR', label: '进港后' },
        { value: 'beforeDEPT', label: '离港前' },
        { value: 'afterDEPT', label: '离港后' },
        { value: 'beforeLinkDEPT', label: '离港前(关联航班)' },
        { value: 'afterLinkDEPT', label: '离港后(关联航班)' },
        { value: 'beforeLinkARR', label: '进港前(关联航班)' },
        { value: 'afterLinkARR', label: '进港后(关联航班)' }
      ],
      formAdd: { name: '', input2: '', beginTime: '', durationBegin: '', endnTime: '', durationEnd: '', taskNumber: '1', isAbsolute: true, duration: '', templateConstraints: [{}, {}], templateSkills: [], templateSkills2: [], templateSkillGroups: [] },
      formRequire: { quantity: '', skillName: [] },
      rules: {
        quantity: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ],
        skillName: [{ required: true, message: '不能为空' }],
        skillType: [{ required: true, message: '不能为空' }]
      },
      rules2: {
        name: [{ required: true, message: '不能为空' }],
        taskNumber: [{ required: true, message: '不能为空' }],
        durationBegin: [{ required: true, message: '请填写任务窗口开始时间参数', trigger: 'blur' }],
        beginTime: [{ required: true, message: '请填写任务窗口开始时间参数', trigger: ['change', 'blur'] }],
        endTime: [{ required: true, message: '请填写任务窗口结束时间参数', trigger: ['change', 'blur'] }],
        durationEnd: [{ required: true, message: '请填写任务窗口结束时间参数', trigger: 'blur' }]
      }
    }
  },
  watch: {
    parent: {
      handler: function() {
        this.taskRule()
      },
      deep: true
    }
  },
  created() {
    // this.skill()
  },
  methods: {
    forceChange(e) {
      this.$forceUpdate()
    },
    timeChange(val) {

    },
    skill() {
      // 技能下拉框
      ruleSkillSearch({ skillType: this.formRequire.skillType, businessDomainId: this.$route.query.businessDomainId, airportId: this.airportId }).then((response) => {
        this.options = response.data.data
        // response.data.forEach(element => {
        //   console.log(element, 9999)
        //   this.options.push({ skillId: element.skillId, skillName: element.skillName })
        // })
      })
    },
    taskRule() {
      // 右下角任务查询
      taskRule(this.parent).then((response) => {
        this.taskRuletable = response.data
        this.taskRuletable.forEach((item) => {
          for (let i = 0; i < this.targetEndOptions.length; i++) {
            if (item.templateConstraints[0].constraintType === this.targetEndOptions[i].value) {
              item.templateConstraints[0].name = this.targetEndOptions[i].label
            }
            if (item.templateConstraints[1].constraintType === this.targetEndOptions[i].value) {
              item.templateConstraints[1].name = this.targetEndOptions[i].label
            }
          }
        })
        if (response.data) {
          response.data.forEach((element) => {
            var aa = []
            if (element.templateSkillGroups.length > 0) {
              element.templateSkillGroups.forEach((element) => {
                aa.push({ skillName: element.groupName, quantity: element.quantity })
              })
            }
            if (element.templateSkills.length > 0) {
              element.templateSkills.forEach((element) => {
                aa.push({ skillName: element.skillName, quantity: element.quantity })
              })
            }
            element.templateSkills2 = Object.assign([], aa)
          })
        }
      })
    },

    addTarget() {
      // 添加任务清空数据
      this.dialogTableVisible = true
      this.title = '添加任务'
      this.formAdd = { templateConstraints: [{}, {}], templateSkills: [], templateSkills2: [], templateSkillGroups: [] }
      if (this.$refs['formAdd']) {
        this.$refs['formAdd'].resetFields()
      }
      this.radio = ''
      this.formAdd.taskNumber = '1'
    },
    cancelConfirmTarget() {
      this.dialogTableVisible = false
      //   this.taskRule()
    },
    addConfirmTarget(formAdd) {
      // 添加任务弹框的确定按钮
      // if (this.radio && this.radio === '1') {
      //   if (this.input) {
      //     this.formAdd.isAbsolute = true
      //     this.formAdd.duration = this.input
      //     this.input2 = ''
      //   } else {
      //     this.$message.error('最小持续时间不能为空')
      //     return false
      //   }
      // }
      // else {
      //   if (this.radio && this.input2) {
      this.formAdd.isAbsolute = false
      // this.formAdd.duration = this.input2
      //     this.input = ''
      //   } else {
      //     this.$message.error('固定时间不能为空')
      //     return false
      //   }
      // }
      this.formAdd.templateConstraints[0].constraintType = this.formAdd.beginTime
      this.formAdd.templateConstraints[0].offsetDuration = this.formAdd.durationBegin
      this.formAdd.templateConstraints[1].constraintType = this.formAdd.endTime
      this.formAdd.templateConstraints[1].offsetDuration = this.formAdd.durationEnd
      this.formAdd.templateConstraints[0].isStartConstraint = true
      this.formAdd.templateConstraints[1].isStartConstraint = false
      // if (this.formAdd.templateConstraints[0].offsetDuration && this.formAdd.templateConstraints[0].constraintType && this.formAdd.templateConstraints[1].offsetDuration && this.formAdd.templateConstraints[1].constraintType) {
      // alert('submit!')
      if (this.title === '添加任务') {
        this.$refs[formAdd].validate((valid) => {
          if (valid) {
            if (this.parent) {
              this.formAdd.ruleId = this.parent
              addRenWu(this.formAdd).then((response) => {
                this.taskRule()
                this.dialogTableVisible = false
              })
            } else {
              this.$message.error('请选择一条规则，再添加任务')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        update2(this.formAdd).then((response) => {
          this.taskRule()
          this.dialogTableVisible = false
        })
      }
      // }
      // else {
      //   this.$message.error('任务窗口时间与类型为必填')
      // }
    },
    deleteTarget(item) {
      deleteById(item.taskTemplateId).then((response) => {
        this.taskRule()
      })
    },
    editTarget(item) {
      // 编辑数据回显
      if (item.templateConstraints[0].isStartConstraint) {
        item.beginTime = item.templateConstraints[0].constraintType
        item.durationBegin = item.templateConstraints[0].offsetDuration
        item.endTime = item.templateConstraints[1].constraintType
        item.durationEnd = item.templateConstraints[1].offsetDuration
      } else {
        item.beginTime = item.templateConstraints[1].constraintType
        item.durationBegin = item.templateConstraints[1].offsetDuration
        item.endTime = item.templateConstraints[0].constraintType
        item.durationEnd = item.templateConstraints[0].offsetDuration
      }
      this.taskId = item.taskTemplateId
      this.title = '编辑任务'
      this.formAdd = Object.assign({}, item)
      // if (this.formAdd.isAbsolute === false) {
      //   this.radio = '2'
      // this.input2 = item.duration
      // } else {
      //   this.radio = '1'
      //   this.input = item.duration
      // }
      this.dialogTableVisible = true
    },
    editRowClick(index, row) {
      // 弹框里
      this.title2 = '编 辑'
      this.dialogFormVisible = true

      this.formRequire.quantity = row.quantity
      console.log(this.formRequire, row, 7)
      this.formRequire.skillName.push({ skillName: row.skillName.split(',') })
      this.formRequire.skillName = Object.assign([], row)

      console.log(this.formAdd.templateSkillGroups[index].skills, 7)

      if (this.formAdd.templateSkillGroups) {
        this.formRequire.skillName = this.formAdd.templateSkillGroups[index].skills
      }

      localStorage.setItem('tableIndex', index)
    },
    addRequirement() {
      // 弹框里的表格增加
      this.title2 = '增加'
      this.formRequire = { quantity: '', skillName: [] } // 清空数据
      // console.log('这才是增加按钮', this.formRequire)
      // console.log('this.formAdd.templateSkillGroups', this.formAdd.templateSkillGroups)
      // console.log('this.formAdd.templateSkills', this.formAdd.templateSkills)
      this.dialogFormVisible = true
    },
    closeRequireDialogClick(item) {
      console.log('点击确定后', item)
      this.$refs.formRequire.validate((valid) => {
        if (valid) {
          if (this.title2 === '增加') {
            var arry1 = []
            var obj = []
            console.log(item, '增加212313')
            item.forEach((element) => {
              // 多个技能
              console.log(element, 887878)
              arry1.push(element.skillName)
              obj.push(element)
            })
            this.formAdd.templateSkills2.push({ quantity: this.formRequire.quantity, skillName: arry1.toString() })
            if (item.length > 1) {
              this.formAdd.templateSkillGroups.push({ skills: item, quantity: this.formRequire.quantity })
            } else {
              this.formAdd.templateSkills.push({ skillId: item[0].skillId, quantity: this.formRequire.quantity, skillName: item[0].skillName })
            }
            console.log(this.formAdd, '增加templateSkills')
          } else {
            // 编辑
            console.log(item, 45)
            var index = localStorage.tableIndex
            console.log(this.formAdd.templateSkills, index, 46)
            this.formAdd.templateSkills2[index].quantity = item.quantity
            // this.formAdd.templateSkills[index].skillId = item.skillName[0].skillId
            if (item.skillName.length > 1) {
              // this.formAdd.templateSkillGroups.push({ skills: item.skillName, quantity: this.formRequire.quantity })
              this.formAdd.templateSkillGroups = [{ skills: item.skillName, quantity: this.formRequire.quantity }]
            } else {
              this.formAdd.templateSkills[index].quantity = item.quantity
              this.formAdd.templateSkills[index].skillId = item.skillName[0].skillId
            }
            console.log('this.formAdd.templateSkillGroups', this.formAdd.templateSkillGroups)
            var arry = []
            item.skillName.forEach((element) => {
              arry.push(element.skillName)
            })
            this.formAdd.templateSkills2[index].skillName = arry.toString()
          }
          this.dialogFormVisible = false
        }
      })
    },
    deleteRowClick(index, row) {
      this.formAdd.templateSkills2.splice(index, 1)
      this.formAdd.templateSkills.splice(index, 1)
      this.formAdd.templateSkillGroups.splice(index, 1)
    }
  }
}
</script>

<style scoped>
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
