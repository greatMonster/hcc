
<template>
  <div class="name" :h="data.id">
    <div class="type" />
    <div class="carId">{{ data.taskName }}</div>
    <!-- <div class="type">({{ data.tasks[1].length }})</div>
    <div class="speed">({{ data.beginTime | joinDate }}-{{ data.endTime | joinDate }})</div>-->
    <!-- <el-popover placement="right" width="200" trigger="hover"> -->
    <!-- <div>
    <div>{{ data.taskName }}</div>
    </div>-->
    <!-- <div slot="reference" class="name" :h="data.id">
      <div class="carId">{{ data.name }}</div>
      <div class="type">({{ data.tasks[1].length }})</div>
      <div class="speed">({{ data.beginTime | joinDate }}-{{ data.endTime | joinDate }})</div>
    </div>-->
    <!-- </el-popover> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'TestLeft',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    joinDate: function(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      } else {
        return value
      }
    }
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  created() {},
  methods: {}
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
  border-bottom: 1px solid #2d2d2d;
  text-align: center;
}
.colorBar {
  width: 10px;
  height: 100%;
}

.carId {
  flex: 1;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}
.eltable {
  margin-top: 10px;
}
.type {
  padding: 0 5px 0 0;
  font-size: 14px;
}
.speed {
  font-size: 10px;
  color: #5d5d5d;
}
.el-table--small td,
.el-table--small th {
  padding: 6px 0 !important;
}
</style>
