<template>
  <div>
    <form enctype="multipart/form-data" style="display:inline-block" method="post">
      <el-upload ref="upload" :action="postUrl" :name="name" :data="uploadData" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError">
        <el-button slot="trigger" style="background-color:#CE1B57;" size="small" type="primary">
          <span>导 入</span>
        </el-button>
      </el-upload>
    </form>
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
export default {
  props: {
    postUrl: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
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
      loadExcel: '',
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
      this.$emit('refreshData')
      this.$message.success(respose.message)
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
    },
    // 关闭错误提示dialog
    closeDialog(data) {
      this.dialogTableExcelVisible = data
      this.getLeadInData = ''
    }
  }
}
</script>

