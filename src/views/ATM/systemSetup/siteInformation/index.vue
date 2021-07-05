<template>
  <div class="site-box">
    <el-tabs type="border-card">
      <el-tab-pane label="站点服务信息">
        <div class="addButton">
          <el-button type="primary" size="medium" @click="addSkillClick">添 加</el-button>
        </div>

        <div class="skillShow">
          <el-table
            :data="skillShowTable"
            border
            stripe
          >
            <el-table-column prop="siteName" label="名称" />
            <el-table-column prop="siteDesc" label="站点描述" />
            <el-table-column prop="siteCode" label="站点编码" />
            <el-table-column prop="siteBean.siteName" label="父站点名称">
              <!-- <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.siteBean" :key="index">
                  {{ item.siteName }}
                </span>
              </template> -->
            </el-table-column>

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

        <!-- 修改弹框 -->
        <div>
          <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible" @close="closeDialog('formEdit')">
            <el-form ref="formEdit" :model="formEdit">
              <el-form-item prop="siteName" label="名称：" :label-width="formLabelWidth">
                <el-input v-model="formEdit.siteName" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="siteDesc" label="站点描述：" :label-width="formLabelWidth">
                <el-input v-model="formEdit.siteDesc" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="siteCode" label="站点编码：" :label-width="formLabelWidth">
                <el-input v-model="formEdit.siteCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="siteBean" label="父站点名称：" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in siteOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item prop="siteBean" label="父站点名称：" :label-width="formLabelWidth">
                <el-drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
                  <el-option v-for="(item,index) in formEdit.siteBean" :key="index" :label="item.siteName" :value="item.siteId" />
                </el-drag-select>
              </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button style="background: #495373;color: white;" @click="editSkillVisible=false">取 消</el-button>
              <el-button type="primary" @click="handleEditClick('formEdit')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="站点地图">
        <div class="site-map">
          <div class="select-map">选择站点地图文件：
            <el-upload
              class="upload-demo"
              action=""
              multiple
              auto-upload
              :limit="3"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
          <div class="graphicxy">
            <div class="status">
              <el-checkbox v-model="checked">启用地理坐标</el-checkbox>
            </div>
            <div class="graphic-input">
              <div class="input-top">
                <div class="top2">
                  <span>偏好设置1</span>
                  <el-input v-model="x1" class="input-class1" placeholder="请输入维度X" />
                  <el-input v-model="y1" class="input-class1" placeholder="请输入维度Y" />
                  <el-input v-model="coordinate1" class="input-class input-long" placeholder="请输入坐标" />
                </div>
                <div class="top3">
                  <span>偏好设置2</span>
                  <el-input v-model="x2" class="input-class1" placeholder="请输入维度X" />
                  <el-input v-model="y2" class="input-class1" placeholder="请输入维度Y" />
                  <el-input v-model="coordinate2" class="input-class input-long" placeholder="请输入坐标" />
                </div>
              </div>
              <div class="input-bottom">
                导入地图参考：
                <el-upload
                  class="upload-demo"
                  action=""
                  multiple
                  auto-upload
                  :limit="3"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
              </div>
            </div>
          </div>
          <div class="submit-button"><el-button type="primary" class="input-class" @click="submitClick2">提交</el-button></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { select, add, remove, set } from '@/api/siteInformation'
export default {
  name: 'SiteInformation',
  data() {
    return {
      siteOptions: [],
      parentSiteId: '',
      value: [],
      rowId: '',
      title: '',
      editSkillVisible: false,
      skillShowTable: [],
      formEdit: { siteName: '', siteDesc: '', siteCode: '', siteBean: '', siteOptions: [] },
      x1: '',
      y1: '',
      coordinate1: '',
      x2: '',
      y2: '',
      coordinate2: '',
      checked: false,
      formLabelWidth: '150px',
      siteForm: { siteName: '', siteCode: '', airCode: '' },
      rules: {
        siteName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        siteCode: [
          { required: true, message: '请选择活动区域', trigger: 'blur' }
        ],
        airCode: [
          { required: true, message: '请填写编码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.select()
  },
  methods: {
    select() {
      select().then(response => {
        this.skillShowTable = response.data
        response.data.forEach(element => {
          this.siteOptions.push({ value: element.siteId, label: element.siteName })
          // skillOptions.push(element.siteBean)
        })
        // console.log(response.data.siteBean)
      })
    },
    // 添加按钮
    addSkillClick() {
      this.title = '添加'
      this.editSkillVisible = true
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.parentSiteId = row.parentSiteId
      this.rowId = row.siteId
      if (row.siteBean !== null) {
        this.value = row.siteBean.siteName
      }
      this.title = '修改'
      this.editSkillVisible = true
      this.formEdit.siteName = row.siteName
      this.formEdit.siteDesc = row.siteDesc
      this.formEdit.siteCode = row.siteCode
      this.formEdit.siteBean = row.siteBean
    },
    edituserbleClick() {},
    // 编辑弹框的确定按钮
    handleEditClick(formName) {
      if (this.title === '修改') {
        // console.log(this.formEdit.siteName, 8888)
        var data2 = {
          'siteId': this.rowId + '',
          'siteName': this.formEdit.siteName,
          'siteDesc': this.formEdit.siteDesc,
          'siteCode': this.formEdit.siteCode,
          'parentSiteId': this.parentSiteId + ''
        }
        set(data2).then(response => {
          // location.reload()
        })
        this.editSkillVisible = false
        this.$refs[formName].resetFields()
      } else {
        // console.log(this.rowId, 7777)
        var data = {
          'siteName': this.formEdit.siteName,
          'siteDesc': this.formEdit.siteDesc,
          'siteCode': this.formEdit.siteCode,
          'parentSiteId': 7 + ''
        }
        add(data).then(response => {
        //   console.log(response)
          if (response.code === '200') {
            // location.reload()
          }
        })
        this.editSkillVisible = false
        this.$refs[formName].resetFields()
      }
    },
    open(index, row) {
      var data2 = {
        'siteId': row.siteId
      }
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        remove(data2).then(response => {
          location.reload()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => {

      })
    },
    submitClick1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('提交成功!')
        } else {
        //   console.log('提交失败!!')
          return false
        }
      })
    },
    submitClick2() {

    }
  }
}
</script>

<style>
.addButton{text-align: right;padding: 20px;padding-bottom: 0}
.el-input__inner {
    text-overflow: ellipsis;
}
</style>

<style scoped>

.site-box {
    min-width: 1000px;
    height: 100%;
    font-size: 14px;
    color: white;
}
.site-form, .site-map {
    width: 100%;
    height: auto;
    display: flex;
    box-sizing: border-box;
    padding: 80px 0;
}
.site-form {
    justify-content: center;
}
.input-class {
    width: 280px;
}
.submit-button {
    margin-top: 90px;
    text-align: center;
}
.site-map {
    flex-direction: column;
}
.select-map, .input-bottom {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
}
.graphicxy {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px 15px;
}
.status {
    width: 100%;
    height: 30px;
    line-height: 30px;
}
.graphic-input {
    width: 100%;
    height: auto;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #434B61;
}
.input-top {
    width: 100%;
    height: 100%;
}
.top1 {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.input-class1 {
    width: 120px;
    margin-left: 7%;
}
.input-long {
    margin-left: 20%;
}
.top2, .top3 {
    min-width: 85%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: center
}
.input-bottom {
    width: 100%;
    height: 50px;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 5px 10px;
}
</style>
