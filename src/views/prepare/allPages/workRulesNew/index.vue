<template>
  <section class="app2">
    <div class="header-search" style="margin-top: 60px">
      <div class="search-file" style="margin-left: 30px">
        <el-input v-model="input21" size="small" class="special" placeholder="输入搜索关键字" type="text" suffix-icon="el-icon-search" />
      </div>
      <div style="margin-left: 30px">
        <el-button type="primary" size="small" @click="initable2">查 询</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="newServiceClick">新 增</el-button>
      </div>
      <!-- <div class="right-section2">
        <BulkImport class="filter-top-item" :post-url="postUrl" @refreshData="initable" />
      </div>-->
    </div>
    <!-- 表格-->
    <div class="table-css">
      <el-table v-loading="listLoading" :data="tableData" border stripe style="text-align: left">
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index, scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="employeeTypes " label="员工类型" width="700">
          <template slot-scope="scope">
            <span>{{ scope.row.employeeTypes | joinData }}</span>
          </template>
          <!-- <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.employeeTypes" :key="index">{{ item }}，&nbsp;&nbsp;</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createUser" label="创建人" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" style="width:60px;height:30px;" @click="openNext2(scope.$index,scope.row)">复 制</el-button> -->
            <el-button type="primary" size="small" style="width: 60px; height: 30px" @click="open(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 -->
    <div>
      <el-dialog v-dialogDrag title="新增" :visible.sync="editSkillVisible">
        <el-form ref="formName" :rules="rules" :model="formEdit">
          <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
            <el-input v-model="formEdit.name" placeholder="请输入" style="width:80%" />
          </el-form-item>
          <el-form-item prop="id" label="选择员工类型" :label-width="formLabelWidth">
            <el-select v-model="formEdit.id" value-key="id" placeholder="请选择" style="width:80%">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" style="background: #495373; color: white" @click="editSkillVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEditClick('formName')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>-->
  </section>
</template>

<script>
// import BulkImport from '@/components/BulkImport' // 导入
import { initData, removeData, init, selectData, validate } from '@/api/workRulesNew'
export default {
  components: {
    // BulkImport
  },
  filters: {
    joinData: function(val) {
      if (val) {
        return val.toString()
      } else {
        return ''
      }
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        var data2 = {
          businessDomain: this.$route.query.businessDomain || '',
          name: value,
          airportId: this.airport.airportId
        }
        validate(data2).then((res) => {
          if (res.data.code === '200') {
            callback()
          } else {
            callback(new Error(res.data.message))
          }
        })
      }
    }
    return {
      airport: this.$store.state.user.airport,
      offon: false,
      title: '',
      formLabelWidth: '100px',
      editSkillVisible: false,
      listLoading: false,
      options: [],
      input21: '',
      flag: false,
      tableData: [],
      formEdit: { name: '', id: '' },
      postUrl: `${process.env.VUE_APP_BASE_API}` + 'api/v1//prepare/adRule/uploadJsonFile',
      jsonFile: 'jsonFile',
      rules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        id: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {},
  watch: {
    '$store.state.user.airport': {
      deep: true,
      handler(newName, oldName) {
        this.airport = newName
        if (this.$route.query.id) {
          const data = {
            id: this.$route.query.id,
            airportId: this.airport.airportId
          }
          init(data).then((response) => {
            this.tableData = response.data.data
          })
        } else {
          this.initable()
        }
        this.select()
      }
    }
  },
  created() {
    this.select()
    if (this.$route.query.id) {
      const data = {
        id: this.$route.query.id,
        airportId: this.airport.airportId
      }
      init(data).then((response) => {
        this.tableData = response.data.data
      })
    } else {
      this.initable()
    }
  },
  methods: {
    initable() {
      // 查询
      this.listLoading = true
      var data = { name: this.input21, id: this.$route.query.businessDomain || '', airportId: this.airport.airportId }
      initData(data).then((response) => {
        this.tableData = response.data.data
        this.listLoading = false
      })
    },
    initable2() {
      // 查询
      this.listLoading = true
      var data = { name: this.input21, id: this.$route.query.businessDomain || '', airportId: this.airport.airportId }
      initData(data).then((response) => {
        this.$message.success('查询成功')
        this.tableData = response.data.data
        this.listLoading = false
      })
    },
    handleEditClick(formName) {
      // 新建规则文件弹框确认按钮
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.$router.push({ path: '/prepare/workRulesHiddenNew', query: { data: JSON.stringify(this.formEdit), offon: true, businessDomain: this.$route.query.businessDomain || '' }})
        }
      })
    },

    select() {
      const data = {
        id: this.$route.query.businessDomain,
        airportId: this.airport.airportId
      }
      selectData(data).then((response) => {
        this.options = response.data.data
      })
    },
    openNext(index, row) {
      this.$router.push({ path: '/prepare/workRulesHiddenNew', query: { id: row.id, name: row.name, businessDomain: this.$route.query.businessDomain || '' }})
    },
    openNext2(index, row) {
      this.$router.push({ path: '/prepare/workRulesHiddenNew', query: { id: row.id, name: row.name, businessDomain: this.$route.query.businessDomain || '', type: '复制' }})
    },
    // validateFcn(data) {
    //   var data2 = {
    //     businessDomain: this.$route.query.businessDomain || '',
    //     name: data,
    //     airportId: this.airport.airportId
    //   }
    //   validate(data2).then((res) => {
    //     if (res.data.code === '200') {
    //       this.flag = true
    //     } else {
    //       this.flag = false
    //       this.$message.error(res.data.message)
    //     }
    //   })
    // },
    newServiceClick() {
      // 新建规则文件
      this.title = '新建'
      this.offon = true
      this.editSkillVisible = true
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeData(row.id).then((response) => {
            // debugger
            if (response.data.code == '200') {
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
.app2{
    padding: 0 10px;
}
.app2 /deep/ .el-dialog__body {
  padding: 20px 16% 0 16%;
}
.fileName {
  cursor: pointer;
}
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
.search-file {
  margin-left: 20px;
}
img {
  width: 20px;
  height: 20px;
}
.right-section1,
.right-section2,
.right-section3 {
  display: flex;
  width: 60px;
  height: 80px;
  justify-content: space-around;
  align-items: center;
  font-size: 18px;
  color: white;
  vertical-align: middle;
  margin-left: 14%;
  cursor: pointer;
}
.right-section2 {
  margin-left: 2%;
}
.right-section3 {
  margin-left: 2%;
}
.paginate {
  display: flex;
  width: 100%;
  height: 68px;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: right;
  background-color: #0a142f;
}
.pageFloat {
  display: flex;
  width: 100%;
  padding-top: 10px;
  justify-content: flex-end;
  align-items: center;
}
.pageFloat div {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #232c47;
  color: #989a9c;
}
.version-select {
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}
</style>
