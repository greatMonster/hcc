<template>
  <div class="edit-box">
    <div class="rthirty-five-time">
      <div class="rthirty-five-box3">员工在
        一周内，
        总工时不得超过
        <el-input v-model="data.parameterBean.defaultParam[0].maxTime" type="text" placeholder="" class="percentCount" style="width:60px" /> 小时
        总工时不得小于
        <el-input v-model="data.parameterBean.defaultParam[0].minTime" type="text" placeholder="" class="percentCount" style="width:60px" /> 小时
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R16',
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
      data: { parameterBean: { defaultParam: [{
        maxTime: '',
        minTime: ''
      }] }}
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
