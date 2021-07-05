<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>安检通道资源预测基础数据修改</div>
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
        <el-table-column prop="intlType" label="国际国内">
          <template slot-scope="scope">
            <div v-if="scope.row.intlType=='D'">
              国内
            </div>
            <div v-else>
              国际
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="distributionType" label="分布模式">
          <template slot-scope="scope">
            <div v-if="scope.row.distributionType=='R'">
              平均分布
            </div>
            <div v-else>
              二项分布
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="passRate" label="处理速率 (分钟/人)" />
        <el-table-column prop="load" label="客座率 (%)">
          <template slot-scope="scope">
            {{ scope.row.load }}
          </template>
        </el-table-column>
        <el-table-column prop="peak" label="航班预测高峰时间 (分钟)">
          <template slot-scope="scope">
            {{ scope.row.peak*60 }}
          </template>
        </el-table-column>
        <el-table-column prop="preArrival" label="旅客提前到达时间" />
        <el-table-column prop="lastArrival" label="旅客到达截止时间" />
        <el-table-column prop="maximumLatency" label="最大等待时间 （分钟）" />
        <el-table-column prop="gateTimeScale" label="通道间隔刻度 (分钟)" />
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
          <el-form-item prop="intlType" label="国际国内：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.intlType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.skillId"
                :label="item.skillName"
                :value="item.skillId"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="distributionType" label="分布模式：" required :label-width="formLabelWidth">
            <el-select v-model="formEdit.distributionType" placeholder="请选择" @change="distributionChange">
              <el-option
                v-for="item in disoptions"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="peak" label="航班预测高峰时间：" :label-width="formLabelWidth">
            <el-input-number v-if="formEdit.intlType =='D'" v-model="formEdit.peak" :disabled="disabled" :precision="1" :step="0.1" :min="0" :max="1" />
            <el-input-number v-if="formEdit.intlType =='I'" v-model="formEdit.peak" :disabled="disabled" :precision="1" :step="0.1" :min="0.1" :max="0.9" />
          </el-form-item>
          <el-form-item prop="passRate" label="处理速率：" :label-width="formLabelWidth">
            <el-input-number v-if="formEdit.intlType =='D'" v-model="formEdit.passRate" :precision="1" :step="0.1" :min="0.7" :max="300" />
            <el-input-number v-if="formEdit.intlType =='I'" v-model="formEdit.passRate" :precision="1" :step="0.1" :min="1" :max="300" />
            <!-- <el-input v-model="formEdit.passRate" placeholder="请输入" @change="ischange" /> -->
          </el-form-item>
          <el-form-item prop="load" label="客座率：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.load" :precision="2" :step="0.01" :min="0.1" :max="1" />
            <!-- <el-input v-model="formEdit.load" placeholder="请输入" /> -->
          </el-form-item>
          <el-form-item prop="preArrival" label="旅客提前到达时间：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.preArrival" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="lastArrival" label="旅客到达截止时间：" required :label-width="formLabelWidth">
            <el-input v-model="formEdit.lastArrival" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="maximumLatency" label="最大等待时间：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.maximumLatency" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="gateTimeScale" label="通道时间刻度：" :label-width="formLabelWidth">
            <el-radio-group v-for="item in gateTimeScale" :key="item.id" v-model="gateTimeScalevalue" @change="toggleTab(item.id)">
              <el-radio :label="item.name" />
            </el-radio-group>
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
import { initable, remove, set } from '@/api/securitychannel'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      disabled: false,
      flag: '',
      gateTimeScalevalue: '',
      gateTimeScale: [{ name: '0.5小时', id: '30' }, { name: '1小时', id: '60' }, { name: '1.5小时', id: '90' }, { name: '2小时', id: '120' }],
      rowId: '',
      title: '',
      editSkillVisible: false,
      formLabelWidth: '150px',
      skillShowTable: [],
      formEdit: {},
      options: [{ skillId: 'D', skillName: '国内' }, { skillId: 'I', skillName: '国际' }],
      disoptions: [{ value: '二项分布', id: 'B' }, { value: '平均分布', id: 'R' }],
      rules: {
        passRate: [
          { required: true, message: '不能为空' }
          // { pattern: /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[7-9]\d{0,})$/, message: '最小输入为0.7' }
        ],
        load: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        peak: [
          { required: true, message: '不能为空' }
        ],
        intlType: [
          { required: true, message: '不能为空' }
        ],
        preArrival: [
          { required: true, message: '不能为空' },
          { pattern: /^[6-9][0-9]|[1-9]\d{2,}/g, message: '大于60的数字' }
        ],
        maximumLatency: [
          { required: true, message: '不能为空' },
          { pattern: /^[0-9]|[0-9]\d{2,}/g, message: '大于0的数字' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    backpage() {
      this.$router.go(-1)
    },
    ischange(e) {
      this.flag = false
    },
    init() {
      var data = {
        intlType: this.$route.query.intlType || '',
        airportId: this.$route.query.airportId || 706
      }

      initable(data).then(response => {
        this.skillShowTable = response.data
      })
    },
    toggleTab(item) {
    //   console.log(item, 7777)
    },
    distributionChange(item) {
      if (item === 'R') {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
    //   console.log(row, 1212)
      // this.rowId = row.securityBaseDataId
      this.title = '修改'
      this.editSkillVisible = true
      this.gateTimeScalevalue = row.gateTimeScale
      this.formEdit = Object.assign({}, row)
      if (row.distributionType === 'R') {
        this.disabled = true
      }
      if (row.gateTimeScale === 60) {
        this.gateTimeScalevalue = '1小时'
      } else if (row.gateTimeScale === 90) {
        this.gateTimeScalevalue = '1.5小时'
      } else if (row.gateTimeScale === 30) {
        this.gateTimeScalevalue = '0.5小时'
      } else if (row.gateTimeScale === 120) {
        this.gateTimeScalevalue = '2小时'
      }
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        if (this.gateTimeScalevalue === '1小时') {
          this.formEdit.gateTimeScale = 60
        } else if (this.gateTimeScalevalue === '1.5小时') {
          this.formEdit.gateTimeScale = 90
        } else if (this.gateTimeScalevalue === '0.5小时') {
          this.formEdit.gateTimeScale = 30
        } else if (this.gateTimeScalevalue === '2小时') {
          this.formEdit.gateTimeScale = 120
        }
        set(this.formEdit).then(response => {
          if (response.code === '200') {
            this.init()
          }
        })
        this.editSkillVisible = false
        // this.$router.push({ path: '/dispatching/securityChannel/securityChannel' })
      }
    },
    open(index, row) {
      var data2 = {
        'securityBaseDataId': row.securityBaseDataId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(data2).then(response => {
          if (response.code === '200') {
            this.init()
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {

      })
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
