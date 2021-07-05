<template>
  <div class="skillBox">
    <div class="left_box">
      <div class="title">
        <el-form ref="ruleForm" label-width="60px" class="demo-ruleForm">
          <el-form-item label="承运人:" prop="name">
            <el-select v-model="Carrier" clearable filterable style="width: 100px" class="filter-item" size="small" @change="handleFilter">
              <el-option v-for="(item,index) in getCarrierOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="机型:" prop="name" label-width="50px">
            <el-select v-model="acType" clearable filterable style="width: 100px" class="filter-item" size="small" @change="handleFilter2">
              <el-option v-for="(item,index) in getacTypeOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-input v-model="flightNo" size="small" placeholder="请输入航班号" clearable style="width: 120px" @change="search('A')" />
        </el-form>
      </div>
      <div class="title">
        <b>关联状态</b>
        <el-select v-model="relationStatusA" clearable style="width: 100px" class="filter-item" size="small" @change="relationStatusopsA">
          <el-option v-for="(item,index) in throughFlagOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <!-- <span class="right">
          <el-button type="primary" size="mini" @click="entryport()">单进港</el-button>
        </span>-->
      </div>
      <div class="center_box">
        <!-- <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选-进港航班</el-checkbox> -->
        <p>进港航班</p>
        <div ref="leftTop" style="margin: 15px 8px 0 30px;width:93%;white-space:nowrap;overflow-x:auto" class="leftTop">
          <span style="color:#409eff">航班号</span>
          <span style="width:45px">机型</span>
          <!-- <span>承运人</span>
          <span>关联状态</span>-->
          <span style="color:#e48e8e">关联航班</span>
          <span>到达时间</span>
          <span>起飞站</span>
          <span>班期</span>
          <span>国际国内</span>
        </div>
        <!-- <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'height':tabHeight}"> -->
        <div ref="leftbottom" :style="{'height':tabHeight,'overflow':'auto','width':'100%','display':'inline-block'}">
          <el-radio-group v-model="checkedentryport" @change="handleCheckedCitiesChange">
            <el-radio v-for="(item,index) in CycleFlightD" :key="index" :checked="false" :label="item.cycleFlightId" @change="((val) => handleCheckedChange(val, item, index))">
              <span style="color:#409eff">{{ item.flightNo }}</span>
              <span style="width:45px">{{ item.acType }}</span>
              <!-- <span>{{ item.carrier }}</span> -->
              <!-- <span v-if="item.throughFlag==0">独立航班</span>
              <span v-else-if="item.throughFlag==1">关联航班</span>
              <span v-else>-</span>
              <span style="color:#e48e8e">{{ item.linkedFlightNo }}</span>-->
              <span v-if="item.linkedFlightNo" style="color:#e48e8e">{{ item.linkedFlightNo }}</span>
              <span v-else-if="item.throughFlag==0">-</span>
              <span v-else />
              <span>{{ item.arrTime | joinTime }}</span>
              <span>{{ item.deptAirport }}</span>
              <span>{{ item.weekday }}</span>
              <span>{{ item.intlFlag|joinDate }}</span>
            </el-radio>
          </el-radio-group>
          <!-- </el-scrollbar> -->
        </div>
      </div>
    </div>
    <div class="mid_box">
      <p>
        <el-button type="primary" size="small" :disabled="associateDisable" @click="automatic()">自动关联</el-button>
      </p>

      <p style="margin-top:25px">
        <el-button type="primary" size="small" :disabled="associateDisable" @click="addLinked()">确认关联</el-button>
      </p>
      <p>
        <el-button type="primary" size="small" @click="cancelLinked()">取消关联</el-button>
      </p>
    </div>
    <div class="right_box">
      <div class="title">
        <el-form ref="ruleForm" label-width="60px" class="demo-ruleForm" size="small">
          <el-form-item label="承运人" prop="name">
            <!-- <el-select v-model="CarrierR" clearable style="width: 100px" class="filter-item" size="small" @change="handleFilterR"> -->
            <el-select v-model="Carrier" clearable filterable style="width: 100px" class="filter-item" size="small" @change="handleFilter">
              <el-option v-for="(item,index) in getCarrierOptionsR" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="机型" prop="name" label-width="50px">
            <el-select v-model="acType" clearable filterable style="width: 100px" class="filter-item" size="small" @change="handleFilter2">
              <el-option v-for="(item,index) in getacTypeOptionsR" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-input v-model="flightNo2" size="small" placeholder="请输入航班号" clearable style="width: 120px" @change="search('D')" />
        </el-form>
      </div>
      <div class="title">
        <b>关联状态 :</b>
        <el-select v-model="relationStatusD" clearable style="width: 100px" class="filter-item" size="small" @change="relationStatusopsD">
          <el-option v-for="(item,index) in throughFlagOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <!-- <span class="right">
          <el-button type="primary" size="small" @click="departure()">单出港</el-button>
        </span>-->
      </div>
      <div class="center_box">
        <!-- <el-checkbox v-model="checkAll2" :indeterminate="isIndeterminate2" @change="handleCheckAllChange2">全选-出港航班</el-checkbox> -->
        <p>出港航班</p>
        <div ref="rightTop" style="margin: 15px 8px 0 5px;width:100%;white-space:nowrap;overflow-x:auto" class="rightTop">
          <span style="color:#409eff;padding-left:22px">航班号</span>
          <span style="width:45px;padding-left:22px">机型</span>
          <!-- <span>承运人</span> -->
          <!-- <span>关联状态</span> -->
          <span style="color:#e48e8e;padding-left:22px">关联航班</span>
          <span style="padding-left:22px">起飞时间</span>
          <span style="padding-left:22px">到达站</span>
          <span style="padding-left:22px">班期</span>
          <span style="padding-left:22px">国际国内</span>
          <span style="padding-left:22px">停场时间(分钟)</span>
        </div>
        <!-- <el-scrollbar ref="rightbottom" wrap-class="scrollbar-wrapper" :style="{'height':tabHeight}"> -->
        <div id="rightbottom" ref="rightbottom" :style="{'height':tabHeight,'overflow':'auto','width':'100%','display':'inline-block'}">
          <el-radio-group ref="groupWidth" v-model="checkedeparture" @change="handleCheckedCitiesChange2">
            <el-radio v-for="(item,index) in CycleFlightA" :key="index" :checked="false" :label="item.cycleFlightId" @change="((val) => handleCheckedChangeR(val,item,index))">
              <span style="color:#409eff">{{ item.flightNo }}</span>
              <span style="width:45px">{{ item.acType }}</span>
              <!-- <span>{{ item.carrier }}</span> -->
              <!-- <span v-if="item.throughFlag==0">独立航班</span>
              <span v-else-if="item.throughFlag==1">关联航班</span>
              <span v-else>-</span>-->
              <span v-if="item.linkedFlightNo" style="color:#e48e8e">{{ item.linkedFlightNo }}</span>
              <span v-else-if="item.throughFlag==0">-</span>
              <span v-else />
              <!-- <span style="color:#e48e8e">{{ item.linkedFlightNo }}</span> -->
              <span>{{ item.deptTime | joinTime }}</span>
              <span>{{ item.arrAirport }}</span>
              <span>{{ item.weekday }}</span>
              <span>{{ item.intlFlag|joinDate }}</span>
              <span style="width:80px">{{ item.waitTime }}</span>
            </el-radio>
          </el-radio-group>
        </div>
        <!-- </el-scrollbar> -->
      </div>
    </div>
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="航班号:" :label-width="formLabelWidth">
          <el-input v-model="form.flightNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="承运人:" :label-width="formLabelWidth">
          <el-input v-model="form.carrier" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关联状态:" :label-width="formLabelWidth">
          <el-select v-model="form.throughFlag">
            <el-option label value="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联航班:" :label-width="formLabelWidth">
          <el-input v-model="form.linkedFlightNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="到达时间:" :label-width="formLabelWidth">
          <el-input v-model="form.deptTime" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="起飞站:" :label-width="formLabelWidth">
          <el-input v-model="form.arrAirport" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="班期:" :label-width="formLabelWidth">
          <el-input v-model="form.weekday" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="国际国内:" :label-width="formLabelWidth">
          <el-select v-model="form.intlFlag">
            <el-option label value="无" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { associatedflights, updateThroughFflag, addLinkedFlightNo, cancelLinkedFlightNo, getCarrselect, getcarrier, automatic } from '@/api/flightPlan'
