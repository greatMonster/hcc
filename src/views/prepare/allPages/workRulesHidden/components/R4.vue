<template>
  <div v-if="rTwoShow" class="rule1-content-box">
    <div class="rule1-content">
      <div class="rule2-content-left rule3-content-box">
        <div class="rule3-content-right">
          <div>所有班次的平均轮班长度必须为 :</div>
          <div class="rule3-content-left-bottom">
            <div class="rule3-content-left-bottom-select1">
              <el-input v-model="data.adRules.common[0].mintime" type="text" placeholder="请输入" style="width:100px" />
              到
              <el-input v-model="data.adRules.common[0].maxtime" type="text" placeholder="请输入" style="width:100px" />
            </div>小时之间
          </div>
        </div>
        <div class="rule3-content-right1">
          <div>首选的平均轮班时间为 :</div>
          <div class="rule3-content-left-bottom">
            <div class="rule3-content-left-bottom-select1">
              <el-input v-model="data.adRules.common[0].firsttime" type="text" placeholder="请输入" style="width:60px" /> 小时
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R4',
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
      data: { adRules: { common: [{ firsttime: '', maxtime: '', mintime: '' }] }},
      value: '100',
      additionalTime: '',
      rTwoShow: true
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

<style scoped>
.oparation,
.rule1-content-right-bottom {
  padding-left: 30px;
  font-size: 12px;
  color: #00b4dd;
  cursor: pointer;
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
.rule1-content-left {
  width: 25%;
  height: 120px;
  color: white;
  border-right: 2px solid #4f566b;
}
.rule1-content-left-bottom,
.rule1-content-right-middle,.rule3-content-left-bottom {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.rule1-content-left-bottom-input {
  width: 150px;
}
.rule1-content-left-bottom-select,.rule3-content-left-bottom-select {
  width: 100px;
  margin-left: 15px;
}
.rule1-content-right {
  width: 75%;
  height: 120px;
  color: white;
  box-sizing: border-box;
  padding: 0 0 0 20px;
}
.radio-bg {
  margin-left: 5px;
  border-left: 1px solid white;
  color: white;
}
.rule1-content-right-bottom {
  margin-top: 35px;
  padding-left: 0;
}
.rule1-content-right-bottom-input {
    width: 150px;
}
.rule1-content-right-bottom-select {
    width: 100px;
}
.rule1-content-right-middle-right {
    display: flex;
    margin-left: 20px;
}
.rule3-content-left-bottom-select {
    display: flex;
}
.rule3-content-box {
    width: 100%;
    display: flex;
    align-items: center;
}
.rule3-content-right1,.rule3-content-right2 {
    margin-left: 8%;
}

</style>
