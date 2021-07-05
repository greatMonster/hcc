<template>
  <div v-loading="loading" style="width: 68%; margin: 0 auto">
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="排班表名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入" style="width: " size="mini" />
      </el-form-item>
      <el-form-item label="开始日期：" prop="beginDate">
        <el-date-picker v-model="form.beginDate" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" size="mini" />
      </el-form-item>
      <el-form-item label="结束日期：" prop="endDate">
        <el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" size="mini" />
      </el-form-item>
      <el-form-item v-if="methodShow == '1'" label="是否复制员工数据：" prop="type">
        <div class="isUsed">
          <el-checkbox v-model="checked" checked="checked" @change="checkedChange" />
        </div>
      </el-form-item>
      <el-form-item v-if="!checked" label="请选择目标员工类型">
        <div class="isUsed">
          <el-select v-model="form.employeeTypeId" placeholder="请选择" style="width: " size="mini">
            <el-option v-for="item in employeeType" :key="item.id.toString()" :label="item.name" :value="item.id.toString()" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="footer">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" type="primary" @click="commit('form')">应 用</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { employeeTypes, previewData, modePreviewData } from '@/apiNew/schedule'
export default {
  name: 'CopyShift',
  props: ['addemployeeData', 'initData', 'itemdata', 'methodShow'],
  data() {
    return {
    //   pickerOptions: {
    //     disabledDate: (time) => {
    //       const beginDateVal = this.initData.endDate
    //       // const beginDateVal = this.form.beginDate
    //       if (beginDateVal) {
    //         return new Date(beginDateVal).getTime() > time.getTime()
    //       }
    //     }
    //   },
      checked: true,
      employeeType: [],
      form: {
        name: '',
        beginDate: '',
        endDate: '',
        employeeTypeId: ''
      },
      dialogVisibleAdd: false,
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        beginDate: [{ type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }],
        endDate: [{ type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }]
      }
    }
  },
  watch: {
    addemployeeData: {
      handler: function() {
        this.employeeType = this.addemployeeData
      },
      deep: true
    },
    initData: {
      handler: function() {
        this.form = {
          beginDate: new Date(dayjs(this.initData.endDate).add(1, 'day'))
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    checkedChange(e) {
      if (!e) {
        if (this.addemployeeData.length === 0) {
          employeeTypes(this.initData.workloadId).then((response) => {
            this.employeeType = response.data.data
          })
        }
      }
    },
    cancel() {
      this.$emit('success', false)
    },
    commit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.methodShow == '1') {
            this.form.employee = this.checked === true ? '1' : '0'
            this.form.id = this.itemdata[0].id
            previewData(this.form)
              .then((response) => {
                this.$router.push({ path: './copy', query: { rosterSettingVersionId: this.$route.query.rosterSettingVersionId, businessDomainId: this.$route.query.businessDomainId }})
                this.$emit('success', false)
                sessionStorage.setItem('previewData', JSON.stringify(response.data.data))
                sessionStorage.setItem('previewDataForm', JSON.stringify(this.form))
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          } else {
            this.form.id = this.$route.query.rosterSettingVersionId
            modePreviewData(this.form)
              .then((response) => {
                this.$emit('success', false)
                this.$message.success('复制成功')
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message || '500，服务器错误'
                })
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  .el-button {
    margin: 20px 10px 0 0;
  }
}
.el-form-item {
  margin-bottom: 10px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-select,
.isUsed {
  width: 100%;
}
.isUsed {
  display: inline-block;
}
.title {
  font-size: 20px;
  margin-top: 0;
}
</style>
