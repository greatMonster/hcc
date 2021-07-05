<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <span style="padding-left: 20px;">
          <label>航站楼&nbsp;&nbsp;&nbsp;</label>
          <el-select v-model="siteId" placeholder="请选择" style="width:150px" size="small">
            <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </span>
        <span style="padding-left: 20px;">
          <el-button type="primary" size="small" @click="search2">查 询</el-button>
        </span>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="editableTabsValue" type="card" @edit="handleTabsEdit" @tab-click="paneClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.id" v-loading="bloading" :label="item.code" :name="item.id">
          <div class="addButton">
            <span>{{ item.code }} 共 {{ item.desks?item.desks.length:'0' }}柜台</span>
            <el-button type="primary" size="small" @click="addSkillClick('formEdit')">新增柜台</el-button>
          </div>
          <el-table :data="item.desks? item.desks: []" border stripe :max-height="tableHeight" row-key="id" class="aaa">
            <el-table-column prop="code" label="编号" min-width="100" />
            <el-table-column prop="name" label="名称" min-width="400">
              <template slot-scope="scope">
                <div v-if="scope.row.name">
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="openType" label="开放类型" width="100">
              <template slot-scope="scope">
                <div>
                  <el-popover v-if="scope.row.openTimes" trigger="hover" placement="right">
                    <div>
                      开放时间段：
                      <div style="padding-left:10px">
                        <div v-for="(item2, index2) in scope.row.openTimes" :key="index2">{{ item2.beginTime }} - {{ item2.endTime }}</div>
                      </div>
                    </div>
                    <div slot="reference" class="name-wrapper">{{ scope.row.openType == 1?"动态":"常开" }}</div>
                  </el-popover>
                  <div v-else>{{ scope.row.openType == 1?"动态":"常开" }}</div>
                </div>
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column prop="serviceTypeName" label="服务类型" min-width="80" />
            <el-table-column prop="region" label="国内/国际" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.region=='D'">国内</span>
                <span v-if="scope.row.region=='I'">国际</span>
                <span v-if="scope.row.region=='D/I'">国内/国际</span>
              </template>
            </el-table-column>
            <el-table-column prop="serviceType" label="高端/经济" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.serviceType=='V'">高端</span>
                <span v-if="scope.row.serviceType=='C'">经济</span>
                <span v-if="scope.row.serviceType=='C/V'">经济/高端</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
                <el-button type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 值机岛名dialog -->
    <div>
      <el-dialog v-dialogDrag :title="titleLand" :visible.sync="landDialogVisible" width="40%" :before-close="cancelAddLand">
        <el-form ref="formLandEdit" :label-position="labelPosition" :model="formLandEdit" :rules="rulesLand" label-width="57px">
          <el-form-item prop="landCode" label="编号">
            <el-input v-model="formLandEdit.landCode" placeholder="请输入" maxlength="10" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" size="small" @click="cancelAddLand">取 消</el-button>
          <el-button type="primary" size="small" @click="handleLandEditClick('formLandEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改技能弹框 -->
    <div class="controlDialog">
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="50%" :before-close="cancelEditClick" class="dialog-form">
        <el-form ref="formEdit" :model="formEdit" :label-position="labelPosition" :rules="rules" label-width="95px">
          <el-form-item prop="code" label="编号">
            <el-input v-model="formEdit.code" type="text" :disabled="codeDisable" placeholder="请输入" maxlength="10" style="width:100%" @change="autoName" />
          </el-form-item>
          <el-form-item prop="name" label="名称">
            <el-input v-model="formEdit.name" placeholder="请输入" maxlength="100" style="width:100%" />
          </el-form-item>
          <el-form-item prop="landName" label="属于">
            <el-input v-model="formEdit.landName" type="text" placeholder="请输入" style="width:100%" disabled />
          </el-form-item>
          <el-form-item prop="openType" label="开放类型">
            <el-select v-model="formEdit.openType" placeholder="请选择" style="width:100%" @change="openTypeChange">
              <el-option v-for="item in openType" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isAlways" prop="times" label="开放时间" :label-width="formLabelWidth">
            <el-time-picker v-model="initTime" arrow-control="true" format="HH:mm" value-format="HH:mm" is-range range-separator="-" start-placeholder="开始时间" style="width:80%" end-placeholder="结束时间" placeholder="选择时间范围" />
            <el-button type="primary" size="small" @click="addTimeList">添加</el-button>
            <div v-for="(item,index) in times" :key="index" style="margin:10px 0">
              <el-time-picker v-model="item.time" arrow-control="true" format="HH:mm" value-format="HH:mm" is-range range-separator="-" style="width:80%" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
              <el-button type="primary" size="small" @click="deleteTimeList(index)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="region" label="国内/国际">
            <region :region="formEdit.region" style="width:100%" @changeClick="regionChange" />
          </el-form-item>
          <el-form-item prop="serviceType" label="高端/经济">
            <service-type :service="formEdit.serviceType" style="width:100%" @changeServiceClick="serviceTypeChange" />
          </el-form-item>
          <el-form-item prop="serviceTypeId" label="服务类型">
            <el-select v-model="formEdit.serviceTypeId" placeholder="请选择" style="width:100%">
              <el-option v-for="item in serviceOption" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" size="small" @click="cancelEditClick">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { initData as terminalData } from '@/api/terminal'
