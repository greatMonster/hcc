<template>
  <div class="user-box">
    <div class="title">
      <span style="margin-right:10px">基础数据管理</span>
      <el-button size="mini" type="info" @click="backpage">返回</el-button>
    </div>
    <div class="add-user">
      <!-- <div> -->
      <el-button type="primary" size="small" @click="addDeskParam('formDeskEdit')">添加柜台开闭模拟参数</el-button>
      <!-- </div> -->
    </div>
    <el-table :data="tableData" highlight-current-row border stripe :row-key="getRowKeys" :expand-row-keys="expands">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.checkInBaseDetails" align="center" border stripe>
            <el-table-column align="center" prop="distributionType" label="分布模式">
              <template slot-scope="scope">
                <div v-if="scope.row.distributionType">
                  <div v-if="scope.row.distributionType=='R'">平均分布</div>
                  <div v-else>二项分布</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="loadRate" label="客座率（%）" />
            <el-table-column prop="skipRate" label="通程率（%）" />
            <el-table-column prop="selfServiceRate" label="自助值机率（%）" />
            <el-table-column prop="luggageRate" label="需托运行李占比（%）" />
            <el-table-column prop="preArrival" label="旅客提前到达时间（分钟）" />
            <el-table-column prop="lastArrival" label="旅客到达截止时间（分钟）" />
            <el-table-column prop="peak" label="客流峰值时间" width="150">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.timeAndPeakBeans" :key="index">
                  <span>{{ item.binomialPeak }} &nbsp;{{ item.time[0] }}--{{ item.time[1] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editTraverParam(scope.$index,scope.row)">修改</el-button>
                <el-button type="primary" size="mini" @click="deleteTraverParam(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column prop="siteName" label="站点" />
      <el-table-column prop="checkInBaseName" label="基础参数名" />
      <el-table-column prop="intlType" label="国际国内">
        <template slot-scope="scope">
          <div v-if="scope.row.intlType === 'D'">国内</div>
          <div v-else-if="scope.row.intlType === 'I'">国际</div>
          <div v-else>国内/国际</div>
        </template>
      </el-table-column>
      <el-table-column prop="carriers" label="承运人" style="word-b">
        <template slot-scope="scope" width="90">
          <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}&nbsp;&nbsp;</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="高端/经济">
        <template slot-scope="scope">
          <div v-if="scope.row.serviceType === 'V'">高端</div>
          <div v-else-if="scope.row.serviceType === 'C'">经济</div>
          <div v-else>高端/经济</div>
        </template>
      </el-table-column>
      <el-table-column prop="passRate" label="处理速率（人/小时）" />
      <el-table-column prop="maximumLatency" label="最大排队时间（分钟）" />
      <el-table-column prop="gateTimeScale" label="柜台最小开放时间（分钟）" />
      <el-table-column fixed="right" label="操作" width="315">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addTraverParam('formTravelerEdit',scope.row)">添加旅客流量参数</el-button>
          <el-button type="primary" size="mini" @click="editDeskParam(scope.$index,scope.row)">修 改</el-button>
          <el-button type="primary" size="mini" @click="deleteDeskParam(scope.$index,scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑柜台参数弹框 -->
    <div>
      <el-dialog v-dialogDrag :visible.sync="dialogAdd" :title="title" :close-on-press-escape="false">
        <el-form ref="formDeskEdit" :model="formDeskEdit" :rules="rules">
          <el-form-item prop="siteId" label="站点：" :label-width="formLabelWidth">
            <el-select v-model="formDeskEdit.siteId" disabled placeholder="请选择">
              <el-option v-for="item in siteIdOptions" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="checkInBaseName" label="基础参数名:" :label-width="formLabelWidth">
            <el-input v-model="formDeskEdit.checkInBaseName" size="small" style="width:40%" />
          </el-form-item>
          <el-form-item prop="intlType" label="国际国内：" :label-width="formLabelWidth">
            <el-select v-model="formDeskEdit.intlType" placeholder="请选择" @change="intltypeChange">
              <el-option v-for="item in options" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="serviceType" label="高端/经济：" :label-width="formLabelWidth">
            <el-select v-model="formDeskEdit.serviceType" placeholder="请选择">
              <el-option v-for="item in economyTypeOptions" :key="item.economyTypeId" :label="item.economyTypeName" :value="item.economyTypeId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="carriers" label="承运人：" :label-width="formLabelWidth">
            <el-select v-model="formDeskEdit.carriers" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in carrierOptions" :key="item.carrierCode" :label="item.carrierName" :value="item.carrierCode" />
            </el-select>
          </el-form-item>
          <el-form-item prop="passRate" label="处理速率:" :label-width="formLabelWidth">
            <el-input-number v-model="formDeskEdit.passRate" :step="1" :min="1" />&nbsp;人/小时
            <i class="el-icon-question help-icon" title="每小时处理办理值机的人数" />
          </el-form-item>
          <el-form-item prop="maximumLatency" label="最大排队时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formDeskEdit.maximumLatency" :step="1" :min="1" />&nbsp;分钟
            <i class="el-icon-question help-icon" title="设定旅客办理值机的最大排队时间" />
          </el-form-item>
          <el-form-item prop="gateTimeScalevalue" label="柜台最小开放时间：" :label-width="formLabelWidth">
            <el-radio-group v-for="item in gateTimeScale" :key="item.id" v-model="formDeskEdit.gateTimeScalevalue" @change="toggleTab(item.id)">
              <el-radio :label="item.name" />
            </el-radio-group>
            <i class="el-icon-question help-icon" title="设定柜台的最小开闭粒度" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogclose">取 消</el-button>
          <el-button type="primary" @click="addDeskConfirm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑旅客流量弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="dialogEditVisible" width="60%">
        <el-form ref="formTravelerEdit" :model="formTravelerEdit" :rules="formTraverRules">
          <el-form-item prop="distributionType" label="分布模式：" :label-width="formLabelWidth" required>
            <el-select v-model="formTravelerEdit.distributionType" placeholder="请选择" @change="distributionChange">
              <el-option v-for="item in disoptions" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
            <i class="el-icon-question help-icon" title="设定旅客流量的分布模式，不同模式对应的客流量分布不同" />
          </el-form-item>
          <div v-if="peakShow">
            <div v-for="(item, index1) in formTravelerEdit.timeAndPeakBeans" :key="index1">
              <el-form-item :prop="'binomialPeak'+index1" :label="'客流峰值时间' + index1 + ':'" :label-width="formLabelWidth">
                <el-input-number v-model="item.binomialPeak" :step="1" :min="0.1" />
                <el-time-picker v-model="item.time" arrow-control="true" clearable format="HH:mm" value-format="HH:mm" is-range range-separator="|" start-placeholder="起飞开始时间" end-placeholder="起飞结束时间" placeholder="选择时间范围" />
                <el-button v-if="item.isAdd" type="primary" size="small" @click="handleAddPeak">添加</el-button>
                <!-- <i class="el-icon-question help-icon" title="设定旅客流量的分布模式，不同模式对应的客流量分布不同" /> -->
                <el-button v-if="item.isDelete" type="primary" size="small" @click="handleDeletePeak(index1)">删除</el-button>
              </el-form-item>
            </div>
          </div>
          <el-form-item prop="loadRate" label="客座率：" :label-width="formLabelWidth">
            <el-input-number v-model="formTravelerEdit.loadRate" :step="1" :min="0" :max="100" />&nbsp;%
          </el-form-item>
          <el-form-item prop="skipRate" label="通程率：" :label-width="formLabelWidth" required>
            <el-input-number v-model="formTravelerEdit.skipRate" :step="1" :min="0" :max="100" />&nbsp;%
          </el-form-item>
          <el-form-item prop="selfServiceRate" label="自助值机率：" :label-width="formLabelWidth">
            <el-input-number v-model="formTravelerEdit.selfServiceRate" :step="1" :min="0" :max="100" />&nbsp;%
          </el-form-item>
          <el-form-item prop="luggageRate" label="需托运行李占比：" :label-width="formLabelWidth">
            <el-input-number v-model="formTravelerEdit.luggageRate" :step="1" :min="0" :max="100" />&nbsp;%
          </el-form-item>
          <el-form-item prop="preArrival" label="旅客提前到达时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formTravelerEdit.preArrival" :step="1" :min="1" />&nbsp;分钟
            <i class="el-icon-question help-icon" title="设定航班起飞前旅客提前多少分钟可以开始办理值机,所填需大于60" />
          </el-form-item>
          <el-form-item prop="lastArrival" label="旅客到达截止时间：" :label-width="formLabelWidth">
            <el-input-number v-model="formTravelerEdit.lastArrival" :step="1" :min="1" />&nbsp;分钟
            <i class="el-icon-question help-icon" title="设定航班起飞前多少分钟无法办理值机" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmClick('formTravelerEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <!-- <el-pagination background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
  </div>
</template>

<script>
import { carriers, initData, insertDeskData, updateDeskData, deleteDeskData, insertTravelerData, updateTravelerData, deleteTravelerData } from '@/api/checkInData'
export default {
  data() {
    var validateStart = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写旅客提前到达时间'))
      }
      if (value < 60) {
        callback(new Error('请输入大于60的数字'))
      } else {
        callback()
      }
    }
    var validateEnd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写旅客到达截止时间'))
      }
      if (value >= this.formTravelerEdit.preArrival) {
        callback(new Error('截止到达时间必须小于提前到达时间'))
      } else {
        callback()
      }
    }
    return {
      peakShow: false,
      totalled: {},
      page: {
        pageSize: 50,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      getRowKeys(row) {
        return row.checkInBaseId
      },
      title: '',
      siteIdOptions: [
        { siteId: '9', siteName: '国航首都机场' },
        { siteId: '10', siteName: '无锡机场' }
      ],
      options: [
        { skillId: 'D', skillName: '国内' },
        { skillId: 'I', skillName: '国际' },
        { skillId: 'D/I', skillName: '国内/国际' }
      ],
      disoptions: [
        { value: '二项分布', id: 'B' },
        { value: '平均分布', id: 'R' }
      ],
      carrierOptions: [],
      economyTypeOptions: [
        { economyTypeId: 'V', economyTypeName: '高端' },
        { economyTypeId: 'C', economyTypeName: '经济' },
        { economyTypeId: 'V/C', economyTypeName: '高端/经济' }
      ],
      gateTimeScale: [
        { name: '30分钟', id: '30' },
        { name: '60分钟', id: '60' },
        { name: '90分钟', id: '90' },
        { name: '120分钟', id: '120' }
      ],
      formSelect: { organizationId: '' },
      offon: true,
      expands: [],
      formDeskEdit: {},
      formTravelerEdit: {},
      rules: {
        siteId: [{ required: true, message: '请选择站点', trigger: 'change' }],
        checkInBaseName: [{ required: true, message: '请填写基础参数名' }],
        intlType: [{ required: true, message: '请选择国际/国内', trigger: 'change' }],
        carriers: [{ required: true, message: '请选择承运人', trigger: 'change' }],
        serviceType: [{ required: true, message: '请选择高端/经济', trigger: 'change' }],
        passRate: [
          { trigger: 'blur', required: true, message: '请填写处理速率' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1且为整数的数字' }
        ],
        maximumLatency: [
          { required: true, message: '请填写最大排队时间', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1的数字' }
        ],
        gateTimeScalevalue: [{ required: true, message: '请选择柜台最小开放时间', trigger: 'change' }]
      },
      formTraverRules: {
        distributionType: [{ required: true, message: '请选择分布模式', trigger: 'change' }],
        loadRate: [{ required: true, message: '请填写客座率', trigger: 'blur' }],
        skipRate: [{ required: true, message: '请填写通程率', trigger: 'blur' }],
        selfServiceRate: [{ required: true, message: '请填写自助值机率', trigger: 'blur' }],
        luggageRate: [{ required: true, message: '请填写需托运行李占比', trigger: 'blur' }],
        preArrival: [{ required: true, trigger: 'blur', validator: validateStart }],
        lastArrival: [
          { required: true, validator: validateEnd },
          { pattern: /^[1-9]\d*$/g, message: '请输入大于1的整数' }
        ]
      },
      dialogAdd: false,
      dialogEditVisible: false,
      dialogAddRole: false,
      tableData1: '',
      formLabelWidth: '200px',
      tableData: [],
      renderFunc(h, option) {
        return <span>{option.label}</span>
      }
    }
  },
  created() {
    this.init()
    this.carriers()
  },
  methods: {
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
    intltypeChange(e) {
      this.formDeskEdit.intlType = e
    },
    distributionChange(item) {
      if (item === 'R') {
        this.peakShow = false
        this.formTravelerEdit.timeAndPeakBeans = []
      } else {
        this.formTravelerEdit.timeAndPeakBeans = [{ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: true, isDelete: false }]
        this.peakShow = true
      }
    },
    // 峰值添加
    handleAddPeak() {
      this.formTravelerEdit.timeAndPeakBeans.push({ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: false, isDelete: true })
    },
    // 峰值删除
    handleDeletePeak(index) {
      this.formTravelerEdit.timeAndPeakBeans.splice(index, 1)
    },
    backpage() {
      this.$router.go(-1)
    },
    toggleTab(item) {
      // this.formEdit.gateTimeScalevalue = item
    },
    init() {
      var data = {
        siteId: this.$route.query.siteId || '10'
      }
      initData(data).then(response => {
        this.tableData = response.data
      })
    },

    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.init()
    },
    // 添加柜台开闭模拟参数
    addDeskParam(formName) {
      this.title = '新增'
      this.formDeskEdit = {
        carriers: [],
        intlType: []
      }
      this.formDeskEdit.siteId = this.$route.query.siteId
      this.peakShow = false
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      this.dialogAdd = true
    },
    // 修改柜台参数
    editDeskParam(index, row) {
      this.title = '修改'
      this.dialogAdd = true
      this.indexDesk = row.checkInBaseId
      this.formDeskEdit.gateTimeScalevalue = row.gateTimeScale
      row.gateTimeScalevalue = row.gateTimeScale
      this.formDeskEdit = Object.assign({}, row)
      if (row.gateTimeScale === '60') {
        this.formDeskEdit.gateTimeScalevalue = '60分钟'
      } else if (row.gateTimeScale === '90') {
        this.formDeskEdit.gateTimeScalevalue = '90分钟'
      } else if (row.gateTimeScale === '30') {
        this.formDeskEdit.gateTimeScalevalue = '30分钟'
      } else if (row.gateTimeScale === '120') {
        this.formDeskEdit.gateTimeScalevalue = '120分钟'
      }
    },
    // 编辑柜台参数确定事件
    addDeskConfirm(formName) {
      if (this.formDeskEdit.gateTimeScalevalue === '60分钟') {
        this.formDeskEdit.gateTimeScale = 60
      } else if (this.formDeskEdit.gateTimeScalevalue === '90分钟') {
        this.formDeskEdit.gateTimeScale = 90
      } else if (this.formDeskEdit.gateTimeScalevalue === '30分钟') {
        this.formDeskEdit.gateTimeScale = 30
      } else if (this.formDeskEdit.gateTimeScalevalue === '120分钟') {
        this.formDeskEdit.gateTimeScale = 120
      }
      this.$refs.formDeskEdit.validate(valid => {
        if (valid) {
          if (this.title === '新增') {
            insertDeskData(this.formDeskEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('新增成功！')
                this.init()
                this.dialogAdd = false
              } else {
                this.$message.error(response.message)
              }
            })
          } else if (this.title === '修改') {
            this.formDeskEdit.checkInBaseId = this.indexDesk
            updateDeskData(this.formDeskEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功！')
                this.init()
                this.dialogAdd = false
              } else {
                this.$message.error(response.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除柜台参数
    deleteDeskParam(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            checkInBaseId: row.checkInBaseId
          }
          deleteDeskData(data).then(response => {
            if (response.code === '200') {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 添加旅客流量参数
    addTraverParam(formName, rows) {
      this.dialogEditVisible = true
      this.checkInBaseId = rows.checkInBaseId
      this.title = '新增'
      this.peakShow = false
      this.formTravelerEdit = {
        timeAndPeakBeans: [{ binomialPeak: '0.5', time: ['08:00', '09:00'], isAdd: true, isDelete: false }]
      }
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },
    // 修改旅客流量参数
    editTraverParam(index, row) {
      this.dialogEditVisible = true
      this.title = '修改'
      this.indexTravelver = row.checkInBaseDataId
      if (row.timeAndPeakBeans) {
        row.timeAndPeakBeans[0].isAdd = true
        for (let i = 1; i < row.timeAndPeakBeans.length; i++) {
          row.timeAndPeakBeans[i].isDelete = true
        }
      }
      this.formTravelerEdit = Object.assign({}, row)
      if (row.distributionType === 'R') {
        this.peakShow = false
      } else {
        this.peakShow = true
      }
    },
    // 编辑旅客流量确定事件
    handleConfirmClick(formName) {
      if (this.formTravelerEdit.timeAndPeakBeans) {
        var valueCha = this.formTravelerEdit.preArrival - this.formTravelerEdit.lastArrival
        for (let i = 0; i < this.formTravelerEdit.timeAndPeakBeans.length; i++) {
          if (this.formTravelerEdit.timeAndPeakBeans[i].binomialPeak > valueCha) {
            this.$message.error('客流峰值时间必须小于提前到达时间减去截止到达时间的值！')
            return false
          }
        }
      }
      this.$refs.formTravelerEdit.validate(valid => {
        if (valid) {
          if (this.title === '新增') {
            this.formTravelerEdit.checkInBaseId = this.checkInBaseId
            insertTravelerData(this.formTravelerEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('新增成功！')
                this.init()
                this.dialogEditVisible = false
              } else {
                this.$message.error(response.message)
              }
            })
          } else if (this.title === '修改') {
            this.formTravelerEdit.checkInBaseId = this.indexTravelver
            updateTravelerData(this.formTravelerEdit).then(response => {
              if (response.code === '200') {
                this.$message.success('修改成功！')
                this.init()
                this.dialogEditVisible = false
              } else {
                this.$message.error(response.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除旅客流量参数
    deleteTraverParam(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          var data = {
            checkInBaseDetailId: row.checkInBaseDetailId
          }
          deleteTravelerData(data).then(response => {
            if (response.code === '200') {
              this.init()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    dialogclose() {
      this.dialogAdd = false
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  margin-top: 10px;
}
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 10px 10px 10px;
}
.title {
  width: 100%;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px 20px;
  background-color: #263257;
  color: white;
}
.upload-demo {
  margin-left: 20px;
}
.count-box {
  display: inline-block;
  height: 40px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  color: white;
  letter-spacing: 2px;
  border-radius: 10px;
}
.count-style {
  color: darkkhaki;
  font-size: 20px;
}
.count-box-gif {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-left: 27%;
}
.count-box-gif img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.add-user {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 50px;
  text-align: right;
  background-color: #232c47;
  div {
    margin-top: 10px;
    margin-bottom: 10px;
    // margin-left: 10px;
  }
}
.help-icon {
  font-size: 16px;
  color: #6faee0;
  cursor: pointer;
}
</style>
