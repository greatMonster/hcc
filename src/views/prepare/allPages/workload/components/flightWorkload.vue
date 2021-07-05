<template>
  <section>
    <div class="header-search">
      <div>
        <el-select v-model="value" size="small" placeholder="请选择文件类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="search-file" style="margin-left:30px;">
        <!-- <span>快速搜索文件</span> -->
        <el-input v-model="input21" class="special" placeholder="输入搜索关键字" type="text" size="small" suffix-icon="el-icon-search" />
      </div>
      <div style="margin-left:30px;">
        <el-button type="primary">搜 索</el-button>
      </div>
      <div class="right-section2" @click="newWorkloadClick">
        <i class="el-icon-download" style="color:#00B4DD;font-size:16px" />
        <span>新建</span>
      </div>
      <div class="right-section2">
        <i class="el-icon-download" style="color:#00B4DD;font-size:16px" />
        <el-upload>导入</el-upload>
      </div>
      <div class="right-section3">
        <i class="el-icon-refresh" style="color:#00B4DD;font-size:16px" />
        <span>刷新</span>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-css">
      <el-table :data="tableData" :row-style="tableRowStyle" :header-cell-style="{'background':'#0A142F'}" border style="width: 100%">
        <el-table-column prop="fileName" label="文件名" width="180" />

        <el-table-column prop="files" label="文件夹" width="180" />
        <el-table-column prop="modifyDate" label="修改日期" />
        <el-table-column prop="fileSize" label="文件大小" />
        <!-- <el-table-column prop="file-version" label="选择文件版本">
          <template slot-scope="scope">
            <div class="version-select">
              <el-select v-model="value" @click.native.prevent="selectVersion(scope.$index,tableData)" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="paginate">
      <div class="pageFloat">
        <div>‹</div>
        <div style="background:#00B4DD;margin-left: 10px">1</div>
        <div style="margin-left: 10px">2</div>
        <div style="margin-left: 10px">›</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FlightWorkload',
  data() {
    return {
      options: [{ value: '选项1', label: '文件一' }, { value: '选项2', label: '文件二' }, { value: '选项3', label: '文件三' }],
      value: '全部文件夹',
      input21: '',
      // options: [
      //   {
      //     value: '选项1',
      //     label: 'version1.0'
      //   },
      //   {
      //     value: '选项2',
      //     label: 'version1.1'
      //   },
      //   {
      //     value: '选项3',
      //     label: 'version1.2'
      //   },
      //   {
      //     value: '选项4',
      //     label: 'version1.3'
      //   }
      // ],
      // value: '',
      tableData: [
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        },
        {
          fileName: 'readingBook.doc',
          files: '/root/test',
          modifyDate: '2018-12-22 15:30',
          fileSize: '45K'
        }
      ]
    }
  },
  computed: {},
  methods: {
    newWorkloadClick() {
      this.$router.push({ path: 'workloadHidden' })
    },
    // 修改table tr行的背景色
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #232C47;color: rgb(191, 203, 217)'
    },
    // 修改table header的背景色
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      console.log(rowIndex)
      if (rowIndex === 0) {
        return 'background-color: #0A142F;color: #989a9c;font-weight: 500;'
      }
    },
    selectVersion(index, data) {
      console.log(index)
      console.log(data)
    }
  }
}
</script>

<style scoped>
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
  margin-left: 5%;
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
