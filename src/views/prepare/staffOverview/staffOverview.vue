<template>
  <div class="user-box">
    <div class="title">员工概况总览</div>
    <div class="add-user">
      <div style="margin-left: 20px; padding-top: 10px; width: 74%">
        <el-form :inline="true" :model="formSelect" class="demo-form-inline" size="small">
          <el-form-item label="组织/部门" class="select">
            <el-select v-model="formSelect.department" clearable placeholder="请选择" @visible-change="departmentChange">
              <el-option v-for="(items, indexs) in organizationOptions" :key="indexs" :label="items.organizationName" :value="items.organizationId" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="formSelect.name" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="formSelect.gender" placeholder="请选择" clearable>
              <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formSelect.phone" />
          </el-form-item>
          <el-form-item label="员工角色">
            <el-select v-model="formSelect.roleId" placeholder="请选择" clearable @visible-change="roleChange">
              <el-option v-for="(items, indexs) in roleOptions" :key="indexs" :label="items.roleName" :value="items.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item label="技能">
            <el-select v-model="formSelect.skillId" placeholder="请选择" clearable @visible-change="skillChange">
              <el-option v-for="(items, indexs) in skillOptions" :key="indexs" :label="items.skillName" :value="items.skillId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmit()">查 询</el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" size="small" @click="exportCsvEvent">模 板</el-button> -->
            <ExcelExport :url-data="urlData" name="模板" />
          </el-form-item>
          <el-form-item>
            <BulkImport v-loading.fullscreen.lock="fullscreenLoading" class="filter-top-item" :headers-data="headersData" :post-url="url" @refreshData="onSubmit" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAddClick">添 加</el-button>
          </el-form-item>
          <el-form-item>
            <ExcelExport :url-data="urlModel" name="导出Excel" :form-data="formSelect" />
            <!-- <el-button type="primary" size="small" @click="importClick">导出Excel</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <span class="count-box">
        员工总数量：
        <span class="count-style">{{ totalled }}</span>
      </span>
    </div>
    <el-table v-loading="loading" :empty-text="emptyText" :data="tableData" border stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" sortable label="姓名" />
      <el-table-column prop="gender" sortable label="性别" />
      <el-table-column prop="code" sortable label="员工编号" />
      <el-table-column prop="organization" label="组织/部门" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="skill" label="技能">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.skill.length > 6" placement="top-start" trigger="hover">
            <span>{{ scope.row.skill }}</span>
            <div slot="reference">
              <span>{{ scope.row.skill.slice(0, 6) }} ...</span>
            </div>
          </el-popover>
          <span v-else>{{ scope.row.skill }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="员工角色">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.role.length > 6" placement="top-start" trigger="hover">
            <span>{{ scope.row.role }}</span>
            <div slot="reference">
              <span>{{ scope.row.role.slice(0, 6) }} ...</span>
            </div>
          </el-popover>
          <span v-else>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditClick(scope.$index, scope.row)">修 改</el-button>
          <el-button type="primary" size="mini" @click="open(scope.$index, scope.row)">删 除</el-button>
          <el-button type="danger" style="background: red; border: 1px solid red" size="mini" @click="statusClick(scope.$index, scope.row)">不可用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  修改用户信息弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="dialogEditVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title"> <i class="el-icon-d-caret" /> 个人信息 </template>
            <el-form ref="ruleForm" :inline="true" :model="employee" :rules="rules">
              <el-form-item prop="name" label="姓名：" :label-width="formLabelWidth">
                <el-input v-model="employee.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item prop="code" label="员工编号：" :label-width="formLabelWidth">
                <el-input v-model="employee.code" :disabled="offon" />
              </el-form-item>
              <el-form-item prop="phone" label="电话：" :label-width="formLabelWidth">
                <el-input v-model="employee.phone" placeholder="请输入手机号或者座机号" />
              </el-form-item>
              <el-form-item prop="birthday" label="出生年月：" :label-width="formLabelWidth">
                <el-date-picker v-model="employee.birthday" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item prop="email" label="邮箱：" :label-width="formLabelWidth">
                <el-input v-model="employee.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item prop="gender" label="性别：" :label-width="formLabelWidth">
                <el-select v-model="employee.gender" placeholder="请选择">
                  <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title"> <i class="el-icon-d-caret" /> 部门设定 </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="addDepartment">添加</el-button>
            <el-table :data="departmentList" border stripe>
              <el-table-column prop="name" label="部门" />
              <el-table-column v-if="false" prop="id" label="部门id" />
              <el-table-column prop="dates" label="起止时间">
                <template slot-scope="scope">
                  <span v-if="scope.row.dates.length > 0">{{ scope.row.dates ? scope.row.dates[0] : '' }} - {{ scope.row.dates ? scope.row.dates[1] : '' }}</span>
                  <span v-else>默认部门</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.status">
                    <el-button type="primary" size="small" :disabled="scope.row.status === 'not_delete' ? true : false" @click="editClick(scope.$index, scope.row)">编 辑</el-button>
                    <el-button type="primary" size="small" :disabled="scope.row.status === 'delete' ? false : true" @click="remove(scope.$index, departmentList)">删 除</el-button>
                  </div>
                  <div v-else>
                    <el-button type="primary" size="small" @click="editClick1(scope.$index, scope.row)">编 辑</el-button>
                    <el-button :disabled="!scope.row.dates.length" type="primary" size="small" @click="remove(scope.$index, departmentList)">删 除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title"> <i class="el-icon-d-caret" /> 技能设定 </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="dialogAdd = true">添加</el-button>
            <el-table :data="skillList" border stripe>
              <el-table-column prop="name" label="技能" />
              <el-table-column prop="level" label="等级" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index, skillList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title"> <i class="el-icon-d-caret" /> 角色设定 </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="dialogAddRole = true">添加</el-button>
            <el-table :data="rolelist" border>
              <el-table-column prop="name" label="员工角色" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index, rolelist)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="6">
            <template slot="title"> <i class="el-icon-d-caret" /> 合同设定 </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="dialogAddContract = true">添加</el-button>
            <el-table :data="contractlist" border stripe>
              <el-table-column prop="name" label="合同类型" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="remove(scope.$index, contractlist)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" size="small" @click="DdialogEditVisible">取 消</el-button>
          <el-button type="primary" size="small" @click="handleConfirmClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 添加不可用时间区间-->
    <el-dialog v-dialogDrag :visible.sync="showDialog" title="不可用">
      <el-form ref="statusform" :model="statusform" :rules="rules2">
        <el-form-item label="时间区间:" prop="dates" :label-width="formLabelWidth">
          <el-date-picker v-model="statusform.dates" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="备注:" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="statusform.desc" style="width: 50%" type="textarea" placeholder="描述不可用原因" :autosize="{ minRows: 2, maxRows: 4 }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="statusformbtn('statusform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加不可用信息-->
    <el-dialog v-dialogDrag :visible.sync="statusDialog" title="不可用">
      <el-button type="primary" size="small" @click="clickTime">新 增</el-button>
      <el-table :data="statusData" style="width: 100%">
        <el-table-column type="index" width="160" label="序号" fixed />
        <el-table-column prop="date" label="日期">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述" />
        <el-table-column fixed="right" width="160">
          <template slot="header">
            <span> 操作 </span>
            <el-tooltip content="已执行的不可删" placement="top">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-button v-if="!scope.row.id" type="small" style="width: 60px; height: 30px" @click="removeClick(scope.$index, scope.row, statusData)">删除</el-button>
            <el-button v-else :disabled="!scope.row.status" type="small" style="width: 60px; height: 30px" @click="removeClick(scope.$index, scope.row, statusData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog = false">取 消</el-button>
        <el-button type="primary" @click="statusbtnClick()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 添加部门 -->
    <el-dialog v-dialogDrag :visible.sync="departmentDialog" title="部门选择">
      <el-form ref="departmentform" :model="departmentform" :rules="departrules">
        <el-form-item label="选择部门:" prop="departmentObj" :label-width="formLabelWidth">
          <el-select v-model="departmentform.departmentObj" placeholder="请选择" value-key="organizationId" @change="$forceUpdate()">
            <el-option v-for="items in organizationOptions" :key="items.organizationId" :label="items.organizationName" :value="items" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="defulitFlag" label="时间区间:" prop="dates" :label-width="formLabelWidth">
          <el-date-picker v-model="departmentform.dates" type="daterange" :picker-options="pickerOptions" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentCancel">取 消</el-button>
        <el-button type="primary" @click="departmentbtn('departmentform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加技能 -->
    <el-dialog v-dialogDrag :visible.sync="dialogAdd" title="添加技能">
      <el-form :model="skillform">
        <el-form-item label="选择技能:" :label-width="formLabelWidth">
          <el-select v-model="skillform.skillId" placeholder="请选择" @visible-change="skillChange">
            <el-option v-for="(items, indexs) in skillOptions" :key="indexs" :label="items.skillName" :value="indexs" />
          </el-select>
        </el-form-item>

        <el-form-item label="技能等级:" :label-width="formLabelWidth">
          <el-select v-model="skillform.level" placeholder="请选择">
            <el-option v-for="(items, indexs) in optionsStatus" :key="indexs" :label="items.label" :value="items.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddbtn('skillform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加员工角色" :visible.sync="dialogAddRole">
      <el-form :model="roleform" :inline="true">
        <el-form-item label="选择员工角色:" :label-width="formLabelWidth">
          <el-select v-model="roleform.roleId" placeholder="请选择" @visible-change="roleChange">
            <el-option v-for="(items, indexs) in roleOptions" :key="indexs" :label="items.roleName" :value="indexs" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRole = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddRoletn('roleform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="合同设定" :visible.sync="dialogAddContract">
      <el-form :model="contractform">
        <el-form-item label="请选择:" :label-width="formLabelWidth">
          <el-select v-model="contractform.contractId" placeholder="请选择">
            <el-option v-for="(items, indexs) in contractOptions" :key="indexs" :label="items.contractName" :value="indexs" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddContract = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddcontractbt('contractform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ExcelExport from '@/components/excel-export'
import BulkImport from '@/components/BulkImport/indexLoding' // 导入
import { skill, role, contract, absence, organization, addEmployeeResource, deleteEmployeeResource, editEmployeeResource, search, searchData, prohibit, remove, addDate, addDateCheck } from '@/api/staffOverview'
export default {
  components: {
    BulkImport,
    ExcelExport
  },
  data() {
    var phoneValidate = (rule, value, callback) => {
      const RegExp = /^((0\d{2,3}-\d{7,8})|(1[3769584]\d{9}))$/
      if (value === '') {
        callback(new Error('请输入手机号或座机号'))
      } else if (RegExp.test(value) === false) {
        callback(new Error('请输入正确格式的手机号或座机号'))
      } else {
        callback()
      }
    }
    // var emailValidate = (rule, value, callback) => {
    //   const RegExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    //   if (value === '') {
    //     callback(new Error('请输入邮箱'))
    //   } else if (RegExp.test(value) === false) {
    //     callback(new Error('请输入正确格式的邮箱'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId || 0,
      defulitFlag: true,
      code: '',
      addedData: [],
      offon: false,
      offon3: false,
      index: '',
      emptyText: '正在加载',
      edit: false,
      departmentDialog: false,
      loading: false,
      totalled: '',
      departmentList: [],
      statusform: {
        dates: [],
        desc: ''
      },
      showDialog: false,
      page: {
        pageSize: 100,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      departrules: {
        departmentObj: [{ required: true, message: '请选择部门', trigger: ['change'] }]
      },
      departmentform: { departmentObj: '', dates: [] },
      optionsOrgnization: [
        { value: '1', label: '组织1' },
        { value: '2', label: '组织2' },
        { value: '3', label: '组织三' }
      ],
      formSelect: { department: '', name: '', phone: '', skillId: '', roleId: '', gender: '' },
      dialogAddAbsence: false,
      dialogAddRole: false,
      dialogAdd: false,
      fullscreenLoading: false,
      dialogAddContract: false,
      headersData: {
        Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
      },
      activeNames: [], // 折叠面板
      dialogFormVisible: false, // 组织部门设定
      dayCount: '6666',
      workingCount: '6666',
      fileList: [],
      title: '',
      dialogEditVisible: false,
      formLabelWidth: '170px',

      url: `${process.env.VUE_APP_BASE_API}` + 'rtm/api/v1/employees/info/addAll?airportId=' + this.$store.state.user.airport.airportId,
      rules2: {
        dates: [{ required: true, message: '请输入时间', trigger: ['blur', 'change'] }],
        desc: [{ required: true, message: '请输入原因', trigger: ['blur', 'change'] }]
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
        phone: [
          { required: true, validator: phoneValidate, trigger: 'blur' }
          // {
          //   required: true,
          //   message: '请输入手机号或座机号',
          //   trigger: ['blur', 'change']
          // }
        ],
        code: [{ required: true, message: '请输入编号', trigger: ['blur', 'change'] }],
        gender: [{ required: true, message: '请选择性别', trigger: ['blur', 'change'] }]
        // email: [{ required: true, validator: emailValidate, message: '请填写电子邮箱', trigger: ['blur', 'change'] }]
      },
      urlData: `${process.env.VUE_APP_BASE_API}` + 'rtm/api/v1/employees/info/downloadTemplate?businessDomainId=' + this.$route.query.businessDomainId + '&airportId=' + this.$store.state.user.airport.airportId,
      urlModel: `${process.env.VUE_APP_BASE_API}` + 'api/v1/rtm/employeeResource/import',
      departmentID: '',
      organizationOptions: [], // 组织下拉
      skillOptions: [], // 下拉
      roleOptions: [], // 下拉
      contractOptions: [], // 下拉
      absenceOptions: [], // 下拉
      genderOptions: [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
      ],
      tableData: [],
      statusData: [],
      datesNull: [],
      statusDialog: false,
      employee: {
        employeeName: '',
        description: '',
        phone: '',
        email: '',
        organizationId: '',
        gender: 1,
        employeeCode: ''
      },
      skillform: {},
      optionsStatus: [
        { label: '1', id: '1' },
        { label: '2', id: '2' },
        { label: '3', id: '3' }
      ],
      roleform: {},
      rolelist: [],
      skillList: [],
      contractlist: [],
      contractform: {},
      absenceform: {}
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.organization2()
        this.onSubmit()
        this.absence()
        this.contract()
        this.skillChange()
        this.roleChange()
      }
    }
  },
  created() {
    this.organization2()
    this.onSubmit()
    this.absence()
    this.contract()
    this.skillChange()
    this.roleChange()
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.formSelect.businessDomainId = this.businessDomainId
      this.formSelect.airportId = this.airport.airportId
      search(this.page, this.formSelect).then((response) => {
        if (response.data.data.list.length !== 0) {
          this.emptyText = '正在加载'
          this.tableData = response.data.data.list
          this.page.total = response.data.data.total
          this.loading = false
          this.totalled = response.data.data.total
        } else {
          this.page.total = response.data.data.total
          this.loading = false
          this.totalled = response.data.data.total
          this.tableData = []
          this.emptyText = '暂无数据'
        }
      })
    },
    organization2() {
      var data = {
        businessDomainId: this.businessDomainId || 0,
        airportId: this.airport.airportId
      }
      organization(data).then((response) => {
        this.formSelect.department = response.data[0].organizationId || ''
        this.organizationOptions = response.data
      })
    },
    departmentChange() {
      this.formSelect.roleId = ''
      this.formSelect.skillId = ''
      this.organizationOptions.forEach((item) => {
        if (parseInt(this.formSelect.department) === parseInt(item.organizationId)) {
          this.departmentID = item.businessDomainId
        }
      })
      this.roleChange()
      this.skillChange()
      this.contract()
      this.absence()
    },
    roleChange() {
      var organizationIds = ''
      if (this.departmentList.length > 0) {
        for (const item of this.departmentList) {
          organizationIds += item.id + ','
        }
      }
      var data = {
        bussinessDomainId: this.businessDomainId,
        organizationId: organizationIds.substring(0, organizationIds.length - 1) || '',
        airportId: this.airport.airportId
      }
      role(data).then((response) => {
        this.roleOptions = response.data
      })
    },
    skillChange() {
      var orgnizationIds = ''
      if (this.departmentList.length > 0) {
        for (const item of this.departmentList) {
          orgnizationIds += item.id + ','
        }
      }
      var data = {
        bussinessDomainId: this.businessDomainId,
        organizationId: orgnizationIds.substring(0, orgnizationIds.length - 1) || '',
        airportId: this.airport.airportId
      }
      // console.log(data.organizationId, 55)
      skill(data).then((response) => {
        this.skillOptions = response.data
      })
    },
    absence() {
      const data = {
        airportId: this.airport.airportId
      }
      absence(data).then((response) => {
        this.absenceOptions = response.data
      })
    },
    contract() {
      var data = {
        businessDomainId: this.businessDomainId || 0,
        airportId: this.airport.airportId
      }
      contract(data).then((response) => {
        this.contractOptions = response.data
      })
    },
    cleardata() {
      this.employee = {}
      this.departmentList = []
      this.skillList = []
      this.rolelist = []
      this.contractlist = []
      this.activeNames = []
    },
    departmentbtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.edit) {
            // 编辑
            if (!this.departmentform.dates) {
              if (this.datesNull.length === 1) {
                this.$confirm('确认覆盖无起始时间的数据吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消'
                })
                  .then(() => {
                    this.departmentList.splice(this.index, 1)
                    this.departmentList.forEach((item, i) => {
                      if (item === this.datesNull[0]) {
                        this.departmentList.splice(i, 1)
                        this.datesNull.splice(0, 1)
                      }
                    })
                    this.departmentform.name = this.departmentform.departmentObj.organizationName
                    this.departmentform.id = this.departmentform.departmentObj.organizationId
                    this.departmentList.push(this.departmentform)
                    this.datesNull.push(this.departmentform)
                    this.departmentDialog = false
                    this.edit = false
                    this.departmentform = {}
                  })
                  .catch(() => {})
              }
            } else {
              this.departmentList.splice(this.index, 1)
              this.departmentform.name = this.departmentform.departmentObj.organizationName
              this.departmentform.id = this.departmentform.departmentObj.organizationId
              this.departmentList.push(this.departmentform)
              this.departmentDialog = false
              this.edit = false
              this.departmentform = {}
            }
          } else {
            if (this.departmentform.dates === null || this.departmentform.dates.length === 0) {
              if (this.datesNull.length === 1) {
                this.$confirm('确认覆盖无起始时间的数据吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消'
                })
                  .then(() => {
                    this.departmentList.forEach((item, i) => {
                      if (item === this.datesNull[0]) {
                        this.departmentList.splice(i, 1)
                        this.datesNull.splice(0, 1)
                      }
                    })
                    this.departmentform.name = this.departmentform.departmentObj.organizationName
                    this.departmentform.id = this.departmentform.departmentObj.organizationId
                    this.departmentList.push(this.departmentform)
                    this.datesNull.push(this.departmentform)
                    this.departmentDialog = false
                    this.edit = false
                    this.departmentform = {}
                  })
                  .catch(() => {})
              } else {
                this.departmentform.name = this.departmentform.departmentObj.organizationName
                this.departmentform.id = this.departmentform.departmentObj.organizationId
                this.departmentList.push(this.departmentform)
                this.datesNull.push(this.departmentform)
                this.departmentDialog = false
                this.edit = false
                this.departmentform = {}
              }
            } else {
              this.departmentform.name = this.departmentform.departmentObj.organizationName
              this.departmentform.id = this.departmentform.departmentObj.organizationId
              this.departmentList.push(this.departmentform)
              this.departmentDialog = false
              this.edit = false
              this.departmentform = {}
            }
          }
        }
      })
    },
    addDepartment() {
      this.departmentDialog = true
      this.departmentform = {
        departmentObj: '',
        dates: []
      }
      this.defulitFlag = true
    },

    editClick(index, row) {
      if (!row.dates.length) {
        this.defulitFlag = false
      }
      this.edit = true
      this.index = index
      this.organizationOptions.forEach((item) => {
        if (item.organizationId === row.id) {
          this.departmentform.departmentObj = item
          this.$set(this.departmentform, 'dates', row.dates)
          this.departmentDialog = true
        }
      })
    },
    departmentCancel() {
      this.departmentDialog = false
      this.edit = false
    },
    editClick1(index, row) {
      if (!row.dates.length) {
        this.defulitFlag = false
      }
      this.edit = true
      this.index = index

      this.departmentform.departmentObj = row.departmentObj
      this.$set(this.departmentform, 'dates', row.dates)
      this.departmentDialog = true
    },
    dialogAddbtn() {
      // skill add
      this.skillform.name = this.skillOptions[this.skillform.skillId].skillName
      this.skillform.id = this.skillOptions[this.skillform.skillId].skillId
      this.skillList.push(this.skillform)
      this.dialogAdd = false
      this.skillform = {}
    },
    dialogAddRoletn() {
      this.roleform.name = this.roleOptions[this.roleform.roleId].roleName
      this.roleform.id = this.roleOptions[this.roleform.roleId].roleId
      this.rolelist.push(this.roleform)
      this.dialogAddRole = false
      this.roleform = {}
    },
    dialogAddcontractbt() {
      this.contractform.name = this.contractOptions[this.contractform.contractId].contractName
      this.contractform.id = this.contractOptions[this.contractform.contractId].contractId
      this.contractlist.push(this.contractform)
      this.dialogAddContract = false
      this.contractform = {}
    },
    deleteItem(index) {
      this.organization.splice(index, 1)
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val
      this.onSubmit()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.onSubmit()
    },
    // 不可用
    statusbtnClick(formName2) {
      if (this.addedData.length || this.offon3) {
        this.$confirm('是否保存并生效？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        })
          .then(() => {
            this.addedData.code = this.code
            this.addedData.airportId = this.airport.airportId
            addDateCheck(this.addedData)
              .then((response) => {
                if (response.data.code === '200') {
                  if (!response.data.data) {
                    this.saveDisabledData()
                  } else {
                    this.$confirm(response.data.data + '，是否仍继续保存？', '提示', {
                      confirmButtonText: '是',
                      cancelButtonText: '否'
                    })
                      .then(() => {
                        this.saveDisabledData()
                      })
                      .catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消操作'
                        })
                      })
                  }
                }
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || '服务器错误'
                })
              })
          })
          .catch(() => {})
      } else {
        this.statusDialog = false
      }
    },
    // 不可用保存的请求
    saveDisabledData() {
      this.addedData.airportId = this.airport.airportId
      addDate(this.addedData, this.code)
        .then((res) => {
          if (res.data.code === '200') {
            this.$message.success(res.data.message)
            this.statusDialog = false
            this.onSubmit()
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((e) => {
          this.$message.error(e.response.data.message)
        })
    },
    statusClick(index, row) {
      this.code = row.code
      this.addedData = []

      this.statusDialog = true
      var item = {
        code: row.code,
        airportId: this.airport.airportId
      }
      prohibit(item).then((res) => {
        this.statusData = res.data.data
      })
      if (this.$refs.statusform) {
        this.$refs['statusform'].resetFields()
      }
    },
    removeClick(index, row, statusData) {
      if (row.id) {
        remove(row.id)
          .then((res) => {
            if (res.data.code === '200') {
              prohibit(this.code).then((res) => {
                this.statusData = res.data.data
              })
              this.$message.success(res.data.message)
              this.statusData.splice(index, 1)
              this.offon3 = true
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch((e) => {
            this.$message.error(e.response.data.message)
          })
      } else {
        this.addedData.forEach((item, i) => {
          if (row === item) {
            this.addedData.splice(i, 1)
          }
        })
        this.statusData.splice(index, 1)
      }
    },
    clickTime() {
      this.showDialog = true
      this.statusform = {
        dates: [],
        desc: ''
      }
    },
    statusformbtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.statusform.dates[0]
          this.statusform.dates[1]
          var data = {
            startTime: this.statusform.dates[0],
            endTime: this.statusform.dates[1],
            desc: this.statusform.desc
          }
          if (this.statusform.dates.length) {
            this.statusData.push(data)
            this.addedData.push(data)
            this.statusform.dates = []
            this.statusform.desc = ''
          }
          if (this.$refs.statusform) {
            this.$refs['statusform'].resetFields()
          }
          this.$message.success('新增成功')
          this.showDialog = false
        } else {
          return false
        }
      })
    },
    // 不可用

    handleAddClick() {
      this.offon = false
      this.cleardata()
      this.title = '添加员工'
      this.offon3 = false
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogEditVisible = true
    },
    handleEditClick(index, row) {
      this.datesNull = []
      var item = {
        code: row.code,
        airportId: this.airport.airportId
      }
      searchData(item).then((res) => {
        this.employee = {
          name: res.data.data.name,
          code: res.data.data.code,
          phone: res.data.data.phone,
          email: res.data.data.email,
          gender: res.data.data.gender,
          birthday: res.data.data.birthday
        }
        this.departmentList = res.data.data.organizations
        this.departmentList.forEach((item) => {
          if (item.dates.length === 0) {
            this.datesNull.push(item)
          }
        })
        this.skillList = res.data.data.skills
        this.rolelist = res.data.data.roles
        this.contractlist = res.data.data.contracts
      })

      this.activeNames = ['1', '2', '3', '4', '5', '6']
      this.title = '编辑员工'
      this.offon = true
      this.dialogEditVisible = true
    },
    handleConfirmClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '添加员工') {
            this.employee.skills = this.skillList //
            this.employee.roles = this.rolelist
            this.employee.contracts = this.contractlist
            this.employee.organizations = this.departmentList
            this.employee.airportId = this.airport.airportId
            addEmployeeResource(this.employee)
              .then((response) => {
                if (response.data.code === '200') {
                  this.$message.success('添加成功')
                  this.onSubmit()
                  this.cleardata()
                  this.dialogEditVisible = false
                } else {
                  this.$message.success(response.data.message)
                }
              })
              .catch((e) => {
                this.$message.error(e.response.data.message)
              })
          } else {
            var arr = []
            this.departmentList.forEach((item) => {
              if (item.dates.length === 0) {
                arr.push(item)
              }
            })
            this.employee.airportId = this.airport.airportId
            this.employee.skills = this.skillList //
            this.employee.roles = this.rolelist
            this.employee.contracts = this.contractlist
            this.employee.organizations = this.departmentList
            editEmployeeResource(this.employee)
              .then((response) => {
                if (response.data.code === '200') {
                  this.$message.success('修改成功')
                  this.onSubmit()
                  this.cleardata()
                  this.dialogEditVisible = false
                } else {
                  this.$message.success(response.data.message)
                }
              })
              .catch((e) => {
                this.$message.error(e.response.data.message)
              })
          }
        } else {
          this.activeNames = ['1', '2', '3', '4', '5', '6']
          return false
        }
      })
    },
    //
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var item = {
            code: row.code,
            airportId: this.airport.airportId
          }
          deleteEmployeeResource(item).then((response) => {
            if (response.data.code === '200') {
              this.onSubmit()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    DdialogEditVisible() {
      this.dialogEditVisible = false
      this.cleardata()
    },

    exportCsvEvent() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'rtm/api/v1/employees/info/downloadTemplate?businessDomainId=' + this.businessDomainId + '&airportId=' + this.airport.airportId
    },
    remove(index, rows) {
      rows.splice(index, 1)
    },
    importClick() {
      window.location.href =
        `${process.env.VUE_APP_BASE_API}` +
        'api/v1/rtm/employeeResource/import?organizationId=' +
        this.formSelect.department +
        '&name=' +
        this.formSelect.name +
        '&gender=' +
        this.formSelect.gender +
        '&phone=' +
        this.formSelect.phone +
        '&skillId=' +
        this.formSelect.skillId +
        '&roleId=' +
        this.formSelect.roleId +
        '&businessDomainId=' +
        this.formSelect.businessDomainId +
        '&airportId=' +
        this.airport.airportId
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
  padding: 60px 10px 10px 10px;
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
    margin-right: 10px;
  }
}
</style>
