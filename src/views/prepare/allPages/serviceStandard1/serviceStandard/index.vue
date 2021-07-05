<template>
  <div style="margin-top:60px">
    <el-row class="bg-color">
      <el-col :span="4">
        <div class="header-left header-right">
          <!-- <div class="header-left1" @click="addTab()">
            <div>新建</div>
          </div>-->
        </div>
      </el-col>
      <el-col :span="18">
        <div class="header-left">
          <div style="color:#fff">
            {{ standardName }}
            <i class="el-icon-edit-outline" @click="setName" />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="content">
      <div>
        <span v-for="(items,index) in tabs" :key="index" class="spantabs" :class="{ active: items.isActive}" @click="tabspane(items,index)">{{ items.groupName }}</span>
        <el-button size="mini" @click="addTab">
          <i class="el-icon-plus" />
        </el-button>
        <el-button size="mini" @click="remove('ruleGroup')">
          <i class="el-icon-delete" />
        </el-button>
        <el-button size="mini" @click="changRule('ruleGroup')">修改</el-button>
      </div>
      <div class="ruleBox">
        <div class="contentBox">
          <!-- 左侧树形菜单 -->
          <div class="contentBoxLeft">
            <div class="ruleName">
              <div style="padding: 10px;background: #2d3a5e;">
                <el-button type="primary" size="mini" @click="add">+</el-button>
                <el-button size="mini" @click="remove('rule')">
                  <i class="el-icon-delete" />
                </el-button>
                <el-button size="mini" @click="changRule('rule')">修改</el-button>
              </div>
              <div class="question_info_lists">
                <el-scrollbar wrap-class="scrollbar-wrapper" style="height:700px">
                  <el-tree
                    ref="tree"
                    :key="tree_key"
                    node-key="ruleId"
                    :data="treeData"
                    highlight-current
                    default-expand-all
                    :default-expanded-keys="defaultexpandedkeys"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    draggable
                    :allow-drop="allowDrop"
                    @node-drag-start="handleDragStart"
                    @node-drag-end="handleDragEnd"
                    @node-click="handleNodeClick"
                  />
                </el-scrollbar>
              </div>
            </div>
          </div>
          <!-- 右侧规则内容 -->
          <div class="contentBoxRight">
            <!-- <div class="ruleTitleRight">{{ ruleName }}</div> -->
            <div class="fitTitle">
              <div style="height:100%;width:80%;line-height:40px;overflow;hidden">
                <span style="float:left">航班匹配条件</span>
                <el-button v-if="flag2" type="primary" style="margin-left:50px" @click="flagClick">编辑</el-button>
              </div>
            </div>
            <div class="fitContent">
              <el-scrollbar wrap-class="scrollbar-wrapper" style="height:230px">
                <div class="fitCondition">
                  <div class="conditionContent">
                    <div class="app-container">
                      <div v-if="flag">
                        <SelectRules ref="selectRules" :data="item" />
                      </div>
                      <div v-else>
                        <SelectRules2 ref="selectRules" :data="item" />
                      </div>
                      <div style="text-align: center;">
                        <el-button v-if="flag" type="primary" @click="_getDataFun">保存</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <!-- 添加任务 -->
            <ruleGroup2 ref="selectRules2" :parent="ruleId" />
          </div>
        </div>
      </div>
    </div>
    <!-- 新建 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="formName" :model="form" :rules="rules">
        <el-form-item prop="standardName" :label="inputName">
          <el-input v-model="form.standardName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changName('formName')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectRules from './components/SelectRules'
