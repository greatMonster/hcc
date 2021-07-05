<template>
  <div class="topmeu">
    <el-row :gutter="5" type="flex">
      <el-col :span="6">
        <h4>基本信息</h4>
        <div class="baseInfo">
          <p>名 称：{{ initData.name }}</p>
          <p v-show="methodShow == 1">
            工作量：
            <span v-if="initData.rosterWorkloadVOS">
              <span v-for="(item, i) in initData.rosterWorkloadVOS" :key="i" style="color: #409eff" @click="openNext1">
                {{ item.workloadName }}
                <span>
                  &nbsp;&nbsp;
                  <!-- <i v-show="initData.rosterWorkloadVOS?initData.rosterWorkloadVOS.length>1:false" style="font-size:12px;color:#7b91c5;cursor:pointer" @click="openNext1">更多</i> -->
                </span>
              </span>
            </span>
          </p>
          <p v-show="methodShow == 1">
            出勤规则：
            <span v-if="initData.rosterRuleVOS">
              <span v-for="(item, i) in initData.rosterRuleVOS" :key="i" style="color: #409eff" @click="openNext">{{ item.ruleName }}</span
              >&nbsp;&nbsp;
            </span>
            <!-- <i v-show="initData.rosterRuleVOS?initData.rosterRuleVOS.length>1:false" style="font-size:12px;color:#7b91c5;cursor:pointer" @click="openNext">更多</i> -->
          </p>
        </div>
      </el-col>
      <el-col :span="18">
        <h4 v-show="methodShow == 1">算法参数</h4>
        <!-- <div v-show="methodShow==1" v-loading="loading" :element-loading-text="loadingtext" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="baseInfo" style="width:550px;"> -->
        <div v-show="methodShow == 1" class="baseInfo" style="width: 550px">
          <el-form ref="form" :model="form">
            <el-form-item>
              <span>
                排班区间：
                <el-tooltip class="item" effect="dark" content="来源是通过新建排班表时选择的工作量文件里设置的时间，可修改但不可越界" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-date-picker v-model="form.beginDate" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" size="mini" style="width: 190px" :picker-options="pickerOptions" />-
              <el-date-picker v-model="form.endDate" type="date" placeholder="结束时间" value-format="yyyy-MM-dd" size="mini" style="width: 190px" :picker-options="pickerOptions" />
            </el-form-item>
            <el-form-item>
              <span>
                限定人数：
                <el-tooltip class="item" effect="dark" content="限定人数是指定多少人排班。注：0是不限定人数" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <div class="isUsed">
                <el-checkbox v-model="checked" @change="checkedChange">启用</el-checkbox>
                <el-input v-model="form.staffNumber" placeholder="请输入人数" style="width: 320px; margin-left: 20px" :disabled="isDisabled" size="mini" />
              </div>
            </el-form-item>
            <el-form-item>
              <div style="display: inline-block">
                <span>
                  覆盖模式：
                  <el-tooltip class="item" effect="dark" content="是否覆盖工作量" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <el-select v-model="form.fullCover" placeholder="请选择" style="width: 135px" size="mini">
                  <el-option v-for="item in optionsCover" :key="item.costId" :label="item.costName" :value="item.costId" />
                </el-select>
              </div>
              <div v-if="form.fullCover == '0'" style="display: inline-block">
                <span>
                  覆盖权重：
                  <el-tooltip class="item" effect="dark" content="权重越大，越接近全覆盖，排班所需的人数就越多。" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <el-select v-model="form.costU" placeholder="请选择" style="width: 135px" size="mini">
                  <el-option v-for="item in optionsCostU" :key="item.costId" :label="item.costName" :value="item.costId" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <span>
                工作强度:
                <el-tooltip class="item" effect="dark" content="单人在某一时刻可同时进行的工作数量，必须取整，默认为1" placement="bottom">
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
              <el-input v-model="form.workloadModulus" size="mini" placeholder="请输入" style="width: 320px" />
            </el-form-item>
            <div v-if="form.algorithmType == 3">
              <el-form-item>
                <span>
                  规则一对应工作量比例：
                  <el-tooltip class="item" effect="dark" content="设定规则一对应人数比例" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <el-input v-model.number="form.ruleOneCount" size="mini" placeholder="请输入" style="width: 320px" />
              </el-form-item>
              <el-form-item>
                <span>
                  规则二对应工作量比例：
                  <el-tooltip class="item" effect="dark" content="设定规则二对应人数比例" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <el-input v-model.number="form.ruleTwoCount" size="mini" placeholder="请输入" style="width: 320px" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="basebtn">
          <div v-show="methodShow == 1" class="btn">
            <el-button v-if="loadingCal" :loading="loading" type="primary" size="mini" @click="reCalculationBtn(form)">重新生成</el-button>
            <el-button v-else type="primary" size="mini" @click="stopCalculate">停止计算</el-button>
          </div>
          <div v-show="methodShow == 2" class="btn margin">
            <el-button type="primary" size="mini" @click="dialogVisibleAdd = true">添加排班表</el-button>
          </div>
          <!-- <div v-show="methodShow==1||methodShow==2" class="btn">
            <el-button type="info" size="mini" @click="exportCsvEvent">导出</el-button>
          </div>-->
          <div v-show="methodShow == 1 || methodShow == 2" class="btn">
            <el-button type="info" size="mini" @click="coverChart">覆盖与KPI</el-button>
          </div>
          <!-- <div v-show="methodShow==1" class="btn">
            <el-button type="primary" size="mini" @click="stopCalculate">停止计算</el-button>
          </div>-->
        </div>
        <!-- <div class="basebtn">
          <div v-show="methodShow==1" class="btn">
            <el-button type="primary" size="mini" @click="stopCalculate">停止计算</el-button>
          </div>
        </div>-->
      </el-col>
    </el-row>
    <!--添加排班表 -->
    <el-dialog v-dialogDrag title="添加排班表" :visible.sync="dialogVisibleAdd" width="30%" top="8%">
      <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排班表名:" prop="days">
          <el-input v-model="numberValidateForm.rosterSettingName" autocomplete="off" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button size="small" type="primary" @click="commit('numberValidateForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { algorithmStatuses, reCalculation, subRosters, stopCalculate } from '@/apiNew/schedule'
