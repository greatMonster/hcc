<template>
  <div class="dialog">
    <!--填加员工类型  -->
    <el-scrollbar class="tree_scroll">
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="demo-ruleForm" style="max-height:400px">
        <el-form-item label="选择员工类型：" prop="employeeType">
          <el-table ref="multipleTable" stripe :data="employeeType2" @selection-change="handleSelectionChange">
            <el-table-column prop="name" label="员工类型" />
            <el-table-column prop="defaultCount" label="员工数量">
              <template slot-scope="scope">{{ scope.row.defaultCount }}</template>
            </el-table-column>
            <el-table-column type="selection" width="55" :selectable="selectable" />
          </el-table>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <p style="text-align: center;">
      <el-button type="primary" size="small" @click="submitData">确 定</el-button>
    </p>
  </div>
</template>

<script>
import { addEmployeeType } from '@/apiNew/schedule'
export default {
  filters: {
    joinDate(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['rosterSettingVersionId', 'initData', 'addemployeeData'],
  data() {
    return {
      ruleForm: {},
      employeeType2: [], // 添加员工类型
      workloadId: '',
      multipleSelection: []
    }
  },
  watch: {
    addemployeeData: {
      handler: function() {
        this.employeeType2 = this.addemployeeData
        const id = []
        this.initData.settings.forEach(element => {
          id.push(element.employeeTypeId)
        })
        // this.$nextTick(function() {
        //   this.employeeType2.forEach(row => {
        //     if (id.indexOf(row.id) >= 0) {
        //       row.remark = 'selectable'
        //       this.$refs.multipleTable.toggleRowSelection(row, true)
        //     }
        //   })
        // })
      },
      deep: true
    },
    initData: {
      handler: function() {
        if (this.initData) {
          this.workloadId = this.initData.workloadId
        }
      },
      immediate: true
    }
  },
  mounted() {},
  created() {},
  methods: {
    selectable(row, index) {
      if (row.remark === 'selectable') {
        return false // 禁用状态
      } else {
        return true // 非禁用状态
      }
    },
    submitData() {
      // 提交
      addEmployeeType(this.ruleForm).then(response => {
        this.$emit('success', false)
        this.$emit('initNew')
      })
    },
    handleSelectionChange(val) {
      // 选择员工类型
      this.multipleSelection = val
      this.ruleForm.id = []
      this.ruleForm.rosterSettingVersionId = this.rosterSettingVersionId
      val.forEach(element => {
        this.ruleForm.id.push(element.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  background: #0a142f;
  padding: 0 4px;
  p {
    text-align: center;
    display: inline-block;
    width: 100%;
  }
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
