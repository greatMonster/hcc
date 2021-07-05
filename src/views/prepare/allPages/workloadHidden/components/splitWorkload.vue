<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="(item,index) in splitData" :key="index" :name="item.name" :label="item.label">
      <el-form ref="ruleForm" :rules="rules" :model="item.ruleForm" label-width="150px" class="formstyle">
        <el-form-item label="时间段：" required>
          <el-col :span="11">
            <el-form-item prop="from">
              <el-time-select v-model="item.ruleForm.from" placeholder="起始时间" :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="to">
              <el-time-select v-model="item.ruleForm.to" placeholder="结束时间" :picker-options="{ start: '00:00', step: '00:15', end: '24:00', minTime: item.ruleForm.from }" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="拆分模式：" prop="mode">
          <el-select v-model="item.ruleForm.mode" placeholder="请选择">
            <el-option label="水平拆分" value="line" />
            <el-option label="弧形拆分" value="arc" />
          </el-select>
        </el-form-item>
        <el-form-item label="切割工作量：" prop="num">
          <el-input v-model.number="item.ruleForm.num" style="width:200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm',index)">立即拆分</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { skill, cut } from '@/api/workload'
export default {
  name: 'SplitWorkload',
  props: {
    documentId: {
      type: String,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      splitData: [],
      activeName: '1',
      rules: {
        from: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        to: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        mode: [
          { required: true, message: '请选择拆分模式', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  created() {
    this.getSkill()
  },
  methods: {
    resetForm() {
      this.$parent.dialogTableVisibleSplit = true
    },
    handleClick() {},
    getSkill() {
      skill(this.documentId).then(response => {
        response.data.forEach(element => {
          this.splitData.push({
            label: element.skillName,
            name: element.skillId.toString(),
            ruleForm: {}})
        })
        this.activeName = this.splitData[0].name
      })
    },
    submitForm(formName, index) {
      this.$refs[formName][index].validate((valid) => {
        if (valid) {
          var data = []
          this.splitData.forEach(element => {
            if (Object.keys(element.ruleForm).length > 3) {
              data.push({
                'documentId': this.documentId,
                'mode': element.ruleForm.mode,
                'from': element.ruleForm.from,
                'to': element.ruleForm.to,
                'num': element.ruleForm.num,
                'skillId': element.name
              })
            }
          })
          cut(data).then(response => {
            if (response.code === '200') {
              this.$parent.dialogTableVisibleSplit = true
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$router.push({ path: '/prepare/allPages/workload' })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
