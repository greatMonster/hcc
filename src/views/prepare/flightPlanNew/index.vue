<template>
  <div class="skillBox11">
    <div class="skillShow">
      <div class="add-user">
        <div class="top-name">
          <div style="font-size: 16px; font-weight: 500">{{ flightVO.documentName }} ( {{ flightVO.fromDate }} - {{ flightVO.toDate }} )</div>
        </div>
        <el-form :inline="true" :model="listQuery" size="small">
          <div style="display: flex; width: 100%; height: 100%; border-bottom: 1px solid #425079; margin-top: 15px">
            <div style="width: 100%">
              <div class="search-bottom">
                <el-form-item label="航站楼" label-width="60px">
                  <el-select v-model="listQuery.terminalId" filterable clearable>
                    <el-option v-for="item in terminalOptions" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="国际/国内" label-width="80px">
                  <el-select v-model="listQuery.intlFlag" filterable clearable>
                    <el-option v-for="item in intlFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="班期" label-width="45px">
                  <el-select v-model="listQuery.weekday" filterable clearable multiple collapse-tags>
                    <el-option v-for="item in planTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div slot="label" style="display: inline-block">
                    执行期
                    <el-tooltip class="item" content="查询在特定时间段内执行的航班信息" placement="bottom">
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </div>
                  <el-date-picker
                    v-model="listQuery.dateStr"
                    size="small"
                    style="width: 220px"
                    clearable
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="|"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions3"
                  />
                </el-form-item>
                <el-form-item label="航班号" label-width="60px">
                  <el-input v-model="listQuery.flightNo" size="small" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="航班性质" label-width="70px">
                  <el-select v-model="listQuery.flightNatureCode" filterable clearable>
                    <el-option v-for="item in attributOptions" :key="item.caacCode" :label="item.flightNatureName" :value="item.caacCode" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="search-bottom" style="border-bottom: none">
                <el-form-item label="状态" label-width="45px">
                  <el-select v-model="listQuery.flightStatus" filterable clearable>
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="航班类型" label-width="75px">
                  <el-select v-model="listQuery.flightType" filterable clearable>
                    <el-option v-for="item in throughFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出发站" label-width="60px">
                  <el-select v-model="listQuery.deptAirport" filterable clearable>
                    <el-option v-for="item in planDeptAirportArry" :key="item.code" :label="item.code" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item label="到达站" label-width="60px">
                  <el-select v-model="listQuery.arrAirport" filterable clearable>
                    <el-option v-for="item in planArrAirportArry" :key="item.code" :label="item.code" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item label="宽/窄体机" label-width="72px">
                  <el-select v-model="listQuery.acType" filterable clearable>
                    <!-- <el-option v-for="item in acTypeOptions" :key="item.code" :label="item.code" :value="item.code" /> -->
                    <el-option v-for="item in acTypeOptions1" :key="item.id" :label="item.code" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="代理航司" label-width="68px">
                  <!-- <el-cascader v-model="listQuery.myValue" :options="options" :show-all-levels="false" style="width:120px" /> -->
                  <el-select v-model="listQuery.carrier" placeholder="请选择" multiple collapse-tags filterable clearable style="width: 185px" :filter-method="filterFCN">
                    <el-option v-for="(item, i) in carrierOptions" :key="i" :label="item.name" :value="item.code" style="min-width: 180px">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机型" label-width="55px">
                  <el-input v-model="listQuery.aircraftType" size="small" placeholder="请输入" />
                </el-form-item>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: row-reverse">
            <el-form-item>
              <el-button type="info" size="small" @click="viewStaticsClick">统 计</el-button>
              <el-button type="primary" size="small" @click="search">查 询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="bottonBox" style="display: flex; margin: 10px">
        <el-button type="primary" size="small" @click="associated()">过站航班对</el-button>
        <el-button type="primary" size="small" @click="startAfterClick()">首发航后</el-button>
        <el-button type="info" size="small" @click="shareFlight()">共享航班列表</el-button>
        <el-button type="info" size="small" @click="showChart('wave')">航班波</el-button>
        <el-button type="info" size="small" @click="showChart('capacity')">运力波</el-button>
        <!-- <el-button type="info" size="small" @click="showChart('density')">航线密度</el-button> -->
        <el-button v-if="skillShowTable.flightScheduleId" style="width: 80px" type="primary" size="small" @click="addClick">添 加</el-button>
        <div class="detail-style">
          <!-- <div slot="reference" class="all-edit name-wrapper">航司 {{ detailsCount.companyCount }}，</div> -->
          <span>共 {{ skillShowTable.total }} 条</span>
          <span style="padding-left: 10px">
            <el-button type="primary" size="small" @click="importFcn">导出</el-button>
          </span>
        </div>
      </div>
      <div class="tableddd">
        <el-table v-loading="listLoading" :data="skillShowTable.list" stripe :empty-text="emptytext">
          <el-table-column type="index" width="50" label="序号" fixed />
          <el-table-column v-for="(item, index) in tableTitle2" :key="index" :label="item" width="120">
            <template slot-scope="scope">
              <span v-if="item == '计划开始日期'">{{ scope.row[item] | joinDate }}</span>
              <span v-else-if="item == '计划结束时间'">{{ scope.row[item] | joinDate }}</span>
              <span v-else-if="item == '起飞时间'">{{ scope.row[item] | joinTime }}</span>
              <span v-else-if="item == '到达时间'">{{ scope.row[item] | joinTime }}</span>
              <span v-else-if="item == '国际国内'">{{ scope.row[item] | filterData }}</span>
              <!-- <span v-else-if="item=='航班类型'">{{ scope.row[item] | filterData2 }}</span> -->
              <span v-else-if="item == '起飞站'">
                <el-popover placement="top-start" trigger="hover">
                  <span style="width: auto">{{ scope.row[item].name }}</span>
                  <span slot="reference">{{ scope.row[item].code }}</span>
                </el-popover>
              </span>
              <span v-else-if="item == '承运人'">
                <el-popover placement="top-start" trigger="hover">
                  <span>{{ scope.row[item].name }}</span>
                  <span slot="reference">{{ scope.row[item].code }}</span>
                </el-popover>
              </span>
              <span v-else-if="item == '到达站'">
                <el-popover placement="top-start" trigger="hover" width="100">
                  <span>{{ scope.row[item].name }}</span>
                  <span slot="reference">{{ scope.row[item].code }}</span>
                </el-popover>
              </span>
              <span v-else>{{ scope.row[item] }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="160" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
              <el-button type="small" size="small" style="width: 60px; height: 30px" @click="statusClick(scope.$index, scope.row)">禁 用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 顶部信息总览dialog -->
    <el-dialog v-dialogDrag :visible.sync="topViewMore" title="航班计划详情">
      <div style="font-size: 15px; weight: 700; padding-left: 21%">总航班架次：{{ sorties }}</div>
      <div v-for="(item, index) in flightNatureList" :key="index" style="width: 30%; height: 20px; line-height: 20px; margin: 5px auto; display: flex">
        <span style="width: 100px">{{ item.name }}</span
        >&nbsp;&nbsp;&nbsp;
        <span>
          <el-popover trigger="click" placement="right">
            <p>国际：{{ item.totalCountI }}</p>
            <p>国内：{{ item.totalCountD }}</p>
            <div slot="reference" style="cursor: pointer; color: #409eff">{{ item.totalCount }}</div>
          </el-popover>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="topViewMore = false">取 消</el-button>
        <!-- <el-button type="primary" @click="handleAddClickitem('form')">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 统计信息 -->
    <el-dialog v-dialogDrag :visible.sync="staticsDialog" title="统计信息" style="padding-top: 20px" width="560px">
      <div>
        <div style="display: flex; align-items: center; height: 50px; margin-top: 6px; font-size: 10px; border-bottom: 1px solid #425079">
          概览：
          <span v-for="(item, index) in overviewList" :key="index" style="height: 20px; line-height: 20px; display: flex; margin-right: 20px">
            <span>{{ item.name }}</span
            >&nbsp;&nbsp;&nbsp;
            <span>
              <el-popover trigger="click" placement="right">
                <p>国际：{{ item.totalCountI }}</p>
                <p>国内：{{ item.totalCountD }}</p>
                <div slot="reference" style="cursor: pointer; color: #409eff">{{ item.totalCount }}</div>
              </el-popover>
            </span>
          </span>
          <!-- <span class="view-more" @click="viewMore">查看更多</span> -->
        </div>
        <div style="width: 100%; margin-top: 6px">
          <div v-for="(item, index) in terminalIdList" :key="index">
            <div style="margin-bottom: 5px; font-size: 13px; font-weight: 700">{{ item[0].terminalName }}航站楼</div>
            <div v-for="itemin in item" :key="itemin.name">
              <div style="width: 80%; height: 20px; line-height: 20px; margin: 0 auto; display: flex">
                <span style="width: 100px">{{ itemin.name }}</span>
                &nbsp;&nbsp;&nbsp;
                <span v-if="itemin.name === '到达时间' || itemin.name === '出发时间'">
                  <el-popover trigger="click" placement="right">
                    <p>最早：{{ itemin.totalCountI }}</p>
                    <p>最晚：{{ itemin.totalCountD }}</p>
                    <div slot="reference" style="cursor: pointer; color: #409eff">{{ itemin.totalCount }}</div>
                  </el-popover>
                </span>
                <span v-else>
                  <el-popover trigger="click" placement="right">
                    <p>国际：{{ itemin.totalCountI }}</p>
                    <p>国内：{{ itemin.totalCountD }}</p>
                    <div slot="reference" style="cursor: pointer; color: #409eff">{{ itemin.totalCount }}</div>
                  </el-popover>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="staticsDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 始发航后 -->
    <el-dialog v-dialogDrag :visible.sync="startAfter" title="编辑航班类型" width="60%">
      <el-form ref="flightTypeForm" :model="flightTypeForm" :rules="flightTypeFormRules" style="width: 51%; margin: 10px auto">
        <el-form-item prop="ids" label="航班号：" :label-width="formLabelWidth">
          <el-select v-model="flightTypeForm.ids" multiple filterable collapse-tags size="small" style="width: 60%">
            <el-option v-for="item in flightoptions" :key="item.id" :label="item.flightNo" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="首发/航后：" :label-width="formLabelWidth" prop="throughType">
          <el-radio-group v-model="flightTypeForm.throughType" @change="flightNumSearch">
            <el-radio :label="2">首发</el-radio>
            <el-radio :label="3">航后</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="startAfter = false">取 消</el-button>
        <el-button type="primary" @click="throughtFlagConfirm('flightTypeForm')">确 定</el-button>
      </div>
    </el-dialog>
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
    <!-- 添加弹框 -->
    <el-dialog v-dialogDrag :title="lineChartDataBig.date" width="70%" :visible.sync="dialogTableVisible" :close="closeImport" center>
      <p>航班总数：{{ lineChartDataBig.total }}</p>
      <distribution :chart-data="lineChartDataBig" style="width: 100%; height: 600px; cursor: pointer" />
    </el-dialog>
    <div>
      <el-dialog v-dialogDrag :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form ref="ruleForm" :model="formdata" :rules="rules" :inline="true">
          <el-form-item prop="acType" label="机型" :label-width="formLabelWidth">
            <el-input v-model="formdata.acType" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="arrAirport" label="到达航站" :label-width="formLabelWidth">
            <el-input v-model="formdata.arrAirport" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="arrTimeStr" label="到达时间" :label-width="formLabelWidth">
            <el-time-picker v-model="formdata.arrTimeStr" arrow-control="true" format="HH:mm" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item prop="arrTimeIdx" label="进港时间标注" :label-width="formLabelWidth">
            <el-select v-model="formdata.arrTimeIdx" placeholder="请选择">
              <el-option v-for="item in arrTimeIdxoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="beginDateStr" label="计划开始日期" :label-width="formLabelWidth">
            <el-date-picker v-model="formdata.beginDateStr" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item prop="flightNo" label="航班号" :label-width="formLabelWidth">
            <el-input v-model="formdata.flightNo" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="carrier" label="承运人" :label-width="formLabelWidth">
            <el-input v-model="formdata.carrier" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="deptAirport" label="起飞航站" :label-width="formLabelWidth">
            <el-input v-model="formdata.deptAirport" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="deptTimeStr" label="起飞时间" :label-width="formLabelWidth">
            <el-time-picker v-model="formdata.deptTimeStr" arrow-control="true" format="HH:mm" value-format="HH:mm:ss" />
          </el-form-item>
          <el-form-item prop="arrTimeIdx" label="离港时间标注" :label-width="formLabelWidth">
            <el-select v-model="formdata.arrTimeIdx" placeholder="请选择">
              <el-option v-for="item in arrTimeIdxoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="endDateStr" label="计划结束日期" :label-width="formLabelWidth">
            <el-date-picker v-model="formdata.endDateStr" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item prop="flightLine" label="航线" :label-width="formLabelWidth">
            <el-input v-model="formdata.flightLine" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="flightType" label="航班类型" :label-width="formLabelWidth">
            <el-select v-model="formdata.flightType" placeholder="请选择">
              <el-option v-for="item in flightTypeoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="intlFlag" label="国际/国内" :label-width="formLabelWidth">
            <el-select v-model="formdata.intlFlag" placeholder="请选择">
              <el-option v-for="item in intlFlagoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="planSeason" label="航季" :label-width="formLabelWidth">
            <el-input v-model="formdata.planSeason" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="seqNum" label="航段次序" :label-width="formLabelWidth">
            <el-input v-model="formdata.seqNum" placeholder="请输入正确信息" />
          </el-form-item>
          <el-form-item prop="weekday" label="班期" :label-width="formLabelWidth">
            <el-input v-model="formdata.weekday" placeholder="请输入1~7不可重复数字" />
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeNamesShare">
          <el-collapse-item name="1">
            <template slot="title"> <i class="el-icon-d-caret" /> 共享航班 </template>
            <el-button size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" :append-to-body="true" @click="shareDialogAdd">新增</el-button>
            <el-table :data="shareItemList" border stripe>
              <el-table-column prop="carrierName" label="承运人" />
              <el-table-column prop="flightNo" label="航班号" />
              <el-table-column prop="deptAirport" label="起飞站" />
              <el-table-column prop="arrAirport" label="到达站" />
              <el-table-column prop="validateDate" label="有效期" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.beginTime }} - {{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="shareRemoveAttr(scope.$index, shareItemList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title"> <i class="el-icon-d-caret" /> 扩展属性 </template>
            <el-button size="mini" style="margin-bottom: 10px" type="primary" icon="el-icon-edit" :append-to-body="true" @click="dialogAdd">新增</el-button>
            <el-table :data="itemList" border stripe>
              <el-table-column prop="attrName" label="扩展属性" />
              <el-table-column prop="attrValue" label="属性值" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="removeAttr(scope.$index, itemList)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog v-dialogDrag :visible.sync="shareDialogAdditem" title="添加共享航班">
      <el-form :model="shareform">
        <el-form-item label="选择承运人:" prop="carrier" :label-width="formLabelWidth">
          <el-select v-model="shareform.carrier" placeholder="请选择" style="width: 40%" value-key="iataCode">
            <el-option v-for="items in carrierData" :key="items.iataCode" :label="items.carrierName" :value="items" />
          </el-select>
        </el-form-item>
        <el-form-item prop="flightNo" label="航班号：" :label-width="formLabelWidth">
          <el-input v-model="shareform.flightNo" size="small" placeholder="请输入" style="width: 40%" />
        </el-form-item>
        <el-form-item prop="deptAirport" label="起飞站：" :label-width="formLabelWidth">
          <el-select v-model="shareform.deptAirport" placeholder="请选择" style="width: 40%">
            <el-option v-for="(item, i) in planDeptAirportArry" :key="i" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item prop="arrAirport" label="到达站：" :label-width="formLabelWidth">
          <el-select v-model="shareform.arrAirport" placeholder="请选择" style="width: 40%">
            <el-option v-for="(item, i) in planArrAirportArry" :key="i" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="validateDate">
          <el-date-picker v-model="shareform.validateDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 40%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="shareDialogAdditem = false">取 消</el-button>
        <el-button type="primary" @click="handleShareAddClickitem('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :visible.sync="dialogAdditem" title="添加扩展属性">
      <el-form :model="chargingform">
        <el-form-item label="选择扩展属性:" :label-width="formLabelWidth">
          <el-select v-model="chargingform.attrCode" placeholder="请选择">
            <el-option v-for="(items, indexs) in chargingOptions" :key="indexs" :label="items.attributeName" :value="indexs" />
          </el-select>
        </el-form-item>
        <el-form-item prop="attrValue" label="属性值：" :label-width="formLabelWidth">
          <el-input v-model="chargingform.attrValue" placeholder="请输入正确信息" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="background: #495373; color: white" @click="dialogAdditem = false">取 消</el-button>
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
    <el-dialog v-dialogDrag :visible.sync="dialogStatus" title style="padding-top: 20px">
      <div>
        <div>
          <div>添加禁用</div>
          <div>
            <el-form :inline="true" :model="from" size="small">
              <el-form-item label="开始结束日期" prop="interTimerPicker">
                <el-date-picker v-model="from.interTimerPicker" value-format="yyyy-MM-dd" :picker-options="pickerOptions" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 80%" />
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
                <el-button :disabled="scope.row.status === 'not_delete' ? true : false" type="small" style="width: 60px; height: 30px" @click="removeClick(scope.$index, scope.row, tableData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleStatus('form')">确 定</el-button>
        <el-button style="background: #495373; color: white" @click="cancelClick2">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div style="display: flex; height: 40px">
      <el-pagination v-if="documentType == 'DAY_FLIGHT_SCHEDULE'" background :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  flightWavesFcn,
  flightSeatWavesFcn,
  selectData,
  addDatafcn,
  eitDatafcn,
  seachDataNew,
  selectData2,
  eitdData,
  prohibit,
  remove,
  addDate,
  defaultStatistics,
  seachDataNew2,
  terminalData,
  attributOptionsFcn,
  carriersOptions,
  carrierData,
  flightNumSelect,
  throughFlag
} from '@/api/flightPlan'
import distribution from '@/components/echarts/distribution'
import axios from 'axios'
// import { parseTime } from '@/utils'
// import { constants } from 'crypto'
export default {
  name: 'FlightPlan',
  components: {
    distribution
  },
  filters: {
    joinDate: function (value) {
      if (value) {
        value = value.substring(0, 10)
        return value
      } else {
        return value
      }
    },
    joinTime: function (value) {
      if (value) {
        value = value.substring(11, 16)
        return value
      }
    },
    filterData: function (value) {
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
      pickerOptions3: {
        disabledDate: (time) => {
          return this.dealDisabledDate3(time)
        }
      },
      staticsDialog: false,
      param: '',
      startAfter: false,
      flightTypeForm: { ids: [], throughType: 2 },
      flightoptions: [],
      flightTypeFormRules: {
        throughType: [{ required: true, message: '请选择', trigger: 'change' }],
        ids: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }]
      },
      DIoptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' },
        { label: '国际/国内', value: 'D/I' }
      ],
      newOld: this.$route.query.newOld,
      airportId: this.$route.query.airportId,
      shareform: {},
      loadingDea: false,
      alldata: [],
      lineChartDataBig: {},
      dialogTableVisible: false,
      topViewMore: false,
      moreSearch: false,
      shareCount: 0,
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
      formData2: {
        dateStr: [],
        size: '60',
        flightWave: '',
        regionType: ''
      },
      emptytext: '数据加载中',
      waveOrDensity: true,
      terminalOptions: [],
      planTypeOptions: [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 7 }
      ],
      attributOptions: [],
      statusOptions: [
        { label: '全部', value: '' },
        { label: '首发', value: 1 },
        { label: '航后', value: 2 },
        { label: '过站', value: 3 }
      ],
      overviewList: [],
      terminalIdList: [],
      flightNatureList: [],
      chartDialog: false,
      flightWave: ' ',
      titlesWave: '航班波',
      flightWaveOptions: [
        { label: '全部', value: ' ' },
        { label: '进', value: 'A' },
        { label: '出', value: 'D' }
      ],
      acTypeOptions1: [
        { code: '全部', id: '' },
        { code: '宽体机', id: '1' },
        { code: '窄体机', id: '2' }
      ],
      pickerOptions: {
        disabledDate: (time) => {
          return this.dealDisabledDate(time)
        }
      },
      dialogStatus: false,
      flightVO: {},
      offon2: false,
      topStartTime: '',
      topEndTime: '',
      sorties: '',
      tableHeight: window.innerHeight - 240,
      detailsCount: {},
      dialogVisible: false,
      dialogAdditem: false,
      shareDialogAdditem: false,
      flightBeginDate: '',
      flightEndDate: '',
      from: {
        interTimerPicker: ''
      },
      param: '',
      offon: false,
      dates: {},
      listQuery: {
        terminalId: '',
        intlFlag: '',
        weekday: '',
        startDate: '',
        endDate: '',
        aircraftType: '',
        flightNo: '',
        flightNatureCode: '',
        flightType: '',
        flightStatus: '',
        deptAirport: '',
        arrAirport: '',
        acType: '',
        executeStart: '',
        executeEnd: '',
        carrier: ''
      },
      itemList: [],
      shareItemList: [],
      weekdayoptions: [1, 2, 3, 4, 5, 6, 7],
      intlFlagOptions: [
        { label: '国际', value: 'I' },
        { label: '国内', value: 'D' }
      ],
      throughFlagOptions: [
        { label: '进港', value: 'A' },
        { label: '出港', value: 'D' }
      ],
      planDeptAirportArry: [],
      planArrAirportArry: [],
      acTypeOptions: [],
      carrierOptions: [],
      titles: '',

      activeNamesShare: ['1', '2'],
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
      carrierData: [],
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
      page: {
        pageSize: 20,
        pageNum: '1',
        currentPage: '1',
        total: 0
      },
      id: '',
      addedData: [],
      datetimerange: '',
      documentId: this.$route.query.documentId,
      documentType: this.$route.query.documentType,
      dialogFormVisible: false,
      form: { fileName: '文件名', documentId: this.$route.query.documentId },
      importanceOptions: [],
      detailSearch: {},
      chargingform: {},
      terminalName: '',
      activeName: 'first',
      listLoading: false,
      title: '',
      formLabelWidth: '120px',
      skillShowTable: {},
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
      tableTitle: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季', '国际/国内', '是否过站', '班期', '机号', '机位'],
      tableTitle2: ['起飞航站', '到达航站', '起飞时间', '到达时间', '航段次序', '航班有效性', '计划起飞代理', '计划到达代理', '航班具体时间', '计划开始日期', '计划结束日期', '航季', '国际/国内', '是否过站', '班期', '机号', '机位']
    }
  },
  created() {
    this.selectDataT()
    this.initable()
    this.selectdata()
    this.defaultStatisticsInt()
    this.terminalDataInt()
    this.attributOptionsInt()
    this.carrierData2()
    this.flightNumSearch()
  },
  mounted() {
    var $this = this
    const dom = document.querySelector('.tableddd')
    dom.addEventListener(
      'scroll',
      function () {
        const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
        if (scrollDistance <= 1) {
          if ($this.page.currentPage < $this.page.total) {
            var loading = $this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            $this.page.currentPage++
            var data = {
              documentId: $this.$route.query.documentId || '',
              terminalId: $this.listQuery.terminalId || '',
              intlFlag: $this.listQuery.intlFlag || '',
              weekday: $this.listQuery.weekday || '',
              startDate: $this.listQuery.dateStr ? $this.listQuery.dateStr[0] : '',
              endDate: $this.listQuery.dateStr ? $this.listQuery.dateStr[1] : '',
              flightNo: $this.listQuery.flightNo || '',
              flightNatureCode: $this.listQuery.flightNatureCode || '',
              flightType: $this.listQuery.flightType || '',
              flightStatus: $this.listQuery.flightStatus || '',
              deptAirport: $this.listQuery.deptAirport || '',
              arrAirport: $this.listQuery.arrAirport || '',
              acType: $this.listQuery.acType || '',
              aircraftType: $this.listQuery.aircraftType || '',
              executeStart: $this.listQuery.beginDateStr ? $this.listQuery.beginDateStr[0] : '',
              executeEnd: $this.listQuery.beginDateStr ? $this.listQuery.beginDateStr[1] : '',
              carrier: $this.listQuery.carrier || '',
              pageNum: $this.page.currentPage || '',
              pageSize: $this.page.pageSize || ''
            }
            seachDataNew(data).then((response) => {
              if (response.data.code === '200') {
                $this.flightVO = response.data.data.flightVO
                $this.page.total = response.data.data.pageInfo.pages
                $this.skillShowTable.list = $this.skillShowTable.list.concat(response.data.data.pageInfo.list)
                loading.close()
                if ($this.newOld) {
                  $this.$set($this.formData2, 'dateStr', [$this.getNowFormatDate(), $this.getNowFormatDate()])
                } else {
                  $this.$set($this.formData2, 'dateStr', [$this.flightVO.fromDate, $this.flightVO.toDate])
                }
              }
            })
          }
        }
      },
      true
    )
  },
  methods: {
    viewStaticsClick() {
      // 查看统计
      this.staticsDialog = true
    },
    startAfterClick() {
      this.startAfter = true
      if (this.$refs.flightTypeForm) {
        this.$refs.flightTypeForm.resetFields()
      }
    },
    flightNumSearch() {
      const data = {
        documentId: this.$route.query.documentId,
        throughType: this.flightTypeForm.throughType
      }
      flightNumSelect(data)
        .then((response) => {
          this.flightoptions = response.data.data
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.response.data.message || error.response.status
          })
        })
    },
    filterFCN(v) {
      var data = {
        documentId: this.$route.query.documentId,
        searchData: v
      }
      carriersOptions(data).then((res) => {
        this.carrierOptions = res.data.data
      })
    },
    throughtFlagConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          throughFlag(this.flightTypeForm)
            .then((response) => {
              this.$message.success('设置成功')
              this.startAfter = false
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.response.data.message || error.response.status
              })
            })
        }
      })
    },
    importFcn() {
      var startDate = this.listQuery.dateStr ? this.listQuery.dateStr[0] : ''
      var endDate = this.listQuery.dateStr ? this.listQuery.dateStr[1] : ''
      var executeStart = this.listQuery.beginDateStr ? this.listQuery.beginDateStr[0] : ''
      var executeEnd = this.listQuery.beginDateStr ? this.listQuery.beginDateStr[1] : ''
      let href =
        'prepare/api/v1/flightSchedule/info/download/' +
        this.$route.query.documentId +
        '?terminalId=' +
        this.listQuery.terminalId +
        '&intlFlag=' +
        this.listQuery.intlFlag +
        '&weekday=' +
        this.listQuery.weekday +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate +
        '&flightNo=' +
        this.listQuery.flightNo +
        '&flightNatureCode=' +
        this.listQuery.flightNatureCode +
        '&flightType=' +
        this.listQuery.flightType +
        '&flightStatus=' +
        this.listQuery.flightStatus +
        '&deptAirport=' +
        this.listQuery.deptAirport +
        '&arrAirport=' +
        this.listQuery.arrAirport +
        '&acType=' +
        this.listQuery.acType +
        '&executeStart=' +
        executeStart +
        '&aircraftType=' +
        this.listQuery.aircraftType +
        '&carrier=' +
        this.listQuery.carrier +
        ''
      axios({
        method: 'get',
        url: href, // 请求地址
        headers: {
          Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('TOKEN')).accessToken
        },
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then((res) => {
        // 处理返回的文件流
        const content = res.data
        const blob = new Blob([content])
        const fileName = '航班计划.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    search() {
      this.skillShowTable.list = []
      this.page.currentPage = '1'
      var data = {
        documentId: this.$route.query.documentId || '',
        terminalId: this.listQuery.terminalId || '',
        intlFlag: this.listQuery.intlFlag || '',
        weekday: this.listQuery.weekday || '',
        startDate: this.listQuery.dateStr ? this.listQuery.dateStr[0] : '',
        endDate: this.listQuery.dateStr ? this.listQuery.dateStr[1] : '',
        flightNo: this.listQuery.flightNo || '',
        flightNatureCode: this.listQuery.flightNatureCode || '',
        flightType: this.listQuery.flightType || '',
        flightStatus: this.listQuery.flightStatus || '',
        deptAirport: this.listQuery.deptAirport || '',
        arrAirport: this.listQuery.arrAirport || '',
        aircraftType: this.listQuery.aircraftType || '',
        acType: this.listQuery.acType || '',
        executeStart: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[0] : '',
        executeEnd: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[1] : '',
        carrier: this.listQuery.carrier || '',
        pageNum: this.page.currentPage || '',
        pageSize: this.page.pageSize || ''
      }
      seachDataNew(data).then((response) => {
        // 航班计划
        if (response.data.code === '200') {
          this.flightVO = response.data.data.flightVO
          this.page.total = response.data.data.pageInfo.pages
          this.skillShowTable = response.data.data.pageInfo

          if (this.skillShowTable.list.length) {
            this.tableTitle2 = []
            this.skillShowTable.list.forEach((element) => {
              this.tableTitle2 = Object.keys(element)
              this.tableTitle2.forEach((itm, i) => {
                if (itm === 'ID') {
                  this.tableTitle2.splice(i, 1)
                }
              })
            })
          } else {
            this.tableTitle2 = this.tableTitle
            this.emptytext = '暂无数据'
          }
          //   this.detailsCountSearch()
          this.listLoading = false
          this.$message.success('查询成功')
        } else {
          this.$message.error('查询失败')
        }
      })
      this.seachDataNewInt()
    },
    showEchart(items) {
      // 点击显示大图
      this.lineChartDataBig = {}
      this.lineChartDataBig = items
      this.dialogTableVisible = true
    },
    closeImport() {
      // 关闭显示大图
      if (this.lineChartDataBig) {
        this.lineChartDataBig = {}
      }
      this.dialogTableVisible = false
      // location.reload()
    },
    viewMore() {
      this.topViewMore = true
    },
    terminalDataInt() {
      terminalData(this.airportId).then((res) => {
        if (res.data.code === 'ok') {
          this.terminalOptions = res.data.data.terminals
        }
      })
    },
    attributOptionsInt() {
      attributOptionsFcn(false).then((res) => {
        if (res.data.code === '200') {
          this.attributOptions = res.data.data
        }
      })
    },
    moreSearchClick() {
      this.moreSearch = !this.moreSearch
    },
    changeType() {
      this.loadingDea = true
      if (this.param === 'wave') {
        this.flightWavesFcninit()
      } else if (this.param === 'capacity') {
        this.flightSeatWavesFcninit()
      }
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
    importClick() {
      // 导出
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/cycleFlightPlan/export?filename=' + this.form.fileName + '&documentId=' + this.$route.query.documentId
    },
    selectDataT() {
      selectData2(this.$route.query.documentId).then((response) => {
        this.acTypeOptions = response.data.acTypeList
        this.carrierOptions = response.data.carrierList
        this.planArrAirportArry = response.data.planArrAirportList
        this.planDeptAirportArry = response.data.planDeptAirportList
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
      this.$router.push({ path: '/prepare/flightPlan/relationPage', query: { documentId: this.$route.query.documentId } })
    },
    shareFlight() {
      this.$router.push({ path: '/prepare/flightPlanNew/sharedFlights', query: { documentId: this.$route.query.documentId } })
    },
    dealDisabledDate(time) {
      if (Date.parse(new Date(this.flightBeginDate)) > Date.parse(new Date())) {
        return time.getTime() < Date.parse(new Date(this.flightBeginDate)) || time.getTime() > Date.parse(new Date(this.flightEndDate))
      } else {
        return time.getTime() < Date.parse(new Date()) || time.getTime() > Date.parse(new Date(this.flightEndDate))
      }
    },
    associated() {
      this.$router.push({ path: 'flightPlan/associatedflights', query: { flightScheduleId: this.flightVO.flightScheduleId, documentId: this.$route.query.documentId } })
    },
    initable() {
      var data = {
        documentId: this.$route.query.documentId || '',
        terminalId: this.listQuery.terminalId || '',
        intlFlag: this.listQuery.intlFlag || '',
        weekday: this.listQuery.weekday || '',
        startDate: this.listQuery.dateStr ? this.listQuery.dateStr[0] : '',
        endDate: this.listQuery.dateStr ? this.listQuery.dateStr[1] : '',
        flightNo: this.listQuery.flightNo || '',
        flightNatureCode: this.listQuery.flightNatureCode || '',
        flightType: this.listQuery.flightType || '',
        flightStatus: this.listQuery.flightStatus || '',
        deptAirport: this.listQuery.deptAirport || '',
        arrAirport: this.listQuery.arrAirport || '',
        acType: this.listQuery.acType || '',
        aircraftType: this.listQuery.aircraftType || '',
        executeStart: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[0] : '',
        executeEnd: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[1] : '',
        carrier: this.listQuery.carrier || '',
        pageNum: this.page.currentPage || '',
        pageSize: this.page.pageSize || ''
      }
      seachDataNew(data).then((response) => {
        // 航班计划
        if (response.data.code === '200') {
          this.flightVO = response.data.data.flightVO
          this.page.total = response.data.data.pageInfo.pages
          this.skillShowTable = response.data.data.pageInfo
          this.formdata.cycleFlightScheduleId = response.data.data.flightVO.flightScheduleId
          this.tableTitle2 = []
          if (this.newOld) {
            this.$set(this.formData2, 'dateStr', [this.getNowFormatDate(), this.getNowFormatDate()])
          } else {
            this.$set(this.formData2, 'dateStr', [this.flightVO.fromDate, this.flightVO.toDate])
          }
          if (parseInt(this.date.getTime()) > new Date(this.flightVO.fromDate).getTime() - 86400000 && parseInt(this.date.getTime()) < new Date(this.flightVO.toDate).getTime() + 86400000) {
            this.offon2 = true
          } else {
            this.offon2 = false
          }
          if (this.skillShowTable.list.length) {
            this.tableTitle2 = []
            this.skillShowTable.list.forEach((element) => {
              this.tableTitle2 = Object.keys(element)
              this.tableTitle2.forEach((itm, i) => {
                if (itm === 'ID') {
                  this.tableTitle2.splice(i, 1)
                }
              })
            })
          } else {
            this.tableTitle2 = this.tableTitle
            this.emptytext = '暂无数据'
          }
          // if(this.date>this.flightVO.)

          //   this.detailsCountSearch()
          this.listLoading = false
        }
      })
    },
    defaultStatisticsInt() {
      defaultStatistics(this.documentId).then((res) => {
        if (res.data.code === '200') {
          this.overviewList = res.data.data.overviewList
          this.flightNatureList = res.data.data.flightNatureList
          this.terminalIdList = res.data.data.terminalIdList

          this.terminalName = this.terminalIdList[0].terminalName
          this.overviewList.forEach((item) => {
            if (item.name === '总航班架次') {
              this.sorties = item.totalCount
            }
          })
        }
      })
    },
    seachDataNewInt() {
      var data = {
        documentId: this.$route.query.documentId || '',
        terminalId: this.listQuery.terminalId || '',
        intlFlag: this.listQuery.intlFlag || '',
        weekday: this.listQuery.weekday || '',
        startDate: this.listQuery.dateStr ? this.listQuery.dateStr[0] : '',
        endDate: this.listQuery.dateStr ? this.listQuery.dateStr[1] : '',
        flightNo: this.listQuery.flightNo || '',
        flightNatureCode: this.listQuery.flightNatureCode || '',
        flightType: this.listQuery.flightType || '',
        flightStatus: this.listQuery.flightStatus || '',
        deptAirport: this.listQuery.deptAirport || '',
        aircraftType: this.listQuery.aircraftType || '',
        arrAirport: this.listQuery.arrAirport || '',
        acType: this.listQuery.acType || '',
        executeStart: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[0] : '',
        executeEnd: this.listQuery.beginDateStr ? this.listQuery.beginDateStr[1] : '',
        carrier: this.listQuery.carrier || '',
        pageNum: this.page.pageNum || '',
        pageSize: this.page.pageSize || ''
      }
      seachDataNew2(data).then((res) => {
        if (res.data.code === '200') {
          this.terminalIdList = res.data.data.terminalIdList
          this.terminalName = this.terminalIdList[0].terminalName
        }
      })
    },

    addClick() {
      this.dialogVisible = true
      this.titles = '添加航班'
    },
    editHandleClick(index, row) {
      this.dialogVisible = true
      this.titles = '修改航班'
      eitdData(row.ID).then((response) => {
        this.formdata.arrAirport = response.data.arrAirport
        this.formdata.acType = response.data.acType
        this.formdata.arrTimeStr = response.data.arrTimeStr
        this.formdata.arrTimeIdx = response.data.arrTimeIdx
        this.formdata.beginDateStr = response.data.beginDate
        this.formdata.carrier = response.data.carrier
        this.formdata.cycleFlightId = response.data.cycleFlightId
        this.formdata.deptAirport = response.data.deptAirport
        this.formdata.deptTimeStr = response.data.deptTimeStr
        this.formdata.deptTimeIdx = response.data.deptTimeIdx
        this.formdata.endDateStr = response.data.endDate
        this.formdata.flightLine = response.data.flightLine
        this.formdata.flightNo = response.data.flightNo
        this.formdata.flightType = response.data.flightType
        this.formdata.intlFlag = response.data.intlFlag
        this.formdata.planSeason = response.data.planSeason
        this.formdata.seqNum = response.data.seqNum
        this.formdata.weekday = response.data.weekday
        this.itemList = response.data.exAttrs
        this.shareItemList = response.data.flightShareVOS || []
        this.formdata.id = response.data.cycleFlightId
      })
    },
    handleAddClick(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.titles === '添加航班') {
            this.formdata.exAttrs = this.itemList

            var addData = this.formdata
            addDatafcn(addData).then((response) => {
              if (response.code === '200') {
                this.clearData()
                this.activeNames = ''
                this.activeNamesShare = ''
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
            this.formdata.flightShareVOS = this.shareItemList
            this.formdata.exAttrs = this.itemList
            var eitData = this.formdata
            eitDatafcn(eitData).then((response) => {
              if (response.code === '200') {
                this.initable()
                this.clearData()
                this.$message.success(response.message)
              }
            })
            this.activeNames = ''
            this.activeNamesShare = ''
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
      prohibit(row.ID).then((res) => {
        this.tableData = res.data.data.dates
      })
      this.flightBeginDate = row.计划开始日期
      this.flightEndDate = row.计划结束时间
      this.dialogStatus = true
    },
    removeAttr(index, row) {
      row.splice(index, 1)
    },
    shareRemoveAttr(index, row) {
      row.splice(index, 1)
    },
    handleAddClickitem() {
      this.chargingform.attrName = this.chargingOptions[this.chargingform.attrCode].attributeName
      this.chargingform.attrCode = this.chargingOptions[this.chargingform.attrCode].attributeCode
      this.itemList.push(this.chargingform)
      this.dialogAdditem = false
      this.chargingform = {}
    },
    handleShareAddClickitem() {
      this.shareform.carrierName = this.shareform.carrier.carrierName
      this.shareform.carrier = this.shareform.carrier.iataCode
      this.shareform.beginTime = this.shareform.validateDate[0]
      this.shareform.endTime = this.shareform.validateDate[1]
      this.shareItemList.push(this.shareform)
      this.shareDialogAdditem = false
      this.shareform = {}
    },
    dialogAdd() {
      this.dialogAdditem = true
    },
    shareDialogAdd() {
      this.shareDialogAdditem = true
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
      selectData().then((response) => {
        this.chargingOptions = response.data
      })
    },
    carrierData2() {
      carrierData().then((res) => {
        if (res.data.code === '200') {
          this.carrierData = res.data.data
        }
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
              .then((res) => {
                if (res.data.code === '200') {
                  this.$message.success(res.data.message)
                  this.dialogStatus = false
                  this.initable()
                } else {
                  this.$message.error(res.data.message)
                }
              })
              .catch((e) => {
                this.$message.error(e.response.data.message)
              })
          })
          .catch(() => {})
      } else {
        this.dialogStatus = false
      }
    },
    dealDisabledDate3(time) {
      return time.getTime() > Date.parse(new Date(this.flightVO.toDate)) || time.getTime() < Date.parse(new Date(this.flightVO.fromDate))
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
    cancelClick2() {
      this.dialogStatus = false
      this.initable()
    },
    removeClick(index, row, tableData) {
      if (row.id) {
        remove(row.id)
          .then((res) => {
            if (res.data.code === '200') {
              this.$message.success(res.data.message)
              prohibit(this.id).then((res) => {
                this.tableData = res.data.data.dates
              })
              this.offon = true
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch((e) => {
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
    clearData() {
      this.formdata = {
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
        aircraftType: '',
        flightType: '',
        intlFlag: '',
        planSeason: '',
        seqNum: '',
        weekday: ''
      }
      this.itemList = []
      this.shareItemList = []
    },
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
    }
    // }
  }
}
</script>

<style>
.skillBox11 /deep/ .tableddd .el-table {
  position: absolute;
  width: auto;
  max-width: none;
}
.skillBox11 /deep/ .el-pagination {
  margin: 10px;
}
.el-button /deep/ {
  background: red;
  border: 1px solid red;
}
.skillBox11 /deep/ form {
  margin-top: 10px;
}
.skillBox11 /deep/ .el-form-item {
  margin-bottom: 5px;
  margin-top: 5px;
}
.skillBox11 /deep/ .table-css:after,
.skillBox11:after,
.skillShow:after {
  content: '';
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
.search-bottom {
  padding: 20px 0;
  border-bottom: 1px solid #425079;
}
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
  padding: 80px 0 0 20px;
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
      width: 100px;
    }
  }
}
.tableddd {
  height: 567px;
  position: relative;
  overflow: auto;
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
  height: 47px;
  border-bottom: 1px solid #425079;
}
.all-edit:hover {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}
.flight-style {
  color: #409eff;
  cursor: pointer;
}
.flight-style:hover {
  text-decoration: underline;
}
.isFolder {
  color: #409eff;
}
.isFolder:hover {
  cursor: pointer;
  color: #3183d8;
}
.view-more {
  color: #409eff;
}
.view-more:hover {
  cursor: pointer;
  color: #3183d8;
  text-decoration: underline;
}
</style>
