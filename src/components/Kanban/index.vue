<template>
  <div class="board-column">
    <table>
      <tr>
        <th>姓名</th>
        <th>地址</th>
      </tr>
      <draggable :list="list" v-bind="$attrs" :set-data="setData">
        <tr v-for="element in list" :key="element.id">
          <td> {{ element.name }}</td>
          <td>{{ element.id }}</td>
        </tr>
      </draggable>
    </table>

  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

