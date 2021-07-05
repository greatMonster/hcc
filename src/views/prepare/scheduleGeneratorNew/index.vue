<template>
  <div class="app-container">
    <div style="text-align: right">
      <el-button type size="mini" @click="goBackClick">返回上一级</el-button>
    </div>
    <PanelGroup
      :method-show="methodShow"
      :init-data="initData"
      :roster-setting-version-id="rosterSettingVersionId"
      :employee-type-id="employeeTypeId"
      :roster-setting-id="rosterSettingId"
      :roster-mode-version="rosterModeVersion"
      @initab="initab"
      @initNew="initNew"
      @loadingCal="loadingCal"
    />
    <div class="right">
      <!-- <div class="column">
        <div>
          <span class="zb">{{ }}早</span>
          <span class="zb2">{{ }}s</span>
          <span class="wb">{{ }}s</span>
          <span class="xx">{{ }}s</span>
          <span class="yb">{{ itm.night }}</span>
        </div>
      </div>-->
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="tabClick(editableTabsValue)">
        <el-tab-pane v-for="(item, index) in initData.rosterSettings" :key="index" :label="item.employeeTypeName" :name="item.employeeTypeId.toString() + ',' + item.rosterSettingId.toString()">
          <div v-if="methodShow != '1'" style="text-align: right; margin-bottom: 5px; padding-right: 20px">
            <el-button size="small" type="primary" @click="copydialog = true">复制排班表</el-button>
          </div>
          <keep-alive>
            <div v-if="item.employeeTypeId == employeeTypeId" v-loading="loading" class="tabsBox" element-loading-text="计算中..." element-loading-background="rgba(0, 0, 0, 0.6)">
              <div class="tableCon">
                <div class="de">未排班资源列表({{ unAssignedEmployeelength }})</div>
                <span>
                  <el-input v-model="employeeNamelist" size="small" style="width: 100px" placeholder="姓名" />
                  <el-input v-model="employeeCodelist" size="small" style="width: 100px; margin: 5px 0" placeholder="工号" />
                  <el-button size="mini" type="info" @click="search">查 询</el-button>
                </span>
                <el-scrollbar class="scrollbar-wrapper">
                  <div v-if="unAssigned" class="unAssignedEmployee">
                    <el-popover v-for="(itemin, indexin) in unAssigned" :key="indexin" placement="left" trigger="hover" width="200">
                      <p v-for="(it, ind) in itemin.rosterEmployeeVOS" :key="ind">
                        <i v-if="it.leader == 0" class="el-icon-user" />
                        {{ it.name }} -
                        <span style="color: #409eff">{{ it.code }}</span>
                        <span>- {{ it.departmentName }}</span>
                      </p>
                      <p slot="reference" draggable="true" :data-id="itemin.departmentName + '-' + itemin.id" @dragstart="dragstart($event, itemin)" @dragend="dragend($event, itemin)">
                        <!-- <i class="el-icon-caret-right" /> -->
                        {{ itemin.name }} - {{ itemin.departmentName }}
                      </p>
                    </el-popover>
                  </div>
                  <div v-if="unAssignedEmployee" class="unAssignedEmployee">
                    <el-popover v-for="(itm, ind) in unAssignedEmployee" :key="ind" placement="left" trigger="hover" width="200">
                      <div>
                        技能：
                        <p v-for="(element, id) in itm.skillBeans" :key="id" style="padding-left: 10px; margin: 0">{{ element.name }}</p>
                      </div>
                      <div>
                        角色：
                        <p v-for="(elementRole, idRole) in itm.roleBeans" :key="idRole" style="padding-left: 10px; margin: 0">{{ elementRole.name }}</p>
                      </div>
                      <p slot="reference" draggable="true" style="margin: 0" @dragstart="dragstart(index, itm)">
                        {{ itm.name }}
                        <ins>-{{ itm.code }}-</ins>
                        {{ itm.departmentName }}
                      </p>
                    </el-popover>
                  </div>
                </el-scrollbar>
              </div>
              <div class="boxRight">
                <div v-for="(topitem, topindex) in rosterSetting" :key="topindex" class="items">
                  <div class="title2">
                    <span style="float: left; margin: 8px"
                      >需求资源数({{ titleData.length ? (titleData[topindex].result ? '充足' : '不足') : '无' }})：
                      <span style="display: inline-block">
                        <el-popover placement="top" trigger="hover">
                          <!-- <div slot="reference" class="plan" :style="{'background':statusColor,'box-shadow':statusColor2}" draggable="true"> -->
                          {{ unAssignedEmployeelength }}/{{ titleData.length ? titleData[topindex].numberPeople : '0' }}(现有/共需)
                          <div slot="reference" class="plan" draggable="true">
                            {{ titleData.length ? titleData[topindex].numberPeople : '0' }}
                          </div>
                        </el-popover>
                      </span>
                    </span>
                    <span v-if="titleData.length ? titleData[topindex].workDay : 'false'">( 做 {{ titleData.length ? titleData[topindex].workDay : '无' }} 休 {{ titleData.length ? titleData[topindex].restDay : '无' }} )</span>
                    <span>
                      <el-input v-model="employeeName" size="small" style="width: 100px" placeholder="姓名" />
                      <el-input v-model="employeeCode" size="small" style="width: 100px" placeholder="工号" />
                      <el-button size="mini" type="info" @click="searchEmployeesBtn">查 询</el-button>
                    </span>
                    <span style="float: right; margin: 3px">
                      <!-- <el-button v-if="methodShow==1" size="mini" type="info" @click="rules(rosterSetting,topindex)">查看出勤规则</el-button> -->
                      <el-button type="info" size="mini" @click="exportCsvEvent(topitem)">导出</el-button>
                      <el-button size="mini" type="info" @click="automatiBtn(topitem)">自动分配</el-button>
                      <el-button size="mini" type="info" @click="cancelAutoBtn(topitem)">取消分配</el-button>
                      <el-button v-if="methodShow == '1'" size="mini" type="info" @click="copydialog = true">复制排班表</el-button>
                      <el-button size="mini" type="info" @click="changeIsopen(topitem)">发布至员工日历</el-button>
                    </span>
                    <span style="float: right; margin: 3px">
                      <el-button size="mini" type="info" @click="eatListClick(topitem)">用餐列表</el-button>
                      <el-button size="mini" type="info" @click="switchT">展示模板</el-button>
                      <el-button size="mini" type="info" @click="removeTep(topitem, topindex)">删除排班表</el-button>
                    </span>
                  </div>
                  <div class="schedulelist">
                    <div v-if="methodShow == '2' && switchTshow == true" class="template">
                      <templatedom :topitem="topitem" :roster-setting-id="rosterSettingId" :ids="editableTabsValue" @initNew="initNew" @initab="initab" />
                    </div>
                    <!-- v-loading="loading" -->
                    <!-- :key="Math.random()" -->
                    <tabletmplat
                      ref="tables"
                      :shift-type="shiftType"
                      :roster-id="rosterId"
                      :tables="topitem"
                      :roster-setting-id="rosterSettingId"
                      :created-times="createdTimes"
                      :schedulelist="schedulelist"
                      :dragemployee-type-id="dragemployeeTypeId"
                      :drag-group-item="dragGroupItem"
                      @initab="initab"
                      @search="search"
                      @create="showCreatedTimes"
                    />
                  </div>
                  <div v-if="topitem.checkMessage.length > 0" class="right_warn">
                    <div class="tit">告警列表({{ unAssignedEmployeelength }})</div>
                    <ul style="max-height: 613px; overflow: auto">
                      <li v-for="(checkItem, checkindex) in topitem.checkMessage" :key="checkindex" @click="checkItemBtn(checkItem)">{{ checkItem.message }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-dialogDrag title="复制排班" :visible.sync="copydialog" width="40%" top="5%" center>
      <copyShift :addemployee-data="addemployeeData" :method-show="methodShow" :itemdata="rosterSetting" :item-data="rosterSetting" :init-data="initData" @initNew="initNew" @success="copysuccess()" />
    </el-dialog>
    <el-dialog v-dialogDrag title="填加员工类型" :visible.sync="employeetypedialog" top="8%" center>
      <addemployee :addemployee-data="addemployeeData" :init-data="initData" :roster-setting-version-id="rosterSettingVersionId" @initNew="initNew" @success="success()" />
    </el-dialog>
    <el-dialog v-dialogDrag title="用餐列表" :visible.sync="eatListdialog" top="8%" center>
      <!-- <keep-alive> -->
      <eat-table :tableData="eatList"></eat-table>
      <!-- </keep-alive> -->
    </el-dialog>
    <el-dialog title="查看规则" :visible.sync="centerDialogRule" width="50%" top="5%" center>
      <div v-for="(item, idex) in rule" :key="idex" class="rules">
        <p class="title">{{ item.ruleCode }}</p>
        <p>{{ item.ruleMessage }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type size="mini" @click="centerDialogRule = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { employeeTypes, moduleEmployeeType, searchEatList, query, delEmployeeType, detail, employees, automaticValidate, automatic, cancelAuto, employeeCalenders, delRosters, searchEmployees, detailData } from '@/apiNew/schedule'
import { shiftType } from '@/api/schedule'
import PanelGroup from './components/PanelGroup'
import templatedom from './components/templatedom'
import addemployee from './components/addemployee'
import tabletmplat from './components/table'
import copyShift from './components/copyShift'
import eatTable from './components/eatTable'
import { roster } from '@/api/compareDoc'
export default {
  components: {
    PanelGroup,
    templatedom,
    addemployee,
    tabletmplat,
    copyShift
  },
  filters: {},
  data() {
    return {
      eatList: [],
      eatListdialog: false,
      copydialog: false,
      employeetypedialog: false,
      addemployeeData: [],
      centerDialogRule: false,
      employeeNamelist: '',
      employeeCodelist: '',
      initData: {},
      employeeName: '',
      addEmployeeTimes: 0,
      editableTabsValue: '',
      editableTabs: [],
      employeeCode: '',
      rosterVersionData: {},
      rosterSetting: {}, // 排班表数据
      rosterModeVersion: '',
      numPeople: '', // 总人数
      rosterSettingId: '',
      activeNames: [],
      titleData: [],
      loading: false,
      rosterSettingVersionId: this.$route.query.rosterSettingVersionId,
      dragstartList: {},
      schedulelist: [], // 小方格
      unAssigned: [],
      unAssignedEmployee: [],
      unAssignedEmployeelength: '',
      employeeTypeId: '',
      strType: '',
      methodShow: this.$route.query.method,
      shiftType: [],
      dragemployeeTypeId: '',
      dragGroupItem: {},
      rule: [],
      createdTimes: 0,
      switchTshow: true,
      rosterId: ''
    }
  },
  watch: {},
  mounted() {},
  created() {
    if (this.rosterSettingVersionId) {
      this.initNew()
    }
    this.shiftTypeinit()
  },
  methods: {
    goBackClick() {
      this.$router.push({ path: '/prepare/shiftTableNew', query: { searchValue: this.$route.query.searchValue || '', businessDomainId: this.$route.query.businessDomainId } })
    },
    loadingCal(param) {
      if (param) {
        this.loading = true
      } else {
        this.loading = false
      }
    },
    copysuccess(res) {
      this.copydialog = res
    },
    success(res) {
      this.employeetypedialog = res
    },
    checkItemBtn(item) {
      this.rosterId = item.rosterId
    },
    initNew() {
      query(this.rosterSettingVersionId).then((response) => {
        const data = response.data.data
        this.initData = data
        if (data.rosterSettings.length !== 0) {
          this.editableTabsValue = data.rosterSettings[0].employeeTypeId.toString() + ',' + this.initData.rosterSettings[0].rosterSettingId.toString()
          this.employeeTypeId = data.rosterSettings[0].employeeTypeId.toString()
          this.rosterSettingId = data.rosterSettings[0].rosterSettingId.toString()
          this.typeId = data.rosterSettings[0].employeeTypeId.toString()
          this.initab()
          this.search()
        } else {
          this.employeeTypeId = ''
        }
      })
    },
    shiftTypeinit() {
      shiftType().then((response) => {
        this.shiftType = response.data
      })
    },
    removeTep(item) {
      // 排班表删除
      this.$confirm('确定要删除此排班表吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          document.onkeydown = function (e) {
            var ev = typeof event !== 'undefined' ? window.event : e
            if (ev.keyCode === 13) {
              return false
            }
          }
          delRosters(item.id)
            .then((response) => {
              // if (response.data.data) {
              this.$message({
                type: 'success',
                message: response.data.message
              })
              this.initab()
              // }
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        })
        .catch((e) => {})
    },
    changeIsopen(item) {
      // 同步
      const data = {
        rosterId: item.id
      }
      automaticValidate({ rosterSettingId: item.id })
        .then((response) => {
          if (!response.data.data) {
            this.$confirm('此结果将发布至员工日历，是否发布?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.changeIsopenUri(data)
              })
              .catch((e) => {})
          } else {
            let message = null
            if (response.data.data.coverError) {
              if (response.data.data.employee || response.data.data.group) {
                message = '此排班表已有分配员工，' + response.data.data.coverError + ', 是否需要覆盖?'
              } else {
                message = response.data.data.coverError + ', 是否需要覆盖?'
              }
            } else {
              if (response.data.data.employee || response.data.data.group) {
                message = '此排班表已有分配员工, 是否需要覆盖?'
              }
            }
            this.$confirm(message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.changeIsopenUri(data)
              })
              .catch(() => {})
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    changeIsopenUri(data) {
      employeeCalenders(data)
        .then((response) => {
          this.$message.success(response.data.message)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    exportCsvEvent(item) {
      // 导出
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/roster/' + item.id + '/export'
    },
    automatiBtn(item) {
      // console.log(item, '自动分配')
      // automatic({ rosterSettingId: this.rosterSettingId }).then(response => {

      automatic({ rosterSettingId: item.id })
        .then((response) => {
          this.$message.success(response.data.message)
          this.search()
          this.initab()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    cancelAutoBtn(item) {
      // cancelAuto({ rosterSettingId: this.rosterSettingId }).then(response => {
      cancelAuto({ rosterSettingId: item.id }).then((response) => {
        this.$message.success(response.data.message)
        this.search()
        this.initab()
      })
    },
    rules(vule, index) {
      this.rule = vule[index].rules
      this.centerDialogRule = true
    },
    clear() {
      this.initab()
    },
    employeeclear() {
      this.search()
    },
    initab() {
      // 排班表
      var data = {
        rosterSettingVersionId: this.rosterSettingVersionId,
        id: this.employeeTypeId,
        name: this.employeeName,
        code: this.employeeCode
      }
      // debugger
      this.loading = true
      detailData(data).then((res) => {
        this.titleData = res.data.data
        this.detailTable(data)
      })
      this.search()
    },
    detailTable(data) {
      detail(data).then((response) => {
        // response.data.data.strType = this.strType
        this.rosterSetting = response.data.data
        this.loading = false
        // console.log(this.titleData, 20)
        // console.log(this.rosterSetting, 10)
        this.titleData.forEach((item, index) => {
          if (!item.result) {
            const rosterData = this.rosterSetting[index]
            const employeeType = null
            const rosterDataCopy = []
            // this.rosterSetting[index].forEach((item) => {
            for (let i = 0; i < rosterData.cellMessage.length; i++) {
              if (this.strType === 'group') {
                if (rosterData.cellMessage[i].groupName) {
                  rosterDataCopy.push(rosterData.cellMessage[i])
                } else {
                  rosterDataCopy.unshift(rosterData.cellMessage[i])
                }
              } else if (this.strType === 'employee') {
                if (rosterData.cellMessage[i].employeeName) {
                  rosterDataCopy.push(rosterData.cellMessage[i])
                } else {
                  rosterDataCopy.unshift(rosterData.cellMessage[i])
                }
              } else {
                rosterDataCopy.push(rosterData.cellMessage[i])
              }
            }
            rosterData.cellMessage = rosterDataCopy
            // })
          }
        })
      })
    },
    searchEmployeesBtn() {
      var data = {
        rosterSettingVersionId: this.rosterSettingVersionId,
        id: this.employeeTypeId,
        name: this.employeeName,
        code: this.employeeCode
      }
      searchEmployees(data).then((response) => {
        this.rosterSetting = response.data.data
      })
    },
    tabClick(tab) {
      this.rosterSettingId = tab.substring(tab.indexOf(',') + 1)
      this.employeeTypeId = tab.substring(0, tab.indexOf(','))
      this.initab()
      this.search()
      this.showCreatedTimes()
    },
    search() {
      // 员工列表
      const data = {
        rosterSettingVersionId: this.rosterSettingVersionId,
        name: this.employeeNamelist,
        code: this.employeeCodelist,
        typeId: this.employeeTypeId
      }
      employees(data).then((response) => {
        if (response.data.data) {
          this.unAssignedEmployee = []
          this.unAssigned = []
          if (response.data.data.group) {
            this.unAssigned = response.data.data.group // 班组
            this.unAssignedEmployeelength = response.data.data.group.length
            this.strType = 'group'
          }
          if (response.data.data.employee.length) {
            this.unAssignedEmployee = response.data.data.employee // 员工
            this.unAssignedEmployeelength = response.data.data.employee.length
            this.strType = 'employee'
          }
        }
        // this.unAssignedEmployee = response.data.data
        // this.unAssignedEmployeelength = response.data.data.length
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.employeetypedialog = true
        if (this.initData.type === 1) {
          employeeTypes(this.initData.workloadId).then((response) => {
            this.addemployeeData = response.data.data
          })
        } else if (this.initData.type === 2) {
          moduleEmployeeType(this.initData.workloadId).then((response) => {
            this.addemployeeData = response.data.data
          })
        }
      }
      if (action === 'remove') {
        this.$confirm('此操作将删除该员工类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            document.onkeydown = function (e) {
              var ev = typeof event !== 'undefined' ? window.event : e
              if (ev.keyCode === 13) {
                return false
              }
            }
            var data = {
              rosterSettingVersionId: this.rosterSettingVersionId,
              id: this.employeeTypeId
            }
            delEmployeeType(data).then((response) => {
              this.initNew()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    dragstart(index, item) {
      if (this.strType === 'group') {
        this.dragGroupItem = item
      } else {
        this.dragemployeeTypeId = item.code
      }
    },
    dragend(ev, item) {
      // if (item.employeeGroupName) {
      //   item.employeeGroupName = ''
      // } else if (item.employeeName) {
      //   item.employeeName = ''
      // }
      // if (this.unAssignedEmployeelength > 0) {
      //   this.unAssignedEmployeelength = this.unAssignedEmployeelength - 1
      // }
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    // 用餐列表
    eatListClick(item) {
      searchEatList({ id: item.id })
        .then((response) => {
          this.eatList = response.data.data
          this.eatListdialog = true
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        })
    },
    switchT() {
      // 展示按扭切换
      if (this.switchTshow) {
        this.switchTshow = false
      } else {
        this.switchTshow = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './scheduleGenerator.scss';
.right_warn {
  font-size: 14px;
}
.rules {
  background: #141a2b;
  padding: 5px 10px;
  margin-bottom: 3px;
  p {
    margin: 6px;
    &.title {
      color: #25926c;
    }
  }
}
.column {
  font-size: 12px;
  div {
    width: 90px;
    padding: 4px 0;
    display: inline-block;
    text-align: center;
    margin: 1px;
    span.zb {
      color: #5677d5;
    }
    span.zb2 {
      color: #d8a738;
    }
    span.wb {
      color: #a168ff;
    }
    span.xx {
      color: #666;
    }
    span.yb {
      color: #000;
    }
  }
}
.app-container .boxRight {
  height: 700px;
  overflow: auto;
  padding: 0 20px;
}

.cols {
  display: inline-block;
  text-align: right;
  width: 40%;
}
.tableCon {
  border: 1px solid #798ab9;
  border-radius: 6px;
  span {
    font-size: 14px;
    padding: 5px;
    display: block;
    cursor: pointer;
  }
  .el-button {
    width: 100%;
  }
}
</style>
