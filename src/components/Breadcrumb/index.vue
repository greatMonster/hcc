<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in arryData" :key="index">
        <span class="no-redirect">{{ item.name }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import Cookies from 'js-cookie'
import { initData } from '@/api/Breadcrumb'
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      levelList: null,
      id: '',
      arryData: []
    }
  },
  computed: {
    ...mapGetters(['router'])
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    // this.getBreadcrumb()
  },
  methods: {
    // 面包屑
    // 递归遍历出页面id
    // deepData(arr, url) {
    //   arr.forEach(item => {
    //     if (item.uri === url) {
    //       this.id = item.id
    //       return false
    //     } else {
    //       if (item.children.length) {
    //         this.deepData(item.children, url)
    //       }
    //     }
    //   })
    //   for (let i = 0; i < arr.length; i++) {
    //     if (arr[i].uri == url) {
    //       return arr[i].id
    //     } else {
    //       if (arr[i].children.length) {
    //         this.deepData(arr[i].children, url)
    //       }
    //     }
    //   }
    // },
    getBreadcrumb() {
      if (this.$store.state.userStore.IDs.data) {
        this.id = this.$store.state.userStore.IDs.data // 获取页面id
      } else {
        this.id = Cookies.get('ids') // 获取页面id
      }
      //   this.deepData(this.router, this.$route.fullPath)
      initData(this.id || '').then(res => {
        this.arryData = [{ path: '/dashboard', name: '首页' }].concat(res.data.data)
        var len = this.arryData.length
        var browserTitle = this.arryData[len - 1].name + '-' + this.arryData[len - 2].name
        sessionStorage.setItem('browserTitle', browserTitle)
        this.$store.commit('changTitle', browserTitle)
      })
      // only show routes with meta.title
      //   let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      //   const first = matched[0]

      //   if (!this.isDashboard(first)) {
      //     matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      //   }

      //   this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    // isDashboard(route) {
    //   const name = route && route.name
    //   if (!name) {
    //     return false
    //   }
    //   return name.trim().toLocaleLowerCase() === '首页'.toLocaleLowerCase()
    // },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      // const { redirect, path } = item
      // if (redirect) {
      //   this.$router.push(redirect)
      //   return
      // }
      // this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;
  a {
    color: #97a8be;
  }
  .no-redirect {
    color: #fff;
    cursor: text;
  }
}
</style>
