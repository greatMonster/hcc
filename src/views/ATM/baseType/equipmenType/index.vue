<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑机型</div>
      </div>
      <div class="addButton">
        共 {{ totaCount }} 行
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow headerFilter">
      <el-table v-loading="listLoading" :data="skillShowTable" border stripe :max-height="tableHeight">
        <el-table-column prop="carrierCode" label="承运人" />
        <el-table-column prop="aircraftCode" label="飞机" />
        <el-table-column prop="cabinLayout" label="机舱座位数与布局">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p v-for="(item, index) in scope.row.cabinArray" :key="index">{{ item }}</p>
              <div slot="reference">{{ scope.row.cabinLayout }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="aircraftType" label="宽窄">
          <template slot-scope="scope">
            <span v-if="scope.row.aircraftType === '1'">宽体机</span>
            <span v-if="scope.row.aircraftType === '2'">窄体机</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="editHandleClick(scope.$index, scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formEdit" :model="formEdit" :rules="Rules">
          <el-form-item prop="carrierCode" label="承运人" :label-width="formLabelWidth">
            <el-input v-model="formEdit.carrierCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="aircraftCode" label="飞机编码" :label-width="formLabelWidth">
            <el-input v-model="formEdit.aircraftCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="cabinLayout" label="机舱布局" :label-width="formLabelWidth">
            <el-input v-model="formEdit.cabinLayout" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="aircraftType" label="宽窄" :label-width="formLabelWidth">
            <el-select v-model="formEdit.aircraftType" filterable placeholder="请选择">
              <el-option v-for="item in optionsAircraftType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
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
import { select, add, remove, set } from '@/api/equipmenType'
export default {
  name: 'SkillAdmin',
  data() {
    return {
      tableHeight: window.innerHeight - 115,
      totaCount: '',
      listLoading: true,
      rowId: '',
      title: '',
      editSkillVisible: false,
      optionsAircraftType: [
        { name: '宽体机', id: '1' },
        { name: '窄体机', id: '2' }
      ],
      formLabelWidth: '120px',
      skillShowTable: [],
      formEdit: { carrierCode: '', aircraftCode: '', cabinLayout: '', aircraftType: '' },
      Rules: {
        carrierCode: [{ required: true, message: '请输入承运人', trigger: 'blur' }],
        aircraftCode: [{ required: true, message: '请输入飞机编码：', trigger: 'blur' }],
        cabinLayout: [{ required: true, message: '请输入机舱布局：', trigger: 'blur' }],
        aircraftType: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initable()
  },
  methods: {
    printClick() {},
    importClick() {},
    initable() {
      select().then((response) => {
        var data = response.data
        this.totaCount = data.length
        if (data.length > 0) {
          data.forEach((element) => {
            var cabinArray = []
            if (element.cabinMap) {
              for (const i in element.cabinMap) {
                var o = i + ':' + element.cabinMap[i]
                // var o = {}
                // o[i] = element.cabinMap[i]
                cabinArray.push(o)
              }
            }
            element.cabinArray = cabinArray
          })
        }
        // this.$nextTick(() => {
        //   this.tableHeight = window.innerHeight - 95
        // })
        this.skillShowTable = response.data
        this.listLoading = false
      })
    },
    // 添加按钮
    addSkillClick() {
      this.formEdit = { carrierCode: '', aircraftCode: '', cabinLayout: '', aircraftType: '' }
      this.title = '添加'
      this.editSkillVisible = true
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.formEdit = { carrierCode: '', aircraftCode: '', cabinLayout: '', aircraftType: '' }
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            set(this.formEdit).then((response) => {
              if (response.code === '200') {
                this.initable()
                this.$message.success('修改成功')
              } else {
                this.$message.error('修改失败')
              }
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate((valid) => {
          if (valid) {
            add(this.formEdit).then((response) => {
              if (response.code === '200') {
                this.initable()
                this.$message.success('添加成功')
              } else {
                this.$message.error('添加失败')
              }
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    open(index, row) {
      var data2 = {
        aircraftId: row.aircraftId
      }
      this.$confirm('确认删除这条数据吗？', '提 示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          remove(data2).then((response) => {
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
