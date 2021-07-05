<template>
  <div class="warp">
    <h3>值守点实时分布图</h3>
    <div class="tips">
      <!-- <label>机场：</label>
      <el-select v-model="siteId" placeholder="请选择" style="width: 160px" size="small" @change="siteChange">
        <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <label>日期：</label>
      <el-date-picker v-model="date" size="small" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeData(date)" />
      <el-button size="small" @click="linktotask">资源视角</el-button>
      <el-button size="small" @click="linktodesk">值守点视角</el-button>
      <el-button size="small" @click="setTask">设置任务</el-button>
      <!-- <el-button size="small" @click="startDistribute">派工</el-button> -->
      <el-button size="small" @click="generateTasks">生成任务</el-button>
      <!-- <el-button size="small" @click="showChart">柜台覆盖信息图</el-button> -->
    </div>

    <div class="top">
      <div>
        <p>开放 / 关闭数</p>
        <p class="num">
          <span class="green">{{ tips.openNumb }}</span>
          / {{ tips.close }}
        </p>
      </div>
      <div>
        <p>现场值守人员</p>
        <p class="num">
          <span class="green">{{ tips.openNumb1 }}</span> 人
        </p>
      </div>
      <div style="width: 30%; display: flex; align-items: center; justify-content: center">
        <p><span class="open3" />:无人值守 <span class="open" />:有人值守&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="close" />:关闭&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
      </div>
    </div>
    <div v-if="noData" style="width: 100%; height: 100px; line-height: 100px; text-align: center">暂无数据</div>
    <ul v-loading="loading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <li v-for="(item, index) in list" :key="index">
        <div class="left">
          <span>{{ item.skipName || '经理' }}</span>
        </div>
        <div class="right">
          <div v-for="(item2, i) in item.guardPointVOList" :key="i" class="item">
            <el-tooltip placement="bottom">
              <!-- deskclass代表关闭，为灰色；personlessDeskclassD代表无人粉色，hasdeskclass有人，橙色 -->
              <div :class="[{ personlessDeskclassD: item2.personlessDeskclassD }, { hasdeskclass: !item2.personlessDeskclassD && !item2.deskclass }, { deskclass: item2.deskclass }]">
                {{ item2.pointName }}
                <br />
                {{ item2.taskTypeName }}
              </div>
              <div slot="content">
                <p>
                  当前值班员：
                  <span v-if="item2.bean.employeeGroupName">{{ item2.bean.employeeGroupName }}</span>
                </p>
                <p>
                  工作时间：
                  <span v-if="item2.bean.planStarTime">{{ item2.bean.planStarTime }} -- {{ item2.bean.planEndTime }}</span>
                </p>
                <p>
                  开放信息：
                  <span v-if="item2.personLessList.length > 0">
                    <div v-for="(item3, ind) in item2.personLessList" :key="ind">
                      <span style="display: block; height: 20px; line-height: 20px; margin-left: 15px">{{ item3.beginTime }} -- {{ item3.endTime }} {{ item3.dutyPerson }}</span>
                    </div>
                  </span>
                </p>
              </div>
            </el-tooltip>
            <!-- <p>{{ item2.deskRegion }}</p> -->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { recalculation1, stopRecalculation1, recalculationStatus } from '@/api/checkInData'
