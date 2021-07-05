<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :unique-opened="true" :default-active="$router.path" :collapse="isCollapse" :background-color="navBgColor" :text-color="variables.menuText" :active-text-color="navSelectColor" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="(route, i) in routes" :key="i" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      menuData: [],
      routes: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'router']),
    navBgColor() {
      return this.$store.state.settings.navBgColor
    },
    navSelectColor() {
      return this.$store.state.settings.navSelectColor
    },
    // routes() {
    //   // var list = this.router ? this.router : this.$store.state.user.router
    //   var list = JSON.parse(sessionStorage.getItem('SET_ROUTER'))
    //   this.forChildren(list)
    //   return this.menuData
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    '$store.state.user.router': {
      deep: true,
      handler(newName, oldName) {
        console.log(this.$store.state.user.router, 22)
        this.forChildren(this.$store.state.user.router)
        this.routes = this.menuData
        console.log(this.menuData)
      }
    }
  },
  created() {
    this.forChildren(this.$store.state.user.router)
    this.routes = this.menuData
  },
  methods: {
    handleSelect(key, keyPath) {
      sessionStorage.setItem('keyPath', JSON.stringify(keyPath))
    },
    forChildren(data) {
      data.map((item) => {
        item.id = item.id.toString()
        item.path = item.uri ? '/' + item.uri : '/'
        item.meta = {
          title: item.name,
          icon: item.icon ? item.icon : ''
        }
        if (item.children) {
          // 存在children
          item.children = this.filterChild(item.children)
        } else {
          item.children = []
        }
      })
      this.menuData = data
    },
    filterChild(data) {
      data.map((item) => {
        item.id = item.id.toString()
        item.path = item.uri ? '/' + item.uri : '/'
        item.meta = {
          title: item.name,
          icon: item.icon ? item.icon : ''
        }
        if (item.children !== null) {
          this.forChildren(item.children)
        } else {
          item.children = []
        }
      })
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
