<template>
  <div class="user-box">
    <div class="title">班组概况总览</div>
    <div class="add-user">
      <!-- <span><el-button type="primary" size="small">导入</el-button></span>  -->
      <div ref="headerFilter" style="width: 600px; margin-left: 20px; padding-top: 10px">
        <el-form :inline="true" :model="formSelect" class="demo-form-inline" size="small">
          <el-form-item label="组织/部门" class="select">
            <el-select v-model="formSelect.organizationId" clearable placeholder="请选择" @visible-change="optionChange">
              <el-option v-for="(items, indexs) in organizationOptions" :key="indexs" :label="items.organizationName" :value="items.organizationId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmit">查 询</el-button>
            <el-button type="primary" size="small" @click="handleAddClick">新 增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :empty-text="textData" :data="tableData" border stripe :max-height="tableHeight" :row-key="getRowKeys" :expand-row-keys="expands">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.employeeResourceInfoBeanList" align="center" border stripe>
            <el-table-column align="center" prop="employeeName" label="姓名">
              <template slot-scope="scope">
                <i v-if="!scope.row.isLeader" class="el-icon-user-solid" />
                <span>{{ scope.row.employeeName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="gender" label="性别">
              <template slot-scope="scope">
                <span>{{ scope.row.gender == '1' ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="skillBeanList" label="技能">
              <template slot-scope="scope">
                <span v-for="(item, i) in scope.row.skillBeanList" :key="i">{{ item.skillName }}&nbsp;</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="employeeCode" label="员工编号" />
            <el-table-column v-if="props.row.workGroupType == '0' ? true : false" align="center" width="120px" prop="isToLoan" label="借调">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isToLoan" placeholder="请选择" size="mini" @change="sndoffon(scope.$index, scope.row)">
                  <el-option v-for="(items, index) in offonOptions" :key="index" :label="items.label" :value="items.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="Leaderadd(scope.$index, scope.row)">设为组长</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" />
      <el-table-column prop="employeeGroupName" sortable label="班组名称" min-width="120" />
      <el-table-column prop="workGroupType" label="班组类型" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.workGroupType == '0' ? '固定班组' : '临时班组' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupSkillName" label="班组技能" min-width="110" />
      <!-- <el-table-column prop="groupRoleName" label="角色" min-width="110" /> -->
      <el-table-column prop="organizationName" label="组织/部门" min-width="110" />
      <el-table-column prop="capacity" label="班组所需人数" min-width="110" />
      <el-table-column prop="count" sortable label="已有成员数" min-width="120" />
      <!-- <el-table-column prop="isLock" sortable label="锁定">
        <template slot-scope="scope">
          <span>{{ scope.row.isLock == 1?'是':'否' }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column prop="workGroupStatus" label="班组状态">
        <template slot-scope="scope">
          <span>{{ scope.row.workGroupStatus == '0'? '全员':'缺员' }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column prop="workGroupAbility" label="班组能力">
        <template slot-scope="scope">
          <span>{{ scope.row.workGroupAbility == '0'? '全员班组':scope.row.workGroupAbility == '1'?'缺员班组':'加强班组' }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="workTypeName" label="工作类型" />
      <el-table-column prop="intlType" label="国内/国际" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.intlType == 'I' ? '国际' : scope.row.intlType == 'D' ? '国内' : '国内/国际' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupRole" label="角色" />
      <el-table-column prop="skillList" label="成员技能" min-width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.skillList.length > 1">
            <el-popover trigger="hover" placement="right">
              <p v-for="(item, index) in scope.row.skillList" :key="index">{{ item.skillName }}</p>
              <div slot="reference">{{ scope.row.skillList[0].skillName }}…</div>
            </el-popover>
          </div>
          <div v-else>
            <span v-if="scope.row.skillList.length === 0" />
            <span v-else>{{ scope.row.skillList[0].skillName }}&nbsp;&nbsp;</span>
          </div>
          <!-- <span v-for="item in scope.row.skillList" :key="item.skillId">{{ item.skillName }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="workGroupGender" label="性别要求">
        <template slot-scope="scope">
          <span>{{ scope.row.workGroupGender == 1 ? '男' : scope.row.workGroupGender == 2 ? '女' : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="genderCount" label="性别要求人数" /> -->
      <el-table-column v-if="businessDomainId" fixed="right" label="操作" width="315">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditClick(scope.$index, scope.row)">修 改</el-button>
          <el-button type="primary" size="mini" @click="addStaff(scope.$index, scope.row)">编辑成员</el-button>
          <el-button type="primary" size="mini" @click="automatic(scope.$index, scope.row)">自动分配</el-button>
          <el-button type="primary" size="mini" @click="removedata(scope.$index, scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建班组弹框 -->
    <div>
      <el-dialog v-dialogDrag :visible.sync="dialogAdd" :title="title" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form ref="ruleForm" :model="team" :inline="true" :rules="rules">
          <el-form-item prop="employeeGroupName" label="班组名称" :label-width="formLabelWidth">
            <el-input v-model="team.employeeGroupName" placeholder="请输入名称" style="width: 200px" />
            <span v-if="suffixShow">{{ suffix }}</span>
          </el-form-item>
          <el-form-item prop="organizationId" label="组织/部门" :label-width="formLabelWidth">
            <el-select v-model="team.organizationId" placeholder="请选择" @change="optionChangeorganization">
              <el-option v-for="(items, index) in organizationOptions" :key="index" :label="items.organizationName" :value="items.organizationId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="groupSkillId" label="班组技能" :label-width="formLabelWidth">
            <el-select v-model="team.groupSkillId" placeholder="请选择" @visible-change="optionChangeskill">
              <el-option v-for="(items, index) in skillOptions" :key="index" :label="items.skillName" :value="items.skillId" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="groupRole" label="角色" label-width="140px">
            <el-select v-model="team.groupRoleId" placeholder="请选择" @visible-change="optionGroupRole">
              <el-option v-for="(items, index) in roleOptions" :key="index" :label="items.roleName" :value="items.roleId" />
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item prop="capacity" label="员工人数：" :label-width="formLabelWidth">
            <el-input v-model.number="team.capacity" placeholder="请输入数字" style="width:200px" />
          </el-form-item>-->
          <el-form-item prop="workTypeId" label="工作类型" :label-width="formLabelWidth">
            <el-select v-model="team.workTypeId" placeholder="请选择" @visible-change="optionChangeworkType">
              <el-option v-for="(items, index) in workTypeIdOptions" :key="index" :label="items.workTypeName" :value="items.workTypeId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="intlType" label="国际/国内" :label-width="formLabelWidth">
            <el-select v-model="team.intlType" placeholder="请选择">
              <el-option v-for="item in intlTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="workGroupType" label="班组类型" :label-width="formLabelWidth">
            <el-select v-model="team.workGroupType" placeholder="请选择">
              <el-option v-for="(items, index) in workGroupTypeOptions" :key="index" :label="items.label" :value="items.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="workGroupGender" label="性别要求" :label-width="formLabelWidth">
            <el-select v-model="team.workGroupGender" placeholder="请选择">
              <el-option v-for="(items, index) in workGroupGenderOptions" :key="index" :label="items.label" :value="items.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="genderCount" label="性别要求人数" :label-width="formLabelWidth">
            <el-input v-model="team.genderCount" placeholder="请输入人数" style="width: 200px" />
          </el-form-item>
          <el-form-item v-show="offon" prop="workGroupCount" label="班组数量：" :label-width="formLabelWidth">
            <el-input v-model="team.workGroupCount" placeholder="请输入批量创建的班组个数" style="width: 200px" />
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title"> <i class="el-icon-d-caret" /> 成员技能 </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" :append-to-body="true" @click="dialogAddSkill = true">添加</el-button>
            <el-table :data="skillList" border stripe>
              <el-table-column prop="skillName" label="员工技能" />
              <el-table-column prop="skillCount" label="所需员工人数" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index, skillList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogclose">取 消</el-button>
          <el-button type="primary" @click="AddTeamsClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 添加员工弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="dialogEditVisible" width="60%">
        <template slot="title"> <i class="el-icon-d-caret" /> 添加员工 </template>
        <div style="text-align: center">
          <el-transfer
            v-model="value"
            style="text-align: left; display: inline-block"
            filterable
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :render-content="renderFunc"
            :titles="['可用人员', '已存在人员']"
            :button-texts="['添加', '添加']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            :data="transfer"
            @mouseover.native="addTitle"
            @change="handleChange"
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAddSkill" title="添加成员">
      <el-form ref="skillform" :model="skillform" :rules="skillformRules">
        <el-form-item label="选择员工技能:" :label-width="formLabelWidth" prop="skillId">
          <el-select v-model="skillform.skillId" placeholder="请选择" @visible-change="optionChangePersonalskill">
            <el-option v-for="(items, indexs) in skillPersonalOptions" :key="indexs" :label="items.skillName" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="skillCount" label="所需员工人数：" :label-width="formLabelWidth">
          <el-input v-model.number="skillform.skillCount" placeholder="请输入" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddSkill = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddbtn('skillform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="block">
      <el-pagination background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { skill, roleOptions, workType, organization, sendTeamData, initData, personnelData, editTeamData, addPersonnel, isLeader, removedata, sendoffon, automatic } from '@/api/teaManagement'
import { ruleSkillSearch1 } from '@/api/skill'
export default {
  data() {
    return {
      skillPersonalOptions: [],
      suffix: '',
      businessDomainId: this.$route.query.businessDomainId || 0,
      airportId: this.$store.state.user.airport.airportId,
      suffixShow: false,
      skillformRules: {
        skillCount: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        skillId: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      },
      roleOptions: [],
      groupSkillOptions: [],
      tableHeight: null,
      totalled: {},
      textData: '正在加载',
      page: {
        pageSize: 50,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      getRowKeys(row) {
        return row.employeeGroupId
      },
      PersonnelId: '',
      title: '',
      activeNames: [],
      // 下拉框数组
      skillOptions: [],
      intlTypeOptions: [
        { value: 'I', label: '国际' },
        { value: 'D', label: '国内' },
        { value: 'D/I', label: '国内/国际' }
      ],
      offonOptions: [
        { value: 2, label: '是' },
        { value: 0, label: '否' }
      ],
      workGroupTypeOptions: [
        { value: '1', label: '临时班组' },
        { value: '0', label: '固定班组' }
      ],
      workGroupGenderOptions: [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
      ],
      organizationOptions: [],
      workTypeIdOptions: [],
      formSelect: { organizationId: '' },
      skillform: {},
      offon: true,
      expands: [],
      team: {
        employeeGroupName: '',
        // 'description': '',
        capacity: '',
        workTypeId: '',
        organizationId: '',
        intlType: '',
        workGroupType: '',
        workGroupGender: '',
        genderCount: '',
        workGroupCount: '1',
        employeeGroupId: '',
        groupSkillId: ''
      },
      rules: {
        employeeGroupName: [{ required: true, message: '请输入名称', trigger: ['change'] }],
        // capacity: [{ required: true, message: '请输入员工人数', trigger: ['blur', 'change'] }],
        workTypeId: [{ required: true, message: '请选择工作类型', trigger: ['blur', 'change'] }],
        organizationId: [{ required: true, message: '请选择组织部门', trigger: ['blur', 'change'] }],
        intlType: [{ required: true, message: '请选择国际/国内', trigger: ['change'] }],
        workGroupType: [{ required: true, message: '请选择班组类型', trigger: ['blur', 'change'] }],
        workGroupCount: [{ required: true, message: '请输入班组数量', trigger: ['blur', 'change'] }],
        groupSkillId: [{ required: true, message: '请选择班组技能', trigger: 'change' }]
      },
      skillList: [],
      dialogAdd: false,
      dialogEditVisible: false,
      dialogAddRole: false,
      dialogAddSkill: false,
      tableData1: '',
      formLabelWidth: '150px',
      tableData: [],
      transfer: [],
      value: [],
      valueData: [],
      renderFunc(h, option) {
        return <span>{option.label}</span>
      }
    }
  },
  created() {
    this.init()
    this.optionGroupRole()
    this.organization()
    // this.optionChangeskill()
    // this.workType()
  },
  methods: {
    // 给穿梭框添加title
    addTitle(e) {
      const target_el = e.target
      if (target_el.title) return
      // if (/*满足一定条件时候*/) {
      target_el.title = target_el.innerText
      // }
    },
    optionGroupRole() {
      // 角色下拉
      if (this.team.groupSkillId) {
        const data = {
          id: this.team.groupSkillId
        }
        roleOptions(data).then((response) => {
          this.roleOptions = response.data
        })
      }
    },
    handleChange(value, direction, movedKeys) {
      this.valueData = value
    },
    init() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.headerFilter.getBoundingClientRect().top - 125
      })
      var data = {
        organizationId: this.formSelect.organizationId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        businessDomainId: this.businessDomainId,
        airportId: this.airportId
      }
      initData(data).then((response) => {
        if (response.data.list) {
          this.page.total = response.data.total
          response.data.list.forEach((element) => {
            if (element.employeeResourceInfoBeanList.length > 0) {
              element.employeeResourceInfoBeanList.forEach((element1) => {
                element1.isLeader = element1.employeeId === element.groupLeaderId ? 0 : 1
              })
            }
          })
          this.tableData = response.data.list
        } else {
          this.textData = '暂无数据'
        }
      })
    },
    onSubmit() {
      this.init()
    },
    optionChange(val) {
      // 下拉
      if (val) {
        this.organization()
      }
    },
    addStaff(index, rows) {
      // debugger
      this.dialogEditVisible = true
      const data = {
        employeeGroupId: rows.employeeGroupId,
        organizationId: rows.organizationId
      }
      this.employeeGroupId = rows.employeeGroupId
      personnelData(data).then((response) => {
        this.transfer = []
        response.data.forEach((item, index) => {
          var skills = ''
          if (item.skillBeanList) {
            skills = item.skillBeanList.reduce((pre, cur, index) => {
              if (index < item.skillBeanList.length - 1) {
                return pre + cur.skillName + ','
              } else {
                return pre + cur.skillName
              }
            }, '')
          }
          this.transfer.push({
            label: item.employeeName + '(' + skills + ')',
            key: item.employeeId
          })
        })
      })
      this.value = []
      this.valueData = []
      rows.employeeResourceInfoBeanList.forEach((items, index) => {
        this.value.push(items.employeeId)
        this.valueData.push(items.employeeId)
      })
    },
    optionChangePersonalskill() {
      // 个人技能下拉数据
      ruleSkillSearch1({ skillType: 'PERSONAL', organizationId: this.team.organizationId || '', airportId: this.airportId }).then((response) => {
        this.skillPersonalOptions = response.data.data
      })
    },
    optionChangeskill(val) {
      // 技能下拉数据
      // if (val) {
      this.skill('group')
      // }
    },
    skill(val) {
      if (val === 'group') {
        // 技能下拉框
        ruleSkillSearch1({ skillType: 'GROUP', organizationId: this.team.organizationId || '', airportId: this.airportId }).then((response) => {
          this.skillOptions = response.data.data
        })
      }
      // var data = {
      //   businessDomainId: this.$route.query.businessDomainId || '',
      //   organizationId: this.team.organizationId
      // }
      // skill(data).then(response => {
      //   this.skillOptions = response.data
      // })
    },
    optionChangeworkType(val) {
      if (val) {
        this.workType()
      }
    },
    workType() {
      var data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        organizationId: this.team.organizationId,
        airportId: this.airportId
      }
      workType(data).then((response) => {
        this.workTypeIdOptions = response.data
      })
    },
    optionChangeorganization(val) {
      // 下拉
      if (val) {
        this.organization()
      }
      this.team.workTypeId = ''
      this.team.groupSkillId = ''
    },
    organization() {
      var data = {
        businessDomainId : this.businessDomainId,
        airportId: this.airportId
      }
      organization(data).then((response) => {
        this.organizationOptions = response.data
      })
      this.optionChangeskill()
      this.workType()
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.init()
    },
    importClick() {},
    handleAddClick() {
      this.offon = true
      this.title = '创建班组'
      this.team = {
        employeeGroupName: '',
        // 'description': '',
        capacity: '',
        workTypeId: '',
        organizationId: '',
        intlType: '',
        workGroupType: '',
        workGroupGender: '',
        genderCount: '',
        workGroupCount: '1',
        employeeGroupId: '',
        groupSkillId: ''
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.clearValidate()
      }
      this.dialogAdd = true
      this.suffixShow = false
    },

    dialogAddbtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.skillform.skillName = this.skillPersonalOptions[this.skillform.skillId].skillName
          this.skillform.skillId = this.skillPersonalOptions[this.skillform.skillId].skillId
          this.skillList.push(this.skillform)
          this.dialogAddSkill = false
          this.skillform = {}
        } else {
          return false
        }
      })
    },
    async handleEditClick(index, row) {
      this.title = '修改班组'
      this.dialogAdd = true
      this.offon = false
      this.suffixShow = true
      this.suffix = row.nameSuffix
      this.team = {
        employeeGroupName: row.namePrefix,
        capacity: row.capacity,
        workTypeId: row.workTypeId,
        organizationId: row.organizationId,
        intlType: row.intlType,
        workGroupType: row.workGroupType,
        workGroupGender: row.workGroupGender,
        genderCount: row.genderCount,
        workGroupCount: row.workGroupCount,
        employeeGroupId: row.employeeGroupId,
        groupSkillId: row.groupSkillId,
        groupRoleId: row.groupRoleId
      }
      this.optionGroupRole()
      this.skillList = row.skillList
      this.activeNames = ['1']
    },
    handleConfirmClick() {
      console.log(this.valueData)
      const data = {
        employeeGroupId: this.employeeGroupId,
        employeeIdArray: this.valueData
      }
      this.dialogEditVisible = false
      addPersonnel(data).then((response) => {
        this.init()
      })
    },
    AddTeamsClick(formName) {
      // var totalCount = null
      // if (this.skillList.length > 0) {
      //   totalCount = this.skillList.reduce((pre, cur) => {
      //     return pre + cur.skillCount
      //   }, 0)
      // }
      // if (totalCount > this.team.capacity) {
      //   this.$message.warning('成员列表中所需员工人数的总和不得大于员工人数')
      //   return false
      // } else {
      if (this.team.workGroupGender) {
        if (!this.team.genderCount) {
          this.$message.warning('您选择了性别要求，则性别要求人数不能为空')
          return false
        }
      }
      if (this.team.genderCount) {
        if (!this.team.workGroupGender) {
          this.$message.warning('您选择了要求人数，则性别要求不能为空')
          return false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '创建班组') {
            if (this.skillList.length === 0) {
              this.$message({
                message: '技能不能为空',
                type: 'error'
              })
              this.activeNames = ['1']
            } else {
              this.team.skillList = this.skillList
              var data = this.team //
              sendTeamData(data).then((response) => {
                this.$message.success('新增成功')
                this.init()
                this.cleardata()
              })
              this.dialogAdd = false
              this.activeNames = []
            }
          } else if (this.title === '修改班组') {
            this.team.skillList = this.skillList
            this.team.employeeGroupName = this.team.employeeGroupName + this.suffix
            data = this.team //
            editTeamData(data).then((response) => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.init()
                this.cleardata()
                this.dialogAdd = false
                this.activeNames = []
              } else {
                this.$message.error(response.data.message)
              }
            })
          }
        } else {
          return false
        }
      })
      this.optionChangeskill()
      this.workType()
    },
    remove(index, rows) {
      rows.splice(index, 1)
    },
    cleardata() {
      this.team = {
        employeeGroupName: '',
        capacity: '',
        workTypeId: '',
        organizationId: '',
        intlType: '',
        workGroupType: '',
        workGroupGender: '',
        genderCount: ''
      }
      this.skillList = []
    },
    // 取消添加班组弹框
    dialogclose() {
      this.dialogAdd = false
      this.cleardata()
      this.activeNames = []
      this.optionChangeskill()
      this.workType()
    },
    sndoffon(index, row) {
      var data = {
        employeeId: row.employeeId,
        employeeGroupId: row.employeeGroupId
      }
      sendoffon(data).then((response) => {
        this.init()
        this.expands.push(this.tableData5[index].employeeGroupId)
      })
    },
    Leaderadd(index, row) {
      var data = {
        employeeGroupId: row.employeeGroupId,
        groupLeader: row.employeeId
      }
      isLeader(data).then((response) => {
        this.$message.success('设置成功')
        this.init()
      })
    },
    automatic(index, row) {
      var data = {
        employeeGroupId: row.employeeGroupId,
        organizationId: row.organizationId,
        businessDomainId: this.businessDomainId
      }
      automatic(data)
        .then((response) => {
          this.$message.success('自动分配成功')
          this.init()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    removedata(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            employeeGroupId: row.employeeGroupId
          }
          removedata(data).then((response) => {
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

<style lang="scss" scoped>
form {
  margin-top: 10px;
}
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 10px 0 10px;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px 20px;
  background-color: #263257;
  color: white;
}
.upload-demo {
  margin-left: 20px;
}
.count-box {
  display: inline-block;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  color: white;
  letter-spacing: 2px;
  border-radius: 10px;
}
.count-style {
  color: darkkhaki;
  font-size: 20px;
}
.count-box-gif {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-left: 27%;
}
.count-box-gif img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.add-user {
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px;
  background-color: #232c47;
  span {
    margin-left: 10px;
  }
}
.block {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  font-size: 13px;
}
</style>
