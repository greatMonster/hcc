<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <span style="padding-left: 20px;">
          <el-button type="primary" size="small" @click="addHandleClick('checkInIsLandVO')">新增</el-button>
        </span>
      </div>
      <!-- <div class="addButton">
        <el-button type="primary" size="small" @click="addHandleClick">添 加</el-button>
      </div>-->
    </div>

    <div class="skillShow">
      <el-table :data="orgnizationPartTable" border stripe>
        <el-table-column v-for="(col,index) in cols" :key="index" :label="col.label">
          <template slot-scope="scope">
            <span v-if="col.label=='国内/国际'">{{ scope.row.regionType === 'D'?'国内':'国际' }}</span>
            <span v-else>{{ scope.row[col.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="taskTypeVisible">
        <el-form ref="form" :model="form" :rules="rules" style="margin-left:200px">
          <el-form-item prop="siteId" label="航站楼：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.siteId" placeholder="请选择" style="width:150px" size="small">
              <el-option v-for="item in optionsSiteId" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="arrivalName" label="到达点名称：" :label-width="formLabelWidth" style="width:400px">
            <el-input v-model="form.arrivalName" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item prop="arrivalCode" label="到达点编号：" :label-width="formLabelWidth" style="width:400px">
            <el-input v-model="form.arrivalCode" placeholder="请输入到达点编号" />
          </el-form-item>
          <el-form-item prop="apronId" label="机坪名称：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.apronId" placeholder="请选择" style="width:280px">
              <el-option v-for="item in apronOptions" :key="item.apronId" :label="item.apronName" :value="item.apronId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="regionType" label="国际国内类型：" :label-width="formLabelWidth" style="width:400px">
            <el-select v-model="form.regionType" placeholder="请选择" style="width:280px">
              <el-option v-for="item in orgnizations" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="taskTypeVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { initData as terminalData } from '@/api/terminal'
import { initData, addDatafcn, eitDatafcn, deleteDatafcn, apronData } from '@/api/arrivalpoint'
export default {
  name: 'Arrivalpoint',
  data() {
    return {
      siteId: '',
      optionsAirport: [],
      optionsSiteId: [],
      title: '',
      taskTypeVisible: false,
      edittaskVisible: false,
      formLabelWidth: '120px',
      orgnizationPartTable: [],
      apronOptions: [],
      orgnizations: [
        { id: 'D', value: '国内' },
        { id: 'I', value: '国际' }
      ],
      index: '',
      cols: [
        {
          prop: 'arrivalName',
          label: '到达点名称'
        },
        {
          prop: 'terminalName',
          label: '航站楼'
        },
        {
          prop: 'arrivalCode',
          label: '编号'
        },
        {
          prop: 'apronName',
          label: '机坪'
        },
        {
          prop: 'regionTypeName',
          label: '国内/国际'
        }
      ],
      form: { arrivalName: '', arrivalCode: '', apronId: '', regionType: '', siteId: this.siteId },
      rules: {
        arrivalName: [{ required: true, message: '请输入到达点名称', trigger: 'blur' }],
        // arrivalCode: [{ required: true, message: '请输入到达点编号', trigger: 'blur' }],
        regionType: [{ required: true, message: '请选择国内国际类型', trigger: 'blur' }],
        siteId: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      airport: this.$store.state.user.airport
    }
  },
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        this.init()
      }

    }
  },
  created() {
    this.init()
    this.initterminal()
    this.apronData()
  },
  methods: {
    initterminal() {
      terminalData(this.airport.airportId).then(res => {
        if (res.data.code === '200') {
          this.optionsSiteId = res.data.data
        }
      })
    },
    init() {
      const data = {
        airportId: this.airport.airportId
      }
      initData(data).then(response => {
        this.orgnizationPartTable = response.data
      })
    },
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.form.arrivalName = ''
      this.form.arrivalCode = ''
      this.form.apronId = ''
      this.form.regionType = ''
      this.title = '添加'
      this.taskTypeVisible = true
    },
    apronData() {
      var data = {
        airportId: this.airport.airportId
      }
      apronData(data).then(response => {
        if (response.code === '200') {
          this.apronOptions = response.data
        }
      })
    },
    editHandleClick(index, row) {
      this.form.arrivalName = row.arrivalName
      this.form.arrivalCode = row.arrivalCode
      this.form.apronId = row.apronId
      this.form.regionType = row.regionType
      this.form.siteId = row.terminalId
      this.taskTypeVisible = true
      this.title = '编辑'
      this.index = row.arrivalId
    },
    //     // 添加确定按钮
    handleAddClick(formName) {
      this.form.terminalId = this.form.siteId
      this.form.airportId = this.airport.airportId
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title === '添加') {
            var addData = this.form
            addDatafcn(addData).then(response => {
              if (response.code === '200') {
                this.$message.success('添加成功！')
                this.init()
              } else {
                this.$message.error(response.message)
              }
            })
            this.taskTypeVisible = false
          } else {
            var eitData = this.form
            eitData.arrivalId = this.index
            eitDatafcn(eitData).then(response => {
              this.$message.success('修改成功！')
              this.init()
            })
            this.index = ''
            this.taskTypeVisible = false
          }
        } else {
          return false
        }
      })
    },

    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            arrivalId: row.arrivalId
          }
          deleteDatafcn(data).then(response => {
            if (response.code === '200') {
              this.init()
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
  padding-top: 30px;
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
  width: 80%;
  display: flex;
  align-items: center;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
