<template>
  <div style="margin-top:60px">
    <h3 v-if="intlType=='D'">国内安检通道班组视图</h3>
    <h3 v-if="intlType=='I'">国际安检通道班组视图</h3>
    <ul>
      <p style="margin:0 5px">
        班组数：{{ employeeGroup }}
        <label>国际/国内：</label>
        <el-select v-model="intlType" style="width:100px" size="small" placeholder="请选择" @change="change2">
          <el-option v-for="item in regions" :key="item.region" :label="item.name" :value="item.region" />
        </el-select>
      </p>
      <li v-for="(item,index) in list" :key="index">
        <div class="left">
          <span>
            {{ item.employeeGroupName }}
            <br />
            <b>工时利用率：{{ Math.round(item.rate*100) }}%</b>
          </span>
        </div>
        <div class="right">
          <div v-for="(item2,i) in item.employeeGroupSecurityBeans" :key="i" class="item">
            <div>
              <p>{{ item2.securityName }}</p>
              <p>({{ item2.planStarTime.substring(11,16) }} - {{ item2.planEndTime.substring(11,16) }})</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { ByEmployeeGroup } from '@/api/securitychannel'
export default {
  name: 'StaffView',
  data() {
    return {
      intlType: this.$route.query.intlType,
      list: [],
      employeeGroup: '',
      regions: [{ name: '国内', region: 'D' }, { name: '国际', region: 'I' }]
    }
  },

  created() {
    this.ByEmployeeGroup()
  },
  methods: {
    ByEmployeeGroup() {
      this.list = []
      ByEmployeeGroup(this.intlType).then(response => {
        if (response.data.length > 0) {
          this.list = response.data
          this.employeeGroup = response.data.length
        } else {
          this.$message.success('暂无数据')
        }
      })
    },
    change2(item) {
      this.intlType = item
      this.ByEmployeeGroup()
    }
  }
}
</script>
<style lang="scss" scoped>
h3 {
  text-align: center;
  margin: 0;
}
ul {
  margin: 10px;
  padding: 0;
  label {
    font-weight: normal;
    margin-left: 50px;
  }
}
li {
  margin-bottom: 10px;
  list-style: none;
  display: flex;
  background: #232c47;
  div.left {
    background: #172449;
    text-align: center;
    margin-right: 10px;
    position: relative;
    flex: 2;
    b {
      font-weight: normal;
      font-size: 12px;
      color: #858d75;
    }
    span {
      position: absolute;
      left: 0;
      top: 50%;
      bottom: 0;
      right: 0;
      margin-top: -10px;
    }
  }
  div.right {
    padding: 10px;
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    flex: 20;
    .item {
      position: relative;
      // border-bottom: 1px solid #62697e;
      p {
        margin: 5px;
      }
      div {
        border-radius: 3px;
        padding: 10px;

        background: #87a054;
        text-align: center;
        color: #fff;
        margin: 10px 10px 0 10px;
        align-items: center;
        display: flex;
        justify-content: center;
        &.close {
          background: #babbbf;
          // border: 3px solid #666;
          color: #666;
        }
      }
    }
  }
}
</style>
