<template>
  <div>
    <el-table :data="tableList" :span-method="arraySpanMethod" border height="500" :cell-class-name="tableRowClassName" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="date" label="日 期"> </el-table-column>
      <el-table-column prop="mealTime" label="用餐时间"> </el-table-column>
      <el-table-column prop="employeeName" label="姓 名"> </el-table-column>
      <el-table-column prop="employeeCode" label="工 号"> </el-table-column>
      <el-table-column prop="organizationName" label="部 门"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  // 定义属性
  data() {
    return {
      tableList: this.tableData,
      // colSpan: {}
      orderIndexArr: [],
      orderTimeIndexArr: [],
      hoverOrderArr: []
    }
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {
    // ...mapGetters(['userPermissions', 'buttonType'])
  },
  // 监控data中的数据变化
  watch: {
    tableData: {
      handler(newValue) {
        this.tableList = newValue
      },
      deep: true
    }
  },
  created() {
    this.getOrderNumber()
  },
  // 方法集合
  methods: {
    // 获取相同编号的数组
    getOrderNumber() {
      const orderObj = {}
      const timeObj = {}
      this.tableList.forEach((item, index) => {
        item.rowIndex = index
        if (orderObj[item.date]) {
          orderObj[item.date].push(index)
        } else {
          orderObj[item.date] = []
          orderObj[item.date].push(index)
        }
        let mealDateTime = item.mealTime + item.date
        if (timeObj[mealDateTime]) {
          timeObj[mealDateTime].push(index)
        } else {
          timeObj[mealDateTime] = []
          timeObj[mealDateTime].push(index)
        }
      })
      // 将数组长度大于1的值 存储到this.orderIndexArr（也就是需要合并的项）
      Object.keys(orderObj).forEach((key) => {
        if (orderObj[key].length > 1) {
          this.orderIndexArr.push(orderObj[key])
        }
      })
      Object.keys(timeObj).forEach((key) => {
        if (timeObj[key].length > 1) {
          this.orderTimeIndexArr.push(timeObj[key])
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(22)
      if (columnIndex === 1) {
        for (let i = 0; i < this.orderIndexArr.length; i += 1) {
          let element = this.orderIndexArr[i]
          for (let j = 0; j < element.length; j += 1) {
            let item = element[j]
            if (rowIndex === item) {
              if (j === 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              }
              if (j !== 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
      if (columnIndex === 2) {
        for (let i = 0; i < this.orderTimeIndexArr.length; i += 1) {
          let element = this.orderTimeIndexArr[i]
          for (let j = 0; j < element.length; j += 1) {
            let item = element[j]
            if (rowIndex === item) {
              if (j === 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              }
              if (j !== 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // let arr = this.hoverOrderArr
      // for (let i = 0; i < arr.length; i++) {
      //   if (rowIndex == arr[i]) {
      //     return 'hovered-row'
      //   }
      // }
    },
    cellMouseEnter(row, column, cell, event) {
      // this.rowIndex = row.rowIndex
      // this.hoverOrderArr = []
      // this.OrderTimeIndexArr.forEach((element) => {
      //   if (element.indexOf(this.rowIndex) >= 0) {
      //     this.hoverOrderArr = element
      //   }
      // })
    },

    cellMouseLeave(row, column, cell, event) {
      // this.rowIndex = '-1'
      // this.hoverOrderArr = []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
</style>