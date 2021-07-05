<template>
  <div class="kpi-box">
    <el-tabs type="border-card">
      <el-tab-pane label="默认">
        <el-table :data="tableData" border>
          <el-table-column prop="name" label="日期" />
          <el-table-column prop="key" label="负载" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="KPIs">
        <!-- 重构 -->
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(item,index) in dataList" :key="index">
            <template slot="title">
              {{ item.outname }}
              <span style="margin-left:50px">{{ item.outToal }}</span>
            </template>
            <div>
              <el-collapse v-for="(item2,index2) in item.outlist" :key="index2">
                <el-collapse-item>
                  <template slot="title">{{ item2.skillname }}</template>
                  <div>
                    <el-table :data="item2.skilllist" border>
                      <el-table-column prop="date" label="日期" />
                      <el-table-column prop="count" label="负载" />
                    </el-table>
                    <div class="clean-total">
                      <div>{{ item.outname }}</div>
                      <div>{{ item2.total }}</div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- <div class="kpi-box1-bottom special-style">
              <div>最高峰工作负载最高值:674564645</div>
            </div>-->
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { kpis } from '@/api/workload'
export default {
  name: 'KpiComponent',
  data() {
    return {
      activeNames: ['1'],
      tableData: [
        {
          name: '',
          key: ''
        }
      ],
      tableData2: {},
      cleanTotal: '',
      dataList: []
    }
  },
  created() {
    if (this.$route.query.id) {
      this.initab()
      this.initab2()
    }
  },
  methods: {
    initab() {
      var data2 = {
        documentId: this.$route.query.id,
        flag: '1'
      }
      if (this.$route.query.id) {
        kpis(data2).then(response => {
          this.dataList = response.data
        })
      } else {
        console.log('documentId不存在')
      }
    },
    initab2() {
      var data = {
        documentId: this.$route.query.id,
        flag: '0'
      }
      if (this.$route.query.id) {
        kpis(data).then(response => {
          var _this = this
          Object.getOwnPropertyNames(response.data).forEach(function(cur) {
            if (response.data[cur] != null) {
              _this.tableData.push({ name: cur, key: response.data[cur] })
            }
          })
        })
      } else {
        console.log('documentId不存在')
      }
    }
  }
}
</script>

<style>
.el-collapse,
.el-collapse-item__header,
.el-collapse-item__wrap {
  border-top: none !important;
  border-bottom: none;
}
</style>

<style scoped>
.kpi-box {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: white;
}
.work-total {
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #263257;
}
.kpi-box1-bottom,
.clean-total {
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #263257;
  margin-top: 30px;
}
.special-style {
  background-color: cadetblue;
}
.clean-total {
  background-color: rgb(27, 37, 65);
  border: 1px solid #434b61;
  border-top: none;
  margin-top: 0;
}
/* PBB Agent */
.kpi-pbb-agent {
  margin-top: 10px;
}
.work-time {
  margin-top: 30px;
}
</style>
