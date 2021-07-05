<template>
  <div>
    <div class="content-box" />
    <ul class="chartdiv">
      <li>
        <div class="workload">
          <div class="workload-top">
            <div class="left1">
              <el-button size="small" type="primary" @click="openD">添加工作量</el-button>
            </div>
            <div class="span-value">从</div>
            <div class="span-value">
              <el-date-picker v-model="begin" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" default-value />
            </div>
            <div class="span-value">开始 为期</div>
            <div class="span-value">
              <el-date-picker v-model="end" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" default-value />
            </div>
            <div class="span-value">的工作量</div>
            <el-button @click="search2">查询</el-button>
          </div>
        </div>
      </li>
      <li>
        <div class="workload">
          <div v-for="(Outitem,Outindex) in lineChartData" :key="Outindex" v-loading="listLoading" class="runtime-bottom">
            <div class="runtime-left">{{ Outitem.workloadName }}</div>
            <div v-for="(item,i) in Outitem.list" :key="i" class="content" style="margin-bottom:10px">
              <div v-if="Outitem.style =='list'" class="left">
                <el-checkbox v-model="checkList" :label="item.roleId2" @change="checkedChange(item)">{{ item.role }}</el-checkbox>
              </div>
              <div v-else class="left">{{ item.role }}</div>
              <div class="right">
                <div v-for="(items,index) in item.datas" :key="index" class="datalist" :rowIndex="i" :colIndex="index" @click="showEchart(items)">
                  <p>{{ items.day }}</p>
                  <line-chart :chart-data="item.datas[index]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="left1">
          <el-button size="small" type="primary" @click="mergeWorkloads">合并工作量</el-button>
          <el-button size="small" type="primary" @click="savedialogTableVisible=true">保存</el-button>
        </div>
      </li>
    </ul>
    <!-- 工作量大波形图 -->
    <el-dialog v-dialogDrag title="工作量波形图" :visible.sync="dialogTableVisible" :before-close="closeImport">
      <h3 style="margin-top: 0;">{{ lineChartDataBig.day }}</h3>
      <LineChartBig :chart-data="lineChartDataBig" style="width:100%;height:600px" />
    </el-dialog>
    <!-- 填加工作量弹框 -->
    <el-dialog v-dialogDrag title="工作量文件" :visible.sync="gzldialogTableVisible" width="30%">
      <el-form ref="form" v-loading="listLoading" :model="form" label-width="20%">
        <el-form-item prop="workloadDocumentId" label="工作量文件：">
          <el-select v-model="form.workloadDocumentId" value-key="documentId" placeholder="请选择工作量文档" @change="workloadOptions(form)">
            <el-option v-for="item in workloadDocOptions" :id="item.name" :key="item.documentId" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btnTop" type="primary" @click="onSubmit('form')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 合并后的保存 -->
    <el-dialog v-dialogDrag title="保存" :visible.sync="savedialogTableVisible" width="30%">
      <el-form ref="saveform" v-loading="listLoading" :rules="rules" :model="saveform" label-width="20%">
        <el-form-item prop="documentName" label="文件名：">
          <el-input v-model="saveform.documentName" />
        </el-form-item>
        <el-form-item prop="skillId" label="技能：">
          <el-select v-model="saveform.skillId" placeholder="请选择" @visible-change="visiblechange">
            <el-option v-for="item in roleOptions" :key="item.label" value-key="label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="interval" label="粒度：">
          <el-select v-model="saveform.interval" placeholder="请选择" @change="intervalOptions(saveform.interval)">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="sampling" label="抽样模式：">
          <el-select v-model="saveform.sampling" placeholder="请选择" :disabled="disabled">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btnTop" type="primary" @click="save('saveform')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { initTable } from '@/api/setWorkRules'
