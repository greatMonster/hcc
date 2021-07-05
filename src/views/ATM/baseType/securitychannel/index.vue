<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>安检通道</div>
        <div class="importExcel">
          <el-button size="small" type="info" @click="backpage">返回</el-button>
        </div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table
        :data="skillShowTable"
        border
        stripe
      >
        <el-table-column prop="securityName" label="名称" />
        <el-table-column prop="securityCode" label="编码" />
        <el-table-column prop="region" label="国内/国际">
          <template slot-scope="scope">
            <span v-if="scope.row.region=='D'">国内</span>
            <span v-if="scope.row.region=='I'">国际</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="securityName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.securityName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="securityCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.securityCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="region" label="国内/国际：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { findall, securityset, securityadd, securityremove } from '@/api/securitychannel'
export default {
  name: 'Land',
  data() {
    return {
      title: '',
      editSkillVisible: false,
      formLabelWidth: '150px',
      skillShowTable: [],
      formEdit: {},
      options: [{ Id: 'D', Name: '国内' }, { Id: 'I', Name: '国际' }],
      options2: [],
      rules: {
        islandName: [
          { required: true, message: '不能为空' }
        ],
        lalandCode: [
          { required: true, message: '不能为空' }
        ],
        islandRegion: [
          { required: true, message: '不能为空' }
        ],
        deskNum: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  created() {
    this.initable()
  },
  methods: {
    backpage() {
      this.$router.go(-1)
    },
    initable() {
      findall().then(response => {
        this.skillShowTable = response.data
      })
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      // this.formEdit.islandName = ''
      // this.formEdit.lalandCode = ''
      // this.formEdit.islandRegion = ''
      // this.formEdit.deskNum = ''
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            securityset(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            securityadd(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        securityremove(row).then(response => {
          if (response.code === '200') {
            this.initable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {

      })
    }
  }
}
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
  width: 50%;
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
