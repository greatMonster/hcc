<template>
  <div>
    <el-card class="box-card">
      <div class="title">查询面板</div>
      <el-form :inline="true" :model="listQuery" :rules="rules" class="add-user" size="small">
        <!-- <el-form-item label="机场">
          <el-select v-model="listQuery.airportId" filterable clearable disabled style="width: 140px" @change="changeAirports(listQuery.id)">
            <el-option v-for="item in planDeptAirport" :key="item.id" :label="item.name" :value="item.id + ''" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="航站楼" label-width="60px">
          <el-select v-model="listQuery.terminalId" filterable clearable @change="changeisLandId">
            <el-option v-for="item in terminalOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="值机岛" label-width="60px">
          <el-select v-model="listQuery.isLandId" filterable clearable>
            <el-option v-for="item in isLandIdOptions" :key="item.id" :label="item.code" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="listQuery.serviceTypeId" filterable clearable style="width: 140px">
            <el-option v-for="item in serviceTypeIdeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="listQuery.deskCode" placeholder clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="listQuery.deskName" placeholder clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="开放类型">
          <el-select v-model="listQuery.openType" filterable clearable style="width: 140px">
            <el-option v-for="item in OpenTypeOptions" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="国内/国际">
          <el-select v-model="listQuery.deskRegion" filterable clearable style="width: 140px">
            <el-option v-for="item in regionOptions" :key="item.Id" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="高端/经济">
          <el-select v-model="listQuery.serviceType" filterable clearable style="width: 140px">
            <el-option v-for="(item, index) in ServiceTypeOptions" :key="index" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="sechData()">查 询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="elTransfer">
        <div class="title">柜台列表与已选择的柜台</div>
        <el-transfer
          v-model="value"
          style="text-align: left; display: inline-block"
          :left-default-checked="leftDefaule"
          :right-default-checked="rightDefaule"
          :titles="['柜台列表', '已选择的柜台']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="transferData"
          @change="handleChange"
        >
          <div slot-scope="{ option }" class="transferList">
            <span>{{ option.code }}</span>
            <span class="name">{{ option.name }}</span>
            <span v-if="option.openType == 0">
              <el-tooltip class="item" effect="dark" placement="bottom">
                <p v-for="(item, index) in option.openTimes" :key="index">
                  <span>开始时间：{{ item.beginTime }}</span>
                  <span>关闭时间：{{ item.endTime }}</span>
                </p>
                <span slot="reference">常开{{ option.name }}</span>
              </el-tooltip>
            </span>
            <span v-else>
              <span>动态</span>
            </span>
            <span class="region">{{ option.region | region }}</span>
            <span class="serviceType">{{ option.serviceType | serviceType }}</span>
          </div>
        </el-transfer>
      </div>
    </el-card>
    <!-- <el-card class="box-card">
      <div class="title">柜台参数</div>
      <el-form ref="formEdit2" :inline="true" :rules="rules" :model="formEdit2" class="add-user" size="small">
        <el-form-item label="处理速率（人/小时）" prop="passRate">
          <el-input v-model.number="formEdit2.passRate" placeholder clearable />
        </el-form-item>
        <el-form-item label="最大排队时间（分钟）" prop="maxQueuingTime">
          <el-input v-model.number="formEdit2.maxQueuingTime" placeholder clearable />
        </el-form-item>
        <el-form-item label="最小开放时间（分钟）" prop="minDeskOpenTime">
          <el-input v-model.number="formEdit2.minDeskOpenTime" placeholder clearable />
        </el-form-item>
      </el-form>
    </el-card>-->
    <div style="height: 10px" />
  </div>
</template>

