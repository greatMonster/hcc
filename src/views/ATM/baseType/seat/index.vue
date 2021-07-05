<template>
  <div class="user-config">
    <div class="user-title">
      添加或编辑属性定义
      <span style="padding-left:30px">
        <el-button type="primary" size="medium" @click="addClick">添 加 属 性</el-button>
      </span>
    </div>
    <div class="addCatagory">
      <span style="height:40px">
        请先选择一个Catagory（分类）：
        <el-select v-model="value" placeholder="请选择" @change="chang(value)" @visible-change="initselect">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </span>
    </div>
    <div class="user-oparation">
      <el-table
        :data="propertyTable"
        border
        stripe
      >
        <el-table-column prop="associatedName" label="名称" />
        <el-table-column prop="associatedType" label="类型" />
        <el-table-column prop="associatedScore" label="分数" />
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
    <!-- 修改属性弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editPropertyVisible" width="50%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="associatedName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.associatedName" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="show" prop="associatedType" label="类型：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.associatedType" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="associatedScore" label="分数：" :label-width="formLabelWidth">
            <el-input v-model.number="formEdit.associatedScore" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="background: #495373;color: white;" @click="editPropertyVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { type, associatedType, add, set, remove } from '@/api/seatSet'
export default {
  name: 'Seat',
  data() {
    return {
      show: true,
      value: 'ACTYPE',
      title: '',
      editPropertyVisible: false,
      formLabelWidth: '140px',
      propertyTable: [],
      options: [],
      formEdit: { associatedName: '', associatedType: '', associatedScore: '' },
      rules: {
        associatedName: [
          { required: true, message: '不能为空' }
        ],
        associatedType: [
          { required: true, message: '不能为空' }
        ],
        associatedScore: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' }
        ]
      }
    }
  },
  created() {
    this.initable()
    this.initselect()
  },
  methods: {
    printClick() {},
    importClick() {},
    chang(e) {
      this.propertyTable = []
      this.initable()
    },
    initable() {
      associatedType(this.value).then(response => {
        this.propertyTable = response.data
      })
    },
    initselect() { // 分类下拉框
      type(this.value).then(response => {
        var _this = this
        this.options = []
        Object.getOwnPropertyNames(response.data).forEach(function(cur) {
          _this.options.push({ name: response.data[cur], id: cur })
        })
      })
    },
    // 添加按钮
    addClick() {
      this.title = '添加'
      this.show = false
      this.editPropertyVisible = true
      this.formEdit.associatedName = ''
      this.formEdit.associatedType = ''
      this.formEdit.associatedScore = ''
      this.formEdit.associatedId = ''
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.show = true
      this.title = '修改'
      this.editPropertyVisible = true
      this.formEdit.categoryCode = row.categoryCode
      this.formEdit = Object.assign({}, row)
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            set(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editPropertyVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            this.formEdit.associatedType = this.value
            add(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
            })
            this.editPropertyVisible = false
          }
        })
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(row.associatedId).then(response => {
          if (response.code === '200') {
            this.initable()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
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
.user-config {
  width: 100%;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
  padding: 15px 0;
  color: white;
}
.addCatagory {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}
.user-title {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
