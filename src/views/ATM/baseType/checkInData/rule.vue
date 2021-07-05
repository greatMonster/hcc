<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>值机柜台派工规则修改</div>
        <div class="importExcel">
          <el-button size="small" type="info" @click="backpage">返回</el-button>
        </div>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border>
        <el-table-column prop="hrMin" label="员工最短工作时间(小时)" />
        <el-table-column prop="hrMax" label="员工最长工作时间(小时)" />
        <el-table-column prop="timeStep" label="员工最短休息时间(小时)" />
        <!-- <el-table-column prop="shiftMax" label="全天最大工作时间(小时)" /> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="50%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="hrMin" label="员工最短工作时间(小时)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.hrMin" :precision="1" :step="0.5" :min="0" :max="1" />
          </el-form-item>
          <el-form-item prop="hrMax" label="员工最长工作时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.hrMax" :precision="1" :step="0.5" :min="1.5" :max="100" />
          </el-form-item>
          <el-form-item prop="timeStep" label="员工最短休息时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.timeStep" :precision="1" :step="0.5" :min="0.5" :max="1" />
          </el-form-item>
          <!-- <el-form-item prop="shiftMax" label="全天最大工作时间：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.shiftMax" placeholder="请输入" />
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
import { queryList, updateByPrimaryKeySelective } from '@/api/checkInData'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      timesteps: [{ value: '0.5', id: '0.5' }, { value: '1', id: '1' }, { value: '1.5', id: '1.5' }, { value: '2', id: '2' }],
      totalUltRatioid: '70',
      flag: '',
      totalUltRatiovalue: '75%',
      totalUltRatios: [{ name: '70%', id: '70' }, { name: '75%', id: '75' }],
      rowId: '',
      title: '',
      editSkillVisible: false,
      formLabelWidth: '250px',
      skillShowTable: [],
      formEdit: {},
      options: [{ skillId: 'D', skillName: '国内' }, { skillId: 'I', skillName: '国际' }],
      options2: [],
      rules: {
        hrMin: [{ required: true, message: '不能为空' }],
        hrMax: [{ required: true, message: '不能为空' }],
        timeStep: [{ required: true, message: '不能为空' }],
        shiftMax: [{ required: true, message: '不能为空' }]
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
      var data = {
        siteId: this.$route.query.siteId
      }
      queryList(data).then(response => {
        this.skillShowTable = response.data
      })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      updateByPrimaryKeySelective(this.formEdit).then(response => {
        this.initable()
      })
      this.editSkillVisible = false
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