export default {
  name: 'Associatedflights',
  filters: {
    joinDate: function(value) {
      if (value) {
        switch (value) {
          case 'D':
            value = '国内'
            break
          case 'I':
            value = '国际'
            break
          default:
            break
        }
      }
      return value
    },
    joinTime: function(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  data() {
    return {
      scorllWidth1: null,
      associateDisable: false,
      tabHeight: window.innerHeight - 350 + 'px',
      relationStatusA: '',
      relationStatusD: '',
      throughFlagOptions: [
        { label: '独立航班', value: '0' },
        { label: '关联航班', value: '1' },
        { label: '未设置', value: 'notSetUp' }
      ],
      dialogFormVisible: false,
      title: '',
      form: {},
      formLabelWidth: '150px',
      flightNo: '',
      flightNo2: '',
      getacTypeOptions: [],
      getCarrierOptions: [],
      getacTypeOptionsR: [],
      getCarrierOptionsR: [],
      Carrier: '',
      acType: '',
      CarrierR: '',
      acTypeR: '',
      sortOptions: [],
      cycleFlightScheduleId: this.$route.query.flightScheduleId,
      checkAll: false,
      checkAll2: false,
      carrierData: 'D',
      flightTypeData: 'D',
      checkedentryport: [],
      checkedeparture: [],
      isIndeterminate: false,
      isIndeterminate2: false,
      CycleFlightD: [],
      CycleFlightA: [],
      CycleFlightAFu: [],
      leftCycleFlight: [],
      rightCycleFlightId: [],
      arrRight: [],
      arrLeft: []
    }
  },
  created() {
    this.initableD() // 进港
    this.initableA() // 出港
    this.getCarrselectL()
    this.getCarrselectR()
  },
  methods: {
    search(val) {
      // 航班搜索
      if (val === 'A') {
        this.initableD()
      } else if (val === 'D') {
        this.initableA()
      }
    },
    addData(val) {
      this.dialogFormVisible = true
      this.title = '新增'
    },
    updata(val) {
      this.dialogFormVisible = true
      this.title = '修改'
      this.form = Object.assign({}, val)
    },
    getCarrselectL() {
      // 承运人
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'A'
      }
      getCarrselect(data).then(response => {
        response.data.carrier.forEach(element => {
          this.getCarrierOptions.push({ value: element, label: element })
        })
        response.data.acType.forEach(element => {
          this.getacTypeOptions.push({ value: element, label: element })
        })
      })
    },
    getCarrselectR() {
      // 承运人右
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D'
      }
      getCarrselect(data).then(response => {
        response.data.carrier.forEach(element => {
          this.getCarrierOptionsR.push({ value: element, label: element })
        })
        response.data.acType.forEach(element => {
          this.getacTypeOptionsR.push({ value: element, label: element })
        })
      })
    },
    automatic() {
      var data = {
        documentId: this.$route.query.documentId
      }
      automatic(data)
        .then(res => {
          this.$message.success('自动关联成功')
          this.initableD() // 进港
          this.initableA() // 出港
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    handleFilter(val) {
      this.checkedentryport = []
      // this.acType = ''
      this.getCarrselectL()
      this.CycleFlightD = []
      this.CarrierR = val
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'A',
        carrier: this.Carrier,
        acType: this.acType
      }
      var data1 = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D',
        carrier: this.Carrier,
        acType: this.acType
      }
      getcarrier(data).then(response => {
        this.CycleFlightD = response.data
      })
      getcarrier(data1).then(response => {
        this.CycleFlightA = response.data
        this.CycleFlightAFu = this.CycleFlightA
      })
    },
    handleFilter2(val) {
      this.checkedentryport = []
      this.getCarrselectL()
      this.CycleFlightD = []
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'A',
        carrier: this.Carrier,
        acType: this.acType
      }
      var data1 = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D',
        carrier: this.Carrier,
        acType: this.acType
      }
      getcarrier(data).then(response => {
        this.CycleFlightD = response.data
      })
      getcarrier(data1).then(response => {
        this.CycleFlightA = response.data
        this.CycleFlightAFu = this.CycleFlightA
      })
    },
    relationStatusopsA(val) {
      this.initableD()
    },
    relationStatusopsD(val) {
      this.initableA()
    },
    inputsearch(flag, val) {
      if (flag === 'D') {
        var data = {
          cycleFlightScheduleId: this.cycleFlightScheduleId,
          flightType: 'D',
          carrier: this.Carrier,
          acType: this.acType
        }
        getcarrier(data).then(response => {
          this.CycleFlightA = response.data
        })
      } else if (flag === 'A') {
        var data2 = {
          cycleFlightScheduleId: this.cycleFlightScheduleId,
          flightType: 'A',
          carrier: this.CarrierR,
          acType: this.acTypeR
        }
        getcarrier(data2).then(response => {
          this.CycleFlightA = response.data
        })
      }
    },
    handleFilterR(val) {
      this.checkedeparture = []
      this.acType = ''
      this.getCarrselectR()
      this.CycleFlightA = []
      this.Carrier = val
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D',
        carrier: this.CarrierR,
        acType: this.acTypeR
      }
      getcarrier(data).then(response => {
        this.CycleFlightA = response.data
      })
    },
    handleFilter2R(val) {
      this.checkedeparture = []
      this.getCarrselectR()
      this.CycleFlightA = []
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D',
        // carrier: this.CarrierR,
        carrier: this.Carrier,
        // acType: this.acTypeR
        acType: this.acType
      }
      getcarrier(data).then(response => {
        this.CycleFlightA = response.data
      })
    },
    initableD() {
      // 进港
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'A',
        carrier: this.Carrier,
        acType: this.acType,
        flightNo: this.flightNo,
        relationStatus: this.relationStatusA
      }
      associatedflights(data).then(response => {
        this.CycleFlightD = []
        this.CycleFlightD = response.data
      })
      this.$nextTick(() => {
        var t = this.$refs.leftTop
        var b = this.$refs.leftbottom
        this.scrollClick(t, b)
      })
      // this.initableA()
    },
    initableA() {
      // 出港
      var data = {
        cycleFlightScheduleId: this.cycleFlightScheduleId,
        flightType: 'D',
        // carrier: this.CarrierR,
        carrier: this.Carrier,
        // acType: this.acTypeR,
        acType: this.acType,
        flightNo: this.flightNo2,
        relationStatus: this.relationStatusD
      }
      associatedflights(data).then(response => {
        this.CycleFlightA = []
        this.CycleFlightA = response.data
        this.CycleFlightAFu = this.CycleFlightA
      })
      this.$nextTick(() => {
        var t = this.$refs.rightTop
        var b = this.$refs.rightbottom
        this.scrollClick(t, b)
      })
    },
    scrollClick(a, b) {
      b.addEventListener('scroll', function() {
        a.scrollLeft = b.scrollLeft
      })
    },
    handleCheckAllChange(val) {
      // 全选
      var checked = []
      this.CycleFlightD.forEach(element => {
        checked.push(element.cycleFlightId)
      })
      this.checkedentryport = val ? checked : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value1) {
      var value = [value1]
      if (value.length > 1 || value.length === 0) {
        this.CycleFlightAFu.forEach(element => {
          element.waitTime = ''
        })
      }
      const checkedCount = value.length
      this.checkAll = checkedCount === this.CycleFlightD.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.CycleFlightD.length
    },
    handleCheckAllChange2(val) {
      // 全选
      var checked = []
      this.CycleFlightA.forEach(element => {
        checked.push(element.cycleFlightId)
      })
      this.checkedeparture = val ? checked : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange2(value1) {
      console.log(value1, 0)
      const value = [value1]
      const checkedCount = value.length
      this.checkAll2 = checkedCount === this.CycleFlightA.length
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.CycleFlightA.length
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    handleCheckedChange(val1, value, index) {
      // this.associateDisable = false
      // 单进点击选中一个
      // this.leftCycleFlight = value
      console.log(val1, value, index, 110)
      this.arrLeft = []
      const val = [val1]
      if (val) {
        this.arrLeft[index] = value
        this.CycleFlightAFu.forEach(element => {
          // debugger
          var a = element.deptTime.substring(11, 16)
          var b = a.split(':')
          var c = value.arrTime.substring(11, 16)
          var d = c.split(':')
          var e = null
          if (Number(b[0]) < Number(d[0])) {
            e = Number(b[0]) * 60 + Number(b[1]) + 24 * 60 - (Number(d[0]) * 60 + Number(d[1]))
          } else if (Number(b[0]) === Number(d[0])) {
            if (Number(b[1]) < Number(d[1])) {
              e = Number(b[0]) * 60 + Number(b[1]) + 24 * 60 - (Number(d[0]) * 60 + Number(d[1]))
            } else {
              e = Number(b[0]) * 60 + Number(b[1]) - (Number(d[0]) * 60 + Number(d[1]))
            }
          } else {
            e = Number(b[0]) * 60 + Number(b[1]) - (Number(d[0]) * 60 + Number(d[1]))
          }
          element.waitTime = e
        })
        this.CycleFlightAFu.sort(this.compare('waitTime'))
        if (value.linkedFlightNo) {
          this.CycleFlightAFu.forEach((element, index) => {
            if (element.flightNo === value.linkedFlightNo) {
              this.CycleFlightAFu.splice(index, 1)
              this.CycleFlightAFu.unshift(element)
            }
          })
          this.associateDisable = true
        } else {
          this.associateDisable = false
        }
      } else {
        this.arrLeft.splice(index, 1)
      }
      this.arrLeft.forEach(element => {
        this.leftCycleFlight = element
      })
      console.log(this.arrLeft, this.leftCycleFlight, '获取左值')
      // console.log(this.CycleFlightA, 787)
      // console.log(this.checkedeparture, 98989)
      // this.CarrierR = this.Carrier
      // this.acTypeR = this.acType
      // this.CycleFlightA = []
      // var data = {
      //   cycleFlightScheduleId: this.cycleFlightScheduleId,
      //   flightType: 'D',
      //   carrier: this.Carrier,
      //   acType: this.acType
      // }
      // getcarrier(data).then(response => {
      //   this.CycleFlightA = response.data
      // })
    },
    handleCheckedChangeR(val1, value, index) {
      // 单出点击选中一个
      // this.rightCycleFlightId = value
      // this.associateDisable = false
      const val = [val1]
      this.arrRight = []
      if (val) {
        this.arrRight[index] = value
      } else {
        this.arrRight.splice(index, 1)
      }
      // if (value.linkedFlightNo) {
      //   this.associateDisable = true
      // }
      this.arrRight.forEach(element => {
        this.rightCycleFlightId = element
      })
    },
    entryport() {
      // 单进点设置按钮
      if (this.checkedentryport.length > 0) {
        updateThroughFflag(this.checkedentryport).then(response => {
          if (response.code === '200') {
            this.initableD()
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }
        })
      } else {
        this.$message({
          message: '航班不能为空',
          type: 'error'
        })
      }
    },
    departure() {
      // 单出点设置按钮
      this.checkedentryport = []
      if (this.checkedeparture.length > 0) {
        updateThroughFflag(this.checkedeparture).then(response => {
          if (response.code === '200') {
            this.initableA()
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }
        })
      } else {
        this.$message({
          message: '航班不能为空',
          type: 'error'
        })
      }
    },
    addLinked() {
      // debugger
      console.log(this.leftCycleFlight, this.checkedeparture, 333)
      this.checkedentryport = [this.checkedentryport]
      this.checkedeparture = [this.checkedeparture]
      if (this.checkedentryport.length > 1 || this.checkedeparture.length > 1) {
        this.$message({
          type: 'error',
          message: '只能一对一关联'
        })
      } else if (this.checkedentryport.length === 1 && this.checkedeparture.length === 1) {
        if (this.leftCycleFlight.carrier !== this.rightCycleFlightId.carrier) {
          this.$message({
            type: 'error',
            message: '航司不同不能关联'
          })
        } else {
          var data = {
            leftCycleFlightId: this.leftCycleFlight.cycleFlightId,
            rightCycleFlightId: this.rightCycleFlightId.cycleFlightId,
            leftFlightNo: this.leftCycleFlight.flightNo,
            rightFlightNo: this.rightCycleFlightId.flightNo,
            leftWeekDay: this.leftCycleFlight.weekday,
            rightWeekDay: this.rightCycleFlightId.weekday,
            identifier: this.leftCycleFlight.identifier
          }
          addLinkedFlightNo(data)
            .then(response => {
              if (response.code === '200') {
                this.checkedentryport = []
                this.checkedeparture = []
                this.initableD()
                this.initableA()
                this.$message({
                  type: 'success',
                  message: '关联成功'
                })
              }
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        }
      } else {
        this.$message({
          type: 'error',
          message: '只能一对一关联'
        })
      }
    },
    cancelLinked() {
      if (this.checkedentryport.length > 1 || this.checkedeparture.length > 1 || this.checkedentryport.length + this.checkedeparture.length > 1 || (this.checkedentryport.length === 0 && this.checkedeparture.length === 0)) {
        this.$message({
          message: '只能选一个取消关联',
          type: 'warning'
        })
      } else {
        var data = {
          identifier: this.leftCycleFlight.identifier ? this.leftCycleFlight.identifier : this.rightCycleFlightId.identifier
        }
        cancelLinkedFlightNo(data)
          .then(response => {
            this.$message.success('取消成功')
            this.checkedentryport = []
            this.checkedeparture = []
            this.initableD()
            this.initableA()
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      }
    },
    // carrierD(item) {
    //   console.log(item)
    //   if (item === 'A') {
    //     this.CycleFlightD.forEach(element => {
    //       // checked.push(element.cycleFlightId)
    //     })
    //   }
    // },
    flightTypeD(item) {}
  }
}
</script>
<style lang="scss" scoped>
.rightTop::-webkit-scrollbar,
.leftTop::-webkit-scrollbar {
  display: none;
}
.right {
  float: right;
}
.el-radio__input {
  vertical-align: initial;
}
.title {
  .el-form-item {
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 0;
  }
}
.skillBox {
  padding: 60px 5px;
}
.center_box {
  background: #172449;
  border: 1px solid #2e437d;
  padding: 20px 5px;
  span {
    width: 70px;
    display: inline-block;
  }
}
.left_box,
.right_box {
  width: 46%;
  display: inline-block;
  vertical-align: middle;
}
.mid_box {
  width: 7%;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
}
.title {
  padding: 10px;
  border-bottom: 1px solid #232c47;
  .el-button {
    margin-right: 20px;
  }
}
.bottom {
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #232c47;
  text-align: center;
}
.el-radio-group label {
  margin: 5px;
}
</style>
