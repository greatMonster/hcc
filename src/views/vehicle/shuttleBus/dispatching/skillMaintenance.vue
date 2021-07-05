<template>
  <div class="body">
    <p class="title">
      <i class="el-icon-setting" /> 技能维护配置
    </p>
    <div class="box-item">

      <el-form ref="form" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" :model="form" :rules="rules" label-width="20%" :element-loading-text="loadingtext" style="">
        <el-form-item prop="tenantName" label="租户">
          <el-input v-model="form.tenantName" class="special" disabled size="small" type="text" />
        </el-form-item>
        <el-form-item prop="skillId" label="技能维护">
          <el-select v-model="form.skillIds" placeholder="请选择技能" multiple collapse-tags>
            <el-option v-for="item in skillOptions" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:21%;" class="btnTop" type="primary" @click="onSubmit('form')">创 建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { skill, saveData } from '@/api/staffOverview'
export default {
  data() {
    return {
      disabled: false,
      loading: false,
      loadingtext: '',
      form: {
        tenantName: '无锡',
        skillIds: []
      },
      skillOptions: [],
      businessDomain: '',
      rules: {
        workloadDocumentId: [{ required: true, message: '请选择', trigger: 'change' }],
        rulesetDocumentId: [{ required: true, message: '请选择', trigger: 'change' }],
        fullCover: [{ required: true, message: '请选择', trigger: 'change' }],
        shiftPlanName: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      startTime: '',
      endTime: '',
      timerID: '' // 时钟初始值
    }
  },
  watch: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      // 工作量下拉
      skill(this.businessDomain).then(response => {
        this.skillOptions = response.data
      })
    },

    onSubmit(form) {
      // 点创建按钮
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.tenantId = 1
          saveData(this.form).then(res => {
            if (res.data.code === '200') {
              this.$message.success(res.data.message)
              this.$router.push({ path: '/vehicle/shuttleBus/dispatching' })
            }
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
