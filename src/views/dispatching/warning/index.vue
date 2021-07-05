<template>
  <div class="tab-container">
    <div class="block" style="padding:5px;margin-top:60px">
      <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期"
      />
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table border :data="tableData" style="width: 100%" :row-style="{'background-color':'#232c47'}">
      <el-table-column type="index" width="50" />
      <el-table-column prop="address" label="警戒时间" />
      <el-table-column prop="address" label="对象" />
      <el-table-column prop="address" label="类型" />
      <el-table-column prop="address" label="状态" />
      <el-table-column prop="address" label="描述" />
      <el-table-column prop="address" label="暂停时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'Tab',
  data() {
    return {
      value1: '',
      tableData: [{
        date: '任务1',
        name: 'sfdf',
        address: '2016-05-04'
      }, {
        date: '任务1',
        name: 'sfdf',
        address: '2016-05-04'
      }, {
        date: '任务1',
        name: 'sfdf',
        address: '2016-05-04'
      }, {
        date: '任务1',
        name: 'sfdf',
        address: '2016-05-04'
      }],
      tableData3: [{
        date: '任务1',
        name: '没有足够的时间进行全面清洁',
        address: '没有足够的时间进行全面清洁'
      }]

    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  // .tab-container {
  //   margin: 30px;
  // }
  .left{
      display: inline-block;
      width: 40%;
      padding: 20px;
      background: #232c47;
      margin: 20px;
      border-radius: 10px;
      vertical-align: top;
      p{ padding: 10px;}
      span{
          margin-right:10px;
              color: #919ec3;
      }
  }
</style>
