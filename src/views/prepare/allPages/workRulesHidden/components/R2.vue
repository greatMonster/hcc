<template>
  <div class="rule1-content">
    <div class="rule2-content-left">
      <div>员工每日工作时间 :</div>
      <div class="rule1-content-left-bottom">
        <el-time-select
          v-model="data.adRules.common[0].begintime"
          placeholder="起始时间"
          :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '24:00'
          }"
        />
        <div style="margin:0 10px;height:40px;line-height:40px;"> 至 </div>
        <el-time-select
          v-model="data.adRules.common[0].endtime"
          placeholder="结束时间"
          :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '24:00',
            minTime: data.adRules.common[0].begintime
          }"
        />
        <div style="margin:0 10px;height:40px;line-height:40px;" />
        <el-input-number v-if="data.adRules.common" v-model="data.adRules.common[0].duration" :min="0" :max="1" label="描述文字" @change="handleChange" />
        <div style="margin:0 10px;height:40px;line-height:40px;"> 之间</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R2',
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
      rOneShow: true,
      data: { adRules: { common: [{ endtime: '', begintime: '' }] }}
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
    handleChange(value) {
      console.log(value)
    },
    deleteClick() {
      this.$refs.rOne.remove()
    }
  }
}
</script>

<style scoped>
/* 第二条规则 */
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
