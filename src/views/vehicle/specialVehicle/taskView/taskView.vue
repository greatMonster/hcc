<template>
  <div class="warp">
    <div class="title">
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="demo-ruleForm" size="small">
        <el-form-item label="日期：" prop="region">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="航班号" prop="flightNo">
          <!-- <el-input v-model="ruleForm.flightNo" placeholder="请输入航班号" class="input-with-select" /> -->
          <el-select v-model="ruleForm.flightNo" filterable clearable placeholder="请选择">
            <el-option v-for="item in flightNoOptions" :key="item.id" :label="item.flightNo" :value="item.id" />
          </el-select>
          <el-button type="primary" size="mini" @click="search(ruleForm.flightNo)">查 询</el-button>
          <el-button type="primary" size="mini" @click="exportExcel(ruleForm.flightNo)">导 出(航班视角)</el-button>
          <el-button type="primary" size="mini" @click="exportExcelEmployee">导 出(员工视角)</el-button>
          <el-button type="primary" size="mini" @click="search('flag')">非计划类任务查询</el-button>
        </el-form-item>
      </el-form>
      <div ref="headerFilter" class="AvgSumRate">
        <div>
          <a @click="init">航班总数：{{ taskState.flightNum }}</a
          >,
          <div>任务总数：{{ taskState.totalTaskNum }}</div>
          ,
          <div>自动派工率：{{ taskState.automaticAssignmentRate }},</div>
        </div>
        <a @click="filtersBtn(1, '未分配', taskState.unassignedNum)">
          <span style="background: #409eff" />未分配 :
          <ins>{{ taskState.unassignedNum }}</ins>
        </a>
        <a @click="filtersBtn(2, '已分配', taskState.assignedNum)">
          <span style="background: #1155f0" />已分配 :
          <ins>{{ taskState.assignedNum }}</ins>
        </a>
        <a @click="filtersBtn(3, '已接收', taskState.receivedNum)">
          <span style="background: #67c23a" />已接收 :
          <ins>{{ taskState.receivedNum }}</ins>
        </a>
        <!-- <a @click="filtersBtn(3)">
          <span style="background: #67c23a" />已开始 :
          <ins>{{ taskState.receivedNum }}</ins>
        </a>-->
        <a @click="filtersBtn(4, '已完成', taskState.completedNum)">
          <span style="background: #a4abc0" />已完成 :
          <ins>{{ taskState.completedNum }}</ins>
        </a>
        <a @click="filtersBtn(5, '已取消', taskState.canceledNum)">
          <span style="background: #99004d" />已取消 :
          <ins>{{ taskState.canceledNum }}</ins>
        </a>
        <a @click="filtersBtn(7, '告警', taskState.warningNum)">
          <span style="color: yellow">！</span>告警 :
          <ins>{{ taskState.warningNum }}</ins>
        </a>
        <a @click="filtersBtn(6, '已超时', taskState.timeoutNum)">
          <span style="background: #ff3399" />已超时 :
          <ins>{{ taskState.timeoutNum }}</ins>
        </a>
        <a @click="filtersBtn(9, '锁定', taskState.unassignedLockedNum + taskState.assignedLockedNum)">
          <span style="color: #67c13a"> <i class="el-icon-lock" /> </span>锁定 :
          <ins>{{ taskState.unassignedLockedNum + taskState.assignedLockedNum }}</ins>
        </a>
      </div>
    </div>

    <el-table v-loading="listLoading" element-loading-text="加载中..." :max-height="tableHeight" style="width: 100%" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" stripe :data="tableData">
      <el-table-column type="index" width="45" label />
      <el-table-column prop="flightNo" label="航班号" width="80" />
      <el-table-column prop="status" label="状态" v-if="businessDomainId === '103'" width="80" />
      <el-table-column prop="tailNo" label="机号" v-if="businessDomainId === '103'" width="80" />
      <el-table-column prop="position" label="机位" width="50" />
      <el-table-column prop="flightType" label="进/出港" width="70">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.flightType == 'D' ? '#e97ce5' : '#a9a4a4' }">{{ scope.row.flightType | joinDate2 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="std" label="计划起飞" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.std" :style="{ color: scope.row.flightType == 'A' ? '#a9a4a4' : '#e97ce5' }">{{ scope.row.std | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="etd" label="预计起飞" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.etd" :style="{ color: scope.row.flightType == 'A' ? '#a9a4a4' : '#e97ce5' }">{{ scope.row.etd | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="atd" label="实际起飞" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.atd" :style="{ color: scope.row.flightType == 'A' ? '#a9a4a4' : '#e97ce5' }">{{ scope.row.atd | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sta" label="计划到达" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sta" :style="{ color: scope.row.flightType == 'D' ? '#a9a4a4' : '#fff' }">{{ scope.row.sta | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eta" label="预计到达" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.eta" :style="{ color: scope.row.flightType == 'D' ? '#a9a4a4' : '#fff' }">{{ scope.row.eta | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ata" label="实际到达" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ata" :style="{ color: scope.row.flightType == 'D' ? '#a9a4a4' : '#fff' }">{{ scope.row.ata | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aircraftType" label="机型" width="60" />
      <el-table-column prop="cabinLayout" label="人数(经济/高端)" width="120" />
      <el-table-column prop="taskNum" label="任务数" width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.tasks">{{ scope.row.tasks.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" prop="tasks">
        <template slot-scope="scope">
          <div class="list">
            <div v-for="(item, index) in scope.row.tasks" :key="index" class="divlist" :data="index">
              <el-popover trigger="hover" placement="top">
                <p>任务: {{ item.name }}</p>
                <p>计划开始时间：{{ item.planInPlace ? item.planInPlace.substring(10, 16) : '' }}</p>
                <p>计划结束时间：{{ item.planEnd ? item.planEnd.substring(10, 16) : '' }}</p>
                <p>实际开始时间：{{ item.actualInPlace ? item.actualInPlace.substring(10, 16) : '' }}</p>
                <p>实际结束时间：{{ item.actualEnd ? item.actualEnd.substring(10, 16) : '' }}</p>
                <p>人员：{{ item.employeeName }}</p>
                <p>id:{{ item.id }}</p>
                <p v-if="item.alarmType">
                  <span>告警原因：</span>
                  <span>{{ item.alarmType }}</span>
                </p>
                <div slot="reference" class="taskState">
                  <div
                    :class="{ assigned: item.taskState == 2, unassigned: item.taskState == 1, received: item.taskState == 3, completed: item.taskState == 4, canceled: item.taskState == 5, timeout: item.taskState == 6, newstaus: item.id == newValue }"
                    :staus="item.taskState"
                  >
                    <span v-if="item.taskRunningState == 2" style="color: yellow">!</span>
                    <span v-if="item.taskState === 8" style="color: green">
                      <i class="el-icon-lock" />
                    </span>
                    <span v-if="item.taskState === 9" style="color: #67c13a">
                      <i class="el-icon-lock" />
                    </span>
                    {{ item.name }}
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination background :page-size="ruleForm.pageSize" layout="total, prev, pager, next" :total="ruleForm.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
    <el-pagination background :page-size="ruleForm.pageSize" layout="slot, prev, pager, next" :total="ruleForm.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <span style="color: white">共{{ ruleForm.total }}个航班</span>
      <span style="color: white">{{ statusNum }}</span>
    </el-pagination>
  </div>
</template>
<script>
import { getFlightrtTasks, getFlightPlanInfort } from '@/apiNew/vehicle'
import { addTemporaryTaskData } from '@/apiNew/specialVehicle'
export default {
  name: 'TaskViewNew',
  filters: {
    joinDate: function (value) {
      if (value) {
        value = value.substring(11, 16)
      } else {
        value = ''
      }
      return value
    },
    joinName: function (value) {
      if (value) {
        value = value.substring(7, 20)
      } else {
        value = ''
      }
      return value
    },
    joinDate2: function (value) {
      if (value === 'A') {
        value = '进港'
        return value
      } else {
        value = '出港'
        return value
      }
    }
  },
  data() {
    return {
      statusNum: '',
      tableHeight: null,
      airport: this.$store.state.user.airport || '',
      flightNoOptions: [],
      date: this.getNowFormatDate(),
      businessDomainId: this.$route.query.businessDomainId || '',
      options: [],
      ruleForm: {
        date: this.$route.query.date ? this.$route.query.date : this.getNowFormatDate(),
        // data: this.getNowFormatDate(),
        pageSize: 1000,
        pageNum: '1',
        currentPage: '1',
        total: 0,
        flightNo: ''
      },
      tableData: [],
      listLoading: false,
      newValue: localStorage.name,
      taskState: {},
      filtersData: [],
      flag: 1
    }
  },
  watch: {
    newValue: {
      handler: function (val, oldval) {
        // console.log(val, this.$store.state.list.newValue, 888)
        // this.newValue = val
        // console.log(this.$store.state.list, 7777)
      },
      deep: true, // 对象内部的属性监听，也叫深度监听
      immediate: true
    }
  },
  created() {
    this.init()
    this.getFlightNo()
    // this.getFlightstatsFn()
    window.addEventListener('storage', function (e) {
      this.newValue = e.newValue
    })
    // console.log(this.newValue, 777)
    // this.$store.commit('ruleId', { id: this.newValue })
  },
  methods: {
    getFlightNo() {
      addTemporaryTaskData({ flightNo: '', date: this.date, airportId: this.airport.airportId || ''}).then((response) => {
        response.data.data.unshift({ id: '', flightNo: '全部' })
        this.flightNoOptions = response.data.data
      })
    },
    init() {
      // console.log(document.referrer, 666)
      this.listLoading = true
      this.ruleForm.businessDomainId = this.businessDomainId
      this.ruleForm.airportId = this.airport.airportId
      this.ruleForm.flag = this.flag
      // this.ruleForm.date = this.date
      if (this.ruleForm.flightNo) {
        this.flightNoOptions.find((item) => {
          if (item.id === this.ruleForm.flightNo) {
            this.ruleForm.flightNo = item.flightNo
          }
        })
      }
      // console.log(this.ruleForm, 112)
      getFlightPlanInfort(this.ruleForm).then((response) => {
        // init
        if (response.data.data) {
          this.tableData = response.data.data.list
          this.filtersData = response.data.data.list
          this.ruleForm.total = response.data.data.total
        }
        // if (response.data.total) {
        //   this.ruleForm.total = parseInt(response.data.total)
        // }
        this.listLoading = false
        this.$nextTick(() => {
          this.tableHeight = window.innerHeight - this.$refs.headerFilter.getBoundingClientRect().top - 70
          this.getFlightstatsFn()
        })
      })
    },
    exportExcel(item) {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'rtm/api/v1/rtTasks/flight/export?date=' + this.ruleForm.date + '&businessDomainId=' + this.$route.query.businessDomainId + '&flightNo=' + item + ''
    },
    exportExcelEmployee() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'rtm/api/v1/rtTasks/employee/export?date=' + this.ruleForm.date + '&businessDomainId=' + this.$route.query.businessDomainId
    },
    getFlightstatsFn() {
      this.ruleForm.businessDomainId = this.businessDomainId
      // this.ruleForm.date = this.date
      // console.log(this.ruleForm, 223)
      getFlightrtTasks(this.ruleForm).then((response) => {
        // init
        if (response.data.data) {
          this.taskState = response.data.data
        }
        if (this.$route.query.taskStatus) {
          this.filtersBtn(7, '告警', this.taskState.warningNum)
        }
      })
    },
    filtersBtn(data, name, number) {
      this.tableData = []
      this.statusNum = `共${number}个${name}任务`
      if (data === 7) {
        // 告警
        this.tableData = []
        this.filtersData.forEach((element) => {
          if (element.tasks) {
            element.tasks.forEach((item) => {
              if (item.taskRunningState === 2) {
                this.tableData.push(element)
                // this.tableData.forEach(val => {
                //   if (element.id !== val.id) {
                //     this.tableData.push(element)
                //   }
                // })
              }
            })
          }
        })
        this.tableData = this.deduplication(this.tableData)
        console.log(this.tableData.length, 666)
        this.ruleForm.total = this.tableData.length
      } else if (data === 9) {
        // 锁定
        this.tableData = []
        this.filtersData.forEach((element) => {
          if (element.tasks) {
            element.tasks.forEach((item) => {
              if (item.taskState === 8 || item.taskState === 9) {
                this.tableData.push(element)
              }
            })
          }
        })
        this.tableData = this.deduplication(this.tableData)
        this.ruleForm.total = this.tableData.length
      } else {
        this.tableData = []
        this.filtersData.forEach((element) => {
          if (element.tasks) {
            element.tasks.forEach((item) => {
              if (item.taskState === data) {
                this.tableData.push(element)
              }
            })
            // element.tasks.forEach(item => {
            //   if (item.taskState === data) {
            //     this.tableData.forEach(val => {
            //       if (element.id !== val.id) {
            //         this.tableData.push(element)
            //       }
            //     })
            //   }
            // })
          }
        })
        this.tableData = this.deduplication(this.tableData)
        this.ruleForm.total = this.tableData.length
      }
    },
    deduplication(objArray) {
      var hash = {}
      // reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
      objArray = objArray.reduce(function (item, next) {
        // 这是针对数组项操作的函数，对于每个数组项，reduce方法都会将其调用一次
        // 可使用最多四个参数来声明回调函数（第一个参数：通过上一次调用回调函数获得的值;第二个参数：当前数组元素的值；第三个参数：当前数组元素的数字索引；第四个参数：包含该元素的数组对象）
        // 这里只使用了两个参数，所以item和next分别代表上一次调用回调函数后的值和objArray项值
        hash[next.id] ? '' : (hash[next.id] = true && item.push(next)) // 与func3逻辑相似
        return item
      }, []) // 初始值是一个空对象，使用reduce方法返回的是空对象通过叠加执行之后的结果
      return objArray
    },
    openNext(item) {
      // 返回派工页面
      var data = item.planInPlace.substring(0, 10)
      const routeData = this.$router.resolve({ path: '/vehicle/specialVehicle/dispatching', query: { id: item.id, skillId: item.skillId, data: data, businessDomainId: this.businessDomainId } })
      window.open(routeData.href)
    },
    pickdta(e) {
      if (e == null) {
        // 如果清空了日期会报错，给设置一个默认日期
        this.ruleForm.data = '2019-01-15'
        this.init()
      } else {
        this.ruleForm.data = e
        this.init()
      }
    },
    search(item) {
      if (item === 'flag') {
        this.flag = 0
      } else {
        this.flag = 1
        this.ruleForm.flightNo = item
      }
      this.init()
    },
    // 分页
    handleSizeChange(val) {
      this.ruleForm.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.ruleForm.pageNum = val
      this.init()
    },
    getNowFormatDate() {
      // 获取当天时间
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  }
}
</script>
<style scoped>
.warp /deep/ .el-pagination {
  margin: 5px;
}
</style>
<style lang="scss" scoped>
.total span {
  margin-left: 10px;
}
.AvgSumRate {
  font-size: 14px;
  text-align: right;
  margin: 5px 0;
  div {
    display: inline-block;
  }
  a {
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    span {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
    ins {
      text-decoration: none;
    }
  }
}
.title {
  padding: 10px 10px 5px;
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
  div.divlist {
    display: inline-block;
    width: 150px;
    margin: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 12px;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.input-with-select {
  width: 150px;
}
</style>
