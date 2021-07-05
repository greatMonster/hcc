<template>
  <div v-if="rfiftyOneShow" class="rthirty-five-box">
    <div class="edit-box">
      <div class="rthirty-five-time">
        <div class="rthirty-five-box3">员工单次休息时间每天不超过
          <el-input v-model="data.parameterBean.defaultParam[0].value" type="text" placeholder="" class="percentCount" style="width:60px" /> 次
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R15',
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
      data: {
        parameterBean: {
          defaultParam: [{
            value: ''
          }]
        }},
      rfiftyOneShow: true
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
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
}

</style>
