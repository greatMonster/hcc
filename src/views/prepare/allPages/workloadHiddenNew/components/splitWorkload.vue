<template>
  <div class="body1">
    <!-- <el-alert type="info" effect="dark">
      <div class="explanation">拆分功能是用于将单个工作量根据时间拆分为两个工作量。</div>
      <div>- 如某员工技能未定义拆分时间段，则不做拆分</div>
    </el-alert>-->
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-for="(item,index) in splitData" :key="index" :name="item.name" :label="item.label">
        <el-card v-if="splitCondition" class="box-card">
          <div slot="header" class="clearfix">
            <span>拆分工作量</span>
          </div>
          <div>
            <el-form ref="ruleForm" :rules="rules" :model="item.ruleForm" label-width="150px" class="formstyle">
              <el-form-item label="时间段" required>
                <el-col :span="11">
                  <el-form-item prop="from">
                    <el-time-picker
                      v-model="item.ruleForm.time"
                      arrow-control="true"
                      format="HH:mm"
                      value-format="HH:mm"
                      :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }"
                      is-range
                      range-separator="-"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="拆分模式" prop="mode">
                <el-select v-model="item.ruleForm.mode" placeholder="请选择" @change="modeChange">
                  <el-option label="水平拆分" value="line">
                    <span style="float: left">水平拆分</span>
                    <span class="preview-picture">
                      <el-popover placement="right" width="240" trigger="hover">
                        <div>
                          <img src="@/assets/zhiqie.png" alt style="width:200px;height:200px;" />
                        </div>
                        <div slot="reference">
                          <i class="el-icon-view" />
                        </div>
                      </el-popover>
                      <!-- <i class="el-icon-view" /> -->
                    </span>
                  </el-option>
                  <el-option label="弧形拆分" value="arc">
                    <span style="float: left">弧形拆分</span>
                    <span class="preview-picture">
                      <el-popover placement="right" width="240" trigger="hover">
                        <div>
                          <img src="@/assets/huqie.png" alt style="width:200px;height:200px;" />
                        </div>
                        <div slot="reference">
                          <i class="el-icon-view" />
                        </div>
                      </el-popover>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="retainShow" label="保留工作量" prop="retainNum">
                <el-input v-model.number="item.ruleForm.retainNum" style="width:200px" />
              </el-form-item>
              <el-form-item v-if="splitShow" label="切除工作量" prop="num">
                <el-input v-model.number="item.ruleForm.num" style="width:200px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" style="float:right" @click="submitForm('ruleForm',index)">提 交</el-button>
                <el-button type="info" size="small" style="float:right;margin-right: 10PX;" @click="goBack">取 消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card v-if="splitResult" class="box-card">
          <div slot="header" class="clearfix">
            <span>拆分结果</span>
          </div>
          <div style="padding:20px">
            <div class="workload-name">
              工作量一：
              <span class="split-name" @click="firstJump">{{ firstSplitName }}</span>
            </div>
            <div class="workload-name">
              工作量二：
              <span class="split-name" @click="secondJump">{{ secondSplitName }}</span>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import { skill } from '@/api/workload'
import { cut, workloadDetails } from '@/apiNew/workload'
export default {
  name: 'SplitWorkload',
  props: {
    documentId: {
      type: String,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      splitCondition: true,
      splitResult: false,
      splitData: [],
      activeName: '1',
      retainShow: false,
      splitShow: false,
      firstSplitName: '',
      secondSplitName: '',
      firstDocumentId: '',
      secondDocumentId: '',
      documentIdR: this.documentId,
      rules: {
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        retainNum: [
          { required: true, message: '请输入数据', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        mode: [{ required: true, message: '请选择拆分模式', trigger: 'change' }],
        num: [
          { required: true, message: '请输入数据', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  created() {
    this.getSkill()
  },
  methods: {
    modeChange(e) {
      if (e === 'line') {
        this.retainShow = true
        this.splitShow = false
      } else {
        this.retainShow = false
        this.splitShow = true
      }
    },
    resetForm() {
      this.$parent.dialogTableVisibleSplit = true
    },
    handleClick() {},
    getSkill() {
      var data = {
        id: this.documentId.toString(),
        startDate: '',
        endDate: ''
      }
      workloadDetails(data).then(response => {
        response.data.data.items.forEach(element => {
          this.splitData.push({
            label: element.skill.name,
            name: element.skill.id.toString(),
            ruleForm: {}
          })
        })
        this.activeName = this.splitData[0].name
      })
    },
    submitForm(formName, index) {
      this.$refs[formName][index].validate(valid => {
        if (valid) {
          var data = []
          this.splitData.forEach(element => {
            if (Object.keys(element.ruleForm).length > 2) {
              console.log(element, 333)
              console.log()
              var yNumber = element.ruleForm.mode === 'line' ? element.ruleForm.retainNum : element.ruleForm.num
              data.push({
                id: this.documentId,
                mode: element.ruleForm.mode,
                beginTime: element.ruleForm.time[0],
                endTime: element.ruleForm.time[1],
                yNumber: yNumber,
                skillId: element.name
              })
            }
          })
          cut(data).then(response => {
            this.$parent.dialogTableVisibleSplit = true
            this.splitCondition = false
            this.splitResult = true
            this.firstSplitName = response.data.data[0].name
            this.secondSplitName = response.data.data[1].name
            this.firstDocumentId = response.data.data[0].id
            this.secondDocumentId = response.data.data[1].id
            this.$message({
              message: response.message,
              type: 'success'
            })
            // this.$router.push({ path: '/prepare/allPages/workload' })
            // }
          })
        } else {
          return false
        }
      })
    },
    firstJump() {
      this.$router.push({
        path: '/prepare/workloadHiddenNew',
        query: { id: this.firstDocumentId, name: this.firstSplitName }
      })
    },
    secondJump() {
      this.$router.push({
        path: '/prepare/workloadHiddenNew',
        query: { id: this.secondDocumentId, name: this.secondSplitName }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.box-card {
  width: 80%;
  margin: 0 auto;
}

.box-card /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}

.box-card /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.body1 /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  font-size: 14px;
  margin: 10px 0;
}

.explanation {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.preview-picture {
  float: right;
  color: #8492a6;
  font-size: 13px;
  color: aqua;
}

.preview-picture:hover {
  color: blue;
}

.split-name {
  color: rgb(37, 145, 216);
}

.split-name:hover {
  color: aqua;
  cursor: pointer;
  text-decoration: underline;
}
.workload-name {
  height: 30px;
  line-height: 30px;
}
</style>
