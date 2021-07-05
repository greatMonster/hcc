<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑所有用户行为</div>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>-->
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="reasonTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加新合同弹框 -->
    <div>
      <el-dialog :title="title" :visible.sync="attendanceDialogVisible">
        <el-form ref="form" :model="form">
          <el-form-item prop="name" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item prop="abbrev" label="简称：" :label-width="formLabelWidth">
            <el-input v-model="form.abbrev" placeholder="请输入简称" />
          </el-form-item>
          <el-form-item prop="desc" label="描述：" :label-width="formLabelWidth">
            <el-input v-model="form.desc" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="attendanceDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reason',
  data() {
    return {
      title: '',
      attendanceDialogVisible: false,
      formLabelWidth: '120px',
      reasonTable: [
        {
          name: 'No jetty/stairs',
          abbrev: '这里是简称1',
          desc: '描述1'
        },
        {
          name: 'No jetty/stairs',
          abbrev: '这里是简称2',
          desc: '描述2'
        },
        {
          name: 'No jetty/stairs',
          abbrev: '这里是简称3',
          desc: '描述3'
        },
        {
          name: 'No jetty/stairs',
          abbrev: '这里是简称4',
          desc: '描述4'
        }
      ],
      cols: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'abbrev',
          label: '简称'
        },
        {
          prop: 'desc',
          label: '描述'
        }
      ],
      form: { name: '', abbrev: '', desc: '' }
    }
  },
  methods: {
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.form.name = ''
      this.form.abbrev = ''
      this.form.desc = ''
      this.title = '添加'
      this.attendanceDialogVisible = true
    },
    editHandleClick(index, row) {
      this.form.name = row.name
      this.form.abbrev = row.abbrev
      this.form.desc = row.desc
      //   console.log(row.isFavorite == "no" ? false : true);
      this.attendanceDialogVisible = true
      this.title = '编辑'
      localStorage.setItem('rowIndex', index)
    },
    //     // 添加合同后的确定按钮
    handleAddClick(formName) {
      if (this.title === '添加') {
        this.reasonTable.push({
          name: this.form.name,
          abbrev: this.form.abbrev,
          desc: this.form.desc
        })
        this.attendanceDialogVisible = false
        this.$refs[formName].resetFields()
      } else if (this.title === '编辑') {
        var rowIndex = localStorage.getItem('rowIndex')
        // console.log(rowIndex);
        this.reasonTable[rowIndex].name = this.form.name
        this.reasonTable[rowIndex].abbrev = this.form.abbrev
        this.reasonTable[rowIndex].desc = this.form.desc
        this.attendanceDialogVisible = false
        this.$refs[formName].resetFields()
      }
    },
    //     // 添加合同的启用状态按钮
    adduserbleClick() {},
    //     // 修改行数据按钮
    edituserbleClick() {},
    open(index, row) {
      this.$confirm('确认要删除这条数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.reasonTable.splice(index, 1)
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 100)
            }, 500)
          }
        }
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleRadioClick(e) {
      if (e === '2') {
        this.form.disabled1 = false
        this.form.disabled2 = true
      } else if (e === '3') {
        this.form.disabled1 = true
        this.form.disabled2 = false
      } else if (e === '1') {
        this.form.disabled1 = true
        this.form.disabled2 = true
      }
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
