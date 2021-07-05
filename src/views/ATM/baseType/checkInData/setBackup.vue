<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>值机柜台资源预测基础数据修改</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
        <div class="importExcel">
          <el-button size="small" type="info" @click="backpage">返回</el-button>
        </div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe style="width: 100%">
        <el-table-column prop="intlType" label="国际国内" fixed>
          <template slot-scope="scope">
            <div>{{ scope.row.intlType[0] === 'D'? '国内': '国际' }}</div>
            <div v-if="scope.row.intlType[1]">{{ scope.row.intlType[1] === "D"?"国内":"国际" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="carriers" label="承运人">
          <template slot-scope="scope" width="90">
            <div v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="aircraftCodes" label="机型">
          <template slot-scope="scope" width="90">
            <div v-for="(item, index) in scope.row.aircraftCodes" :key="index">{{ item }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="distributionType" label="分布模式" width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.distributionType=='R'">平均分布</div>
            <div v-else>二项分布</div>
          </template>
        </el-table-column>
        <el-table-column prop="passRate" label="处理速率 (人/小时)" />
        <el-table-column prop="loadRate" label="客座率 (%)">
          <template slot-scope="scope" width="90">{{ scope.row.loadRate }}</template>
        </el-table-column>
        <el-table-column prop="skipRate" label="通程率 (%)" width="90">
          <template slot-scope="scope">{{ scope.row.skipRate }}</template>
        </el-table-column>
        <el-table-column prop="selfServiceRate" label="自助值机率 (%)">
          <template slot-scope="scope">{{ scope.row.selfServiceRate }}</template>
        </el-table-column>
        <el-table-column prop="peak" label="客流峰值时间" width="150">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.timeAndPeakBeans" :key="index">
              <span>{{ item.binomialPeak }} &nbsp;{{ item.time[0] }}--{{ item.time[1] }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="preArrival" label="旅客提前到达时间（分钟）" />
        <el-table-column prop="lastArrival" label="旅客到达截止时间（分钟）" />
        <el-table-column prop="maximumLatency" label="最大等待时间（分钟）" />
        <el-table-column prop="gateTimeScale" label="柜台最小开放时间" />
        <el-table-column prop="luggageRate" label="需托运行李占比（%）">
          <template slot-scope="scope">{{ scope.row.luggageRate }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="deleteClick(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="50%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="intlType" label="国际国内：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.intlType" multiple placeholder="请选择" @change="intltypeChange">
              <el-option v-for="item in options" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="carriers" label="承运人：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.carriers" multiple placeholder="请选择">
              <el-option v-for="item in carrierOptions" :key="item.carrierCode" :label="item.carrierName" :value="item.carrierCode" />
            </el-select>
          </el-form-item>
          <el-form-item prop="aircraftCodes" label="机 型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.aircraftCodes" multiple placeholder="请选择">
              <el-option v-for="item in planeTypeOptions" :key="item.aircraftCode" :label="item.aircraftName" :value="item.aircraftCode" />
            </el-select>
          </el-form-item>
          <el-form-item prop="distributionType" label="分布模式：" :label-width="formLabelWidth" required>
            <el-select v-model="formEdit.distributionType" placeholder="请选择" @change="distributionChange">
              <el-option v-for="item in disoptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
            <i class="el-icon-question help-icon" title="设定旅客流量的分布模式，不同模式对应的客流量分布不同" />
          </el-form-item>
          <div v-if="peakShow">
            <div v-for="(item, index1) in formEdit.timeAndPeakBeans" :key="index1">
              <el-form-item :prop="'binomialPeak'+index1" :label="'客流峰值时间' + index1 + ':'" :label-width="formLabelWidth">
                <el-input-number v-model="item.binomialPeak" :step="1" :min="0.1" />
                <el-time-picker v-model="item.time" arrow-control="true" clearable format="HH:mm" value-format="HH:mm" is-range range-separator="|" start-placeholder="起飞开始时间" end-placeholder="起飞结束时间" placeholder="选择时间范围" />
                <el-button v-if="item.isAdd" type="primary" size="small" @click="handleAddPeak">添加</el-button>
                <!-- <i class="el-icon-question help-icon" title="设定旅客流量的分布模式，不同模式对应的客流量分布不同" /> -->
                <el-button v-if="item.isDelete" type="primary" size="small" @click="handleDeletePeak(index1)">删除</el-button>
              </el-form-item>
            </div>
          </div>
          <el-form-item prop="passRate" label="处理速率（人/小时）：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.passRate" :step="1" :min="1" />
            <i class="el-icon-question help-icon" title="每小时处理办理值机的人数" />
          </el-form-item>
          <el-form-item prop="loadRate" label="客座率(%)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.loadRate" :step="1" :min="1" :max="100" />
          </el-form-item>
          <el-form-item prop="skipRate" label="通程率(%)：" :label-width="formLabelWidth" required>
            <el-input-number v-model="formEdit.skipRate" :step="1" :min="1" :max="100" />
          </el-form-item>
          <el-form-item prop="preArrival" label="旅客提前到达时间(分钟)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.preArrival" :step="1" :min="1" />
            <i class="el-icon-question help-icon" title="设定航班起飞前旅客提前多少分钟可以开始办理值机,所填需大于60" />
          </el-form-item>
          <el-form-item prop="lastArrival" label="旅客到达截止时间(分钟)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.lastArrival" :step="1" :min="1" />
            <i class="el-icon-question help-icon" title="设定航班起飞前多少分钟无法办理值机" />
          </el-form-item>
          <el-form-item prop="maximumLatency" label="最大排队时间(分钟)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.maximumLatency" :step="1" :min="1" />
            <i class="el-icon-question help-icon" title="设定旅客办理值机的最大排队时间" />
          </el-form-item>
          <el-form-item prop="gateTimeScalevalue" label="柜台最小开放时间(分钟)：" :label-width="formLabelWidth">
            <el-radio-group v-for="item in gateTimeScale" :key="item.id" v-model="formEdit.gateTimeScalevalue" @change="toggleTab(item.id)">
              <el-radio :label="item.name" />
            </el-radio-group>
            <i class="el-icon-question help-icon" title="设定柜台的最小开闭粒度" />
          </el-form-item>
          <el-form-item prop="selfServiceRate" label="自助值机率(%)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.selfServiceRate" :step="1" :min="1" :max="100" />
          </el-form-item>
          <el-form-item prop="luggageRate" label="需托运行李占比(%)：" :label-width="formLabelWidth">
            <el-input-number v-model="formEdit.luggageRate" :step="1" :min="1" :max="100" />
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
import { initData, insertData, updateData, deleteData, carriers, planeType } from '@/api/checkInData'
import dayjs from 'dayjs'
export default {
  name: 'SkillAdmin',
  data() {
    var validateEnd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('截止到达时间不能为空'))
      }
      if (value >= this.formEdit.preArrival) {
        callback(new Error('截止到达时间必须小于提前到达时间'))
      } else {
        callback()
      }
    }
    return {
      peakShow: false,
      remark: '',
      currentDate: '',
      // dutyPerson: '',
      dutyStartTime: '',
      dutyEndTime: '',
      currentTime: dayjs(),
      startTime: dayjs()
        .subtract(5, 'hour')
        .toString(),
      objectClass: {
        deskOpenclass: false,
        deskclose: false,
        deskclass: false
      },
      loading: false,
      intlType: '',
      regions: [
        { name: '国内经济', region: 'D' },
        { name: '国际经济', region: 'I' },
        { name: '高端', region: 'D/I' }
      ],
      list: [],
      deskRegion: 'D',
      serviceType: 'C',
      index: '',
      disabled: false,
      flag: '',
      // gateTimeScalevalue: '',
      gateTimeScale: [
        { name: '0.5小时', id: '30' },
        { name: '1小时', id: '60' },
        { name: '1.5小时', id: '90' },
        { name: '2小时', id: '120' }
      ],
      rowId: '',
      title: '',
      editSkillVisible: false,
      formLabelWidth: '190px',
      skillShowTable: [],
      carrierOptions: [],
      planeTypeOptions: [],
      formEdit: {},
      options: [
        { skillId: 'D', skillName: '国内' },
        { skillId: 'I', skillName: '国际' }
      ],
      disoptions: [
        { value: '二项分布', id: 'B' },
        { value: '平均分布', id: 'R' }
      ],
      rules: {
        passRate: [
          { trigger: 'blur', required: true, message: '不能为空' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1且为整数的数字' }
        ],
        carriers: [{ required: true, message: '不能为空', trigger: 'change' }],
        aircraftCodes: [{ required: true, message: '不能为空', trigger: 'change' }],
        leaveTime: [{ required: true, message: '不能为空' }],
        loadRate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        peak: [{ required: true, message: '不能为空' }],
        skipRate: [{ required: true, message: '不能为空' }],
        intlType: [{ required: true, message: '不能为空', trigger: 'change' }],
        selfServiceRate: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1的数字' }
        ],
        distributionType: [{ required: true, message: '不能为空', trigger: 'change' }],
        gateTimeScalevalue: [{ required: true, message: '不能为空', trigger: 'change' }],
        lastArrival: [
          { required: true, validator: validateEnd },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1且为整数的数字' }
        ],
        preArrival: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[6-9][0-9]|[1-9]\d{2,}/g, message: '请输入大于60的数字' }
        ],
        maximumLatency: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1的数字' }
        ],
        luggageRate: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1的数字' }
        ]
      }
    }
  },
  created() {
    this.initData()
    this.carriers()
    this.aircraftCodes()
  },
  methods: {
    intltypeChange(e) {
      this.formEdit.intlType = e
    //   console.log(e, 666)
    },
    backpage() {
      this.$router.go(-1)
    },
    ischange(e) {
      this.flag = false
    },
    initData() {
      var data = {
        siteId: this.$route.query.siteId || 10
      }
      initData(data).then(response => {
        this.skillShowTable = response.data
      })
    },
    carriers() {
      var data = {
        siteId: this.$route.query.siteId
      }
      carriers(data).then(response => {
        if (response.code === '200') {
          this.carrierOptions = response.data
        } else {
          this.$message.error(response.message)
        }
      })
    },
    aircraftCodes() {
      var data = {
        siteId: this.$route.query.siteId
      }
      planeType(data).then(response => {
        if (response.code === '200') {
          this.planeTypeOptions = response.data
        } else {
          this.$message.error(response.message)
        }
      })
    },
    toggleTab(item) {
    //   console.log(this.formEdit.gateTimeScalevalue, 7777)
      // this.formEdit.gateTimeScalevalue = item
    },
    distributionChange(item) {
      if (item === 'R') {
        this.peakShow = false
        this.formEdit.timeAndPeakBeans = []
      } else {
        this.formEdit.timeAndPeakBeans = [{ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: true, isDelete: false }]
        this.peakShow = true
      }
    },
    handleAddPeak() {
      this.formEdit.timeAndPeakBeans.push({ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: false, isDelete: true })
    },
    handleDeletePeak(index) {
      this.formEdit.timeAndPeakBeans.splice(index, 1)
    },
    // 添加按钮
    addSkillClick(formName) {
      this.title = '添加'
      this.peakShow = false
      this.formEdit = {
        timeAndPeakBeans: [{ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: true, isDelete: false }],
        carriers: [],
        intlType: [],
        aircraftCodes: []
      }
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.index = row.checkInBaseDataId
      this.formEdit.gateTimeScalevalue = row.gateTimeScale
      // row.gateTimeScalevalue = row.gateTimeScale
      row.timeAndPeakBeans[0].isAdd = true
      for (let i = 1; i < row.timeAndPeakBeans.length; i++) {
        row.timeAndPeakBeans[i].isDelete = true
      }
      this.formEdit = Object.assign({}, row)
      if (row.distributionType === 'R') {
        this.peakShow = false
      } else {
        this.peakShow = true
      }
      if (row.gateTimeScale === '60') {
        this.formEdit.gateTimeScalevalue = '1小时'
      } else if (row.gateTimeScale === '90') {
        this.formEdit.gateTimeScalevalue = '1.5小时'
      } else if (row.gateTimeScale === '30') {
        this.formEdit.gateTimeScalevalue = '0.5小时'
      } else if (row.gateTimeScale === '120') {
        this.formEdit.gateTimeScalevalue = '2小时'
      }
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.formEdit.gateTimeScalevalue === '1小时') {
        this.formEdit.gateTimeScale = 60
      } else if (this.formEdit.gateTimeScalevalue === '1.5小时') {
        this.formEdit.gateTimeScale = 90
      } else if (this.formEdit.gateTimeScalevalue === '0.5小时') {
        this.formEdit.gateTimeScale = 30
      } else if (this.formEdit.gateTimeScalevalue === '2小时') {
        this.formEdit.gateTimeScale = 120
      }
      if (this.formEdit.timeAndPeakBeans.length !== 0) {
        var valueCha = this.formEdit.preArrival - this.formEdit.lastArrival
        for (let i = 0; i < this.formEdit.timeAndPeakBeans.length; i++) {
          if (this.formEdit.timeAndPeakBeans[i].binomialPeak > valueCha) {
            this.$message.error('客流峰值时间必须小于提前到达时间减去截止到达时间的值！')
            return false
          }
        }
      }
      if (this.title === '修改') {
        this.$refs.formEdit.validate(valid => {
          if (valid) {
            updateData(this.formEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功')
                this.initData()
              } else {
                this.$message.error(response.message)
              }
            })
            this.editSkillVisible = false
          } else {
            return false
          }
        })
        // this.$router.push({ path: '/dispatching/securityChannel/securityChannel' })
      } else {
        console.log(this.formEdit)
        this.formEdit.siteId = this.$route.query.siteId || 10
        this.$refs.formEdit.validate(valid => {
          if (valid) {
            insertData(this.formEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功')
                this.initData()
              } else {
                this.$message.error(response.message)
              }
            })
            this.editSkillVisible = false
          } else {
            return false
          }
        })
      }
    },
    deleteClick(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteData({ checkInBaseDataId: row.checkInBaseDataId }).then(response => {
            if (response.code === '200') {
              this.initData()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-right: 10px;
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

ul {
  margin: 10px;
  padding: 0;
  min-height: 200px;
}
li {
  margin-bottom: 10px;
  list-style: none;
  display: flex;
  background: #232c47;
  div.left {
    background: #172449;
    text-align: center;
    margin-right: 10px;
    position: relative;
    flex: 1;
    span {
      position: absolute;
      left: 0;
      top: 50%;
      bottom: 0;
      right: 0;
      margin-top: -10px;
    }
  }
  div.right {
    padding: 10px;
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    flex: 20;
    .item {
      position: relative;
      /* // border-bottom: 1px solid #62697e; */
      p {
        margin: 5px;
        font-size: 12px;
        border-radius: 3px;
        color: #737b91;
      }
      div {
        cursor: pointer;
        border-radius: 3px;
        /* // border: 3px solid #87a054; */
        width: 70px;
        height: 50px;
        text-align: center;
        margin: 10px 8px 0 8px;
        align-items: center;
        display: flex;
        justify-content: center;
        &.deskOpenclass {
          // background: #87a054;
          // color: #fff;
          color: #87a054;
          border: 2px solid #87a054;
          font-weight: bold;
        }
        &.deskclose {
          // background: #b99f70;
          // color: #fff;
          color: #b99f70;
          border: 2px solid #b99f70;
          font-weight: bold;
        }
        &.deskclass {
          // background: #babbbf;
          // color: #666;
          color: #babbbf;
          border: 2px solid #babbbf;
          font-weight: bold;
        }
      }
    }
  }
}
// }
.open {
  width: 10px;
  height: 10px;
  background: #87a054;
  display: inline-block;
  border-radius: 3px;
}
.open2 {
  width: 10px;
  height: 10px;
  background: #b99f70;
  display: inline-block;
  border-radius: 3px;
}
.close {
  width: 10px;
  height: 10px;
  background: #babbbf;
  display: inline-block;
  border-radius: 3px;
}
.help-icon {
  font-size: 16px;
  color: #6faee0;
  cursor: pointer;
}
</style>
