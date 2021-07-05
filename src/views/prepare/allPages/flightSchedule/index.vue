<template>
  <div style="margin-top:60px">
    <div class="header-search">
      <div class="search-file">
        <!-- <el-input v-model="input21" size="small" style="width:260px" clearable placeholder="输入文件名称" type="text" suffix-icon="el-icon-search" @clear="clear" /> -->
        <el-select v-model="input21" placeholder="请选择文件名称" style="width:185px;" filterable clearable size="small">
          <el-option v-for="item in optionsCover" :key="item.documentId" :label="item.name" :value="item.documentId">
            <span>
              <el-popover trigger="hover" placement="left">
                <p>将于2020年5月4日更新为夏秋航班计划</p>
                <div slot="reference">{{ item.name }}</div>
              </el-popover>
            </span>
          </el-option>
        </el-select>
      </div>
      <div style="margin-left:30px;">
        <el-button type="primary" size="small" @click="search">查 询</el-button>
      </div>
      <div class="right-section2">
        <BulkImport class="filter-top-item" :post-url="postUrl" :name="name" @refreshData="initable" />
      </div>
      <div class="right-section2">
        <el-button type="primary" size="small" @click="download">模板</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div v-if="tableData.length<=0" class="blank-style">
      <i class="el-icon-warning" style="font-size:23px;color:red" /> 请先导入文件
    </div>
    <div class="table-css">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="文件名称" width="300">
          <template slot-scope="scope">
            <span class="fileName" @click="openNext(scope.$index,scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="documentType" label="文件类型">
          <template slot-scope="scope">
            <span v-if="scope.row.documentType=='DAY_FLIGHT_SCHEDULE'?true:false">日航班计划</span>
            <span v-if="scope.row.documentType=='CYCLE_FLIGHT_SCHEDULE'?true:false">循环航班计划</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifyTime" label="修改时间" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createUser" label="创建者" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" style="width:60px;height:30px;" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-dialog v-dialogDrag title="关联航班生成" :visible.sync="dialogFormVisible">
      <el-form ref="formName" :model="form" style="margin: 0 auto;width: 50%;" :rules="rules">
        <el-form-item label="机场" prop="tenantId">
          <el-select v-model="form.tenantId" filterable clearable style="width:220px">
            <el-option v-for="item in AirportArry" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="documentId" label="航班计划">
          <el-select v-model="form.documentId" filterable clearable style="width:220px">
            <el-option v-for="item in FlightScheduleArry" :key="item.documentId" :label="item.name" :value="item.documentId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="startDate" label="开始日期">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item prop="endDate" label="结束日期">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div style="width: 15%;margin: 0 auto;">
        <el-button type="primary" @click="handleClick('formName')">生 成</el-button>
      </div>

    </el-dialog>-->
  </div>
</template>

<script>
import BulkImport from '@/components/BulkImport/template' // 导入
import { initTable, remove, search } from '@/api/flightSchedule'
export default {
  name: 'FlightSchedule',
  components: {
    BulkImport
  },
  data() {
    return {
      newOld: true,
      optionsCover: [],
      dialogFormVisible: false,
      fileList: [],
      input21: '',
      value1: '',
      AirportArry: [{ name: '无锡', id: 1 }],
      tableData: [],
      form: {},
      rules: {
        tenantId: [{ required: true, message: '请输入机场名称', trigger: 'blur' }],
        documentId: [{ required: true, message: '请选择航班计划', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      },
      name: 'file',
      FlightScheduleArry: [],
      postUrl: `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/cycleFlightSchedule/cycleFlightPlan'
    }
  },
  computed: {},
  created() {
    this.initable()
  },
  methods: {
    newIn() {
      this.$router.push({ path: '/prepare/allPages/flightScheduleNew' })
    },
    switchChange(val) {
      console.log(val)
    },
    clear() {
      this.initable()
    },
    initable() {
      initTable().then(response => {
        this.tableData = response.data
        this.listLoading = false
        this.optionsCover = response.data
        // this.tableData.forEach(item => {
        //   if (item.documentType == 'CYCLE_FLIGHT_SCHEDULE') {
        //     this.FlightScheduleArry.push(item)
        //   }
        // })
      })
    },
    search() {
      const data = this.optionsCover.find(item => item.documentId === this.input21)
      search(data.name || '').then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    openNext(index, row) {
      this.$router.push({ path: '/prepare/flightPlan', query: { documentId: row.documentId, documentType: row.documentType }})
    },
    download() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + 'api/v1/prepare/cycleFlightSchedule/cycleFile'
    },

    //
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
