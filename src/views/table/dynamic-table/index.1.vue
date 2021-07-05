<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
    </div>

    <div class="filter-container" style="margin:10px 0">
      <!-- <el-select v-model="checkboxVal" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in checkboxVal" :key="item.key" :label="label" />
      </el-select> -->

      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="航班日期">
          航班日期
        </el-checkbox>
        <el-checkbox label="承运人">
          承运人
        </el-checkbox>
        <el-checkbox label="航班号">
          航班号
        </el-checkbox>
        <el-checkbox label="国际国内">
          国际国内
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180" />
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
  data () {
    return {
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
      sortOptions: [{ label: '进', key: '+id' }, { label: '出', key: '-id' }],
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          checkboxVal: 'banana-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-10',
          checkboxVal: 'banana-10',
          banana: 'banana-20',
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
    checkboxVal (valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  methods: {
    handleFilter () {
      console.log(this)
    }
  }
}
</script>

