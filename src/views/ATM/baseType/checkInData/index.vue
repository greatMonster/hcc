<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <!-- <div style="margin-right:20px;">值机柜台</div> -->
        <label>选择站点：</label>
        <el-select v-model="siteId" placeholder="请选择" style="width:150px" size="small" @change="siteChange">
          <el-option v-for="item in optionsSiteId" :key="item.siteId" :label="item.siteName" :value="item.siteId" />
        </el-select>
        <div class="importExcel">
          <el-button size="small" type="info" @click="goPage">新页面</el-button>
        </div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="skillShowTable" border stripe>
        <el-table-column prop="deskName" label="名称" />
        <el-table-column prop="deskCode" label="编码" />
        <el-table-column prop="checkInIsLandBean.islandName" label="岛名" />
        <el-table-column prop="affectedByRule" label="开放类型">
          <template slot-scope="scope">
            <span>{{ scope.row.affectedByRule == "0"?"动态开放":"常开" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deskRegion" label="国内/国际">
          <template slot-scope="scope">
            <span v-if="scope.row.deskRegion=='D'">国内</span>
            <span v-if="scope.row.deskRegion=='I'">国际</span>
            <span v-if="scope.row.deskRegion=='D/I'">国内/国际</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceType" label="高端/经济">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceType=='V'">高端</span>
            <span v-if="scope.row.serviceType=='C'">经济</span>
          </template>
        </el-table-column>
        <el-table-column prop="openTime" label="开放时间">
          <template slot-scope="scope">
            <div v-if="scope.row.times">
              <div v-for="(item,index) in scope.row.times" :key="index">
                <span v-if="item.startTime">{{ item.startTime }} -- {{ item.endTime }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editHandleClick(scope.$index,scope.row)">修 改</el-button>
            <el-button type="primary" size="mini" @click="open(scope.$index,scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改技能弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" width="40%">
        <el-form ref="formEdit" :model="formEdit" :rules="rules">
          <el-form-item prop="deskName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.deskName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="deskCode" label="编码：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.deskCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="islandId" label="岛名：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.islandId" placeholder="请选择">
              <el-option v-for="item in islandName" :key="item.islandId" :label="item.islandName" :value="item.islandId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="affectedByRule" label="开放类型：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.affectedByRule" placeholder="请选择">
              <el-option v-for="item in openType" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="times" label="开放时间：" :label-width="formLabelWidth">
            <el-time-picker v-model="initTime" format="HH:mm:ss" arrow-control="true" value-format="HH:mm:ss" is-range range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
            <span class="addTime" @click="addTimeList">+</span>
            <div v-for="(item,index) in times" :key="index" style="margin:10px 0">
              <el-time-picker v-model="item.time" format="HH:mm:ss" arrow-control="true" value-format="HH:mm:ss" is-range range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
              <span class="addTime" @click="deleteTimeList(index)">-</span>
            </div>
          </el-form-item>
          <el-form-item prop="deskRegion" label="国内/国际：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.deskRegion" placeholder="请选择">
              <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="serviceType" label="高端/经济：" :label-width="formLabelWidth">
            <el-select v-model="formEdit.serviceType" placeholder="请选择">
              <el-option v-for="item in serviceType" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
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
import { find, IsLand, setdesk, removedesk, adddesk, siteList } from '@/api/checkInData'
export default {
  name: 'CheckInData',
  data() {
    return {
      optionsSiteId: [],
      siteId: '',
      initTime: '',
      title: '',
      editSkillVisible: false,
      formLabelWidth: '150px',
      skillShowTable: [],
      formEdit: {},
      times: [],
      options: [
        { Id: 'D', Name: '国内' },
        { Id: 'I', Name: '国际' }
      ],
      openType: [
        { Id: '0', Name: '动态' },
        { Id: '1', Name: '常开' }
      ],
      serviceType: [
        { Id: 'V', Name: '高端' },
        { Id: 'C', Name: '经济' }
      ],
      islandName: [],
      rules: {
        deskName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        deskCode: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        islandId: [{ required: true, message: '请选择岛名', trigger: 'blur' }],
        affectedByRule: [{ required: true, message: '请选择开放类型', trigger: 'blur' }],
        initTime: [{ required: true, message: '请选择开放时间', trigger: 'blur' }],
        // times: [{ required: true, message: '请选择开放时间', trigger: 'blur' }],
        deskRegion: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    // this.initable()
    // this.IsLand()
    this.siteIdList()
  },
  methods: {
    goPage() {
      this.$router.push({ path: '/ATM/baseType/checkInData/indexBackup' })
    },
    timeClick(e) {
      this.initTime = e
    },
    siteIdList() {
      siteList().then(response => {
        this.optionsSiteId = response.data
        this.siteId = response.data[0].siteId
        this.initable()
        this.IsLand()
      })
    },
    siteChange(e) {
      this.siteId = e
      this.initable()
      this.IsLand()
    },
    addTimeList() {
      this.times.push({ time: '' })
    },
    deleteTimeList(index) {
      this.times.splice(index, 1)
    },
    backpage() {
      this.$router.go(-1)
    },
    initable() {
      var data = {
        siteId: this.siteId
      }
      find(data).then(response => {
        this.skillShowTable = response.data
      })
    },
    IsLand() {
      this.islandName = []
      var data = {
        siteId: this.siteId
      }
      // 岛下拉
      IsLand(data).then(response => {
        this.islandName = response.data
      })
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.editSkillVisible = true
      // this.$refs['formEdit'].resetFields()
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit = Object.assign({}, row)
      this.initTime = ''
      // this.times = []
      if (row.times) {
        if (row.times[0]) {
          this.initTime.push(row.times[0].startTime)
          this.initTime.push(row.times[0].endTime)
          if (row.times.length > 1) {
            for (let i = 1; i < row.times.length; i++) {
              this.times.push({ time: [row.times[i].startTime, row.times[i].endTime] })
            }
          }
        }
      }
    },
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      var curTimes = []
      if (this.initTime) {
        curTimes.push({ startTime: this.initTime[0], endTime: this.initTime[1] })
      }
      if (this.times.length > 0) {
        if (this.times[0]) {
          for (let i = 0; i < this.times.length; i++) {
            curTimes.push({ startTime: this.times[i].time[0], endTime: this.times[i].time[1] })
          }
        }
      }
      this.formEdit.times = curTimes
      this.formEdit.siteId = this.siteId
      if (this.title === '修改') {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            setdesk(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
              this.$refs['formEdit'].resetFields()
              this.initTime = ''
              this.times = []
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formEdit'].validate(valid => {
          if (valid) {
            adddesk(this.formEdit).then(response => {
              if (response.code === '200') {
                this.initable()
                this.$message({
                  type: 'success',
                  message: response.message
                })
              }
              this.$refs['formEdit'].resetFields()
              this.initTime = ''
              this.times = []
            })
            this.editSkillVisible = false
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
          removedesk(row).then(response => {
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
.addTime {
  background: #409eff;
  width: 50px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
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