export default {
  name: 'PanelGroup',
  props: ['methodShow', 'rosterSettingVersionId', 'employeeTypeId', 'initData', 'rosterSettingId'],
  data() {
    return {
      loadingCal: true,
      pickerOptions: {
        disabledDate: (time) => {
          const beginDateVal = this.initData.beginDate
          const endDateVal = this.initData.endDate
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 86400000 || new Date(endDateVal).getTime() < time.getTime()
            // return time.getTime() < new Date(beginDateVal).getTime() - 86400000
          }
        }
      },
      checked: false,
      isDisabled: true,
      optionsCostU: [
        { costId: '0.5', costName: '0.5' },
        { costId: '1', costName: '1' },
        { costId: '3', costName: '3' },
        { costId: '5', costName: '5' },
        { costId: '7', costName: '7' },
        { costId: '9', costName: '9' },
        { costId: '10', costName: '10' },
        { costId: '100', costName: '100' },
        { costId: '1000', costName: '1000' }
      ],
      optionsCover: [
        { costId: 0, costName: '非全覆盖' },
        { costId: 1, costName: '全覆盖' }
      ],
      form: {
        beginDate: '',
        endDate: '',
        costU: '',
        fullCover: '',
        staffNumber: '',
        workloadModulus: null,
        ruleOneCount: '',
        ruleTwoCount: ''
      },
      schedulelist: [],
      numberValidateForm: {
        rosterSettingName: '',
        rosterSettingVersionId: '',
        employeeTypeId: ''
      },
      dialogVisibleAdd: false,
      loading: false,
      loadingtext: '',
      timer: '',
      bombtype: ''
    }
  },
  watch: {
    initData: {
      handler: function () {
        this.form = {
          beginDate: this.initData.beginDate,
          endDate: this.initData.endDate,
          costU: this.initData.weights,
          type: this.initData.type,
          fullCover: this.initData.fullCover,
          staffNumber: this.initData.staffNumber,
          workloadModulus: this.initData.workloadModulus,
          ruleTwoCount: this.initData.ruleTwoCount,
          ruleOneCount: this.initData.ruleOneCount,
          algorithmType: this.initData.algorithmType
        }
        if (this.form.staffNumber) {
          this.checked = true
          this.isDisabled = false
        } else {
          this.checked = false
          this.isDisabled = true
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query.method === '1') {
      this.status()
    }
  },
  methods: {
    stopCalculate() {
      this.loadingCal = true
      stopCalculate()
        .then((response) => {
          clearInterval(this.timer)
          this.loading = false
          this.$emit('loadingCal', false)
          this.$message.success('停止成功')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    openNext() {
      this.$router.push({ path: '/prepare/workRulesNew', query: { id: this.initData.id, businessDomain: this.$route.query.businessDomainId || '' } })
    },
    openNext1() {
      this.$router.push({ path: '/prepare/workloadNew', query: { id: this.initData.id, businessDomain: this.$route.query.businessDomainId || '' } })
    },
    handleClick(tab, event) {
      this.status() // 状态轮询
    },
    reCalculationBtn(form) {
      this.loadingCal = false
      // 重新生成
      this.form.id = this.rosterSettingVersionId
      reCalculation(this.form).then((response) => {
        this.$emit('loadingCal', true)
        this.status()
      })
    },

    checkedChange(e) {
      if (e) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
        this.form.staffNumber = 0
      }
    },
    status() {
      // 论询
      clearInterval(this.timer)
      algorithmStatuses().then((response) => {
        if (response.data) {
          this.$emit('loadingCal', true)
          if (response.data.data.calculateStatus === 'complete') {
            clearInterval(this.timer)
            this.$message({ message: '计算完成', type: 'success' })
            this.loading = false
            this.loadingCal = true
            this.$emit('loadingCal', false)
            this.loadingtext = ''
            this.$emit('initab')
          } else if (response.data.data.calculateStatus === 'calculating') {
            this.timer = setInterval(this.status, 3000)
            this.loading = true
            this.loadingCal = false
            this.loadingtext = '已计算　' + Math.round(response.data.data.duration / 1000) + '　秒'
          } else {
            this.loadingCal = true
          }
          if (response.data.data.calculateStatus === 'exception') {
            clearInterval(this.timer)
            this.loading = false
            this.loadingtext = ''
            this.$emit('loadingCal', false)
            this.$message.error(response.data.data.message)
            // this.$message.error(response.data.message)
          }
        } else {
          // this.timer = setInterval(this.status, 3000)
        }
      })
    },
    coverChart() {
      // 覆盖跳转
      if (this.methodShow == '1') {
        this.$router.push({ path: './scheduleDetails', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, businessDomainId: this.$route.query.businessDomainId } })
      } else if (this.methodShow == '2') {
        this.$router.push({ path: '/prepare/mouldDetails', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, businessDomainId: this.$route.query.businessDomainId } })
      }
    },
    commit(item) {
      // 添加模板排班表
      // console.log(item, 488)
      this.numberValidateForm = {
        id: this.rosterSettingVersionId,
        employeeTypeId: this.employeeTypeId,
        name: this.numberValidateForm.rosterSettingName
      }
      subRosters(this.numberValidateForm).then((response) => {
        if (this.employeeTypeId) {
          this.$emit('initNew')
          this.dialogVisibleAdd = false
        } else {
          this.$message.error('没有对应员工类型，不能添加')
        }
      })
    },
    exportCsvEvent() {
      // 导出
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/roster/' + this.rosterSettingVersionId + '/export'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 2px;
}
.isUsed {
  display: inline-block;
}
.title {
  font-size: 20px;
  margin-top: 0;
}
.topmeu {
  color: #fff;
  font-size: 14px;
  h4 {
    margin: 5px;
  }
  span {
    cursor: pointer;
    margin: 0 10px;
    i,
    svg {
      color: #8291bd;
    }
  }
  div.col {
    display: inline-block;
    text-align: center;
    p {
      padding: 0 10px;
    }
    div.bg {
      background: #2d3a5e;
    }
  }
}
.demonstration {
  margin: 20px 0;
}

.baseInfo {
  padding: 5px 10px;
  background: #151c3a;
  margin-bottom: 2px;
  display: inline-block;
  width: 100%;
  min-height: 95px;
  height: 83%;
}
.basebtn {
  display: inline-block;
  .margin.btn {
    margin-top: 26px;
  }
  .btn {
    margin: 5px;
  }
}
</style>
<style scoped>
.baseInfo >>> .el-form-item__content {
  line-height: 32px;
}
</style>
