<template>
  <div class="rthirty-five-box">
    <div class="edit-box">
      <div class="rthirty-five-time">
        <div class="rthirty-five-box3">连续工作的天数应该为
          <el-input v-model="data.adRules.common[0].mincontinuous" type="text" placeholder="" class="percentCount" /> 天和
          <el-input v-model="data.adRules.common[0].maxcontinuous" type="text" placeholder="" class="percentCount" /> 天之间。
          首选天数为 <el-input v-model="data.adRules.common[0].firstcontinuous" type="text" placeholder="" class="percentCount" style="width:60px" /> 天
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R13',
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
      data: { adRules: { common: [{
        mincontinuous: '',
        maxcontinuous: '',
        firstcontinuous: ''
      }] }}
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
    cancelRule(index) {
      this.rfiftyOne.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.el-select{
  margin: 0 10px
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
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
}
.rthirty-extend,.rthirty-cancel {
    width: 100%;
    height: 25px;
    line-height: 25px;
    margin-top: 15px;
    color: #00b4dd;
    cursor: pointer;
}
</style>
