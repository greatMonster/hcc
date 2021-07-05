<template>
  <div class="skillBox">
    <div class="title">
      <div>摆渡车派工作业标准</div>
    </div>
    <div class="add-button">
      <el-button type="primary" size="small" @click="addClick('formEdit')">添加</el-button>
    </div>
    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="flightType" label="航班类型">
          <template slot-scope="scope">
            <div v-if="scope.row.flightType == 'A'">进港</div>
            <div v-if="scope.row.flightType == 'D'">出港</div>
          </template>
        </el-table-column>
        <el-table-column prop="referconTime" label="参照时间" />
        <el-table-column prop="inPlace" label="到位时间(分钟)" />
        <el-table-column prop="inPlaceInterval" label="到位间隔时间(分钟)" />
        <el-table-column prop="departure" label="发车时间(分钟)" />
        <el-table-column prop="departureInterval" label="发车间隔时间(分钟)" />
        <el-table-column prop="lastBusDeparture" label="末班车发车时间(分钟)" />
        <el-table-column prop="lastInPlace" label="最晚到位时间(分钟)" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="deleteHandleClick(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules" :label-width="formLabelWidth" size="small">
          <el-form-item prop="binLayoutId" label="名称">
            <el-select v-model="formEdit.binLayoutId" placeholder="请选择">
              <el-option v-for="(item, index) in busTypeOption" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型">
            <el-select v-model="formEdit.flightType" placeholder="请选择">
              <el-option v-for="(item, index) in flightOption" :key="index" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="referconTime" label="参照时间">
            <el-input v-model="formEdit.referconTime" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlace" label="到位时间(分钟)">
            <el-input v-model="formEdit.inPlace" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlaceInterval" label="到位间隔时间(分钟)">
            <!-- <el-input v-model="formEdit.lastArrival" placeholder="请输入" :disabled="formEdit.lastArrival?false:true" /> -->
            <el-input v-model="formEdit.inPlaceInterval" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="departure" label="发车时间(分钟)">
            <!-- <el-input v-model="formEdit.departure" placeholder="请输入" :disabled="formEdit.departure?false:true" /> -->
            <el-input v-model="formEdit.departure" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="departureInterval" label="发车间隔时间(分钟)">
            <!-- <el-input v-model="formEdit.departureInterval" placeholder="请输入" :disabled="formEdit.departureInterval?false:true" /> -->
            <el-input v-model="formEdit.departureInterval" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="lastBusDeparture" label="末班车发车时间(分钟)">
            <!-- <el-input v-model="formEdit.lastBusDeparture" placeholder="请输入" :disabled="formEdit.lastBusDeparture?false:true" /> -->
            <el-input v-model="formEdit.lastBusDeparture" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="lastInPlace" label="最晚到位时间(分钟)">
            <!-- <el-input v-model="formEdit.lastInPlace" placeholder="请输入" :disabled="formEdit.lastInPlace?false:true" /> -->
            <el-input v-model="formEdit.lastInPlace" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { queryNew, updateFeriyBusRulesNew, remove, add } from '@/apiNew/vehicle'
import { query } from '@/apiNew/busRelated'

export default {
  name: 'SkillAdmin',
  data() {
    return {
      airport: this.$store.state.user.airport,
      loading: false,
      busTypeOption: [],
      flightOption: [
        { value: '进港', id: 'A' },
        { value: '出港', id: 'D' }
      ],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '200px',
      skillShowTable: [],
      formEdit: {},
      rules: {
        load: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initable()
    this.busTypeList()
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initTable()
        this.busType()
      }
    }
  },
  methods: {
    busTypeList() {
      query().then((response) => {
        this.busTypeOption = response.data.data
      })
    },
    initable() {
      const data = {
        airportId: this.airport.airportId
      }
      queryNew(data).then((response) => {
        this.skillShowTable = response.data.data
      })
    },
    addClick(formName) {
      this.title = '添加'
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
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
      this.formEdit.airportId = this.airport.airportId
      if (this.title === '修改') {
        updateFeriyBusRulesNew(this.formEdit)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.initable()
            this.editSkillVisible = false
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      } else {
        // 添加操作
        add(this.formEdit)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.initable()
            this.editSkillVisible = false
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      }
    },
    deleteHandleClick(index, row) {
      var data2 = {
        id: row.id
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2)
            .then((response) => {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
.el-radio-group {
  margin-right: 10px;
}
.add-button {
  float: right;
  margin-right: 5px;
  margin-bottom: 10px;
}
form {
  padding-right: 10%;
}
.title {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  background-color: #0a142f;
}
.print {
  margin-left: 10%;
}
</style>
