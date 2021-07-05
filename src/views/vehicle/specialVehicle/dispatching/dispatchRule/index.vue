<template>
  <div class="ruleBox">
    <el-form ref="formEdit" :model="formEdit" :label-width="formLabelWidth">
      <!-- <el-form-item prop="associateType" label="派工类型">
          <el-radio-group v-model="formEdit.skillType">
            <el-radio :label="0">单技能派工</el-radio>
            <el-radio :label="1">混合技能派工</el-radio>
          </el-radio-group>
        </el-form-item> -->
      <el-form-item prop="beforeTime" label="工作准备时间">
        任务开始前(分钟)
        <el-input v-model="formEdit.beforeTime" size="small" style="width: 150px" />
      </el-form-item>
      <el-form-item prop="beginTime" label="自动派工开始时间">
        <el-time-picker v-model="formEdit.beginTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
      </el-form-item>
      <el-form-item prop="endTime" label="自动派工结束时间">
        <el-time-picker v-model="formEdit.endTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间" />
        <!-- <el-select v-model="formEdit.whichDay" size="small" style="width:60px" @change="flightTypevaule">
            <el-option v-for="item in whichDayOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>-->
      </el-form-item>
      <!-- <el-form-item prop="timeInterval" label="派工间隔(分钟)">
          <el-input v-model="formEdit.timeInterval" size="small" style="width: 60%" />
        </el-form-item> -->
      <el-form-item>
        <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
          派工间隔(分钟)
          <el-tooltip class="item" effect="dark" content="指后台派工算法的运行频次" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.timeInterval" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item prop="alarmTime" label="告警时间">
        任务开始前(分钟)
        <el-input v-model="formEdit.alarmTime" size="small" style="width: 150px" />&nbsp;&nbsp;
      </el-form-item>
      <!-- <el-form-item prop="refreshTime" label="刷新时间(秒)">
          <el-input v-model="formEdit.refreshTime" size="small" style="width: 60%" />
        </el-form-item> -->
      <el-form-item>
        <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
          页面刷新时间(秒)
          <el-tooltip class="item" effect="dark" content="注意：单位是秒，不是分钟" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.refreshTime" size="small" style="width: 60%" />
      </el-form-item>
      <!-- <el-form-item prop="tp" label="预派工窗口时间(分钟)">
          <el-input v-model="formEdit.tp" size="small" style="width: 60%" />
        </el-form-item> -->
      <el-form-item>
        <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
          预派工窗口时间(分钟)
          <el-tooltip class="item" effect="dark" content="指提前多少时间派发任务给员工。考虑到航班动态不断变化，为了提高实操性，建议不要设置太大的数值" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.tp" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item prop="lockingTime" label="任务提前锁定时间(分钟)">
        <el-input v-model="formEdit.lockingTime" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item prop="associateType" label="任务绑定规则">
        <el-radio-group v-model="formEdit.associateType">
          <el-radio :label="0">时间</el-radio>
          <el-radio :label="1">过站</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formEdit.associateType == '1'">
        <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
          停场时间(分钟)
          <el-tooltip class="item" effect="dark" content="设定停场时间将航班判定为过站，此时将两个航班任务绑定派工。" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.groundTime" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item v-if="formEdit.associateType == '0'">
        <span style="margin-left: -170px">
          相同位置的任务时间间隔(分钟)
          <el-tooltip class="item" effect="dark" content="当相同位置两个任务的时间间隔小于设定值时，将会绑定在一起进行派工，以减少员工的移动距离" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.associateTime" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item v-if="formEdit.associateType == '0'">
        <span style="margin-left: -170px">
          不同位置的任务间距离（分钟）
          <el-tooltip class="item" effect="dark" content="当两个任务的甘特条重叠并且距离小于设定值时，将会绑定在一起派工给资质都符合的员工，以减少员工需求数。" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.distanceLimit" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item v-if="businessDomainId == 111">
        <span style="display: inline-block; width: 170px; margin-left: -170px; text-align: right">
          最大任务数
          <el-tooltip class="item" effect="dark" content="一个人能同时监控的最大任务数" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-input v-model.number="formEdit.taskCountMax" size="small" style="width: 60%" />
      </el-form-item>
      <el-form-item prop="algType" label="求解器类型">
        <el-select v-model="formEdit.algType" size="small" style="width: 200px">
          <el-option v-for="item in algTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEditClick()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getBusParam, addBusParam, updateBusParam } from '@/apiNew/specialVehicle'
export default {
  components: {},
  // 定义属性
  data() {
    return {
      algTypeOptions: [
        { id: 'MATLAB', name: 'matlab' },
        { id: 'SHANSHU', name: '杉树求解器' }
      ],
      addOrUpdate: 0, // 0代表未查询到数据，走新增接口；1代表已有数据，走修改接口
      formEdit: { beforeTime: '', algType: 'MATLAB', distanceLimit: '', beginTime: '', endTime: '', timeInterval: '', alarmTime: '', refreshTime: '', tp: '', lockingTime: '', associateType: '', groundTime: '', associateTime: '', taskCountMax: '' },
      formLabelWidth: '170px',
      arrowControl: true,
      airport: this.$store.state.user.airport,
      businessDomainId: this.$route.query.businessDomainId
    }
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {
    // ...mapGetters(['userPermissions','buttonType'])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleEditClick() {
      // 规则弹框确定
      console.log(this.formEdit, 6688)
      var beginTimes = this.formEdit.beginTime.split(':')
      var endTimes = this.formEdit.endTime.split(':')
      var beginMin = Number(beginTimes[0]) * 60 + Number(beginTimes[1])
      var endMin = Number(endTimes[0]) * 60 + Number(endTimes[1])
      if (this.formEdit.whichDay === 1) {
        endMin += 1440
      } else if (this.formEdit.whichDay === 2) {
        endMin += 2880
      }
      let data = Object.assign({}, this.formEdit)
      data.beginTime = beginMin
      data.endTime = endMin
      data.businessDomainId = this.businessDomainId
      data.airportId = this.airport.airportId
      if (this.addOrUpdate === 0) {
        addBusParam(data).then((response) => {
          this.editSkillVisible = false
          this.$message.success('添加成功')
        })
      } else {
        updateBusParam(data).then((response) => {
          this.editSkillVisible = false
          this.$message.success('修改成功')
        })
      }
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
        this.formEdit.whichDay = b
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const data = {
      businessDomainId: this.businessDomainId || 0,
      airportId: this.airport.airportId
    }
    getBusParam(data).then((response) => {
      // console.log(response, 3232)
      if (!response.data.data) {
        this.addOrUpdate = 0
      } else {
        this.addOrUpdate = 1
        response.data.data.beginTime = this.calTime(response.data.data.beginTime)
        response.data.data.endTime = this.calTime(response.data.data.endTime)
        response.data.data.whichDay = 0
        this.formEdit = response.data.data
      }
    })
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
.ruleBox {
  padding-top: 60px;
  padding-left: 10%;
}
</style>