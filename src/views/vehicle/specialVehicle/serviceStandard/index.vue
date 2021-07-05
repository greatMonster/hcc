<template>
  <div class="skillBox">
    <div class="title">
      <div>摆渡车派工规则</div>
    </div>
    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="busType" label="车辆类型" />
        <el-table-column prop="flightType" label="航班类型">
          <template slot-scope="scope">
            <div v-if="scope.row.flightType=='A'">进港</div>
            <div v-if="scope.row.flightType=='D'"> 出港</div>
          </template>
        </el-table-column>
        <el-table-column prop="referconTime" label="参照时间" />
        <el-table-column prop="inPlace" label="到位时间(分钟)" />
        <el-table-column prop="inPlaceInterval" label="到位间隔时间(分钟)" />
        <el-table-column prop="departure" label="发车时间(分钟)" />
        <el-table-column prop="departureInterval" label="发车间隔时间(分钟)" />
        <el-table-column prop="lastBusDeparture" label="末班车发车时间(分钟)" />
        <el-table-column prop="guestHonour" label="上客时间(分钟)" />
        <el-table-column prop="lastInPlace" label="最晚到位时间(分钟)" />
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules" :label-width="formLabelWidth" size="small">
          <el-form-item prop="busType" label="车辆类型">
            <el-select v-model="formEdit.busType" placeholder="请选择" :disabled="true">
              <el-option
                v-for="(item,index) in busTypeOption"
                :key="index"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型">
            <el-select v-model="formEdit.flightType" placeholder="请选择">
              <el-option
                v-for="(item,index) in flightOption"
                :key="index"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="referconTime" label="参照时间">
            <el-input v-model="formEdit.referconTime" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlace" label="到位时间(分钟)">
            <el-input v-model="formEdit.inPlace" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlaceInterval" label="到位间隔时间(分钟)">
            <el-input v-model="formEdit.lastArrival" placeholder="请输入" :disabled="formEdit.lastArrival?false:true" />
          </el-form-item>
          <el-form-item prop="departure" label="发车时间(分钟)">
            <el-input v-model="formEdit.departure" placeholder="请输入" :disabled="formEdit.departure?false:true" />
          </el-form-item>
          <el-form-item prop="departureInterval" label="发车间隔时间(分钟)">
            <el-input v-model="formEdit.departureInterval" placeholder="请输入" :disabled="formEdit.departureInterval?false:true" />
          </el-form-item>
          <el-form-item prop="lastBusDeparture" label="末班车发车时间(分钟)">
            <el-input v-model="formEdit.lastBusDeparture" placeholder="请输入" :disabled="formEdit.lastBusDeparture?false:true" />
          </el-form-item>
          <el-form-item prop="guestHonour" label="上客时间(分钟)">
            <el-input v-model="formEdit.guestHonour" placeholder="请输入" :disabled="formEdit.guestHonour?false:true" />
          </el-form-item>
          <el-form-item prop="lastInPlace" label="最晚到位时间(分钟)">
            <el-input v-model="formEdit.lastInPlace" placeholder="请输入" :disabled="formEdit.lastInPlace?false:true" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { updateFeriyBusRules } from '@/api/busRules'
import { query, updateFeriyBusRules } from '@/apiNew/vehicle'

export default {
  name: 'SkillAdmin',
  data() {
    return {
      loading: false,
      busTypeOption: [],
      flightOption: [{ value: '进港', id: 'A' }, { value: '出港', id: 'D' }],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '200px',
      skillShowTable: [],
      formEdit: {},
      rules: {
        load: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initable()
  },
  methods: {
    initable() {
      query().then(response => {
        this.skillShowTable = response.data.data
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
      if (this.title === '修改') {
        updateFeriyBusRules(this.formEdit).then(response => {
          this.initable()
        })
        this.editSkillVisible = false
      }
    }
  }
}
</script>
<style scoped>
.el-radio-group{
  margin-right:10px;
}
form {
padding-right:10%;
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
