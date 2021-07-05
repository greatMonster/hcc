<template>
  <div class="rthirty-five-box">
    <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="edit-box">
      <div class="rthirty-five-time">
        <div class="rthirty-five-box3">
          <div style=" float: left;margin: 10px">工作适用于</div>
          <el-checkbox-group v-model="item.checkedDayarry" style="display:flex">
            <el-checkbox-button v-for="(day,index2) in days" :key="index2" :label="day">{{ day }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="rthirty-five-box3">最早开始时间
          <el-time-select
            v-model="item.startTime"
            style="width:120px"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }"
          />
          最晚结束时间
          <el-time-select
            v-model="item.endTime"
            style="width:120px"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: item.startTime
            }"
          />
          <span v-if="item.showCancel=='true'" class="rthirty-cancel" @click="cancelRule(index)">- 删除当前规则</span>
        </div>
      </div>
    </div>
    <div class="rthirty-extendiv">
      <span v-if="showExtend" class="rthirty-extend" @click="extendRule">+ 扩展当前规则</span>
    </div>
  </div>
</template>

<script>
const dayOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  name: 'R18',
  props: {
    parent: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      showExtend: true,
      days: dayOptions,
      data: {
        parameterBean: {
          extendsParam: [{
            startTime: '00:00',
            endTime: '08:20',
            checkedDay: '',
            checkedDayarry: [],
            showExtend: true,
            showCancel: false
          }]
        }}
    }
  },
  watch: {
    'parent': {
      handler: function() {
        if (!this.parent.parameterBean) {
          // 如果adrules为空,给个初始值为空
          this.parent.parameterBean = this.data.parameterBean
        } else {
          this.data.parameterBean = this.parent.parameterBean
        }
      },
      deep: true
    }
  },
  created() {
    if (!this.parent.parameterBean) { // 如果adrules为空,给个初始值为空
      this.parent.parameterBean = this.data.parameterBean
    } else {
      this.parent.parameterBean.extendsParam.forEach(element => {
        element.checkedDayarry = JSON.parse(element.checkedDayarry)
      })
      this.data.parameterBean = this.parent.parameterBean
    }
  },
  methods: {
    handleChange(item, dayindex) {
      item.checkedDay = item.checkedDayarry.toString()
    },
    extendRule() {
      this.data.parameterBean.extendsParam.push({
        startTime: '',
        endTime: '',
        checkedDay: '',
        checkedDayarry: [],
        days: dayOptions,
        showExtend: true,
        showCancel: 'true'
      })
    },
    cancelRule(index) {
      this.data.parameterBean.extendsParam.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.el-input-number{
  width: 120px;
}
    .rfiftyOne {
        width: 100%;
        height: 100%;
    }

.rule2-content-left {
    width: 100%;
    border-right: none;
}

.oparation,
.rule1-content-right-bottom {
  padding-left: 30px;
  font-size: 12px;
  color: #00b4dd;
  cursor: pointer;
}
.rule1-title-right {
  cursor: pointer;
}
.rthirty-five-box {
  width: 100%;
  height: 100%;
}
.edit-box {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 10px;
    background-color: #232c47;
    color: white;
    border-bottom: 1px solid #434B61;
}
.rule1-content-right-middle {
    display: flex;
    margin-top: 10px;
}
.rthirty-five-time {
    width: 100%;
    height: auto;
}
.percentCount {
    width: 8%;
    height: 40px;
}
.rthirty-five-box3 {
    width: 100%;
    line-height: 50px;
    margin: 10px;
}
.rthirty-extend,.rthirty-cancel {
    width: 100%;
    height: 25px;
    line-height: 25px;
    margin: 15px;
    color: #00b4dd;
    cursor: pointer;
}
</style>
