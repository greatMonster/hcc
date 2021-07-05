<template>
  <div class="wrapper">
    <div style="width:50%">
      <el-dialog id="login" v-el-drag-dialog title="登录" :append-to-body="true" :visible.sync="dialogTableVisible" :show="show" @close="$emit('update:show', false)">
        <div>asdfasfddsf</div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
// import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
// import waves from '@/directive/waves' // 水波纹指令
export default {
  name: '',
  directives: {
    // waves, elDragDialog
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogTableVisible: this.show
    }
  },
  computed: {
  },
  watch: {
    show() {
      this.dialogTableVisible = this.show
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