<script>
import { airports, desks, isLandsData } from '@/apiNew/checkInData'
import { terminalData } from '@/api/flightPlan'
import { initTable } from '@/apiNew/service'
export default {
  name: 'StepTwo',
  filters: {
    region: function (value) {
      if (value) {
        switch (value) {
          case 'D':
            value = '国内'
            break
          case 'I':
            value = '国际'
            break
          case 'D/I':
            value = '国内/国际'
            break
        }
        return value
      }
    },
    serviceType: function (value) {
      if (value) {
        switch (value) {
          case 'V':
            value = '高端'
            break
          case 'C':
            value = '经济'
            break
          case 'C/V':
            value = '经济高端'
            break
        }
        return value
      }
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      storageData: JSON.parse(localStorage.getItem('stepTwo')),
      disabled: true,
      isLandIdOptions: [],
      serviceTypeIdeOptions: [],
      regionOptions: [
        { Id: 'D', Name: '国内' },
        { Id: 'I', Name: '国际' },
        { Id: 'D/I', Name: '国内/国际' }
      ],
      ServiceTypeOptions: [
        { Id: 'V', Name: '高端' },
        { Id: 'C', Name: '经济' },
        { Id: 'C/V', Name: '经济高端' }
      ],
      OpenTypeOptions: [
        { Id: '0', Name: '常开' },
        { Id: '1', Name: '动态' }
      ],
      airportId: '',
      list: [],
      transferData: [],
      value: [],
      value2: [],
      terminalOptions: [],
      leftDefaule: [],
      rightDefaule: [],
      formEdit2: {
        passRate: '',
        maxQueuingTime: '',
        minDeskOpenTime: ''
      },
      listQuery: {
        airportId: '',
        deskCode: '',
        deskName: '',
        openType: '',
        isLandId: '',
        serviceTypeId: '',
        terminalId: '',
        deskRegion: '',
        serviceType: ''
      },
      deskIds: [],
      planDeptAirport: [],
      formLabelWidth: '30%',
      rules: {
        passRate: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        maxQueuingTime: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        minDeskOpenTime: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      if (localStorage.getItem('edit_stepTwo')) {
        this.datas = JSON.parse(localStorage.getItem('edit_stepTwo'))
        this.formEdit2 = this.datas.formEdit2
        this.value = this.datas.value
        this.deskIds = this.datas.deskIds
      } else {
        this.datas = JSON.parse(localStorage.getItem('detailList'))
        this.formEdit2 = this.datas
        this.datas.desks.forEach((element) => {
          this.transferData.push({
            key: element.id,
            code: element.code,
            name: element.name,
            openType: element.openType,
            region: element.region,
            serviceType: element.serviceType
          })
          this.value.push(element.id)
          this.deskIds.push(element.id.toString())
          this.rightDefaule.push(element.id.toString())
        })
      }
    } else {
      if (this.storageData) {
        // this.listQuery = this.storageData.listQuery
        this.formEdit2 = this.storageData.formEdit2
        this.transferData = this.storageData.transferData
        this.value = this.storageData.value
        this.deskIds = this.storageData.deskIds
      }
    }

    this.listQuery.airportId = localStorage.getItem('airportId')
    this.desks()
    this.airports()
    this.changeisLandId()
    this.terminalDataInt()
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      this.deskIds = movedKeys
      this.rightDefaule = value
    },
    changeAirports(data) {
      this.airportId = data
      this.desks()
    },
    changeisLandId() {
      var data = {
        airportId: this.airport.airportId,
        terminalId: this.listQuery.terminalId
      }
      isLandsData(data).then((res) => {
        this.isLandIdOptions = res.data.data
      })
    },
    airports() {
      const data = {
        airportId: this.airport.airportId
      }
      // airports(false).then((response) => {
      //   this.planDeptAirport = response.data.data
      // })
      initTable(data).then((response) => {
        if (response.data.code == 200) {
          this.serviceTypeIdeOptions = response.data.data
        }
      })
    },
    terminalDataInt() {
      terminalData(this.airport.airportId).then((res) => {
        if (res.data.code === 'ok') {
          this.terminalOptions = res.data.data.terminals
        }
      })
    },
    sechData() {
      this.desks()
    },
    desks() {
      this.transferData = []
      this.listQuery.airportId = this.airport.airportId
      desks(this.listQuery).then((response) => {
        response.data.data.forEach((element) => {
          this.transferData.push({
            key: element.id,
            code: element.code,
            name: element.name,
            openType: element.openType,
            region: element.region,
            serviceType: element.serviceType
          })
        })
        this.value = this.$parent.$refs.stepTwo.value
        // console.log(this.value)
        // this.rightDefaule = this.$parent.$refs.stepTwo.value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  margin: auto;
}
.transferList {
  span {
    margin: 0 10px;
    &.name {
      color: #409eff;
    }
  }
}
</style>
