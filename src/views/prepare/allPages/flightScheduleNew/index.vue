<template>
  <div style="margin-top:60px">
    <div class="header-search">
      <div class="search-file" style="padding:0 20px">
        <el-autocomplete v-model="state2" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" />
        <!-- <el-input v-model="input21" size="small" style="width:260px" clearable placeholder="输入文件名称" type="text" suffix-icon="el-icon-search" @clear="clear" /> -->
        <!-- <el-select v-model="input21" placeholder="请选择文件名称" style="width:40%;" filterable clearable size="small" value-key="documentId">
          <el-option v-for="item in optionsCover" :key="item.documentId" :label="item.name" :value="item">
            <span>
              <el-popover v-if="item.tips" trigger="hover" placement="right">
                <p>{{ item.tips }}</p>
                <div slot="reference">{{ item.name }}</div>
              </el-popover>
              <span v-else>
                {{ item.name }}
              </span>
            </span>
          </el-option>
        </el-select> -->
        <!-- <el-select v-model="planType" filterable clearable size="small" style="margin-left:10px;width:40%;" placeholder="航班计划类型">
          <el-option v-for="item in planTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
      </div>
      <div style="margin-left:30px;">
        <el-button type="primary" size="small" @click="search">查 询</el-button>
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="importClick">导 入</el-button>
        <!-- <BulkImport v-loading.fullscreen.lock="fullscreenLoading" class="filter-top-item" :post-url="postUrl" element-loading-text="正在导入" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @refreshData="initable"> -->
        <!-- <BulkImport class="filter-top-item" :post-url="postUrl" :name="name" @refreshData="initable" /> -->
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="formloadDialog=true">模板下载</el-button>
      </div>

    </div>
    <!-- 表格 -->
    <div v-if="tableData.length<=0" class="blank-style">
      <i class="el-icon-warning" style="font-size:23px;color:red" /> 请先导入文件
    </div>
    <div class="switchBtn" style="">
      <el-switch v-model="newOld" active-text="本航季航班计划" inactive-text="历史航季航班计划" @change="switchChange" />
    </div>
    <div class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="文件名称" width="300">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="documentType" label="文件类型" />
        <el-table-column prop="startDate" label="航班计划开始时间" />
        <el-table-column prop="endDate" label="航班计划结束时间" />
        <el-table-column prop="lastModifyTime" label="修改时间" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createUser" label="创建者" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="height:30px;" @click="editFcn(scope.$index,scope.row)">修改名称</el-button>
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-dialogDrag title="航班计划导入" :visible.sync="importDialog">
      <el-form ref="formName" :model="form" style="margin: 0 auto;width: 50%;" :rules="rules">
        <el-form-item prop="documentType" label="航班计划类型">
          <el-select v-model="form.documentType" style="width:220px">
            <el-option v-for="item in planTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择文件">
          <BulkImport v-show="form.documentType==='CYCLE_FLIGHT_SCHEDULE'" class="filter-top-item" :post-url="postUrl" :headers-data="headersData" :conditions="form" :name="name" @refreshData="initable" />
          <BulkImport v-show="form.documentType==='DAY_FLIGHT_SCHEDULE'" class="filter-top-item" :post-url="postUrl2" :conditions="form" :name="name" :headers-data="headersData" @refreshData="initable" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-dialogDrag title="航班计划模板下载" :visible.sync="formloadDialog">
      <el-form ref="formName" :model="formload" style="margin: 0 auto;width: 50%;" :rules="rules">
        <el-form-item prop="documentType" label="航班计划类型">
          <el-select v-model="formload.documentType" style="width:220px">
            <el-option v-for="item in planTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <ExcelExport v-show="formload.documentType==='CYCLE_FLIGHT_SCHEDULE'" :url-data="urlData" @exportClick="exportClickFcn(status)" />
          <ExcelExport v-show="formload.documentType==='DAY_FLIGHT_SCHEDULE'" :url-data="urlData1" @exportClick="exportClickFcn(status)" />
        </el-form-item>
      </el-form>
    <!-- <div style="width: 15%;margin: 0 auto;">
        <el-button type="primary" @click="handleClick('formName')">生 成</el-button>
      </div>-->
    </el-dialog>
    <el-dialog v-dialogDrag title="航班计划名称修改" :visible.sync="formNameEditDialog">
      <el-form ref="formNameEdit" :model="formNameEdit" :rules="formNamerules">
        <el-form-item prop="name" label="航班计划名称">
          <el-input v-model="formNameEdit.name" size="small" style="width:500px" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formNameEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditClick('formNameEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ExcelExport from '@/components/excel-export'
import BulkImport from '@/components/BulkImport/paramsImport' // 导入
import { remove, initTableNew, editflightScheduleName } from '@/api/flightSchedule'
export default {
  name: 'FlightSchedule',
  components: {
    BulkImport, ExcelExport
  },
  data() {
    return {
      restaurants: [],
      planType: '',
      formloadDialog: false,
      formNameEditDialog: false,
      fullscreenLoading: false,
      formNameEdit: {
        name: ''
      },
      formNamerules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      planTypeOptions: [
        { label: '循环航班计划', value: 'CYCLE_FLIGHT_SCHEDULE' },
        { label: '日航班计划', value: 'DAY_FLIGHT_SCHEDULE' }
      ],
      importDialog: false,
      newOld: true,
      optionsCover: [],
      dialogFormVisible: false,
      fileList: [],
      documentId: '',
      headersData: {
        Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
      },
      state2: '',
      urlData1: `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/cycleFlightSchedule/cycleFile',
      value1: '',
      tableData: [],
      urlData: `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/flightLeg/dayFlightLegTemplate',
      form: { documentType: 'CYCLE_FLIGHT_SCHEDULE', airportId: this.$store.state.user.airport.airportId },
      formload: { documentType: 'CYCLE_FLIGHT_SCHEDULE' },
      rules: {
        tenantId: [{ required: true, message: '请选择机场', trigger: 'blur' }],
        planType: [{ required: true, message: '请请选择航班计划类型', trigger: 'blur' }]
      },
      name: 'file',
      postUrl2: `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/flightLeg/importDayFlightLeg',
      postUrl: `${process.env.VUE_APP_BASE_API}` + 'prepare/api/v1/flightSchedule/list/add',
      airport: this.$store.state.user.airport
    }
  },
  computed: {},
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
  },
  mounted() {
    this.restaurants = this.optionsCover
  },
  methods: {
    importClick() {
      this.importDialog = true
    },
    switchChange(val) {
      if (val) {
        this.listLoading = true
        this.planType = ''
        this.initable()
      } else {
        this.listLoading = true
        this.planType = ''
        this.initable()
      }
    },
    clear() {
      this.initable()
    },
    editFcn(index, row) {
      this.formNameEditDialog = true
      this.formNameEdit.name = row.name
      this.documentId = row.documentId
    },
    initable() {
      this.importDialog = false
      var data = {
        name: this.state2 || '',
        documentType: this.planType,
        check: this.newOld,
        airportId: this.airport.airportId
      }
      initTableNew(data).then(response => {
        if (response.data.code === '200') {
          this.tableData = response.data.data
          this.listLoading = false
          this.optionsCover = response.data.data
          this.restaurants = this.optionsCover
        }
      })
    },
    handleEditClick() {
      this.$refs['formNameEdit'].validate((valid) => {
        var data = {
          documentId: this.documentId,
          name: this.formNameEdit.name
        }
        editflightScheduleName(data).then(res => {
          if (res.data.code === '200') {
            this.$message.success(res.data.message)
            this.initable()
          } else {
            this.$message.error(res.data.message)
          }
          this.formNameEditDialog = false
        })
      })
    },
    search() {
      var data = {
        name: this.state2 || '',
        documentType: this.planType,
        check: this.newOld,
        airportId: this.airport.airportId
      }
      initTableNew(data).then(response => {
        if (response.data.code === '200') {
          this.tableData = response.data
          this.listLoading = false
        }
      })
    },
    openNext(index, row) {
      if (row.documentTypeEn === 'DAY_FLIGHT_SCHEDULE') {
        this.$router.push({ path: '/prepare/flightPlan', query: { documentId: row.documentId, documentType: row.documentTypeEn }})
      } else {
        this.$router.push({ path: '/prepare/flightPlanNew', query: { documentId: row.documentId, airportId: row.airportId, newOld: this.newOld }})
      }
    },
    exportClickFcn(data) {
      this.formloadDialog = data
    },
    handleSelect(item) {

    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      for (var i = 0; i < results.length; i++) {
        results[i].value = results[i].name
      }
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    open(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          document.onkeydown = function(e) {
            var ev = typeof event !== 'undefined' ? window.event : e
            if (ev.keyCode === 13) {
              return false
            }
          }
          remove(row.documentId).then(response => {
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
    },
    datedifference(sDate1, sDate2) {
      // sDate1和sDate2是2006-12-18格式
      var dateSpan, iDays
      sDate1 = Date.parse(sDate1)
      sDate2 = Date.parse(sDate2)
      dateSpan = sDate2 - sDate1
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays
    }
  }
}
</script>

<style>
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #0a142f !important;
}
</style>

<style scoped>
.fileName {
  cursor: pointer;
}
.switchBtn{
   height:50px;
   width:100%;
   margin-left: 20px;
}
   .switchBtn::before{
            display: inline-block;
            content: "";
            height: 100%;
            vertical-align: middle;
        }
.fileName:hover {
  text-decoration: underline;
  color: #86c5e4;
}
.body {
  width: 100%;
  /* min-height: 1000px; */
  /* margin-top: 60px; */
}

.search-file {
  /* margin-left: 20px; */
  width: 50%;
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
  margin-left: 4%;
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
.blank-style {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: white;
  font-family: '宋体';
  font-size: 25px;
  background-color: #232c47;
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
