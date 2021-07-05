<template>
  <div class="body1">
    <!-- <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :key="'home'" name="home" label="主页">-->
    <homepage />
    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane :key="'data'" name="data" label="数据">
        <data-overview v-if="dataShow" />
    </el-tab-pane>-->
    <!-- <el-tab-pane :key="'realTime'" name="realTime" label="实时">
        <real-time v-if="realTimeShow" />
    </el-tab-pane>-->
    <!-- </el-tabs> -->
  </div>
</template>

<script>
import homepage from './components/homepage'
import dataOverview from './components/dataOverview'
import realTime from './components/realTime'
export default {
  components: {
    homepage,
    dataOverview,
    realTime
  },
  data() {
    return {
      activeName: 'home',
      homeShow: true,
      dataShow: false,
      realTimeShow: false
    }
  },
  created() {},
  methods: {
    handleClick(tab) {
      if (tab.name === 'home') {
        this.homeShow = true
        this.dataShow = false
        this.realTimeShow = false
      } else if (tab.name === 'data') {
        this.homeShow = false
        this.dataShow = true
        this.realTimeShow = false
      } else {
        this.homeShow = false
        this.dataShow = false
        this.realTimeShow = true
      }
    }
  }
}
</script>

<style scoped>
.body1 {
  margin-top: 60px;
}
.scheduleDiv {
  border-radius: 5px;
  text-align: center;
}
</style>