import { initData, addDesk, setDesk, removedesk, removeIsland, addIsland, setSearchDesk, Dragfcn, selectData } from '@/api/basecheckinData'
import Region from '@/components/commenSelect/region'
import serviceType from '@/components/commenSelect/serviceType'
export default {
  name: 'CheckInData',
  components: {
    Region,
    serviceType
  },
  data() {
    return {
      labelPosition: 'right',
      bloading: true,
      totalNum: '151515',
      // 标签页
      editableTabsValue: '',
      editableTabs: [],
      serviceOption: [],
      tabIndex: 2,
      titleLand: '新增值机岛',
      landDialogVisible: false,
      formLandEdit: {},
      rulesLand: {
        landCode: [{ required: true, message: '请输入岛名', trigger: 'blur' }]
      },
      isAlways: false,
      // 参数
      isLandId: '',
      landName: '',
      rowContent: '',
      deskId: '',
      isLandId11: '',
      tableHeight: window.innerHeight - 240,
      optionsSiteId: [],
      airportId: '',
      siteId: '',
      initTime: '',
      title: '',
      editSkillVisible: false,
      formLabelWidth: '90px',
      // skillShowTable: [],
      formEdit: {},
      codeDisable: false,
      times: [],
      openType: [
        { Id: 1, Name: '动态' },
        { Id: 0, Name: '常开' }
      ],
      islandName: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        landName: [{ required: true, message: '请选择岛名', trigger: 'blur' }],
        openType: [{ required: true, message: '请选择开放类型', trigger: 'change' }],
        initTime: [{ required: true, message: '请选择开放时间', trigger: 'blur' }],
        serviceTypeId: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
        region: [{ required: true, message: '请选择国际/国内类型', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择高端/经济类型', trigger: 'blur' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initterminal()
      }

    }
  },
  created() {
    this.initterminal()
    selectData().then(res => {
      this.serviceOption = res.data.data
    })
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.$nextTick(function() {
      this.rowDrop()
    })
  },
  updated() {
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.$nextTick(function() {
      this.rowDrop()
    })
  },
  destroyed() {
    sessionStorage.removeItem('tabLiNum')
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelectorAll('.el-table__body-wrapper tbody')
      const _this = this
      tbody.forEach((item, i) => {
        Sortable.create(item, {
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.editableTabs[i].desks.splice(oldIndex, 1)[0]
            _this.editableTabs[i].desks.splice(newIndex, 0, currRow)
            var data = {
              id: currRow.id,
              weight: newIndex
            }
            Dragfcn(data).then(res => {
              if (res.data.code == 'ok') {
                _this.$message.success(res.data.message)
              } else {
                _this.$message.error('编辑失败')
              }
            })
          }
        })
      })
    },
    regionChange(payload) {
      this.formEdit.region = payload
    },
    serviceTypeChange(payload) {
      this.formEdit.serviceType = payload
    },
    openTypeChange(e) {
      this.initTime = ''
      this.times = []
      if (e === 0) {
        this.isAlways = true
      } else {
        this.isAlways = false
      }
    },
    initterminal() {
      terminalData(this.airport.airportId).then(res => {
        if (res.data.code === '200') {
          this.optionsSiteId = res.data.data
          this.siteId = this.optionsSiteId[0].id
          this.search()
        }
      })
    },
    search() {
      var data = {
        includeDesks: true,
        airportId: this.airport.airportId,
        terminalId: this.siteId
      }
      initData(data).then(response => {
        if (response.data.data) {
          var arr = []
          response.data.data.forEach(element => {
            element.id = '' + element.id
          })
          if (response.data.data) {
            response.data.data.forEach(element => {
              arr.push(element.id)
            })
          }
          // this.editableTabsValue = this.editableTabsValue === '0' ? response.data.data[0].id : this.editableTabsValue
          if (arr.indexOf(this.editableTabsValue) === -1 || this.editableTabsValue === '0') {
            this.editableTabsValue = response.data.data[0].id
          }
          if (sessionStorage.getItem('tabLiNum')) {
            this.editableTabsValue = sessionStorage.getItem('tabLiNum')
            this.landName = sessionStorage.getItem('landName')
          }
          this.editableTabs = response.data.data
          this.landName = this.landName ? this.landName : this.editableTabs[0].code
          this.isLandId = this.isLandId ? this.isLandId : this.editableTabs[0].id
          this.isLandId11 = this.isLandId
          this.bloading = false
        } else {
          this.editableTabs = []
        }
        this.$nextTick(function() {
          this.rowDrop()
        })
      })
    },
    // 查询按钮
    search2() {
      var data = {
        includeDesks: true,
        airportId: this.airport.airportId,
        terminalId: this.siteId
      }
      initData(data).then(response => {
        if (response.data.data) {
          response.data.data.forEach(element => {
            element.id = '' + element.id
          })
          this.editableTabsValue = response.data.data[0].id
          this.editableTabs = response.data.data
          this.landName = this.editableTabs[0].code
          this.isLandId = this.editableTabs[0].id
          this.bloading = false
        } else {
          this.$message.success('暂无数据')
          this.editableTabs = []
        }
      })
    },
    // 动态新增标签页
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        // this.isLandId = targetName
        this.formLandEdit = {}
        if (this.$refs.formLandEdit) {
          this.$refs.formLandEdit.resetFields()
        }
        this.landDialogVisible = true
      }
      if (action === 'remove') {
        this.$confirm('此操作将删除该岛以及其下的所有柜台，确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            var data = {
              airportId: this.airport.airportId,
              terminalId: this.siteId,
              islandId: targetName
            }
            removeIsland(data).then(response => {
              if (response.data.code === 'ok') {
                const tabs = this.editableTabs
                let activeName = this.editableTabsValue
                if (activeName === targetName) {
                  tabs.forEach((tab, index) => {
                    if (tab.id === targetName) {
                      const nextTab = tabs[index + 1] || tabs[index - 1]
                      if (nextTab) {
                        activeName = nextTab.id
                      }
                    }
                  })
                }
                this.editableTabsValue = activeName
                this.editableTabs = tabs.filter(tab => tab.id !== targetName)
                this.search()
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              }
            })
          })
          .catch(() => {})
      }
    },
    paneClick(targetName) {
      this.isLandId = targetName.name
      sessionStorage.setItem('tabLiNum', targetName.name)
      this.landName = targetName.label
      sessionStorage.setItem('landName', targetName.label)
    },
    cancelAddLand() {
      if (this.formLandEdit.landCode) {
        this.$confirm('本次新增的数据将丢失，确认不保存？', '提示', {
          // cancelButtonClass: 'cancelStyle',
          confirmButtonText: '不保存',
          cancelButtonText: '返回'
        })
          .then(() => {
            this.landDialogVisible = false
            this.formLandEdit = {}
          })
          .catch(() => {})
      } else {
        this.landDialogVisible = false
      }
    },
    handleLandEditClick(formName) {
      var data = {
        airportId: this.airport.airportId,
        terminalId: this.siteId,
        code: this.formLandEdit.landCode
      }
      this.$refs['formLandEdit'].validate(valid => {
        if (valid) {
          addIsland(data).then(response => {
            if (response.data.code === 'ok') {
              this.$message.success('新增成功')
              this.landName = this.formLandEdit.landCode
              this.isLandId = response.data.data.id
              this.editableTabsValue = response.data.data.id + ''
              this.landDialogVisible = false
              this.search()
            }
          })
        }
      })
    },
    autoName(e) {
      if (!this.formEdit.name) {
        this.$set(this.formEdit, 'name', e)
      }
    },

    timeClick(e) {
      this.initTime = e
    },
    addTimeList() {
      this.times.push({ time: '' })
      //   if (this.times.length === 0) {
      //     this.times.push({ time: '' })
      //   } else {
      //     if (this.initTime[0].length < 6) {
      //       this.initTime[0] = new Date('2019-02-07' + ' ' + this.initTime[0]).getTime()
      //       this.initTime[1] = new Date('2019-02-07' + ' ' + this.initTime[1]).getTime()
      //     }
      //     if (this.times[this.times.length - 1].time[0].length < 6) {
      //       this.times[this.times.length - 1].time[0] = new Date('2019-02-07' + ' ' + this.times[this.times.length - 1].time[0]).getTime()
      //       this.times[this.times.length - 1].time[1] = new Date('2019-02-07' + ' ' + this.times[this.times.length - 1].time[1]).getTime()
      //     }
      //     if (this.times.length >= 2) {
      //       for (let i = 0; i < this.times.length; i++) {
      //         if ((this.times[this.times.length - 1].time[0] >= this.initTime[1] || this.times[this.times.length - 1].time[1] <= this.initTime[0]) && (this.times[this.times.length - 1].time[0] >= this.times[i].time[1] || this.times[this.times.length - 1].time[1] <= this.times[i].time[0])) {
      //           this.times.push({ time: '' })
      //           break
      //         } else {
      //           this.$message.error('时间段重叠')
      //           break
      //         }
      //       }
      //     } else {
      //       for (let j = 0; j < this.times.length; j++) {
      //         if (this.times[j].time[0] >= this.initTime[1] || this.times[j].time[1] <= this.initTime[0]) {
      //           this.times.push({ time: '' })
      //           break
      //         } else {
      //           this.$message.error('时间段重叠')
      //           break
      //         }
      //       }
      //     }
      //   }
    },
    deleteTimeList(index) {
      this.times.splice(index, 1)
    },
    backpage() {
      this.$router.go(-1)
    },
    // 添加按钮
    addSkillClick(formName) {
      this.title = '新增值机柜台'
      this.codeDisable = false
      this.isAlways = false
      if (this.$refs.formEdit) {
        this.$refs.formEdit.resetFields()
      }
      this.formEdit = { landName: this.landName }
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.codeDisable = true
      if (this.$refs.formEdit) {
        this.$refs.formEdit.resetFields()
      }
      var data = {
        deskId: row.id
      }
      setSearchDesk(data).then(response => {
        if (response.data.code === 'ok') {
          this.editSkillVisible = true
          var row1 = response.data.data
          this.initTime = ''
          this.times = []
          if (row1.openType === 0) {
            this.isAlways = true
            if (row1.openTimes) {
              if (row1.openTimes[0]) {
                this.initTime = [row1.openTimes[0].beginTime, row1.openTimes[0].endTime]
                if (row1.openTimes.length > 1) {
                  for (let i = 1; i < row1.openTimes.length; i++) {
                    this.times.push({ time: [row1.openTimes[i].beginTime, row1.openTimes[i].endTime] })
                  }
                }
              }
            }
          } else {
            this.isAlways = false
          }
          row1.landName = response.data.data.island.code
          this.rowContent = row1
          this.deskId = response.data.data.id
          this.isLandId = response.data.data.island.id
          this.isLandId11 = response.data.data.island.id
          this.$set(this, 'isLandId11', response.data.data.island.id)
          this.formEdit = Object.assign({}, row1)
        } else {
          this.$message.error(response.data.data.message)
        }
      })
    },
    // 取消添加、修改
    cancelEditClick() {
      this.initTime = ''
      this.times = []
      if (this.title === '修改') {
        var rowContent = this.rowContent
        var formData = this.formEdit
        var props1 = Object.keys(rowContent)
        var props2 = Object.keys(formData)
        var flag1 = true
        if (props1.length !== props2.length) {
          return false
        }
        for (let i = 0, max = props1.length; i < max; i++) {
          var propName = props1[i]
          if (rowContent[propName] !== formData[propName]) {
            flag1 = false
            break
          } else {
            flag1 = true
          }
        }
        if (flag1) {
          this.editSkillVisible = false
        } else {
          this.$confirm('本次修改的数据将丢失，确认不保存？', '提示', {
            confirmButtonText: '不保存',
            cancelButtonText: '返回'
          })
            .then(() => {
              this.editSkillVisible = false
              this.formEdit = {}
            })
            .catch(() => {})
        }
      } else {
        // this.formEdit.landName = null
        if (Object.keys(this.formEdit).length === 1 && !this.formEdit.landName) {
          this.editSkillVisible = false
        } else {
          this.$confirm('本次新增的数据将丢失，确认不保存？', '提示', {
            confirmButtonText: '不保存',
            cancelButtonText: '返回'
          })
            .then(() => {
              this.editSkillVisible = false
              this.formEdit = {}
            })
            .catch(() => {})
        }
      }
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      var curTimes = []
      if (this.initTime) {
        curTimes.push({ beginTime: this.initTime[0], endTime: this.initTime[1] })
      }
      if (this.times.length > 0) {
        if (this.times[0]) {
          for (let i = 0; i < this.times.length; i++) {
            curTimes.push({ beginTime: this.times[i].time[0], endTime: this.times[i].time[1] })
          }
        }
      }
      this.formEdit.openTimes = curTimes
      this.formEdit.island = this.isLandId ? { id: this.isLandId } : ''
      this.$refs['formEdit'].validate(valid => {
        if (valid) {
          if (this.formEdit.openType === 0) {
            if (this.initTime.length < 1) {
              this.$message.error('您选择的开放类型为常开，请至少填写一个时间段！')
              return
            }
          }
          if (this.title === '修改') {
            this.formEdit.deskId = this.deskId
            setDesk(this.formEdit)
              .then(response => {
                if (response.data.code === 'ok') {
                  this.search()
                  this.$message({
                    type: 'success',
                    message: response.data.message
                  })
                  this.$refs['formEdit'].resetFields()
                  this.editSkillVisible = false
                } else {
                  this.$message.error(response.data.message)
                }
                this.initTime = ''
                this.times = []
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          } else {
            addDesk(this.formEdit)
              .then(response => {
                if (response.data.code === 'ok') {
                  this.isLandId = response.data.data.island.id
                  // debugger
                  this.editableTabsValue = '' + response.data.data.island.id
                  this.search()
                  this.$message({
                    type: 'success',
                    message: response.data.message
                  })
                  this.editSkillVisible = false
                }
                this.$refs['formEdit'].resetFields()
                this.initTime = ''
                this.times = []
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.response.data.message
                })
              })
          }
        }
      })
    },
    open(index, row) {
      row.deskId = row.id
      this.$confirm('此操作将删除该数据，确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '返回'
      })
        .then(() => {
          removedesk(row).then(response => {
            if (response.data.code === 'ok') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.search()
            } else {
              this.$message.error(response.data.message)
            }
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除操作'
          // })
        })
    }
  }
}
</script>
<style>
.controlDialog /deep/ .el-dialog__body {
  padding: 20px 17% 0 17%;
}
.cancelStyle {
  background: #495371;
  color: black !important;
}
</style>
<style scoped>
.skillBox /deep/ td,
tr,
th {
  text-align: left;
}
.skillBox /deep/ .cell {
  text-align: left;
  padding-left: 10px;
}

.addButton {
  /* text-align: right; */
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
form {
  margin-top: 20px;
}
.addTime {
  background: #409eff;
  width: 50px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 5px;
  background-color: #0a142f;
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
</style>
