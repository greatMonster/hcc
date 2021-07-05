<template>
  <div class="dialog">
    <!--展示模板  -->
    <div v-for="(group, i) in topitem.modes" :key="i" class="cont" :style="{ backgroundColor: group.color }">
      <el-dropdown trigger="click" @command="handleCommand($event, group, i)">
        <div>
          {{ group.beginDate }}
          <br />
          {{ group.endDate }}
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(items, index2) in classes" :key="index2" :command="items.id" :item="group.id" :label="items.label">{{ items.label }}</el-dropdown-item>
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
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conmiTime">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 生成排班表 -->
    <el-dialog v-dialogDrag title="生成排班表" :visible.sync="dialogVisibleAdd" width="30%" top="8%">
      <el-form ref="numberValidateForm" :model="numberValidateForm" :rules="numberValidateFormRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="行数:" prop="lineNum">
          <el-input v-model.number="numberValidateForm.lineNum" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="偏移量:" prop="offset">
          <el-input v-model.number="numberValidateForm.offset" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item label="技能:" prop="skillId">
          <el-select v-model="numberValidateForm.skillId" placeholder="请选择">
            <el-option v-for="(items, indexs) in skillOptions" :key="indexs" :label="items.name" :value="items.id" />
          </el-select>
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
import { addmode, makeRosters, skillDataFcn } from '@/apiNew/schedule'
export default {
  filters: {},
  props: ['topitem', 'rosterModeVersion', 'rosterSettingId', 'ids'],
  data() {
    return {
      datas: [],
      disabled: false,
      schedulelist: [],
      centerDialogVisible: false,
      beginDate: '',
      endDate: '',
      classes: [
        { id: 'edit', label: '修改时间段' },
        { id: 'removemode', label: '删除' }
      ],
      bombtype: '',
      skillOptions: [],
      rosterModeId: '',
      index: '',
      dialogVisibleAdd: false,
      numberValidateForm: {
        offset: '',
        lineNum: '',
        skillId: ''
      },
      numberValidateFormRules: {
        lineNum: [{ required: true, message: '请输入行数' }],
        offset: [{ required: true, message: '请输入偏移量' }],
        skillId: [{ required: true, message: '请输入选择技能' }]
      },
      createdTimes: 0
    }
  },
  watch: {
    topitem: {
      handler: function () {},
      deep: true
    },
    ids: {
      handler: function () {},
      deep: true
    }
  },
  created() {
    this.ids.split(',')[0]
    skillDataFcn(this.ids.split(',')[0]).then((res) => {
      this.skillOptions = res.data.data
    })
  },
  methods: {
    addTemp() {
      // 模板增加
      this.centerDialogVisible = true
      this.bombtype = 'add'
    },
    handleCommand(command, group, index) {
      if (command === 'edit') {
        this.centerDialogVisible = true
        this.bombtype = command
        this.index = index
      } else if (command === 'removemode') {
        this.topitem.modes.splice(index, 1)
      }
    },
    conmiTime() {
      // 加模板弹框确定
      this.showCreatedTimes()
      if (this.bombtype === 'edit') {
        // 为1是编辑
        this.topitem.modes[this.index].beginDate = this.beginDate
        this.topitem.modes[this.index].endDate = this.endDate
      } else {
        var datadd = {
          beginDate: this.beginDate,
          endDate: this.endDate
        }
        addmode(datadd).then((response) => {
          // 增加
          if (!this.topitem.modes) {
            // this.$set(this.topitem.modes, response.data)
          } else {
            this.topitem.modes.push({ beginDate: this.beginDate, endDate: this.endDate, color: response.data.data, weight: this.createdTimes })
          }
        })
      }
      this.centerDialogVisible = false
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    commit(item) {
      // 生成排班表
      this.numberValidateForm.id = this.topitem.id
      this.numberValidateForm.pattens = this.topitem.modes
      if (this.topitem.modes.length < 1) {
        this.$message.warning('请至少添加一个时段')
      } else {
        this.$refs['numberValidateForm'].validate((valid) => {
          if (valid) {
            makeRosters(this.numberValidateForm)
              .then((response) => {
                this.dialogVisibleAdd = false
                this.$emit('initab')
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  background: #0a142f;
  padding: 4px;
  margin-bottom: 8px;
}
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
