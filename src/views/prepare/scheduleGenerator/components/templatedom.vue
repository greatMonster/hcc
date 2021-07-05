<template>
  <div class="dialog">
    <!--展示模板  -->
    <div v-for="(group,i) in topitem.countMessage.rosterMode" :key="i" class="cont" :style="{backgroundColor:group.shiftTypeColor}">
      <el-dropdown trigger="click" @command="handleCommand($event,group,i)">
        <div>{{ group.startTime | joinDate }}<br>{{ group.endTime |joinDate }}</div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(items,index2) in classes" :key="index2" :command="items.id" :item="group.id" :label="items.label">{{ items.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <span class="addBtn">
      <el-button type="primary" @click="addTemp">+</el-button>
    </span>
    <span class="addBtn">
      <el-button type="primary" @click="dialogVisibleAdd = true">生成排班表</el-button>
    </span>
    <!--请选择时间段  -->
    <el-dialog v-dialogDrag title="请选择时间段" :visible.sync="centerDialogVisible" width="400px" top="8%" center>
      <div>
        <p><span>开始时间：</span>
          <el-time-select v-model="startTime" placeholder="起始时间" :picker-options="{ start: '00:00',step: '00:15',end: '24:00'}" />
        </p>
        <p><span>结束时间：</span>
          <el-time-select v-model="endTime" placeholder="结束时间" :picker-options="{start: '00:00',step: '00:15', end: '24:00',minTime: startTime}" />
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conmiTime">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 生成排班表 -->
    <el-dialog v-dialogDrag title="生成排班表" :visible.sync="dialogVisibleAdd" width="30%" top="8%">
      <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排班表名:" prop="days">
          <el-input v-model.number="numberValidateForm.rosterSettingName" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="天数:" prop="days">
          <el-input v-model.number="numberValidateForm.days" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="行数:" prop="lineNum">
          <el-input v-model.number="numberValidateForm.lineNum" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="偏移量:" prop="offset">
          <el-input v-model.number="numberValidateForm.offset" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="commit('numberValidateForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addmode, setmode, removemode, emptyset } from '@/api/schedule'
export default {
  filters: {
    joinDate(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  props: ['topitem', 'rosterModeVersion'],
  data() {
    return {
      disabled: false,
      schedulelist: [],
      centerDialogVisible: false,
      startTime: '',
      endTime: '',
      classes: [{ id: '1', label: '修改时间段' }, { id: '2', label: '删除' }],
      bombtype: '',
      rosterModeId: '',
      index: '',
      dialogVisibleAdd: false,
      numberValidateForm: {
        rosterSettingName: '',
        days: '',
        offset: '',
        lineNum: ''
      }
    }
  },
  watch: {
    'topitem': {
      handler: function() {
        this.numberValidateForm.rosterSettingName = this.topitem.rosterSettingName
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    addTemp() { // 模板增加
      this.centerDialogVisible = true
    },
    handleCommand(command, group, index) {
      if (command === '1') {
        this.centerDialogVisible = true
        this.bombtype = command
        this.index = index
        this.rosterModeId = group.rosterModeId
      } else if (command === '2') {
        removemode(group.rosterModeId).then(response => { // 删除模板
          this.topitem.countMessage.rosterMode.splice(index, 1)
        })
      }
    },
    conmiTime() { // 加模板弹框确定
      var data = {
        startTime: this.startTime,
        endTime: this.endTime,
        rosterSettingId: this.topitem.rosterSettingId
      }
      if (this.bombtype === '1') { // 为1是编辑
        data.rosterModeId = this.rosterModeId
        setmode(data).then(response => {
          this.topitem.countMessage.rosterMode[this.index].startTime = response.data.startTime
          this.topitem.countMessage.rosterMode[this.index].endTime = response.data.endTime
          this.$emit('init')
        })
      } else {
        addmode(data).then(response => { // 增加
          if (!this.topitem.countMessage.rosterMode) {
            this.$set(this.topitem.countMessage, 'rosterMode', response.data)
          } else {
            this.topitem.countMessage.rosterMode.push(response.data)
          }
        })
      }
      this.centerDialogVisible = false
    },
    commit(item) { // 生成排班表
      // if (!this.topitem.rosterModeVersion) {
      //   this.$message.error('请填加模板')
      // }
      if (!this.topitem.rosterSettingId) {
        this.$message.error('请选择排班表')
      }
      this.numberValidateForm.rosterModeVersion = this.topitem.rosterModeVersion
      this.numberValidateForm.rosterSettingId = this.topitem.rosterSettingId
      emptyset(this.numberValidateForm).then(response => {
        this.dialogVisibleAdd = false
        this.$emit('init')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{background: #0a142f;padding: 0 4px}
.addBtn button {
  padding: 7px 11px;
  margin-left: 0;
}
div.cont {
  // width: 90px;
  background: #425079;
  border-radius: 5px;
  font-size: 14px;
  margin: 5px 2px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  position: relative;
  div {
    height: 40px;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-word;
    flex-direction: column;
    padding: 0 10px;
    float: left;
    text-align: center;
    width: 100%;
    color: #fff;
    p {
      margin: 0 10px;
      text-align: center;
    }
  }
}
</style>
