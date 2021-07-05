<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>

      <el-button v-popover:popover5 type="primary">设置表头</el-button>
      <el-popover ref="popover5" v-model="visible2" placement="top" width="160">
        <el-checkbox-group v-model="checkboxVal">
          <el-checkbox v-for="(item,index) in formTheadOptions" :key="index" :label="item">
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="primary" @click="visible2 = false">确定</el-button>
        </div>
      </el-popover>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const defaultFormThead = ['航班日期', '承运人', '航班号', '国际国内', '航班属性', '航班动态', '机型', '机号', '计飞站', '计到站']

export default {
  name: '',
  data() {
    return {
      visible2: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      sortOptions: [{ label: '进港', key: '+id' }, { label: '出港', key: '-id' }],
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          checkboxVal: 'banana-10',
          banana2: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-10',
          checkboxVal: 'banana-10',
          banana2: 'banana-20',
          orange: 'orange-20'
        }
      ],
      key: 1, // table key
      formTheadOptions: ['航班日期', '承运人', '航班号', '国际国内', '航班属性', '航班动态', '机型', '机号', '计飞站', '计到站'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      console.log(valArr)
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  methods: {
    handleFilter() {
      console.log(this)
    }
  }
}
</script>
<style>
.filter-container {
  margin-bottom: 10px;
}
</style>

