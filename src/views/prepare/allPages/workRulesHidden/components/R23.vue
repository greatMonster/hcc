<template>
  <div class="rthirty-five-box">
    <div class="edit-box">
      <div v-for="(item,index) in data.adRules.cover" :key="index" class="rthirty-five-time">
        <div class="rthirty-five-box3">若需要，员工
          <el-select v-model="item.value" placeholder="请选择" style="width:80px">
            <el-option
              v-for="item1 in options"
              :key="item1.value"
              :label="item1.label"
              :value="item1.value"
            />
          </el-select>
          餐的用餐时间为
          <el-input v-model="item.mintime" type="text" placeholder="" class="percentCount" style="width:60px" /> 时间长度/秒
          <span v-if="item.showCancel=='true'" class="rthirty-cancel" @click="cancelRule(index)"> - 删除</span>
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
        return {
        }
      }
    }
  },
  data() {
    return {
      data: {
        adRules: {
          cover: [{
            mintime: '',
            value: '早',
            showCancel: false
          }]
        }},
      showExtend: true,
      options: [{ value: '1', label: '早' }, { value: '2', label: '中' }, { value: '3', label: '晚' }]

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
    if (!this.parent.adRules.cover) { // 如果adrules为空,给个初始值为空
      this.parent.adRules = this.data.adRules
    } else {
      this.data = this.parent
    }
  },
  methods: {
    extendRule() {
      this.data.adRules.cover.push({
        mintime: '',
        value: '',
        showCancel: 'true'
      })
    },
    cancelRule(index) {
      this.data.adRules.cover.splice(index, 1)
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
