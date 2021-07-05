<template>
  <div class="warp">
    <div class="title">
      <el-form ref="ruleForm" :model="ruleForm" label-width="60px" class="demo-ruleForm" size="small">
        <el-form-item label="日期：" prop="region">
          <el-date-picker
            v-model="ruleForm.data"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="pickdta"
          />
        </el-form-item>
        <el-form-item label="航班：" prop="region">
          <el-input v-model="ruleForm.flightNo" placeholder="请输入航班号" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search(ruleForm.flightNo)" />
          </el-input>
        </el-form-item>
      </el-form>
      <p class="AvgSumRate"><span>航班总数：{{ tableData.total }}</span></p>
    </div>

    <el-table
      v-loading="listLoading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      stripe
      :data="tableData.rows"
    >
      <el-table-column
        type="index"
        width="45"
        label=""
      />
      <el-table-column
        prop="flightNo"
        label="航班号"
        width="80"
      />
      <el-table-column
        prop="position"
        label="机位"
        width="50"
      >
        <template slot-scope="scope">
          <span :style="{'text-decoration':'underline'}">{{ scope.row.tasks[0].position }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="flightType"
        label="进/出港"
        width="70"
      >
        <template slot-scope="scope">
          <span :style="{color:scope.row.flightType=='D'?'#e97ce5':'#a9a4a4'}">{{ scope.row.flightType | joinDate2 }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="deptTime" label="起飞时间" width="80">
        <template slot-scope="scope">
          <span :style="{color:scope.row.flightType=='A'?'#a9a4a4':'#e97ce5'}">{{ scope.row.deptTime | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="arrTime" label="到达时间" width="80">
        <template slot-scope="scope">
          <span :style="{color:scope.row.flightType=='D'?'#a9a4a4':'#fff'}">{{ scope.row.arrTime | joinDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="acType"
        label="机型"
        width="60"
      />
      <el-table-column
        prop="jjGdNumber"
        label="人数"
        width="80"
      />
      <el-table-column
        prop=""
        label="任务数"
        width="50"
      >
        <template slot-scope="scope">
          {{ scope.row.tasks.length }}
        </template>
      </el-table-column>
      <el-table-column label="任务" fixed="right">
        <template slot-scope="scope">
          <div class="list">
            <div v-for="(item,index) in scope.row.tasks" :key="index" class="divlist" :data="index">
              <el-popover trigger="hover" placement="top">
                <p>任务: {{ item.taskName }}</p>
                <p>时间: {{ item.planInPlace | joinDate }} - {{ item.planEnd | joinDate }}</p>
                <p>人员：{{ item.employeeName }}</p>
                <p>id:{{ item.id }}</p>
                <div slot="reference" class="taskState">
                  <div :class="{allocation:item.taskState==2,unallocated:item.taskState==1,newstaus:item.id == newValue}" :staus="item.taskState" @click="openNext(item)">
                    {{ item.taskName | joinName }} ({{ item.planInPlace | joinDate }} - {{ item.planEnd | joinDate }})
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="ruleForm.pageSize"
      layout="total, prev, pager, next"
      :total="ruleForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>
<script>
import { getFlightPlanInfo } from '@/api/busRules'
// import { } from '@/api/checkInData'
export default {
  name: 'CheckIn',
  filters: {
    joinDate: function(value) {
      value = value.substring(11, 16)
      return value
    },
    joinName: function(value) {
      value = value.substring(8, 20)
      return value
    },
    joinDate2: function(value) {
      if (value === 'A') {
        value = '进港'
        return value
      } else {
        value = '出港'
        return value
      }
    }
  },
  data() {
    return {
      options: [],
      ruleForm: {
        data: '2019-01-15',
        // data: this.getNowFormatDate(),
        pageSize: 1000,
        pageNum: '1',
        currentPage: '1',
        total: 0,
        flightNo: ''
      },
      tableData: {},
      listLoading: false,
      newValue: localStorage.name
    }
  },
  watch: {
    'newValue': {
      handler: function(val, oldval) {
        // console.log(val, this.$store.state.list.newValue, 888)
        // this.newValue = val
        console.log(this.$store.state.list, 7777)
      },
      deep: true, // 对象内部的属性监听，也叫深度监听
      immediate: true
    }
  },
  created() {
    this.init()
    // console.log(this.$store.state, 5556)
    window.addEventListener('storage', function(e) {
      this.newValue = e.newValue
    })
    console.log(this.newValue, 777)
    this.$store.commit('ruleId', { id: this.newValue })
  },
  methods: {
    init() {
      this.listLoading = true
      getFlightPlanInfo(this.ruleForm).then(response => { // init
        this.tableData = response.data
        if (response.data.total) {
          this.ruleForm.total = parseInt(response.data.total)
        }
        this.listLoading = false
      })
    },
    openNext(item) { // 返回派工页面
      var data = item.planInPlace.substring(0, 10)
      const routeData = this.$router.resolve({ path: '/dispatching/shuttleBus/ShuttleBus', query: { id: item.id, skillId: item.skillId, data: data }})
      window.open(routeData.href)
    },
    pickdta(e) {
      if (e == null) { // 如果清空了日期会报错，给设置一个默认日期
        this.ruleForm.data = '2019-01-15'
        this.init()
      } else {
        this.ruleForm.data = e
        this.init()
      }
    },
    search(item) {
      this.ruleForm.flightNo = item
      this.init()
    },
    // 分页
    handleSizeChange(val) {
      this.ruleForm.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.ruleForm.pageNum = val
      this.init()
    },
    getNowFormatDate() { // 获取当天时间
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  }
}
</script>
<style lang="scss" scoped>
.AvgSumRate{
  font-size: 14px;
  span{
    margin-right: 20px
  }
}
.title{
  padding: 15px 20px 5px;
  background: #26315a;
  border-top:4px solid #509bc7;
}
.demo-ruleForm{
  .el-form-item{display: inline-block;margin-bottom: 0}
}
.list{
  text-align: left;
  div.divlist{
    display:inline-block;
    width: 200px;
    margin: 0 5px;
    overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 12px;
  }
}
</style>
