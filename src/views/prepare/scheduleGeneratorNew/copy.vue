<template>
  <div class="app-container">
    <el-row :gutter="5">
      <el-col :span="6">
        <div class="baseInfo">
          <p>{{ previewDataForm.name }}-复制</p>
        </div>
      </el-col>
    </el-row>
    <div class="right">
      <div class="tabsBox">
        <div class="boxRight">
          <!-- <el-form ref="form" :model="previewDataForm">
            <el-form-item label="排班区间">
              <el-date-picker v-model="previewDataForm.beginDate" type="date" placeholder="开始日期" size="mini" style="width:190px;" :picker-options="pickerOptions" />-
              <el-date-picker v-model="previewDataForm.endDate" type="date" placeholder="结束时间" size="mini" style="width:190px;" :picker-options="pickerOptions" />
              <el-button size="mini" type="info" @click="changeData">应用</el-button>
            </el-form-item>
          </el-form>-->
          <div v-for="(topitem,topindex) in rosterSetting" :key="topindex" v-loading="loading" class="items" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.2)">
            <div class="title2">
              <span style="float:left;margin:8px">总人数：{{ topitem.numberPeople }} 人</span>
              <span style="float:left;margin:8px">{{ initData.ruleName }}</span>
              <span style="float: right;margin: 3px;">
                <el-button size="mini" type="info" @click="SaveData">保存排班表</el-button>
              </span>
            </div>
            <div class="schedulelist">
              <tabletmplat
                ref="tables"
                :shift-type="shiftType"
                :roster-id="rosterId"
                :tables="topitem"
                :roster-setting-id="rosterSettingId"
                :created-times="createdTimes"
                :schedulelist="schedulelist"
                :dragemployee-type-id="dragemployeeTypeId"
                @initab="initab"
                @search="search"
                @create="showCreatedTimes"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- </keep-alive>
        </el-tab-pane>
      </el-tabs>-->
    </div>
  </div>
</template>
<script>
import { previewData, saveData } from '@/apiNew/schedule'
import { shiftType } from '@/api/schedule'
import tabletmplat from './components/table'
export default {
  components: {
    tabletmplat
  },
  filters: {},
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          const beginDateVal = this.previewDataForm.beginDate
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      },
      previewDataForm: {
        beginDate: '',
        endDate: ''
      },
      shiftType: [],
      initData: {},
      rosterSetting: [], // 排班表数据
      rosterModeVersion: '',
      rosterSettingId: this.$route.query.rosterSettingVersionId,
      loading: false,
      schedulelist: [], // 小方格
      employeeTypeId: '',
      dragemployeeTypeId: '',
      rule: [],
      createdTimes: 0,
      switchTshow: true,
      rosterId: ''
    }
  },
  watch: {},
  mounted() {},
  created() {
    const previewData = JSON.parse(sessionStorage.getItem('previewData'))
    const previewDataForm = JSON.parse(sessionStorage.getItem('previewDataForm'))
    console.log(previewData, 666)
    if (previewData) {
      this.rosterSetting = previewData
    }
    if (previewDataForm) {
      this.previewDataForm = previewDataForm
    }
    this.shiftTypeinit()
  },
  methods: {
    shiftTypeinit() {
      shiftType().then(response => {
        this.shiftType = response.data
        console.log(this.shiftType, 123)
      })
    },
    initab() {},
    search() {},
    showCreatedTimes() {},
    changeData() {
      previewData(this.previewDataForm).then(response => {
        this.rosterSetting = response.data.data
      })
    },
    SaveData() {
      saveData(this.previewDataForm).then(response => {
        if (response.data.code === '200') {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          // 跳转到排班表
          this.$router.push({ path: '/prepare/shiftTableNew', query: { businessDomainId: this.$route.query.businessDomainId } })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './scheduleGenerator.scss';
.boxRight {
  width: 100% !important;
  padding: 0 10px;
}
</style>
