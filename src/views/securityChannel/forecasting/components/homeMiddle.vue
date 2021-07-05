<template>
  <div class="search">
    <el-card :body-style="{ padding: '0px' }" class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="float: right;" size="small" type="primary" @click="paraModify">修 改</el-button>
      </div>
      <div class="seach-content">
        <!-- <div class="search-content-item">
            <div style="width:33%;letter-spacing:1px">
              值机处理速率(人/小时)
              <span style="color: #87a054">{{ passRate }}</span>
            </div>
            <div style="width:33%;letter-spacing:1px">
              最大排队时间(分钟)
              <span style="color: #87a054">{{ maxQueuingTime }}</span>
            </div>
            <div style="width:33%;letter-spacing:1px">
              柜台最小开放时间(分钟)
              <span style="color: #87a054">{{ minDeskOpenTime }}</span>
            </div>
        </div>-->
        <div class="search-content-item">
          <div class="item1">值机处理速率(人/小时)</div>
          <div class="item2">
            <span style="color: #87a054">&nbsp;{{ parameters.passRate }}</span>
          </div>
        </div>
        <div class="search-content-item">
          <div class="item1">最大排队时间(分钟)</div>
          <div class="item2">
            <span style="color: #87a054">&nbsp;{{ parameters.maxQueuingTime }}</span>
          </div>
        </div>
        <div class="search-content-item">
          <div class="item1">柜台最小开放时间(分钟)</div>
          <div class="item2">
            <span style="color: #87a054">&nbsp;{{ parameters.minDeskOpenTime }}</span>
          </div>
        </div>
        <div class="search-content-item">
          <div class="item1">旅客流量名称</div>
          <div class="item2" style="color: #87a054">
            <span v-for="(item, index) in parameters.travelorName" :key="index" class="travelor-style" @click="travelorJump(index,item.id)">{{ item.name }}</span>
          </div>
        </div>
        <div class="search-content-item itemLast">
          <div class="item1">值机柜台列表</div>
          <div class="item2" style="color: #87a054">
            <div v-if="parameters.deskList">
              <div v-if="parameters.deskList.length>5">
                <span v-for="(item, index) in parameters.deskList.slice(0, 5)" :key="index" class="desk-style">{{ item.name }}</span>
                <span>…</span>
              </div>
              <div v-else>
                <div v-if="parameters.deskList.length!=0">
                  <span v-for="(item, index) in parameters.deskList" :key="index" class="desk-style">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeMiddle',
  props: {
    baseData: {
      type: Object,
      required: true,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      parameters: {}
    }
  },
  watch: {
    baseData: {
      handler: function() {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    initData() {
      this.parameters = this.baseData
    },
    travelorJump(index, travelorId) {
      this.$router.push({ path: '/newcheckIn/detailsPage', query: { id: travelorId } })
    },
    paraModify() {
      this.$emit('modifyClick')
    }
  }
}
</script>

<style scoped>
.search {
  background-color: #172449;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}
.search /deep/ .el-card {
  background-color: #2d3a5e;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
}
.search /deep/ .el-card__header {
  padding: 10px 20px;
  border-bottom: 1px solid #425079;
}
.seach-content {
  width: 96%;
  height: 100%;
  padding: 10px 10px;
  margin: 0 auto;
}
.bottom-nodata {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
.search-content-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}
.search-content-item .item1 {
  width: 20%;
  letter-spacing: 1px;
}
.search-content-item .item2 {
  width: 80%;
  letter-spacing: 1px;
}
.itemLast {
  margin-bottom: 10px;
}
.travelor-style {
  padding-left: 5px;
  color: #8ba0ef;
}
.travelor-style:hover {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.desk-style {
  padding-left: 5px;
}
.card-button {
  text-align: center;
  border-top: 1px solid #425079;
  padding: 10px 0;
}
.chart-search {
  margin-bottom: 15px;
}
.waitTime {
  cursor: pointer;
  text-align: center;
  font-size: 13px;
}
.waitTime:hover {
  text-decoration: underline;
  color: #6f9fd0;
}
</style>
