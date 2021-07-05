<template>
  <div class="rthirty-five-box">
    <div class="edit-box">
      <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="rthirty-five-time">
        <div class="rthirty-five-box3">
          <div style=" float: left;margin-right:10px">轮班类型</div>
          <el-select v-model="item.value" placeholder="请选择">
            <el-option
              v-for="item1 in options"
              :key="item1.value"
              :label="item1.label"
              :value="item1.value"
            />
          </el-select> 将在排班表间平均分配。
          <div>该规则只是偏好设置，不做严格要求。<span v-if="item.showCancel=='true'" class="rthirty-cancel" @click="cancelRule(index)">- 删除当前规则</span></div>
        </div>
      </div>
      <div class="rthirty-extendiv">
        <span v-if="showExtend" class="rthirty-extend" @click="extendRule">+ 扩展当前规则</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'R21',
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
      showExtend: true,
      options: [{ value: '1', label: '早班' }, { value: '2', label: '中班' }, { value: '3', label: '晚班' }, { value: '4', label: '夜班' }],
      data: {
        parameterBean: {
          extendsParam: [{
            value: '早班',
            showCancel: false
          }]
        }}
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
    extendRule() {
      this.data.parameterBean.extendsParam.push({
        value: '',
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
    border-bottom: 1px solid #2f3a45;
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
