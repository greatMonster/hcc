<template>
  <div v-if="rEighteenShow" class="rule1-content-box">
    <div class="rule1-content">
      <div class="rule2-content-left">
        <div>员工轮班不得在工作量开始前:</div>
        <el-input v-model="data.parameterBean.defaultParam[0].time" type="text" placeholder="" class="percentCount" style="width:60px" /> 分钟
        前开始
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R8',
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
      data: { parameterBean: { defaultParam: [{ time: '' }] }},
      value2: '100',
      rEighteenShow: true
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
.rule1-content-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #232c47;
  color: white;
  border-bottom: 1px solid #434B61;
}
.rule1-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.rule1-content-left-bottom {
  display: flex;
  margin-top: 10px;
}
</style>
