<template>
  <div class="warp desk-wrap">
    <h3>安检通道实时分布图</h3>
    <div class="tips">
      <label>日期：</label>
      <el-date-picker v-model="date" size="small" :clearable="isClearable" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px" @change="changeDate(date)" />
      <!-- <label>机场：</label>
      <el-select v-model="siteId" placeholder="请选择" style="width: 160px" size="small" @change="siteChange">
        <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> -->
      <label>安检通道服务参数：</label>
      <el-select v-model="intlType" size="small" multiple collapse-tags placeholder="请选择" @change="change2">
        <!-- <el-option v-for="item in regions" :key="item.id" :label="item.composeName" :value="item.id" /> -->
        <el-option v-for="item in regions" :key="item.id" :label="item.composeName" :value="item.id" />
      </el-select>
      <el-button size="small" @click="linktotask">资源视角</el-button>
      <el-button size="small" @click="linktodesk">安检通道视角</el-button>
      <el-button v-if="recShow" size="small" @click="recalculation">重新计算</el-button>
      <el-button v-else size="small" @click="stopRecalculation">停止计算</el-button>
      <el-button size="small" @click="showChart">安检通道覆盖信息图</el-button>
      <!-- <el-button size="small" @click="dispatchFcn">定时派工</el-button> -->
      <!-- <el-button size="small" @click="taskGeneration">任务生成</el-button> -->
      <!-- <el-button size="small" @click="taskAssign">任务派工</el-button> -->
      <!-- <el-button size="small" @click="openRule">自动派工规则</el-button> -->
      <el-button size="small" @click="jumpTaskList">任务列表</el-button>

      <!-- <el-button size="small" @click="predispatchFcn">预派工算法</el-button>
      <el-button size="small" @click="adddispatchFcn">追加派工算法</el-button>-->
    </div>

    <div class="top">
      <div>
        <p>开放 / 关闭数</p>
        <p class="num">
          <span class="green">{{ tips.openNumb }}</span>
          / {{ tips.close }}
        </p>
      </div>
      <!-- <div>
        <p>国际高端开放 / 关闭数</p>
        <p class="num">
          <span class="green">15</span> / 3
        </p>
      </div>-->
      <div>
        <p>现场安检资源</p>
        <p class="num">
          <el-tooltip placement="bottom">
            <span class="green">{{ tips.openNumb1 }}</span> 人
            <div slot="content">
              <div v-if="checkinEmployee.length > 0">
                <div v-for="(itemm, index) in checkinEmployee" :key="index">{{ itemm }}</div>
              </div>
            </div>
          </el-tooltip>
        </p>
      </div>
      <!-- <div>
        <p>任务匹配率</p>
        <p style="color:#87a054;font-size:25px;">{{ currentMatchRatio }}</p>
      </div>-->
      <!-- <div>
        <p>柜台通道最长排队时间</p>
        <p class="num">
          <span class="green">{{ remark }}</span> 分钟
        </p>
      </div>-->
      <div style="width: 30%">
        <p><span class="open" />:常开&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="open2" />:动态 <span class="open3" />:无人值守</p>
        <p>
          <span style="margin-left: -15px"> <svg-icon icon-class="person" />:值班经理 </span>
          <span> <svg-icon icon-class="diamond" />:高端 </span>
          <span class="close" />:关闭
        </p>
      </div>
      <!-- <div>
        <p>当前时间：</p>
        <p>{{ currentDate }}</p>
      </div>-->
    </div>
    <div v-if="noData" style="width: 100%; height: 100px; line-height: 100px; text-align: center">暂无数据</div>
    <div style="min-height: 200px" v-loading="loading" element-loading-text="计算中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <ul v-if="list && list.length > 0" style="height: 200px">
        <li v-for="(item, index) in list" :key="index">
          <div class="left">
            <span>{{ item.securityDomainName || '经理' }}</span>
          </div>
          <div class="right">
            <div v-for="(item2, i) in item.securityCheckChannelTaskVOS" :key="i" class="item">
              <el-tooltip placement="bottom">
                <!-- 1动态浅绿，0常开绿色 -->
                <div
                  :class="[
                    { deskclose: item2.openType == '1' },
                    { deskOpenclass: item2.openType == '0' },
                    { deskOpenclass: item2.deskCode == 'J18' || item2.deskCode == 'J19' || item2.deskCode == 'B01' },
                    { deskclass: item2.deskclass },
                    { personlessDeskclassF: item2.personlessDeskclassF },
                    { personlessDeskclassD: item2.personlessDeskclassD }
                  ]"
                >
                  <svg-icon v-if="item2.deskCode == '经理'" icon-class="person" class="svgstyle" />
                  <svg-icon v-if="item2.deskCode == 'K14' || item2.deskCode == 'H01'" icon-class="heart" class="svgstyle" />
                  <svg-icon v-if="item2.deskCode == 'K15'" icon-class="soldier" class="svgstyle" />
                  <svg-icon v-if="item2.serviceType == 'V'" icon-class="diamond" class="svgstyle" />
                  <svg-icon v-if="item2.deskCode == 'J18' || item2.deskCode == 'J19' || item2.deskCode == 'B01'" icon-class="jiankong" class="svgstyle" />
                  <svg-icon v-if="item2.deskCode == 'H11' || item2.deskCode == 'H12' || item2.deskCode == 'H13' || item2.deskCode == 'H14'" icon-class="meiguo" class="svgstyle" />
                  {{ item2.securityName }}
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
                        <span style="display: block; height: 20px; line-height: 20px; margin-left: 15px">{{ item3.startTime }} -- {{ item3.endTime }} {{ item3.dutyPerson }}</span>
                      </div>
                    </span>
                  </p>
                </div>
              </el-tooltip>
              <p>{{ item2.deskRegion }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogdispathVisible" title="定时派工">
      <el-form ref="form" :model="form" :rules="formrules">
        <el-form-item label="机场" prop="siteId" :label-width="formLabelWidth">
          <el-select v-model="form.airportId" placeholder="请选择" disabled>
            <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="params" label="安检通道服务参数" :label-width="formLabelWidth">
          <el-select v-model="form.params" placeholder="请选择" multiple collapse-tags>
            <el-option v-for="item in regions" :key="item.id" :label="item.composeName" :value="item.id + ''" />
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="时间" :label-width="formLabelWidth">
          <el-time-select
            v-model="form.time"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00'
            }"
            placeholder="选择时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdispathVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddbtn('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag title="安检通道覆盖信息图表" width="70%" :visible.sync="dialogTableVisible" :close="closeImport">
      <div v-loading="loadingChart">
        <h3 style="margin-top: 0">{{ lineChartDataBig.day }}</h3>
        <LineChartBig :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
      </div>
    </el-dialog>
    <!-- 修改规则 -->
    <el-dialog v-dialogDrag title="派工规则" :visible.sync="editSkillVisible" width="60%">
      <el-form ref="formEdit" :model="formEdit" :label-width="formLabelWidth">
        <el-form-item prop="beforeTime" label="工作准备时间">
          任务开始前(分钟)
          <el-input v-model="formEdit.beforeTime" size="small" style="width: 60%" />
        </el-form-item>
        <el-form-item prop="beginTime" label="自动派工开始时间">
          <el-time-picker v-model="formEdit.beginTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="自动派工结束时间">
          <el-time-picker v-model="formEdit.endTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item prop="timeInterval" label="派工间隔(分钟)">
          <el-input v-model="formEdit.timeInterval" size="small" />
        </el-form-item>
        <el-form-item prop="alarmTime" label="告警时间">
          任务开始前(分钟)
          <el-input v-model="formEdit.alarmTime" size="small" style="width: 60%" />&nbsp;&nbsp;
        </el-form-item>
        <el-form-item prop="refreshTime" label="刷新时间(秒)">
          <el-input v-model="formEdit.refreshTime" size="small" />
        </el-form-item>
        <el-form-item prop="tp" label="预派工窗口时间(分钟)">
          <el-input v-model="formEdit.tp" size="small" />
        </el-form-item>
        <el-form-item prop="lockingTime" label="任务提前锁定时间(分钟)">
          <el-input v-model="formEdit.lockingTime" size="small" />
        </el-form-item>
        <el-form-item prop="associateTime" label="任务拼接时间间隔(分钟)">
          <el-input v-model.number="formEdit.associateTime" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { recalculation1, stopRecalculation1, recalculationStatus, dispachData, dispachFcn, taskGenerate, taskAssignmention } from '@/api/checkInData'
