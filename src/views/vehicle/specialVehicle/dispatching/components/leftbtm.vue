
<template>
  <div class="name">
    <div><el-button>{{ data }}</el-button></div>
  </div>
</template>

<script>
export default {
  name: 'TestB',
  filters: {
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  created() {
    // console.log(this.data, 9999)
  },
  methods: {
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
  padding: 0 5px 0 5px;
  /* border-radius: 8px 0 0 8px; */
  align-items: center;
  background: #000;
  color: #cccccc;
  border-bottom: 1px solid #2d2d2d
}
.colorBar {
  width: 10px;
  height: 100%;
}

.carId {
  flex: 1;
  cursor: pointer;
  color: #fff;
}
.eltable{margin-top: 10px}
.type {
  padding: 0 5px 0 0;
  font-size:14px;
}
.speed{font-size: 10px;color:#5d5d5d}
.el-table--small td, .el-table--small th {
      padding: 6px 0!important;
}
</style>
