<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="任务详情" name="first">
        <div class="left1">
          <p>
            <span>任务名称 :</span>
            {{ TargetDetail.name }}
          </p>
          <p>
            <span>航班号 :</span>
            {{ TargetDetail.flightNo }}
          </p>
          <p>
            <span class="two-style">计划起飞时间 : {{ TargetDetail.deptTime }}</span>
            <span style="padding-left: 100px;">计划到达时间 :</span>
            {{ TargetDetail.arrTime }}
          </p>
          <p>
            <span>停场时间 :</span>
            {{ TargetDetail.aoglength }} 分钟
          </p>
          <p>
            <span>机型 :</span>
            {{ TargetDetail.aircraftType }}
          </p>
          <p>
            <span class="two-style">出发机坪 : {{ TargetDetail.deptApron }}</span>
            <span style="padding-left: 100px;">到达机坪 :</span>
            {{ TargetDetail.arrApron }}
          </p>
          <p>
            <span>机位 :</span>
            {{ TargetDetail.position }}
          </p>
          <p>
            <span class="two-style">起飞站 : {{ TargetDetail.deptAirport }}</span>
            <span style="padding-left: 100px;">到达站 :</span>
            {{ TargetDetail.arrAirport }}
          </p>
          <p>
            <span>国际国内 :</span>
            {{ TargetDetail.regionType | joinDate }}
          </p>
          <p>
            <span>登机口 :</span>
            {{ TargetDetail.deptGate }}
          </p>
          <p>
            <span>任务类型 :</span>
            {{ TargetDetail.taskTypeName }}
          </p>
          <p>
            <span>计划到位时间 :</span>
            {{ TargetDetail.planInPlace }}
          </p>
          <p>
            <span class="two-style">计划发车时间 : {{ TargetDetail.planDepart }}</span>
            <span style="padding-left: 100px;">计划结束时间 :</span>
            {{ TargetDetail.planEnd }}
          </p>
          <p>
            <span class="two-style">任务开始位置 : {{ TargetDetail.startPosition }}</span>
            <span style="padding-left: 100px;">任务结束位置 :</span>
            {{ TargetDetail.endPosition }}
          </p>
          <p>
            <span>任务状态 :</span>
            {{ TargetDetail.taskState | taskState1 }}
          </p>
          <p>
            <span>被分配员工 :</span>
            {{ TargetDetail.employeeName }}
          </p>
          <p>
            <span>关联任务 :</span>
            <br />
            <span v-for="(item, index) in TargetDetail.relatedTasks" :key="index" style="display:inline-block;margin:5px 20px;background: #87a054;padding:2px 5px;font-size: 13px;">{{ item.name }}</span>
          </p>
        </div>
        <div class="cancel-task">
          <el-button type="primary" size="small" @click="cancelTaskClick">取 消 任 务</el-button>
        </div>
        <!-- 取消任务弹窗 -->
        <el-dialog v-dialogDrag title="取消任务" :visible.sync="cancelDialog" width="60%">
          <div style="height: 200px;">
            <el-form ref="formCancel" :model="formCancel" :label-width="formLabelWidth">
              <el-form-item prop="taskName" label="任务名称">
                <el-input v-model="formCancel.name" size="small" disabled />
              </el-form-item>
              <el-form-item prop="canceledReason" label="取消原因">
                <el-input v-model="formCancel.canceledReason" size="small" />
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button style="background: #495373;color: white;" @click="cancelDialog=false">取 消</el-button>
            <el-button type="primary" @click="cancelTaskClickConfirm">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { getTaskInfo, getTaskInfoCopy } from '@/api/busRules'
import { getTaskInfo, cancelTask } from '@/apiNew/vehicle'
export default {
  name: 'TargetDetail',
  filters: {
    joinDate: function(value) {
      switch (value) {
        case 'I':
          value = '国际'
          break
        case 'D':
          value = '国内'
          break
        case 'I/D':
          value = '国际/国内'
          break

        default:
          break
      }
      return value
    },
    busType1: function(value) {
      switch (value) {
        case 'BF_BUS':
          value = '北方摆渡车'
          break
        case 'COBUS':
          value = 'COBUS摆渡车'
          break
        case 'BIG_BUS':
          value = '大摆渡车'
          break

        default:
          break
      }
      return value
    },
    taskState1: function(value) {
      switch (value) {
        case 1:
          value = '等待'
          break
        case 2:
          value = '已分配'
          break
        case 3:
          value = '未分配'
          break
        case 4:
          value = '进行中'
          break
        case 5:
          value = '完成'
          break
        case 6:
          value = '新增'
          break
        case 7:
          value = '取消'
          break
        case '8':
          value = '锁定'
          break
        case 9:
          value = '已接收'
          break
        case 10:
          value = '未接收'
          break
        case 11:
          value = '告警'
          break
        case 12:
          value = '已处理告警'
          break
        case 13:
          value = '未处理告警'
          break
      }
      return value
    },
    joinDate2: function(value) {
      value = value.substring(11, 16)
      return value
    }
  },

  data() {
    return {
      formLabelWidth: '80px',
      cancelDialog: false,
      formCancel: {},
      flightLegId: this.$route.query.flightLegId,
      type: this.$route.query.type,
      TargetDetail: [],
      activeName: 'first',
      tableData: [
        {
          date: '任务1',
          name: 'sfdf',
          address: '2016-05-04'
        }
      ],
      tableData3: [
        {
          date: '任务1',
          name: '没有足够的时间进行全面清洁',
          address: '没有足够的时间进行全面清洁'
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    cancelTaskClickConfirm() {
      this.$confirm('此操作会取消此任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            id: this.flightLegId,
            canceledReason: this.formCancel.canceledReason
          }
          cancelTask(data)
            .then(response => {
              this.$message.success('该任务已取消')
              window.history.go(-1)
              this.cancelDialog = false
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.response.data.message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    init() {
      if (!this.flightLegId) {
        this.$message({
          type: 'success',
          message: '无任务id'
        })
      } else {
        getTaskInfo(this.flightLegId).then(response => {
          if (response.data.data) {
            this.TargetDetail = response.data.data
          } else {
            this.$message.success('暂无数据')
          }
        })
      }
    },
    handleClick(tab, event) {
      // console.log(this.$route.params.TargetDetail)
    },
    cancelTaskClick() {
      this.cancelDialog = true
      this.formCancel.name = this.TargetDetail.name + ':' + '(' + this.TargetDetail.planInPlace.substring(11, 16) + '-' + this.TargetDetail.planEnd.substring(11, 16) + ')' + '-' + this.TargetDetail.employeeName
    }
  }
}
</script>

<style lang="scss" scoped>
/* // .tab-container {
  //   margin: 0 5px;
  // } */
.left1 {
  padding: 0 20%;
}
.left {
  display: inline-block;
  width: 30%;
  padding: 10px;
  background: #232c47;
  margin: 10px;
  border-radius: 10px;
  vertical-align: top;
  p {
    padding: 10px;
  }
  ins {
    text-decoration: none;
    background: #87a054;
    border-radius: 4px;
    padding: 5px;
    span {
      color: #fff;
    }
  }
  span {
    margin-right: 10px;
    color: #919ec3;
  }
}
.two-style {
  display: inline-block;
  width: 268px;
}
.cancel-task {
  text-align: center;
  margin: 30px;
}
</style>
