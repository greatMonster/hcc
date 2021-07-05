<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div v-if="offon">添加或编辑技能</div>
        <div v-if="!offon">本页面只可浏览，如要编辑请至各业务模块下操作</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button v-if="offon" type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="skillName" label="名称" />
        <el-table-column prop="skillDesc" label="描述" />
        <el-table-column prop="skillName" label="技能类型">
          <template slot-scope="scope">{{ scope.row.skillType==='GROUP'?'班组技能':'员工技能' }}</template>
        </el-table-column>
        <el-table-column v-if="offon" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" @close="closeDialog('formEdit')">
        <el-form ref="formEdit" :model="formEdit" :rules="formRules">
          <el-form-item prop="skillName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.skillName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="skillDesc" label="描述：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.skillDesc" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="skillType" label="技能类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.skillType" size="small" filterable placeholder="请选择" style="width:220px">
              <el-option v-for="item in optionsSkill" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="skillCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.skillCode" placeholder="请输入" />
          </el-form-item>-->
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
import { skill, add, remove, set, skillSearch } from '@/api/skill'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      airport: this.$store.state.user.airport,
      optionsSkill: [
        { typeId: 'GROUP', typeName: '班组技能' },
        { typeId: 'PERSONAL', typeName: '员工技能' }
      ],
      rowId: '',
      title: '',
      offon: false,
      editSkillVisible: false,
      formLabelWidth: '120px',
      skillShowTable: [],
      formEdit: { skillName: '', skillDesc: '', skillCode: '', skillId: '' },
      formRules: {
        skillName: [{ required: true, message: '请输入技能名称', trigger: 'blur' }],
        skillDesc: [{ required: true, message: '请输入技能描述', trigger: 'blur' }],
        skillType: [{ required: true, message: '请选择技能类型', trigger: 'blur' }]
        // skillCode: [{ required: true, message: '请输入技能编码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.skill()
      }

    }
  },
  created() {
    if (this.$route.query.businessDomainId) {
      this.offon = true
    }

    this.skill()
    // this.skillOptions()
  },
  methods: {
    // skillOptions() {
    //   skillSearch()
    //     .then(response => {
    //       this.optionsSkill = response.data
    //     })
    //     .catch(e => {
    //       this.$message({
    //         type: 'error',
    //         message: e.response.data.message
    //       })
    //     })
    // },
    printClick() {},
    importClick() {},
    skill() {
      var data = {
        businessDomainId: this.$route.query.businessDomainId || '',
        airportId: this.airport.airportId
      }
      skill(data).then(response => {
        this.skillShowTable = response.data
      })
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.editSkillVisible = true
    },

    // 修改行数据按钮
    editHandleClick(index, row) {
      this.rowId = row.skillId
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
      // this.formEdit.skillName = row.skillName
      // this.formEdit.skillDesc = row.skillDesc
      // this.formEdit.skillCode = row.skillCode
      // // this.formEdit.skillId = row.skillId
      // this.formEdit.skillType = row.skillType
    },
    edituserbleClick() {},
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '修改') {
            var data2 = {
              businessDomainId: this.$route.query.businessDomainId || '',
              skillName: this.formEdit.skillName,
              skillDesc: this.formEdit.skillDesc,
              skillCode: this.formEdit.skillCode,
              skillId: this.rowId,
              airportId: this.airport.airportId,
              skillType: this.formEdit.skillType
            }
            set(data2).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.skill()
              }
            })
            this.editSkillVisible = false
            this.$refs[formName].resetFields()
          } else {
            var data = {
              businessDomainId: this.$route.query.businessDomainId || '',
              airportId: this.airport.airportId,
              skillName: this.formEdit.skillName,
              skillDesc: this.formEdit.skillDesc,
              skillCode: this.formEdit.skillCode,
              skillType: this.formEdit.skillType
            }
            add(data).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.skill()
              }
            })
            this.editSkillVisible = false
            this.$refs[formName].resetFields()
          }
        } else {
        //   console.log('error submit!!')
          return false
        }
      })
    },
    open(index, row) {
      var data2 = {
        skillId: row.skillId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then(response => {
            if (response.code === '200') {
              this.skill()
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {})
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