import { initTable, generateTask } from '@/apiNew/guardPoint'
// import { parameterList } from '@/api/checkInNewHome'
export default {
  name: 'CheckIn',
  filters: {
    joinDate: function (value) {
      value = value.substring(11, 16)
      return value
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      date: this.getNowFormatDate(),
      businessDomainId: this.$route.query.businessDomainId || 0,
      timer: '',
      recShow: true,
      noData: false,
      dialogTableVisible: false,
      dataList: {},
      optionsSiteId: [],
      siteId: '',
      remark: '',
      currentDate: '',
      // dutyPerson: '',
      dutyStartTime: '',
      dutyEndTime: '',
      currentMatchRatio: '',
      currentTime: dayjs(),
      startTime: dayjs().subtract(5, 'hour').toString(),
      objectClass: {
        deskOpenclass: false,
        deskclose: false,
        deskclass: false
      },
      loading: false,
      loadingChart: false,
      intlType: '',
      regions: [],
      list: [],
      deskRegion: '',
      serviceType: '',
      tips: {
        openNumb: '',
        close: '',
        openNumb1: ''
      }
    }
  },
  created() {
    // this.init()
    // this.intlTypeList()
    // this.siteIdList()
    this.statusInit()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    generateTasks() {
      var data = {
        airportId: this.airport.airportId || '',
        businessDomainId: this.businessDomainId
      }
      generateTask(data)
        .then((res) => {
          this.$message.success('生成任务成功')
          this.init()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    change2(value) {
      this.intlType = value
      // this.init()
      this.statusInit()
      // this.intlTypeList()
    },
    // intlTypeList() {
    //   this.regions = []
    //   parameterList()
    //     .then(response => {
    //       // if (response.data.data) {
    //       if (response.data.data.length !== 0) {
    //         response.data.data.forEach(element => {
    //           if (element.airportId === this.siteId) {
    //             this.regions.push(element)
    //           }
    //         })
    //         if (this.regions.length !== 0) {
    //           this.intlType = this.regions[0].id
    //         } else {
    //           this.regions = [{ id: '', composeName: '暂无数据' }]
    //           this.intlType = this.regions[0].id
    //         }
    //         // this.init()
    //         this.statusInit()
    //         // this.initable()
    //       } else {
    //         this.$message.success('暂无参数组合数据')
    //       }
    //       // }
    //     })
    //     .catch(e => {
    //       this.$message({
    //         type: 'error',
    //         message: e.response.data.message
    //       })
    //     })
    // },
    siteIdList() {
      var data = {
        includeTerminals: false
      }
      this.regions = []
      initAirpot(data)
        .then((response) => {
          if (response.data.data) {
            this.optionsSiteId = response.data.data
            this.siteId = response.data.data[0].id
            // this.init()
            // this.intlTypeList()
            this.statusInit()
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    siteChange(e) {
      this.regions = []
      this.airport.airportId = e
      this.statusInit()
      // this.intlTypeList()
    },
    getTime() {},
    changeData(e) {
      // 切换日期
      this.statusInit()
    },
    init() {
      this.getTime()
      var data = {
        // airportId: this.$route.query.airportId || this.airport.airportId,
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType || '',
        businessDomainId: this.businessDomainId,
        date: this.date
      }
      this.loading = true
      this.noData = false
      this.list = []
      initTable(data)
        .then((response) => {
          var data1 = response.data.data
          const transfer = Number(data1.currentMatchRatio * 100).toFixed(2)
          this.list = data1.guardSkipVOList
          this.currentMatchRatio = transfer + '%'
          this.loading = false

          if (data1) {
            this.remark = data1.maximumLatency
          }
          let cont = 0
          let close = 0
          let openNumb1 = 0
          if (!data1.guardSkipVOList) {
            this.$message.success('暂无数据')
            this.noData = true
          } else {
            this.noData = false
            // debugger
            if (data1.guardSkipVOList) {
              data1.guardSkipVOList.forEach((element) => {
                // element.checkInDeskBeans.reverse()
                element.guardPointVOList.forEach((element2) => {
                  // if (element2.checkInTaskBeanList.length > 0) {
                  let aside = 0
                  let personless = 0
                  element2.bean = { employeeGroupName: '' }
                  element2.personLessList = []
                  if (element2.guardTaskVOs) {
                    element2.guardTaskVOs.forEach((element3) => {
                      // element4.forEach(element3 => {
                      // const time = dayjs(element3.beginTime).hour() * 60 * 60 + dayjs(element3.beginTime).minute() * 60 + dayjs(element3.beginTime).second()
                      // const closeTime = dayjs(element3.endTime).hour() * 60 * 60 + dayjs(element3.endTime).minute() * 60 + dayjs(element3.endTime).second()
                      // const now = dayjs().hour() * 60 * 60 + dayjs().minute() * 60 + dayjs().second()
                      const time = new Date(element3.beginTime).getTime()
                      const closeTime = new Date(element3.endTime).getTime()
                      const selectedTime = this.date + ' ' + `${dayjs().hour()}:${dayjs().minute()}:${dayjs().second()}`
                      const now = new Date(selectedTime).getTime()
                      // element3.bean = {}
                      element2.taskTypeName = element3.taskTypeName
                      if (element3.employeeName == null) {
                        element2.personLessList.push({ beginTime: element3.beginTime, endTime: element3.endTime, dutyPerson: '无人' })
                      } else {
                        element2.personLessList.push({ beginTime: element3.beginTime, endTime: element3.endTime, dutyPerson: element3.employeeName })
                      }
                      if (now > time && now < closeTime) {
                        aside = 1
                        var nameList = ''
                        if (element3.employeeName !== null) {
                          openNumb1 += 1
                          nameList = element3.employeeName
                          // element2.bean.employeeGroupName = element3.employeeName
                        } else {
                          // personless = 1
                          // element2.bean.employeeGroupName = '无'
                          nameList = '无人'
                        }
                        element2.bean.employeeGroupName += nameList + ' '
                        element2.bean.planStarTime = element3.beginTime
                        element2.bean.planEndTime = element3.endTime
                      }
                      // })
                    })
                    // }
                  }
                  const hasPerson = element2.bean.employeeGroupName.trim().split(' ')
                  for (let i = 0; i < hasPerson.length; i++) {
                    if (hasPerson[i] !== '无人') {
                      personless = 0
                      break
                    } else {
                      personless = 1
                    }
                  }
                  if (aside === 1) {
                    if (personless === 1) {
                      element2.personlessDeskclassD = true
                    }
                    // else if (personless === 1 && element2.openType === 1) {
                    //   element2.personlessDeskclassF = true
                    // }
                    element2.deskclass = false
                    cont++
                  } else {
                    element2.deskclass = true
                    close++
                  }
                })
                this.tips.openNumb = cont
                this.tips.close = close
                this.tips.openNumb1 = openNumb1
              })
            }
          }
        })
        .catch((e) => {
          this.loading = false
          this.noData = true
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    statusInit() {
      this.timer = setInterval(this.status(), 5000)
    },
    status() {
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType || '',
        businessDomainId: this.businessDomainId
      }
      this.loading = true
      // debugger
      recalculationStatus(data)
        .then((response) => {
          if (response.data.data.status === '1') {
            this.loading = false
            this.recShow = true
            clearInterval(this.timer)
            this.init()
          }
        })
        .catch((e) => {
          this.recShow = true
          this.loading = false
          clearInterval(this.timer)
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    handleChange(value) {
      this.intlType = value
      this.init()
    },
    linktotask() {
      // this.$router.push({ path: '/dispatching/guardPoint/employeetasks1', query: { businessDomainId: this.businessDomainId, siteId: this.airport.airportId || 10, deskPredictions: this.intlType || '' } })
      var routeData = this.$router.resolve({ path: '/dispatching/guardPoint/employeetasks1', query: { businessDomainId: this.businessDomainId, siteId: this.airport.airportId || 10, deskPredictions: this.intlType || '', date: this.date } })
      window.open(routeData.href, '_blank')
    },
    linktodesk() {
      // this.$router.push({ path: '/dispatching/guardPoint/guardPoint2', query: { businessDomainId: this.businessDomainId, siteId: this.airport.airportId || 10, deskPredictions: this.intlType || '' } })
      var routeData = this.$router.resolve({ path: '/dispatching/guardPoint/guardPoint2', query: { businessDomainId: this.businessDomainId, siteId: this.airport.airportId || 10, deskPredictions: this.intlType || '', date: this.date } })
      window.open(routeData.href, '_blank')
    },
    setTask() {
      this.$router.push({ path: '/dispatching/guardPoint/setGuardTask', query: { businessDomainId: this.businessDomainId, siteId: this.airport.airportId || 10, deskPredictions: this.intlType || '' } })
    },
    async recalculation() {
      // 重新计算
      this.loading = true
      this.recShow = false
      this.timer = ''
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType || '',
        businessDomainId: this.businessDomainId
      }
      var recalStatus = await recalculation1(data)
        .then((response) => {
          return true
          // this.timer = setInterval(this.status(), 2000)
        })
        .catch((e) => {
          this.recShow = false
          this.loading = false
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
          return false
        })
      if (recalStatus) {
        this.timer = setInterval(() => this.status(), 5000)
      }
    },
    stopRecalculation() {
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType || '',
        businessDomainId: this.businessDomainId
      }
      stopRecalculation1(data)
        .then((response) => {
          this.recShow = true
          this.init()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
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
<style lang="scss" scoped>
.manager {
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  width: 65px;
  height: 50px;
  line-height: 50px;
  border: 2px solid #87a054;
  text-align: center;
  color: #87a054;
  margin: 10px 10px 0 10px;
  display: inline-block;
}
.green {
  color: #87a054;
}
.manager {
  .svgstyle {
    top: 2px;
    left: 2px;
  }
}
.svgstyle {
  position: absolute;
  top: 13px;
  left: 12px;
}
.warp {
  color: #fff;
  .tips {
    margin: 10px 0 10px 10px;
  }
  h3 {
    text-align: center;
    margin: 0;
  }
  .top {
    margin: 0 10px;
    height: 80px;
    div {
      display: inline-block;
      width: 16%;
      background: #232c47;
      text-align: center;
      padding: 10px 0;
      height: 100%;
      float: left;
      margin-right: 2px;
      padding-top: 12px;
      p {
        margin: 5px 0;
        span {
          margin-left: 15px;
        }
      }
      .num {
        font-size: 25px;
        color: #ccc;
      }
    }
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
        // border-bottom: 1px solid #62697e;
        p {
          margin: 5px;
          font-size: 12px;
          border-radius: 3px;
          color: #737b91;
        }
        div {
          cursor: pointer;
          border-radius: 3px;
          // border: 3px solid #87a054;
          width: 70px;
          height: 50px;
          text-align: center;
          margin: 10px 8px 0 8px;
          align-items: center;
          display: flex;
          justify-content: center;
          font-size: 12px;
          //常开
          &.deskOpenclass {
            color: #6a9512;
            border: 2px solid #6a9512;
            // font-weight: bold;
          }
          //动态
          &.deskclose {
            color: #84dd84;
            border: 2px solid #84dd84;
            // font-weight: bold;
          }
          &.deskclass {
            color: #babbbf;
            border: 2px solid #babbbf;
            // font-weight: bold;
          }
          &.personlessDeskclassF {
            border: 2px solid #e291d1;
            // font-weight: bold;
          }
          &.personlessDeskclassD {
            border: 2px solid #e291d1;
            // font-weight: bold;
          }
          // 有人
          &.hasdeskclass {
            color: #ff8c19;
            border: 2px solid #ff8c19;
            // font-weight: bold;
          }
        }
      }
    }
  }
}
.open {
  width: 10px;
  height: 10px;
  // background: #6a9512;
  background: #ff8c1a;
  display: inline-block;
  border-radius: 3px;
}
.open2 {
  width: 10px;
  height: 10px;
  background: #84dd84;
  display: inline-block;
  border-radius: 3px;
}
.open3 {
  width: 10px;
  height: 10px;
  background: #e291d1;
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
</style>

