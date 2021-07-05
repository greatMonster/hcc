<template>
  <div class="warp">
    <div class="title">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-form-item label="员工姓名：" prop="name">
          <el-input v-model="ruleForm.name" @blur="queryData" @input="queryData" @change="queryData" />
        </el-form-item>
        <el-form-item label="柜台类别：" prop="region">
          <el-cascader v-model="value" size="small" :options="options" clearable @change="handleChange(value)" />
        </el-form-item>
        <el-form-item label="轮班时间：">
          <el-time-select
            v-model="ruleForm.startTime"
            placeholder="起始时间"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
          />
          <el-time-select
            v-model="ruleForm.endTime"
            placeholder="结束时间"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: ruleForm.startTime
            }"
          />
        </el-form-item>
        <el-button type="info" size="small" icon="el-icon-search" @click="queryData">搜索</el-button>
        <el-button type="info" size="small" @click="resetForm('ruleForm')">重置</el-button>
      </el-form>
      <p class="AvgSumRate">
        <span>早班利用率：{{ (morningAvgSumRate*100).toFixed(2) }}%</span>
        <span>晚班利用率：{{ (eveningAvgSumRate*100).toFixed(2) }}%</span>
        <span>总工时利用率：{{ (totalAvgRate*100).toFixed(2) }}%</span>
      </p>
    </div>

    <el-table
      v-loading="listLoading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      stripe
      :data="tableData.employeeList"
      style="width:100%;margin:10px"
      :header-cell-style="discountHeaderStyle1"
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="employeeName" label="员工姓名" width="150" />
      <el-table-column prop label="任务数/时长" width="150">
        <template slot-scope="scope">{{ (scope.row.taskNum) }}/ {{ (scope.row.taskTime) }}</template>
      </el-table-column>
      <el-table-column prop="rate" label="上班时长/利用率" width="150">
        <template slot-scope="scope">{{ (scope.row.workTime) }}/ {{ (scope.row.useRatio*100).toFixed(2) }} %</template>
      </el-table-column>
      <el-table-column prop label="上班时间" width="150">
        <template slot-scope="scope">{{ (scope.row.startTime.split(" ")[1]) }} - {{ (scope.row.endTime.split(" ")[1]) }}</template>
      </el-table-column>
      <el-table-column label="工作时间">
        <el-table-column fixed="right">
          <template slot-scope="scope">
            <div class="list" @dragover="allowDrop($event)" @drop="onDrop($event,scope.row)">
              <span
                v-for="(item,index) in scope.row.checkInTaskDTOList"
                :key="index"
                :class="{'cur':!scope.row.checkInTaskDTOList[0].checkInTaskId}"
                :item="item"
                :data="index"
                draggable="true"
                @dragstart="dragstart($event,item)"
                @drag="drag($event)"
                @dragend="dragend($event)"
              >（{{ item.startTime | joinDate }} - {{ item.endTime | joinDate }}） {{ item.deskName }} {{ item.deskCode }}号柜台</span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ByEmployeeGroup, deskManualDispatching } from '@/api/checkInData'
