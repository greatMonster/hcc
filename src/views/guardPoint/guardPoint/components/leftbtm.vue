
<template>
  <div class="name">
    <div class="colorBar" />
    <!-- <el-tooltip placement="right"> -->
    <div class="name">
      <!-- <div class="type">{{ data.length }}</div> -->
      <div class="carId">{{ data.taskName }}</div>
      <!-- <div class="speed">({{ data.start | joinDate }}-{{ data.end | joinDate }})</div> -->
    </div>
    <!-- <div slot="content"> -->
    <!-- <p v-if="data.openType==1">
          <span>动态柜台</span>
        </p>
        <p>
          开放时长：
          <span>{{ data.deskTimes?data.deskTimes:0 }}h</span>
        </p>
        <p v-if="data.openType==0">
          利用率：
          <span>{{ (data.averageCover)*100 }} %</span>
        </p>
        <p v-if="data.openType==0">
          开放时间：
          <span>{{ data.openTimes[0] }}-{{ data.openTimes[1] }}</span>
    </p>-->
    <!-- </div>
    </el-tooltip>-->
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'TestLeft',
  filters: {
    joinDate: function(value) {
      if (value) {
        value = value.substring(11, 16)
      }
      return value
    }
  },
  props: {
    data: Object
  },
  computed: {
    openTime() {
      return dayjs(this.data.openTime).format('HH:mm')
    },
    closeTime() {
      return dayjs(this.data.closeTime).format('HH:mm')
    }
  },
  created() {
    console.log(this.data, 110)
  }
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
