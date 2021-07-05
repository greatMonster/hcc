<template>
  <div class="rule1-content-box">
    <div class="rule1-content">
      <div class="modeBorder">
        <div class="modeTop">
          <span>选择添加轮班和休息日模式（选择后会出现在下方） :</span>
          <span style="margin-left:30px">
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.shiftName" :label="item.shiftName" :value="item.shiftName" @click.native="addMode(item)" />
            </el-select>
          </span>
        </div>
        <div class="modeBottom">
          <div v-for="(item,index) in data.parameterBean.extendsParam" :key="index" class="modeBox">
            <div class="modeContent">
              <input v-model="item.shiftName" readonly type="text" :style="{background:item.color}" class="modeButton" placeholder="item.modeName">
            </div>
            <div class="deleteIcon" @click="deleteMode(index)">
              <i class="el-icon-close" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getShiftType } from '@/api/common'
export default {
  name: 'R11',
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
      value: '',
      modeList: [],
      data: { parameterBean: { extendsParam: [] }},
      options: []
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
        this.data = this.parent
      },
      deep: true
    }
  },
  created() {
    this.getShiftType()
    if (!this.parent.parameterBean) {
      // 如果adrules为空,给个初始值为空
      this.parent.parameterBean = this.data.parameterBean
    } else {
      this.data.parameterBean = this.parent.parameterBean
    }
  },
  methods: {
    getShiftType() {
      // 下拉
      getShiftType().then(response => {
        this.options = response.data
      })
    },
    addMode(item) {
      this.data.parameterBean.extendsParam.push(item)
    },
    deleteMode(index) {
      this.data.parameterBean.extendsParam.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  border-bottom: 1px solid #434b61;
}
.rule1-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
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
.rule1-content-left-bottom {
  display: flex;
  width: 100%;
  height: auto;
  margin-top: 10px;
}
.modeBox {
  width: 108px;
  height: 60px;
  box-sizing: border-box;
  padding: 5px;
}
.modeTop {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  padding: 5px 0;
}
.modeBorder {
  width: 100%;
  height: 100%;
}
.modeBottom {
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
}
.modeContent {
  width: 100%;
  height: 100%;
  input {
    border: none;
    border-radius: 4px;
    color: #fff;
  }
}
.modeButton {
  width: 100%;
  height: 100%;
  text-align: center;
}
.deleteIcon {
  position: relative;
  margin-left: 83%;
  margin-top: -45px;
  cursor: pointer;
}
.deleteIcon:hover {
  color: red;
}
</style>
