<template>
  <div style="box-sizing: border-box; padding: 0 10px">
    <div class="condition-select">
      <el-form ref="formSelect" :inline="true" :model="formSelect" class="demo-form-inline" size="small">
        <el-row :gutter="5" type="flex">
          <el-col :span="15">
            <div class="col-padding">
              <el-form-item prop="time" label="日期" label-width="45px">
                <!-- <el-date-picker v-model="formSelect.time" :picker-options="pickerOptions" size="mini" style="width:220px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="|" start-placeholder="开始日期" end-placeholder="结束日期" /> -->
                <el-date-picker v-model="formSelect.time" size="mini" style="width: 220px" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="|" start-placeholder="开始日期" end-placeholder="结束日期" />
              </el-form-item>
              <!-- <el-form-item label="站点" prop="realSite" class="select" label-width="45px">
                <el-select v-model="formSelect.realSite" size="mini" clearable filterable placeholder="请选择" style="width:220px">
                  <el-option v-for="item in optionsRealSite" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
                </el-select>
              </el-form-item>-->
              <el-form-item prop="orgnization" label="组织" class="select" label-width="45px">
                <el-select v-model="formSelect.orgnization" size="mini" clearable filterable placeholder="请选择" style="width: 220px">
                  <el-option v-for="item in optionsOrgnization" :key="item.organizationId" :label="item.organizationName" :value="item.organizationId" />
                </el-select>
              </el-form-item>
              <el-form-item prop="skill" label="技能" label-width="45px">
                <el-select v-model="formSelect.skill" size="mini" clearable filterable placeholder="请选择" style="width: 220px" @focus="skillIdList">
                  <el-option v-for="item in optionsSkill" :key="item.skillId" :label="item.skillName" :value="item.skillId" />
                </el-select>
              </el-form-item>
              <el-form-item prop="staffName" label="员工姓名" label-width="70px">
                <el-input v-model="formSelect.staffName" clearable type="text" placeholder="请输入员工姓名" style="width: 170px" />
              </el-form-item>
              <el-form-item prop="employeeCode" label="员工编号" label-width="70px">
                <el-input v-model="formSelect.employeeCode" clearable type="text" placeholder="请输入员工编号" style="width: 170px" />
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
                <!-- <el-button size="small" @click="resetForm('formSelect')">重置</el-button> -->
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="background: #151c3a">
            <div class="col-padding">
              <div>
                <el-form-item prop="baseLine" label="基线" label-width="45px">
                  <el-select v-model="formSelect.baseLine" clearable filterable placeholder="请选择" style="width: 150px" @focus="skillIdList">
                    <el-option v-for="item in optionsBaseline" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <el-button size="small" type="primary" @click="setBaseline">设置基线</el-button>
                  <el-button v-if="showBaseline" size="small" type="primary" @click="compareBaseline">比较基线</el-button>
                  <el-button v-else size="small" type="primary" @click="compareHideBaseline">隐藏基线</el-button>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div>
              <el-form-item>
                <el-button size="small" type="primary" @click="exportFile">导出</el-button>
                <div style="margin-top: 10px">
                  <el-button size="small" type="primary" @click="logJump">日志变更</el-button>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div ref="headerFilter" class="header-filter">
      <div class="cols">
        <span>
          <!-- <el-date-picker v-model="countDate" size="small" style="width:150px" clearable :picker-options="pickerOptions1" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="countDateChanged" /> -->
        </span>
        <span>
          <ins :style="{ 'margin-left': 20 + 'px', background: zb }" />
          早班 ( {{ shifCounttDetails.morningShiftNum }} )
        </span>
        <span>
          <ins :style="{ background: wb }" />
          午班 ( {{ shifCounttDetails.afternoonShiftNum }} )
        </span>
        <span>
          <ins :style="{ background: wanb }" />
          晚班 ( {{ shifCounttDetails.eveningShiftNum }} )
        </span>
        <span>
          <ins :style="{ background: xx }" />
          休息 ( {{ shifCounttDetails.restNum }} )
        </span>
        <span>
          <ins :style="{ background: yb }" />
          夜班 ( {{ shifCounttDetails.nightShiftNum }} )
        </span>
        <span>
          <span style="color: #f55f5f; font-size: 19px; margin-right: 5px">●</span>
          全天缺勤 ( {{ shifCounttDetails.allDayAbsenceNum }} )
        </span>
        <span>
          <span style="color: #f55f5f; margin-right: 5px">◐</span>
          部分缺勤 ( {{ shifCounttDetails.partialAbsenceNum }} )
        </span>
        <span>
          <ins class="bky" />
          不可用 ( {{ shifCounttDetails.unavailableNum }} )
        </span>
        <span>
          <ins class="wpb" />
          未排班
        </span>
        <span style="display: inline-block; float: right">
          <!-- <el-switch v-model="value2" style="display: block;margin-top: 4px;" active-color="#13ce66" inactive-color="#13ce66" active-text="员工" inactive-text="班组" @change="offonClick" /> -->
          <!-- <el-button size="small" type="primary" @click="allSelect">全选</el-button> -->
          <el-button size="small" type="primary" @click="multiDeleteClick">批量删除</el-button>
        </span>
      </div>
    </div>
    <div class="table-style">
      <!-- :height="tableHeight" -->
      <el-table ref="table" v-loading="loading" :data="tableData" border stripe :max-height="tableHeight" :empty-text="emptyText" style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
        <!-- <el-table-column v-if="!value2" v-once type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.employees" align="center" border stripe>
              <el-table-column align="center" prop="employeeName" label="姓名">
                <template slot-scope="scope">
                  <i v-if="scope.row.isLeader" class="el-icon-user-solid" />
                  <span>{{ scope.row.employeeName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="employeeCode" label="员工编号" />
              <el-table-column prop="roleBeanList" label="角色">
                <template slot-scope="scope">
                  <div v-if="scope.row.roleBeanList.length===1">{{ scope.row.roleBeanList[0].roleName }}</div>
                  <div v-else>
                    <el-popover trigger="hover" placement="right" width="200">
                      <div v-for="(item,index) in scope.row.roleBeanList" :key="index">
                        <span>{{ item.roleName }}</span>
                      </div>
                      <div slot="reference" class="name-wrapper name-style">
                        <span>{{ scope.row.roleBeanList[0].roleName }}…</span>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="skillBeanList" label="技能" min-width="120">
        <template slot-scope="scope">-->
        <!-- <div v-for="(item,index) in scope.row.skillBeanList" :key="index">
              <span>{{ item.skillName }}</span>
        </div>-->
        <!-- <div v-if="scope.row.skillBeanList.length===1">{{ scope.row.skillBeanList[0].skillName }}</div>
                  <div v-else>
                    <el-popover trigger="hover" placement="right" width="200">
                      <div v-for="(item,index) in scope.row.skillBeanList" :key="index">
                        <span>{{ item.skillName }}</span>
                      </div>
                      <div slot="reference" class="name-wrapper name-style">
                        <span>{{ scope.row.skillBeanList[0].skillName }}…</span>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="organizationName" label="组织" />
              <el-table-column v-for="(item,index) in formThead" :key="index" :label="item.workDate.split(' ')[0]" sortable min-width="130">
                <template slot-scope="scope">
                  <div>
                    <el-popover trigger="click" placement="right" width="200">
                      <p v-if="scope.row.dailyWorkBeans[index]" @click="changeShiftClick(scope.$index,scope.row,scope.row.dailyWorkBeans[index])">
                        <span v-if="scope.row.dailyWorkBeans[index].startTime">换班管理</span>
                      </p>
                      <p @click="editTimeClick(scope.$index,scope.row,scope.row.dailyWorkBeans[index])">编辑轮班时间</p>
                      <p v-if="scope.row.dailyWorkBeans[index]" @click="restClick(scope.$index,scope.row,scope.row.dailyWorkBeans[index])">
                        <span v-if="scope.row.dailyWorkBeans[index].startTime">休息管理</span>
                      </p>
                      <p v-if="scope.row.dailyWorkBeans[index]" @click="absenceManagement(scope.$index,scope.row,scope.row.dailyWorkBeans[index])">
                        <span v-if="scope.row.dailyWorkBeans[index].startTime">缺勤管理</span>
                      </p>
                      <p v-if="scope.row.dailyWorkBeans[index]" @click="deleteAbsenceClick(scope.$index,scope.row,scope.row.dailyWorkBeans[index])">
                        <span v-if="scope.row.dailyWorkBeans[index].startTime">删除缺勤</span>
                      </p>
                      <div slot="reference" class="all-edit name-wrapper">
                        <div v-if="scope.row.dailyWorkBeans[index]" :style="{backgroundColor: scope.row.dailyWorkBeans[index].shiftTypeColor}">
                          <div v-if="scope.row.dailyWorkBeans[index].startTime" style="text-align: center;">
                            {{ scope.row.dailyWorkBeans[index].startTime.substring(10,16) }} - {{ scope.row.dailyWorkBeans[index].endTime.substring(10,16) }}
                            <span v-if="scope.row.dailyWorkBeans[index].absenceCode">
                              <span v-if="scope.row.dailyWorkBeans[index].absenceCode == '1'" style="color: #f55f5f;font-size:5px">◐</span>
                              <span v-else style="color: #f55f5f;font-size:19px">●</span>
                            </span>
                          </div>
                          <div v-else class="rest-style">休息</div>
                        </div>
                        <div v-else class="rest-style">无</div>
                      </div>
                    </el-popover>
                  </div>
                  <div v-if="scope.row.baselineBeans">
                    <div v-if="scope.row.baselineBeans[index].sameMessage == 0" class="all-edit name-wrapper margin-count">
                      <div slot="reference" class="all-edit name-wrapper">
                        <div v-if="scope.row.baselineBeans[index]" :style="{backgroundColor: scope.row.baselineBeans[index].shiftTypeColor}">
                          <div v-if="scope.row.baselineBeans[index].startTime" style="text-align: center;">
                            {{ scope.row.baselineBeans[index].startTime.substring(10,16) }} - {{ scope.row.baselineBeans[index].endTime.substring(10,16) }}
                            <span v-if="scope.row.baselineBeans[index].absenceCode">
                              <span v-if="scope.row.baselineBeans[index].absenceCode == '1'" style="color: #f55f5f;font-size:5px">◐</span>
                              <span v-else style="color: #f55f5f;font-size:19px">●</span>
                            </span>
                          </div>
                          <div v-else class="rest-style">休息</div>
                        </div>
                        <div v-else class="rest-style">无</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="showRole" class="all-edit name-wrapper margin-count">角色</div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>-->
        <!-- <el-table-column type="selection" width="45"></el-table-column> -->
        <el-table-column label="请选择" width="45">
          <template slot-scope="scope">
            <el-checkbox :checked="boolValue" @change="(val) => selectRow(val, scope.row.code)" />
          </template>
        </el-table-column>
        <el-table-column type="index" width="45" />
        <el-table-column prop="name" label="名称" min-width="110">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="right" width="200">
              <div style="height: 200px; overflow: auto">
                <p v-for="(itemin, indexin) in scope.row.items" :key="indexin">
                  <span>{{ itemin.workDate.substring(0, 10) }}</span>
                  <span v-if="itemin.absenceCode">
                    <span v-if="itemin.absenceCode === 1" style="padding-left: 15px; color: #f55f5f; font-size: 10px">◐</span>
                    <span v-else style="padding-left: 15px; color: #f55f5f; font-size: 15px">●</span>
                  </span>
                  <span v-else :style="{ backgroundColor: itemin.shiftTypeColor }" class="detail-color" />
                </p>
              </div>
              <div slot="reference" class="name-wrapper name-style">
                <span>{{ scope.row.name }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编号" min-width="80" />
        <el-table-column prop="roles" label="角色" min-width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.roles.length === 0" />
            <div v-else style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis" :title="scope.row.rolesHandled">{{ scope.row.rolesHandled }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="skills" label="技能" min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.skills.length === 0" />
            <div v-else style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis" :title="scope.row.skillsHandled">{{ scope.row.skillsHandled }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="组织">
          <template slot-scope="scope">
            <div v-if="scope.row.organizationName.length < 4">{{ scope.row.organizationName }}</div>
            <div v-else>
              <el-popover trigger="hover" placement="right" width="200">
                <div>
                  <span>{{ scope.row.organizationName }}</span>
                </div>
                <div slot="reference" class="name-wrapper name-style">
                  <span>{{ scope.row.organizationName.substring(0, 3) }}…</span>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排班情况"> -->
        <el-table-column v-for="(item, index) in formThead" :key="index" :label="item.workDate.split(' ')[0]" sortable min-width="140" :render-header="renderHeader">
          <!-- <el-table-column v-for="(item,index) in formThead" :key="index" :label="item.workDate.split(' ')[0]" sortable min-width="140">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="allSelected" @change="select"></el-checkbox>
          </template>-->
          <template slot-scope="scope">
            <div v-if="!value2">
              <!-- <div class="all-edit name-wrapper" @dblclick.passive="detailShow(scope.$index,scope.row,$event)"> -->
              <div class="all-edit name-wrapper">
                <div v-if="scope.row.items[index]" :style="{ backgroundColor: scope.row.items[index].shiftTypeColor }">
                  <div v-if="scope.row.items[index].startTime" style="text-align: center">
                    {{ scope.row.items[index].startTime.substring(10, 16) }} - {{ scope.row.items[index].endTime.substring(10, 16) }}
                    <span v-if="scope.row.items[index].absenceCode">
                      <span v-if="scope.row.items[index].absenceCode == '1'" style="color: #f55f5f; font-size: 5px">◐</span>
                      <span v-else style="color: #f55f5f; font-size: 19px">●</span>
                    </span>
                  </div>
                  <div v-else class="rest-style" :style="{ background: xx }">休息</div>
                </div>
                <div v-else class="rest-style no-work">未排班</div>
              </div>
            </div>
            <div v-else>
              <div v-if="scope.row.items[index].availableStatus == 0" class="all-edit name-wrapper" style="backgroundcolor: red; text-align: center">请安排其他员工出勤</div>
              <div v-if="scope.row.items[index].availableStatus != 0">
                <el-popover trigger="click" placement="right" width="200">
                  <p v-if="scope.row.items[index]" @click="changeShiftClick(scope.$index, scope.row, scope.row.items[index])">
                    <span v-if="scope.row.items[index].beginTime">换班管理</span>
                  </p>
                  <p @click="editTimeClick(scope.$index, scope.row, scope.row.items[index])">编辑轮班时间</p>
                  <p v-if="scope.row.items[index]" @click="restClick(scope.$index, scope.row, scope.row.items[index])">
                    <span v-if="scope.row.items[index].beginTime">休息管理</span>
                  </p>
                  <p v-if="scope.row.items[index]" @click="absenceManagement(scope.$index, scope.row, scope.row.items[index])">
                    <span v-if="scope.row.items[index].beginTime">缺勤管理</span>
                  </p>
                  <p v-if="scope.row.items[index]" @click="deleteAbsenceClick(scope.$index, scope.row, scope.row.items[index])">
                    <span v-if="scope.row.items[index].beginTime">删除缺勤</span>
                  </p>
                  <div slot="reference" class="all-edit name-wrapper">
                    <div v-if="scope.row.items[index].shiftStatus == 1" :style="{ backgroundColor: scope.row.items[index].shiftTypeColor }">
                      <div v-if="scope.row.items[index].beginTime && scope.row.items[index].availableStatus == 1" style="text-align: center">
                        {{ scope.row.items[index].beginTime.substring(10, 16) }} - {{ scope.row.items[index].endTime.substring(10, 16) }}
                        <span v-if="scope.row.items[index].absenceCode">
                          <span v-if="scope.row.items[index].absenceCode == '1'" style="color: #f55f5f; font-size: 5px">◐</span>
                          <span v-else style="color: #f55f5f; font-size: 19px">●</span>
                        </span>
                      </div>
                      <div v-if="scope.row.items[index].availableStatus == 1 && !scope.row.items[index].beginTime" class="rest-style" :style="{ background: xx }">休息</div>
                    </div>
                    <div v-else class="rest-style no-work">未排班</div>
                  </div>
                </el-popover>
              </div>
              <div v-if="scope.row.baseLineBeans">
                <div v-if="scope.row.baseLineBeans[index].sameMessage == 0" class="all-edit name-wrapper margin-count">
                  <div slot="reference" class="all-edit name-wrapper">
                    <div v-if="scope.row.baseLineBeans[index]" :style="{ backgroundColor: scope.row.baseLineBeans[index].shiftTypeColor }">
                      <div v-if="scope.row.baseLineBeans[index].beginTime" style="text-align: center">
                        {{ scope.row.baseLineBeans[index].beginTime.substring(10, 16) }} - {{ scope.row.baseLineBeans[index].endTime.substring(10, 16) }}
                        <span style="color: green; position: relative; right: 0; top: -6px" title="注释：修改前的数据">M</span>
                        <span v-if="scope.row.baseLineBeans[index].absenceCode">
                          <span v-if="scope.row.baseLineBeans[index].absenceCode == '1'" style="color: #f55f5f; font-size: 5px">◐</span>
                          <span v-else style="color: #f55f5f; font-size: 19px">●</span>
                        </span>
                      </div>
                      <div v-else class="rest-style" :style="{ background: xx }">休息</div>
                    </div>
                    <div v-else class="rest-style no-work">未排班</div>
                  </div>
                </div>
              </div>
              <div v-if="showRole" class="all-edit name-wrapper margin-count">角色</div>
            </div>
          </template>
        </el-table-column>
        <!-- </el-table-column> -->
      </el-table>
      <div class="block">
        <span style="padding-left: 10px">今日在岗{{ page.totalCount }} 名</span>
        <span style="padding-left: 10px">每页 {{ 100 }} 名&nbsp;&nbsp;</span>
        <span>平均日工时:{{ countDetail.avgDailyWorkingHours ? countDetail.avgDailyWorkingHours : '-' }}/月工时:{{ countDetail.avgMonthlyWorkingHours ? countDetail.avgMonthlyWorkingHours : '-' }}</span>
        <el-pagination background :current-page="page.currentPage4" :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 设置基线对话框 -->
    <div>
      <el-dialog v-dialogDrag title="设置基线" :visible.sync="dialogbaseLineVisible">
        <el-form ref="formBaseline" :model="formBaseline" :rules="baselineRules">
          <el-form-item label="选择模式" prop="mode" :label-width="formLabelWidth">
            <el-select v-model="formBaseline.mode" placeholder="请选择" filterable style="width: 40%">
              <el-option v-for="item in optionsModeBaseline" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="基线类型" prop="baselineType" :label-width="formLabelWidth">
            <el-select v-model="formBaseline.baselineType" placeholder="请选择" filterable style="width: 40%">
              <el-option v-for="item in optionsBaseline" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogbaseLineVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBaseLineConfirmClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑轮班时间对话框 -->
    <div>
      <el-dialog v-dialogDrag title="编辑轮班时间" :visible.sync="dialogTimeVisible">
        <el-form ref="shiftTimeForm" :model="shiftTimeForm" :rules="shiftTimeRules">
          <el-form-item prop="beginTime" label="选择时间" :label-width="formLabelWidth">
            <el-time-picker v-model="shiftTimeForm.beginTime" arrow-control="true" format="HH:mm" value-format="HH:mm" is-range range-separator="|" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
          </el-form-item>
          <el-form-item prop="skill" label="选择技能" :label-width="formLabelWidth">
            <el-select v-model="shiftTimeForm.skill" clearable filterable placeholder="请选择">
              <el-option v-for="item in optionsSkill2" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTimeVisible = false">取 消</el-button>
          <el-button type="primary" @click="editTimeConfirmClick('shiftTimeForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 添加备注对话框 -->
    <div>
      <el-dialog v-dialogDrag title="添加备注" :visible.sync="dialogRemarksVisible">
        <el-form :model="formRemarks">
          <el-form-item label="添加备注：" :label-width="formLabelWidth">
            <el-input v-model="formRemarks.textarea" type="textarea" :rows="2" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRemarksVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRemarksConfirmClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 换班对话框 -->
    <div>
      <el-dialog v-dialogDrag title="编辑" :visible.sync="changeShift">
        <el-form ref="changeShiftForm" :model="changeShiftForm" :rules="rules">
          <el-form-item prop="value" label="请选择一人与之换班" :label-width="formLabelWidth">
            <el-tooltip class="item" content="只可与今日休息的员工换班" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>

            <el-select v-model="changeShiftForm.value" placeholder="请选择" filterable style="width: 40%" :no-data-text="NoDataText" :loading="offon" @visible-change="searchData" @change="personChange">
              <el-option v-for="item in optionsShiftPerson" :key="item.employeeId" :label="item.name" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">次日：{{ item.nextWorkBegin ? item.nextWorkBegin : '休息' }}--{{ item.nextWorkEnd ? item.nextWorkEnd : '休息' }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="changeShiftForm.showNext" prop="workTime" label="该人员下次轮班：" :label-width="formLabelWidth">
            <el-input v-model="changeShiftForm.workTime" type="text" style="width: 40%" :disabled="disabled" />
          </el-form-item>
          <el-form-item prop="exchangeReason" label="换 班 理 由" :label-width="formLabelWidth">
            <el-input v-model="changeShiftForm.exchangeReason" type="textarea" :rows="4" style="width: 60%" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changeShiftBtn">取 消</el-button>
          <el-button type="primary" @click="changeShiftConfirmClick('changeShiftForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 缺勤管理 -->
    <div>
      <el-dialog v-dialogDrag title="编辑" :visible.sync="absence">
        <el-form ref="absenceForm" :model="absenceForm" :rules="absenceRules">
          <el-form-item prop="absenceType" label="缺勤类型：" :label-width="formLabelWidth">
            <el-select v-model="absenceForm.absenceType" placeholder="请选择" filterable style="width: 40%">
              <el-option v-for="item in optionsAbsenceType" :key="item.absenceTypeId" :label="item.absenceName" :value="item.absenceTypeId">
                <span style="float: left">{{ item.absenceName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="radioValue" label="是否部分缺勤：" :label-width="formLabelWidth">
            <el-radio-group v-model="absenceForm.radioValue" @change="absenceChange">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="absenceForm.showAbsenceTime" prop="absenceTime" label="缺勤时间：" :label-width="formLabelWidth">
            <el-time-picker
              v-model="absenceForm.absenceTime"
              arrow-control="true"
              format="HH:mm"
              value-format="HH:mm"
              :picker-options="{ step: '00:30' }"
              is-range
              range-separator="|"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
          </el-form-item>
          <el-form-item prop="absenceReason" label="缺 勤 理 由：" :label-width="formLabelWidth">
            <el-input v-model="absenceForm.absenceReason" type="textarea" :rows="4" style="width: 60%" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="absence = false">取 消</el-button>
          <el-button type="primary" @click="absenceConfirmClick('absenceForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { initData } from '@/api/shiftType'
import { _debounce } from '@/utils'
import {
  shiftPerson,
  shiftTimeConfirm,
  restManagement,
  absenceTypeList,
  absenceManagement,
  modifyView,
  modifyViewConfirm,
  deleteAbsence,
  workTimeConfirm,
  //   siteIdList,
  skillIdList,
  roleIdList,
  orgList,
  searchTable,
  searchShiftCount,
  setBaselineButton,
  compareBaselineButton,
  teamData,
  multipleDelete,
  restManagementCheck
} from '@/api/shiftOverview'
import { initTable } from '@/apiNew/baselineType'
import Cookies from 'js-cookie'
// import dayjs from 'dayjs'
export default {
  name: 'Homepage',
  data() {
    var validateAbsenceTime = (rule, value, callback) => {
      if (this.absenceForm.radioValue === '1') {
        if (!value) {
          callback(new Error('请填写缺勤时间'))
        } else {
          callback()
        }
      }
    }
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.formSelect.time[1]).getTime() || time.getTime() < new Date(this.formSelect.time[0]).getTime() // 设置选择今天之前的日期（不能选择当天）
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.countEnd).getTime() || time.getTime() < new Date(this.countBegin).getTime() // 设置选择今天之前的日期（不能选择当天）
        }
      },
      airport: this.$store.state.user.airport,
      allSelected: [],
      boolValue: false,
      baselineRules: { mode: [{ required: true, message: '请选择模式', trigger: 'change' }], baselineType: [{ required: true, message: '请选择基线类型', trigger: 'change' }] },
      showBaseline: true,
      roleHide: true,
      dialogbaseLineVisible: false,
      multipleRowSelection: [],
      multipleColSelection: [],
      formBaseline: {},
      offon: true,
      businessDomainId: this.$route.query.businessDomainId || 0,
      optionsBaseline: [],
      optionsModeBaseline: [
        { id: 2, name: '全部时段' },
        { id: 1, name: '仅选中时段' }
      ],
      checkList: [],
      calendarId: '',
      showRole: false,
      NoDataText: '加载中',
      colValue: [],
      colsOptions: [
        { label: '角色', value: 1 },
        { label: '技能', value: 2 },
        { label: '组织', value: 3 }
      ],
      countDate: '',
      page: {
        currentPage4: 1,
        totalCount: 0,
        pageSize: 100
      },
      typeOptions: [
        { id: 1, name: '做五休二' },
        { id: 2, name: '做二休一' },
        { id: 3, name: '做一休一' }
      ],
      countDetail: {},
      shifCounttDetails: {},
      // moreCondition: '更多',
      emptyText: '正在加载',
      // tableHeight: window.innerHeight - 310,
      tableHeight: null,
      disabled: true,
      loading: true,
      shiftContent: '',
      shiftSkillList: '',
      nowEmployeeId: '',
      value1: '',
      zb: '',
      wanb: '',
      value2: true,
      spliShiftChecked: false,
      showRoleSkuchecked: false,
      isDisabled: true,
      colorData: {},
      // moreFilter: false,
      dialogTimeVisible: false,
      staffInformationDialog: false,
      dialogFormVisible: false,
      dialogRemarksVisible: false,
      changeShift: false,
      formLabelWidth: '180px',
      cols: [
        { prop: 'name', label: '姓名', type: 'noEdit' },
        { prop: 'sku', label: '编号', type: 'noEdit' },
        { prop: 'role', label: '角色', type: 'edit' },
        { prop: 'skill', label: '技能', type: 'noEdit' },
        { prop: 'orgnization', label: '组织', type: 'noEdit' }
      ],
      wb: '',
      yb: '',
      xx: '',
      tableData: [],
      formThead: [],
      optionsOrgnization: [],
      optionsRole: [],
      optionsSkill: [],
      optionsSkill2: [],
      optionsRealSite: [],
      formSelect: { time: [], baseline: '', orgnization: '' },
      formRole: {},
      shiftTimeForm: { beginTime: ['09:30', '18:30'], skill: '' },
      shiftTimeRules: {
        beginTime: [{ required: true, message: '请选择轮班时间', trigger: 'blur' }]
      },
      formRemarks: {},
      optionsShiftPerson: [],
      changeShiftForm: { showNext: false, value: '' },
      formInformation: {},
      rules: {
        value: [{ required: true, message: '请选择轮换人员', trigger: 'change' }]
      },
      absence: false,
      optionsAbsenceType: [],
      absenceForm: { showAbsenceTime: false, radioValue: '2' },
      employeeAbsenceId: '',
      optionsShiftType: [
        { value: '1', label: '早班' },
        { value: '2', label: '中班' },
        { value: '3', label: '晚班' },
        { value: '4', label: '夜班' },
        { value: '5', label: '休息' }
      ],
      absenceRules: {
        radioValue: [{ required: true, message: '请选择是否部分缺勤', trigger: 'change' }],
        absenceType: [{ required: true, message: '请选择缺勤类型', trigger: 'change' }],
        absenceTime: [{ validator: validateAbsenceTime, required: true, trigger: 'blur' }]
      },
      ischecked: false
    }
  },
  created() {
    this.initTable()
    this.orgList()
    this.absenceTypeList()
    // this.siteIdList()
    this.getOptionsBaseline()
    // this.siteIdList()
    // this.skillIdList()
    initData().then((res) => {
      if (res.code == 200) {
        res.data.forEach((item, i) => {
          if (item.shiftName === '早班') {
            this.zb = item.color
          }
          if (item.shiftName === '午班') {
            this.wb = item.color
          }
          if (item.shiftName === '晚班') {
            this.wanb = item.color
          }
          if (item.shiftName === '休息') {
            this.xx = item.color
          }

          if (item.shiftName === '夜班') {
            this.yb = item.color
          }
        })
      }
      // console.log(this.colorData, 121212)
    })
    // this.roleIdList()
  },
  methods: {
    // 组件的method方法
    renderHeader(h, para) {
      // 该列的绑定数据
      // console.log(para.column)
      // 列号
      // console.log(para.$index)
      return h('span', [
        h('el-checkbox', {
          props: { checked: this.ischecked },
          on: {
            change: ($event, column) => this.select($event, para.column.label)
          }
        }),
        h('span', para.column.label)
      ])
    },
    // 行选中方法
    handleSelectionChange(val) {
      this.multipleRowSelection = []
      val.forEach((item) => {
        this.multipleRowSelection.push(item.code)
      })
      // this.multipleRowSelection = val
      // console.log(this.multipleRowSelection)
    },
    // 行选中
    selectRow(flag, code) {
      if (flag) {
        this.multipleRowSelection.push(code)
      } else {
        if (this.multipleRowSelection.length) {
          this.multipleRowSelection.forEach((item, index) => {
            if (item === code) {
              this.multipleRowSelection.splice(index, 1)
            }
          })
        }
      }
    },
    // 列选中方法
    select(flag, label) {
      if (flag) {
        this.multipleColSelection.push(label)
      } else {
        if (this.multipleColSelection.length) {
          this.multipleColSelection.forEach((item, index) => {
            if (item === label) {
              this.multipleColSelection.splice(index, 1)
            }
          })
        }
      }
      // console.log(this.multipleColSelection, 222)
      // console.log(this.multipleRowSelection, 333)
    },
    // allSelect() {
    //   this.ischecked = true
    //   this.boolValue = true
    //   console.log(this.tableData, 'formThead')
    //   if (this.formThead.length) {
    //     this.formThead.forEach(item => {
    //       this.multipleRowSelection.push(item.workDate)
    //     })
    //   }
    //   if (this.tableData.length) {
    //     this.tableData.forEach(item => {
    //       this.multipleRowSelection.push(item.code)
    //     })
    //   }
    // },
    multiDeleteClick() {
      const data = {
        dates: this.multipleColSelection,
        codes: this.multipleRowSelection,
        airportId: this.airport.airportId
      }
      if (this.multipleRowSelection.length || this.multipleColSelection.length) {
        this.$confirm('是否删除已选中数据？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            multipleDelete(data)
              .then((response) => {
                this.$message.success('已删除')
                this.multipleColSelection = []
                this.multipleRowSelection = []
                this.formThead = []
                this.initTable()
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          })
          .catch(() => {})
      } else {
        this.$message.warning('请先选择数据')
      }
    },
    logJump() {
      this.$router.push({ path: '/prepare/changeLog' })
    },
    exportFile() {
      // if (this.formSelect.realSite) {
      var data = {
        startTime: this.countDate || null,
        endTime: this.countDate || null,
        organizationId: this.formSelect.orgnization || null,
        roleId: this.formSelect.role || null,
        employeeName: this.formSelect.staffName || null,
        employeeId: this.formSelect.staffSKu || null,
        skillId: this.formSelect.skill || null,
        airportId: this.airport.airportId
      }
      axios({
        method: 'post',
        url: '/prepare/api/v1/employees/calendars/export?businessDomainId=' + this.businessDomainId, // 请求地址
        headers: {
          Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
        },
        data: data, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      })
        .then((res) => {
          // 处理返回的文件流
          const content = res.data
          const blob = new Blob([content])
          const fileName = '员工日历.xlsx'
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
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
    },
    getOptionsBaseline() {
      initTable().then((response) => {
        this.optionsBaseline = response.data.data
      })
    },
    setBaseline() {
      if (this.$refs['formBaseline']) {
        this.$refs['formBaseline'].resetFields()
      }
      if (this.formSelect.orgnization) {
        this.formBaseline = {}
        this.dialogbaseLineVisible = true
      } else {
        this.$message.warning('请先选择组织')
      }
    },
    addBaseLineConfirmClick() {
      // 设置基线确定按钮
      this.$refs['formBaseline'].validate((valid) => {
        if (valid) {
          this.$confirm('可能会覆盖历史基线数据，是否继续？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          })
            .then(() => {
              var data = {
                startTime: this.countDate || null,
                endTime: this.countDate || null,
                organizationId: this.formSelect.orgnization || null,
                roleId: this.formSelect.role || null,
                employeeName: this.formSelect.staffName || null,
                employeeId: this.formSelect.staffSKu || null,
                skillId: this.formSelect.skill || null,
                baselineTypeId: this.formBaseline.baselineType,
                baselineStyle: this.formBaseline.mode,
                pageSize: this.page.pageSize,
                pageNum: this.page.currentPage4,
                airportId: this.airport.airportId
              }
              setBaselineButton(data)
                .then((response) => {
                  this.$message.success('设置成功')
                  this.dialogbaseLineVisible = false
                })
                .catch((e) => {
                  this.$message({
                    type: 'error',
                    message: e.response.data.message
                  })
                })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    teaminit() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.headerFilter.getBoundingClientRect().top - 95
      })
      // init
      this.formThead = []
      this.loading = true
      var data = {
        startTime: this.formSelect.time ? this.formSelect.time[0] : null,
        endTime: this.formSelect.time ? this.formSelect.time[1] : null,
        organizationId: this.formSelect.orgnization || null,
        roleId: this.formSelect.role || null,
        employeeName: this.formSelect.staffName || null,
        employeeCode: this.formSelect.employeeCode || null,
        skillId: this.formSelect.skill || null,
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage4,
        airportId: this.airport.airportId
      }
      teamData(data).then((response) => {
        if (response.code === '200') {
          if (response.data) {
            this.emptyText = '正在加载'
            if (this.formSelect.time.length === 0) {
              this.formSelect.time.push(response.data.dateFrom, response.data.dateTo)
            }
            this.countDetail = response.data.statsInfo
            if (response.data.list.length > 0) {
              if (response.data.list[0].dailyWorkBeans) {
                response.data.list[0].dailyWorkBeans.forEach((element) => {
                  this.formThead.push(element)
                })
                this.countBegin = response.data.list[0].dailyWorkBeans[0].workDate
                this.countEnd = response.data.list[0].dailyWorkBeans[response.data.list[0].dailyWorkBeans.length - 1].workDate
                // this.countDate = this.countBegin
              } else {
                this.$message({
                  type: 'success',
                  message: '暂无数据'
                })
                this.loading = false
              }
              this.tableData = response.data.list
              this.page.totalCount = response.data.total
              this.loading = false
            } else {
              this.$message.success('暂无数据')
              this.loading = false
              this.emptyText = '暂无数据'
            }
          } else {
            this.emptyText = '暂无数据'
          }
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
        // this.searchShiftCount()
      })
    },
    offonClick() {
      if (!this.value2) {
        this.tableData = []
        this.formThead = []
        this.loading = true
        var data = {
          startTime: this.formSelect.time ? this.formSelect.time[0] : null,
          endTime: this.formSelect.time ? this.formSelect.time[1] : null,
          organizationId: this.formSelect.orgnization || null,
          roleId: this.formSelect.role || null,
          employeeName: this.formSelect.staffName || null,
          employeeCode: this.formSelect.employeeCode || null,
          skillId: this.formSelect.skill || null,
          pageSize: this.page.pageSize,
          pageNum: this.page.currentPage4,
          airportId: this.airport.airportId
        }
        if (!data.startTime && !data.endTime && !data.organizationId && !data.roleId && !data.employeeName && !data.employeeCode && !data.skillId) {
          this.teaminit()
        } else {
          teamData(data).then((response) => {
            if (response.data.code === '200') {
              this.emptyText = '正在加载'
              this.page.totalCount = response.data.data.total
              if (response.data.data.list.length) {
                response.data.data.list[0].dailyWorkBeans.forEach((element) => {
                  this.formThead.push(element)
                })
                this.tableData = response.data.data.list
                this.countBegin = response.data.data.list[0].dailyWorkBeans[0].workDate
                this.countEnd = response.data.data.list[0].dailyWorkBeans[response.data.data.list[0].dailyWorkBeans.length - 1].workDate
                // this.countDate = response.data.data.list[0].dailyWorkBeans[0].workDate
              } else {
                this.emptyText = '暂无数据'
              }
              this.loading = false
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
            this.searchShiftCount()
          })
        }
      } else {
        this.initTable()
      }
    },
    compareBaseline() {
      // 比较基线
      // if (this.formSelect.baseline.toString()) {
      this.tableData = []
      this.formThead = []
      var data = {
        startTime: this.countDate || null,
        endTime: this.countDate || null,
        organizationId: this.formSelect.orgnization || null,
        roleId: this.formSelect.role || null,
        employeeName: this.formSelect.staffName || null,
        employeeId: this.formSelect.staffSKu || null,
        skillId: this.formSelect.skill || null,
        baselineTypeId: this.formSelect.baseLine,
        // baselineStyle: this.formSelect.mode,
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage4,
        airportId: this.airport.airportId
      }
      compareBaselineButton(data)
        .then((response) => {
          if (response.data.data) {
            var data = response.data.data
            this.emptyText = '正在加载'
            if (this.formSelect.time.length === 0) {
              this.formSelect.time.push(data.dateFrom, data.dateTo)
            }
            if (this.formSelect.baseLine) {
              this.formSelect.time = [data.dateFrom, data.dateTo]
            }
            this.countDetail = data.statsInfo
            if (data.list.length > 0) {
              if (data.list[0].items) {
                data.list[0].items.forEach((element) => {
                  this.formThead.push(element)
                })
                this.countBegin = data.list[0].items[0].workDate
                this.countEnd = data.list[0].items[data.list[0].items.length - 1].workDate
                this.countDate = this.countBegin
                // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop
              } else {
                this.$message({
                  type: 'success',
                  message: '暂无数据'
                })
                this.loading = false
              }
              this.tableData = data.list
              this.page.totalCount = data.total
              this.loading = false
            } else {
              this.$message.success('暂无数据')
              this.loading = false
              this.emptyText = '暂无数据'
            }
          } else {
            this.emptyText = '暂无数据'
          }
          this.showBaseline = false
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.response.data.message
          })
        })
      // } else {
      //   this.$message.warning('请先选择基线')
      // }
    },
    compareHideBaseline() {
      this.tableData.forEach((element) => {
        element.baseLineBeans = null
      })
      this.showBaseline = true
    },
    roleShow() {
      this.showRole = true
      this.roleHide = false
    },
    hideRole() {
      this.showRole = false
      this.roleHide = true
    },
    countDateChanged(val) {
      this.searchShiftCount()
    },
    searchShiftCount() {},
    // searchShiftCount() {
    //   var data = {
    //     beginDate: this.countDate || null,
    //     endTime: this.countDate || null,
    //     organizationId: this.formSelect.orgnization || null,
    //     roles: this.formSelect.role || null,
    //     name: this.formSelect.staffName || null,
    //     code: this.formSelect.employeeCode || null,
    //     skills: this.formSelect.skill || null,
    //     pageSize: this.page.pageSize,
    //     pageNum: this.page.currentPage4
    //   }
    //   searchShiftCount(data)
    //     .then(response => {
    //       this.shifCounttDetails = response.data.data
    //     })
    //     .catch(e => {
    //       this.$message({
    //         type: 'error',
    //         message: e.response.data.message
    //       })
    //     })
    // },
    initTable() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.headerFilter.getBoundingClientRect().top - 95
      })
      // init
      // this.formThead = []
      this.loading = true
      var data = {
        beginDate: this.formSelect.time ? this.formSelect.time[0] : null,
        endDate: this.formSelect.time ? this.formSelect.time[1] : null,
        organizationId: this.formSelect.orgnization || null,
        roles: this.formSelect.role || null,
        name: this.formSelect.staffName || null,
        code: this.formSelect.employeeCode || null,
        skills: this.formSelect.skill || null,
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage4,
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      searchTable(data).then((response) => {
        if (response.data.code === '200') {
          if (response.data.data) {
            this.shifCounttDetails = response.data.data.statsInfo.totalShift
            this.emptyText = '正在加载'
            if (this.formSelect.time.length === 0) {
              this.formSelect.time.push(response.data.data.dateFrom, response.data.data.dateTo)
            }
            this.countDetail = response.data.data.statsInfo
            if (response.data.data.list.length > 0) {
              if (response.data.data.list[0].items) {
                response.data.data.list[0].items.forEach((element) => {
                  this.formThead.push(element)
                })
                this.countBegin = response.data.data.list[0].items[0].workDate
                this.countEnd = response.data.data.list[0].items[response.data.data.list[0].items.length - 1].workDate
                // this.countDate = this.countBegin
              } else {
                this.$message({
                  type: 'success',
                  message: '暂无数据'
                })
                this.loading = false
              }
              this.tableData = response.data.data.list
              if (this.tableData.length != 0) {
                this.tableData.forEach((item) => {
                  if (item.skills.length != 0) {
                    item.skillsHandled = item.skills.reduce((pre, cur, index) => {
                      if (index != item.skills.length - 1) {
                        return pre + cur.name + ','
                      } else {
                        return pre + cur.name
                      }
                    }, '')
                  }
                  if (item.roles.length != 0) {
                    item.rolesHandled = item.roles.reduce((pre, cur, index) => {
                      if (index != item.roles.length - 1) {
                        return pre + cur.name + ','
                      } else {
                        return pre + cur.name
                      }
                    }, '')
                  }
                })
              }
              this.page.totalCount = response.data.data.total
              this.loading = false
            } else {
              this.$message.success('暂无数据')
              this.loading = false
              this.emptyText = '暂无数据'
              //   this.countDate = this.formSelect.time[0]
            }
          } else {
            this.emptyText = '暂无数据'
          }
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
        this.searchShiftCount()
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      if (this.formSelect.baseLine) {
        this.compareBaseline()
      } else {
        this.initTable()
      }
    },
    handleCurrentChange(val) {
      this.page.currentPage4 = val
      if (this.formSelect.baseLine) {
        this.compareBaseline()
      } else {
        this.tableData = []
        this.formThead = []
        this.initTable()
      }
    },
    absenceTypeList() {
      const data = {
        airportId: this.airport.airportId
      }
      absenceTypeList(data).then((response) => {
        if (response.code === '200') {
          this.optionsAbsenceType = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    // 初始化站点下拉
    // siteIdList() {
    //   siteIdList().then(response => {
    //     if (response.code === '200') {
    //       this.optionsRealSite = [response.data]
    //       this.$nextTick(() => {
    //         this.formSelect.realSite = this.optionsRealSite[0].siteId
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: response.message
    //       })
    //     }
    //   })
    // },
    // 角色下拉初始化
    roleIdList() {
      const data = {
        airportId: this.airport.airportId
      }
      roleIdList(data).then((response) => {
        if (response.code === '200') {
          this.optionsRole = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    // 技能下拉初始化
    skillIdList() {
      var data = {
        orgnization: this.formSelect.orgnization || '',
        businessDomainId: this.businessDomainId,
        airportId: this.airport.airportId
      }
      skillIdList(data).then((response) => {
        if (response.code === '200') {
          this.optionsSkill = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    // 组织下拉初始化
    orgList() {
      const data = {
        airportId: this.airport.airportId,
        businessDomainId: this.businessDomainId
      }
      orgList(data).then((response) => {
        if (response.code === '200') {
          this.formSelect.orgnization = response.data[0].organizationId
          this.optionsOrgnization = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    // 显示角色编码
    showRoleSkuClick(e) {
      if (e === true) {
        this.cols.push({ prop: 'roleSku', label: '角色编码', type: 'noEdit' })
      } else {
        this.cols.pop({ prop: 'roleSku', label: '角色编码' })
      }
    },
    // 重新分类
    recategoryClick() {},
    // 编辑轮班dialog中的checkbox，是否选择分段轮班
    splitShiftDisabled(e) {
      if (e === true) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 查询按钮

    onSubmit: _debounce(function(_type, index, item) {
      this.formThead = []
      // this.multipleRowSelection = []
      this.multipleColSelection = []
      if (this.value2) {
        // this.tableData = []
        // this.formThead = []
        this.loading = true
        var data = {
          beginDate: this.formSelect.time ? this.formSelect.time[0] : null,
          endDate: this.formSelect.time ? this.formSelect.time[1] : null,
          organizationId: this.formSelect.orgnization || null,
          roles: this.formSelect.role || null,
          name: this.formSelect.staffName || null,
          code: this.formSelect.employeeCode || null,
          skills: this.formSelect.skill || null,
          pageSize: this.page.pageSize,
          pageNum: this.page.currentPage4,
          businessDomainId: this.businessDomainId,
          airportId: this.airport.airportId
        }
        if (!data.startTime && !data.endDate && !data.organizationId && !data.roleId && !data.employeeName && !data.employeeCode && !data.skillId) {
          this.initTable()
        } else {
          searchTable(data).then((response) => {
            if (response.data.code === '200') {
              this.emptyText = '正在加载'
              this.shifCounttDetails = response.data.data.statsInfo.totalShift
              this.page.totalCount = response.data.data.total
              this.countDetail = response.data.data.statsInfo
              const theadList = []
              if (response.data.data.list.length > 0) {
                response.data.data.list[0].items.forEach((element) => {
                  theadList.push(element)
                })
                this.formThead = theadList
                // this.tableData = []
                this.tableData = response.data.data.list
                if (this.tableData.length != 0) {
                  this.tableData.forEach((item) => {
                    if (item.skills.length != 0) {
                      item.skillsHandled = item.skills.reduce((pre, cur, index) => {
                        if (index != item.skills.length - 1) {
                          return pre + cur.name + ','
                        } else {
                          return pre + cur.name
                        }
                      }, '')
                    }
                    if (item.roles.length != 0) {
                      item.rolesHandled = item.roles.reduce((pre, cur, index) => {
                        if (index != item.roles.length - 1) {
                          return pre + cur.name + ','
                        } else {
                          return pre + cur.name
                        }
                      }, '')
                    }
                  })
                }
                this.countBegin = response.data.data.list[0].items[0].workDate
                this.countEnd = response.data.data.list[0].items[response.data.data.list[0].items.length - 1].workDate
                // this.countDate = response.data.data.list[0].items[0].workDate
              } else {
                this.tableData = []
                this.emptyText = '暂无数据'
                // this.countDate = this.formSelect.time[0]
              }
              this.loading = false
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
            this.searchShiftCount()
          })
        }
      } else {
        this.tableData = []
        this.formThead = []
        this.loading = true
        var data1 = {
          startTime: this.formSelect.time ? this.formSelect.time[0] : null,
          endDate: this.formSelect.time ? this.formSelect.time[1] : null,
          organizationId: this.formSelect.orgnization || null,
          roleId: this.formSelect.role || null,
          employeeName: this.formSelect.staffName || null,
          employeeCode: this.formSelect.employeeCode || null,
          skillId: this.formSelect.skill || null,
          pageSize: this.page.pageSize,
          pageNum: this.page.currentPage4,
          airportId: this.airport.airportId
        }
        if (!data1.startTime && !data1.endDate && !data1.organizationId && !data1.roleId && !data1.employeeName && !data1.employeeCode && !data1.skillId) {
          this.teaminit()
        } else {
          teamData(data1).then((response) => {
            if (response.code === '200') {
              this.emptyText = '正在加载'
              this.page.totalCount = response.data.data.total
              if (response.data.list.length) {
                response.data.list[0].dailyWorkBeans.forEach((element) => {
                  this.formThead.push(element)
                })
                this.tableData = response.data.list
                this.countBegin = response.data.list[0].dailyWorkBeans[0].workDate
                this.countEnd = response.data.list[0].dailyWorkBeans[response.data.list[0].dailyWorkBeans.length - 1].workDate
                // this.countDate = response.data.list[0].dailyWorkBeans[0].workDate
              } else {
                this.emptyText = '暂无数据'
              }
              this.loading = false
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
            this.searchShiftCount()
          })
        }
      }
    }, 1000),

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.tableData = []
      this.initTable()
    },
    // 修改角色对话框
    cellRoleClick(index, row) {
      this.formRole.role = row.role
      this.dialogFormVisible = true
    },
    // 修改角色对话框的确定按钮
    roleEditClick() {
      var index = localStorage.getItem('tableIndex')
      // this.$refs.selection.selectedLabel获取select框的选中值
      this.tableData[index].role = this.$refs.selection.selectedLabel
      this.tableData[index].skill = 'kdkdkdk'
      this.dialogFormVisible = false
    },
    // 编辑轮班时间
    editTimeClick(index, row, content) {
      this.optionsSkill2 = row.skills
      this.shiftContent = content
      this.shiftSkillList = row
      this.shiftTimeForm.beginTime = [content.beginTime ? content.beginTime.substring(10, 16) : '09:30', content.endTime ? content.endTime.substring(10, 16) : '18:30']
      this.dialogTimeVisible = true
    },
    // 编辑轮班时间确认按钮

    editTimeConfirmClick: _debounce(function(formName, index, item) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            id: this.shiftContent.id,
            workDate: this.shiftContent.workDate.split(' ')[0],
            beginTime: this.shiftTimeForm.beginTime[0],
            endTime: this.shiftTimeForm.beginTime[1],
            skillId: this.shiftTimeForm.skill,
            airportId: this.airport.airportId
          }
          workTimeConfirm(data).then((response) => {
            if (response.data.code === '200') {
              this.$message({
                type: 'success',
                message: '操作成功！'
              })
              if (this.formSelect.baseLine) {
                this.compareBaseline()
              } else {
                this.onSubmit()
              }
              // this.initTable()
              this.shiftContent = ''
              this.shiftSkillList = ''
              this.dialogTimeVisible = false
              this.$refs[formName].resetFields()
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
          })
        }
      })
    }, 1000),
    // 设置为休息前的校验
    restClick(index, row, content) {
      // console.log(content, row, 210)
      const data = {
        id: content.id,
        date: content.workDate.split(' ')[0],
        airportId: this.airport.airportId
      }
      this.$confirm('此操作会将当前轮班设置为休息状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data1 = {
            employeeCode: content.employeeCode,
            day: content.workDate.split(' ')[0],
            airportId: this.airport.airportId
          }
          restManagementCheck(data1)
            .then((response) => {
              if (response.data.code === '200') {
                if (!response.data.data) {
                  this.restClickSave(data)
                } else {
                  this.$confirm(response.data.data + '，是否继续该操作？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否'
                  })
                    .then(() => {
                      this.restClickSave(data)
                    })
                    .catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消操作'
                      })
                    })
                }
              }
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.response.data.message || '服务器错误'
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
    // 确定设置为休息的接口
    restClickSave(data) {
      data.airportId = this.airport.airportId
      restManagement(data).then((response) => {
        if (response.data.code === '200') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          if (this.formSelect.baseLine) {
            this.compareBaseline()
          } else {
            this.onSubmit()
          }
          // this.initTable()
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          })
        }
      })
    },
    // 缺勤管理
    absenceManagement(index, row, content) {
      this.absence = true
      this.absenceForm = { showAbsenceTime: false, radioValue: '2' }
      this.shiftContent = content
      this.shiftSkillList = row
      this.employeeAbsenceId = ''
      if (content.absenceCode) {
        var data = {
          id: content.absenceList[0].id,
          airportId: this.airport.airportId
        }
        modifyView(data).then((response) => {
          if (response.data.code === '200') {
            this.employeeAbsenceId = response.data.data.id
            if (response.data.data.absenceCode === 1) {
              var timeRange = []
              timeRange.push(response.data.data.beginTime, response.data.data.endTime)
              this.absenceForm = Object.assign(
                {},
                { showAbsenceTime: true, absenceType: response.data.data.absenceTypeId, absenceTime: timeRange, radioValue: response.data.data.absenceCode.toString(), absenceReason: response.data.data.absenceReason }
              )
            } else {
              this.absenceForm = Object.assign({}, { showAbsenceTime: false, absenceType: response.data.data.absenceTypeId, radioValue: response.data.data.absenceCode.toString(), absenceReason: response.data.data.absenceReason })
            }
          } else {
            this.$message({
              type: 'error',
              message: response.data.message
            })
          }
        })
      }
    },
    absenceChange(e) {
      if (e === '1') {
        this.absenceForm.showAbsenceTime = true
      } else {
        this.absenceForm.showAbsenceTime = false
      }
    },
    // 编辑缺勤确认框
    absenceConfirmClick(formName) {
      var data = {}
      if (this.absenceForm.radioValue === '1') {
        data = {
          absenceCode: this.absenceForm.radioValue,
          id: this.shiftContent.absenceList.length ? this.shiftContent.absenceList[0].id : '',
          organizationId: this.shiftSkillList.organizationId,
          approveCode: this.shiftContent.employeeCode,
          AbsenceDate: this.shiftContent.workDate,
          employeeCode: this.shiftContent.employeeCode,
          absenceTypeId: this.absenceForm.absenceType,
          absenceReason: this.absenceForm.absenceReason,
          beginTime: this.absenceForm.absenceTime ? this.absenceForm.absenceTime[0] : '',
          endTime: this.absenceForm.absenceTime ? this.absenceForm.absenceTime[1] : '',
          calendarId: this.shiftContent.id,
          airprotId: this.airport.airportId
        }
      } else {
        data = {
          absenceCode: this.absenceForm.radioValue,
          id: this.shiftContent.absenceList.length ? this.shiftContent.absenceList[0].id : '',
          organizationId: this.shiftSkillList.organizationId,
          approveCode: this.shiftContent.employeeCode,
          AbsenceDate: this.shiftContent.workDate,
          employeeCode: this.shiftContent.employeeCode,
          absenceTypeId: this.absenceForm.absenceType,
          absenceReason: this.absenceForm.absenceReason,
          calendarId: this.shiftContent.id,
          airportId: this.airport.airportId
        }
      }
      this.$refs['absenceForm'].validate((valid) => {
        if (valid) {
          if (this.shiftContent.absenceCode) {
            modifyViewConfirm(data)
              .then((response) => {
                if (response.data.code === '200') {
                  this.shiftContent = ''
                  this.shiftSkillList = ''
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.absence = false
                  if (this.formSelect.baseLine) {
                    this.compareBaseline()
                  } else {
                    this.initTable()
                  }
                  // this.initTable()
                } else {
                  this.$message({
                    type: 'error',
                    message: response.message
                  })
                }
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          } else {
            absenceManagement(data)
              .then((response) => {
                if (response.data.code === '200') {
                  this.absence = false
                  this.shiftContent = ''
                  this.shiftSkillList = ''
                  this.$refs.absenceForm.resetFields()
                  this.$message({
                    type: 'success',
                    message: '操作成功！'
                  })
                  if (this.formSelect.baseLine) {
                    this.compareBaseline()
                  } else {
                    this.onSubmit()
                  }
                  // this.initTable()
                } else {
                  this.$message({
                    type: 'error',
                    message: response.data.message
                  })
                }
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        }
      })
    },
    // 添加备注
    addRemarkClick(index, row) {
      this.dialogRemarksVisible = true
    },
    // 排序
    sortChange(column) {
      var data = []
      var data1 = []
      for (let j = 0; j < this.tableData.length; j++) {
        for (let k = 0; k < this.tableData[j].items.length; k++) {
          if (column.column.label === this.tableData[j].items[k].workDate) {
            if (this.tableData[j].items[k].beginTime) {
              data.unshift(this.tableData[j])
            } else {
              data1.push(this.tableData[j])
            }
          }
        }
      }
      if (column.order === 'ascending') {
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            for (let k = 0; k < data[i].items.length; k++) {
              if (column.column.label === data[i].items[k].workDate) {
                if (data[i].items[k].beginTime) {
                  var val1 = new Date(data[i].items[k].beginTime)
                  var val2 = new Date(data[j].items[k].beginTime)
                  if (val1.getTime() > val2.getTime()) {
                    var temp = data[i]
                    data[i] = data[j]
                    data[j] = temp
                  }
                }
              }
            }
          }
        }
      } else if (column.order === 'descending') {
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            for (let k = 0; k < data[i].items.length; k++) {
              if (column.column.label === data[i].items[k].workDate) {
                if (data[i].items[k].beginTime) {
                  var val3 = new Date(data[i].items[k].beginTime)
                  var val4 = new Date(data[j].items[k].beginTime)
                  if (val3.getTime() < val4.getTime()) {
                    var temp1 = data[i]
                    data[i] = data[j]
                    data[j] = temp1
                  }
                }
              }
            }
          }
        }
      }
      this.tableData = data.concat(data1)
    },
    // 添加备注确定按钮
    addRemarksConfirmClick() {
      this.dialogRemarksVisible = false
    },
    open(index, row) {
      const h = this.$createElement
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '内容可以是 '), h('i', { style: 'color: teal' }, 'VNode')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
    },
    showPartAbsence(index, row) {
      row.dateData.partAbsence = true
      row.dateData.remark = false
    },
    hidePartAbsence(index, row) {
      row.dateData.partAbsence = false
      row.dateData.remark = true
    },
    // partAbsenceClick(index, row) {
    //   this.dialogPartAbsenceVisible = true
    // },
    async changeShiftClick(index, row, content) {
      this.offon = true
      this.shiftSkillList = row
      this.shiftContent = content
      this.NoDataText = '加载中'
      this.optionsShiftPerson = []
      this.changeShift = true
      await this.shiftPerson()
    },
    searchData(val) {
      if (this.optionsShiftPerson.length) {
        this.offon = false
      }
    },
    // editPartAbsenceClick(index, row) {
    //   this.dialogPartAbsenceVisible = true
    // },
    changeShiftConfirmClick(formName) {
      var data = {
        employeeCode: this.shiftSkillList.code,
        exchangeDate: this.shiftContent.workDate,
        exchangedEmployeeCode: this.changeShiftForm.value,
        exchangeReason: this.changeShiftForm.exchangeReason,
        organizationId: this.shiftContent.organizationId,
        approveCode: this.shiftSkillList.code,
        calendarId: this.shiftContent.id,
        exchangedCalendarId: this.calendarId,
        airportId: this.airport.airportId
      }
      this.$refs['changeShiftForm'].validate((valid) => {
        if (valid) {
          shiftTimeConfirm(data).then((response) => {
            if (response.data.code === '200') {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.nowEmployeeId = ''
              this.shiftSkillList = ''
              this.shiftContent = ''
              this.optionsShiftPerson = []
              this.changeShift = false
              this.changeShiftForm.showNext = false
              this.$refs[formName].resetFields()
              if (this.formSelect.baseLine) {
                this.compareBaseline()
              } else {
                this.initTable()
              }
              // this.initTable()
            } else {
              this.$message({
                type: 'error',
                message: response.message
              })
            }
          })
        }
      })
    },
    deleteShiftClick(index, row) {
      row.dateData = ''
    },
    deleteAbsenceClick(index, row, content) {
      var data = {
        id: content.absenceList[0].id,
        airportId: this.airport.airportId
      }
      this.$confirm('此操作会将当前缺勤信息删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAbsence(data).then((response) => {
            if (response.data.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initTable()
            } else {
              this.$message({
                type: 'error',
                message: response.data.message
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    changeShiftBtn() {
      this.changeShift = false
      this.changeShiftForm.value = ''
      this.changeShiftForm.showNext = false
      this.changeShiftForm.workTime = ''
    },
    // 列双击事件
    detailShow(index, row, e) {
      this.dialogRemarksVisible = true
    },
    shiftPerson() {
      return new Promise((resolve, reject) => {
        var skillIds = []
        this.shiftSkillList.skills.forEach((element) => {
          skillIds.push(element.id)
        })
        var data = {
          skillId: skillIds,
          date: this.shiftContent.workDate.split(' ')[0] || '',
          airportId: this.airport.airportId
        }
        shiftPerson(data).then((response) => {
          // if (response.code === '200') {

          if (response.data.data.length) {
            this.optionsShiftPerson = response.data.data
          } else {
            this.NoDataText = '今日无员工休息，无人可换班'
          }
          this.offon = false
          resolve()
          // } else {
          //   this.$message({
          //     type: 'error',
          //     message: response.message
          //   })
          // }
        })
      })
    },
    personChange(e) {
      this.changeShiftForm.showNext = true
      this.optionsShiftPerson.forEach((item) => {
        if (item.id === e) {
          this.changeShiftForm.workTime = item.nextWorkBegin + '--' + item.nextWorkEnd
          this.calendarId = item.calendarId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-style /deep/ td,
tr,
th {
  text-align: left;
}
.table-style /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.cols {
  display: inline-block;
  // text-align: left;
  width: 100%;
  span {
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    margin-right: 20px;
    ins {
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
    }
    ins.zb {
      background: #5677d5;
    }
    ins.zb2 {
      background: #d8a738;
    }
    ins.wb {
      background: #a168ff;
    }
    ins.xx {
      background: #666;
    }
    ins.yb {
      background: #000;
    }
    ins.bky {
      background: red;
    }
    ins.wpb {
      background: #a29c9c;
    }
  }
}
.col-padding {
  width: 100%;
  padding: 5px 0 0 5px;
  background: #151c3a;
}
.table-style {
  width: 100%;
  /* overflow: auto; */
}
.name-wrapper {
  cursor: pointer;
}
.condition-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 3px 0 3px;
  border-bottom: 1px solid #434b61;
}
.select {
  margin-left: 10px;
}
.header-filter {
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  // border-bottom: 1px solid #434b61;
  // margin-bottom: 20px;
}
.icon-style {
  position: relative;
  width: 24px;
  height: 17px;
  line-height: 13px;
  margin: -8% auto;
  text-align: center;
  box-sizing: border-box;
  padding: 2px;
  background-color: rgb(77, 77, 77);
  border-radius: 3px;
}
.edit-remark {
  position: absolute;
  left: 0;
}
.more {
  display: inline-block;
  width: 50px;
  height: 30px;
  line-height: 20px;
  margin-right: 20px;
  text-align: center;
  font-size: 12px;
  box-sizing: border-box;
  padding: 5px 0;
  border: 1px solid #434b61;
  color: #666666;
  border-radius: 5px;
  cursor: pointer;
}
.moreFilterBox {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  // border-top: 1px solid #434b61;
}
.all-edit {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: rgb(104, 134, 44);
  border: 1px solid #ecd4d4;
  font-size: 12px;
}
.rest-style {
  background: #666666;
  border-radius: 5px;
  text-align: center;
}
.no-work {
  background: #a29c9c;
}
.block {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  font-size: 13px;
}
.detail-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 15px;
}
.name-style:hover {
  color: #5677d5;
}
.redone span {
  color: red;
}
.margin-count {
  margin-top: 3px;
  text-align: center;
}
</style>
