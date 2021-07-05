
<template>
  <div class="name">
    <div class="colorBar" />
    <div class="type">{{ data.type }}</div>
    <div class="carId">{{ data.securityName }}{{ data.name }}</div>
    <div class="speed">{{ data.speed }}</div>
  </div>
</template>

<script>
export default {
  name: 'TestLeft',
  props: {
    data: Object
  }
}
</script>

<style  scoped>
.name{
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
.colorBar{
  width: 10px;
  height: 100%;
}

.carId{
  flex: 1;
}

.type{
  padding: 0 5px 0 0 ;
  font-size: 1.2rem;
}
</style>