import SelectRules2 from './components/SelectRules2'
import { iniTree, set, ruleGroup, addRule, searchRule, updateRule, remove, deleteRuleById, selectByRuleId, addCondition, addRuleupdate, changeRuleOrder } from '@/api/serviceStandard'
import ruleGroup2 from './components/ruleGroup'
export default {
  name: 'ServiceStandard',
  components: {
    ruleGroup2,
    SelectRules,
    SelectRules2
  },
  data() {
    return {
      flag: false,
      flag2: true,
      tabspanIndex: '0',
      ruleGroup: [],
      isActive: false,
      tabIndex: '',
      ruleName: '',
      taskRuletable: [],
      tabs: [], // 规则组
      addRule: {},
      nmb: 0,
      inputName: '',
      title: '',
      standardId: '',
      dialogFormVisible: false,
      parentRuleId: '',
      ruleId: '',
      groupName: '',
      groupId: '',
      defaultexpandedkeys: [],
      defaultProps: {
        children: 'childRules',
        label: 'ruleName',
        isLeaf: 'isRootNode'
      },
      form: { standardName: '' },
      standardName: '',
      add_question_flag: false,
      new_question_name: '',
      tree_key: 0,
      defaultExpand: [],
      treeData: [],
      inputVisible: false,
      inputValue: '',
      dialogVisible: false,
      editableTabsInputValue: '',
      editableTabsinput: false,
      editableTabs: [],
      rules: {
        standardName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      item: {
        filterType: '',
        isRootNode: true,
        childRuleFilters: [],
        ruleFilterElements: [],
        ruleId: this.ruleId
      },
      dragStart: {}
    }
  },
  watch: {},
  created() {
    if (this.$route.query.documentId) {
      this.initree2()
    }
  },
  methods: {
    clickGroupTabs(groupId) {
      searchRule(groupId || '').then(response => {
        this.treeData = []
        if (response.data.rules) {
          response.data.rules.forEach(item => {
            if (item) {
              this.treeData.push(item)
              this.$nextTick(() => {
                if (this.treeData.length !== 0) {
                  this.ruleId = this.treeData[0].ruleId
                  this.$refs.tree.setCurrentKey(this.ruleId)
                  this.selectByRuleId()
                } else {
                  this.$message.success('暂无规则节点数据')
                }
              })
            }
          })
        }
      })
    },
    tabspane(item, index) {
      // alert()
      this.tabspanIndex = index
      if (this.form) {
        this.form.standardName = ''
      }
      this.groupId = item.groupId || ''
      this.tabs.forEach(element => {
        element.isActive = false
      })
      this.tabs[index].isActive = true
      this.item = {
        filterType: '',
        isRootNode: true,
        childRuleFilters: [],
        ruleFilterElements: []
      }
      this.addRule = item
      this.clickGroupTabs(item.groupId)
    },
    selectByRuleId() {
      // 右上角规则查询
      selectByRuleId(this.ruleId).then(response => {
        if (response.data) {
          this.item = response.data
        } else {
          this.item = {}
        }
      })
    },
    _getDataFun() {
      // 条件添加
      const x = this.$refs.selectRules.getDataFun()
      x.ruleId = this.ruleId
      addCondition(x).then(response => {
        if (response.code === '200') {
          this.selectByRuleId()
          this.$message({
            message: response.message,
            type: 'success'
          })
        }
      })
      this.flag2 = true
      this.flag = false
    },
    flagClick() {
      this.flag = !this.flag
      this.flag2 = false
    },
    changRule(val) {
      if (val === 'ruleGroup') {
        this.title = '修改规则组名'
        this.inputName = '修改规则组名'
        this.form.standardName = this.addRule.groupName ? this.addRule.groupName : this.tabs[0].groupName
      } else {
        this.title = '修改规则名'
        this.inputName = '修改规则名'
        this.form.standardName = this.addRule.ruleName
      }
      this.dialogFormVisible = true
    },
    setName() {
      this.title = '修改工作标准名'
      this.inputName = '工作标准名'
      this.form.standardName = this.standardName
      this.dialogFormVisible = true
    },
    changName(formName) {
      this.$refs['formName'].validate(valid => {
        if (valid) {
          if (this.title === '修改工作标准名') {
            var Id = {
              standardName: this.form.standardName,
              standardId: this.standardId,
              documentId: this.$route.query.documentId
            }
            set(Id).then(response => {
              this.initree2()
              this.dialogFormVisible = false
              this.form.standardName = ''
            })
          } else if (this.title === '新建规则组名') {
            var groupId = {
              groupId: this.groupId || '',
              groupName: this.form.standardName,
              standardId: this.standardId,
              description: 'description'
            }
            ruleGroup(groupId).then(response => {
              this.initree2()
              this.dialogFormVisible = false
            })
          } else if (this.title === '添加规则名') {
            this.addRule.ruleName = this.form.standardName
            this.addRule.parentRuleId = this.addRule.ruleId
            this.addRule.ruleId = this.ruleId
            if (!this.addRule.parentRuleId) {
              this.addRule.isRoot = true
            } else {
              this.addRule.isRoot = false
            }
            if (!this.addRule.groupId) {
              this.$confirm('请选择规则组')
              this.dialogFormVisible = false
            } else {
              addRule(this.addRule).then(response => {
                this.defaultexpandedkeys = []
                this.clickGroupTabs(this.groupId)
                this.defaultexpandedkeys.push(this.ruleId)
                this.dialogFormVisible = false
                this.form.standardName = ''
              })
            }
          } else if (this.title === '修改规则组名') {
            this.addRule.groupName = this.form.standardName
            updateRule(this.addRule).then(response => {
              this.initree2()
              this.dialogFormVisible = false
              this.form.standardName = ''
            })
          } else if (this.title === '修改规则名') {
            this.addRule.ruleName = this.form.standardName
            addRuleupdate(this.addRule).then(response => {
              this.initree2()
              this.dialogFormVisible = false
              this.form.standardName = ''
            })
          }
        }
      })
    },
    addTab() {
      this.title = '新建规则组名'
      this.inputName = '规则组名:'
      this.form.standardName = ''
      this.dialogFormVisible = true
    },
    handleNodeClick(data) {
      // console.log(data.matchOrder, 'matchOrder', 'parentRuleId=' + data.parentRuleId)
      // 左边规则点击查询
      this.parentRuleId = data.parentRuleId
      this.ruleId = data.ruleId
      this.addRule = data
      this.ruleName = data.ruleName
      this.selectByRuleId()
    },
    initree2() {
      // 初始化页面
      var documentId = {
        documentId: this.$route.query.documentId || ''
      }
      iniTree(documentId).then(response => {
        this.tabs = []
        this.standardName = response.data.standardName
        this.standardId = response.data.standardId
        response.data.ruleGroups.forEach(element => {
          this.tabs.push(element)
          if (this.groupId) {
            if (element.groupId === this.groupId) {
              this.tabspane(element, this.tabspanIndex)
            }
          } else {
            this.tabs[0].isActive = true
            this.groupId = this.tabs[0].groupId
            this.addRule.groupId = this.tabs[0].groupId
            this.clickGroupTabs(this.groupId)
          }
        })
      })
    },
    add() {
      this.title = '添加规则名'
      this.inputName = '规则名'
      this.form.standardName = ''
      this.dialogFormVisible = true
    },
    remove(val) {
      if (val === 'ruleGroup') {
        if (this.addRule.groupId) {
          this.$confirm('确认是删除吗？')
            .then(_ => {
              remove(this.addRule.groupId).then(response => {
                this.initree2()
              })
            })
            .catch(_ => {})
        } else {
          this.$message('请选中要删除的规则组')
        }
      } else if (val === 'rule') {
        if (!this.ruleId) {
          this.$message('请选中要删除的规则')
        } else {
          this.$confirm('确认是删除吗？')
            .then(_ => {
              deleteRuleById(this.ruleId).then(response => {
                this.initree2()
              })
            })
            .catch(_ => {})
        }
      }
    },
    handleDragStart(node, ev) {
      this.dragStart = node.data
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      if (dropType !== 'none') {
        this.$confirm('确定要调整位置吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = {
              ruleId: this.dragStart.ruleId,
              parentRuleId: dropType === 'inner' ? dropNode.data.ruleId : dropNode.data.parentRuleId,
              groupId: this.dragStart.groupId,
              matchOrder: dropType === 'inner' ? dropNode.data.childRules.length : dropNode.data.matchOrder
            }
            changeRuleOrder(data).then(response => {
              this.initree2()
              this.$message({
                type: 'success',
                message: '成功!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.initree2()
          })
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.parentRuleId === dropNode.data.parentRuleId) {
        return type === 'prev' || type === 'next' || type === 'inner'
      } else {
        return type === 'prev' || type === 'next' || type === 'inner'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>

