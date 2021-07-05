<template>
  <div class="body">
    <p class="title">
      <i class="el-icon-setting" /> 资源测算配置
    </p>
    <div class="box-item">
      <p class="title">
        <!-- <el-button v-if="disabled" size="mini" type="primary" @click="onStop()">停止计算</el-button> -->
      </p>
      <el-form ref="form" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" :model="form" :rules="rules" label-width="20%" :element-loading-text="loadingtext">
        <el-form-item prop="workloadDocumentId" label="工作量文件：">
          <el-select v-model="form.workloadDocumentId" placeholder="请选择工作量文档">
            <el-option v-for="item in workloadDocOptions" :key="item.workloadDocumentId" :label="item.name" :value="item.workloadDocumentId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="rulesetDocumentId" label="出勤规则文件：">
          <el-select v-model="form.rulesetDocumentId" placeholder="请选择工作规则文档">
            <el-option v-for="item in workRulesDocOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="costU" label="覆盖权重:">
          <el-input v-model="form.costU" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="fullCover" label="全覆盖:">
          <el-radio v-model="form.fullCover" label="0">非全覆盖</el-radio>
          <el-radio v-model="form.fullCover" label="1">全覆盖</el-radio>
        </el-form-item>
        <el-form-item prop="shiftPlanName" label="请输入文件名称:">
          <el-input v-model="form.shiftPlanName" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:21%;" class="btnTop" type="primary" @click="onSubmit('form')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="rightbox">
        <div class="box-item">
          <p class="title">优化配置</p>
          <div class="item">
            <p>最小成本：</p>
            <cssRuleTop />
            <el-slider v-model="value1" :step="20" show-stops @change="show(value1)" />
            <p>员工过剩：</p>
            <cssRuleTop />
            <el-slider v-model="value2" :step="20" show-stops @change="show(value2)" />
            <p>员工不足：</p>
            <cssRuleTop />
            <el-slider v-model="value3" :step="20" show-stops @change="show(value3)" />
            <p>偏好优先：</p>
            <cssRuleTop />
            <el-slider v-model="value4" :step="20" show-stops @change="show(value4)" />
            <p />
          </div>
        </div>
    </div>-->
    <!-- <div class="footer">
        <el-button type="primary" @click="onSubmit('form')">确认创建</el-button>
    </div>-->
  </div>
</template>
<script>
import { initTable, initNewTable } from '@/api/setWorkRules'
import { generateShiftPlan } from '@/api/makeShiftPlan'

// import cssRuleTop from '@/components/cssRule/cssRuleTop.vue'
export default {
  components: {
    // cssRuleTop
  },
  data() {
    return {
      disabled: false,
      loading: false,
      loadingtext: '',
      form: {
        workloadDocumentId: '',
        rulesetDocumentId: '',
        costU: '',
        fullCover: '1',
        shiftPlanName: ''
      },
      workloadDocOptions: [],
      workRulesDocOptions: [],
      optimizeDocOptions: [
        {
          value: '1',
          label: '速度最优'
        },
        {
          value: '2',
          label: '速度优先'
        },
        {
          value: '3',
          label: '均衡模式'
        },
        {
          value: '4',
          label: '搜索结果优先'
        },
        {
          value: '5',
          label: '搜索结果最优'
        }
      ],
      arithmeticConfigOptions: [
        {
          value: '1',
          label: '人员不足最优'
        },
        {
          value: '2',
          label: '人员不足偏好'
        },
        {
          value: '3',
          label: '均衡模式'
        },
        {
          value: '4',
          label: '人员过剩偏好'
        },
        {
          value: '5',
          label: '人员过剩最优'
        },
        {
          value: '6',
          label: '全覆盖'
        }
      ],
      businessDomain: this.$route.query.businessDomain || '',
      shiftPlanDocumentId: '',
      shiftPlanSettingId: '',
      timer: '',
      rules: {
        workloadDocumentId: [{ required: true, message: '请选择', trigger: 'change' }],
        rulesetDocumentId: [{ required: true, message: '请选择', trigger: 'change' }],
        costU: [{ required: true, message: '请选择', trigger: 'change' }],
        costO: [{ required: true, message: '请选择', trigger: 'change' }],
        fullCover: [{ required: true, message: '请选择', trigger: 'change' }],
        shiftPlanName: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      startTime: '',
      endTime: '',
      id: '',
      timerID: '' // 时钟初始值
    }
  },
  watch: {},
  created() {
    this.workload()
    this.workRules()
    // this.byLoop()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    workload() {
      // 工作量下拉
      initNewTable(this.businessDomain).then(response => {
        this.workloadDocOptions = response.data.data
      })
    },
    workRules() {
      // 出勤规则文件下拉
      var data = {
        documentType: 'RULESET',
        id: this.businessDomain
      }
      initTable(data).then(response => {
        console.log(response.data.data, 6667)
        this.workRulesDocOptions = response.data.data
      })
    },
    // byLoop() {
    //   // 轮状态
    //   clearInterval(this.timer)
    //   byLoop().then(response => {
    //     if (response.data) {
    //       if (response.data.calculateStatus === 'complete') {
    //         clearInterval(this.timer)
    //         this.$message.success('创建成功')
    //         this.documentId = response.data.shiftPlanDocumentId
    //         this.shiftPlanDocumentId2 = response.data.shiftPlanDocumentId
    //         this.$router.push({ path: '/prepare/allPages/shiftResultHidden', query: { shiftPlanDocumentId: response.data.shiftPlanDocumentId }})
    //       }
    //       if (response.data.calculateStatus === 'calculating') {
    //         this.timer = setInterval(this.byLoop, 3000)
    //         this.loading = true
    //         this.loadingtext = '已计算　' + response.data.duration / 1000 + '　秒'
    //         this.disabled = true
    //       }
    //       if (response.data.calculateStatus === 'exception') {
    //         clearInterval(this.timer)
    //         this.loading = false
    //         this.loadingtext = ''
    //         this.$message.error(response.data.message)
    //       }
    //       if (response.data.calculateStatus === 'interrupt') {
    //         clearInterval(this.timer)
    //         this.loading = false
    //         this.loadingtext = ''
    //         this.disabled = false
    //       }
    //     }
    //   })
    // },
    // onStop() {
    //   stop().then(response => {
    //     this.$message.error(response.message)
    //   })
    // },
    onSubmit(form) {
      // 点创建按钮
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.id = this.businessDomain
          generateShiftPlan(this.form)
            .then(response => {
              if (response.data.code === '200') {
                this.$router.push({ path: '/prepare/allPages/shiftResultHidden', query: { shiftPlanDocumentId: response.data.data } })
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch(e => {
              this.$message.error(e.response.data.message)
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 30px;
  .el-select,
  .el-input {
    width: 50%;
  }
}
.title {
  font-size: 20px;
  margin-top: 0;
  padding-top: 10px;
}
.addBtn button {
  padding: 7px 11px;
  margin-left: 0;
}
.btnTop {
  margin-top: 30px;
}

.box-item {
  width: 100%;
  // border: 1px solid #8a91aa;
  margin-bottom: 20px;
  color: #fff;
  div.item {
    padding: 0 30px;
    p {
      font-size: 14px;
    }
  }
  p.title {
    // background: #caceda;
    padding: 5px 10px;
    font-size: 15px;
    color: #0a142f;
    margin: 0;
  }
  .demonstration {
    font-size: 15px;
  }
  form {
    padding: 38px;
  }
}
.footer {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 5px 50px;
  margin-top: 20px;
}
</style>
