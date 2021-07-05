<template>
  <div class="skillBox">
    <div class="skillShow">
      <div v-if="documentType == 'CYCLE_FLIGHT_SCHEDULE'" class="add-user">
        <div v-show="flightNameTop" class="top-name">{{ flightNameTop }} ( {{ topStartTime }} - {{ topEndTime }} )</div>
        <el-form :inline="true" :model="listQuery" size="small">
          <!-- <el-form-item label="开始日期">
            <el-date-picker v-model="listQuery.beginDateStr" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:150px" />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="listQuery.endDateStr" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:150px" />
          </el-form-item>-->
          <el-form-item label="承运人">
            <el-select v-model="listQuery.carrier" placeholder="请选择" filterable clearable>
              <el-option v-for="(item,i) in carrierOptions" :key="i" :label="item.name" :value="item.name">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起飞站">
            <el-select v-model="listQuery.deptAirport" filterable clearable>
              <el-option v-for="item in planDeptAirportArry" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="到达站">
            <el-select v-model="listQuery.arrAirport " filterable clearable>
              <el-option v-for="item in planArrAirportArry" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="机型">
            <el-select v-model="listQuery.acType" filterable clearable>
              <el-option v-for="item in acTypeOptions" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="起飞时间">
            <el-time-picker v-model="listQuery.deptTimeStr" :arrow-control="true" format="HH:mm" value-format="HH:mm" style="width:150px" />
          </el-form-item>
          <el-form-item label="到达时间">
            <el-time-picker v-model="listQuery.arrTimeStr" :arrow-control="true" format="HH:mm" value-format="HH:mm" style="width:150px" />
          </el-form-item>
          <el-form-item label="国际/国内">
            <el-select v-model="listQuery.intlFlag" filterable clearable>
              <el-option v-for="item in intlFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否过站">
            <el-select v-model="listQuery.throughFlag" filterable clearable>
              <el-option v-for="item in throughFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initable()">查 询</el-button>
            <el-button type="primary" size="small" @click="Correlation">关联列表</el-button>
            <el-button type="primary" size="small" @click="download">导出Excel</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="documentType == 'DAY_FLIGHT_SCHEDULE'" class="add-user">
        <el-form :inline="true" :model="listQuery2" size="small">
          <el-form-item prop="flightNo " label="航班号" :label-width="formLabelWidth">
            <el-input v-model="listQuery2.flightNo " />
          </el-form-item>
          <el-form-item prop="intlFlag" label="国际/国内" :label-width="formLabelWidth">
            <el-select v-model="listQuery2.intlFlag " placeholder="请选择">
              <el-option v-for="item in intlFlagoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="acType" label="机型" :label-width="formLabelWidth">
            <el-input v-model="listQuery2.acType" />
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型" :label-width="formLabelWidth">
            <el-select v-model="listQuery2.flightType " placeholder="请选择">
              <el-option v-for="item in flightTypeoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="carrier" label="承运人" :label-width="formLabelWidth">
            <el-select v-model="listQuery2.carrier" placeholder="请选择" filterable clearable>
              <el-option v-for="(item,i) in carrierOptions" :key="i" :label="item.name" :value="item.name">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deptAirport" label="起飞站" :label-width="formLabelWidth">
            <el-select v-model="listQuery2.deptAirport" filterable clearable>
              <el-option v-for="item in planDeptAirportArry" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item prop="arrAirport" label="到达站" :label-width="formLabelWidth">
            <el-select v-model="listQuery2.arrAirport " filterable clearable>
              <el-option v-for="item in planArrAirportArry" :key="item.code" :label="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item prop="flightDate" label="航班日期" :label-width="formLabelWidth">
            <el-date-picker v-model="listQuery2.flightDate " type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initable('seach')">查 询</el-button>
            <el-button type="info" size="small" @click="showChart('wave')">航班波</el-button>
            <el-button type="info" size="small" @click="showChart('capacity')">运力波</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="bottonBox" style="display:flex;margin:10px">
        <el-button v-if="skillShowTable.flightScheduleId" type="primary" size="small" @click="associated()">航班关联</el-button>
        <el-button v-if="skillShowTable.flightScheduleId" style="width:80px" type="primary" size="small" @click="addClick">添 加</el-button>
        <div class="detail-style">
          <div class="all-edit name-wrapper">总条数 {{ totalCount }}，</div>
          <div slot="reference" class="all-edit name-wrapper">航司 {{ detailsCount.companyCount }}，</div>
          <span>共 {{ detailsCount.flightNum }} 架次</span>
          <span>（过站 {{ detailsCount.throughNum }}），</span>
          <span>
            <el-popover trigger="click" placement="right" width="200">
              <div style="height:250px;overflow:auto">
                详情：
                <div v-for="(item, index) in detailsCount.carriers" :key="index" style="padding-left:20px">{{ item.name }}：{{ item.number }}</div>
              </div>
            </el-popover>
          </span>
          <span>国内出港/进港 {{ detailsCount.deptNumD }}/{{ detailsCount.arrNumD }}</span>
          <span>，国际出港/进港 {{ detailsCount.deptNumI }}/{{ detailsCount.arrNumI }}，</span>
          <span>加班 {{ detailsCount.addNum }}，包机 {{ detailsCount.charterNum }}</span>
        </div>
      </div>-->
      <el-table v-if="documentType == 'CYCLE_FLIGHT_SCHEDULE'" v-loading="listLoading" :data="skillShowTable.cycleFlightsMap" stripe height="650" empty-text="数据加载中">
        <el-table-column type="index" width="50" label="序号" fixed />
        <el-table-column v-for="(item,index) in tableTitle2" :key="index" :label="item" width="100">
          <template slot-scope="scope">
            <span v-if="item=='计划开始日期'">{{ scope.row[item] | joinDate }}</span>
            <span v-else-if="item=='计划结束时间'">{{ scope.row[item] | joinDate }}</span>
            <span v-else-if="item=='起飞时间'">{{ scope.row[item] | joinTime }}</span>
            <span v-else-if="item=='到达时间'">{{ scope.row[item] | joinTime }}</span>
            <span v-else-if="item=='国际国内'">{{ scope.row[item] | filterData }}</span>
            <span v-else-if="item=='航班类型'">{{ scope.row[item] | filterData2 }}</span>
            <span v-else>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="160" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="small" size="small" style="width:60px;height:30px;" @click="statusClick(scope.$index,scope.row)">禁 用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="documentType == 'DAY_FLIGHT_SCHEDULE'" v-loading="listLoading" :data="skillShowTable.list" border stripe :height="tableHeight">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column v-for="(item2,index2) in tableTitle" :key="index2" :label="item2">
          <template slot-scope="scope">
            <span v-if="item2=='航班日期'">{{ scope.row[item2] | joinDate }}</span>
            <span v-else-if="item2=='到达时间'">{{ scope.row[item2] | joinTime }}</span>
            <span v-else-if="item2=='起飞时间'">{{ scope.row[item2] | joinTime }}</span>
            <span v-else-if="item2=='国际国内'">{{ scope.row[item2] | filterData }}</span>
            <span v-else-if="item2=='航班类型'">{{ scope.row[item2] | filterData2 }}</span>
            <span v-else-if="item2=='起飞站'">
              <el-popover placement="top-start" trigger="hover">
                <span style="width:auto">{{ scope.row[item2].name }}</span>
                <span slot="reference">{{ scope.row[item2].code }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2=='承运人'">
              <el-popover placement="top-start" trigger="hover">
                <span>{{ scope.row[item2].name }}</span>
                <span slot="reference">{{ scope.row[item2].code }}</span>
              </el-popover>
            </span>
            <span v-else-if="item2=='到达站'">
              <el-popover placement="top-start" trigger="hover" width="100">
                <span>{{ scope.row[item2].name }}</span>
                <span slot="reference">{{ scope.row[item2].code }}</span>
              </el-popover>
            </span>
            <span v-else>{{ scope.row[item2] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form ref="ruleForm" :model="formdata" :rules="rules">
          <el-form-item prop="acType" label="机型：" :label-width="formLabelWidth">
            <el-input v-model="formdata.acType" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="arrAirport" label="到达航站：" :label-width="formLabelWidth">
            <el-input v-model="formdata.arrAirport" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="arrTimeStr" label="到达时间：" :label-width="formLabelWidth">
            <el-time-picker v-model="formdata.arrTimeStr" arrow-control="true" format="HH:mm:ss" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item prop="arrTimeIdx" label="到达时间标识：" :label-width="formLabelWidth">
            <el-select v-model="formdata.arrTimeIdx " placeholder="请选择">
              <el-option v-for="item in arrTimeIdxoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="beginDateStr" label="计划开始日期：" :label-width="formLabelWidth">
            <el-date-picker v-model="formdata.beginDateStr " type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item prop="flightNo" label="航班号：" :label-width="formLabelWidth">
            <el-input v-model="formdata.flightNo" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="carrier" label="承运人：" :label-width="formLabelWidth">
            <el-input v-model="formdata.carrier" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="deptAirport" label="起飞航站：" :label-width="formLabelWidth">
            <el-input v-model="formdata.deptAirport" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="deptTimeStr" label="起飞时间：" :label-width="formLabelWidth">
            <el-time-picker v-model="formdata.deptTimeStr" arrow-control="true" format="HH:mm" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item prop="deptTimeIdx" label="到达时间标识：" :label-width="formLabelWidth">
            <el-select v-model="formdata.deptTimeIdx" placeholder="请选择">
              <el-option v-for="item in deptTimeIdxoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="endDateStr" label="计划结束日期：" :label-width="formLabelWidth">
            <el-date-picker v-model="formdata.endDateStr" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item prop="flightLine" label="航线：" :label-width="formLabelWidth">
            <el-input v-model="formdata.flightLine" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型：" :label-width="formLabelWidth">
            <el-select v-model="formdata.flightType " placeholder="请选择">
              <el-option v-for="item in flightTypeoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="intlFlag" label="国际/国内：" :label-width="formLabelWidth">
            <el-select v-model="formdata.intlFlag " placeholder="请选择">
              <el-option v-for="item in intlFlagoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="planSeason" label="航季：" :label-width="formLabelWidth">
            <el-input v-model="formdata.planSeason " placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="seqNum" label="航段次序：" :label-width="formLabelWidth">
            <el-input v-model="formdata.seqNum " placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="weekday" label="周期：" :label-width="formLabelWidth">
            <el-input v-model="formdata.weekday " placeholder="请输入1~7不可重复数字" />
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="el-icon-d-caret" /> 扩展属性
            </template>
            <el-button class="filter-item" size="mini" style="margin-bottom: 10px;" type="primary" icon="el-icon-edit" :append-to-body="true" @click="dialogAdd">新增</el-button>
            <el-table :data="itemList" border stripe>
              <el-table-column prop="attrName" label="扩展属性" />
              <el-table-column prop="attrValue" label="属性值" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="removeAttr(scope.$index,itemList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogAdditem" title="添加扩展属性">
      <el-form :model="chargingform">
        <el-form-item label="选择扩展属性:" :label-width="formLabelWidth">
          <el-select v-model="chargingform.attrCode" placeholder="请选择">
            <el-option v-for="(items,indexs) in chargingOptions" :key="indexs" :label="items.attributeName" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="attrValue" label="属性值：" :label-width="formLabelWidth">
          <el-input v-model="chargingform.attrValue " placeholder="请输入正确信息" style="width:200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373;color: white;" @click="dialogAdditem=false">取 消</el-button>
        <el-button type="primary" @click="handleAddClickitem('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导出" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="文件名" :label-width="formLabelWidth">
          <el-input v-model="form.fileName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="importClick">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :visible.sync="dialogStatus" title style="padding-top:20px;">
      <div>
        <div>
          <div>添加禁用</div>
          <div>
            <el-form :inline="true" :model="from" size="small">
              <el-form-item label="开始结束日期" prop="interTimerPicker">
                <el-date-picker v-model="from.interTimerPicker" value-format="yyyy-MM-dd" :picker-options="pickerOptions" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width:80%" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="clickTime">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          历史记录
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" width="160" label="序号" fixed />
            <el-table-column prop="date" label="日期">
              <template slot-scope="scope">
                <span>{{ scope.row.start }} - {{ scope.row.end }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.status==='not_delete'?true:false" type="small" style="width:60px;height:30px;" @click="removeClick(scope.$index,scope.row,tableData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p style="color:red">（注意：处于禁用时间段内只可删除未执行日期）</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleStatus('form')">确 定</el-button>
        <el-button style="background: #495373;color: white;" @click="cancelClick2">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div>
      <el-pagination v-if="documentType == 'DAY_FLIGHT_SCHEDULE'" background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 航班波、航班密度 -->
    <el-dialog v-dialogDrag v-loading="loadingDea" :title="titlesWave" :visible.sync="chartDialog" :close-on-click-modal="false" width="80%">
      <div style="display: flex; width: 100%; flex-direction: column; align-items: center">
        <el-form :inline="true" :model="formData2">
          <el-form-item label="航班类型">
            <el-select v-if="waveOrDensity" v-model="formData2.flightWave" placeholder="请选择" size="mini" @change="changeType">
              <el-option v-for="item in flightWaveOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="国际/国内">
            <el-select v-if="waveOrDensity" v-model="formData2.regionType" placeholder="请选择" size="mini" @change="changeType">
              <el-option v-for="item in DIoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-if="waveOrDensity"
              v-model="formData2.dateStr"
              size="small"
              style="width: 320px"
              clearable
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="|"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
              @change="changeType"
            />
          </el-form-item>
          <el-form-item label="航班粒度">
            <el-select v-model="formData2.size" placeholder="请选择" size="mini" @change="changeType">
              <el-option v-for="item in sizeOptions" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px; display: flex; width: 88%; flex-wrap: wrap">
          <div v-for="(item, i) in alldata" :key="i" style="border-right: 1px dotted #fff; border-bottom: 1px dotted #fff">
            <div style="display: flex; justify-content: space-around">
              <p>{{ item.date }}</p>
              <p>{{ item.desc }}：{{ item.total }}</p>
            </div>
            <div @click="showEchart(item)">
              <distribution :chart-data="item" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { byDocumentIdAndPage, selectData, addDatafcn, eitDatafcn, seachData, flightWavesFcn, flightSeatWavesFcn, eitdData, detailsCount, prohibit, remove, addDate, selectAllData } from '@/api/flightPlan'
import distribution from '@/components/echarts/distribution'
export default {
  name: 'FlightPlan2',
  components: {
    distribution
  },
  filters: {
    joinDate: function(value) {
      if (value) {
        value = value.substring(0, 10)
        return value
      } else {
        return value
      }
    },
    joinTime: function(value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    },
    filterData: function(value) {
      if (value === 'I') {
        return '国际'
      } else {
        return '国内'
      }
    },
    filterData2(val) {
      if (val === 'A') {
        return '进港'
      } else if (val === 'D') {
        return '出港'
      }
    }
  },
  data() {
    var Validate = (rule, value, callback) => {
      const RegExp = /^(?:([1-7])(?!.*\1)((?=[1-7]))?)+$/
      if (value === '') {
        callback(new Error('请输入周期'))
      } else if (RegExp.test(value) === false) {
        callback(new Error('请输入正确周期'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate: time => {
          return this.dealDisabledDate(time)
        }
      },
      pickerOptions2: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          return this.dealDisabledDate2(time)
        }
      },
      dialogStatus: false,
      flightNameTop: '',
      topStartTime: '',
      topEndTime: '',
      tableHeight: window.innerHeight - 120,
      detailsCount: {},
      DIoptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' },
        { label: '国际/国内', value: 'D/I' }
      ],
      dialogVisible: false,
      dialogAdditem: false,
      chartDialog: false,
      flightBeginDate: '',
      flightEndDate: '',
      pickerMinDate: '',
      from: {
        interTimerPicker: ''
      },
      offon: false,
      alldata: [],
      waveOrDensity: true,
      dates: {},
      sizeOptions: [
        {
          name: '5分钟',
          value: '5'
        },
        {
          name: '30分钟',
          value: '30'
        },
        {
          name: '60分钟',
          value: '60'
        }
      ],
      flightWaveOptions: [
        { label: '全部', value: ' ' },
        { label: '进', value: 'A' },
        { label: '出', value: 'D' }
      ],
      listQuery2: {
        carrier: '',
        intlFlag: '',
        acType: '',
        flightType: '',
        deptAirport: '',
        arrAirport: '',
        flightDate: '',
        flightNo: ''
      },
      loadingDea: false,
      titlesWave: '航班波',
      listQuery: {
        carrier: '',
        beginDateStr: '',
        endDateStr: '',
        arrAirport: '',
        arrTimeStr: '',
        throughFlag: '',
        deptAirport: '',
        deptTimeStr: '',
        acType: '',
        intlFlag: ''
      },
      itemList: [],
      intlFlagOptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' }
      ],
      throughFlagOptions: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      planDeptAirportArry: [],
      planArrAirportArry: [],
      acTypeOptions: [],
      carrierOptions: [],
      titles: '',
      activeNames: '1',
      param: '',
      getNowFormatDate() {
      // 获取当天时间
        var date = new Date()
        var seperator1 = '-'
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
        return currentdate
      },
      formData2: {
        dateStr: [],
        size: '60',
        flightWave: '',
        regionType: ''
      },
      formdata: {
        acType: '',
        arrAirport: '',
        arrTimeStr: '',
        arrTimeIdx: '',
        beginDateStr: '',
        carrier: '',
        cycleFlightScheduleId: '',
        deptAirport: '',
        deptTimeStr: '',
        deptTimeIdx: '',
        endDateStr: '',
        flightLine: '',
        flightNo: '',
        flightType: '',
        intlFlag: '',
        planSeason: '',
        seqNum: '',
        weekday: ''
      },
      date: new Date(),
      rules: {
        arrAirport: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        arrTimeStr: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        arrTimeIdx: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        beginDateStr: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        deptAirport: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        deptTimeStr: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        deptTimeIdx: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        endDateStr: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        carrier: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        weekday: [{ required: true, validator: Validate, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        flightNo: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }],
        flightType: [{ required: true, message: '请输入正确信息', trigger: ['blur', 'change'] }]
      },
      documentId: this.$route.query.documentId,
      page: {
        documentId: this.$route.query.documentId,
        pageSize: 50,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      id: '',
      addedData: [],
      datetimerange: '',
      documentType: this.$route.query.documentType,
      dialogFormVisible: false,
      form: { fileName: '文件名', documentId: this.$route.query.documentId },
      importanceOptions: [],
      detailSearch: {},
      chargingform: {},
      flightVO: {},
      activeName: 'first',
      listLoading: false,
      title: '',
      formLabelWidth: '120px',
      skillShowTable: {},
      tableTitle: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季'],
      arrTimeIdxoptions: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ],
      chargingOptions: [],
      deptTimeIdxoptions: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ],
      intlFlagoptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' }
      ],
      flightTypeoptions: [
        { label: '进港', value: 'A' },
        { label: '出港', value: 'D' }
      ],
      tableData: [
        {
          date: '2016-05-02 - 2016-05-02'
        },
        {
          date: '2016-05-02 - 2016-05-02'
        },
        {
          date: '2016-05-02 - 2016-05-02'
        },
        {
          date: '2016-05-02 - 2016-05-02'
        }
      ],
      tableTitle2: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季']
    }
  },
  created() {
    this.initable()
    this.selectdata()
    this.selectDataT()
    // this.$set(this.formData2, 'dateStr', [this.getNowFormatDate(), this.getNowFormatDate()])
  },

  methods: {
    importClick() {
      // 导出
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/cycleFlightPlan/export?filename=' + this.form.fileName + '&documentId=' + this.$route.query.documentId
    },
    changeType() {
      this.loadingDea = true
      if (this.param === 'wave') {
        this.flightWavesFcninit()
      } else if (this.param === 'capacity') {
        this.flightSeatWavesFcninit()
      }
    },
    selectDataT() {
      selectAllData(this.$route.query.documentId).then(response => {
        this.acTypeOptions = response.data.data.acTypeList
        this.carrierOptions = response.data.data.carrierList
        this.planArrAirportArry = response.data.data.planArrAirportList
        this.planDeptAirportArry = response.data.data.planDeptAirportList
      })
    },
    download() {
      window.location.href =
        `${process.env.VUE_APP_BASE_API}` +
        'api/v1/prepare/cycleFlightSchedule/importCycleFlight/' +
        this.$route.query.documentId +
        '?carrier=' +
        this.listQuery.carrier +
        '&deptAirport=' +
        this.listQuery.deptAirport +
        '&arrAirport=' +
        this.listQuery.arrAirport +
        '&acType=' +
        this.listQuery.acType +
        '&deptTime=' +
        this.listQuery.deptTime +
        '&arrTime=' +
        this.listQuery.arrTime
    },
    Correlation() {
      this.$router.push({ path: '/prepare/flightPlan/relationPage', query: { documentId: this.$route.query.documentId }})
    },
    dealDisabledDate(time) {
      if (Date.parse(new Date(this.flightBeginDate)) > Date.parse(new Date())) {
        return time.getTime() < Date.parse(new Date(this.flightBeginDate)) || time.getTime() > Date.parse(new Date(this.flightEndDate))
      } else {
        return time.getTime() < Date.parse(new Date()) || time.getTime() > Date.parse(new Date(this.flightEndDate))
      }
    },
    associated() {
      this.$router.push({ path: 'flightPlan/associatedflights', query: { flightScheduleId: this.skillShowTable.flightScheduleId, documentId: this.$route.query.documentId }})
    },
    initable(e) {
      this.listLoading = true
      this.listQuery.pageSize = this.page.pageSize
      this.listQuery.pageNum = this.page.pageNum
      this.listQuery.id = this.$route.query.documentId
      var date = new Date()
      console.log(date)
      if (this.documentType === 'CYCLE_FLIGHT_SCHEDULE') {
        seachData(this.listQuery).then(response => {
          // 航班计划
          this.flightNameTop = response.data.documentName
          this.topStartTime = response.data.fromDate.substring(0, 10)
          this.topEndTime = response.data.toDate.substring(0, 10)
          this.listQuery.beginDateStr = response.data.fromDate.substring(0, 10)
          this.listQuery.endDateStr = response.data.toDate.substring(0, 10)
          this.page.total = response.data.total
          this.totalCount = response.data.cycleFlightsMap.length
          this.skillShowTable = response.data
          this.formdata.cycleFlightScheduleId = response.data.flightScheduleId
          this.tableTitle2 = []
          this.skillShowTable.cycleFlightsMap.forEach(element => {
            this.tableTitle2 = Object.keys(element)
            this.tableTitle2.forEach((itm, i) => {
              if (itm === 'ID') {
                this.tableTitle2.splice(i, 1)
              }
            })
          })
          this.detailsCountSearch()
          this.selectDataT()
          this.listLoading = false
        })
      } else if (this.documentType === 'DAY_FLIGHT_SCHEDULE') {
        this.listQuery2.pageSize = this.page.pageSize
        this.listQuery2.pageNum = this.page.pageNum
        this.listQuery2.documentId = this.page.documentId
        if (this.listQuery2.flightDate === null) {
          this.listQuery2.flightDate = ''
        }
        byDocumentIdAndPage(this.listQuery2).then(response => {
          // 航班计划
          if (response.data.list.length) {
            this.flightVO = response.data
            this.$set(this.formData2, 'dateStr', [this.flightVO.fromDate, this.flightVO.toDate])
            if (e) {
              this.page.total = response.data.total
              this.detailsCount.totalCount = response.data.total
              this.skillShowTable = response.data
              this.tableTitle = []
              this.skillShowTable.list.forEach(element => {
                this.tableTitle = Object.keys(element)
              })
              this.listLoading = false
              this.$message.success('查询成功')
            } else {
              this.page.total = response.data.total
              this.detailsCount.totalCount = response.data.total
              this.skillShowTable = response.data
              this.tableTitle = []
              this.skillShowTable.list.forEach(element => {
                this.tableTitle = Object.keys(element)
              })
            }
          } else {
            this.skillShowTable = []
          }
          this.listLoading = false
        })
      }
    },
    // selectAllDataFcn() {
    //   selectAllData(this.$route.query.documentId).then(res => {
    //     debugger
    //   })
    // },
    detailsCountSearch() {
      if (this.$route.query.documentId) {
        this.detailSearch = {
          id: this.$route.query.documentId || '',
          type: this.$route.query.documentType || '',
          beginDate: this.listQuery.beginDateStr || '',
          endDate: this.listQuery.endDateStr || '',
          carrier: this.listQuery.carrier || '',
          throughFlag: this.listQuery.throughFlag || '',
          deptAirport: this.listQuery.deptAirport || '',
          arrAirport: this.listQuery.arrAirport || '',
          acType: this.listQuery.acType || '',
          deptTime: this.listQuery.arrTimeStr || '',
          arrTime: this.listLoading.deptTimeStr || ''
        }
        detailsCount(this.detailSearch)
          .then(response => {
            response.data.data.companyCount = response.data.data.carriers.length
            this.detailsCount = response.data.data
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: e.response.data.message
            })
          })
      }
    },
    addClick() {
      this.dialogVisible = true
      this.titles = '添加航班'
    },
    editHandleClick(index, row) {
      this.dialogVisible = true
      this.titles = '修改航班'
      eitdData(row.ID).then(response => {
        this.formdata.arrAirport = response.data.arrAirport
        this.formdata.acType = response.data.acType
        this.formdata.arrTimeStr = response.data.arrTimeStr
        this.formdata.arrTimeIdx = response.data.arrTimeIdx
        this.formdata.beginDateStr = response.data.beginDateStr
        this.formdata.carrier = response.data.carrier
        this.formdata.cycleFlightId = response.data.cycleFlightId
        this.formdata.deptAirport = response.data.deptAirport
        this.formdata.deptTimeStr = response.data.deptTimeStr
        this.formdata.deptTimeIdx = response.data.deptTimeIdx
        this.formdata.endDateStr = response.data.endDateStr
        this.formdata.flightLine = response.data.flightLine
        this.formdata.flightNo = response.data.flightNo
        this.formdata.flightType = response.data.flightType
        this.formdata.intlFlag = response.data.intlFlag
        this.formdata.planSeason = response.data.planSeason
        this.formdata.seqNum = response.data.seqNum
        this.formdata.weekday = response.data.weekday
        this.itemList = response.data.exAttrs
        this.formdata.id = response.data.cycleFlightId
      })
    },
    handleAddClick(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.titles === '添加航班') {
            this.formdata.exAttrs = this.itemList
            var addData = this.formdata
            addDatafcn(addData).then(response => {
              if (response.code === '200') {
                this.clearData()
                this.activeNames = ''
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
              this.initable()
              this.clearData()
            })
            this.dialogVisible = false
          } else {
            this.formdata.exAttrs = this.itemList
            var eitData = this.formdata
            eitDatafcn(eitData).then(response => {
              this.initable()
              this.clearData()
            })
            this.activeNames = ''
            this.dialogVisible = false
          }
        } else {
          return false
        }
      })
    },
    cancelClick() {
      this.clearData()
      this.dialogVisible = false
    },
    statusClick(index, row) {
      this.offon = false
      this.addedData = []
      this.id = row.ID
      prohibit(row.ID).then(res => {
        this.tableData = res.data.data.dates
      })
      this.flightBeginDate = row.计划开始日期
      this.flightEndDate = row.计划结束时间
      this.dialogStatus = true
    },
    removeAttr(index, row) {
      row.splice(index, 1)
    },
    handleAddClickitem() {
      this.chargingform.attrName = this.chargingOptions[this.chargingform.attrCode].attributeName
      this.chargingform.attrCode = this.chargingOptions[this.chargingform.attrCode].attributeCode
      this.itemList.push(this.chargingform)
      this.dialogAdditem = false
      this.chargingform = {}
    },
    dialogAdd() {
      this.dialogAdditem = true
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initable()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.initable()
    },
    selectdata() {
      selectData().then(response => {
        this.chargingOptions = response.data
      })
    },
    clickTime() {
      this.from.interTimerPicker[0]
      this.from.interTimerPicker[1]
      var data = {
        start: this.from.interTimerPicker[0],
        end: this.from.interTimerPicker[1]
      }
      if (this.from.interTimerPicker.length) {
        this.tableData.push(data)
        this.addedData.push(data)
        this.from.interTimerPicker = []
      }
    },
    dealDisabledDate2(time) {
      // eslint-disable-next-line no-undef
      if (this.pickerMinDate) {
        const one = 6 * 24 * 3600 * 1000
        this.minTime = this.pickerMinDate - one
        this.maxTime = this.pickerMinDate + one
        return time.getTime() < this.minTime || time.getTime() > this.maxTime
      }
      return time.getTime() > Date.parse(new Date(this.flightVO.toDate)) || time.getTime() < Date.parse(new Date(this.flightVO.fromDate))
    },
    handleStatus() {
      this.dates = {
        dates: this.addedData,
        id: this.id
      }
      if (this.addedData.length || this.offon) {
        this.$confirm('是否保存并生效？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        })
          .then(() => {
            addDate(this.dates)
              .then(res => {
                if (res.data.code === '200') {
                  this.$message.success(res.data.message)
                  this.dialogStatus = false
                  this.initable()
                } else {
                  this.$message.error(res.data.message)
                }
              })
              .catch(e => {
                this.$message.error(e.response.data.message)
              })
          })
          .catch(() => {})
      } else {
        this.dialogStatus = false
      }
    },
    cancelClick2() {
      this.dialogStatus = false
      this.initable()
    },
    removeClick(index, row, tableData) {
      if (row.id) {
        remove(row.id)
          .then(res => {
            if (res.data.code === '200') {
              this.$message.success(res.data.message)
              prohibit(this.id).then(res => {
                this.tableData = res.data.data.dates
              })
              this.offon = true
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(e => {
            this.$message.error(e.response.data.message)
          })
      } else {
        this.addedData.forEach((item, i) => {
          if (row === item) {
            this.addedData.splice(i, 1)
          }
        })
        this.tableData.splice(index, 1)
      }
    },
    showChart(param) {
      if (param === 'wave') {
        this.param = 'wave'
        this.waveOrDensity = true
        this.flightWavesFcninit()
        this.titlesWave = '航班波'
      } else if (param === 'density') {
        this.waveOrDensity = false
        this.titlesWave = '航线密度'
      } else if (param === 'capacity') {
        this.flightSeatWavesFcninit()
        this.param = 'capacity'
        this.waveOrDensity = true
        this.titlesWave = '运力波'
      }
      this.chartDialog = true
    },
    // 航班波
    flightWavesFcninit(val) {
      this.alldata = []
      this.formData2.documentId = this.documentId
      if (this.formData2.dateStr) {
        this.formData2.fromDate = this.formData2.dateStr[0] || ''
        this.formData2.toDate = this.formData2.dateStr[1] || ''
      } else {
        this.formData2.fromDate = ''
        this.formData2.toDate = ''
      }
      flightWavesFcn(this.formData2)
        .then((res) => {
          this.loadingDea = false
          if (res.data.code === '200') {
            var previewarr = res.data.data.daily
            //   if (previewarr.length > 1) {
            //     previewarr.pop()
            //   }
            previewarr.forEach((item) => {
              var dataX = []
              var number = []
              for (let i = 0; i < item.details.length; i++) {
                dataX.push(item.details[i].time)
                number.push(item.details[i].number)
              }
              this.alldata.push({
                name: '航班波',
                size: this.formData2.size,
                xtitle: res.data.data.descX,
                ytitle: res.data.data.descY,
                date: item.date,
                desc: '航班总数',
                total: item.total,
                maxY: res.data.data.maxY,
                maxFlow: item.maxFlow,
                dataX: dataX,
                number: number
              })
            })
          } else {
            this.loadingDea = false
            this.$message.error(res.data.message)
          }
        })
        .catch((e) => {
          this.loadingDea = false
          this.$message.error(e.response.data.message)
        })
    },
    // 运力波
    flightSeatWavesFcninit() {
      this.alldata = []
      this.formData2.documentId = this.documentId
      if (this.formData2.dateStr) {
        this.formData2.fromDate = this.formData2.dateStr[0] || ''
        this.formData2.toDate = this.formData2.dateStr[1] || ''
      } else {
        this.formData2.fromDate = ''
        this.formData2.toDate = ''
      }
      flightSeatWavesFcn(this.formData2)
        .then((res) => {
          if (res.data.code === '200') {
            var previewarr = res.data.data.daily
            //   if (previewarr.length > 1) {
            //     previewarr.pop()
            //   }
            this.loadingDea = false
            previewarr.forEach((item) => {
              var dataX = []
              var number = []
              for (let i = 0; i < item.details.length; i++) {
                dataX.push(item.details[i].time)
                number.push(item.details[i].number)
              }
              this.alldata.push({
                name: '座位数',
                size: this.formData2.size,
                xtitle: res.data.data.descX,
                ytitle: res.data.data.descY,
                date: item.date,
                desc: '座位数',
                total: item.total,
                maxY: res.data.data.maxY,
                maxFlow: item.maxFlow,
                dataX: dataX,
                number: number
              })
            })
          } else {
            this.loadingDea = false
            this.$message.error(res.data.message)
          }
        })
        .catch((e) => {
          this.loadingDea = false
          this.$message.error(e.response.data.message)
        })
    },
    clearData() {
      this.formdata = {
        acType: '',
        arrAirport: '',
        arrTimeStr: '',
        arrTimeIdx: '',
        beginDate: '',
        carrier: '',
        deptAirport: '',
        deptTimeStr: '',
        deptTimeIdx: '',
        endDate: '',
        flightLine: '',
        flightNo: '',
        flightType: '',
        intlFlag: '',
        planSeason: '',
        seqNum: '',
        weekday: ''
      }
      this.itemList = []
    }
  }
}
</script>
<style>
.skillBox /deep/ .el-pagination {
  margin: 10px;
}
.el-button /deep/ {
  background: red;
  border: 1px solid red;
}
</style>
<style lang="scss" scoped>
.el-scrollbar__wrap {
  overflow-y: hidden;
}
.el-input--small {
  margin-bottom: 5px;
}
form {
  margin-top: 20px;
}
.skillShow {
  padding: 0 0 0 10px;
  input {
    margin-left: 10px;
  }
}
.add-user {
  background: rgb(23, 36, 73);
  width: 100%;
  padding: 6px 0 0 20px;
  .el-form-item__label {
    width: 100px;
    padding-right: 8px;
  }
  .el-button {
    margin: 0 6px;
  }
  .el-form {
    margin-right: 20px;
    .el-input,
    .el-select {
      width: 150px;
    }
  }
}
.bottonBox {
  display: flex;
  .el-button {
    margin: 5px 6px;
  }
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.detail-style {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 10px;
}
.importExcel {
  margin-left: 2%;
}
.top-name {
  width: 99%;
  height: 37px;
  line-height: 30px;
  border-bottom: 1px solid #425079;
}
.all-edit:hover {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}
</style>
