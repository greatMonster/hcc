<template>
  <div class="body">
    <div class="title">以下用于席位计算的设置。</div>
    <div class="ruleBox">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item prop="seatNumber" label="席位总人数：" :label-width="formLabelWidth">
          <el-input v-model.number="form.seatNumber" placeholder="只能输入数字" style="width:180px" />
        </el-form-item>
        <el-form-item prop="monitorNum" label="席位最大监控同时起飞/降落飞机数：" :label-width="formLabelWidth">
          <el-input v-model.number="form.monitorNum" placeholder="只能输入数字" style="width:180px" />
        </el-form-item>
        <el-form-item prop="stopNum" label="最大停留飞机监控数量：" :label-width="formLabelWidth">
          <el-input v-model.number="form.stopNum" placeholder="只能输入数字" style="width:180px" />
        </el-form-item>
        <el-form-item prop="seatIntensity" label="席位最大工作强度：" :label-width="formLabelWidth">
          <el-input v-model.number="form.seatIntensity" placeholder="只能输入数字" style="width:180px" />
        </el-form-item>
        <el-form-item prop="Departures" label="进出港：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.Departures">
            <el-radio :label="true">进港</el-radio>
            <el-radio :label="false">出港</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="ruleBox1 buttonStyle">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button style="margin-left:40px" @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { initSet, edit } from '@/api/seatSet'
export default {
  name: 'SeatSet',
  data() {
    return {
      formLabelWidth: '300px',
      form: { },
      rules: {
        seatNumber: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        stopNum: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        monitorNum: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ],
        seatIntensity: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ]
      }
    }
  },
  created() {
    this.initSet()
  },
  methods: {
    initSet() {
      initSet().then(response => {
        if (response.data) {
          this.form = response.data
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          edit(this.form).then(response => {
            if (response.code === '200') {
              this.$router.push({ path: '/dispatching/seat/seatgante' })
            }
          })
        }
      })
    },
    resetForm() {
      this.form = {}
    }
  }
}
</script>
<style scoped>
.body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #232c47;
  box-sizing: border-box;
  padding: 30px;
  color: white;
  font-size: 14px;
      margin-top: 60px;
}
.title {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.ruleBox {
  width: 85%;
  height: 100%;
  margin-top: 25px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px;
  border: 3px solid #434b61;
}
.ruleBox1 {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 5px;
  display: flex;
  align-items: center;
}
.title1 {
  width: 280px;
  height: 60px;
  display: flex;
  align-items: center;
}
.input1 {
  margin-left: 50px;
}
.buttonStyle {
  display: flex;
  justify-content: center;
}
</style>
