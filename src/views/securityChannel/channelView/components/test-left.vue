
<template>
  <div class="name">
    <div class="colorBar" />
    <el-tooltip placement="right">
      <div class="name">
        <div class="type">{{ data.length }}</div>
        <div class="carId">{{ data.securityName }}</div>
        <div v-if="data.opentype" class="speed">({{ data.startTime | joinDate }}-{{ data.endTime | joinDate }})</div>
      </div>
      <div slot="content">
        <p v-if="data.openType==1">
          <span>动态通道</span>
        </p>
        <p v-if="data.openType==0">
          开放时长：
          <span>{{ data.deskTimes?data.deskTimes/60:0 }}h</span>
        </p>
        <p v-if="data.openType==1">
          任务总时长：
          <span>{{ data.deskTimes?data.deskTimes/60:0 }}h</span>
        </p>
        <p v-if="data.openType==0">
          覆盖率：
          <span>{{ (data.averageCover)*100 }} %</span>
        </p>
        <div v-if="data.openType==0">
          开放时间：
          <p v-for="(item,index) in data.openTimes" :key="index">{{ item.beginTime }}-{{ item.endTime }}</p>
        </div>
      </div>
    </el-tooltip>
    <!-- <div class="type">{{ data.type }}</div> -->
    <!-- <div class="carId">{{ data.deskCode }}</div>
    <div class="speed" />-->
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'TestLeft',
  props: {
    data: Object,
  },
  computed: {
    openTime() {
      return dayjs(this.data.openTime).format('HH:mm')
    },
    closeTime() {
      return dayjs(this.data.closeTime).format('HH:mm')
    },
  },
}
</script>

<style  scoped>
.name {
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding: 0 5px 0 0;
  align-items: center;
  color: #fff;
  border-bottom: 1px solid #2d2d2d;
  text-align: center;
}
.colorBar {
  width: 10px;
  height: 100%;
}

.carId {
  flex: 1;
}

.type {
  padding: 0 5px 0 0;
  font-size: 1.2rem;
}
</style>
