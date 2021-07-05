<template>
  <div>
    <el-table :data="tables.cellMessage" max-height="600" :style="{ width: tableWidth }">
      <el-table-column prop="line" width="56" fixed>
        <template slot-scope="scope">
          <div class="bg sum" @dragover="allowDrop($event, scope.row)" @drop="onDrop($event, scope.row)" @dragend="dragend($event, scope.row)">
            <el-popover placement="top-start" width trigger="hover">
              <el-button type="primary" size="mini" @click="addLine(scope.row)">添加一行</el-button>
              <el-button type="primary" size="mini" @click="deleteLine(scope.row)">删除一行</el-button>
              <div slot="reference">{{ scope.row.line }}</div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="employeeName" width="90" fixed>
        <template slot-scope="scope">
          <div class="cont bg" @dragover="allowDrop($event, scope.row)" @drop="onDrop($event, scope.row)" @dragend="dragend($event, scope.row)">
            <div v-if="scope.row.groupName">
              <el-popover trigger="click" placement="bottom" style="position: absolute; top: 0; width: 100%; left: 0">
                <p v-for="item in scope.row.rosterEmployeeVOS" :key="item.groupId">
                  <i v-if="item.leader && item.leader == 0" class="el-icon-user" />
                  {{ item.name }} -
                  <span style="color: #409eff">{{ item.code }}</span>
                  - {{ item.departmentName }}
                </p>
                <div slot="reference">{{ scope.row.groupName }}</div>
              </el-popover>
            </div>
            <!-- <div> -->
            <div v-else>{{ scope.row.employeeName }}</div>
            <!-- {{ scope.row.groupName?scope.row.groupName:scope.row.employeeName }} -->
            <!-- </div> -->
            <b v-if="scope.row.employeeName || scope.row.groupName" @click="remove(scope.row)">
              <i class="el-icon-circle-close" />
            </b>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in tables.days" :key="JSON.stringify(item)" width="90" :label="item.data">
        <template slot="header">
          <div class="day">
            <p>{{ item.date }}</p>
            <p>{{ item.week }}</p>
          </div>
          <p class="column">
            <span :style="{ color: shiftType[0].color }">{{ item.morn }}</span>
            <span :style="{ color: shiftType[1].color }">{{ item.noon }}</span>
            <span :style="{ color: shiftType[2].color }">{{ item.evening }}</span>
            <span :style="{ color: shiftType[3].color }">{{ item.night }}</span>
            <span :style="{ color: shiftType[4].color }">{{ item.rest }}</span>
          </p>
        </template>
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleCommand($event, scope.row.rosters[index])">
            <div class="cont bg" :style="{ backgroundColor: scope.row.rosters[index].colors }">
              <span v-if="scope.row.rosters[index].checkMessage">!</span>
              <div v-if="scope.row.rosters[index].beginDate" class="el-dropdown-link" :style="{ backgroundColor: scope.row.rosters[index].usable ? 'red' : '' }">
                {{ scope.row.rosters[index].beginDate }} {{ scope.row.rosters[index].endDate }}
                <div v-if="scope.row.rosters[index].usable" style="height: 11px; font-size: 8px; color: white">不可用</div>
              </div>
              <div v-else class="el-dropdown-link">休息</div>
              <el-dropdown-menu v-if="scope.row.rosters[index].checkMessage" slot="dropdown">
                <el-dropdown-item v-for="(items, i) in classesW" :key="i" :command="items" :bg="items.color" :label="items.shiftName">{{ items.shiftName }}</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else-if="scope.row.rosters[index].usable == false">
                <el-dropdown-item v-for="(items, i) in classes" :key="i" :command="items" :bg="items.color" :label="items.shiftName">{{ items.shiftName }}</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else>
                <el-dropdown-item :disabled="isDisabled">{{ scope.row.rosters[index].usableMessage }}</el-dropdown-item>
              </el-dropdown-menu>
            </div>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="totalDay" fixed="right" width="118">
        <template slot-scope="scope">
          <div class="bg rightSum">
            <div>
              <span>总工时:{{ scope.row.totalDay }}</span>
              <!-- <span>{{ scope.row.totalDay }}</span> -->
            </div>
            <div>
              <span>日均出勤工时:{{ scope.row.workDay }}</span>
              <!-- <span>{{ scope.row.workDay }}</span> -->
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--请选择时间段  -->
    <el-dialog v-dialogDrag title="请选择时间段" :visible.sync="centerDialogVisible" width="400px" top="10%" center>
      <div>
        <p>
          <span>选择技能：</span>
          <el-select v-model="skillId" style="width: 150px" size="small" placeholder="请选择">
            <el-option v-for="item in skillList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </p>
        <p>
          <span>开始时间：</span>
          <el-time-select v-model="beginDate" placeholder="起始时间" :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }" />
        </p>
        <p>
          <span>结束时间：</span>
          <el-time-select v-model="endDate" placeholder="结束时间" :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }" />
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="conmiTime">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看警报 -->
    <el-dialog title="查看警报" :visible.sync="centerDialogWarn" width="420px" top="20%" center>
      <div>
        <p>{{ tipsdata.checkMessage }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="centerDialogWarn = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deletedrag, drag, dragGroup, cells, deleteline, addline, delGroup, skillSearch } from '@/apiNew/schedule'
export default {
  filters: {
    joinDate(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['tables', 'rosterSettingId', 'createdTimes', 'schedulelist', 'dragemployeeTypeId', 'dragGroupItem', 'shiftType'],
  data() {
    return {
      airportId: this.$store.state.user.airport.airportId || '',
      skillId: '',
      skillList: [],
      isDisabled: true,
      tableWidth: '',
      beginDate: '',
      endDate: '',
      shiftTableId: this.tables.id,
      classes: [
        { id: 'edit', shiftName: '修改时间段' },
        { id: 'restDay', shiftName: '休息日' }
      ],
      classesW: [
        { id: 'edit', shiftName: '修改时间段' },
        { id: 'restDay', shiftName: '休息日' },
        { id: 'warning', shiftName: '查看警告' }
      ],
      centerDialogVisible: false,
      centerDialogWarn: false,
      tableDatas: {},
      head: [],
      messageData: [],
      lineNumber: '',
      tipsdata: {},
      seen: false,
      current: 0
    }
  },
  watch: {
    tables: {
      handler: function () {
        if (this.tables.days) {
          this.tableWidth = (this.tables.days.length + 1) * 92 + 168 + 'px'
        }
      },
      deep: true,
      immediate: true
    },
    lineNumber: {
      handler: function (val) {
        this.lineNumber = val
      },
      deep: true
    }
  },
  created() {
    // this.searchSkill()
  },
  methods: {
    searchSkill() {
      return new Promise((resolve, reject) => {
        skillSearch({ rosterSettingId: this.tables.id, airportId: this.airportId }).then((res) => {
          this.skillList = res.data.data
          resolve(res.data.data)
        })
      })
    },
    handleCommand(command, itm) {
      this.tipsdata = itm
      if (command.id === 'edit') {
        // 修改时间段
        const skillPromise = this.searchSkill()
        skillPromise.then((res) => {
          this.centerDialogVisible = true
          this.skillId = itm.skillId
          this.beginDate = itm.beginDate
          this.endDate = itm.endDate
        })
      } else if (command.id === 'restDay') {
        this.$confirm('确定修改为休息日？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = {
              rosterId: this.tipsdata.rosterId,
              beginDate: '',
              endDate: '',
              rosterDate: this.tipsdata.rosterDate
            }
            cells(data).then((response) => {
              this.$emit('initab')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else if (command.id === 'warning') {
        this.centerDialogWarn = true
        this.messageData = []
        this.messageData = itm.checkMessage
      }
    },
    conmiTime() {
      const data = {
        rosterId: this.tipsdata.rosterId,
        beginDate: this.beginDate,
        endDate: this.endDate,
        skillId: this.skillId,
        rosterDate: this.tipsdata.rosterDate
      }
      // console.log(data, 112233)
      cells(data).then((response) => {
        this.centerDialogVisible = false
        this.$emit('initab')
      })
    },
    allowDrop(ev, item) {
      ev.preventDefault()
    },
    onDrop(event, item) {
      // console.log(item, 'type')
      this.lineNumber = item.line
      const data = {
        // rosterSettingId: this.rosterSettingId,
        rosterSettingId: this.tables.id,
        lineNumber: item.line,
        code: this.dragemployeeTypeId,
        rosterGroupVO: this.dragGroupItem
      }
      if (this.dragemployeeTypeId) {
        drag(data).then((response) => {
          this.$emit('initab')
          this.$emit('search')
        })
      } else {
        dragGroup(data)
          .then((response) => {
            this.$emit('initab')
            this.$emit('search')
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.response.data.message
            })
          })
      }
    },
    dragend(event, item) {
      this.lineNumber = item.line
    },
    remove(item) {
      // 拖拉删除
      const data = {
        // rosterSettingId: this.rosterSettingId,
        rosterSettingId: this.tables.id,
        lineNumber: item.line,
        id: item.employeeId,
        rosterGroupVO: this.dragGroupItem
      }
      if (item.employeeId) {
        deletedrag(data).then((response) => {
          this.$emit('initab')
          this.$emit('search')
        })
      } else {
        delGroup(data).then((response) => {
          this.$emit('initab')
          this.$emit('search')
        })
      }
    },
    addLine(row) {
      const data = {
        rosterLine: row.line,
        rostersettingId: this.tables.id
      }
      row.rostersettingId = this.rosterSettingId
      // row.rostersettingId = row.id
      addline(data).then((response) => {
        if (response.data.code === '200') {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          this.$message.success('添加成功')
          this.$emit('initab')
        }
      })
    },
    deleteLine(row) {
      const data = {
        rosterLine: row.line,
        rostersettingId: this.tables.id
      }
      row.rostersettingId = this.rosterSettingId
      // row.rostersettingId = row.id
      this.$confirm('确定要删除此行？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteline(data).then((response) => {
            this.$message.success('删除成功')
            this.$emit('initab')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    enter(row, index) {
      this.seen = true
      this.current = index
    },
    leave() {
      this.seen = true
      this.current = null
    }
  }
}
</script>

<style scoped>
.el-table__fixed-right {
  right: 3px;
}
.el-table >>> th {
  background: #273355;
}
.el-table >>> .cell,
.el-table >>> th div,
.el-table >>> td {
  padding: 0;
}
.el-table >>> .el-table__header-wrapper {
  background: #273355;
}
</style>
<style lang="scss" scoped>
@import './table.scss';
.rightSum {
  color: #ccc;
  display: block;
  width: 118px;
  padding: 2px 0;
  background: -webkit-linear-gradient(90deg, #071f57, #091836) !important;
  div {
    padding: 0;
    margin: 2px 0px;
    span {
      text-align: right;
      display: inline;
      width: 58%;
    }
    b {
      width: 41%;
      display: inline-block;
      // text-align: right;
      font-weight: normal;
      color: #fff;
    }
  }
}
</style>
