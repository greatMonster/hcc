<template>
  <div class="warp">
    <h3>值机柜台实时分布图</h3>
    <div class="tips">
      <label>柜台类别：</label>
      <!-- <el-cascader
        v-model="value"
        :show-all-levels="true"
        size="small"
        :options="options"
        @change="handleChange(value)"
      />-->
      <el-select v-model="intlType" style="width:100px" size="small" placeholder="请选择" @change="handleChange">
        <el-option v-for="item in regions" :key="item.region" :label="item.name" :value="item.region" />
      </el-select>
      <el-button size="small" @click="linktotask">员工视角</el-button>
      <el-button size="small" @click="recalculation">重新计算</el-button>
    </div>

    <div class="top">
      <div>
        <p>开放 / 关闭数</p>
        <p class="num">
          <span class="green">{{ tips.openNumb }}</span>
          / {{ tips.close }}
        </p>
      </div>
      <!-- <div>
        <p>国际高端开放 / 关闭数</p>
        <p class="num">
          <span class="green">15</span> / 3
        </p>
      </div>-->
      <div>
        <p>现场值机人员</p>
        <p class="num">
          <span class="green">{{ tips.openNumb + tips.close }}</span> 人
        </p>
      </div>
      <div>
        <p>当前柜台通道最长排除时间</p>
        <p class="num">
          <span class="green">20</span> 分钟
        </p>
      </div>
      <div>
        <p>
          <span class="open" />:全天开放
          <span class="open2" />:动态开放
        </p>
        <p>
          <svg-icon icon-class="person" />:值班经理
          <span>
            <svg-icon icon-class="diamond" />:高端
          </span>
          <span class="close" />:关闭
        </p>
      </div>
      <div>
        <p>当前时间：</p>
        <p>{{ currentTime }}</p>
      </div>
    </div>
    <div class="manager">
      <svg-icon icon-class="person" class="svgstyle" />经理
    </div>
    <ul v-loading="loading" element-loading-text="计算中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <li v-for="(item,index) in list" :key="index">
        <div class="left">
          <span>{{ item.islandName }}</span>
        </div>
        <div class="right">
          <div v-for="(item2,i) in item.checkInDeskBeans" :key="i" class="item">
            <!-- <p>{{ item2.deskCode }}</p> -->
            <el-tooltip placement="bottom">
              <!-- <div v-if="item2.checkInDeskDutyTaskBean" :class="[{ deskOpenclass: item2.affectedByRule=='1'}, {deskclose:item2.affectedByRule=='0'}]"> -->
              <div v-if="item2.checkInDeskDutyTaskBean" class="deskOpenclass">
                <svg-icon v-if="item2.deskCode=='K14'||item2.deskCode=='H01'" icon-class="heart" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='K01'" icon-class="person" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='K15'" icon-class="soldier" class="svgstyle" />
                <svg-icon v-if="item2.serviceType=='V'" icon-class="diamond" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='J18'||item2.deskCode=='J19' ||item2.deskCode=='B01'" icon-class="jiankong" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='H11'||item2.deskCode=='H12'||item2.deskCode=='H13'||item2.deskCode=='H14'" icon-class="meiguo" class="svgstyle" />
                {{ item2.deskCode }}
                <br />
                {{ item2.deskNum }}
              </div>
              <div v-else class="deskclass">
                <svg-icon v-if="item2.deskCode=='K01'" icon-class="person" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='K14'||item2.deskCode=='H01'" icon-class="heart" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='K15'" icon-class="soldier" class="svgstyle" />
                <svg-icon v-if="item2.serviceType=='V'" icon-class="diamond" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='J18'||item2.deskCode=='J19'||item2.deskCode=='B01'" icon-class="jiankong" class="svgstyle" />
                <svg-icon v-if="item2.deskCode=='H11'||item2.deskCode=='H12'||item2.deskCode=='H13'||item2.deskCode=='H14'" icon-class="meiguo" class="svgstyle" />
                {{ item2.deskCode }}
              </div>
              <div slot="content">
                <p>
                  值班员：
                  <span v-if="item2.checkInDeskDutyTaskBean">{{ item2.checkInDeskDutyTaskBean.employeeGroupName }}</span>
                </p>
                <p>
                  工作时间：
                  <span v-if="item2.checkInDeskDutyTaskBean">{{ item2.checkInDeskDutyTaskBean.planStarTime |joinDate }} - {{ item2.checkInDeskDutyTaskBean.planEndTime |joinDate }}</span>
                </p>
              </div>
            </el-tooltip>
            <p>{{ item2.deskRegion }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { distribution, recalculation } from '@/api/checkInData'
export default {
  name: 'CheckIn',
  filters: {
    joinDate: function(value) {
      value = value.substring(11, 16)
      return value
    }
  },
  data() {
    return {
      currentTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      startTime: dayjs()
        .subtract(5, 'hour')
        .toString(),
      objectClass: {
        deskOpenclass: true,
        deskclose: true,
        deskclass: true
      },
      loading: false,
      intlType: 'D',
      regions: [{ name: '国内经济', region: 'D' }, { name: '国际经济', region: 'I' }, { name: '高端', region: 'D/I' }],
      list: [],
      deskRegion: 'D',
      serviceType: 'C',
      tips: {
        openNumb: '',
        close: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      //
      var data = {
        deskRegion: this.deskRegion,
        serviceType: this.serviceType
      }
      this.loading = true
      this.list = []
      distribution(data).then(response => {
        this.list = response.data
        this.loading = false
        let cont = 0
        let close = 0
        response.data.forEach(element => {
          element.checkInDeskBeans.forEach(element2 => {
            // const time = dayjs(element2.openTime).hour() * 60 * 60 + dayjs(element2.openTime).minute() * 60 + dayjs(element2.openTime).second()
            // const now = dayjs().hour() * 60 * 60 + dayjs().minute() * 60 + dayjs().second()
            // if (element2.checkInDeskDutyTaskBean) {
            //   element2.deskOpen = true
            //   this.objectClass.deskOpenclass = true
            // } else {
            //   element2.deskOpen = false
            // }
            if (element2.deskOpen) {
              cont++
            } else {
              close++
            }
          })
          // console.log(element, 8888)
        })
        this.tips.openNumb = cont
        this.tips.close = close
      })
    },
    handleChange(value) {
      // 国际国内切换
      if (value === 'D') {
        this.deskRegion = 'D'
        this.serviceType = 'C'
      } else if (value === 'I') {
        this.deskRegion = 'I'
        this.serviceType = 'C'
      } else if (value === 'D/I') {
        this.deskRegion = 'D/I'
        this.serviceType = 'V'
      }
      this.init()
    },
    linktotask() {
      this.$router.push({ path: '/dispatching/checkIn/employeetasks' })
    },
    recalculation() {
      // 重新计算
      this.loading = true
      var data = {
        deskRegion: this.deskRegion,
        serviceType: 2,
        intlType: this.intlType,
        deskServiceType: this.serviceType
      }
      recalculation(data).then(response => {
        this.loading = false
        this.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.manager {
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  width: 65px;
  height: 50px;
  line-height: 50px;
  border: 2px solid #87a054;
  text-align: center;
  color: #87a054;
  margin: 10px 10px 0 10px;
  display: inline-block;
}
.green {
  color: #87a054;
}
.manager {
  .svgstyle {
    top: 2px;
    left: 2px;
  }
}
.svgstyle {
  position: absolute;
  top: 13px;
  left: 12px;
}
.warp {
  color: #fff;
  .tips {
    margin: 0 0 10px 10px;
  }
  h3 {
    text-align: center;
    margin: 0;
  }
  .top {
    margin: 0 10px;
    height: 80px;
    div {
      display: inline-block;
      width: 16%;
      background: #232c47;
      text-align: center;
      padding: 10px 0;
      height: 100%;
      float: left;
      margin-right: 2px;
      padding-top: 12px;
      p {
        margin: 5px 0;
        span {
          margin-left: 15px;
        }
      }
      .num {
        font-size: 25px;
        color: #ccc;
      }
    }
  }
  ul {
    margin: 10px;
    padding: 0;
    min-height: 200px;
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
      flex: 1;
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
          font-size: 12px;
          border-radius: 3px;
          color: #737b91;
        }
        div {
          cursor: pointer;
          border-radius: 3px;
          // border: 3px solid #87a054;
          width: 70px;
          height: 50px;
          text-align: center;
          margin: 10px 8px 0 8px;
          align-items: center;
          display: flex;
          justify-content: center;
          &.deskOpenclass {
            // background: #87a054;
            // color: #fff;
            color: #87a054;
            border: 2px solid #87a054;
            font-weight: bold;
          }
          &.deskclose {
            // background: #b99f70;
            // color: #fff;
            color: #b99f70;
            border: 2px solid #b99f70;
            font-weight: bold;
          }
          &.deskclass {
            // background: #babbbf;
            // color: #666;
            color: #babbbf;
            border: 2px solid #babbbf;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.open {
  width: 10px;
  height: 10px;
  background: #87a054;
  display: inline-block;
  border-radius: 3px;
}
.open2 {
  width: 10px;
  height: 10px;
  background: #b99f70;
  display: inline-block;
  border-radius: 3px;
}
.close {
  width: 10px;
  height: 10px;
  background: #babbbf;
  display: inline-block;
  border-radius: 3px;
}
</style>