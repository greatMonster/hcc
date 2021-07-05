<template>
  <div id="app2">
    <el-button @click="sent">点击发送</el-button>
  </div>
</template>
<script>

export default {
  name: 'App2',
  data() {
    return {
      websock: null
    }
  },
  created() {
    // 页面刚进入时开启长连接
    this.initWebSocket()
  },
  destroyed: function() {
    // 页面销毁时关闭长连接
    this.websocketclose()
  },
  methods: {
    sent() {
      var message = {
        nickname: '21',
        email: '13132',
        content: 'I'
      }
      this.websock.send(JSON.stringify(message))
    },
    initWebSocket() { // 初始化weosocket
      const wsuri = 'ws://10.23.103.191:18082/api/v1/prepare/shiftPlan/generateShiftPlan'// ws地址
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = function(e) {
        console.log(e)
      }
    },

    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      // 注意：长连接我们是后台直接1秒推送一条数据，
      // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      console.log(redata.value)
    },

    websocketsend(agentData) { // 数据发送
      this.websock.send(agentData)
    },

    websocketclose(e) { // 关闭
      console.log('connection closed (' + e.code + ')')
    }
    // initWebSocket() { // 长连接
    //   const wsuri = 'ws://localhost:18082/api/v1/prepare/shiftPlan/generateShiftPlan'// ws地址
    //   this.websock = new WebSocket(wsuri)
    //   var _this = this
    //   this.websock.onmessage = function(e) {
    //     const redata = JSON.parse(e.data)
    //     if (redata.status === 'connecting') {
    //       console.log('已连接')
    //       this.send(localStorage.parame)
    //     } else if (redata.status === 'complete') {
    //       _this.documentId = redata.documentId
    //       _this.workloadsetting()// 渲染图表
    //     }
    //   }
    // },
  }
}
</script>
