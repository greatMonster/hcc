<template>
  <el-select v-model="serviceType" placeholder="请选择" @change="changeServiceClick">
    <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id" />
  </el-select>
</template>

<script>
export default {
  name: 'ServiceType',
  props: {
    service: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [{ Id: 'V', Name: '高端' }, { Id: 'C', Name: '经济' }, { Id: 'C/V', Name: '经济/高端' }],
      serviceType: this.service
    }
  },
  watch: {
    service: {
      handler: function(ee) {
        this.serviceType = ee
      },
      deep: true
    }
  },
  methods: {
    changeServiceClick(e) {
      this.$emit('changeServiceClick', e)
    }
  }
}
</script>

<style scoped>
</style>
