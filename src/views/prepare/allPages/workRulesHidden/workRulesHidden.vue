<template>
  <section class="body">
    <div>
      <el-row class="bg-color">
        <el-col :span="5">
          <div class="header-left">
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-tickets" size="small" @click="addRuleAllBtn">保存规则</el-button>
            </div>
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-download" size="small" @click="download">导出</el-button>
            </div>
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-document" size="small">属性</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-left">
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-circle-plus-outline" size="small" @click="addEmployee">添加员工类型</el-button>
            </div>
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-remove-outline" size="small" @click="deleteEmployee">删除员工类型</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-left" style="border-right:none">
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-circle-plus-outline" size="small" @click="addRule">添加规则组</el-button>
            </div>
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-success" size="small">验证所有</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-left" style="border-right:none">
            <div class="header-left1">
              <el-button type="primary" class="color-commen" icon="el-icon-circle-plus-outline" size="small" @click="RuleTemplate">添加规则模板</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="treeBox">
      <div class="treeMenu">
        <div class="common" :class="{ active: isActive }" @click="handleNodeClick">全局</div>
        <el-tree :data="data" node-key="id" :props="defaultProps" :highlight-current="current" default-expand-all @node-click="handleNodeClick" />
      </div>
      <div class="treeData">
        <div class="dataTitle">{{ ruleType }}</div>
        <div class="content">
          <!-- 第一条规则框 -->
          <div class="content-box">
            <div v-for="(item,index) in ruleAll" ref="rule1" :key="index" class="rule1">
              <div class="rule1-title">
                <div class="rule1-title-left">
                  <span v-if="item.templateBean.shortDescription">{{ item.templateBean.shortDescription }}</span>
                  <span v-if="item.isGlobal ==0" class="oparation" @click="deleteClick(item,index)">- 删除规则</span>
                </div>
                <span v-if="item.canExtend ==1" class="switch">
                  <el-tooltip :content="item.isExtends==0?'覆盖':'继承'" placement="top">
                    <el-switch v-model="item.isExtends" active-color="#409eff" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="changvuel(item)" />
                  </el-tooltip>
                </span>
                <div class="rule1-title-right" @click="hideHandleClick(item,index)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
              <div v-if="item.templateId=='1'">
                <R1 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='2'">
                <R2 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='3'">
                <R3 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='4'">
                <R4 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='5'">
                <R5 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='6'">
                <R6 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='7'">
                <R7 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='8'">
                <R8 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='9'">
                <R9 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='10'">
                <R10 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='11'">
                <R11 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='12'">
                <R12 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='13'">
                <R13 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='14'">
                <R14 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='15'">
                <R15 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='16'">
                <R16 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='17'">
                <R17 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='18'">
                <R18 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='19'">
                <R19 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='20'">
                <R20 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='21'">
                <R21 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='22'">
                <R22 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='23'">
                <R23 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='24'">
                <R24 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='25'">
                <R25 ref="basisRule" :parent="item" />
              </div>
              <div v-if="item.templateId=='26'">
                <R26 ref="basisRule" :parent="item" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible">
      <el-checkbox-group v-for="(item,index) in listData" :key="index" v-model="addRuleList" class="addrulegroup">
        <el-checkbox v-if="title=='添加规则组'" :label="item" @change="checkinlist(item)">
          <span>{{ item.groupName }}</span>
          <div v-for="(group,id) in item.adRuleTemplates" :key="id">{{ group.shortDescription }}</div>
        </el-checkbox>
        <el-checkbox v-else :label="item" @change="checkinlist(item)">{{ item.empTypeName }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit()">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { iniTree, contract, addEmployee, addEmployee2, delete2, insertRuleArg, deleteruleId, coverAndInherit, getGroupTemplateInfo } from '@/api/setWorkRules'
import R1 from './components/R1'
import R2 from './components/R2'
import R3 from './components/R3'
import R4 from './components/R4'
import R5 from './components/R5'
import R6 from './components/R6'
import R7 from './components/R7'
import R8 from './components/R8'
import R9 from './components/R9'
import R10 from './components/R10'
import R11 from './components/R11'
import R12 from './components/R12'
import R13 from './components/R13'
import R14 from './components/R14'
import R15 from './components/R15'
import R16 from './components/R16'
import R17 from './components/R17'
import R18 from './components/R18'
import R19 from './components/R19'
import R20 from './components/R20'
import R21 from './components/R21'
import R22 from './components/R22'
import R23 from './components/R23'
import R24 from './components/R24'
import R25 from './components/R25'
import R26 from './components/R26'
export default {
  components: {
    R1,
    R2,
    R3,
    R4,
    R5,
    R6,
    R7,
    R8,
    R9,
    R10,
    R11,
    R12,
    R13,
    R14,
    R15,
    R16,
    R17,
    R18,
    R19,
    R20,
    R21,
    R22,
    R23,
    R24,
    R25,
    R26
  },
  data() {
    return {
      current: true,
      contractTypeIdCopy: '',
      switchvalue: '',
      isGlobal: '',
      showRule: '',
      isActive: true,
      employeeTypeId: '',
      addRuleList: [],
      listData: [],
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      documentId: this.$route.query.id,
      ruleType: '全局规则',
      data: [], // 树形结构
      defaultProps: { children: 'employeeTypes', label: 'employeeTypeName' }, // 树形结构应射
      ruleAll: [],
      addRuleAll: [], // 添加规则集合
      employeeTypeBeans: []
    }
  },
  watch: {
    addRuleAll: {
      handler: function() {
        this.ruleAll = this.addRuleAll
      },
      deep: true
    }
  },
  created() {
    this.initree2()
    localStorage.setItem('documentId', this.$route.query.id)
    this.handleNodeClick(this.documentId)
  },
  methods: {
    getGroupTemplateInfo() {
      // 规则组查询
      getGroupTemplateInfo().then(response => {
        this.listData = response.data
      })
    },
    RuleTemplate() {
      // 跳转到模板页面
      this.$router.push({ path: '/prepare/allPages/allPages/workRulesHiddeninner' })
    },
    initree2() {
      // 初始化树形结构
      var documentId = {
        documentId: this.documentId
      }
      iniTree(documentId).then(response => {
        this.data = []
        response.data.forEach(element => {
          this.data.push({ contractTypeId: element.contractTypeId, contractTypeCode: element.contractTypeCode, employeeTypeName: element.contractTypeName, employeeTypes: element.employeeTypes })
        })
      })
    },
    addEmployee() {
      this.title = '添加员工类型'
      this.dialogFormVisible = true
      var documentId = {
        documentId: this.documentId
      }
      addEmployee(documentId).then(response => {
        this.listData = response.data
      })
    },
    addRule() {
      this.addRuleList = [] // 清空选中的集合
      this.title = '添加规则组'
      this.dialogFormVisible = true
      this.getGroupTemplateInfo()
    },
    checkinlist(item) {
      console.log(this.addRuleList, 6666)
    },
    commit() {
      if (this.title === '添加员工类型') {
        addEmployee2(this.addRuleList).then(response => {
          this.listData = response.data
          this.initree2()
        })
        this.dialogFormVisible = false
        this.addRuleList = []
      } else if (this.title === '添加规则组') {
        if (!this.contractTypeId && !this.employeeTypeId) {
          this.isGlobal = 1
        } else {
          this.isGlobal = 0
        }
        var object = []
        this.addRuleList.forEach(element => {
          // 遍历选中的规则

          element.adRuleTemplates.forEach(item => {
            var elementO = {}
            elementO.templateBean = item
            elementO.templateId = item.adRuleTemplateId
            elementO.contractTypeId = this.contractTypeId
            elementO.employeeTypeId = this.employeeTypeId
            elementO.isGlobal = this.isGlobal
            elementO.switch = true
            elementO.adRules = {}
            object.push(elementO)
          })
        })
        if (!this.ruleAll) {
          // 如果后台传过来null 会报错
          this.ruleAll = []
        }
        this.addRuleAll = this.ruleAll.concat(object) // 所有的规则
        this.dialogFormVisible = false
      }
    },
    handleNodeClick(data) {
      // 点击当前员工类型 tree
      if (data.contractTypeId || data.employeeTypeId) {
        this.isActive = false
        this.current = true
      } else {
        this.isActive = true // 全局选中状态去除
        this.current = false
      }
      if (data.employeeTypeName) {
        this.ruleType = data.employeeTypeName
      } else {
        this.ruleType = '全局'
      }
      this.employeeTypeId = data.employeeTypeId
      this.contractTypeId = data.contractTypeId
      this.contractTypeIdCopy = data.contractTypeIdCopy
      localStorage.setItem('employeeTypeId', data.employeeTypeId ? data.employeeTypeId : '') // 给保存规则时传参用
      localStorage.setItem('contractTypeId', data.contractTypeId ? data.contractTypeId : '') // 给保存规则时传参用
      var documentId = {
        documentId: this.documentId,
        id: data.contractTypeId ? data.contractTypeId : '',
        employeeTypeId: data.employeeTypeId ? data.employeeTypeId : ''
      }
      this.ruleAll = []
      contract(documentId).then(response => {
        if (response.data) {
          this.ruleAll = response.data
        }
      })
    },
    changvuel(item) {
      // 点击继承
      if (item.isExtends === 0) {
        var data = {
          contractId: this.contractTypeIdCopy,
          templateId: item.templateId
        }
        coverAndInherit(data).then(response => {
          this.$refs.basisRule.forEach(element => {
            if (element.data.templateId === item.templateId) {
              element.data.adRules.cover = response.data.adRules.cover
              element.data = response.data
              return
            }
          })
        })
      }
    },
    download() {
      // 导出
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1//prepare//adRule/getJsonFile?documentId=' + this.documentId
    },
    hideHandleClick(item, index) {
      if (item.switch) {
        item.switch = !item.switch
      }
      // e.target.parentNode.parentNode.parentNode.children[1].style.display = 'none'
    },
    addRuleAllBtn() {
      // 保存规则
      var basisRule = []
      this.$refs.basisRule.forEach(element => {
        basisRule.push(element.data)
      })
      insertRuleArg(basisRule).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    deleteClick(item, index) {
      // 每条规则删除
      if (item.adRuleId !== '') {
        deleteruleId(item.adRuleId).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
        this.ruleAll.splice(index, 1)
      }
    },
    deleteEmployee() {
      // 员工删除
      this.$confirm('确定要删除吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var documentId = {
            documentId: this.documentId,
            EmpId: this.employeeTypeId
          }
          delete2(documentId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initree2()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
.addrulegroup {
  span {
    color: #00b4dd;
    font-weight: bold;
    font-size: 16px;
  }
  div {
    color: #fff;
  }
}
.none {
  display: none;
}
.active {
  background: #0a142f;
}
.common {
  height: 40px;
  padding: 10px;
  cursor: pointer;
}
.body {
  min-width: 1400px;
  height: 100%;
  color: white;
  font-size: 14px;
  background-color: #0a142f;
  margin-top: 60px;
}
.bg-color {
  background-color: #232c47;
  width: 100%;
  height: 60px;
  font-size: 16px;
}
.header-left,
.header-middle,
.header-right {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-right: 1px solid #434b61;
  color: #0a9fc8;
}
.header-left1 {
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.left-top {
  width: 14px;
  height: 14px;
  margin-bottom: 2px;
}
.img-style {
  width: 14px;
  height: 14px;
}
.header-right {
  justify-content: flex-start;
}

.treeBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  box-sizing: border-box;
  padding: 10px 0;
}
.treeMenu {
  width: 15%;
  min-height: 59em;
  overflow: auto;
  box-sizing: border-box;
  padding: 5px;
  background-color: #232c47;
}
.treeData {
  width: 84.5%;
  min-height: 59em;
  background-color: #232c47;
}
.dataTitle {
  width: 100%;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px;
  border-bottom: 3px solid #434b61;
}
.content {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 10px;
}

/* 第一条规则 */
.rule1,
.rule2 {
  width: 100%;
  height: auto;
  border: 1px solid #419bf9;
  background: rgb(35, 44, 71);
  margin-bottom: 20px;
  margin-top: 1px;
}
.rule1-title-right {
  cursor: pointer;
}
.rule1-title {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #263257;
  font-size: 14px;
  color: white;
}
.oparation,
.rule1-content-right-bottom {
  padding-left: 30px;
  font-size: 12px;
  color: #00b4dd;
}
.rule1-content-box {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 30px 10px;
  background-color: #1b2541;
  color: white;
}
.rule1-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.rule1-content-left,
.rule2-content-left {
  width: 25%;
  height: 120px;
  color: white;
  border-right: 2px solid #4f566b;
}
.rule1-content-left-bottom,
.rule1-content-right-middle,
.rule3-content-left-bottom {
  display: flex;
  margin-top: 10px;
}
.rule1-content-left-bottom-input {
  width: 150px;
}
.rule1-content-left-bottom-select,
.rule3-content-left-bottom-select {
  width: 100px;
  margin-left: 15px;
}
.rule1-content-right {
  width: 75%;
  height: 120px;
  color: white;
  box-sizing: border-box;
  padding: 0 0 0 20px;
}
.radio-bg {
  margin-left: 5px;
  border-left: 1px solid white;
  color: white;
}
.rule1-content-right-bottom {
  margin-top: 35px;
  padding-left: 0;
}
.rule1-content-right-bottom-input {
  width: 150px;
}
.rule1-content-right-bottom-select {
  width: 100px;
}
.rule1-content-right-middle-right {
  display: flex;
  margin-left: 20px;
}
.content-box {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 5px 0;
}
</style>
