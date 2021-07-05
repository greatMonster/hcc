<template>
  <div class="rule1-content-box">
    <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="rule1-content">
      <div class="rule2-content-left">
        <div>轮班时间从:</div>
        <el-time-select
          v-model="item.startTime"
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
          placeholder="结束时间"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00',
            minTime:item.startTime
          }"
        />
      </div>
      <el-button v-if="item.showCancel=='true'" class="showCancel" @click="cancelRule(index)"> <i class="el-icon-delete" /> 删除</el-button>
    </div>
    <div class="rule1-content-right-bottom">
      <span v-if="showExtend" @click="extendRule">+ 扩展当前规则</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R9',
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
      data: { parameterBean: { extendsParam: [{ startTime: '', endTime: '', showCancel: false }] }},
      showExtend: 'true'
    }
  },
  watch: {
    'parent': {
      handler: function() {
        if (!this.parent.parameterBean) { // 如果adrules为空,给个初始值为空
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
      this.data.parameterBean = this.parent.parameterBean
    }
  },
  methods: {
    cancelRule(e) {
      this.data.parameterBean.extendsParam.splice(e, 1)
    },
    extendRule() {
      this.data.parameterBean.extendsParam.push({
        startTime: '',
        endTime: '',
        showCancel: 'true'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.rule2-content-left {
    border-right: none;
    div{
      display: inline-block;
    }
}
.oparation,
.rule1-content-right-bottom {
  padding-left: 30px;
  font-size: 12px;
  color: #00b4dd;
  cursor: pointer;
  margin-top: 20px;
}
.rule1-content-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #232c47;
  color: white;
  border-bottom: 1px solid #434B61;
}
</style>
