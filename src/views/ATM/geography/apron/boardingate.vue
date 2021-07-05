<template>
  <div class="skillBox">
    <div class="title">
      <!-- <div>机位</div> -->
      <div class="titleWord">

        <span style="padding-left: 20px;">
          <label>航站楼&nbsp;&nbsp;&nbsp;</label>
          <el-select v-model="siteId" placeholder="请选择" style="width:150px" size="small">
            <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </span>
        <div class="addButton">
          <el-button type="primary" size="small" @click="initable">查 询</el-button>
          <el-button type="primary" size="small" @click="addSkillClick">添 加</el-button>
        </div>
      </div>
    </div>
    <div class="skillShow">
      <el-table v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)" :data="skillShowTable" border stripe>
        <el-table-column prop="gateCode" label="登机口名称" />
        <el-table-column prop="gateType" label="机位类型">
          <template slot-scope="scope">
            <span v-if="scope.row.gateType=='CONTACT'">近机位</span>
            <span v-if="scope.row.gateType=='REMOTE_PLUS'">远远机位</span>
            <span v-if="scope.row.gateType=='REMOTE'">远机位</span>
          </template>
        </el-table-column>
        <el-table-column prop="bridgeType" label="桥位类型">
          <template slot-scope="scope">
            <span v-if="scope.row.bridgeType=='SINGLE'">单桥</span>
            <span v-if="scope.row.bridgeType=='COMPOUND'">复合桥</span>
            <span v-if="scope.row.bridgeType=='N/A'">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="positionBeans" label="关联机位">
          <template slot-scope="scope">
            <el-popover v-if="parseInt(scope.row.positionBeans.length)>3" placement="top-start" trigger="hover">
              <span v-for="(itm, i) in scope.row.positionBeans" :key="i">{{ itm.positionCode }}</span>
              <div slot="reference">
                <span v-for="(itm, i) in scope.row.positionBeans.slice(0,3)" :key="i">{{ itm.positionCode }}</span>
                <span v-if="parseInt(scope.row.positionBeans.length)>3">...</span>
              </div>
            </el-popover>
            <span v-for="(itm, i) in scope.row.positionBeans" v-else :key="i">{{ itm.positionCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gateRegion" label="国际国内">
          <template slot-scope="scope">
            <span v-if="scope.row.gateRegion=='D'">国内</span>
            <span v-if="scope.row.gateRegion=='I'">国际</span>
            <span v-if="scope.row.gateRegion=='D/I'">国内/国际</span>
          </template>
        </el-table-column>
        <el-table-column prop="boardingGateBean.gateCode" label="关联登机口">
          <template slot-scope="scope">
            <span v-if="scope.row.boardingGateBean">{{ scope.row.boardingGateBean.gateCode }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="gateNote" label="备注" />
        <!-- <el-table-column prop="gateNote" label="机位" /> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="terminalId" label="航站楼：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.terminalId" placeholder="请选择" style="width:150px" size="small" disabled>
              <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="gateCode" label="登机口名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.gateCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="gateType" label="登机口类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.gateType" placeholder="请选择" @change="chckdata">
              <el-option v-for="item in positionTypeoptions" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="bridgeTypeshow" prop="bridgeType" label="桥位类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.bridgeType" placeholder="请选择" @change="chckdata2">
              <el-option v-for="item in positionbridgeType" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="bridgeTypeshow2" prop="linkGateId" label="关联登机口：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.linkGateId" placeholder="请选择" @visible-change="changeLinkGateId">
              <el-option v-for="item in linkGateIdOption" :key="item.linkGateId" :label="item.linkgateCode" :value="item.linkGateId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="bridgeTypeshow" prop="positionIds" label="关联机位：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.positionIds" placeholder="请选择" multiple collapse-tags @visible-change="changepositionIds">
              <el-option v-for="item in ShowTable" :key="item.positionId" :label="item.positionCode" :value="item.positionId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="gateRegion" label="国际国内：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.gateRegion" placeholder="请选择">
              <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="gateNote" label="备注：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.gateNote" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData as terminalData } from '@/api/terminal'
import { findboardingGateNew, addboardingGate, setboardingGate, removeboardingGate, link, linkGate } from '@/api/apron'
export default {
  name: 'CheckInData',
  data() {
    return {
      airport: this.$store.state.user.airport,
      siteId: '',
      optionsAirport: [],
      optionsSiteId: [],
      linkGateIdOption: [],
      bridgeTypeshow: false,
      bridgeTypeshow2: false,
      props: { multiple: true },
      loading: false,
      title: '',
      editSkillVisible: false,
      formLabelWidth: '150px',
      skillShowTable: [],
      ShowTable: [], // 关联机位
      formEdit: {},
      islandName: [],
      options: [
        { Id: 'D', Name: '国内' },
        { Id: 'I', Name: '国际' },
        { Id: 'D/I', Name: '国内/国际' }
      ],
      positionbridgeType: [
        { Id: 'SINGLE', Name: '单桥' },
        { Id: 'COMPOUND', Name: '复合桥' },
        { Id: 'N/A', Name: ' — ' }
      ],
      positionTypeoptions: [
        { Id: 'CONTACT', Name: '近机位' },
        { Id: 'REMOTE_PLUS', Name: '远远机位' },
        { Id: 'REMOTE', Name: '远机位' }
      ],
      //   apronIdoptions: [],
      rules: {
        gateCode: [{ required: true, message: '不能为空' }],
        gateType: [{ required: true, message: '不能为空' }],
        bridgeType: [{ required: true, message: '不能为空' }],
        positionIds: [{ required: true, message: '不能为空' }],
        linkGateId: [{ required: true, message: '不能为空' }],
        gateRegion: [{ required: true, message: '不能为空' }]
      }
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
    // this.initable()
    this.initterminal()
    this.find()
    this.changepositionIds()
    this.changeLinkGateId()
  },
  methods: {
    initterminal() {
      terminalData(this.airport.airportId).then(res => {
        if (res.data.code === '200') {
          this.optionsSiteId = res.data.data
          this.siteId = this.optionsSiteId[0].id
          this.initable()
        }
      })
    },
    initable() {
      this.loading = true
      var data = {
        terminalId: this.siteId,
        airportId: this.airport.airportId
      }
      findboardingGateNew(data).then(response => {
        this.skillShowTable = response.data
        this.loading = false
      })
    },
    // find() {
    //   var data = {

    //     airportId: this.airport.airportId
    //   }
    //   find(data).then(response => {
    //     this.apronIdoptions = response.data
    //   })
    // },
    chckdata(e) {
      if (e === 'CONTACT') {
        this.bridgeTypeshow = true
      } else {
        this.bridgeTypeshow = false
      }
    },
    chckdata2(e) {
      if (e === 'COMPOUND') {
        this.bridgeTypeshow2 = true
      } else {
        this.bridgeTypeshow2 = false
      }
    },
    link() {
      var data = {
        airportId: this.airport.airportId
      }
      link(data).then(response => {
        this.ShowTable = response.data
      })
    },
    getLinkGate() {
      var data = {
        airportId: this.airport.airportId
      }
      linkGate(data).then(response => {
        response.data.forEach(element => {
          this.linkGateIdOption.push({
            linkGateId: element.gateId,
            linkgateCode: element.gateCode
          })
        })
      })
    },
    changepositionIds(val) {
      if (val) {
        this.link()
      }
    },
    changeLinkGateId(val) {
      if (val) {
        this.getLinkGate()
      }
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.formEdit = {
        gateCode: '',
        gateType: '',
        bridgeType: '',
        gateRegion: '',
        gateNote: '',
        positionIds: '',
        terminalId: this.siteId
      }
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
      if (row.boardingGateBean) {
        this.formEdit.linkgateCode = row.boardingGateBean.gateCode
        this.formEdit.linkGateId = row.boardingGateBean.gateId
      }
      var arr = []
      row.positionBeans.forEach(item => {
        arr.push(item.positionId)
      })
      this.formEdit.positionIds = arr

      if (row.gateType === 'CONTACT') {
        this.bridgeTypeshow = true
      }
      if (row.bridgeType === 'COMPOUND') {
        this.bridgeTypeshow2 = true
      }
      this.link()
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            setboardingGate(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            addboardingGate(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeboardingGate(row).then(response => {
            if (response.code === '200') {
              this.initable()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
.addButton {
  margin-left: 10px;
}
form {
  margin-top: 20px;
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
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
</style>
