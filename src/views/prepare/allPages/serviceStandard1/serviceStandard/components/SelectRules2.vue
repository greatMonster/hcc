
<template>
  <div class="selectRules">
    <div v-if="item.filterType" class="spanClass">
      {{ item.filterType }}
    </div>
    <ul>
      <li v-for="(cond,b) in item.ruleFilterElements" :key="b">
        <div class="spanClass">
          {{ cond.identifyName }}
        </div>
        <div class="spanClass">
          {{ cond.operatorName }}
        </div>
        <div class="active">
          {{ cond.valueCn.length>15?cond.valueCn.slice(0,15):cond.valueCn }}
        </div>
      </li>
    </ul>
    <template v-if="item.childRuleFilters&&item.childRuleFilters.length>0">
      <SelectRules2 v-for="(ruleFilterElements,index6) in item.childRuleFilters" :key="index6" :data="ruleFilterElements" :tdata="item.childRuleFilters" :indexd="index6" />
    </template>
  </div>
</template>
<script>
import { initTable } from '@/api/attributeDefinition'
import { updateRule2 } from '@/api/serviceStandard'
import SelectRules2 from './SelectRules2'
export default {
  name: 'SelectRules2',
  components: { SelectRules2 },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      group: {},
      ishow: false,
      operatorCode: '',
      isLookup: '',
      FLIGHT: 'FLIGHT',
      dataType: '',
      index: 0,
      removeData: '',
      item: this.data,
      airport: this.$store.state.user.airport,
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
          this.isLookup = element.attributeType.isLookup
        })
      })
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
    cancelGroupClick(item, e) {
      localStorage.setItem('filterId', item.filterId)
      e.target.parentNode.remove()
    },
    // 删除附加条件
    cancelGroupClick2(cont, b) {
      cont.splice(b, 1)
    },
    // 添加附加条件
    _addCondFun(group) {
      if (!group.ruleFilterElements) {
        this.$set(group, 'ruleFilterElements', [])
      }
      group.ruleFilterElements.push({})
    }
  }
}
</script>
<style scoped>
li {
  list-style: none;
  margin-bottom: 5px;
  margin-top: 5px;
}
.spanClass{
    display: inline-block;
    width: 200px;
    padding: 5px 20px;
      border: 1px solid #434b61;
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
.spanActive{
    display: inline-block;
    width: 200px;
    padding: 5px 20px;
  border: 1px solid #434b61;
}
.active{
    min-width:200px;
 display: inline-block;

    padding: 5px 20px;
      border: 1px solid #434b61;
}
.el-input {
  width: 200px !important;
  margin-right: 10px;
}
</style>
