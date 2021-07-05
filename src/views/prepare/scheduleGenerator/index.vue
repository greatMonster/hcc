<template>
  <div class="app-container">
    <div class="schedule">
      <PanelGroup
        :method-show="methodShow"
        :roster-setting-version-id="rosterSettingVersionId"
        :employee-type-id="employeeTypeId"
        :roster-setting-id="rosterSettingId"
        :roster-mode="rosterMode"
        :roster-mode-version="rosterModeVersion"
        :roster-version-data="rosterVersionData"
      />
      <div class="tree_cont">
        <div class="settingVersionName">
          <el-select v-model="value" placeholder="请选择向导" size="small" @change="choseVers(value)">
            <el-option v-for="item in version" :key="item.rosterSettingVersionId" :label="item.settingVersionName" :value="item.rosterSettingVersionId" />
          </el-select>
          <svg-icon icon-class="edit" @click="gotoEdit" />
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="tree2"
            :data="treeData.rosterSettingModeBeans"
            :highlight-current="current"
            :props="defaultProps"
            node-key="employeeTypeId"
            class="filter-tree"
            default-expand-all
            :current-node-key="currentNodekey"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
        <div class="tableCon">
          <div class="de">员工列表({{ unAssignedEmployeelength }})</div>
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div v-if="unAssigned">
              <el-popover v-for="(item,index) in unAssigned" :key="index" placement="bottom" trigger="click" width="200">
                <p v-for="(it,ind) in item.employeeResourceInfoBeanList" :key="ind">{{ it.employeeName }}</p>
                <p slot="reference" draggable="true" :data-id="item.employeeGroupName +'-'+ item.employeeGroupId" @dragstart="dragstart($event,item)" @dragend="dragend($event,item)">
                  <i class="el-icon-caret-right" />
                  {{ item.employeeGroupName }}
                </p>
              </el-popover>
            </div>
            <div v-if="unAssignedEmployee" class="unAssignedEmployee">
              <p v-for="(item,ind) in unAssignedEmployee" :key="ind" draggable="true" :data-id="item.employeeId" @dragstart="dragstart(ind,item)">{{ item.employeeName }}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <i class="el-icon-more" />
          {{ settingVersionName }}
          <span>
            <el-input v-model="search" size="small" style="width:130px;margin:0 10px 0 30px" clearable placeholder="请输入员工名" @clear="clear" />
            <el-input v-model="employeeCode" size="small" style="width:130px;margin:0 10px 0 30px" clearable placeholder="请输入工号" @clear="clear" />
            <el-button size="mini" type="primary" @click="nameSearch">查询</el-button>
          </span>
          <div class="cols">
            <span v-for="(cols,index) in shiftType" :key="index">
              <ins class="zb" :style="{ background: cols.color}" />
              {{ cols.shiftName }}
            </span>
          </div>
        </div>
        <div
          v-for="(topitem,topindex) in rosterSetting"
          :key="topindex"
          v-loading="loading"
          class="items"
          style="margin-top:10px"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.2)"
        >
          <div class="title2">
            <span style="float:left">
              <i class="el-icon-caret-right" />
              {{ topitem.rosterSettingName }}
            </span>
            <span v-if="methodShow==1" style="float:left;margin:8px 20px">
              (
              <span v-for="(item,index) in topitem.countMessage.rule" :key="index">{{ item }} /</span> )
              <span v-if="topitem.countMessage.rest">( 做 {{ topitem.countMessage.rest.workDay | nmbTos }} 休 {{ topitem.countMessage.rest.restDay | nmbTos }} )</span>
            </span>
            <span style="float: left;margin:8px 20px">( 总人数：{{ topitem.countMessage.numPeople }} )</span>
            <span style="display: inline-block;margin:5px 20px">
              <!-- <el-switch v-model="topitem.rosterActivation" style="margin-top:7px" active-text="开启" @change="changeIsopen(topitem)" /> -->
              <el-button size="mini" type="primary" @click="changeIsopen()">同步</el-button>
            </span>
            <span style="display: inline-block;">
              <el-button size="mini" type="primary" @click="automatic(topitem)">分配人员</el-button>
            </span>
            <span v-if="treeData.method==2" style="float:right;margin:3px">
              <el-button size="mini" type="primary" @click="switchT">展示模板</el-button>
              <el-button size="mini" type="primary" @click="removeTep(topitem)">删除排班表</el-button>
            </span>
          </div>
          <div class="schedulelist">
            <div v-if="methodShow==2&&switchTshow==true" class="template">
              <templatedom :topitem="topitem" @init="init" />
            </div>
            <el-scrollbar ref="elscrollbar" style="height:650px">
              <div style="position: relative;">
                <div class="left-content">
                  <template v-for="(item,index) in topitem.countMessage.roster">
                    <div :key="index" class="contLeft bg sum" @dragover="allowDrop($event,item)" @drop="onDrop($event,item[index])">
                      <div>{{ index }}</div>
                    </div>
                  </template>
                </div>
                <div class="center-content">
                  <div>
                    <div v-if="Object.keys(topitem.countMessage.roster).length>0" class="weeks" :style="{width:(topitem.countMessage.dates.length+1)*92 + 'px'}">
                      <div>
                        <div v-for="(item2,i) in topitem.countMessage.dates" :key="i" class="day">
                          <p>{{ item2 | joinDate }}</p>
                          <p>{{ item2 | joinDate2 }}</p>
                        </div>
                      </div>
                      <div class="column">
                        <div v-for="(itm,ind) in topitem.countMessage.column" :key="ind">
                          <span class="zb">{{ itm.morn }}</span>
                          <span class="zb2">{{ itm.noon }}</span>
                          <span class="wb">{{ itm.evening }}</span>
                          <span class="xx">{{ itm.rest }}</span>
                        <!-- <span class="yb">{{ itm.night }}</span> -->
                        </div>
                      </div>
                    </div>
                    <template v-for="(item,index) in topitem.countMessage.roster">
                      <div :key="index" class="item" :style="{width:(item.length+1)*92 + 'px'}">
                        <div class="cont bg" @dragover="allowDrop($event,item[index])" @dragend="dragend($event,item[index])" @drop="onDrop($event,index)">
                          <div v-if="topitem.countMessage.AssignedEmployee">
                            <div v-if="topitem.countMessage.AssignedEmployee[index]">
                              {{ topitem.countMessage.AssignedEmployee[index].employeeName }}
                              <b v-if="topitem.countMessage.AssignedEmployee" @click="remove(topitem.countMessage.AssignedEmployee[index])">
                                <i class="el-icon-circle-close" />
                              </b>
                            </div>
                          </div>
                          <div v-else-if="topitem.countMessage.AssignedGroup">
                            <div v-if="topitem.countMessage.AssignedGroup[index]">
                              {{ topitem.countMessage.AssignedGroup[index].employeeGroupName }}
                              <b v-if="topitem.countMessage.AssignedGroup" @click="remove(topitem.countMessage.AssignedGroup[index])">
                                <i class="el-icon-circle-close" />
                              </b>
                            </div>
                          </div>
                          <div v-else>
                            <div />
                          </div>
                        </div>
                        <div v-for="(itm,ind) in item" :key="ind" :rosterId="itm.rosterId" class="cont" :style="{backgroundColor:itm.shiftTypeColor}">
                          <el-dropdown trigger="click" @command="handleCommand($event,itm,)">
                            <div v-if="itm.startTime" class="el-dropdown-link">{{ itm.startTime | joinDate3 }} {{ itm.endTime | joinDate3 }}</div>
                            <div v-else class="el-dropdown-link">休息</div>
                            <el-dropdown-menu v-if="!itm.rosterCheckId" slot="dropdown">
                              <el-dropdown-item v-for="(items,i) in classes1" :key="i" :command="items" :item="itm.rosterId" :bg="items.color" :label="items.shiftName">{{ items.shiftName }}</el-dropdown-item>
                            </el-dropdown-menu>
                            <el-dropdown-menu v-if="itm.rosterCheckId" slot="dropdown">
                              <el-dropdown-item v-for="(items,i) in classes" :key="i" :command="items" :item="itm.rosterId" :bg="items.color" :label="items.shiftName">{{ items.shiftName }}</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <span v-if="itm.rosterCheckId">!</span>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="right-content" :style="{right:scrollLeft+'px'}">
                    <template v-for="(item,index) in topitem.countMessage.count">
                      <div :key="index" class="contLeft bg sum" style="font-size:14px!important;padding:2px 0;">
                        <!-- 做 {{ item.workMode | nmbTos }} 休 {{ item.restMode | nmbTos }}<br> -->
                        <p><span>总工时:</span><b>{{ item.allDay }}</b></p>
                        <p><span>日均工时:</span><b>{{ item.evertDay }}</b></p>
                      </div>
                    </template>
                  </div>
                </div>

              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <!--请选择时间段  -->
      <el-dialog v-dialogDrag title="请选择时间段" :visible.sync="centerDialogVisible" width="400px" top="10%" center>
        <div>
          <p>
            <span>开始时间：</span>
            <el-time-select v-model="startTime" placeholder="起始时间" :picker-options="{ start: '00:00',step: '00:15',end: '24:00'}" />
          </p>
          <p>
            <span>结束时间：</span>
            <el-time-select v-model="endTime" placeholder="结束时间" :picker-options="{start: '00:00',step: '00:15', end: '24:00',minTime: startTime}" />
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="conmiTime">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看警报 -->
      <el-dialog title="查看警报" :visible.sync="centerDialogWarn" width="420px" top="20%" center>
        <div>
          <p>
            <span v-for="(item,idex) in messageData " :key="idex">{{ item }}</span>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogWarn = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getMessage } from '@/utils/errors'
