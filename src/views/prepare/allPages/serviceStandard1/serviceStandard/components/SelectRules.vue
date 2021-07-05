
<template>
  <div class="selectRules">
    <el-select v-model="item.filterType" placeholder="请选择逻辑操作符">
      <el-option v-for="(obj,id) in conditions" :key="id" :label="obj.label" :value="obj.value" />
    </el-select>
    <div style="display:inline-block">
      <el-button type="primary" @click="_addNodeFun(item)">添加组</el-button>
      <el-button type="primary" @click="_addCondFun(item)">添加附加条件</el-button>
      <span v-if="!item.isRootNode" @click="cancelGroupClick(item,$event)">取消</span>
    </div>
    <ul>
      <li v-for="(cond,b) in item.ruleFilterElements" :key="b">
        <el-select v-model="cond.identifyCode" placeholder="请选择参数" @change="changeClick(cond)">
          <el-option v-for="(item1,index1) in conditions2" :key="index1" :label="item1.label" :value="item1.value" />
        </el-select>
        <el-select v-model="cond.operatorCode" placeholder="请选择操作符" :disabled="cond.identifyCode?false:true" @change="changeClick2(cond)">
          <el-option v-for="(item2,index2) in conditions3" :key="index2" :label="item2.operatorName" :value="item2.operatorCode" />
        </el-select>
        <!-- <el-select v-if="ishow" v-model="cond.operatorCode" placeholder="请选择" @visible-change="initable4">
          <el-option v-for="(item3,index3) in conditions3" :key="index3" :label="item3" :value="item3" />
        </el-select> -->
        <div v-if="cond.isLookup" style="display:inline-block">
          <el-select v-if="cond.operatorCode=='IN'||cond.operatorCode=='NOT_IN'" v-model="cond.value2" filterable :disabled="cond.operatorCode?false:true" collapse-tags multiple style="width:250px">
            <el-option v-for="(item2,index2) in cond.attributeTypeAllowValueVOS" :key="item2.value+index2" :label="item2.key" :value="item2.value" />
          </el-select>
          <el-select v-else v-model="cond.value" :disabled="cond.operatorCode?false:true" filterable style="width:250px">
            <el-option v-for="(item2,index2) in cond.attributeTypeAllowValueVOS" :key="item2.value+index2" :label="item2.key" :value="item2.value" />
          </el-select>
        </div>
        <div v-else style="display:inline-block">
          <el-input v-if="cond.dataType==='INT'" v-model.number="cond.value " :disabled="cond.operatorCode?false:true" placeholder="请输入正确信息" style="width:250px" />
          <el-input v-if="cond.dataType==='STRING'" v-model="cond.value " :disabled="cond.operatorCode?false:true" placeholder="请输入正确信息" style="width:250px" />
          <el-date-picker v-if="cond.dataType==='DATE'" v-model="cond.value" value-format="yyyy-MM-dd" :disabled="cond.operatorCode?false:true" type="date" placeholder="选择日期" style="width:250px" />
          <el-time-picker v-if="cond.dataType==='TIME'" v-model="cond.value" :disabled="cond.operatorCode?false:true" value-format="HH:mm:ss" placeholder="选择时间" style="width: 200px" />
          <el-date-picker v-if="cond.dataType==='DATETIME'" v-model="cond.value" :disabled="cond.operatorCode?false:true" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 200px" />
        </div>
        <el-button @click="cancelGroupClick2(item.ruleFilterElements,b)">取消</el-button>
      </li>
    </ul>
    <template v-if="item.childRuleFilters&&item.childRuleFilters.length>0">
      <SelectRules v-for="(ruleFilterElements,index6) in item.childRuleFilters" :key="index6" :tdata="item.childRuleFilters" :data="ruleFilterElements" />
    </template>
  </div>
