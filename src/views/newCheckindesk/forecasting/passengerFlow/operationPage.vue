<template>
  <div class="user-box">
    <div class="box">
      <el-form ref="formEdit" :model="formEdit" :label-width="formLabelWidth" :rules="rules">
        <el-card class="box-card">
          <div class="title">基本信息</div>
          <!-- <el-form-item label="机场" prop="airportId">
            <el-select ref="formEdit" v-model="formEdit.airportId" clearable placeholder="请选择">
              <el-option v-for="(items, indexs) in airportDataOptions" :key="indexs" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name" />
          </el-form-item>
          <el-form-item label="航班计划" prop="flightScheduleId">
            <el-select v-model="formEdit.flightScheduleId" filterable placeholder="请选择" @change="flightChange">
              <el-option v-for="(items, indexs) in flightScheduleIdOptions" :key="indexs" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始结束日期" prop="interTimerPicker">
            <el-date-picker
              v-model="formEdit.interTimerPicker"
              value-format="yyyy-MM-dd"
              :disabled="formEdit.flightScheduleId ? false : true"
              :picker-options="pickerOptions"
              type="daterange"
              :clearable="canClear"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 40%"
              @change="carrierSeach"
            />
            <!-- 航班数：{{ flightNum }} -->
          </el-form-item>
          <el-form-item label="国际/国内" prop="region">
            <el-select v-model="formEdit.region" placeholder="请选择" @change="carrierSeach">
              <el-option v-for="(items, indexs) in intlTypeOptions" :key="indexs" :label="items.label" :value="items.value" />
            </el-select>
            <!-- 航班数：{{ flightNum }} -->
          </el-form-item>
          <el-form-item label="承运人" prop="carriers">
            <el-select v-model="formEdit.carriers" multiple filterable collapse-tags placeholder="请选择" :filter-method="filterFCN" @change="carrierSeach">
              <el-option v-for="(item, index) in carriersOptions" :key="index" :label="item.carrierName" :value="item.iataCode">
                <span style="float: left">{{ item.carrierName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 5%">{{ item.iataCode }}</span>
              </el-option>
            </el-select>
            离港航班数：{{ flightNum }}
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <div class="title">
            航班人数
            <el-tooltip content="根据下方参数计算旅客人数，并获得柜台旅客占比，柜台旅客占比 = 客座率 * (1- 通程率) * [(1 - 自助值机率) + 自助值机率 * 自助值机后柜台托运行李占比]" placement="left">
              <i class="el-icon-question help-icon" />
            </el-tooltip>
          </div>
          <el-form-item prop="serviceType">
            <div slot="label" style="display: inline-block">
              高端/经济
              <el-tooltip content="高端值机柜台可服务于高舱以及会员旅客" placement="left">
                <i class="el-icon-question help-icon" />
              </el-tooltip>
            </div>
            <el-select v-model="formEdit.serviceType" collapse-tags placeholder="请选择" @change="serviceTypeChange">
              <el-option v-for="(item, index) in dataOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            离港总座位数： {{ seats }}
          </el-form-item>
          <el-form-item label="柜台对应客座率(%)" prop="loadRate">
            <el-input v-model="formEdit.loadRate" />
          </el-form-item>
          <el-form-item label="旅客服务占比(%)" prop="serverRate">
            <el-input v-model="formEdit.serverRate" />
          </el-form-item>
          <el-form-item prop="skipRate">
            <div slot="label" style="display: inline-block">
              通程率(%)
              <el-tooltip content="通程率为中转过程中无需前往中转值机柜台值机以及办理行李的旅客占所有旅客的比例" placement="left">
                <i class="el-icon-question help-icon" />
              </el-tooltip>
            </div>
            <el-input v-model="formEdit.skipRate" />
          </el-form-item>
          <el-form-item label="自助值机率(%)" prop="selfServiceRate">
            <el-input v-model="formEdit.selfServiceRate" />
          </el-form-item>
          <el-form-item label="自助值机后柜台托运行李占比(%)" prop="luggageRate">
            <el-input v-model="formEdit.luggageRate" />
          </el-form-item>
        </el-card>
        <el-card class="box-card card3">
          <div class="title">旅客分布</div>
          <div class="card3-body">
            <div v-for="(itemin, indexin) in formEdit.binomialConfigurations" :key="indexin" class="card3-body-item">
              <!-- <div> -->
              <el-form-item :prop="`binomialConfigurations.${indexin}.endTime`" :rules="rules.endTime && rules.beginTime">
                <div slot="label" style="display: inline-block">
                  时间区段
                  <el-tooltip content="默认的二项分布旅客流量峰值为提前到达时间与截止时间的中间值" placement="left">
                    <i class="el-icon-question help-icon" />
                  </el-tooltip>
                </div>
                <el-time-select v-model="itemin.beginTime" placeholder="起始时间" style="width: 120px" :picker-options="{ start: '00:00', end: '23:59' }" value-format="HH:mm" format="HH:mm" class="active" />
                <el-time-select v-model="itemin.endTime" placeholder="结束时间" style="width: 120px" :picker-options="{ start: '00:00', end: '23:59' }" value-format="HH:mm" format="HH:mm" class="active" />
                <el-button v-if="indexin == 0" size="small" type="primary" style="margin-left: 170px" @click="addTravelClick">添加</el-button>
                <el-button v-if="indexin > 0" size="small" type="primary" style="margin-left: 170px" @click="deleteTravelClick(indexin)">删除</el-button>
              </el-form-item>
              <el-form-item :label="`提前到达时间最大值(分钟)`" :prop="`binomialConfigurations.${indexin}.earlyArrival`" :rules="rules.earlyArrival">
                <el-input v-model="itemin.earlyArrival" />
              </el-form-item>
              <el-form-item :label="`航班截载时间(分钟)`" :prop="`binomialConfigurations.${indexin}.lastArrival`" :rules="rules.lastArrival">
                <el-input v-model="itemin.lastArrival" />
              </el-form-item>
              <el-form-item :prop="`binomialConfigurations.${indexin}.distributionType`" :rules="rules.distributionType">
                <div slot="label" style="display: inline-block">
                  流量模式
                  <el-tooltip content="设定旅客流量的分布模式，不同模式对应的客流量分布不同" placement="left">
                    <i class="el-icon-question help-icon" />
                  </el-tooltip>
                </div>
                <el-select
                  v-model="itemin.distributionType"
                  placeholder="请选择"
                  @change="
                    (val) => {
                      distributionChange(val, indexin)
                    }
                  "
                >
                  <el-option v-for="item1 in disoptions" :key="item1.id" :label="item1.value" :value="item1.id" />
                </el-select>
              </el-form-item>
              <div v-if="itemin.peakShow">
                <el-form-item :prop="`binomialConfigurations.${indexin}.peakPoint`" :rules="rules.peakPoint">
                  <div slot="label" style="display: inline-block">
                    旅客峰值
                    <el-tooltip content="航班起飞前多少分钟达到流量峰值" placement="left">
                      <i class="el-icon-question help-icon" />
                    </el-tooltip>
                  </div>
                  <el-input v-model="itemin.peakPoint" />
                  <el-popover placement="right" width="400" trigger="click" @show="binomialFcn(itemin)">
                    <binomialDistribution :chart-data="binomialData2" />
                    <div>横坐标:提前到达时间与截止时间的差，再除以5分钟颗粒度</div>
                    <el-button slot="reference" type="info" size="small">生成二项分布图</el-button>
                  </el-popover>
                </el-form-item>
              </div>
              <div v-if="itemin.mixPercent">
                <el-form-item :prop="`binomialConfigurations.${indexin}.distributionRatio`" label="模式二占比" :rules="rules.distributionRatio">
                  <el-input v-model="itemin.distributionRatio" size="small" />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-card>
      </el-form>
      <el-card>
        <el-button size="small" type="primary" @click="previewBig('formEdit')">预 览</el-button>
        <div v-show="noff" class="boxChart">
          <div v-show="!noff" style="text-align: center; margin-top: 20px" />
          <div v-for="(item, i) in alldata" :key="i">
            <p>{{ item.date }}</p>
            <div @click="showEchart(item)">
              <distribution :chart-data="item" />
            </div>
          </div>
        </div>
      </el-card>
      <div class="floot">
        <el-button size="small" style="right: 60px" type="primary" @click="handleConfirmClick('formEdit')">提 交</el-button>
        <el-button size="small" style="right: 150px" @click="dialogEditVisible">返 回</el-button>
      </div>
    </div>
    <el-dialog v-dialogDrag :title="lineChartDataBig.date" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <distribution :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
    </el-dialog>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import distribution from '@/components/echarts/distribution'
import binomialDistribution from '@/components/echarts/binomialDistribution'
import { addData, initData2, saveData, previewDataEdit, airportData, flightScheduleData, timeData, carriersOptionsUrl, flightSearch, seatsSearch } from '@/api/passengerFlow'
export default {
  components: {
    distribution,
    binomialDistribution
  },
  data() {
    var validateStart = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写旅客提前到达时间'))
      }
      if (Number(value) < 60) {
        callback(new Error('请输入大于60的数字'))
      } else {
        this.earlyValue = value
        callback()
      }
    }
    var validateEnd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写旅客到达截止时间'))
      }
      if (Number(value) > Number(this.earlyValue)) {
        // debugger
        callback(new Error('到达截止时间必须小于提前到达时间'))
      } else {
        callback()
      }
    }
    return {
      airport: this.$store.state.user.airport,
      seats: 0,
      canClear: false,
      flightNum: 0,
      jumpIndex: null,
      earlyValue: null,
      pickerMinDate: '',
      alldata: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          return this.dealDisabledDate(time)
        }
      },
      binomialData2: {},
      noff: false,
      dialogTableVisible: false,
      formEditdata: [],
      flightScheduleIdOptions: [],
      carriersOptions: [],
      formLabelWidth: '30%',
      rules: {
        distributionRatio: [{ required: true, message: '请填写模式二占比', trigger: 'blur' }],
        peakPoint: [{ required: true, message: '请填写客流峰值', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择开始结束时间', trigger: 'change' }],
        beginTime: [{ required: true, message: '请选择开始结束时间', trigger: 'change' }],
        airportId: [{ required: true, message: '请选择机场', trigger: 'change' }],
        name: [{ required: true, message: '请填写名称' }],
        region: [{ required: true, message: '请选择国际/国内', trigger: 'change' }],
        interTimerPicker: [{ required: true, message: '请选择开始结束日期', trigger: 'change' }],
        flightScheduleId: [{ required: true, message: '请选择航班计划', trigger: 'change' }],
        carriers: [{ required: true, message: '请选择承运人', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择高端/经济', trigger: 'change' }],
        loadRate: [
          { required: true, message: '请填写客座率', trigger: 'blur' },
          { pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/, message: '请输入小于100%且为整数的数字' }
        ],
        serverRate: [{ pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/, message: '请输入小于100%且为整数的数字' }],
        skipRate: [
          { required: true, message: '请填写通程率', trigger: 'blur' },
          { pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/, message: '请输入小于100%且为整数的数字' }
        ],
        selfServiceRate: [
          { required: true, message: '请填写自助值机率', trigger: 'blur' },
          { pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/, message: '请输入小于100%且为整数的数字' }
        ],
        luggageRate: [
          { required: true, message: '请填写自助托运行李占比', trigger: 'blur' },
          { pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/, message: '请输入小于100%且为整数的数字' }
        ],
        earlyArrival: [{ required: true, trigger: 'blur', validator: validateStart }],
        lastArrival: [{ required: true, trigger: 'blur', validator: validateEnd }],
        distributionType: [{ required: true, message: '请选择流量模式', trigger: 'change' }]
      },
      flightBeginDate: '',
      flightEndDate: '',
      lineChartDataBig: {},
      formEdit: {
        id: '',
        binomialConfigurations: [{ beginTime: '', endTime: '', distributionType: '', peakPoint: '', earlyArrival: '', lastArrival: '', peakShow: false, mixPercent: false, distributionRatio: '' }],
        airportId: '',
        name: '',
        region: 'D/I',
        interTimerPicker: [],
        flightScheduleId: '',
        carriers: '',
        skipRate: '',
        loadRate: '',
        serverRate: '',
        // serviceType: 'C/V',
        serviceType: '',
        // lastArrival: '',
        luggageRate: '',
        selfServiceRate: ''
        // earlyArrival: '',
        // distributionType: '',
        // binomialConfigurations: [{ peakPoint: '', beginTime: '', endTime: '', isAdd: true, isDelete: false }]
      },
      peakShow: false,
      carrierFlightId: null,
      airportDataOptions: [],
      dataOptions: [
        { label: '高端', value: 'V' },
        { label: '经济', value: 'C' },
        { label: '高端/经济', value: 'C/V' }
      ],
      intlTypeOptions: [
        { label: '国内', value: 'D' },
        { label: '国际', value: 'I' },
        { label: '国内/国际', value: 'D/I' }
      ],
      disoptions: [
        { value: '模式二', id: 'B' },
        { value: '模式一', id: 'R' },
        { value: '混合模式', id: 'M' }
      ]
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initData()
        this.select()
      }
    }
  },
  created() {
    this.initData()
    this.select()
    // this.serviceTypeChange()
  },
  beforeRouteLeave(to, form, next) {
    if (this.jumpIndex === 1) {
      next()
    } else {
      this.$confirm('确定离开此页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        next()
      })
    }
  },
  methods: {
    serviceTypeChange(e) {
      var data = {
        beginDate: this.formEdit.interTimerPicker[0],
        endDate: this.formEdit.interTimerPicker[1],
        carriers: this.formEdit.carriers,
        intlType: this.formEdit.region,
        id: this.formEdit.flightScheduleId,
        serviceType: this.formEdit.serviceType,
        airportId: this.airport.airportId
      }
      seatsSearch(data)
        .then((response) => {
          this.seats = response.data.data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    carrierSeach() {
      var data = {
        beginDate: this.formEdit.interTimerPicker[0],
        endDate: this.formEdit.interTimerPicker[1],
        carriers: this.formEdit.carriers,
        intlType: this.formEdit.region,
        id: this.formEdit.flightScheduleId,
        airportId: this.airport.airportId
      }
      flightSearch(data)
        .then((response) => {
          this.flightNum = response.data.data
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    flightChange(val) {
      this.formEdit.carriers = []
      this.flightScheduleChange()
      this.carriersUrl()
    },
    initData() {
      if (this.$route.query.offon === 'edit') {
        const data = {
          id: this.$route.query.id,
          airportId: this.airport.airportId
        }
        initData2(data).then((response) => {
          var data1 = response.data.data[0]
          // if (response.data.data[0].distributionType === 'B') {
          //   this.peakShow = true
          //   if (response.data.data[0].binomialConfigurations) {
          //     response.data.data[0].binomialConfigurations[0].isAdd = true
          //     for (let i = 1; i < response.data.data[0].binomialConfigurations.length; i++) {
          //       response.data.data[0].binomialConfigurations[i].isDelete = true
          //     }
          //   }
          // }
          if (data1.binomialConfigurations) {
            data1.binomialConfigurations.forEach((element) => {
              if (element.distributionType === 'B') {
                element.peakShow = true
              }
              if (element.distributionType === 'M') {
                element.mixPercent = true
              }
            })
          }
          response.data.data[0].airportId = response.data.data[0].airportId
          this.carrierFlightId = response.data.data[0].flightScheduleId
          this.formEditdata = Object.assign({}, response.data.data[0])
          this.formEdit = Object.assign({}, response.data.data[0])
          this.formEdit.airportId = this.airport.airportId
          const data = {
            flightScheduleId: response.data.data[0].flightScheduleId,
            airportId: this.airport.airportId
          }
          timeData(data).then((res) => {
            this.flightBeginDate = res.data.data.beginDate
            this.flightEndDate = res.data.data.endDate
          })

          if (response.data.data[0].endDate && response.data.data[0].beginDate) {
            this.$set(this.formEdit, 'interTimerPicker', [response.data.data[0].beginDate, response.data.data[0].endDate])
          }
          this.carriersUrl()
          this.carrierSeach()
          this.serviceTypeChange()
        })
      }
      // if (this.$refs.formEdit) {
      //   this.$refs.formEdit.resetFields()
      // }
    },
    filterFCN(v) {
      var data = {
        detailId: this.formEdit.flightScheduleId,
        searchData: v,
        airportId: this.airport.airportId
      }
      carriersOptionsUrl(data).then((res) => {
        this.carriersOptions = res.data.data
      })
    },
    binomial(n, k, p) {
      let a = 1
      let b = 1
      const c = this.combination(n, k)
      while (n - k > 0) {
        a = a * (1 - p)
        n--
      }
      while (k > 0) {
        b = b * p
        k--
      }
      return a * b * c
    },
    combination(n, k) {
      let min = k
      let max = n - k
      let t = 0
      let nn = 1
      let kk = 1
      if (min > max) {
        t = min
        min = max
        max = t
      }
      while (n > max) {
        nn = nn * n
        n--
      }
      while (min > 0) {
        kk = kk * min
        min--
      }
      return nn / kk
    },
    binomialFcn(data) {
      var datax = []
      var datay = []
      // data.earlyArrival = this.formEdit.earlyArrival
      // data.lastArrival = this.formEdit.lastArrival

      this.generateData(data).forEach((item) => {
        datay.push(item[1])
        datax.push(item[0])
      })
      this.binomialData2 = {
        datax: datax,
        datay: datay
      }
    },
    generateData(data2) {
      const data = []
      const n = (data2.earlyArrival - data2.lastArrival) / 5 // n = interval / granularity
      const p = (data2.earlyArrival - data2.peakPoint) / (data2.earlyArrival - data2.lastArrival) // p = peak / interval
      for (let i = 0; i <= n; i += 1) {
        data.push([i, this.binomial(n, i, p)])
      }
      return data
    },
    showEchart(items) {
      // 点击显示大图
      items.size = 6
      this.lineChartDataBig = items
      console.log(this.lineChartDataBig, 6655)
      this.dialogTableVisible = true
    },
    dialogEditVisible() {
      this.jumpIndex = 1
      if (this.$route.query.offon === 'edit') {
        if (JSON.stringify(this.formEdit) === JSON.stringify(this.formEditdata)) {
          this.$router.push({ path: '/newcheckIn/passengerFlow' })
        } else {
          this.$confirm('本次修改的数据将丢失，确认不保存？', '提示', {
            confirmButtonText: '不保存',
            cancelButtonText: '返回'
          })
            .then(() => {
              this.$router.push({ path: '/newcheckIn/passengerFlow' })
            })
            .catch(() => {})
        }
      } else {
        this.$router.push({ path: '/newcheckIn/passengerFlow' })
      }
    },
    closeImport() {
      // 关闭显示大图
      if (this.lineChartDataBig) {
        this.lineChartDataBig = {}
      }
      this.dialogTableVisible = false
      // location.reload()
    },
    select() {
      // airportData().then((response) => {
      //   this.airportDataOptions = response.data.data
      // })
      const data = {
        airportId: this.airport.airportId
      }
      flightScheduleData(data).then((response) => {
        this.flightScheduleIdOptions = response.data.data
      })
    },
    carriersUrl() {
      console.log(this.carrierFlightId, 666)
      var data = {
        detailId: this.formEdit.flightScheduleId || this.carrierFlightId,
        searchData: '',
        airportId: this.airport.airportId
      }
      carriersOptionsUrl(data).then((response) => {
        this.carriersOptions = response.data.data
      })
    },
    handleChange() {},
    distributionChange(item, index) {
      if (item === 'R') {
        this.formEdit.binomialConfigurations[index].peakShow = false
        this.formEdit.binomialConfigurations[index].mixPercent = false
        this.formEdit.binomialConfigurations[index].peakPoint = ''
        this.formEdit.binomialConfigurations[index].distributionRatio = ''
      } else if (item === 'B') {
        this.formEdit.binomialConfigurations[index].peakShow = true
        this.formEdit.binomialConfigurations[index].mixPercent = false
        this.formEdit.binomialConfigurations[index].distributionRatio = ''
      } else {
        this.formEdit.binomialConfigurations[index].peakShow = false
        this.formEdit.binomialConfigurations[index].peakPoint = ''
        this.formEdit.binomialConfigurations[index].mixPercent = true
      }
    },
    handleConfirmClick(formName) {
      this.jumpIndex = 1
      // if (this.peakShow) {
      //   if (this.formEdit.binomialConfigurations) {
      //     for (let i = 0; i < this.formEdit.binomialConfigurations.length; i++) {
      //       if (!this.formEdit.binomialConfigurations[i].peakPoint || !this.formEdit.binomialConfigurations[i].beginTime || !this.formEdit.binomialConfigurations[i].endTime) {
      //         this.$message.error('请填客流峰值时间')
      //         return false
      //       } else {
      //         if (!/^\+?[1-9][0-9]*$/.test(this.formEdit.binomialConfigurations[i].peakPoint)) {
      //           this.$message.error('客流峰值时间为非零正整数')
      //           return false
      //         }
      //       }
      //     }
      //   }
      //   if (this.formEdit.binomialConfigurations) {
      //     for (let i = 0; i < this.formEdit.binomialConfigurations.length; i++) {
      //       if (Number(this.formEdit.binomialConfigurations[i].peakPoint) < this.formEdit.lastArrival || Number(this.formEdit.binomialConfigurations[i].peakPoint) > this.formEdit.earlyArrival) {
      //         this.$message.error('峰值时刻必须在提前到达时间与到达截止时间之内！')
      //         return false
      //       }
      //     }
      //   }
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formEdit.airportId = this.airport.airportId
          if (this.$route.query.offon === 'edit') {
            this.formEdit.beginDate = this.formEdit.interTimerPicker[0]
            this.formEdit.endDate = this.formEdit.interTimerPicker[1]
            saveData(this.formEdit)
              .then((response) => {
                if (response.data.data) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  this.$router.push({ path: '/newcheckIn/passengerFlow' })
                }
              })
              .catch((error) => {
                console.log(this.formEdit)
                this.$confirm(error.response.data.message, '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'error'
                }).then(() => {})
              })
          } else {
            this.formEdit.beginDate = this.formEdit.interTimerPicker[0]
            this.formEdit.endDate = this.formEdit.interTimerPicker[1]
            addData(this.formEdit)
              .then((response) => {
                if (response.data.data) {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.$router.push({ path: '/newcheckIn/passengerFlow' })
                }
              })
              .catch((error) => {
                this.$confirm(error.response.data.message, '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'error'
                }).then(() => {})
              })
          }
        } else {
          return false
        }
      })
    },
    flightScheduleChange() {
      this.minTime = ''
      this.maxTime = ''
      const data = {
        flightScheduleId: this.formEdit.flightScheduleId,
        airportId: this.airport.airportId
      }
      timeData(data).then((res) => {
        this.flightBeginDate = res.data.data.beginDate
        this.flightEndDate = res.data.data.endDate
        this.$set(this.formEdit, 'interTimerPicker', [res.data.data.beginDate.slice(0, 10), res.data.data.endDate.slice(0, 10)])
        this.carrierSeach()
      })
    },
    dealDisabledDate(time) {
      // eslint-disable-next-line no-undef
      if (this.pickerMinDate) {
        const one = 30 * 24 * 3600 * 1000
        this.minTime = this.pickerMinDate - one
        this.maxTime = this.pickerMinDate + one
        return time.getTime() < this.minTime || time.getTime() > this.maxTime
      }
      return time.getTime() < Date.parse(new Date(this.flightBeginDate)) || time.getTime() > Date.parse(new Date(this.flightEndDate))
    },
    // handleAddPeak() {
    //   this.formEdit.binomialConfigurations.push({ peakPoint: '', beginTime: '', endTime: '', isAdd: false, isDelete: true })
    // },
    // handleDeletePeak(index) {
    //   this.formEdit.binomialConfigurations.splice(index, 1)
    // },
    addTravelClick() {
      this.formEdit.binomialConfigurations.push({ beginTime: '', endTime: '', distributionType: '', peakPoint: '', earlyArrival: '', lastArrival: '', mixPercent: false, distributionRatio: '' })
    },
    deleteTravelClick(index) {
      this.formEdit.binomialConfigurations.splice(index, 1)
    },
    previewBig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.noff = true
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.boxChart')
          })
          this.alldata = []
          this.formEdit.beginDate = this.formEdit.interTimerPicker[0]
          this.formEdit.endDate = this.formEdit.interTimerPicker[1]
          this.formEdit.airportId = this.airport.airportId
          previewDataEdit(this.formEdit)
            .then((response) => {
              if (response.data.data) {
                var previewarr = response.data.data.daily
                previewarr.forEach((item) => {
                  var dataX = []
                  var number = []
                  for (let i = 0; i < item.details.length; i++) {
                    dataX.push(item.details[i].time)
                    number.push(item.details[i].number)
                  }
                  this.alldata.push({
                    date: item.date,
                    size: 5,
                    maxY: response.data.data.maxY,
                    maxFlow: item.maxFlow,
                    dataX: dataX,
                    number: number
                  })
                })
              } else {
                this.$message.success('暂无图表数据')
                this.noff = false
              }

              loading.close()
            })
            .catch((error) => {
              loading.close()
              this.$message({
                type: 'error',
                message: error.response.data.message
              })
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.controlDialog /deep/ .el-dialog__header {
  padding-top: 30px;
}
.controlDialog /deep/ .el-dialog {
  width: 60%;
}
.controlDialog /deep/ .el-dialog__body {
  padding: 20px 32px 10px 6%;
}
</style>
<style lang="scss" scoped>
.user-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 10px 10px 10px;
}

.box {
  margin: 30px 0;
  margin-bottom: 80px;

  .el-form {
    width: 100%;
    margin: auto;

    .el-input,
    .el-select {
      width: 40%;
    }
  }
  .card3 {
    .active {
      width: 15%;
    }
  }
}

.boxChart {
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
}
.floot {
  background: #172449;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0 24px;
  width: 100%;
  height: 80px;

  .el-button {
    position: absolute;
    bottom: 20px;
  }
}
.card3-body {
  width: 80%;
  height: 400px;
  margin: 0 auto;
  overflow: auto;
}
.card3-body-item {
  padding: 10px 0;
  border: 1px solid #425079;
}
</style>