import { version, employeetype, initable, note, automatic, edit, removEmployee, UseRoster, removep, seeWarning, shiftType, name } from '@/api/schedule'
import PanelGroup from './components/PanelGroup'
import templatedom from './components/templatedom'
export default {
  components: {
    PanelGroup,
    templatedom
  },
  filters: {
    joinDate(value) {
      value = value.substring(0, 10)
      return value
    },
    joinDate2(value) {
      value = value.substring(10)
      return value
    },
    joinDate3(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    },
    nmbTos(value) {
      switch (value) {
        case 1:
          value = '一'
          break
        case 2:
          value = '二'
          break
        case 3:
          value = '三'
          break
        case 4:
          value = '四'
          break
        case 5:
          value = '五'
          break
        case 6:
          value = '六'
          break
        case 7:
          value = '七'
          break
        default:
          break
      }
      return value
    }
  },
  data() {
    return {
      scrollLeft: '',
      employeeCode: '',
      rosterVersionData: {},
      search: '',
      rosterSetting: [], // 排班表数据
      rosterModeVersion: '',
      numPeople: '', // 总人数
      currentNodekey: '',
      rosterSettingId: '',
      activeNames: [],
      loading: false,
      current: true, // 当前高亮
      rosterSettingVersionId: '',
      settingVersionName: '',
      value: parseInt(this.$route.query.rosterSettingVersionId),
      version: [], // 排班
      itemBg: '',
      startTime: '',
      endTime: '',
      itemId: '',
      rosterId: '',
      centerDialogWarn: false,
      centerDialogVisible: false,
      startExchangeIndex: '',
      endExchangeIndex: '',
      dragstartList: {},
      classes1: [{ id: '1', shiftName: '修改时间段' }],
      classes: [{ id: '1', shiftName: '修改时间段' }, { id: '2', shiftName: '查看警告' }],
      slideValue: 50,
      weekslist: [],
      grayTotal: [],
      dataList: [],
      rosterMode: [],
      schedulelist: [], // 小方格
      treeData: {}, // 员工类型
      defaultProps: {
        children: 'roles',
        label: 'employeeTypeName'
      },
      employeeTypeName: '',
      rule: [],
      count: {},
      messageData: [],
      column: [],
      unAssigned: [],
      Assigned: {},
      unAssignedEmployee: [],
      unAssignedEmployeelength: '',
      employeeTypeId: '',
      rosterActivation: '', // 激活状态
      show: false,
      rowLength: '',
      strType: '',
      tipsdata: {},
      methodShow: '',
      switchTshow: true,
      shiftType: []
    }
  },
  watch: {
    scrollLeft: {
      handler(val) {
        this.scrollLeft = val
      },
      deep: true
      // immediate: true
    }
  },
  mounted() {
  },
  created() {
    this.versionFn()
    this.shiftTypeinit()
    this.scrollDown()
  },
  methods: {
    scrollDown() {
      const dom = this.$refs['elscrollbar']
      if (dom) {
        dom.forEach(element => {
          element.wrap.addEventListener('scroll', () => {
            console.log(element, element.wrap.scrollLeft)
            this.scrollLeft = element.wrap.scrollLeft
          })
        })
      }
    },
    versionFn() {
      // 查询排班表名
      version().then(response => {
        this.version = response.data
        this.choseVers(this.value) // 初始化
      })
    },
    choseVers(item) {
      // 选择员工类型
      this.rosterSettingVersionId = item
      var obj = {}
      obj = this.version.find(item2 => {
        return item2.rosterSettingVersionId === item
      })
      this.rosterVersionData = obj
      console.log(this.rosterVersionData, 101)
      var diff = new Date(this.rosterVersionData.rosterTo).getTime() - new Date(this.rosterVersionData.rosterFrom).getTime()
      var days = Math.floor(diff / (24 * 3600 * 1000)) + 1
      this.rosterVersionData.nday = this.rosterVersionData.nday ? this.rosterVersionData.nday : days
      this.rosterVersionData.startDate = this.rosterVersionData.startDate ? this.rosterVersionData.startDate : 1
      this.rosterVersionData.staffNumber = this.rosterVersionData.staffNumber === 0 ? null : this.rosterVersionData.staffNumber
      this.rosterVersionData.fullCover = typeof this.rosterVersionData.fullCover === 'number' ? this.rosterVersionData.fullCover.toString() : '0'
      this.settingVersionName = obj.settingVersionName
      employeetype(item).then(response => {
        this.methodShow = response.data.method
        this.treeData = response.data
        this.$nextTick(() => {
          this.employeeTypeId = this.treeData.rosterSettingModeBeans[0].employeeTypeId
          this.$refs.tree2.setCurrentKey(this.treeData.rosterSettingModeBeans[0].employeeTypeId)
          if (this.treeData.method === 1) {
            // 如果是算法rosterSettingId就从这里取值
            this.rosterSettingId = this.treeData.rosterSettingModeBeans[0].rosterSettingBeans[0].rosterSettingId
          }
        })
        this.init()
      })
      // this.version.forEach(element => {
      //   if (element.rosterSettingVersionId === item) {
      //     this.rosterVersionData = element
      //   }
      // })
    },
    handleNodeClick(e) {
      // 员工列表点击渲染排班表
      this.employeeTypeName = e.employeeTypeName
      if (this.treeData.method === 1) {
        // 如果是算法rosterSettingId就从这里取值
        this.rosterSettingId = e.rosterSettingBeans[0].rosterSettingId
        this.rosterModeVersion = this.treeData.rosterModeVersion
      }
      this.show = true
      this.employeeTypeId = e.employeeTypeId
      this.init()
    },
    init() {
      this.loading = true
      var data = {
        rosterSettingVersionId: this.rosterSettingVersionId === '' ? this.value : this.rosterSettingVersionId,
        employeeTypeId: this.employeeTypeId === '' ? this.treeData.rosterSettingModeBeans[0].employeeTypeId : this.employeeTypeId
      }
      initable(data).then(response => {
        this.loading = false
        if (response.data) {
          if (response.data.unAssignedGroup) {
            this.unAssignedEmployee = []
            this.unAssigned = response.data.unAssignedGroup // 未分配班组
            this.unAssignedEmployeelength = Object.keys(response.data.unAssignedGroup).length
            this.strType = 'group'
          }
          if (response.data.unAssignedEmployee) {
            this.unAssigned = []
            this.unAssignedEmployee = response.data.unAssignedEmployee // 未员工
            this.unAssignedEmployeelength = Object.keys(response.data.unAssignedEmployee).length
            this.strType = 'employee'
          }
          this.rosterSetting = response.data.rosterSetting
          response.data.rosterSetting.forEach(element => {
            if (element.countMessage.AssignedEmployee) {
              Object.getOwnPropertyNames(element.countMessage.AssignedEmployee).forEach(function(cur) {
                if (element.countMessage.AssignedEmployee[cur].employeeName) {
                  element.countMessage.AssignedEmployee[cur].strType = 'employee'
                }
              })
            } else if (element.countMessage.AssignedGroup) {
              Object.getOwnPropertyNames(element.countMessage.AssignedGroup).forEach(function(cur) {
                if (element.countMessage.AssignedEmployee[cur].employeeGroupName) {
                  element.countMessage.AssignedGroup[cur].strType = 'group'
                }
              })
            }
          })
        }
      })
    },
    shiftTypeinit() {
      shiftType().then(response => {
        this.shiftType = response.data
      })
    },
    switchT() {
      // 展示按扭切换
      if (this.switchTshow) {
        this.switchTshow = false
      } else {
        this.switchTshow = true
      }
    },
    handleCommand(command, itm) {
      // 点击单元格选择弹框触发
      this.rosterId = itm.rosterId
      if (command.id === '1') {
        // 修改时间段
        this.tipsdata = itm
        this.centerDialogVisible = true
      } else {
        this.centerDialogWarn = true
        seeWarning(itm.rosterCheckId).then(response => {
          this.messageData = []
          this.messageData = response.data.message
        })
      }
    },
    removeTep(item) {
      // 排班表删除
      this.$confirm('确定要删除此排班表吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removep(item.rosterSettingId).then(response => {
            this.$message({
              // type: 'success',
              message: response.message
            })
            this.init()
          })
        })
        .catch(() => {})
    },
    changeIsopen() {
      // 激活状态
      const data = {
        rosterSettingId: this.rosterSettingId
        // employeeTypeId: this.employeeTypeId
      }
      if (!this.employeeTypeId) {
        this.$message({
          message: '请选择排班表',
          type: 'error'
        })
      }
      UseRoster(data).then(response => {
        if (response.data.code === '200') {
          this.$message.success('同步成功')
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        this.$message.error(getMessage(error))
      })
    },
    conmiTime() {
      var col = '' // 判断是第几个排版表
      this.rosterSetting.forEach((element, index) => {
        if (element.rosterSettingId === this.tipsdata.rosterSettingId) {
          col = index
        }
      })
      if (this.startTime && this.endTime) {
        if (this.tipsdata.startTime) {
          // 为了给休息改时间段
          this.tipsdata.startTime = this.tipsdata.startTime.substring(0, 11) + this.startTime
        } else {
          this.tipsdata.startTime = this.rosterSetting[col].countMessage.dates[this.tipsdata.dateNum].substring(0, 10) + ' ' + this.startTime
        }
        if (this.tipsdata.endTime) {
          this.tipsdata.endTime = this.tipsdata.endTime.substring(0, 11) + this.endTime
        } else {
          this.tipsdata.endTime = this.rosterSetting[col].countMessage.dates[this.tipsdata.dateNum].substring(0, 10) + ' ' + this.endTime
        }
      } else if (!this.startTime && !this.endTime) {
        // 时间都不填的时候
        this.tipsdata.startTime = ''
        this.tipsdata.endTime = ''
      }
      this.tipsdata.shiftName = '修改时间段'
      this.centerDialogVisible = false
      note(this.tipsdata).then(response => {
        this.init()
      })
      //  else {
      //   this.$message({
      //     message: '没有选择开始或结束时间哦',
      //     type: 'error'
      //   })
      // }
    },
    automatic(item) {
      // 自动分配
      console.log(item)
      var data = {
        employeeTypeId: this.employeeTypeId,
        rosterSettingId: item.rosterSettingId,
        strType: this.strType
      }
      // console.log(data)
      automatic(data).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.init()
      })
    },
    remove(item) {
      // 拖拉删除
      console.log(item, 8877)
      var data = {
        employeeGroupId: item.employeeGroupId == null ? item.employeeId : item.employeeGroupId,
        rosterSettingId: this.rosterSettingId,
        strType: item.employeeGroupId ? 'group' : 'employee'
      }
      console.log(item.employeeGroupId, 6)
      removEmployee(data).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.init()
      })
    },
    allowDrop(ev, item) {
      ev.preventDefault()
    },
    dragstart(key, item) {
      if (item.employeeId) {
        // 如果是员工
        this.dragstartList = {
          key: key,
          employeeId: item.employeeId,
          employee: item.employeeName,
          strType: 'employee'
        }
      } else if (item.employeeGroupId) {
        // 如果是班组
        this.dragstartList = {
          key: key,
          employeeGroupId: item.employeeGroupId,
          group: item.employeeGroupName,
          strType: 'group'
        }
      }
    },
    drag(ev, item) {
      console.log(item)
    },
    dragend(ev, item) {
      console.log(item, 7777)
      if (item.employeeGroupName) {
        item.employeeGroupName = ''
      } else if (item.employeeName) {
        item.employeeName = ''
      }
      if (this.unAssignedEmployeelength > 0) {
        this.unAssignedEmployeelength = this.unAssignedEmployeelength - 1
      }
    },
    onDrop(event, item) {
      console.log(item, this.dragstartList, '拖结束数据')
      var data = {}
      if (this.dragstartList.employeeId) {
        data.employeeName = this.dragstartList.employee
        data.employeeId = this.dragstartList.employeeId
        data.rosterLine = item
        data.strType = 'employee'
      } else if (this.dragstartList.employeeGroupId) {
        data.employeeGroupName = this.dragstartList.group
        data.employeeGroupId = this.dragstartList.employeeGroupId
        data.employeeId = ''
        data.rosterLine = item
        data.strType = 'group'
      }
      console.log(data, 787878788)
      data.rosterSettingId = this.rosterSettingId
      data.editId = data.employeeId === '' ? data.employeeGroupId : data.employeeId
      localStorage.setItem('line', data.rosterLine)
      edit(data).then(response => {
        // 编辑
        this.init()
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    gotoEdit() {
      this.$router.push({ path: '/prepare/allPages/shiftTable' })
    },
    clear() {
      this.init()
    },
    nameSearch() {
      var data = {
        rosterSettingVersionId: this.rosterSettingVersionId,
        employeeTypeId: this.employeeTypeId,
        name: this.search,
        employeeCode: this.employeeCode
      }
      name(data).then(response => {
        this.loading = false
        if (response.data) {
          if (response.data.unAssignedGroup) {
            this.unAssignedEmployee = []
            this.unAssigned = response.data.unAssignedGroup // 未分配班组
            this.unAssignedEmployeelength = Object.keys(response.data.unAssignedGroup).length
            this.strType = 'group'
          }
          if (response.data.unAssignedEmployee) {
            this.unAssigned = []
            this.unAssignedEmployee = response.data.unAssignedEmployee // 未员工
            this.unAssignedEmployeelength = Object.keys(response.data.unAssignedEmployee).length
            this.strType = 'employee'
          }
          this.rosterSetting = response.data.rosterSetting
          response.data.rosterSetting.forEach(element => {
            if (element.countMessage.AssignedEmployee) {
              Object.getOwnPropertyNames(element.countMessage.AssignedEmployee).forEach(function(cur) {
                if (element.countMessage.AssignedEmployee[cur].employeeName) {
                  element.countMessage.AssignedEmployee[cur].strType = 'employee'
                }
              })
            } else if (element.countMessage.AssignedGroup) {
              Object.getOwnPropertyNames(element.countMessage.AssignedGroup).forEach(function(cur) {
                if (element.countMessage.AssignedEmployee[cur].employeeGroupName) {
                  element.countMessage.AssignedGroup[cur].strType = 'group'
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './scheduleGenerator.scss';
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
.settingVersionName {
  padding-bottom: 5px;
  overflow: hidden;
  .el-select {
    float: left;
    width: 170px;
  }
  svg {
    margin: 12px 6px 0 8px !important;
    cursor: pointer;
  }
}
.cols {
  display: inline-block;
  text-align: right;
  width: 40%;
  span {
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    margin-right: 20px;
    ins {
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
    }
    ins.zb {
      background: #5677d5;
    }
    ins.zb2 {
      background: #d8a738;
    }
    ins.wb {
      background: #a168ff;
    }
    ins.xx {
      background: #666;
    }
    ins.yb {
      background: #000;
    }
  }
}
.tableCon {
  span {
    font-size: 14px;
    padding: 2px 10px;
    display: block;
    cursor: pointer;
  }
  .el-button {
    width: 98%;
    margin: 0 1%;
  }
  div.de {
    margin-top: 10px;
  }
}
</style>