import LineChartBig from '@/components/echarts/LineChartBig'
import { mergeWorkloads, mergeworkloads, saveMergeResult, flightDateSkill, searchDateforSkill, saveMergeResultSkill } from '@/api/workload'
import LineChart from '@/components/echarts/LineChart'
export default {
  name: 'MergeIndex',
  components: { LineChart, LineChartBig },
  data() {
    return {
      skill: this.$route.query.type,
      disabled: false,
      saveform: { documentName: '', skillId: this.checkList, interval: '', sampling: '' },
      roleIdsoptions: this.checkList,
      options: [{ value: 'MAX', label: 'MAX' }, { value: 'MIN', label: 'MIN' }, { value: 'AVG', label: 'AVG' }],
      options2: [{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '15', label: '15' }],
      savedialogTableVisible: false,
      documentSkillIds: [],
      workloadName: this.$route.query.name,
      form: {},
      workloadDocOptions: [],
      gzldialogTableVisible: false,
      checkList: [],
      roleOptions: [],
      roleOptions2: [],
      workRulesDocOptions: [],
      flightoptions: [], // 航班计划
      taskList: [], // 任务
      dialogTableVisible: false,
      listLoading: false,
      documentId: this.$route.query.documentId,
      lineChartDataBig: {},
      lineChartData: [],
      lineChartDataMerge: [],
      result: '',
      end: '',
      begin: '',
      complete: '',
      rules: {
        documentName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        skillId: [{ required: true, message: '请选择', trigger: 'change' }],
        interval: [{ required: true, message: '请选择', trigger: 'change' }],
        sampling: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    intervalOptions(item) {},
    save(saveform) {
      this.$refs.saveform.validate(valid => {
        if (valid) {
          var data = {
            begin: this.begin,
            end: this.end,
            documentSkillIds: this.checkList,
            form: this.saveform
          }
          if (this.skill === 'skill') {
            saveMergeResultSkill(data).then(response => {
              if (response.code === '200') {
                this.savedialogTableVisible = false
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
          } else {
            saveMergeResult(data).then(response => {
              if (response.code === '200') {
                this.savedialogTableVisible = false
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
          }
        }
      })
    },
    visiblechange(val) {},
    mergeWorkloads() {
      console.log(this.checkList)
      // 合并工作量按钮
      var data = {
        begin: this.begin,
        end: this.end,
        documentRoleIds: this.checkList
      }
      if (this.checkList.length > 0) {
        if (this.skill === 'skill') {
          var skilldata = {
            begin: this.begin,
            end: this.end,
            documentSkillIds: this.checkList
          }
          flightDateSkill(skilldata).then(response => {
            var list = []
            var workloadWaveMap = response.data.total
            var data1 = { role: 'total', merged: 'total', documentId: response.data.documentId, datas: [] }
            this.workloadName = '合并后的工作量'
            Object.getOwnPropertyNames(workloadWaveMap).forEach(function(cur) {
              var data2 = {}
              data2.day
              data2.actualData = []
              data2.dataX = []
              workloadWaveMap[cur].forEach(element => {
                data2.day = cur
                data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
                data2.dataX.push(element.startDate)
              })
              data1.datas.push(data2)
            })
            list.push(data1)
            if (this.complete === 1) {
              var _this = this
              this.lineChartData.forEach(function(element, index) {
                if (element.style === 'total') {
                  _this.lineChartData.splice(index, 1)
                }
              })
              this.$nextTick(() => {
                this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
              })
            } else {
              this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
              this.complete = 1
            }
          })
        } else {
          mergeWorkloads(data).then(response => {
            var list = []
            var workloadWaveMap = response.data.total
            var data1 = { role: 'total', merged: 'total', documentId: response.data.documentId, datas: [] }
            this.workloadName = '合并后的工作量'
            Object.getOwnPropertyNames(workloadWaveMap).forEach(function(cur) {
              var data2 = {}
              data2.day
              data2.actualData = []
              data2.dataX = []
              workloadWaveMap[cur].forEach(element => {
                data2.day = cur
                // data2.actualData.push(element.quantity)
                data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
                data2.dataX.push(element.startDate)
              })
              data1.datas.push(data2)
            })
            list.push(data1)
            if (this.complete === 1) {
              this.lineChartData.pop()
              this.$nextTick(() => {
                this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
              })
            } else {
              this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'total' })
              this.complete = 1
            }
          })
        }
      } else {
        this.$message.error('请选择要合并的工作量')
      }
    },
    workloadOptions(item) {},
    workload() {
      // 工作量下拉
      var data = {
        documentType: 'FLIGHT_WORKLOAD'
      }
      initTable(data).then(response => {
        this.workloadDocOptions = response.data.data
      })
    },
    openD() {
      // 打开填加工作量
      this.gzldialogTableVisible = true
      this.workload()
    },
    checkedChange(item) {
      // 复选框选中把数据传到角色下拉
      console.log(item)
      this.checkList.forEach(element => {
        var skillId = element.slice(element.indexOf(',') + 1)
        if (skillId === item.skillId) {
          this.roleOptions.push({ value: skillId, label: item.role })
        }
      })
    },
    onSubmit() {
      // 添加工作量
      this.checkList = []
      this.workloadName = this.form.workloadDocumentId.name
      this.documentId = this.form.workloadDocumentId.documentId
      this.gzldialogTableVisible = false
      if (this.skill === 'skill') {
        this.initforskill()
      } else {
        this.init()
      }
    },
    search2() {
      // 时间筛选查询
      this.lineChartData = []
      this.init()
    },
    init() {
      this.listLoading = true
      var data = {
        documentId: this.documentId,
        begin: this.begin,
        end: this.end
      }
      mergeworkloads(data).then(response => {
        var list = []
        this.listLoading = false
        if (response.data) {
          var workloadWaveMap = response.data.workloadWaveMap
          this.begin = response.data.begin.slice(0, 10)
          this.end = response.data.end.slice(0, 10)
          Object.getOwnPropertyNames(workloadWaveMap).forEach(function(cur) {
            // 此处接收一行数据
            var data1 = { role: '', documentId: response.data.documentId, datas: [] }
            Object.getOwnPropertyNames(workloadWaveMap[cur]).forEach(function(cur2) {
              // 此处接收单表数据
              var data2 = {}
              data2.maxNum = 3
              data2.warnLine = false
              data2.totalWorkingHours = 3
              data2.titleShow = false
              data2.day
              data2.actualData = []
              data2.dataX = []
              workloadWaveMap[cur][cur2].forEach(element => {
                data2.day = cur2
                data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
                data2.dataX.push(element.startDate)
              })
              data1.datas.push(data2)
            })
            data1.role = cur.slice(cur.indexOf(',') + 1)
            data1.skillId = cur.slice(0, cur.indexOf(','))
            data1.roleId2 = response.data.documentId + ',' + cur.slice(0, cur.indexOf(','))
            list.push(data1)
          })
        }
        this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'list' })
        console.log(this.lineChartData, 666)
      })
    },
    initforskill() {
      this.listLoading = true
      var data = {
        documentId: this.documentId,
        begin: this.begin,
        end: this.end
      }
      searchDateforSkill(data).then(response => {
        var list = []
        this.listLoading = false
        if (response.data) {
          var workloadWaveMap = response.data.workloadWaveMap
          this.begin = response.data.begin.slice(0, 10)
          this.end = response.data.end.slice(0, 10)
          Object.getOwnPropertyNames(workloadWaveMap).forEach(function(cur) {
            // 此处接收一行数据
            var data1 = { role: '', documentId: response.data.documentId, datas: [] }
            Object.getOwnPropertyNames(workloadWaveMap[cur]).forEach(function(cur2) {
              // 此处接收单表数据
              var data2 = {}
              data2.day
              data2.actualData = []
              data2.dataX = []
              workloadWaveMap[cur][cur2].forEach(element => {
                data2.day = cur2
                data2.actualData.push({ name: element.startDate, value: [element.startDate, element.quantity] })
                data2.dataX.push(element.startDate)
              })
              data1.datas.push(data2)
            })
            data1.role = cur.slice(cur.indexOf(',') + 1)
            data1.skillId = cur.slice(0, cur.indexOf(','))
            data1.roleId2 = response.data.documentId + ',' + cur.slice(0, cur.indexOf(','))
            list.push(data1)
          })
        }
        console.log(this.lineChartData, 6666)
        this.lineChartData.push({ list: list, workloadName: this.workloadName, style: 'list' })
      })
    },
    workRules() {
      var data = {
        // 下拉
        documentType: 'SERVICE_STANDARD'
      }
      initTable(data).then(response => {
        this.workRulesDocOptions = response.data.data
      })
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      this.lineChartDataBig = {}
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  // padding: 10px 0;
  background: #0a142f;
  // max-height: 700px;
  // overflow: auto;
  height: 100%;
  // overflow: scroll
  margin-top: 60px;
}
.content-left {
  width: 18%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  // border-right: 3px solid #4f566b;
  font-size: 14px;
  color: white;
}
.doc,
.recycle,
.particle,
.transition,
.staticload {
  width: 100%;
  height: 100%;
  background-color: #232c47;
  text-align: center;
}
.doc-title,
.recycle-title,
.contact-title,
.staticload-title,
.transition-title,
.particle-title {
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding-left: 5px;
  background-color: #263257;
}
.doc-content-box,
.particle-content-box,
.contact-content-box,
.transition-content-box,
.staticload-content-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
}
.particle-content1,
.particle-content2,
.contact-content1,
.contact-content2,
.transition-content1,
.transition-content2 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  // width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
}
.contact-content2,
.transition-content2 {
  margin-top: 10px;
}
.doc-button,
.recycle-button,
.particle-button,
.contact-button,
.transition-button {
  width: 132px;
  height: 35px;
  line-height: 3px;
  text-align: center;
  background-color: #1b2541;
  color: white;
}
.recycle-button {
  width: 132px;
}
.recycle,
.particle,
.transition,
.staticload {
  margin-top: 20px;
}
.staticload-content1 {
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.content-right {
  width: 82%;
  height: 100%;
  box-sizing: border-box;
  // padding: 0 15px;
}
.workload {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.workload-top {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  padding-top: 10px;
}
.span-value {
  margin-left: 10px;
  margin-right: 10px;
}

.runtime-bottom {
  height: 100%;
  margin-top: 10px;
  background: #425079;
  overflow: hidden;

  .runtime-left {
    float: left;
    width: 14%;
  }

  .content {
    float: right;
    width: 85%;
    background: #172449;
  }

  .left {
    padding-left: 5px;
  }
}
.workload-bottom {
  width: 100%;
  // max-height: 600px;
  margin-top: 2px;
  box-sizing: border-box;
  padding: 20px 0;
  // border-top: 2px solid #4f566b;
  overflow: auto;
  .role {
    width: 100%;
    height: 250px;
    line-height: 250px;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 12px;
  }
}

.chartdiv {
  li {
    background: #263257;
  }

  div.left1 {
    display: inline-block;
    width: 18%;
    padding: 16px;
    vertical-align: top;
  }
}
.flight {
  width: 100;
  height: 100%;
}
.runtime-bottom div.left {
  width: 16%;
}
.runtime-bottom div.right {
  width: 83%;
}
</style>
