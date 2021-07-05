
<template>
  <div class="name">
    <!-- <div class="colorBar" /> -->
    <div class="type">{{ data.type }}</div>

    <el-popover
        ref="popover5"
        placement="bottom"
        width=""
        v-model="visible2">
        <el-table :data="gridData" size="small">
          <el-table-column  property="name" label="组员"></el-table-column>
          <el-table-column  property="name2" label="位置"></el-table-column>
          <el-table-column  property="style" label="类型"></el-table-column>
          <el-table-column  property="address" label="可用状态"></el-table-column>
          <el-table-column  property="address" label="技能"></el-table-column>
          <el-table-column  property="phone" label="电话号码"></el-table-column>
        </el-table>
      
        <div style="text-align: right; margin-top:10px">
          <el-button type="primary" size="mini" @click="addMeb">填加组员</el-button>
        </div>
      </el-popover>

    <div class="carId" v-popover:popover5>{{ data.name }}{{ data.id }}</div>
    <div class="speed">{{ data.speed }}个</div>







  </div>
</template>

<script>
export default {
  name: 'TestLeft',
  props: {
    data: Object
  },
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
  data(){
    return{
         dialogVisible: false,
       visible2: false,
       visible3:false,
      gridData: [{
          name: '王小虎',
          name2:'指挥室',
          address: '上班',
          style:'asdfadf',
          phone:'1321321'
        }, {
          name: '王小虎',
          address: '休息 ',
          name2:'指挥室',
           style:'asdfadf',
          phone:'1321321'
        }, {
          name: '王小虎',
          address: '休息',
          name2:'指挥室',
           style:'asdfadf',
          phone:'1321321'
        }, {
          name: '王小虎',
          address: '上班',
          name2:'指挥室',
          style:'asdfadf',
          phone:'132131'
        }]
    }
  },
    created() {
  },
    methods: {
      addMeb(){
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
  background: #3E4660;
  color: #fff;
  border-bottom: 1px solid #434c69
}
.colorBar {
  width: 10px;
  height: 100%;
}

.carId {
  flex: 1;
  cursor: pointer;
}

.type {
  padding: 0 5px 0 0;
  font-size: 1.2rem;
}
.el-table--small td, .el-table--small th {
      padding: 6px 0!important;
}
</style>
