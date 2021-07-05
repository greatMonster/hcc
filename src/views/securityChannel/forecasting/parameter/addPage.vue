<template>
  <div class="warp">
    <div class="elsteps">
      <el-steps :active="active" finish-status="success">
        <el-step title="开始" />
        <el-step title="选择安检通道" />
        <el-step title="选择旅客流量" />
        <el-step title="计算结果" />
      </el-steps>
      <div v-if="active === 1" class="cont">
        <stepOne ref="stepOne" />
      </div>
      <div v-if="active === 2" class="cont">
        <stepTwo ref="stepTwo" />
      </div>
      <div v-if="active === 3" class="cont">
        <stepThree ref="stepThree" />
      </div>
      <div v-if="active === 4" class="cont">
        <stepFour ref="stepFour" :add-param-id-jump="addParamIdJump" />
      </div>
      <div class="foot">
        <el-button v-if="active != 1" type="primary" size="small" @click="previous">上一步</el-button>
        <el-button v-if="active == 1 || active == 2" type="primary" size="small" @click="next">下一步</el-button>
        <el-button v-if="active == 3 && !routerId" type="primary" size="small" @click="add()">计 算</el-button>
        <el-button v-if="active == 3 && routerId" type="primary" size="small" @click="editData()">计 算</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getMessage } from '@/utils/errors'
import stepOne from './components/stepOne'
import stepTwo from './components/stepTwo'
import stepThree from './components/stepThree'
import stepFour from './components/stepFour'
import { add, edit } from '@/apiNew/securityChannel'
export default {
  name: 'AddPage',
  components: { stepOne, stepTwo, stepThree, stepFour },
  data() {
    return {
      airport: this.$store.state.user.airport,
      routerId: this.$route.query.id,
      active: 1,
      stepOne: {},
      stepTwo: {},
      detailData: {},
      addParamIdJump: ''
    }
  },
  created() {},
  methods: {
    previous() {
      if (this.active === 4) {
        this.active = 3
      } else if (this.active === 3) {
        this.active = 2
      } else {
        this.active = 1
      }
    },
    next() {
      if (this.active === 1) {
        this.stepOne = this.$refs.stepOne.formEdit
        this.detailData = this.$refs.stepOne.detailData
        this.$refs.stepOne.$refs.formEdit.validate((valid) => {
          if (valid) {
            this.active = 2
          } else {
            this.$message.error('必填参数不能为空')
            return false
          }
        })
        if (this.routerId) {
          console.log(this.stepOne)
          localStorage.setItem('edit_stepOne', JSON.stringify(this.stepOne))
        } else {
          localStorage.setItem('stepOne', JSON.stringify(this.stepOne))
        }
      } else if (this.active === 2) {
        this.stepTwo = this.$refs.stepTwo.formEdit2
        this.deskIds = this.$refs.stepTwo.deskIds
        // this.$refs.stepTwo.$refs.formEdit2.validate(valid => {
        //   if (valid) {
        this.active = 3
        //   } else {
        //     this.$message.error('柜台参数不能为空')
        //     return false
        //   }
        // })
        if (this.routerId) {
          localStorage.setItem('edit_stepTwo', JSON.stringify(this.$refs.stepTwo._data))
        } else {
          localStorage.setItem('stepTwo', JSON.stringify(this.$refs.stepTwo._data))
        }
      }
    },
    add() {
      const obj = JSON.parse(localStorage.getItem('stepOne', JSON.stringify(this.stepOne)))
      obj.deskIds = this.deskIds
      obj.flowIds = this.$refs.stepThree.flowIds
      obj.airportId = this.airport.airportId
      localStorage.setItem('stepThree', JSON.stringify(this.$refs.stepThree._data))
      add(obj)
        .then((response) => {
          this.addParamIdJump = response.data.data.id || '116'
          this.active = 4
        })
        .catch((error) => {
          this.$message.error(getMessage(error))
        })
    },
    editData() {
      const stepOne = JSON.parse(localStorage.getItem('edit_stepOne'))
      const stepTwo = JSON.parse(localStorage.getItem('edit_stepTwo'))
      // stepOne.passRate = stepTwo.formEdit2.passRate
      // stepOne.maxQueuingTime = stepTwo.formEdit2.maxQueuingTime
      // stepOne.minDeskOpenTime = stepTwo.formEdit2.minDeskOpenTime
      stepOne.deskIds = stepTwo.deskIds
      stepOne.flowIds = this.$refs.stepThree.flowIds
      stepOne.id = this.$route.query.id
      stepOne.airportId = this.airport.airportId
      localStorage.setItem('edit_stepThree', JSON.stringify(this.$refs.stepThree._data))
      edit(stepOne)
        .then((response) => {
          this.active = 4
        })
        .catch((error) => {
          this.$message.error(getMessage(error))
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.elsteps {
  padding: 20px;
  .el-steps {
    width: 80%;
    margin: 30px 10%;
  }
  .cont {
    margin: 20px 0;
  }
}
.foot {
  text-align: right;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  background: #172449;
  z-index: 9;
  .el-button {
    margin: 10px;
  }
}
</style>
