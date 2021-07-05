<template>
  <div style="margin-top: 60px; padding: 0px 10px">
    <div class="bg-color" style="display: flex; width: 100%">
      <div style="width: 30%">
        <span style="display: inline-block; margin: 10px 10px">{{ workTypeName }}</span>
      </div>
      <div style="flex: 1">
        <span style="display: inline-block; margin: 10px 10px">{{ titleData }}</span>
      </div>
      <div style="width: 30%">
        <!-- <el-switch
          v-model="value1"
          style="float:right;display:inline-block;margin:10px 20px"
          active-text="启用"
          inactive-text="不启用"
          @change="offonClick"
        />-->
      </div>
    </div>
    <div class="content">
      <div>
        <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="tabspane">
          <el-tab-pane v-for="items in editableTabs" :key="items.taskTypeId" :label="items.taskTypeName" :name="items.taskTypeId.toString()">
            <div class="ruleBox">
              <div class="contentBox">
                <!-- 左侧树形菜单 -->
                <div class="contentBoxLeft">
                  <div class="ruleName">
                    <div style="padding: 10px; background: #2d3a5e">
                      <el-button type="primary" size="mini" @click="add">+</el-button>
                      <el-button size="mini" @click="remove('rule')">-</el-button>
                      <el-button size="mini" @click="changRule">修改</el-button>
                    </div>
                    <div class="question_info_lists">
                      <el-tree
                        ref="tree"
                        :data="treeData"
                        :props="defaultProps"
                        :accordion="true"
                        node-key="ruleId"
                        :current-node-key="checkedNode"
                        :default-expanded-keys="treeData.length == 0 ? [] : defaultId ? [defaultId] : []"
                        highlight-current
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick"
                      />
                    </div>
                  </div>
                </div>
                <!-- 右侧规则内容 -->
                <div class="contentBoxRight">
                  <!-- <div class="ruleTitleRight">{{ ruleName }}</div> -->
                  <div class="fitTitle">
                    <div style="height:100%;width:80%;line-height:40px;overflow;hidden">
                      <span>航班匹配条件</span>
                      <el-button v-if="flag2" type="primary" style="margin-left: 50px" @click="flagClick">编辑</el-button>
                    </div>
                  </div>
                  <div class="fitContent">
                    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 180px">
                      <div class="fitCondition">
                        <div class="conditionContent">
                          <div class="app-container">
                            <div v-if="flag">
                              <SelectRules ref="selectRules" :data="item" :airport-id="airport.airportId" />
                            </div>
                            <div v-else>
                              <SelectRules2 ref="selectRules" :data="item" :airport-id="airport.airportId" />
                            </div>
                            <div style="text-align: center">
                              <el-button v-if="flag" type="primary" @click="_getDataFun">保存</el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                  <!-- 添加任务 -->
                  <ruleGroup2 ref="selectRules2" :tasktypeid="taskTypeId" :parent="ruleId" :groupid="groupId" :airport-id="airport.airportId" />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 新建 -->
    <el-dialog v-dialogDrag title="添加任务类型" :visible.sync="dialogFormVisibless">
      <el-form ref="formName" :model="formtask" :rules="rules">
        <el-form-item prop="type" label="选择任务类型">
          <el-select v-model="typeId" value-key="value" placeholder="请选择" style="width: 200px" clearable filterable multiple>
            <el-option v-for="items in taskOptions" :key="items.id" :label="items.name" :value="items.id+''" :disabled="items.disabled" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibless = false">取 消</el-button>
        <el-button type="primary" @click="changName1('formName')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible">
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
import { datileTable, selectTask, addTabs, removeTabs, searchRules, addRule, selectByRuleId, addCondition } from '@/apiNew/standardNew'
import SelectRules from './components/SelectRules'
import SelectRules2 from './components/SelectRules2'
import { updateRule, selectData, deleteRuleById, offonFcn } from '@/api/realTimeJobRules'
import ruleGroup2 from './components/ruleGroup'
export default {
  name: 'ServiceStandard',
  components: {
    ruleGroup2,
    SelectRules2,
    SelectRules
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      checkedNode: '',
      ID: '',
      flag: false,
      flag2: true,
      formtask: {},
      typeId: [],
      editableTabsValue: '',
      value1: false,
      titleData: '',
      defaultId: '',
      dialogFormVisibless: false,
      workTypeName: '',
      Operator: [],
      disable: true,
      addRule2: {},
      ruleGroup: [],
      workTypeOptions: [],
      isActive: false,
      ruleName: '',
      taskOptions: [],
      inputName: '',
      title: '',
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
      treeData: [],
      dialogVisible: false,
      editableTabs: [],
      rules: {
        standardName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      taskTypeId: '',
      item: {
        filterType: '',
        isRootNode: true,
        childRuleFilters: [],
        ruleFilterElements: [],
        ruleId: this.ruleId
      }
      //   formSelect: { workTypeId: '' }
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.busType()
      }
    }
  },
  created() {
    this.ID = this.$route.query.id
    this.$store.dispatch('getId', this.ID)
    this.$store.dispatch('getWorkTypeId', this.$route.query.workTypeId)
    if (this.$route.query.ruleId) {
      this.defaultId = this.$route.query.ruleId
    }
    this.selectTask()
    this.optionChange()
    this.datileTable()
  },
  methods: {
    datileTable() {
      this.treeData = []
      var data2 = {
        id: this.ID,
        airportId: this.airport.airportId
      }
      datileTable(data2).then(async(response) => {
        if (response.data.data) {
          this.editableTabs = response.data.data.tasks
          this.titleData = response.data.data.name
          if (response.data.data.tasks.length) {
            this.taskTypeId = response.data.data.tasks[0].taskTypeId
            this.groupId = response.data.data.tasks[0].groupId
            if (this.editableTabsValue == 0) {
              if (this.$route.query.taskTypeId) {
                this.editableTabsValue = this.$route.query.taskTypeId.toString()
                this.defaultId = this.$route.query.ruleId
              } else {
                this.editableTabsValue = response.data.data.tasks[0].taskTypeId.toString()
              }
            }
            var data = {
              id: response.data.data.tasks[0].groupId,
              airportId: this.airport.airportId
            }
            if (!this.$route.query.groupId) {
              this.treeData = await searchRules(data).then((response) => {
                // this.treeData = response.data.data
                return response.data.data
              })
            } else {
              this.treeData = await searchRules(data).then((response) => {
                // this.treeData = response.data.data
                return response.data.data
              })
            }
            this.$nextTick(() => {
              if (this.treeData.length !== 0) {
                if (!this.defaultId) {
                  this.checkedNode = this.treeData[0].ruleId
                  this.ruleId = this.treeData[0].ruleId
                  this.$refs.tree[0].setCurrentKey(this.checkedNode)
                  this.selectByRuleId()
                } else {
                  this.checkedNode = this.defaultId
                  this.ruleId = this.defaultId
                  this.$refs.tree[0].setCurrentKey(this.checkedNode)
                  this.selectByRuleId()
                }
              }
            })
          } else {
            this.dialogFormVisibless = true
          }
          this.workTypeName = response.data.data.workTypeName
          this.value1 = response.data.data.activation
        }
      })
    },
    selectTask() {
      const data = {
        workTypeId: this.$route.query.workTypeId,
        airportId: this.airport.airportId
      }
      selectTask(data).then((response) => {
        this.taskOptions = response.data.data
      })
    },
    offonClick() {
      offonFcn(this.ID).then((response) => {
        if (this.value1) {
          this.$message.success('激活成功')
          this.datileTable()
        } else {
          this.$message.success('关闭成功')
          this.datileTable()
        }
      })
    },
    flagClick() {
      this.flag = !this.flag
      this.flag2 = false
    },
    tabspane(targetName) {
      this.taskTypeId = targetName.name
      this.addRule2 = {}
      this.item = {
        filterType: '',
        isRootNode: true,
        childRuleFilters: [],
        ruleFilterElements: []
      }
      this.treeData = []
      this.checkedNode = ''
      this.ruleId = ''
      this.ruleName = ''
      this.groupId = ''
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (targetName.name == this.editableTabs[i].taskTypeId) {
          this.groupId = this.editableTabs[i].groupId
        }
      }
      const data = {
        id: this.groupId,
        airportId: this.airport.airportId
      }
      searchRules(data).then((response) => {
        this.treeData = response.data.data
        this.$nextTick(() => {
          if (this.treeData.length !== 0) {
            this.checkedNode = this.treeData[0].ruleId
            this.ruleId = this.treeData[0].ruleId
            this.$refs.tree[targetName.index].setCurrentKey(this.checkedNode)
            this.selectByRuleId()
          } else {
            this.$message.success('暂无规则节点数据')
          }
        })
      })
    },
    changName1() {
      const data = {
        typeId: this.typeId,
        id: this.$route.query.id,
        airportId: this.airport.airportId
      }
      addTabs(data).then((response) => {
        if (response.data.code == '200') {
          this.datileTable()
        }
        this.editableTabsValue = this.typeId[0]
      })
      this.dialogFormVisibless = false
    },
    selectByRuleId() {
      //   // 右上角规则查询
      const data = {
        ruleId: this.ruleId,
        airportId: this.airport.airportId
      }
      selectByRuleId(data).then((response) => {
        if (response.data.data) {
          this.item = response.data.data
        } else {
          this.item = {}
        }
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        if (!this.editableTabs.length) {
          this.dialogFormVisibless = true
        } else {
          this.typeId = []
          var arr = []
          for (let i = 0; i < this.editableTabs.length; i++) {
            arr.push(this.editableTabs[i].taskTypeId)
          }
          for (let j = 0; j < this.taskOptions.length; j++) {
            for (let i = 0; i < arr.length; i++) {
              if (this.taskOptions[j].id == arr[i]) {
                this.taskOptions[j].disabled = true
              }
            }
          }
          this.dialogFormVisibless = true
        }
      }
      if (action === 'remove') {
        this.$confirm('确认是删除吗？')
          .then((_) => {
            var ids = ''
            for (let i = 0; i < this.taskOptions.length; i++) {
              if (targetName == this.taskOptions[i].id) {
                this.taskOptions[i].disabled = false
              }
            }
            for (let i = 0; i < this.editableTabs.length; i++) {
              if (targetName == this.editableTabs[i].taskTypeId) {
                ids = this.editableTabs[i].groupId
              }
            }
            const data = {
              id: ids,
              airportId: this.airport.airportId
            }
            removeTabs(data).then((response) => {
              if (response.data.code == '200') {
                this.$message.success(response.data.message)
                this.datileTable()
                this.defaultId = ''
              }
            })
          })
          .catch((_) => {})
      }
    },
    _getDataFun() {
      if (this.ruleId) {
        // 条件添加
        const x = this.$refs.selectRules[0].getDataFun()
        x.ruleId = this.ruleId
        x.airportId = this.airport.airportId
        if (x.ruleId) {
          addCondition(x).then((response) => {
            if (response.data.code === '200') {
              this.selectByRuleId()
              this.$message({
                message: response.data.message,
                type: 'success'
              })
            }
            this.flag2 = true
            this.flag = false
          })
        }
      } else {
        this.$message({
          message: '请先选择规则',
          type: 'error'
        })
      }
    },
    changRule(val) {
      this.title = '修改规则名'
      this.inputName = '修改规则名'
      this.form.standardName = this.addRule2.ruleName
      this.dialogFormVisible = true
    },
    optionChange() {
      const data = {
        airportId: this.airport.airportId
      }
      selectData(data).then((response) => {
        this.workTypeOptions = response.data
      })
    },
    changName(formName) {
      this.$refs['formName'].validate((valid) => {
        if (valid) {
          if (this.title === '添加规则') {
            var data = {}
            data.airportId = this.airport.airportId
            data.ruleName = this.form.standardName
            data.parentRuleId = this.addRule2.ruleId || this.addRule2.ruleId
            for (let i = 0; i < this.editableTabs.length; i++) {
              if (this.editableTabsValue == this.editableTabs[i].taskTypeId) {
                data.groupId = this.editableTabs[i].groupId
              }
            }
            if (data.parentRuleId) {
              data.isRoot = false
            } else {
              data.isRoot = true
            }
            addRule(data).then((response) => {
              var data2 = {
                id: data.groupId,
                airportId: this.airport.airportId
              }
              searchRules(data2).then((response) => {
                if (response.data.data) {
                  this.treeData = []
                  response.data.data.forEach((item) => {
                    if (item) {
                      this.treeData.push(item)
                    }
                  })
                }
              })

              this.defaultId = data.parentRuleId
              this.dialogFormVisible = false
              this.form.standardName = ''
            })
          } else if (this.title === '修改规则名') {
            this.defaultId = this.addRule2.ruleId
            this.addRule2.ruleName = this.form.standardName
            this.addRule2.airportId = this.airport.airportId
            this.groupId = this.addRule2.groupId
            updateRule(this.addRule2).then((response) => {
              this.datileTable()
              this.dialogFormVisible = false
              this.form.standardName = ''
            })
          }
        }
      })
    },
    handleNodeClick(data, checked, indeterminate) {
      // 左边规则点击查询
      this.parentRuleId = data.parentRuleId
      this.ruleId = data.ruleId
      this.defaultId = data.ruleId
      this.addRule2 = data
      this.ruleName = data.ruleName
      this.flag2 = true
      this.flag = false
      this.selectByRuleId()
    },
    add() {
      this.title = '添加规则'
      this.inputName = '规则名:'
      this.dialogFormVisible = true
    },
    remove(val) {
      if (val === 'rule') {
        console.log(this.ruleId)
        if (!this.ruleId) {
          this.$message('请选中要删除的规则')
        } else {
          this.$confirm('确认是删除吗？')
            .then((_) => {
              deleteRuleById(this.ruleId).then((response) => {
                this.ruleId = ''
                var data = {
                  id: this.groupId,
                  airportId: this.airport.airportId
                }
                searchRules(data).then((response) => {
                  this.treeData = []
                  if (response.data.data) {
                    response.data.data.forEach((item) => {
                      if (item) {
                        this.treeData.push(item)
                        this.defaultId = this.parentRuleId
                      }
                    })
                  }
                })
              })
            })
            .catch((_) => {})
        }
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.dialogVisible = false
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>

