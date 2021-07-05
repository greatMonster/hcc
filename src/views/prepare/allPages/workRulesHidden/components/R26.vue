<template>
  <div class="rule1-content-box">
    <div class="rule1-content">
      <div class="rule2-content-left">
        <div>轮班开始时间粒度 </div>
        <el-input v-model="data.adRules.common[0].time" type="text" placeholder="" class="percentCount" style="width:60px" /> 分钟
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R26',
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
      data: { adRules: { common: [{ time: '' }] }}
    }
  },
  watch: {
    'parent': {
      handler: function() {
        this.data = this.parent
      },
      deep: true
    }
  },
  created() {
    if (!this.parent.adRules.common) { // 如果adrules为空,给个初始值为空
      this.parent.adRules = this.data.adRules
    } else {
      this.data = this.parent
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
