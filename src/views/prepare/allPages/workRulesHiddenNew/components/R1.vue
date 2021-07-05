<template>
  <div class="rule1-content">
    <div class="rule1-content-left">
      <div>基础成本 :</div>
      <div class="rule1-content-left-bottom" style="margin-top:10px">
        <div class="rule1-content-left-bottom-input">
          <el-input v-model="data.parameterBean.defaultParam[0].costtext" placeholder="请输入内容 CNY" clearable />
        </div>
        <div class="rule1-content-left-bottom-select">
          <el-select v-model="data.parameterBean.defaultParam[0].per" clearable placeholder="请选择">
            <el-option v-for="selectChild in options" :key="selectChild.value" :label="selectChild.label" :value="selectChild.label" />
          </el-select>
        </div>
      </div>
    </div>
    <div class="rule1-content-right">
      <div class="rule1-content-right-top">额外成本 :</div>
      <div v-for="(item,index1) in data.parameterBean.extendsParam" :key="index1" class="rule1-content-right-middle">
        <el-checkbox-group v-model="item.checkedDayarry" style="display:flex">
          <el-checkbox-button v-for="(day,dayindex) in days" :key="dayindex" :label="day" @change="handleChange(item,dayindex)">{{ day }}</el-checkbox-button>
        </el-checkbox-group>
        <div class="rule1-content-right-middle-right">
          <div class="rule1-content-left-bottom-input rule1-content-right-bottom-input">
            <el-input v-model="item.add" placeholder="增加 CNY" clearable />
          </div>
          <div class="rule1-content-left-bottom-select rule1-content-right-bottom-select">
            <el-select v-model="item.choice" clearable placeholder="请选择">
              <el-option v-for="optionChild in options1" :key="optionChild.value" :label="optionChild.label" :value="optionChild.value" />
            </el-select>
          </div>
        </div>
        <el-button v-if="item.showCancel=='true'" class="showCancel" @click="cancelRule(index1)">
          <i class="el-icon-delete" /> 删除
        </el-button>
      </div>
      <div class="rule1-content-right-bottom">
        <span v-if="showExtend" @click="extendRule">+ 扩展当前规则</span>
      </div>
    </div>
  </div>
</template>

<script>
const dayOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  name: 'R1',
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
      showExtend: true,
      days: dayOptions,
      options1: [{ value: '选项1', label: '%' }, { value: '选项2', label: '‰' }],
      options: [{ value: '选项1', label: '每天' }, { value: '选项2', label: '每小时' }, { value: '选项3', label: '每分钟' }, { value: '选项4', label: '每周' }],
      data: {
        parameterBean: {
          defaultParam: [{ costtext: '', per: '' }],
          extendsParam: [
            {
              add: '',
              checkedDay: '',
              checkedDayarry: [],
              choice: '',
              showCancel: false
            }
          ]
        }
      }
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
    if (this.parent.parameterBean) {
      this.parent.parameterBean.extendsParam.forEach(element => {
        element.checkedDayarry = JSON.parse(element.checkedDayarry)
      })
      this.data = this.parent
    } else {
      this.parent.parameterBean = this.data.parameterBean
    }
  },
  methods: {
    extendRule() {
      this.data.parameterBean.extendsParam.push({
        showCancel: true,
        checkedDay: '',
        checkedDayarry: [],
        add: '',
        choice: ''
      })
    },
    cancelRule(e) {
      // 删除
      this.data.parameterBean.extendsParam.splice(e, 1)
    },
    handleChange(item, index) {
      item.checkedDay = item.checkedDayarry.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
/* 第一条规则 */

.oparation,
.rule1-content-right-bottom {
  padding-left: 30px;
  font-size: 12px;
  color: #00b4dd;
  cursor: pointer;
  span {
    margin: 0 20px;
  }
}
.rule1-content-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #232c47;
  color: white;
  border-bottom: 1px solid #434b61;
}
.rule1-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.rule1-content-left,
.rule2-content-left {
  width: 25%;
  height: 120px;
  color: white;
}
.rule1-content-left-bottom,
.rule1-content-right-middle,
.rule3-content-left-bottom {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.rule1-content-left-bottom-input {
  width: 150px;
}
.rule1-content-left-bottom-select,
.rule3-content-left-bottom-select {
  width: 100px;
  margin-left: 15px;
}
.rule1-content-right {
  width: 75%;
  color: white;
  box-sizing: border-box;
  padding: 0 0 0 20px;
  border-left: 2px solid #4f566b;
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
</style>
