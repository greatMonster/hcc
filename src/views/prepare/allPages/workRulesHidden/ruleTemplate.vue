<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <div>添加或编辑规则模板</div>
      </div>
      <div class="addButton">
        <el-button type="primary" size="medium" @click="addContractClick">添 加</el-button>
      </div>
    </div>
    <div class="skillShow">
      <el-table
        border
        :data="contractShowTable"
        :row-class-name="tableRowClassName"
        default-expand-all
      >
        <el-table-column sortable type="index" label="序号" width="50" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <ul class="adRuleTemplates">
              <li v-for="(item,index) in props.row.adRuleTemplates" :key="index">
                <span style="width:40%">{{ item.shortDescription }}</span>
                <span style="width:50%">{{ item.longDescription }}</span>
                <span style="width:8%">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="delteGroupTemplateById(index,item)"
                  >删 除</el-button>
                </span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="规则组名" />
        <el-table-column prop="updateDate" label="创建时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editHandleClick(scope.$index,scope.row)"
            >编 辑</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="delteGroup(scope.$index,scope.row)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改弹框 -->
    <div>
      <el-dialog v-dialogDrag :title="title" :visible.sync="editSkillVisible">
        <el-form ref="formName" :model="formEdit" :rules="rules">
          <el-form-item prop="groupName" label="名称：" :label-width="formLabelWidth">
            <el-input v-model="formEdit.groupName" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="addRuleList" label="规则：" :label-width="formLabelWidth">
            <el-checkbox-group v-for="(item,index) in listData" :key="index" v-model="formEdit.addRuleList">
              <el-checkbox :label="item.adRuleTemplateId">
                {{ item.shortDescription }}
              </el-checkbox>
            </el-checkbox-group>
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
import { getAlltemplates, getGroupTemplateInfo, delteGroup, updateGroup, addGroup, delteGroupTemplateById } from '@/api/setWorkRules'
export default {
  name: 'RuleTemplate',
  data() {
    return {
      rowId: '',
      listData: [],
      title: '',
      editSkillVisible: false,
      formLabelWidth: '120px',
      contractShowTable: [],
      formEdit: { groupName: '', addRuleList: [] },
      rules: {
        groupName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contractTypeDesc: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contractTypeCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.getGroupTemplateInfo()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'warning-row'
    },
    getGroupTemplateInfo() {
      getGroupTemplateInfo().then(response => {
        this.contractShowTable = response.data
      })
    },
    getAlltemplates() { // 获取规则
      getAlltemplates().then(response => {
        this.listData = response.data
      })
    },
    // 添加
    addContractClick() {
      this.title = '添加'
      this.editSkillVisible = true
      this.getAlltemplates()
      this.formEdit.groupName = []
      this.formEdit.addRuleList = []
    },
    // 修改行数据按钮
    editHandleClick(index, row) {
      this.rowId = row.id
      this.title = '编辑'
      this.formEdit.groupName = row.groupName
      this.getAlltemplates()
      this.formEdit.addRuleList = []
      row.adRuleTemplates.forEach(element => {
        this.formEdit.addRuleList.push(element.adRuleTemplateId)
      })
      this.editSkillVisible = true
    },
    // 修改行数据按钮的确定按钮
    handleEditClick(formName) {
      if (this.title === '编辑') {
        this.$refs['formName'].validate(valid => {
          if (valid) {
            var data = {
              id: this.rowId,
              groupName: this.formEdit.groupName,
              templateIds: this.formEdit.addRuleList
            }
            updateGroup(data).then(response => {
              this.getGroupTemplateInfo()
            })
            this.editSkillVisible = false
          }
        })
      } else {
        this.$refs['formName'].validate(valid => {
          if (valid) {
            var data = {
              groupName: this.formEdit.groupName,
              templateIds: this.formEdit.addRuleList
            }
            addGroup(data).then(response => {
              this.getGroupTemplateInfo()
              this.formEdit.addRuleList = []
            })
            this.editSkillVisible = false
          }
        })
      }
    },
    delteGroup(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        delteGroup({ id: row.id }).then(response => {
          this.getGroupTemplateInfo()
        })
      }).catch(() => {
      })
    },
    delteGroupTemplateById(index, row) {
      this.$confirm('确认删除这条数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        var data = {
          groupTempId: row.groupTempId
        }
        delteGroupTemplateById(data).then(response => {
          this.getGroupTemplateInfo()
        })
      }).catch(() => {
      })
    }

  }
}
</script>

<style scoped lang="scss">
form {
  padding-top: 20px;
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
.adRuleTemplates{
  list-style: none;
  margin: 0;
  padding: 0;
  li,h3{
    span{
      display:inline-block;
      padding: 0 20px
    }
  }
  li{background: #27355d;margin: 2px;padding: 2px; text-align: left;}
  h3{
    background: #121f44;
    padding: 10px;
    margin: 0;
    font-size: 14px;
  }
}
</style>
