<template>
  <div>
    <el-card class="box-card">
      <div class="title">查询面板</div>
      <el-form :inline="true" :model="listQuery" :rules="rules" class="add-user" size="small">
        <!-- <el-form-item label="机场">
          <el-select v-model="listQuery.airportId" filterable :disabled="disabled" clearable style="width: 140px" @change="changeAirports(listQuery.id)">
            <el-option v-for="item in planDeptAirport" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="航站楼" label-width="60px">
          <el-select v-model="listQuery.terminalId" filterable clearable @change="changeisLandId">
            <el-option v-for="item in terminalOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="安检区域" label-width="70px">
          <el-select v-model="listQuery.securityDomainId" filterable clearable>
            <el-option v-for="item in securityDomainOptions" :key="item.securityDomainId" :label="item.securityDomainName" :value="item.securityDomainId" />
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
        <div class="title">安检通道列表与已选择的安检通道</div>
        <el-transfer
          v-model="value"
          style="text-align: left; display: inline-block"
          :left-default-checked="leftDefaule"
          :right-default-checked="rightDefaule"
          :titles="['安检通道列表', '已选择的安检通道']"
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
    </el-card> -->
    <div style="height: 10px" />
  </div>
</template>

<script>
import { terminalData } from '@/api/flightPlan'
import { desks } from '@/apiNew/securityChannel'
import { initTable } from '@/apiNew/securityCheck'
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
      securityDomainOptions: [],
      terminalOptions: [],
      storageData: JSON.parse(localStorage.getItem('stepTwo')),
      disabled: true,
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
      leftDefaule: [],
      rightDefaule: [],
      formEdit2: {
        passRate: '',
        maxQueuingTime: '',
        minDeskOpenTime: ''
      },
      listQuery: {
        airportId: this.$store.state.user.airport.airportId,
        deskCode: '',
        deskName: '',
        openType: '',
        deskRegion: '',
        serviceType: '',
        terminalId: '',
        securityDomainId: ''
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
    // this.airports()
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
            key: element.id.toString(),
            code: element.code,
            name: element.name,
            openType: element.openType,
            region: element.region,
            serviceType: element.serviceType
          })
          this.value.push(element.id)
          this.deskIds.push(element.id)
          this.rightDefaule.push(element.id)
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
    // this.listQuery.airportId = Number(localStorage.getItem('airportId'))
    this.changeisLandId()
    this.terminalDataInt()
    this.desks()
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
    // airports() {
    //   airports(false).then((response) => {
    //     this.planDeptAirport = response.data.data
    //   })
    // },
    // 航站楼数据查询
    terminalDataInt() {
      terminalData(this.airport.airportId).then((res) => {
        if (res.data.code === 'ok') {
          this.terminalOptions = res.data.data.terminals
        }
      })
    },
    // 为未来根据航站楼查询安检区域做准备
    changeisLandId() {
      var data = {
        airportId: this.airport.airportId,
        terminalId: this.listQuery.terminalId
      }
      initTable(data).then((res) => {
        this.securityDomainOptions = res.data.data
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
