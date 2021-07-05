<template>
  <div class="runtime-middle">
    <!-- <div class="please-select">选择</div> -->
    <div class="select-box">
      <span>KPI视图</span>
      <span style="display:inline-block;padding-left:30px;width:380px">
        <el-select v-model="value" placeholder="请选择" style="width:380px;color:white">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
    </div>
    <div class="select-detail">
      <div class="select-detail-display">
        <el-table
          :data="tableData1"
          :header-row-style="{'background-color':'rgb(10, 20, 47)'}"
          :row-style="{'background-color':'#232c47','color':'white'}"
          border
          style="width: 100%"
        >
          <el-table-column prop="avePay" label="平均支付" />
          <el-table-column prop="aveTranslate" label="平均转变" />
          <el-table-column prop="workloadRange" label="工作量覆盖" />
          <el-table-column prop="maxProject" label="最高工程" />
          <el-table-column prop="maxWorkload" label="最高工作量" />
          <el-table-column prop="countVar" label="数量变化" />
          <el-table-column prop="totalPay" label="总支付时间" />
          <el-table-column prop="totalLength" label="总长度时间" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KpisDisplay',
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '员工档案 此视图显示每个员工配置文件的KPI值'
        },
        {
          value: '选项2',
          label:
            '员工简介和日期 此视图显示每个日期的每个员工配置文件的KPI值的员工档案和日期'
        },
        {
          value: '选项3',
          label: '技能和日期 此视图显示每个日期的每个技能组合的KPI值'
        },
        {
          value: '选项4',
          label: '默认KPI视图 此视图显示每个文档的KPI值'
        }
      ],
      value: '',
      tableData1: [{
        avePay: '06:40',
        aveTranslate: '06:40',
        workloadRange: '840:45',
        maxProject: '4',
        maxWorkload: '11',
        countVar: '165',
        totalPay: '1100:00',
        totalLength: '1100:00'
      }]
    }
  }
}
</script>

<style scoped>
.runtime-middle {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    background-color: #232C47 ;
    border-bottom: 3px solid #434B61;
    color: white;
}
.please-select {
    width: 100%;
    height: 40px;
    line-height: 20px;
    box-sizing: border-box;
    padding: 10px;
    font-size: 14px;
    background-color: #263257;
}
.select-box,.select-detail {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
}
.select-detail-title {
    width: 100%;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 5px 0;
    background-color: #263257;
    /* border-bottom: 1px solid #495373 ; */
}
</style>
