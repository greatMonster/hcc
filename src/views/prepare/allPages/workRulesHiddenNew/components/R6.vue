<template>
  <div class="rthirty-five-box">
    <div class="edit-box">
      <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="rthirty-five-time">
        <div class="rthirty-five-box3">轮班应结束于
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
          到
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
          />时间内
          <div>
            <el-checkbox-group v-model="item.checkedDayarry" style="display:inline-flex; vertical-align: middle;">
              <el-checkbox-button v-for="(day, dayindex) in days" :key="dayindex" :label="day">{{ day }}</el-checkbox-button>
            </el-checkbox-group>
            <el-button v-if="item.showCancel=='true'" class="showCancel" @click="cancelRule(index)"> <i class="el-icon-delete" /> 删除</el-button>
          </div>
        </div>
      </div>
      <div class="rule1-content-right-bottom">
        <span v-if="showExtend" class="rthirty-extend" @click="extendRule">+ 扩展当前规则</span>
      </div>
    </div>
  </div>
</template>

<script>
const dayOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  name: 'R5',
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
      data: { parameterBean: {
        extendsParam: [{
          startTime: '',
          endTime: '',
          checkedDay: '',
          checkedDayarry: [],
          showCancel: false
        }] }},
      showExtend: true,
      days: dayOptions
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
    if (!this.parent.parameterBean) { // parameterBean,给个初始值为空
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
.rthirty-five-time {
    width: 100%;
    height: auto;
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