import { distribution1, deskChart1 } from '@/apiNew/securityDispatching'
import { queryList } from '@/apiNew/securityChannel'
import LineChartBig from '../channelView/components/LineChartBig'
import { getBusParam, updateBusParam } from '@/apiNew/vehicle'
export default {
  name: 'CheckIn',
  components: { LineChartBig },
  filters: {
    joinDate: function (value) {
      value = value.substring(11, 16)
      return value
    }
  },
  data() {
    return {
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId || 0,
      isClearable: false,
      arrowControl: true,
      date: this.getNowFormatDate(),
      editSkillVisible: false,
      formEdit: { whichDay: 0 },
      calcIndex: 0,
      form: {
        airportId: '',
        params: '',
        time: ''
      },
      formLabelWidth: '170px',
      dialogdispathVisible: false,
      checkinEmployee: [],
      socket: null, // 建立的连接
      lockReconnect: false, // 是否真正建立连接
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      timer: '',
      recShow: true,
      noData: false,
      dialogTableVisible: false,
      lineChartDataBig: {},
      lineChartData: [],
      dataList: {},
      formrules: {
        airportId: [{ required: true, message: '请选择技能', trigger: 'blur' }],
        params: [{ required: true, message: '请选择开始与结束日期', trigger: ['change', 'blur'] }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
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
      intlType: [],
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
    this.intlTypeList()
    // this.statusInit()
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.intlTypeList()
      }
    }
  },
  destroyed() {
    clearInterval(this.timer)
    this.socket.close()
  },
  methods: {
    // 任务生成
    taskGeneration() {
      clearInterval(this.timer)
      const data = {
        airportId: this.airport.airportId || '',
        // ids: this.intlType || '',
        date: this.date,
        deskPredictions: this.intlType.join(',') || ''
      }
      taskGenerate(data)
        .then((response) => {
          this.statusInit()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    // 任务派工
    taskAssign() {
      clearInterval(this.timer)
      const data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType.join(',') || '',
        date: this.date
      }
      taskAssignmention(data)
        .then((response) => {
          this.statusInit()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    changeDate(e) {
      clearInterval(this.timer)
      // 切换日期
      this.date = e
      this.statusInit()
    },
    jumpTaskList() {
      var routeData = this.$router.resolve({ path: '/dispatching/securityChannel/dispatchingList', query: { date: this.date, businessDomainId: this.businessDomainId } })
      window.open(routeData.href, '_blank')
    },
    openRule() {
      // 规则弹框
      this.editSkillVisible = true
      const data = {
        airportId: this.airport.airportId
      }
      getBusParam(data).then((response) => {
        // console.log(response, 3232)
        response.data.data.beginTime = this.calTime(response.data.data.beginTime)
        response.data.data.endTime = this.calTime(response.data.data.endTime)
        response.data.data.whichDay = 0
        this.formEdit = response.data.data
      })
    },
    calTime(time) {
      if (time < 60) {
        if (time < 10) {
          return '00' + ':0' + time
        } else {
          return '00:' + time
        }
      } else if (time > 60) {
        var a = time % 1440
        var b = time / 1440
        // this.formEdit.whichDay = b
        var hour = a / 60
        var min = a % 60
        if (hour < 10) {
          hour = '0' + hour
        }
        if (min < 10) {
          min = '0' + min
        }
        return hour + ':' + min
      }
    },
    // 派工规则确定事件
    handleEditClick() {
      var beginTimes = this.formEdit.beginTime.split(':')
      var endTimes = this.formEdit.endTime.split(':')
      var beginMin = Number(beginTimes[0]) * 60 + Number(beginTimes[1])
      var endMin = Number(endTimes[0]) * 60 + Number(endTimes[1])
      // if (this.formEdit.whichDay === 1) {
      //   endMin += 1440
      // } else if (this.formEdit.whichDay === 2) {
      //   endMin += 2880
      // }
      this.formEdit.beginTime = beginMin
      this.formEdit.endTime = endMin
      this.formEdit.airportId = this.airport.airportId
      updateBusParam(this.formEdit).then((response) => {
        this.editSkillVisible = false
        this.$message.success('修改成功')
      })
    },
    change2(value) {
      this.intlType = value
      clearInterval(this.timer)
      // this.init()
      // this.socket.close()
      this.list = []
      this.statusInit()
      // this.intlTypeList()
    },
    intlTypeList() {
      this.regions = []
      const data = {
        airportId: this.airport.airportId
      }
      queryList(data)
        .then((response) => {
          // if (response.data.data) {
          if (response.data.data.length !== 0) {
            this.regions = response.data.data
            if (this.regions.length !== 0) {
              const storedeskPredictions = this.$store.state.checkinParams.deskPredictions
              if (storedeskPredictions) {
                // this.intlType = Number(storedeskPredictions)
                this.intlType = storedeskPredictions
              } else {
                this.intlType = [this.regions[0].id]
              }
              clearInterval(this.timer)
              this.statusInit()
            } else {
              this.regions = [{ id: '', composeName: '暂无数据' }]
              this.intlType = [this.regions[0].id]
              // this.$message.success('暂无数据')
              this.noData = true
              clearInterval(this.timer)
              this.statusInit()
            }
            // this.init()
            // this.initable()
          } else {
            this.$message.success('暂无参数组合数据')
          }
          // }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    dispatchFcn() {
      this.dialogdispathVisible = true
      dispachData(this.airport.airportId).then((res) => {
        this.form.airportId = this.airport.airportId
        this.form.params = res.data.data.params
        this.form.time = res.data.data.time
      })
    },
    dialogAddbtn() {
      this.dialogdispathVisible = false
      this.form.airportId = this.airport.airportId
      dispachFcn(this.form).then((res) => {
        if (res.data.code === '200') {
          this.$message.success('设置成功')
        }
      })
    },
    getTime() {
      // setInterval(() => {
      //   // new Date() new一个data对象，当前日期和时间
      //   // toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
      //   this.currentDate = new Date().toLocaleString()
      // }, 1000)
    },
    showChart() {
      var _this = this
      // 渲染图表
      var data = {
        airportId: this.airport.airportId || '',
        ids: this.intlType.join(',') || '',
        date: this.date || '',
        businessDomainId: this.businessDomainId
      }
      this.loadingChart = true
      this.lineChartData = []
      this.lineChartDataBig = {}
      this.dataList = {}
      deskChart1(data).then((response) => {
        this.loadingChart = false
        var data1 = response.data.data
        if (response.data.code === '200') {
          if (!data1) {
            this.lineChartDataBig = {}
            // this.$message.success('暂无数据！')
          } else {
            this.dataList = response.data.data
            this.noEcharts = false
            Object.keys(response.data.data.points).forEach(function (cur2) {
              var object = {}
              object.datas = {}
              object.datas.actualData = []
              object.datas.expectedData2 = []
              object.datas.expectedData = []
              object.datas.waitList = []
              object.datas.realWaitList = []
              object.datas.arryleft = []
              object.datas.arryleft2 = []
              object.datas.arryright = []
              object.datas.dataX = []
              object.datas.actualDataName = '预计到达旅客'
              object.datas.expectedDataName = '可通过人数'
              object.datas.expectedDataName2 = '柜台开放数'
              object.datas.day = cur2
              response.data.data.points[cur2].forEach((element) => {
                // console.log(element, 'element')
                object.datas.arryleft2.push(element.passengerNumber)
                object.datas.arryleft.push(element.deskCapacity)
                object.datas.arryright.push(element.openDesks)
                object.datas.actualData.push({ name: element.time, value: [element.time, element.passengerNumber] })
                object.datas.expectedData.push({ name: element.time, value: [element.time, element.deskCapacity] })
                object.datas.expectedData2.push({ name: element.time, value: [element.time, element.openDesks] })
                object.datas.waitList.push({ name: element.time, value: [element.time, element.waitTime] })
                object.datas.realWaitList.push({ name: element.time, value: [element.time, element.waitingTime] })
                object.datas.dataX.push(element.time.substring(10, 16))
              })
              object.datas.leftMax2 = Math.max.apply(null, object.datas.arryleft2)
              object.datas.leftMax = Math.max.apply(null, object.datas.arryleft)
              object.datas.rightMax = Math.max.apply(null, object.datas.arryright)
              object.datas.maxWaitTime = response.data.data.maxWaitTime
              object.datas.maxY = response.data.data.ymax
              // object.datas.maxY = response.data.data.yMax
              object.datas.max1Y = response.data.data.y1Max
              object.datas.max2Y = response.data.data.y2Max
              object.datas.isShow = true
              object.datas.legendData = ['预计到达旅客', '柜台开放数', '可通过人数', '预计排队时间', '实时排队时间']
              _this.lineChartData.push(object.datas)
              _this.lineChartDataBig = object.datas
            })
          }
        } else {
          this.lineChartDataBig = {}
          this.$message({
            type: 'error',
            showClose: true,
            message: response.message
          })
        }
        this.$nextTick(() => {
          console.log(this.lineChartData.length, 'linechartbig')
          // if (JSON.stringify(this.lineChartDataBig) !== '{}') {
          if (this.lineChartData.length !== 0) {
            // debugger
            this.dialogTableVisible = true
          } else {
            this.$message.success('暂无图表数据')
          }
        })
      })
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
      // location.reload()
    },
    reconnect() {
      // 重新连接
      var that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function () {
        // 新连接
        console.log('reconnect')
        that.init()
        that.lockReconnect = false
      }, 5000)
    },
    reset() {
      // 重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      // 重启心跳
      that.start()
    },
    start() {
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType || ''
      }
      // 开启心跳
      // debugger
      var self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      console.log(self.timeoutObj, 666)
      console.log(self.socket.readyState, 555)
      self.timeoutObj = setTimeout(function () {
        // debugger
        console.log('心跳检测前的判断')
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.socket.readyState == 1) {
          // 如果连接正常
          self.socket.send(JSON.stringify(data))
        } else {
          // 否则重连
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function () {
          // 超时关闭
          self.socket.close()
        }, self.timeout)
      }, self.timeout)
    },
    init() {
      // var data = {
      //   airportId: this.airport.airportId || '',
      //   deskPredictions: this.intlType[0] ? this.intlType.join(',') : '',
      //   date: this.date,
      //   // id: this.$store.state.user.userInfo.id
      //   id: Math.random(),
      // }
      // // console.log('websocket所在函数')
      // this.loading = true
      // this.list = []
      // // debugger
      // if (typeof WebSocket === 'undefined') {
      //   alert('您的浏览器不支持socket')
      // } else {
      //   var wsuri = null
      //   if (document.location.hostname === 'localhost') {
      //     // wsuri = `${process.env.VUE_APP_SOCKET_API}` + '/rtm/api/v1/webSock/' + data.id + '?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&date=' + data.date
      //     wsuri = `ws://test.rqm.yldev.net` + '/rtm/api/v1/webSock/' + data.id + '?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&date=' + data.date
      //   } else {
      //     wsuri = 'ws://' + document.location.hostname + '/rtm/api/v1/webSock/' + data.id + '?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&date=' + data.date
      //   }

      //   // 实例化socket
      //   this.socket = new WebSocket(wsuri)
      //   // 监听socket连接
      //   this.socket.onopen = this.open
      //   // 监听socket错误信息
      //   this.socket.onerror = this.error
      //   // 监听socket消息
      //   this.socket.onmessage = this.getMessage
      //   // this.socket.onclose = this.close
      // }
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType[0] ? this.intlType.join(',') : '',
        employeeName: this.employeeName || '',
        date: this.date,
        businessDomainId: this.businessDomainId || 106
      }
      distribution1(data)
        .then((response) => {
          this.getMessage(response.data.data)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    open: function () {
      console.log('socket连接成功')
      this.send()
      // this.start()
    },
    error: function () {
      console.log('连接错误')
      this.init() // 链接错误时重新连接
      // this.reconnect()
    },
    getMessage: function (msg) {
      // console.log(JSON.parse(msg.data).code)
      this.loading = false
      this.list = []
      this.checkinEmployee = []
      // var data1 = JSON.parse(msg.data).data
      // if (JSON.parse(msg.data).code === '200') {
      var data1 = msg
      const transfer = Number(data1.currentMatchRatio * 100).toFixed(2)
      this.list = data1.securityCheckDomainTaskVOS
      this.currentMatchRatio = transfer + '%'
      if (data1) {
        this.remark = data1.maximumLatency
      }
      let cont = 0 // 总开放数
      let close = 0 // 总关闭数
      let openNumb1 = 0 // 现场值机人员数
      if (!data1.securityCheckDomainTaskVOS) {
        // this.$message.success('暂无数据')
        this.noData = true
      } else {
        this.noData = false
        if (data1.securityCheckDomainTaskVOS) {
          data1.securityCheckDomainTaskVOS.forEach((element) => {
            // element.checkInDeskBeans.reverse()
            // console.log('处理了数据')
            element.securityCheckChannelTaskVOS.forEach((element2) => {
              // if (element2.checkInTaskBeanList.length > 0) {
              let aside = 0 // 当前时间柜台是否开放的标志，0代表当前关，1代表当前开
              let personless = 0 // 有无人值守的标志，0有，1无
              element2.securityTaskVOS.forEach((element3) => {
                // const time = dayjs(element3.startTime).hour() * 60 * 60 + dayjs(element3.startTime).minute() * 60 + dayjs(element3.startTime).second()
                // const closeTime = dayjs(element3.endTime).hour() * 60 * 60 + dayjs(element3.endTime).minute() * 60 + dayjs(element3.endTime).second()
                // const now = dayjs().hour() * 60 * 60 + dayjs().minute() * 60 + dayjs().second()
                const time = new Date(element3.startTime).getTime()
                const closeTime = new Date(element3.endTime).getTime()
                const selectedTime = this.date + ' ' + `${dayjs().hour()}:${dayjs().minute()}:${dayjs().second()}`
                const now = new Date(selectedTime).getTime()
                if (element3.groupName == null) {
                  element2.personLessList.push({ startTime: element3.startTime, endTime: element3.endTime, dutyPerson: '无人' })
                } else {
                  element2.personLessList.push({ startTime: element3.startTime, endTime: element3.endTime, dutyPerson: element3.groupName })
                }
                if (now > time && now < closeTime) {
                  aside = 1
                  if (element3.groupName) {
                    openNumb1 += 1
                    element2.bean.employeeGroupName = element3.groupName
                    this.checkinEmployee.push(element3.groupName)
                  } else {
                    personless = 1
                    element2.bean.employeeGroupName = '无'
                  }
                  element2.bean.planStarTime = element3.startTime
                  element2.bean.planEndTime = element3.endTime
                }
              })
              // }
              if (aside === 1) {
                if (personless === 1 && element2.openType === 0) {
                  element2.personlessDeskclassF = true
                } else if (personless === 1 && element2.openType === 1) {
                  element2.personlessDeskclassD = true
                }
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
      // console.log(this.list, 888)
      // } else {
      //   this.noData = true
      //   this.send()
      //   this.$message({
      //     type: 'error',
      //     message: JSON.parse(msg.data).message,
      //   })
      // }
      // this.reset()
    },
    send: function () {
      console.log('我发送了数据')
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType,
        date: this.date || ''
      }
      this.socket.send(this.intlType[0] ? JSON.stringify(data) : '{airportId:' + this.airport.airportId + ',date:' + this.date + ',deskPredictions:null}')
      // this.socket.send()
    },
    close: function (e) {
      console.log('socket已经关闭', e)
      // this.reconnect()
    },
    statusInit() {
      this.status()
      this.timer = setInterval(() => {
        this.status()
      }, 5000)
    },
    status() {
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType.join(',') || '',
        businessDomainId: this.businessDomainId
      }
      this.loading = true
      this.noData = false
      // debugger
      // if (this.socket) {
      //   if (this.socket.readyState == 1) {
      //     // 如果连接正常
      //     this.socket.close()
      //   }
      // }
      recalculationStatus(data)
        .then((response) => {
          console.log(response.data.data.status)
          if (response.data.data.status === '1') {
            clearInterval(this.timer)
            if (this.calcIndex === 1) {
              this.$message.success('计算完成')
              this.calcIndex = 0
            }
            this.loading = false
            this.recShow = true
            console.log(this.socket, 119)
            if (this.socket) {
              if (this.socket.readyState == 1) {
                // 如果连接正常
                this.send()
              } else {
                this.init()
              }
            } else {
              console.log('转去调用websocket')
              this.init()
            }
          } else {
            if (this.socket) {
              if (this.socket.readyState == 1) {
                // 如果连接正常
                this.socket.close()
              }
            }
          }
        })
        .catch((e) => {
          clearInterval(this.timer)
          if (this.socket) {
            if (this.socket.readyState == 1) {
              // 如果连接正常
              this.send()
            } else {
              this.init()
            }
          } else {
            console.log('转去调用websocket')
            this.init()
          }
          console.log(this.timer, 112)
          this.recShow = true
          this.loading = false
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
      if (this.intlType.length) {
        var routeData = this.$router.resolve({
          path: '/dispatching/securityChannel/channelEmployeeTasks',
          query: { siteId: this.airport.airportId || 10, date: this.date, deskPredictions: this.intlType.join(',') || '', businessDomainId: this.businessDomainId }
        })
        window.open(routeData.href, '_blank')
        // this.$router.push({ path: '/dispatching/checkIn/employeetasks', query: { siteId: this.airport.airportId || 10, date: this.date, deskPredictions: this.intlType || '' } })
      } else {
        this.$message.warning('请先选择组合参数')
      }
    },
    linktodesk() {
      if (this.intlType) {
        var routeData = this.$router.resolve({
          path: '/dispatching/securityChannel/channelTasks',
          query: { siteId: this.airport.airportId || 10, date: this.date, deskPredictions: this.intlType.join(',') || '', businessDomainId: this.businessDomainId }
        })
        window.open(routeData.href, '_blank')
        // this.$router.push({ path: '/dispatching/checkIn/deskTasks', query: { siteId: this.airport.airportId || 10, date: this.date, deskPredictions: this.intlType || '' } })
      } else {
        this.$message.warning('请先选择组合参数')
      }
    },
    async recalculation() {
      // 重新计算
      this.loading = true
      this.recShow = false
      this.timer = ''
      this.calcIndex = 1
      var data = {
        airportId: this.airport.airportId || '',
        deskPredictions: this.intlType.join(',') || '',
        date: this.date,
        businessDomainId: this.businessDomainId
      }
      var recalStatus = await recalculation1(data)
        .then((response) => {
          return true
          // this.timer = setInterval(this.status(), 2000)
        })
        .catch((e) => {
          this.recShow = true
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
        deskPredictions: this.intlType.join(',') || '',
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
<style scoped>
.desk-wrap /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
</style>
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
          //常开
          &.deskOpenclass {
            // background: #87a054;
            // color: #fff;
            color: #6a9512;
            border: 2px solid #6a9512;
            font-weight: bold;
          }
          //动态
          &.deskclose {
            // background: #b99f70;
            // color: #fff;
            color: #84dd84;
            border: 2px solid #84dd84;
            font-weight: bold;
          }
          &.deskclass {
            // background: #babbbf;
            // color: #666;
            color: #babbbf;
            border: 2px solid #babbbf;
            font-weight: bold;
          }
          &.personlessDeskclassF {
            // background: #6a9512;
            // color: #666;
            color: #6a9512;
            border: 2px solid #e291d1;
            font-weight: bold;
          }
          &.personlessDeskclassD {
            // background: #86f586;
            // color: #666;
            color: #84dd84;
            border: 2px solid #e291d1;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.open {
  width: 10px;
  height: 10px;
  background: #6a9512;
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

