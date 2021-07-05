
<template>
  <div class="name">
    <div class="colorBar" />
    <div class="type">{{ data.type }}</div>
    <div class="carId">{{ data.securityName }}{{ data.id }} ({{ openTime }}-{{ closeTime }})</div>
    <div class="speed" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'TestLeft',
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
