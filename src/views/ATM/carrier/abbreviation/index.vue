<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑位置</div>
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
      <el-table :data="abbrevTable" border stripe>
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label" />
        <!-- <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>-->
        <!-- <el-table-column prop="enable" label="启用状态">
          <template slot-scope="scope">
          有问题
          <el-checkbox v-model="scope.row.enableChecked">启用状态</el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加编辑新合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="abbrevFormVisible">
        <el-form ref="formEdit" :model="form">
          <el-form-item prop="abbrev" label="简称：" :label-width="formLabelWidth">
            <el-input v-model="form.abbrev" placeholder="请输入简称" />
          </el-form-item>
          <el-form-item prop="name" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item prop="startTime" label="开始时间：" :label-width="formLabelWidth">
            <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item prop="endTime" label="结束时间：" :label-width="formLabelWidth">
            <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="form.enableChecked" @click="adduserbleClick">是否可选</el-checkbox>
          </el-form-item>
          <!-- <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="dispatchChecked" @click="adduserbleClick">是否分配</el-checkbox>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="abbrevFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgnizationAbbrev',
  data() {
    return {
      title: '',
      abbrevFormVisible: false,
      formLabelWidth: '120px',
      abbrevTable: [
        { abbrev: 'LH', name: 'Lufthansa', enable: 'no', startTime: '2019-04-01', endTime: '2019-04-03' },
        { abbrev: 'LH', name: 'Lufthansa', enable: 'yes', startTime: '2019-04-01', endTime: '2019-04-01' },
        { abbrev: 'LH', name: 'Lufthansa', enable: 'no', startTime: '2019-04-01', endTime: '2019-04-01' },
        { abbrev: 'LH', name: 'Lufthansa', enable: 'yes', startTime: '2019-04-01', endTime: '2019-04-01' }
      ],
      cols: [
        {
          prop: 'abbrev',
          label: '简称'
        },
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'enable',
          label: '可选状态'
        },
        {
          prop: 'startTime',
          label: '开始日期'
        },
        {
          prop: 'endTime',
          label: '结束日期'
        }
      ],
      form: { abbrev: '', name: '', startTime: '', endTime: '', enableChecked: false }
    }
  },
  methods: {
    printClick() {},
    importClick() {},
    addHandleClick() {
      this.form.abbrev = ''
      this.form.name = ''
      this.form.startTime = ''
      this.form.enableChecked = false
      this.title = '添加简称'
      this.abbrevFormVisible = true
    },
    editHandleClick(index, row) {
      this.form.abbrev = row.abbrev
      this.form.name = row.name
      this.form.startTime = row.startTime
      this.form.enableChecked = row.enable !== 'no'
      //   console.log(row.enable == "no" ? false : true);
      this.abbrevFormVisible = true
      this.title = '编辑简称'
      localStorage.setItem('rowIndex', index)
    },
    //     // 添加合同后的确定按钮
    handleAddClick() {
      if (this.title === '添加简称') {
        this.abbrevTable.push({
          abbrev: this.form.abbrev,
          name: this.form.name,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          enable: this.form.enableChecked === true ? 'yes' : 'no'
        })
        this.abbrevFormVisible = false
      } else if (this.title === '编辑简称') {
        var rowIndex = localStorage.getItem('rowIndex')
        // console.log(rowIndex);
        var status = this.form.enableChecked === true ? 'yes' : 'no'
        this.abbrevTable[rowIndex].abbrev = this.form.abbrev
        this.abbrevTable[rowIndex].name = this.form.name
        this.abbrevTable[rowIndex].startTime = this.form.startTime
        this.abbrevTable[rowIndex].endTime = this.form.endTime
        this.abbrevTable[rowIndex].enable = status
        // console.log(status)
        this.abbrevFormVisible = false
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
            this.abbrevTable.splice(index, 1)
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