// import { } from '@/api/checkInData'
export default {
  name: 'CheckIn',
  filters: {
    joinDate: function(value) {
      // console.log(value, 888)
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    }
  },
  data() {
    return {
      morningAvgSumRate: null,
      eveningAvgSumRate: '',
      totalAvgRate: '',
      value: ['D', 'C'],
      options: [
        {
          value: 'D',
          label: '国内',
          children: [
            {
              value: 'VV',
              label: '高端'
            },
            {
              value: 'CC',
              label: '经济'
            }
          ]
        },
        {
          value: 'I',
          label: '国际',
          children: [
            {
              value: 'V',
              label: '高端'
            },
            {
              value: 'C',
              label: '经济'
            }
          ]
        }
      ],
      ruleForm: {
        name: '',
        value: ['', ''],
        startTime: '',
        endTime: ''
      },
      tableData: {},
      intlType: 'D',
      serviceType: 'C',
      listLoading: false,
      dragstartHtml: '',
      employeeGroupBean: {}
    }
  },
  created() {
    this.ByEmployeeGroup()
  },
  methods: {
    // 横向合并头部单元格
    discountHeaderStyle1({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        // 判断当rowIndex = 1 时隐藏另外领两个头部单元格
        return { display: 'none' }
      }
    },
    ByEmployeeGroup() {
      this.tableData = []
      this.listLoading = true
      var data = {
        intlType: this.intlType || '',
        serviceType: this.serviceType || '',
        startTime: this.ruleForm.startTime || '',
        endTime: this.ruleForm.endTime || '',
        employeeName: this.ruleForm.name || ''
      }
      ByEmployeeGroup(data).then(response => {
        // init
        this.tableData = response.data
        response.data.employeeList.forEach(element => {
          // console.log(element.checkInTaskDTOList, 33333)
          if (element.checkInTaskDTOList.length < 1) {
            element.checkInTaskDTOList.push({})
          }
        })
        this.morningAvgSumRate = response.data.morningAvgSumRate
        this.eveningAvgSumRate = response.data.eveningAvgSumRate
        this.totalAvgRate = response.data.totalAvgRate
        // console.log(this.tableData)
        this.listLoading = false
      })
    },
    handleChange(value) {
      // console.log(value, 8)
      this.intlType = value[0].substring(0, 1)
      this.serviceType = value[1].substring(0, 1)
      this.ByEmployeeGroup()
    },
    queryData() {
      this.ByEmployeeGroup()
    },
    // 重置
    resetForm(formName) {
      this.intlType = ''
      this.serviceType = ''
      this.value = ''
      this.ruleForm.startTime = ''
      this.ruleForm.endTime = ''
      this.ruleForm.name = ''
    },
    // 拖拽开始
    allowDrop(ev) {
      ev.preventDefault()
    },
    dragstart(ev, item) {
      this.employeeGroupBean = item
      this.dragstartHtml = ev.target
    },
    drag(event) {},
    dragend(event) {},
    onDrop(event, item) {
      // if (!event.target.getAttribute('data')) {
      // event.target.appendChild(this.dragstartHtml)
      var data = {
        checkInTaskId: this.employeeGroupBean.checkInTaskId,
        employeeId: item.employeeId
      }
      deskManualDispatching(data).then(response => {
        if (response.data.resultCode === 0) {
          // 失败
          this.$message({
            type: 'error',
            message: response.data.resultMessage,
            duration: 1000
          })
          // event.target.removeChild(this.dragstartHtml)
          // this.dragstartHtml.remove()
          // event.target.removeChild(this.dragstartHtml)
        } else if (response.data.resultCode === 1) {
          event.target.appendChild(this.dragstartHtml)
          this.$message({
            type: 'success',
            message: response.data.resultMessage,
            duration: 1000
          })
          this.ByEmployeeGroup()
        }
      })
      // }

      // else {
      //   this.$message.error('任务冲突，分配失败')
      // }
      // var endExchangeIndex = event.target.getAttribute('data') || event.target.parentNode.getAttribute('data')
      // console.log(endExchangeIndex, '返回目标id')
    }
  }
}
</script>
<style lang="scss" scoped>
.AvgSumRate {
  font-size: 14px;
  span {
    margin-right: 20px;
  }
}
.title {
  padding: 15px 20px 5px;
  background: #26315a;
  border-top: 4px solid #509bc7;
}
.demo-ruleForm {
  .el-form-item {
    display: inline-block;
    margin-bottom: 0;
  }
}
.list {
  text-align: left;
  span {
    display: inline-block;
    margin: 5px 1%;
    background: #87a054;
    border-radius: 2px;
    width: 185px;
  }
}
.cur {
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  margin: 0px !important;
  // visibility: hidden;
}
</style>
