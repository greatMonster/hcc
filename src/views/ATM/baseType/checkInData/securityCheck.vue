<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <span style="padding-left: 20px">
          <label>航站楼&nbsp;&nbsp;&nbsp;</label>
          <el-select v-model="siteId" placeholder="请选择" style="width: 150px" size="small">
            <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </span>
        <span style="padding-left: 20px">
          <el-button type="primary" size="small" @click="initable">查 询</el-button>
          <el-button type="primary" size="small" @click="addSkillClick('checkInIsData')">新增</el-button>
        </span>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="securityDomainName" label="名称" />
        <!-- <el-table-column prop="securityDomainCode" label="编码" /> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="checkInIsData" :model="checkInIsData" :rules="rules">
          <el-form-item prop="securityDomainName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="checkInIsData.securityDomainName" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item prop="securityDomainCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="checkInIsData.securityDomainCode" placeholder="请输入" />
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('checkInIsData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData as terminalData } from '@/api/terminal'
import { initTable, updateFcn, addDataFcn, removeData } from '@/apiNew/securityCheck'
export default {
  name: 'Land',
  data() {
    return {
      airportId: '',
      securityDomainId: '',
      optionsSiteId: [],
      siteId: '',
      title: '',
      editSkillVisible: false,
      optionsAirport: [],
      formLabelWidth: '150px',
      tableData: [],
      checkInIsData: {},
      options2: [],
      index: '',
      rules: {
        securityDomainName: [{ required: true, message: '不能为空' }],
        securityDomainCode: [{ required: true, message: '不能为空' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initterminal()
      }

    }
  },
  created() {
    this.initterminal()
  },
  methods: {
    initterminal() {
      terminalData(this.airport.airportId).then(res => {
        if (res.data.code === '200') {
          this.optionsSiteId = res.data.data
          this.siteId = this.optionsSiteId[0].id
          this.initable()
        }
      })
    },
    backpage() {
      this.$router.go(-1)
    },
    initable() {
      var data = {
        terminalId: this.siteId,
        airportId: this.airport.airportId
      }
      if (this.siteId) {
        initTable(data)
          .then((response) => {
            this.tableData = response.data.data
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else {
        this.$message.warning('请选择航站楼')
      }
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.checkInIsData = {}
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.securityDomainId = row.securityDomainId
      this.checkInIsData = Object.assign({}, { securityDomainName: row.securityDomainName, securityDomainCode: row.securityDomainCode })
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      this.checkInIsData.airportId = this.airport.airportId
      this.checkInIsData.terminalId = this.siteId
      this.checkInIsData.securityDomainId = this.securityDomainId
      this.$refs['checkInIsData'].validate((valid) => {
        if (valid) {
          if (this.title === '修改') {
            updateFcn(this.checkInIsData)
              .then((response) => {
                if (response.data.code === '200') {
                  this.initable()
                  this.$message.success('修改成功')
                } else {
                  this.$message({
                    type: 'error',
                    message: response.data.message
                  })
                }
                this.$refs[formName].resetFields()
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
            this.editSkillVisible = false
          } else {
            addDataFcn(this.checkInIsData)
              .then((response) => {
                if (response.data.code === '200') {
                  this.$message.success('新增成功')
                  this.initable()
                  this.editSkillVisible = false
                } else {
                  this.$message({
                    type: 'error',
                    message: response.data.message
                  })
                }
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        }
      })
    },
    open(index, row) {
      var data = {
        securityDomainId: row.securityDomainId
      }
      this.$confirm('此操作将删除该岛以及其下的所有柜台，确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        removeData(data)
          .then((response) => {
            if (response.data.code === '200') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      })
    }
  }
}
// }
</script>
<style scoped>
form {
  margin-top: 20px;
}

.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
}
.titleWord {
  width: 80%;
  display: flex;
  align-items: center;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
</style>
