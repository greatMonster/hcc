
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

        <div class="spanClass">
          {{ cond.value }}
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
// import { initTable } from '@/api/realTimeJobRules'
import SelectRules2 from './SelectRules2'
import { updateRule2 } from '@/api/realTimeJobRules'
export default {
  name: 'SelectRules2',
  components: { SelectRules2 },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    indexd: {
      type: Number,
      default() {
        return null
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
      FLIGHT: 'FLIGHT_DYNAMIC',
      isLookup: '',
      airport: this.$store.state.user.airport,
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
        }
        this.item = this.data
      },
      deep: true
    }
  },
  created() {
    this.initable2()
    this.initable3()
  },
  mounted() {},
  methods: {
    initable2() {
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
    initable3() {
      this.conditions3 = []
      updateRule2().then(response => {
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
      //   e.target.parentNode.remove()
      this.tdata.splice(index, 1)
    },
    // 删除附加条件
    cancelGroupClick2(cont, b) {
      cont.splice(b, 1)
      // cont.remove()
    },
    // 添加附加条件
    _addCondFun(group) {
      if (this.item.filterType) {
        if (!group.ruleFilterElements) {
          this.$set(group, 'ruleFilterElements', [])
        }
        group.ruleFilterElements.push({
          // text: ''
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
.spanActive{
    display: inline-block;
    width: auto;
    padding: 5px 20px;
  border: 1px solid #434b61;
}
.selectRules span {
  cursor: pointer;
  background: #2d3a5e;
  padding: 7px 12px;
  border-radius: 3px;
  border: 1px solid #434b61;
}
.el-input {
  width: 200px !important;
  margin-right: 10px;
}
</style>
