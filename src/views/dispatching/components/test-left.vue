
<template>
  <div class="name">
    <!-- <div class="colorBar" /> -->
    <div class="type">{{ data.type }}</div>
    <el-popover
      ref="popover5"
      v-model="visible2"
      placement="bottom"
    >
      <el-table :data="gridData" size="small" class="eltable">
        <el-table-column property="name" label="组员" />
        <el-table-column property="name2" label="位置" />
        <el-table-column property="style" label="类型" />
        <el-table-column property="address" label="可用状态" />
        <el-table-column property="address" label="技能" />
        <el-table-column property="phone" label="电话号码" />
        <el-table-column property="phone" label="移出" />
      </el-table>
      <div style="text-align: right; margin:10px">
        <el-button type="primary" size="mini" @click="addMeb">填加组员</el-button>
        <el-button type="primary" size="mini" @click="addMeb">删除班组</el-button>
      </div>
    </el-popover>
    <div v-popover:popover5 class="carId">{{ data.id }}<i class="el-icon-arrow-down" /></div>
    <div class="speed">{{ data.key }}人 <i class="el-icon-right" /></div>
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
    }
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false,
      visible2: false,
      visible3: false,
      gridData: [{
        name: '王小虎',
        name2: '指挥室',
        address: '上班',
        style: 'asdfadf',
        phone: '1321321'
      }, {
        name: '王小虎',
        address: '休息 ',
        name2: '指挥室',
        style: 'asdfadf',
        phone: '1321321'
      }, {
        name: '王小虎',
        address: '休息',
        name2: '指挥室',
        style: 'asdfadf',
        phone: '1321321'
      }, {
        name: '王小虎',
        address: '上班',
        name2: '指挥室',
        style: 'asdfadf',
        phone: '132131'
      }]
    }
  },
  created() {
  },
  methods: {
    addMeb() {
      alert()
      this.visible3 = true
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
.speed{font-size: 10px}
.el-table--small td, .el-table--small th {
      padding: 6px 0!important;
}
.el-icon-arrow-down{font-size:2px!important;color:#7b7979}
</style>
