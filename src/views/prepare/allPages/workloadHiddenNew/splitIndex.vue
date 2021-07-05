<template>
  <div class="body">
    <el-alert type="info" effect="dark">
      <div class="explanation">拆分功能是用于将单个工作量根据时间拆分为两个工作量。</div>
      <div>- 如某员工技能未定义拆分时间段，则不做拆分</div>
    </el-alert>
    <splitWorkload :document-id="documentId" />
  </div>
</template>

<script>
import splitWorkload from './components/splitWorkload'

export default {
  name: 'SplitIndex',
  components: { splitWorkload },
  data() {
    return {
      documentId: this.$route.query.documentId
    }
  }
}
</script>

<style scoped>
.body {
  font-size: 14px;
}

.body /deep/ .el-alert--info.is-dark {
  background-color: #2d3a5e;
  letter-spacing: 1px;
  font-size: 14px;
  margin: 10px 0;
}

.explanation {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
</style>
