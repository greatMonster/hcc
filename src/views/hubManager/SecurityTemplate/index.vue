<template>
  <div class="skillBox">
    <div class="title">
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick('formEdit')">添 加</el-button>
      </div>
    </div>
    <div class="airportShow">
      <el-table :data="tandemNodeTable" border stripe>
        <el-table-column prop="guaranteedNodeDTO" label="保障节点">
          <template slot-scope="scope">
            <span v-if="scope.row.guaranteedNodeDTO">
              {{ scope.row.guaranteedNodeDTO.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.startTime.datum }}{{ scope.row.startTime.sign?'+':'-' }}{{ scope.row.startTime.minute }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.endTime.datum }}{{ scope.row.endTime.sign?'+':'-' }}{{ scope.row.endTime.minute }}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="默认时长（min）" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改机场弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" @close="closeDialog('formEdit')">
        <el-form ref="formEdit" :model="formEdit" :rules="formRules">
          <el-form-item prop="nodeId" label="保障节点" :label-width="formLabelWidth">
            <el-select v-model="formEdit.nodeId" filterable placeholder="请选择">
              <el-option v-for="item in NodeDataOptions" :key="item.nodeId" :label="item.name" :value="item.nodeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" required :label-width="formLabelWidth">
            <el-col :span="6">
              <el-form-item prop="startdatum">
                <el-select v-model="formEdit.startdatum">
                  <el-option v-for="(item, index) in fromTimeBaseOptions" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="1">-</el-col>
            <el-col :span="3">
              <el-select v-model="formEdit.startsign" placeholder="请选择">
                <el-option v-for="(item, index) in optionData" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-col>
            <el-col style="text-align: center" :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="startminute">
                <el-input v-model.number="formEdit.startminute" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间" required :label-width="formLabelWidth">
            <el-col :span="6">
              <el-form-item prop="endDatum">
                <el-select v-model="formEdit.endDatum">
                  <el-option v-for="(item, index) in fromTimeBaseOptions" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="1">-</el-col>
            <el-col :span="3">
              <el-select v-model="formEdit.endsign" placeholder="请选择">
                <el-option v-for="(item, index) in optionData" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-col>
            <el-col style="text-align: center" :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endminute">
                <el-input v-model.number="formEdit.endminute" />
              </el-form-item>
            </el-col>
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
import { initData, editData, addData, remove } from '@/apiNew/SecurityTemplate'
import { initData as NodeData } from '@/apiNew/supportNode'
export default {
  data() {
    return {
      title: '',
      templateId: '',
      NodeDataOptions: [],
      editSkillVisible: false,
      formLabelWidth: '135px',
      tandemNodeTable: [],
      fromTimeBaseOptions: ['STD', 'ETD', 'ATD'],
      airportName: this.$store.state.user.airportName,
      formEdit: {
        nodeId: '',
        startdatum: '',
        startsign: true,
        startminute: '',
        endDatum: '',
        endsign: true,
        endminute: ''
      },
      optionData: [
        {
          value: true,
          name: '后'
        },
        {
          value: false,
          name: '前'
        }
      ],
      formRules: {
        nodeId: [{ required: true, message: '请选择', trigger: 'change' }],
        startdatum: [{ required: true, message: '请选择', trigger: 'change' }],
        startsign: [{ required: true, message: '请选择', trigger: 'change' }],
        startminute: [{ required: true, message: '请输入', trigger: 'change' }],
        endDatum: [{ required: true, message: '请选择', trigger: 'change' }],
        endsign: [{ required: true, message: '请选择', trigger: 'change' }],
        endminute: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initData()
    this.selectDataFcn()
  },
  methods: {
    initData() {
      // 查询
      initData().then(response => {
        if (response.data.code === '200') {
          this.tandemNodeTable = response.data.data
        }
      })
    },
    addSkillClick(formName) {
      this.title = '添加'
      this.editSkillVisible = true
    },
    selectDataFcn() {
      NodeData().then(res => {
        if (res.data.code === '200') {
          this.NodeDataOptions = res.data.data
        }
      })
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.templateId = row.templateId
      this.formEdit.nodeId = row.guaranteedNodeDTO.nodeId
      this.formEdit.endDatum = row.endTime.datum
      this.formEdit.endsign = row.endTime.sign
      this.formEdit.endminute = row.endTime.minute
      this.formEdit.startdatum = row.startTime.datum
      this.formEdit.startsign = row.startTime.sign
      this.formEdit.startminute = row.startTime.minute
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data2 = {
              templateId: this.templateId,
              endTime: {
                datum: this.formEdit.endDatum,
                sign: this.formEdit.endsign,
                minute: this.formEdit.endminute
              },
              startTime: {
                datum: this.formEdit.startdatum,
                sign: this.formEdit.startsign,
                minute: this.formEdit.startminute
              },
              guaranteedNodeDTO: { nodeId: this.formEdit.nodeId }
            }
            editData(data2).then(response => {
              if (response.data.code === '200') {
                this.$message.success('修改成功')
                this.initData()
                this.editSkillVisible = false
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
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            var data = {
              endTime: {
                datum: this.formEdit.endDatum,
                sign: this.formEdit.endsign,
                minute: this.formEdit.endminute
              },
              startTime: {
                datum: this.formEdit.startdatum,
                sign: this.formEdit.startsign,
                minute: this.formEdit.startminute
              },
              guaranteedNodeDTO: { nodeId: this.formEdit.nodeId }
            }
            addData(data).then(response => {
              if (response.data.code === '200') {
                this.$message.success('添加成功')
                this.initData()
                this.editSkillVisible = false
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
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(row.templateId).then(response => {
            if (response.data.code === '200') {
              this.initData()
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.el-checkbox-group {
  height: 100%;
  align-items: baseline;
  box-sizing: border-box;
  padding: 0 10px;
}
</style>

<style scoped>

form {
  margin-top: 20px;
  width: 80%;
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
.block {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
