<template>
  <div class="warp">
    <div class="elsteps">
      <el-card class="box-card">
        <div class="title">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <span>柜台服务标准</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="text-align: right">
                <el-button type="primary" size="small" @click="editData()">修 改</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>名称 ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.name }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>机场 ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.airportNameChn }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>最短任务时间(小时) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.minWorkHours }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>最长任务时间(小时) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.maxWorkHours }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>最短休息间隔(小时) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.minRestInterval }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>处理速率(人/小时) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.passRate }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>最大排队时间(分钟) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.maxQueuingTime }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: right">
              <span>工作开始时刻(分钟) ：</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">{{ initData.minDeskOpenTime }}</div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div class="title">柜台列表( 总数：{{ initData.desks.length }} )</div>
        <el-table :data="initData.desks" border stripe height="400">
          <el-table-column prop="code" label="编号" width="180" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="openType" label="开放类型" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.openType | openType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="国内/国际" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.region | region }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="serviceType" label="高端/经济" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.serviceType | serviceType }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card">
        <div class="title">旅客流量</div>
        <el-table :data="initData.traffics" border stripe max-height="250">
          <el-table-column label="名称" width="180">
            <template slot-scope="scope">
              <a @click="linktoTraffics(scope.row)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="trafficAirportName" label="机场" />
          <el-table-column prop="flightSchduleName" label="航班计划" />
          <el-table-column prop="dateRange" label="开始与结束日期" width="250">
            <template slot-scope="scope">
              <span>{{ scope.row.dateRange ? scope.row.dateRange : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="国内/国际">
            <template slot-scope="scope">
              <span>{{ scope.row.region | region }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="carriers" label="承运人">
            <template slot-scope="scope">
              <div v-if="scope.row.carriers.length > 1">
                <el-popover trigger="hover" placement="right" width="150">
                  <p style="overflow: auto; height: 100px">
                    <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}&nbsp;&nbsp;</span>
                  </p>
                  <div slot="reference">
                    <span>{{ scope.row.carriers[0] }}...</span>
                  </div>
                </el-popover>
              </div>
              <div v-else>
                <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}</span>
              </div>
              <!-- <span v-for="(item, index) in scope.row.carriers" :key="index">{{ item }}&nbsp;&nbsp;</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="serviceType" label="高端/经济">
            <template slot-scope="scope">
              <span>{{ scope.row.serviceType | serviceType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distributionType" label="分布模式">
            <template slot-scope="scope">
              <span>{{ scope.row.distributionType | distributionType }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { detailList } from '@/apiNew/checkInData'
export default {
  name: 'Details',
  filters: {
    region: function (value) {
      if (value) {
        switch (value) {
          case 'D':
            value = '国内'
            break
          case 'I':
            value = '国际'
            break
          case 'D/I':
            value = '国内/国际'
            break
        }
        return value
      }
    },
    serviceType: function (value) {
      if (value) {
        switch (value) {
          case 'V':
            value = '高端'
            break
          case 'C':
            value = '经济'
            break
          case 'C/V':
            value = '经济高端'
            break
        }
        return value
      }
    },
    distributionType: function (value) {
      if (value) {
        switch (value) {
          case 'B':
            value = '二项分布'
            break
          case 'R':
            value = '平均分布'
            break
        }
        return value
      }
    },
    openType: function (value) {
      if (value) {
        switch (value) {
          case '0':
            value = '常开'
            break
          case '1':
            value = '动态'
            break
        }
        return value
      }
    }
  },
  components: {},
  data() {
    return {
      id: this.$route.query.id,
      initData: {},
      active: 1
    }
  },
  created() {
    this.initable()
  },
  methods: {
    editData() {
      localStorage.removeItem('edit_stepOne')
      localStorage.removeItem('edit_stepTwo')
      localStorage.removeItem('edit_stepThree')
      this.$router.push({ path: '/newcheckIn/addPage', query: { id: this.id } })
    },
    initable() {
      // this.$store.dispatch('GetDeskDetailList', this.id)
      detailList(this.id).then((response) => {
        this.initData = response.data.data
      })
    },
    linktoTraffics(data) {
      this.$router.push({ path: '/newcheckIn/detailsPage', query: { id: data.id } })
    }
  }
}
</script>
<style>
.el-table /deep/ td,
.el-table /deep/ th {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.elsteps {
  padding: 1px 20px;
}
.grid-content {
  line-height: 26px;
}
</style>
