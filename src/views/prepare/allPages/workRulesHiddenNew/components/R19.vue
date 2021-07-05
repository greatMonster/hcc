<template>
  <div class="edit-box">
    <div class="rthirty-five-time">
      <div class="rthirty-five-box3">
        <div style=" float: left;margin-right:10px">递进方向应该是</div>
        <el-select v-model="data.parameterBean.defaultParam[0].value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="rthirty-five-box3">
        <el-checkbox v-model="data.parameterBean.defaultParam[0].checked">将此规则作为偏好规则（不严格要求）</el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'R19',
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
        value: '',
        label: '',
        checked: false
      }] }},
      options: [{ value: '1', label: '向前' }, { value: '2', label: '向后' }]
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
      this.data.parameterBean = this.parent.parameterBean
    }
  },
  methods: {
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
