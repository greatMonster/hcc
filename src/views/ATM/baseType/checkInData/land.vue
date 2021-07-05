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
          <el-button type="primary" size="small" @click="addSkillClick('checkInIsLandVO')">新增</el-button>
        </span>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="code" label="名称" />
        <!-- <el-table-column prop="id" label="编码" /> -->
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
        <el-form ref="checkInIsLandVO" :model="checkInIsLandVO" :rules="rules">
          <el-form-item prop="code" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="checkInIsLandVO.code" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item prop="id" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="checkInIsLandVO.id" placeholder="请输入" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('checkInIsLandVO')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initTable, updateLand } from '@/apiNew/land'
import { initData as terminalData } from '@/api/terminal'
import { removeIsland, addIsland } from '@/api/basecheckinData'
export default {
  name: 'Land',
  data() {
    return {
      airportId: '',
      optionsSiteId: [],
      siteId: '',
      title: '',
      editSkillVisible: false,
      optionsAirport: [],
      formLabelWidth: '150px',
      skillShowTable: [],
      checkInIsLandVO: {},
      options: [
        { Id: 'D', Name: '国内' },
        { Id: 'I', Name: '国际' }
      ],
      options2: [],
      index: '',
      rules: {
        code: [{ required: true, message: '不能为空' }],
        id: [{ required: true, message: '不能为空' }]
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
            this.skillShowTable = response.data.data
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
      this.checkInIsLandVO = {}
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.index = row.id
      this.checkInIsLandVO = Object.assign({}, { code: row.code, id: row.id })
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      this.checkInIsLandVO.airportId = this.airport.airportId
      this.checkInIsLandVO.terminalId = this.siteId
      this.$refs['checkInIsLandVO'].validate((valid) => {
        // this.checkInIsLandVO.islandId = landId
        if (valid) {
          if (this.title === '修改') {
            updateLand(this.checkInIsLandVO)
              .then((response) => {
                // if (response.code === '200') {
                this.initable()
                this.$message.success('修改成功')
                // }
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
            addIsland(this.checkInIsLandVO)
              .then((response) => {
                if (response.data.code === 'ok') {
                  this.$message.success('新增成功')
                  this.initable()
                  this.editSkillVisible = false
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
        airportId: this.airportId,
        terminalId: this.siteId,
        islandId: row.id
      }
      if (row.containDesk) {
        this.$confirm('此操作将删除该岛以及其下的所有柜台，确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            removeIsland(data)
              .then((response) => {
                if (response.data.code === 'ok') {
                  this.initable()
                  this.$message({
                    type: 'success',
                    message: '删除成功'
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
          .catch(() => {})
      } else {
        removeIsland(data)
          .then((response) => {
            if (response.data.code === 'ok') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
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
