<template>
  <div class="skillBox">
    <div class="title">
      <div class="titleWord">
        <!-- <div>所有距离列表</div> -->
        <span style="height:40px">
          请先选择查看一个（分类）：
          <el-select v-model="geographyType" placeholder="机位" :visible-change="catagory" @change="chang">
            <el-option v-for="item in optionsCatagory" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </span>
        <!-- <div class="print">
          <el-button type="info" @click="printClick">打印</el-button>
        </div>
        <div class="importExcel">
          <el-button type="info" @click="importClick">导出为Excel</el-button>
        </div>
        </div>-->
        <div class="addButton">
          <el-button type="primary" size="small" @click="calculateClick">计算</el-button>
        </div>
      </div>
    </div>

    <div class="skillShow">
      <el-table :data="distanceTable" border :header-row-style="{'background-color':'rgb(10, 20, 47)'}" :row-style="{'background-color':'#232c47'}" style="width: 100%;color:white">
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { catagory, initAllDistance, calculateAllDistance } from '@/api/geoPosition'
export default {
  name: 'AllDistance',
  data() {
    return {
      title: '',
      geographyType: '',
      optionsCatagory: [],
      distanceTable: [],
      cols: [
        {
          prop: 'fromLocationName',
          label: '起点'
        },
        {
          prop: 'toLocationName',
          label: '终点'
        },
        {
          prop: 'times',
          label: '距离'
        },
        {
          prop: 'distanceTypeName',
          label: '距离类型'
        }
      ]
    }
  },
  created() {
    this.catagory()
    this.initTable()
  },
  methods: {
    calculateClick() {
      var data = {
        geographyType: this.geographyType || '1'
      }
      calculateAllDistance(data).then(response => {
        if (response.code === '200') {
          this.$message({
            type: 'success',
            message: '计算成功，已刷新列表！'
          })
          this.initTable()
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    initTable() {
      var data = {
        geographyType: this.geographyType || '1'
      }
      initAllDistance(data).then(response => {
        if (response.code === '200') {
          this.distanceTable = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    catagory() {
      catagory().then(response => {
        if (response.code === '200') {
          this.optionsCatagory = response.data
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    chang(e) {
      this.geographyType = e
      this.initTable()
    }
  }
}
</script>

<style scoped>
.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #0a142f;
  font-size: 16px;
}
.titleWord {
  width: 50%;
  display: flex;
  align-items: center;
}
.addButton {
  margin-left: 20px;
}
.print {
  margin-left: 10%;
}
.importExcel {
  margin-left: 2%;
}
.startRule {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #434b61;
  color: white;
}
.endRuleType {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #434b61;
}
.startRuleTitle {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
