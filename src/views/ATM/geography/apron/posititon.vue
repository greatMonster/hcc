<template>
  <div class="skillBox">
    <div class="title">
      <!-- <div>机位</div> -->
      <div class="titleWord">
        <div class="addButton">
          <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
        </div>
      </div>
    </div>
    <div class="skillShow">
      <div style="text-align: right">
        <span>共 {{ states.totalSeats || 0 }} 个机位，</span>
        <span>其中近机位 {{ states.nearSeat || 0 }} 个，</span>
        <span>远机位 {{ states.farSeat || 0 }} 个，</span>
        <span>远远机位 {{ states.farSeatPlus || 0 }} 个</span>
      </div>
      <el-table v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)" :data="skillShowTable" border stripe>
        <el-table-column prop="positionCode" label="编码" sortable="" />
        <el-table-column prop="positionRegion" label="国际国内">
          <template slot-scope="scope">
            <span v-show="scope.row.positionRegion == 'D'">国内</span>
            <span v-show="scope.row.positionRegion == 'I'">国际</span>
            <span v-show="scope.row.positionRegion == 'D/I'">国内/国际</span>
          </template>
        </el-table-column>
        <el-table-column prop="positionType" label="机位类型">
          <template slot-scope="scope">
            <span v-show="scope.row.positionType == 'CONTACT'">近机位</span>
            <span v-show="scope.row.positionType == 'REMOTE_PLUS'">远远机位</span>
            <span v-show="scope.row.positionType == 'REMOTE'">远机位</span>
          </template>
        </el-table-column>
        <el-table-column prop="apronBean.apronName" label="机坪" />
        <el-table-column prop="selfslip" label="自滑">
          <template slot-scope="scope">
            <span v-show="scope.row.selfslip == true">是</span>
            <span v-show="scope.row.selfslip == false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="bridge" label="靠桥">
          <template slot-scope="scope">
            <span v-show="scope.row.bridge == true">是</span>
            <span v-show="scope.row.bridge == false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="groundanchor" label="地锚">
          <template slot-scope="scope">
            <span v-show="scope.row.groundanchor == true">是</span>
            <span v-show="scope.row.groundanchor == false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="oil" label="加油">
          <template slot-scope="scope">
            <span v-show="scope.row.oil == true">是</span>
            <span v-show="scope.row.oil == false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="water" label="加水">
          <template slot-scope="scope">
            <span v-show="scope.row.water == true">是</span>
            <span v-show="scope.row.water == false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="positionName" label="备注" />
        <!-- <el-table-column prop="locationId" label="位置" /> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="small" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="positionCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.positionCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="positionRegion" label="国际国内：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.positionRegion" placeholder="请选择">
              <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="positionType" label="机位类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.positionType" placeholder="请选择">
              <el-option v-for="item in positionTypeoptions" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="apronId" label="机坪：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.apronId" placeholder="请选择">
              <el-option v-for="item in apronIdoptions" :key="item.apronId" :label="item.apronName" :value="item.apronId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="selfslip" label="自滑：" :label-width="formLabelWidth"> <el-checkbox v-model="formEdit.selfslip" />是 </el-form-item>
          <el-form-item prop="bridge" label="靠桥：" :label-width="formLabelWidth"> <el-checkbox v-model="formEdit.bridge" />是 </el-form-item>
          <el-form-item prop="groundanchor" label="地锚：" :label-width="formLabelWidth"> <el-checkbox v-model="formEdit.groundanchor" />是 </el-form-item>
          <el-form-item prop="oil" label="加油：" :label-width="formLabelWidth"> <el-checkbox v-model="formEdit.oil" />是 </el-form-item>
          <el-form-item prop="water" label="加水：" :label-width="formLabelWidth"> <el-checkbox v-model="formEdit.water" />是 </el-form-item>

          <el-form-item prop="positionName" label="备注：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.positionName" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item prop="locationId" label="位置：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.locationId" placeholder="请输入" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { find, findposititon, addposititon, setposititon, removeposititon, getStates } from '@/api/apron'
export default {
  name: 'CheckInData',
  data() {
    return {
      states: {},
      loading: false,
      title: '',
      airport: this.$store.state.user.airport,
      editSkillVisible: false,
      formLabelWidth: '100px',
      skillShowTable: [],
      formEdit: { apronId: '', apronCode: '', apronNote: '', defaultFerryTime: '' },
      islandName: [],
      options: [
        { Id: 'D', Name: '国内' },
        { Id: 'I', Name: '国际' },
        { Id: 'D/I', Name: '国际/国内' }
      ],
      positionTypeoptions: [
        { Id: 'CONTACT', Name: '近机位' },
        { Id: 'REMOTE_PLUS', Name: '远远机位' },
        { Id: 'REMOTE', Name: '远机位' }
      ],
      apronIdoptions: [],
      rules: {
        positionCode: [{ required: true, message: '不能为空' }],
        apronNote: [{ required: true, message: '不能为空' }],
        defaultFerryTime: [{ required: true, message: '不能为空' }],
        positionRegion: [{ required: true, message: '不能为空' }],
        positionType: [{ required: true, message: '不能为空' }],
        apronId: [{ required: true, message: '不能为空' }]
      }
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.initable()
      }

    }
  },
  created() {
    this.initable()
    this.find()
    this.getStatesSearch()
  },
  methods: {
    // 统计数据
    getStatesSearch() {
      var data = {
        airportId: this.airport.airportId
      }
      getStates(data).then((response) => {
        this.states = response.data
      })
    },
    initable() {
      this.loading = true
      var data = {
        airportId: this.airport.airportId
      }
      findposititon(data).then((response) => {
        this.skillShowTable = response.data
        this.loading = false
      })
    },
    find() {
      var data = {
        airportId: this.airport.airportId
      }
      find(data).then((response) => {
        this.apronIdoptions = response.data
      })
    },

    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      // this.formEdit.apronName = ''
      // this.formEdit.apronCode = ''
      // this.formEdit.apronNote = ''
      // this.formEdit.defaultFerryTime = ''
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            this.formEdit.airportId = this.airport.airportId
            setposititon(this.formEdit).then((response) => {
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
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            this.formEdit.airportId = this.airport.airportId
            addposititon(this.formEdit).then((response) => {
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
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeposititon(row).then((response) => {
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
