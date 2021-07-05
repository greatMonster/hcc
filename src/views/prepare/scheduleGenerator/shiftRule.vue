<template>
  <div class="shiftBody">
    <div class="shiftBox">
      <div class="title">创建新排班表</div>
      <div class="content">
        <el-steps v-show="radio==1" :active="active" finish-status="success">
          <el-step title="请选择如何创建排班表文档" />
          <el-step title="请选择工作量" />
          <el-step title="请选择规则" />
          <el-step title="选择需要进行排班的员工类型" />
          <el-step title="完成向导，提交数据" />
        </el-steps>
        <el-steps v-show="radio==2" :active="active" finish-status="success">
          <el-step title="请选择如何创建排班表文档" />
          <el-step title="选择排班时间和类型" />
          <el-step title="完成向导，提交数据" />
        </el-steps>
        <div v-if="active === 1" class="howCreat">
          <div class="howBox">
            <el-radio v-model="radio" label="1">根据工作量和规则创建排班表</el-radio>
            <el-radio v-model="radio" label="2" style="margin-top:30px">生成空排班表</el-radio>
          </div>
        </div>
        <div v-if="radio == 1&&active == 2" class="startTime">
          <div class="howBox">
            <div class="type">
              选择工作量：
              <el-select v-model="data.documentWorkloadId" value-key="value" placeholder="请选择" @visible-change="changeValue1()">
                <el-option
                  v-for="item in workload"
                  :key="item.documentId"
                  :label="item.name"
                  :value="item.documentId"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="radio == 1&&active == 3" class="startTime">
          <div class="howBox">
            <div class="type">
              选择规则：
              <el-select v-model="data.documentRuleId" value-key="value" placeholder="请选择" @visible-change="adRuleS()">
                <el-option
                  v-for="item in adRule"
                  :key="item.documentId"
                  :label="item.name"
                  :value="item.documentId"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="radio == 1&&active === 4" style="width:50%;margin:50px auto">
          <el-table ref="multipleTable" :data="employeeType" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column prop="empTypeName" label="员工类型" />
            <el-table-column prop="defaultCount" label="员工数量">
              <template slot-scope="scope">
                {{ scope.row.defaultCount }}
              </template>
            </el-table-column>
            <el-table-column type="selection" width="55" />
          </el-table>
        </div>
        <div v-if="radio == 1&&active === 5" class="submitData">
          <div class="howBox">
            你成功完成了本向导！点击提交结束向导，你就可以编辑排班表啦！
          </div>
        </div>
        <div v-if="radio == 2&&active == 2" class="startTime">
          <div class="howBox">
            <div class="time1">
              开始日期：
              <el-date-picker
                v-model="startime"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <div class="time2">
              结束日期：
              <el-date-picker
                v-model="endtime"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <div class="type">
              排班表类型：
              <el-select v-model="shiftType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="radio == 2&&active === 3" class="submitData">
          <div class="howBox">
            你成功完成了本向导！点击提交结束向导，你就可以编辑排班表啦！
          </div>
        </div>

        <div class="deployBtn">
          <div class="btnStyle">
            <el-button v-if="isShowPev" @click="prev">上一步</el-button>
            <el-button v-if="isShowNext" @click="next">下一步</el-button>
            <el-button v-if="active==5 || radio == 2&&active==3" type="primary" @click="submitData">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { initSelect, adRule, documentWorkloadId, add } from '@/api/schedule'
export default {
  data() {
    return {
      isShowPev: true,
      isShowNext: true,
      dialogVisible: false,
      active: 1,
      radio: '1',
      radio5: '6',
      startime: '',
      endtime: '',
      form: { workload: '', adRule: '' },
      workload: [],
      adRule: [],
      employeeType: [],
      options: [{
        value: '选项1',
        label: '循环'
      }, {
        value: '选项2',
        label: '自循环'
      }, {
        value: '选项3',
        label: '非循环'
      }],
      shiftType: '',
      datalist: [{ type: '' }],
      multipleSelection: [],
      employeeType2: [{
        type: '兼职司机',
        number: '生成每行一个员工'
      }, {
        type: '全职司机',
        number: '生成每行一个员工'
      }],
      data: {
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
        rosterSettingVersionId: 1,
        rosterTo: '2019-08-10 10:46:56',
        rosterType: null,
        settingVersionName: '安检',
        startDate: null,
        versionLineNum: null
      }
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler: function() {
        console.log(this.multipleSelection)
      }
    }
  },
  created() {
  },
  methods: {
    prev() {
      --this.active
      if (this.active < 0) {
        this.active = 1
      }
    },
    next() {
      if (this.active === 2) {
        if (this.data.documentWorkloadId !== '') { // 工作量非空验证
          this.documentWorkloadId()// 渲染员工数据
        } else {
          this.$message({
            message: '请选择工作量',
            type: 'warning'
          })
          return
        }
      }
      if (this.active === 3) { // 规则非空验证
        if (this.data.documentRuleId === '') {
          this.$message({
            message: '请选择规则',
            type: 'warning'
          })
          return
        }
      }
      if (++this.active > 5) {
        this.active = 1
      }
      this.datalist[0].type = this.radio
      this.datalist[0].shiftType = this.shiftType
      this.datalist[0].startim = this.startime
      this.datalist[0].endtime = this.endtime
      this.datalist[0].employeeType = this.multipleSelection
      console.log(this.datalist, 5555)
    },
    submitData() {
      add(this.data).then(response => {
        this.$router.push('scheduleGenerator')
      })
      // this.$router.push('scheduleGenerator')
    },
    handleSelectionChange(val) { // 选择员工类型
      this.data.rosterSettingBeans = []
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
          rosterSettingId: 8,
          rosterSettingName: '安检',
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
        this.data.rosterSettingBeans.push(obj)
      })
    },
    changeValue1() { // 工作量下拉
      initSelect().then(response => {
        this.workload = response.data
      })
    },
    adRuleS() { // 规则下拉
      var data = {
        data: 'RULESET'
      }
      adRule(data).then(response => {
        this.adRule = response.data.data
      })
    },
    documentWorkloadId() { // 员工类型
      documentWorkloadId(this.data.documentWorkloadId).then(response => {
        this.employeeType = response.data
      })
    }
  }
}
</script>

<style>
.el-step__title.is-process {
    font-weight: 700;
    color: #ccc;
}
</style>

<style scoped>
.shiftBody {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    color: white;
    font-size: 14px;
    background-color: #0A142F;
}
.shiftBox {
    width: 100%;
    height: 100%;
    background: #232C47;
}
.title {
    width: 100%;
    height: 40px;
    line-height: 30px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 5px;
    border-bottom: 3px solid #434B61;
}
.content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
}
.howCreat,.startTime,.submitData {
    width: 500px;
    height: 300px;
    display: flex;
    align-items: center;
    margin: 20px auto;
    box-sizing: border-box;
    padding: 30px;
    border: 1px solid #434B61;
}
.howBox {
    display: flex;
    flex-direction: column;
}
.deployBtn {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btnStyle {
    width: 50%;
    display: flex;
    justify-content: space-around;
}
.time2,.type {
    width: 100%;
    height: 45px;
    margin-top: 15px;
}
</style>
