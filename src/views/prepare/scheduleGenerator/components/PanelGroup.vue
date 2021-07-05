<template>
  <div class="topmeu">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <div v-if="activeName== 'index'">
          <div class="topmeu">
            <div class="col">
              <p>
                <span @click="exportCsvEvent">
                  <i class="el-icon-download" /> 导出
                </span>
              </p>
            </div>
            <!-- <el-input v-model="search" size="small" style="width:130px;margin:0 10px 0 30px" placeholder />
            <el-button size="mini" type="primary" @click="nameSearch">查询</el-button>-->
          </div>
        </div>
        <div v-if="activeName== 'PB'">
          <div v-loading="loading" class="topmeu" :element-loading-text="loadingtext" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <div v-show="methodShow==1" class="col">
              <p>
                <!-- <span @click="startScheduling"><i class="el-icon-refresh" /> 运行排班</span> -->
                <span @click="dialogVisibleSet2">
                  <i class="el-icon-setting" /> 排班设置
                </span>
                <span @click="coverChart">
                  <i class="el-icon-share" /> 覆盖和KPI
                </span>
              </p>
            </div>
            <div v-show="methodShow==2" class="col">
              <p>
                <span @click="dialogVisibleAdd = true">
                  <i class="el-icon-share" /> 添加排班表
                </span>
                <span @click="addemployeedialog">
                  <i class="el-icon-s-custom" /> 添加员工类型
                </span>
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 排班设置 -->
    <el-dialog v-dialogDrag title="排班设置" :visible.sync="dialogVisibleSet" width="40%" :modal-append-to-body="false">
      <p class="title">
        <i class="el-icon-setting" /> 排班设置
      </p>
      <div>
        <div class="leftbox">
          <div class="box-item">
            <p class="title">配制/优化目标</p>
            <el-form ref="form" :model="form" label-width="250px">
              <el-form-item>
                <div slot="label">
                  排班表生成的持续时长(天):
                  <el-tooltip class="item" effect="dark" content="来源是通过新建排班表时选择的工作量文件里设置的时间，可修改但不可越界" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
                <el-input v-model="form.nday" />
              </el-form-item>
              <el-form-item>
                <div slot="label">
                  排班表在轮班规划中开始时的天数:
                  <el-tooltip class="item" effect="dark" content="从工作量的第几天开始排班" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
                <el-input v-model="form.startDate" />
              </el-form-item>
              <el-form-item>
                <div slot="label">
                  限定人数:
                  <el-tooltip class="item" effect="dark" content="限定人数是指定多少人排班。注：0是不限定人数" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
                <div class="isUsed">
                  <el-checkbox v-model="checked" @change="checkedChange">启用</el-checkbox>
                  <el-input v-model="form.staffNumber" placeholder="请输入人数" style="width:60%;margin-left: 20px" :disabled="isDisabled" />
                </div>
              </el-form-item>
              <el-form-item>
                <div slot="label">
                  覆盖权重:
                  <el-tooltip class="item" effect="dark" content="权重越高，需要排班的人越多。" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
                <!-- <el-input v-model="form.costU" /> -->
                <el-select v-model="form.costU" placeholder="请选择" style="width:100px" size="medium">
                  <el-option v-for="item in optionsCostU" :key="item.costId" :label="item.costName" :value="item.costId" />
                </el-select>
              </el-form-item>
              <el-form-item prop="fullCover">
                <div slot="label">
                  覆盖模式:
                  <el-tooltip class="item" effect="dark" content="是否覆盖工作量" placement="bottom">
                    <i class="el-icon-question" />
                  </el-tooltip>
                </div>
                <el-radio v-model="form.fullCover" label="0">非全覆盖</el-radio>
                <el-radio v-model="form.fullCover" label="1">全覆盖</el-radio>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogVisibleSet = false">取 消</el-button>
          <el-button type="primary" @click="make(form)">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!--填加员工类型  -->
    <el-dialog v-dialogDrag title="填加员工类型" :visible.sync="employeetypedialog" top="8%" center>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="demo-ruleForm" style="height:600px;">
          <el-form-item label="选择员工类型：" prop="employeeType">
            <el-scrollbar class="tree_scroll">
              <el-table ref="multipleTable" stripe :data="employeeType2" style @selection-change="handleSelectionChange">
                <el-table-column prop="empTypeName" label="员工类型" />
                <el-table-column prop="defaultCount" label="员工数量">
                  <template slot-scope="scope">{{ scope.row.defaultCount }}</template>
                </el-table-column>
                <el-table-column type="selection" width="55" />
              </el-table>
            </el-scrollbar>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <p style="text-align: center;">
        <el-button type="primary" @click="submitData">确 定</el-button>
      </p>
    </el-dialog>
    <!--添加排班表 -->
    <el-dialog v-dialogDrag title="添加排班表" :visible.sync="dialogVisibleAdd" width="30%" top="8%">
      <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排班表名:" prop="days">
          <el-input v-model.number="numberValidateForm.rosterSettingName" autocomplete="off" size="small" />
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
import { make, Status, selectEmployeeType, settingadd, addsetting, name } from '@/api/schedule'
export default {
  name: 'PanelGroup',
  filters: {
    joinDate(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  props: ['methodShow', 'rosterSettingVersionId', 'rosterSettingId', 'rosterMode', 'rosterModeVersion', 'employeeTypeId', 'rosterVersionData'],
  data() {
    return {
      search: '',
      ruleForm: {},
      employeeType2: [], // 添加员工类型
      employeetypedialog: false,
      centerDialogVisible: false,
      checked: false,
      isDisabled: true,
      startTime: '',
      endTime: '',
      tabMapOptions: [{ label: '主页', key: 'index' }, { label: '排班', key: 'PB' }],
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
      activeName: 'index',
      createdTimes: 0,
      dialogVisibleGo: false,
      show: true,
      form: {
        nday: '',
        startDate: '',
        fullCover: '0'
      },
      dialogVisibleSet: false,
      schedulelist: [],
      classes: [{ id: '1', label: '修改时间段' }, { id: '2', label: '删除' }],
      message: '',
      numberValidateForm: {
        rosterSettingName: '',
        rosterSettingVersionId: '',
        employeeTypeId: ''
      },
      visible2: false,
      dialogVisible: false,
      dialogVisibleAdd: false,
      loading: false,
      loadingtext: '',
      timer: '',
      bombtype: ''
    }
  },
  watch: {
    rosterMode: {
      handler: function() {
        this.schedulelist = this.rosterMode
      },
      deep: true,
      immediate: true
    },
    rosterVersionData: {
      handler: function() {
        this.form = this.rosterVersionData
        if (this.form.staffNumber) {
          this.checked = true
          this.isDisabled = false
        } else {
          this.checked = false
          this.isDisabled = true
        }
      },
      deep: true
    }
  },
  created() {},
  methods: {
    // 生成空排班表时的员工类型
    addemployeedialog() {
      this.employeetypedialog = true
      this.selectEmployeeType2()
    },
    selectEmployeeType2() {
      var data = {
        rosterSettingVersionId: this.$route.query.rosterSettingVersionId
      }
      selectEmployeeType(data).then(response => {
        this.employeeType2 = response.data
      })
    },
    handleSelectionChange(val) {
      // 选择员工类型
      this.ruleForm.rosterSettingBeans = []
      this.ruleForm.rosterSettingVersionId = this.rosterSettingVersionId
      val.forEach(element => {
        this.ruleForm.rosterSettingBeans.push({ employeeTypeId: element.employeeTypeId })
      })
    },
    submitData() {
      // 提交
      settingadd(this.ruleForm).then(response => {
        this.employeetypedialog = false
        this.$parent.versionFn()
      })
    },
    handleClick(tab, event) {
      this.activeName = tab.name
      if (tab.name === 'PB' && this.methodShow === 1) {
        this.status() // 状态轮询
      }
    },
    make(form) {
      // 修改配制点生成
      form.rosterSettingVersionId = this.rosterSettingVersionId
      this.form.staffNumber = this.form.staffNumber ? this.form.staffNumber : 0
      if (form.rosterSettingVersionId) {
        make(this.form).then(response => {
          this.status()
        })
        this.dialogVisibleSet = false
      } else {
        this.$message({ message: '请选择向导', type: 'warning' })
      }
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
      Status().then(response => {
        if (response.data) {
          if (response.data.calculateStatus === 'complete') {
            clearInterval(this.timer)
            this.$message({ message: '计算完成', type: 'success' })
            this.loading = false
            this.loadingtext = ''
            this.$parent.init()
            this.dialogVisibleSet = false
          }
          if (response.data.calculateStatus === 'calculating') {
            this.timer = setInterval(this.status, 3000)
            this.loading = true
            this.loadingtext = '已计算　' + Math.round(response.data.duration / 1000) + '　秒'
          }
          if (response.data.calculateStatus === 'exception') {
            clearInterval(this.timer)
            this.loading = false
            this.loadingtext = ''
            this.$message.error(response.data.message)
            this.dialogVisibleSet = false
          }
        } else {
          // this.timer = setInterval(this.status, 3000)
        }
      })
    },
    coverChart() {
      // 覆盖跳转
      this.$router.push({ path: '/prepare/compareDoc', query: { rosterSettingVersionId: this.rosterSettingVersionId }})
    },
    dialogVisibleSet2() {
      // 排班设置
      this.dialogVisibleSet = true
    },
    commit(item) {
      // 添加排班表
      if (!this.employeeTypeId) {
        this.$message.error('请选择排班表')
      }
      this.numberValidateForm.rosterSettingVersionId = this.rosterSettingVersionId
      this.numberValidateForm.employeeTypeId = this.employeeTypeId
      addsetting(this.numberValidateForm).then(response => {
        this.$parent.init()
        this.dialogVisibleAdd = false
      })
    },
    exportCsvEvent() {
      // 导出
      if (!parseInt(this.$route.query.rosterSettingVersionId)) {
        this.$message({ message: '请选择向导' })
        return
      } else {
        window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/roster/empty/export?rosterSettingVersionId=' + parseInt(this.rosterSettingVersionId)
      }
    },
    nameSearch() {
      var data = {
        rosterSettingVersionId: this.rosterSettingVersionId,
        employeeTypeId: this.employeeTypeId,
        name: this.search
      }
      name(data).then(response => {
        this.$parent.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.isUsed {
  display: flex;
}
.title {
  font-size: 20px;
  margin-top: 0;
}
.topmeu {
  color: #fff;
  font-size: 14px;
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
.addBtn button {
  padding: 7px 11px;
  margin-left: 0;
}
.titleT {
  display: block;
  display: block;
  margin: -12px 0px 15px -11px;
  background: #000;
  padding: 6px 19px;
  font-weight: normal;
  font-size: 16px;
}
div.cont {
  width: 90px;
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
    height: 56px;
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
.leftbox,
.rightbox {
  width: 96%;
  display: inline-block;
  vertical-align: top;
  margin: 0 2%;
}
.box-item {
  width: 100%;
  border: 1px solid #8a91aa;
  margin-bottom: 20px;
  p.title {
    background: #caceda;
    padding: 5px 10px;
    font-size: 15px;
    color: #000;
    margin: 0;
  }
  form {
    padding: 25px;
  }
}
</style>
