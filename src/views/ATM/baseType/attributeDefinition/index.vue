<template>
  <div class="user-config">
    <div class="addCatagory">
      <span style="height:40px">
        请先选择一个Catagory（分类）：
        <el-select v-model="value" placeholder="请选择" @change="chang(value)">
          <el-option v-for="item in options" :key="item.categoryName" :label="item.categoryName" :value="item.categoryCode" />
        </el-select>
      </span>
      <span style="padding-left:30px">
        <el-button type="primary" size="medium" @click="addClick">添 加 属 性</el-button>
      </span>
    </div>
    <div class="user-oparation">
      <el-table :data="propertyTable" border stripe>
        <el-table-column prop="attributeName" label="属性名称" />
        <el-table-column prop="attributeCode" label="属性编码" />
        <el-table-column prop="categoryName" label="分类" />
        <el-table-column prop="attributeType.typeName" label="属性类型" />
        <el-table-column prop="extend" label="扩展属性">
          <template slot-scope="scope">
            <span v-if="scope.row.extend==true">是</span>
            <span v-if="scope.row.extend==false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="visibleGui" label="可见性">
          <template slot-scope="scope">
            <span v-if="scope.row.visibleGui==true">是</span>
            <span v-if="scope.row.visibleGui==false">否</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否默认在GUI显示">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked">在GUI中可视</el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.extend==true" type="primary" size="small" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button v-else type="primary" size="small" disabled @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button v-if="scope.row.extend==true" type="primary" size="small" @click="open(scope.$index,scope.row)">删 除</el-button>
            <el-button v-else type="primary" size="small" disabled @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改属性弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editPropertyVisible">
        <el-form ref="formEdit" :model="formEdit">
          <el-form-item prop="attributeName" label="属性名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.attributeName" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item prop="attributeCode" label="属性编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.attributeCode" placeholder="请输入编码" />
          </el-form-item>
          <el-form-item prop="typeId" label="属性类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.typeId" placeholder="请选择数据类型">
              <el-option v-for="item in addProperty" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="extend" label="扩展属性：" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.extend" />
          </el-form-item>
          <el-form-item prop="visibleGui" label="可见性：" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.visibleGui" />
          </el-form-item>
          <!-- <el-form-item prop="checked" label="是否在GUI可视：" :label-width="formLabelWidth">
            <el-checkbox v-model="formEdit.checked">在GUI中可视</el-checkbox>
          </el-form-item>-->
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
import { initTable, add, remove, set, initselect, select } from '@/api/attributeDefinition'
export default {
  name: 'DefineProperty',
  data() {
    return {
      catagoryName: '',
      airport: this.$store.state.user.airport,
      value: '',
      title: '',
      editPropertyVisible: false,
      formLabelWidth: '140px',
      propertyTable: [],
      options: [],
      addProperty: [],
      extend: [
        { typeId: 'true', typeName: '是' },
        { typeId: 'false', typeName: '否' }
      ],
      formEdit: { attributeName: '', attributeCode: '', typeId: '', categoryCode: '', extend: false, visibleGui: false }
    }
  },
  created() {
    // this.initable()
    this.initselect()
    this.Sxselect()
  },
  methods: {
    printClick() {},
    importClick() {},
    chang(e) {
      this.value = e
      this.propertyTable = []
      this.initable()
    },
    initable() {
      var data = {
        categoryCode: this.value,
        airportId: this.airport.airportId
      }
      initTable(data).then(response => {
        this.propertyTable = response.data
        this.listLoading = false
      })
    },
    initselect() {
      // 类型下拉框
      var data = {

        airportId: this.airport.airportId
      }
      initselect(data).then(response => {
        this.options = response.data
        this.value = response.data[0].categoryCode
        this.initable()
        this.listLoading = false
      })
    },
    Sxselect() {
      // 类型下拉框
      var data = {

        airportId: this.airport.airportId
      }
      select(data).then(response => {
        console.log(response)
        this.addProperty = response.data
      })
    },
    // 添加按钮
    addClick() {
      this.title = '添加'
      this.editPropertyVisible = true
      this.formEdit.attributeName = ''
      this.formEdit.attributeCode = ''
      this.formEdit.typeId = ''
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      console.log(row, 88)
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
            this.formEdit.categoryCode = this.value
            this.formEdit.airportId = this.airport.airportId
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
      })
        .then(() => {
          remove(row.attributeId).then(response => {
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
.user-config {
  width: 100%;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
  padding: 15px 0;
  color: white;
  margin-top: 60px;
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
