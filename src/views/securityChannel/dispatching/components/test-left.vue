
<template>
  <el-tooltip placement="right">
    <div class="name" :h="data.employeeId">
      <div class="type">{{ data.length }}</div>
      <div class="carId">{{ data.groupName }}</div>
      <div class="speed">({{ data.startTime | joinDate }}-{{ data.endTime | joinDate }})</div>
    </div>
    <div slot="content">
      <p>班组成员：</p>
      <p v-for="item in data.resources" :key="item.id" style="padding-left: 10px">
        {{ item.name }}
        <span v-if="item.flag" style="color: #409eff">
          <i class="el-icon-user"></i>
        </span>
      </p>
      <!-- <p>
        任务数/时长：
        <span>{{ (data.taskNum) }} / {{ (data.taskTime)/60 }}h</span>
      </p>
      <p>
        上班时长/利用率：
        <span>{{ (data.workTime)/60 }}h / {{ (data.useRatio*100).toFixed(2) }} %</span>
      </p>
      <p>
        对应技能：
        <span v-if="data.skillName">{{ data.skillName || '无' }}</span>
      </p>
      <p>
        当天任务：
        <span v-if="data.checkInTaskBeans">
          <div v-for="(item,ind) in data.checkInTaskBeans" :key="ind">
            <span style="display:block;height:20px;line-height:20px;margin-left:15px;">{{ item.startTime.split(' ')[1].substr(0,5) }} -- {{ item.endTime.split(' ')[1].substr(0,5) }} {{ item.deskCode }}号柜台</span>
          </div>
        </span>
      </p>-->
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TestLeft',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
    joinDate: function (value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      } else {
        return value
      }
    },
  },
  props: {
    data: Object,
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  created() {
    // console.log(data, 333)
  },
  methods: {},
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
ul {
  margin: 10px;
  padding: 0;
  min-height: 20px;
}
li {
  margin-bottom: 10px;
  list-style: none;
  display: flex;
  background: #232c47;
}
</style>
