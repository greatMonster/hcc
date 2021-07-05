<template>
  <section>
    <div style="height:60px" />
    <div class="header-search">
      <div class="search-file" style="margin-left:30px;">
        <!-- <span>快速搜索文件</span> -->
        <el-input v-model="input21" class="special" size="small" placeholder="输入搜索关键字" type="text" suffix-icon="el-icon-search" clearable @clear="clear" />
      </div>
      <div style="margin-left:30px;">
        <el-button type="primary" size="small" @click="searchClick">查 询</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="shifResultClick">新 增</el-button>
      </div>
      <!-- <div class="right-section2">
        <i class="el-icon-download" style="color:#00B4DD;font-size:16px" />
        <span>导入</span>
      </div>
      <div class="right-section3">
        <i class="el-icon-refresh" style="color:#00B4DD;font-size:16px" />
        <span>刷新</span>
      </div>-->
    </div>
    <!-- 表格 -->
    <div v-if="tableData" class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="settingVersionName" label="文件名">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.settingVersionName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rosterFrom" label="排班表开始日期" />
        <el-table-column prop="rosterTo" label="排班表结束日期" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="workLoadName" label="工作量" />
        <el-table-column prop="ruleName" label="规则" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="blank-style">
      <i class="el-icon-warning" style="font-size:23px;color:red" /> 请先导入文件
    </div>
    <!-- 修改弹框 -->
    <el-dialog v-dialogDrag title="修改" :visible.sync="editSkillVisible">
      <el-form ref="formName" :model="formEdit">
        <el-form-item prop="settingVersionName" label="文件名：" :label-width="formLabelWidth">
          <el-input v-model="formEdit.settingVersionName" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新建排班表 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="newSchedule" width="50%" top="5%" center>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
        <el-form-item label="如何创建排班表文档：" prop="rosterSettingVersionId">
          <el-radio-group v-model="ruleForm.rosterSettingVersionId" @change="chose">
            <el-radio :label="1">根据工作量和规则创建排班表</el-radio>
            <el-radio :label="2">生成空排班表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="向导名称：" prop="settingVersionName">
          <el-input v-model="ruleForm.settingVersionName" placeholder="请输入" />
        </el-form-item>
        <div v-if="ruleForm.rosterSettingVersionId == '1'">
          <el-form-item label="选择工作量：" prop="documentWorkloadId">
            <el-select v-model="ruleForm.documentWorkloadId" value-key="label" :disabled="disabled" placeholder="请选择" @visible-change="changeValue1()">
              <el-option v-for="item in workload" :key="item.documentId" :label="item.name" :value="item.documentId" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择规则：" prop="documentRuleId">
            <el-select v-model="ruleForm.documentRuleId" value-key="label" :disabled="disabled" placeholder="请选择" @visible-change="adRuleS()">
              <el-option v-for="item in adRule" :key="item.documentId" :label="item.name" :value="item.documentId" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择员工类型：" prop="employeeType">
            <el-table ref="multipleTable" :data="employeeType" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column prop="empTypeName" label="员工类型" />
              <el-table-column prop="defaultCount" label="员工数量">
                <template slot-scope="scope">{{ scope.row.defaultCount }}</template>
              </el-table-column>
              <el-table-column type="selection" width="55" />
            </el-table>
          </el-form-item>
        </div>
        <div v-if="ruleForm.rosterSettingVersionId == 2">
          <el-form-item label="开始日期：" prop>
            <el-date-picker v-model="ruleForm.rosterFrom" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="结束日期：" prop>
            <el-date-picker v-model="ruleForm.rosterTo" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="选择员工类型：" prop="employeeType">
            <el-scrollbar wrap-class="scrollbar-wrapper" style="height:400px">
              <el-table ref="multipleTable" stripe :data="employeeType2" @selection-change="handleSelectionChange">
                <el-table-column prop="empTypeName" label="员工类型" />
                <el-table-column prop="defaultCount" label="员工数量">
                  <template slot-scope="scope">{{ scope.row.defaultCount }}</template>
                </el-table-column>
                <el-table-column type="selection" width="55" />
              </el-table>
            </el-scrollbar>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitData('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>
  </section>
</template>

<script>
import { all, remove, set, initNewSelect, adRule, documentWorkloadId, add, selectEmployeeType2, addempty, search } from '@/api/schedule'
export default {
  data() {
    return {
      disabled: false,
      input21: '', // 搜索
      tableData: [],
      editSkillVisible: false,
      formEdit: {},
      formLabelWidth: '120px',
      title: '',
      newSchedule: false,
      workload: [],
      adRule: [],
      employeeType: [],
      employeeType2: [],
      rules: {
        settingVersionName: [{ required: true, message: '不能为空', trigger: 'change' }],
        rosterSettingVersionId: [{ required: true, message: '请选择', trigger: 'change' }],
        documentWorkloadId: [{ required: true, message: '请选择', trigger: 'change' }],
        documentRuleId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      ruleForm: {
        del: false,
        documentRuleId: '',
        documentWorkloadId: '',
        maxg: null,
        method: null,
        modeSe: null,
        modeUo: null,
        nday: null,
        rosterFrom: '',
        rosterSettingBeans: [],
        rosterSettingVersionId: '',
        rosterTo: '',
        rosterType: null,
        settingVersionName: '',
        startDate: null,
        versionLineNum: null
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    clear() {
      this.init()
    },
    searchClick() {
      search(this.input21).then(response => {
        this.tableData = response.data
      })
    },
    init() {
      all().then(response => {
        this.tableData = response.data
      })
    },
    shifResultClick() {
      // 新建
      this.newSchedule = true
      this.title = '新建排班表'
    },
    chose(e) {
      // 选择方式
      this.ruleForm.rosterSettingVersionId = e
      if (e === 2) {
        this.selectEmployeeType2()
      }
    },
    handleSelectionChange(val) {
      // 选择员工类型
      this.ruleForm.rosterSettingBeans = []
      val.forEach(element => {
        var obj = {
          activation: null,
          beans: null,
          del: false,
          employeeTypeId: '',
          employeeTypeName: null,
          employeeTypeNum: '',
          lineNum: 10,
          offset: 0,
          rosterBeans: null,
          rosterModeVersion: null,
          rosterNamed: null,
          rosterSettingId: '',
          rosterSettingName: '',
          rosterSettingVersionId: 1,
          rosterType: null,
          shiftCalc: 64,
          shiftDemand: 58,
          sumPeople: 16,
          utilPeople: 0
        }
        obj.rosterSettingName = element.empTypeName
        obj.employeeTypeNum = element.defaultCount
        obj.employeeTypeId = element.employeeTypeId
        this.ruleForm.rosterSettingBeans.push(obj)
      })
    },
    changeValue1() {
      // 工作量下拉
      initNewSelect().then(response => {
        this.workload = response.data
      })
      this.documentWorkloadId()
    },
    adRuleS() {
      // 规则下拉
      var data = {
        data: 'RULESET'
      }
      adRule(data).then(response => {
        this.adRule = response.data.data
      })
    },
    documentWorkloadId() {
      // 员工类型
      documentWorkloadId(this.ruleForm.documentWorkloadId).then(response => {
        this.employeeType = response.data
      })
    },
    submitData(ruleForm) {
      // 新建排班表提交
      if (this.ruleForm.rosterSettingVersionId === 1) {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            add(this.ruleForm).then(response => {
              this.newSchedule = false
              this.init()
            })
          }
        })
      } else {
        // 空排班表
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            addempty(this.ruleForm).then(response => {
              this.newSchedule = false
              this.init()
            })
          }
        })
      }
    },
    selectVersion(index, data) {},
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.formEdit = Object.assign({}, row)
      this.editSkillVisible = true
    },
    handleEditClick() {
      set(this.formEdit).then(response => {
        this.init()
        this.editSkillVisible = false
      })
    },
    openNext(index, row) {
      // 跳转到排班表
      this.$router.push({ path: '/prepare/scheduleGenerator', query: { rosterSettingVersionId: row.rosterSettingVersionId, method: row.method } })
    },
    // 生成空排班表时的员工类型
    selectEmployeeType2() {
      selectEmployeeType2().then(response => {
        this.employeeType2 = response.data
      })
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            rosterSettingVersionId: row.rosterSettingVersionId
          }
          remove(data).then(response => {
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
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
.search-file {
  margin-left: 20px;
}
img {
  width: 20px;
  height: 20px;
}
.right-section1,
.right-section2,
.right-section3 {
  display: flex;
  width: 60px;
  height: 80px;
  justify-content: space-around;
  align-items: center;
  font-size: 18px;
  color: white;
  vertical-align: middle;
  margin-left: 14%;
  cursor: pointer;
}
.right-section2 {
  margin-left: 2%;
}
.right-section3 {
  margin-left: 4%;
}
.paginate {
  display: flex;
  width: 100%;
  height: 68px;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: right;
  background-color: #0a142f;
}
.pageFloat {
  display: flex;
  width: 100%;
  padding-top: 10px;
  justify-content: flex-end;
  align-items: center;
}
.pageFloat div {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #232c47;
  color: #989a9c;
}
.version-select {
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}
</style>
