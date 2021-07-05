
<template>
  <div class="name1">
    <div class="carId" style="display:flex;justify-content:space-around;font-size:10px;width:100%">
      <div style="line-height: 63px;">
        {{ data.gtArray[0].taskName }}
      </div>
      <div>
        <h4> <span>实：</span> <span>{{ data.gtArray[0].actualBegin?data.gtArray[0].actualBegin.substring(10,16):'-' }}</span> </h4>
        <h4><span>预：</span> <span> {{ data.gtArray[0].start?data.gtArray[0].start.substring(10,16):'-' }}</span> </h4>
      </div>
      <div>
        <h4> <span>实：</span> <span>{{ data.gtArray[0].actualEnd?data.gtArray[0].actualEnd.substring(10,16):'-' }}</span> </h4>
        <h4><span>预：</span> <span> {{ data.gtArray[0].end?data.gtArray[0].end.substring(10,16):'-' }}</span> </h4>

      </div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'TestLeft',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
    // eslint-disable-next-line vue/require-default-prop
    item2: Object
  },
  computed: {
    openTime() {
      return dayjs(this.data.openTime).format('HH:mm')
    },
    closeTime() {
      return dayjs(this.data.closeTime).format('HH:mm')
    }
  },
  watch: {
  },
  created() {
    console.log(this.data)
  }
}
</script>

<style  scoped>
.name1 {

  height: 100%;
  width: 100%;
  color: #fff;
  border-bottom: 1px solid #2d2d2d;
  text-align: center;
}

.colorBar {
  width: 10px;
  height: 100%;
}

.carId {
    width: 100%;
  flex: 1;
}

.type {
  padding: 0 5px 0 0;
  font-size: 1.2rem;
}
</style>
<style lang="scss">
      .name1{
          span{
         display: inline-block;
         width: 28px;
          }
      }
</style>
