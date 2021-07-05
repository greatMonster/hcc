<template>
  <div v-if="rfiftyOneShow" class="rthirty-five-box">
    <div class="edit-box">
      <div class="rthirty-five-time">
        <div class="rthirty-five-box3">员工单次任务工作时长需大于
          <el-input v-model="data.adRules.common[0].time" type="text" placeholder="" class="percentCount" style="width:60px" /> 小时，
          小于或等于 <el-input v-model="data.adRules.common[0].time2" type="text" placeholder="" class="percentCount" style="width:60px" /> 小时，
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
        adRules: {
          common: [{
            time: '',
            time2: ''
          }]
        }},
      rfiftyOneShow: true
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
