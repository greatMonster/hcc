
<template>
  <div class="name">
    <!-- <div class="type" />
    <div class="carId">{{ data.name }}</div>
    <div class="type">({{ data.tasks[1].length }})</div>
  <div class="speed">({{ data.beginTime | joinDate }}-{{ data.endTime | joinDate }})</div>-->
    <el-popover placement="right" width="300" trigger="click">
      <div>
        技能：
        <p v-for="(item, i) in data.skills" :key="i">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</p>
        <p v-if="data.resources.length">班组成员：</p>
        <p v-for="item in data.resources" :key="item.id" style="padding-left: 10px">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}
          <span v-if="item.flag" style="color: #409eff">
            <i class="el-icon-user"></i>
          </span>
        </p>
        上班时间：
        <div>
          <p v-for="(item, i) in data.calendars" :key="i">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ item.workDate.substring(0, 10) }}：{{ item.beginTime.substring(10, 16) }}-{{ item.endTime.substring(10, 16) }} <el-button size="mini" type="primary" @click="updateTime(item.id)">修改</el-button>
          </p>
        </div>
      </div>
      <div slot="reference" class="name" :h="data.id">
        <div class="carId">{{ data.name }}</div>
        <div class="type">({{ data.taskNum ? data.taskNum : 0 }})</div>
        <div class="speed">({{ data.beginTime | joinDate }}-{{ data.endTime | joinDate }})</div>
      </div>
    </el-popover>
    <!-- 修改员工上班时间 -->
    <el-dialog v-dialogDrag title="修改时间" :visible.sync="autoDialogVisible" width="60%" height="500px" :append-to-body="flag">
      <el-form ref="formAddServer" :model="formAddServer" label-width="120px">
        <el-form-item prop="beginTime" label="调整开始时间">
          <el-time-picker v-model="formAddServer.beginTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="调整结束时间">
          <el-time-picker v-model="formAddServer.endTime" size="small" :arrow-control="arrowControl" value-format="HH:mm" format="HH:mm" placeholder="选择结束时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="autoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddServerClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateWorkTime } from '@/apiNew/specialVehicle'
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
    joinDate: function (value) {
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
      flag: true,
      id: '',
      arrowControl: true,
      autoDialogVisible: false,
      formAddServer: { beginTime: '', endTime: '' },
      dialogVisible: false
    }
  },
  created() {},
  methods: {
    updateTime(id) {
      this.id = id
      this.autoDialogVisible = true
    },
    handleAddServerClick() {
      const data = {
        id: this.id,
        beginTime: this.formAddServer.beginTime,
        endTime: this.formAddServer.endTime
      }
      updateWorkTime(data)
        .then((response) => {
          this.$message.success('修改成功')
          this.$emit('updateChange')
          this.autoDialogVisible = false
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
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
</style>
