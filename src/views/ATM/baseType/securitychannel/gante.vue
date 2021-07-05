<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>安检通道甘特 基础数据 修改</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div> -->
        <div class="importExcel">
          <el-button type="info" @click="backpage">返回上一页</el-button>
        </div>
      </div>
      <!-- <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div> -->
    </div>

    <div class="skillShow">
      <el-table
        :data="skillShowTable"
        border
        stripe
      >
        <!-- <el-table-column prop="totalUltRatio" label="工时率" /> -->
        <el-table-column prop="hrMin" label="员工最短工作时间(小时)" />
        <el-table-column prop="hrMax" label="员工最长工作时间(小时)" />
        <el-table-column prop="timeStep" label="员工最短休息时间(小时)" />
        <!-- <el-table-column prop="shiftMax" label="全天最大工作时间(小时)" /> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <!-- <el-button type="primary" size="mini" @click="open(scope.$index,scope.row)">删 除</el-button> -->
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
          <!-- <el-form-item prop="totalUltRatio" label="工时率：" :label-width="formLabelWidth">
            <el-radio-group v-for="item in totalUltRatios" :key="item.id" v-model="totalUltRatiovalue" @change="changeUltRatiov(item)">
              <el-radio :label="item.name" :value="item.id" />
            </el-radio-group>
          </el-form-item> -->
          <el-form-item prop="hrMax" label="员工最长工作时间：" :label-width="formLabelWidth">
            <!-- <el-input v-model="formEdit.hrMax" placeholder="请输入" /> -->
            <el-input-number v-model="formEdit.hrMax" :precision="1" :step="0.5" :min="1.5" :max="100" />
          </el-form-item>
          <el-form-item prop="timeStep" label="员工最短休息时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.timeStep" :precision="1" :step="0.5" :min="0.5" :max="1" />
          </el-form-item>
          <!-- <el-form-item prop="shiftMax" label="全天最大工作时间：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.shiftMax" placeholder="请输入" />
          </el-form-item> -->
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
import { initablegt, addgt, setgt } from '@/api/securitychannel'
export default {
  name: 'SecurityChannelganteATM',
  data() {
    return {
      timesteps: [{ value: '0.5', id: '0.5' }, { value: '1', id: '1' }, { value: '1.5', id: '1.5' }, { value: '2', id: '2' }
      ],
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
        hrMin: [
          { required: true, message: '不能为空' }
        ],
        hrMax: [
          { required: true, message: '不能为空' }
        ],
        timeStep: [
          { required: true, message: '不能为空' }
        ],
        shiftMax: [
          { required: true, message: '不能为空' }
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
    ischange(e) {
    //   console.log(e, 777)
      this.flag = false
    },
    initable() {
      initablegt().then(response => {
        this.skillShowTable = response.data
      })
    },
    change(item) {
      if (item) {
        this.formEdit.gateTimeScale = item
      }
    },
    // 添加按钮
    // addSkillClick() {
    //   this.title = '添加'
    //   this.editSkillVisible = true
    // },
    // 修改行数据按钮
    editHandleClick(index, row) {
    //   console.log(row, 777)
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
      if (row.totalUltRatio === 70) {
        this.totalUltRatiovalue = '70%'
      } else {
        this.totalUltRatiovalue = '75%'
      }
    },
    changeUltRatiov(item) {
      this.totalUltRatioid = item.id // 用于计算
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        if (this.totalUltRatioid === '70') {
          this.formEdit.hrMin = 1
          this.formEdit.totalUltRatio = 70
        } else if (this.totalUltRatioid === '75') {
          this.formEdit.hrMin = 1.5
          this.formEdit.totalUltRatio = 75
        }
        // this.formEdit.hrMin = this.formEdit.timeStep / (1 - this.totalUltRatioid / 100) * this.totalUltRatioid / 100 // 计算最短工时率
        // console.log(this.formEdit.hrMin, 999)
        setgt(this.formEdit).then(response => {
          this.initable()
        })
        this.editSkillVisible = false
        // this.$router.push({ path: '/dispatching/securityChannel/securityChannel' })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addgt(this.formEdit).then(response => {
              this.initable()
            })
            this.editSkillVisible = false
          }
        })
      }
    }
    // open(index, row) {
    //   var data2 = {
    //     'baseDataId': row.baseDataId
    //   }
    //   this.$confirm('确认删除这条数据吗？', '提示', {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消'
    //   }).then(() => {
    //     removegt(data2).then(response => {
    //       if (response.code === '200') {
    //         this.initable()
    //       }
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功'
    //       })
    //     })
    //   }).catch(() => {

    //   })
    // }
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
