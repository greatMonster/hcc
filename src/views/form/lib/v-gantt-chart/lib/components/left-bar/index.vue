<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item gantt-block-top-space" :style="{height:calTopSpace()+'px'}"/>
    <div class="gantt-leftbar-item" v-for="(data,index) in showDatas" :style="cellHeightStyle" :key="dataKey?data[dataKey]:index">
      <slot :data="data">
        <div class="gantt-leftbar-defalutItem"/>
      </slot>
    </div>
  </div>
</template>

<script>
import dr from '../dynamic-render.js'
export default {
  name: 'LeftBar',
  mixins: [dr],
  props: {
    dataKey: String,
    datas: {
      type: Array,
      required: true
    }
  },
  computed: {
    cellHeightStyle() {
      return {
        'height': `${this.cellHeight}px`
      }
    }
  }
}
</script>
