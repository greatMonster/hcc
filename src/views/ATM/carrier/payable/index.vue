<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑可计费项目</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addHandleClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table
        v-loading="listLoading"
        :data="billableTable"
        border
        stripe
      >
        <el-table-column
          v-for="(col,index) in cols"
          :key="index"
          :prop="col.prop"
          :label="col.label"
        />
        <!-- <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column> -->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              style="width:60px;height:30px;"
              @click="editHandleClick(scope.$index,scope.row)"
            >修 改</el-button>
            <el-button
              type="primary"
              size="small"
              style="width:60px;height:30px;"
              @click="open(scope.$index,scope.row)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加编辑新合同弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="billableFormVisible">
        <el-form :model="form">
          <el-form-item label="名称：" :label-width="formLabelWidth">
            <el-input v-model="form.billName" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="计费项目描述：" :label-width="formLabelWidth">
            <el-input v-model="form.billDesc" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="计费项目类型：" :label-width="formLabelWidth">
            <el-select v-model="form.unitType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="billableFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleAddClick()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { select, add, remove, set, until } from '@/api/payable'
export default {
  name: 'BillableItems',
  data() {
    return {
      listLoading: true,
      rowId: '',
      title: '',
      billableFormVisible: false,
      formLabelWidth: '120px',
      billableTable: [],
      cols: [{
        prop: 'billName',
        label: '名称'
      }, {
        prop: 'billDesc',
        label: '计费项目描述'
      }, {
        prop: 'unitType',
        label: '计费项目类型'
      }],
      options: [],
      form: { billName: '', billDesc: '', unitType: '', options: '' }
    }
  },
  created() {
    this.select()
    this.until()
  },
  methods: {
    select() {
      select().then(response => {
        this.billableTable = response.data
        this.listLoading = false
      })
    },
    until() {
      until().then(response => {
        this.options = response.data
      })
    },
    addHandleClick() {
      this.title = '添加'
      this.billableFormVisible = true
    },
    editHandleClick(index, row) {
      this.rowId = row.billingItemId
      this.form.billName = row.billName
      this.form.billDesc = row.billDesc
      this.form.unitType = row.unitType
      this.billableFormVisible = true
      this.title = '编辑'
    },
    // 确定按钮
    handleAddClick() {
      if (this.title === '添加') {
        var data2 = {
          'billName': this.form.billName,
          'billDesc': this.form.billDesc,
          'unitType': this.form.unitType
        }
        add(data2).then(response => {
          if (response.code === '200') {
            this.select()
          }
        })
        this.billableFormVisible = false
      } else if (this.title === '编辑') {
        var data = {
          'billName': this.form.billName,
          'billDesc': this.form.billDesc,
          'unitType': this.form.unitType,
          'billingItemId': this.rowId + ''
        }
        set(data).then(response => {
          if (response.code === '200') {
            this.select()
          }
        })
        this.billableFormVisible = false
      }
    },
    open(index, row) {
      var data2 = {
        'billingItemId': row.billingItemId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(data2).then(response => {
          if (response.code === '200') {
            this.select()
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {

      })
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
  font-size: 16px;
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
