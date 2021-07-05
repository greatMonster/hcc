<template>
  <div>
    <!-- <div> -->
    <form enctype="multipart/form-data" style="display:inline-block" method="post">
      <el-upload ref="upload" :action="postUrl" :name="file" :data="uploadData" :show-file-list="false" :headers="headersData" :before-upload="beforeAvatarUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :on-progress="childMethod">
        <el-button slot="trigger" style="background-color:#CE1B57;" size="small" type="primary">
          <span>导 入</span>
        </el-button>
      </el-upload>
    </form>
    <!-- </div> -->
    <!-- 模板导入数据错误时提示 -->
    <leadInExcelPrompt v-if="dialogTableExcelVisible" :lead-in-datas-from-parent="getLeadInData" @closeDialog="closeDialog" />
    <el-dialog title="导出" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="文件名" :label-width="formLabelWidth">
          <el-input v-model="form.fileName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { getToken } from '@/utils/auth'
// import noteMsg from '@/const/noteMsg'
// import LeadInExcelPrompt from '@/components/LeadInExcelPrompt'// 导出错误时提示
// import { upload } from '@/api/flightSchedule'
export default {
  // components: { LeadInExcelPrompt },
  // props: ['postUrl'],
  props: {
    postUrl: {
      type: String,
      default: ''
    },
    headersData: {
      type: Object,
      default: function() {}
    }
  },

  data() {
    return {
      formLabelWidth: '120px',
      form: { fileName: '文件名', documentId: this.$route.query.documentId },
      dialogFormVisible: false,
      uploadData: {
        documentName: 'documentName'
      },
      file: 'file',
      loadExcel: '',
      // token_object: { Authorization: 'Bearer ' + getToken() },
      dialogTableExcelVisible: false,
      getLeadInData: ''
    }
  },
  mounted() {},
  methods: {
    // 导入模板之前
    beforeAvatarUpload(file) {
      this.uploadData.documentName = file.name
    },
    // 导入成功
    handleUploadSuccess(respose, file, fileList) {
      if (respose.code === '200') {
        // 数据导入成功刷新数据
        this.$parent.$parent.$parent.fullscreenLoading = false

        // this.dialogFormVisible = true
        // if (respose.data.countAll > respose.data.countFail) {
        this.$emit('refreshData')
        // }

        this.$message({
          type: 'success',
          message: respose.message
        })
      } else {
        this.$message({
          title: '失败',
          message: respose.message,
          type: 'error',
          duration: 2000
        })
        this.$parent.$parent.$parent.fullscreenLoading = false
      }
    },
    childMethod() {
      this.$parent.$parent.$parent.fullscreenLoading = false
    },

    // 模板导入失败
    handleUploadError(err, file, fileList) {
      console.log('err========模板导入失败====================')
      console.log(err)
      this.$message({
        title: '失败',
        message: '失败',
        type: 'error',
        duration: 2000
      })
      this.$parent.$parent.$parent.fullscreenLoading = false
    },
    // 关闭错误提示dialog
    closeDialog(data) {
      this.dialogTableExcelVisible = data
      this.getLeadInData = ''
    }
  }
}
</script>

