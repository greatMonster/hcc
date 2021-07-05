<template>
  <el-select v-model="regionValue" placeholder="请选择" @change="changeClick">
    <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id" />
  </el-select>
</template>

<script>
export default {
  name: 'Region',
  props: {
    region: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [{ Id: 'D', Name: '国内' }, { Id: 'I', Name: '国际' }, { Id: 'D/I', Name: '国内/国际' }],
      regionValue: this.region
    }
  },
  watch: {
    region: {
      handler: function(ee) {
        this.regionValue = ee
      },
      deep: true
    }
  },
  methods: {
    changeClick(e) {
      this.$emit('changeClick', e)
    }
  }
}
</script>

<style scoped>
</style>
