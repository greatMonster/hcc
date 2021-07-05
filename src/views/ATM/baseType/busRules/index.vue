<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>摆渡车派工规则</div>
        <div class="print">
          <el-button type="info" :loading="loading" @click="feriyBusTaskbtn">生成任务</el-button>
        </div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div> -->
        <!-- <div class="importExcel">
          <el-button size="small" type="info" @click="backpage">返回</el-button>
        </div> -->
      </div>
      <!-- <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div> -->
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="busType" label="车辆类型">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.busType=='bigBus'">大摆渡</div>
            <div v-if="scope.row.busType=='otherBus'"> 北方/COBUS2700</div>
          </template> -->
        </el-table-column>
        <el-table-column prop="flightType" label="航班类型">
          <template slot-scope="scope">
            <div v-if="scope.row.flightType=='A'">进港</div>
            <div v-if="scope.row.flightType=='D'"> 出港</div>
          </template>
        </el-table-column>
        <el-table-column prop="referconTime" label="参照时间" />
        <el-table-column prop="inPlace" label="到位时间" />
        <el-table-column prop="inPlaceInterval" label="到位间隔时间(分钟)" />
        <el-table-column prop="departure" label="发车时间" />
        <el-table-column prop="departureInterval" label="发车间隔时间(分钟)" />
        <el-table-column prop="lastBusDeparture" label="末班车发车时间" />
        <el-table-column prop="guestHonour" label="上客时间" />
        <el-table-column prop="lastInPlace" label="最晚到位时间" />
        <el-table-column label="操作" width="160">
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
        <el-form ref="formEdit" :model="formEdit" :rules="rules" :label-width="formLabelWidth">
          <el-form-item prop="busType" label="车辆类型：">
            <el-select v-model="formEdit.busType" placeholder="请选择">
              <el-option
                v-for="(item,index) in busTypeOption"
                :key="index"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型：">
            <el-select v-model="formEdit.flightType" placeholder="请选择">
              <el-option
                v-for="(item,index) in flightOption"
                :key="index"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="referconTime" label="参照时间：">
            <el-input v-model="formEdit.referconTime" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlace" label="到位时间：">
            <el-input v-model="formEdit.inPlace" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="inPlaceInterval" label="到位间隔时间(分钟)：">
            <el-input v-model="formEdit.lastArrival" placeholder="请输入" :disabled="formEdit.lastArrival?false:true" />
          </el-form-item>
          <el-form-item prop="departure" label="发车时间：">
            <el-input v-model="formEdit.departure" placeholder="请输入" :disabled="formEdit.departure?false:true" />
          </el-form-item>
          <el-form-item prop="departureInterval" label="发车间隔时间(分钟)：">
            <el-input v-model="formEdit.departureInterval" placeholder="请输入" :disabled="formEdit.departureInterval?false:true" />
          </el-form-item>
          <el-form-item prop="lastBusDeparture" label="末班车发车时间：">
            <el-input v-model="formEdit.lastBusDeparture" placeholder="请输入" :disabled="formEdit.lastBusDeparture?false:true" />
          </el-form-item>
          <el-form-item prop="guestHonour" label="上客时间：">
            <el-input v-model="formEdit.guestHonour" placeholder="请输入" :disabled="formEdit.guestHonour?false:true" />
          </el-form-item>
          <el-form-item prop="lastInPlace" label="最晚到位时间：">
            <el-input v-model="formEdit.lastInPlace" placeholder="请输入" :disabled="formEdit.lastInPlace?false:true" />
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
import { init, updateFeriyBusRules, feriyBusTask } from '@/api/busRules'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      loading: false,
      busTypeOption: [{ value: '大摆渡', id: 'bigBus' }, { value: '北方/COBUS2700', id: 'otherBus' }],
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
      init().then(response => {
        this.skillShowTable = response.data
      })
    },
    feriyBusTaskbtn() {
      this.loading = true
      feriyBusTask().then(response => {
        this.loading = false
      })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
    //   console.log(row, 1212)
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