</template>
<script>
import { initTable, changeFcn } from '@/api/attributeDefinition'
import { updateRule2 } from '@/api/serviceStandard'
import SelectRules from './SelectRules'
export default {
  name: 'SelectRules',
  components: { SelectRules },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    tdata: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      group: {},
      ishow: false,
      operatorCode: '',
      airport: this.$store.state.user.airport,
      isLookup: '',
      FLIGHT: 'FLIGHT',
      dataType: '',
      index: 0,
      removeData: '',
      item: this.data,
      conditions3: [],
      conditions2: [],
      conditions: [
        {
          label: 'AND',
          value: 'AND'
        },
        {
          label: 'OR',
          value: 'OR'
        }
      ]
    }
  },
  watch: {
    data: {
      handler: function() {
        if (Object.keys(this.data).length === 0) {
          this.data.isRootNode = true
          this.data.leaf = true
        }
        this.item = this.data
      },
      deep: true
    }
  },
  created() {
    this.initable3()
    this.initable2()
  },
  mounted() {},
  methods: {
    initable2(val) {
      this.conditions2 = []
      var data = {
        airportId: this.airport.airportId,
        categoryCode: this.FLIGHT
      }
      initTable(data).then(response => {
        response.data.forEach(element => {
          this.conditions2.push({
            label: element.attributeName,
            value: element.attributeCode
          })
          this.dataType = element.attributeType.dataType
        //   this.isLookup = element.attributeType.isLookup
        })
      })
    },
    changeClick(data) {
      data.isLookup = ''
      data.value = ''
      data.operatorCode = ''
      data.airportId = this.airport.airportId
      changeFcn(data).then(res => {
        if (!res.data.data.isLookup) {
          data.dataType = res.data.data.dataType
        } else {
          data.isLookup = res.data.data.isLookup
          data.attributeTypeAllowValueVOS = res.data.data.values
        }
      })
    },
    changeClick2(data) {
      data.value = ''
    },
    initable3(val) {
      this.conditions3 = []
      const data = this.dataType ? this.dataType : 'INT'
      updateRule2(data).then(response => {
        response.data.forEach(element => {
          this.conditions3.push(element)
        })
      })

      if (this.isLookup === true && this.ruleFilterElements === 'AC_TYPE' && this.operatorCode === 'IN') {
        this.ishow = true
      } else {
        this.ishow = false
      }
    },
    // 对外抛出数据
    getDataFun() {
      return this.item
    },
    // 添加组
    _addNodeFun(group) {
      this.group = group
      const childRuleFilters = [
        {
          filterType: '',
          isRootNode: null,
          childRuleFilters: [],
          ruleFilterElements: []
        }
      ]
      // this.$set(group, 'childRuleFilters', childRuleFilters)
      if (!group.childRuleFilters) {
        this.$set(group, 'childRuleFilters', childRuleFilters)
      } else {
        group.childRuleFilters.push({
          filterType: '',
          isRootNode: null,
          childRuleFilters: [],
          ruleFilterElements: []
        })
        // group.childRuleFilters = Object.assign([], childRuleFilters)
      }
    },
    // 删除组
    cancelGroupClick(item, index, e) {
      localStorage.setItem('filterId', item.filterId)
      this.tdata.splice(index, 1)
    },
    // 删除附加条件
    cancelGroupClick2(cont, b) {
      cont.splice(b, 1)
    },
    // 添加附加条件
    _addCondFun(group) {
      if (this.item.filterType) {
        if (!group.ruleFilterElements) {
          this.$set(group, 'ruleFilterElements', [])
        }
        group.ruleFilterElements.push({
          dataType: 'INT',
          operatorCode: '',
          value: ''
        })
      } else {
        this.$message({
          message: '请先选择逻辑操作符',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style>
.el-picker-panel  .el-picker-panel__body .el-date-picker__time-header .el-date-picker__editor-wrap /deep/.el-input__inner{
    background:'#fff';
}
</style>
<style scoped>
li {
  list-style: none;
  margin-bottom: 5px;
  margin-top: 5px;
}
.selectRules {
  margin-left: 20px;
  margin-top: 10px;
}
.selectRules span {
  cursor: pointer;
  background: #2d3a5e;
  padding: 7px 12px;
  border-radius: 3px;
  border: 1px solid #434b61;
}
.el-input,.el-date-picker,.el-time-picker,.el-select {
  width: 200px ;
  margin-right: 10px;
}
</style>
