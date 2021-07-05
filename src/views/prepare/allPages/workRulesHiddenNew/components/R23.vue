<template>
  <div class="rthirty-five-box">
    <div class="edit-box">
      <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="rthirty-five-time">
        <div class="rthirty-five-box3">
          若需要，员工
          <el-time-select
            v-model="item.startTime"
            style="width:120px"
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
            style="width:120px"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: item.startTime
            }"
          />的用餐时间为
          <el-input v-model="item.mintime" type="text" placeholder class="percentCount" style="width:60px" />时间长度/分
          <span v-if="item.showCancel=='true'" class="rthirty-cancel" @click="cancelRule(index)">- 删除</span>
        </div>
      </div>
      <span v-if="showExtend" class="rthirty-extend" @click="extendRule">+ 扩展当前规则</span>
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
        return {}
      }
    }
  },
  data() {
    return {
      data: {
        parameterBean: {
          extendsParam: [
            {
              mintime: '',
              startTime: '',
              endTime: '',
              showCancel: false
            }
          ]
        }
      },
      showExtend: true,
      options: [
        { value: '1', label: '早' },
        { value: '2', label: '中' },
        { value: '3', label: '晚' }
      ]
    }
  },
  watch: {
    parent: {
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
    if (!this.parent.parameterBean) {
      // 如果adrules为空,给个初始值为空
      this.parent.parameterBean = this.data.parameterBean
    } else {
      this.data.parameterBean = this.parent.parameterBean
    }
  },
  methods: {
    extendRule() {
      this.data.parameterBean.extendsParam.push({
        mintime: '',
        startTime: '',
        endTime: '',
        showCancel: 'true'
      })
    },
    cancelRule(index) {
      this.data.parameterBean.extendsParam.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.el-select {
  margin: 0 10px;
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
  border-bottom: 1px solid #434b61;
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
.rthirty-extend,
.rthirty-cancel {
  width: 100%;
  height: 25px;
  line-height: 25px;
  margin-top: 15px;
  color: #00b4dd;
  cursor: pointer;
}
</style>
