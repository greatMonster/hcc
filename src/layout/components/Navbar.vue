<template>
  <div class="navbar" :style="{ backgroundColor: headerBgColor }">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div>

        <el-select v-model="airport" value-key="airportId" @change="changeAirportId">
          <el-option v-for="item in options" :key="item.airportId" :label="item.airportName" :value="item" />
        </el-select>
      </div>
      <div class="topbtn">
        <span>{{ currentDate }}</span>
        <!-- <span>日报</span>
        <span>周报</span>
        <span>月报</span>
        <span>运行健康度</span>-->
        <!-- <span @click="linkTo">航班动态</span> -->
        <!-- <span>航班计划</span> -->
      </div>
      <div class="topSelect">
        <!-- <lang-select class="right-menu-item hover-effect" style="color:#fff" /> -->
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span>
              <svg-icon icon-class="loginUser" class="user-avatar" />
            </span>
            <span>{{ userInfo.username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>{{ userInfo.name }}</el-dropdown-item>
            <!-- <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>-->
            <el-dropdown-item divided>
              <span style="display: block" @click="logout">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import Breadcrumb from '@/components/Breadcrumb'
import LangSelect from '@/components/LangSelect'
import Hamburger from '@/components/Hamburger'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect
  },
  data() {
    return {
      currentDate: '',
      airport: {},
      options: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo']),
    headerBgColor() {
      return this.$store.state.settings.headerBgColor
    }
  },
  created() {
    this.getTime()
    this.options = this.userInfo.role.airports
    if (Cookies.get('SET_AIRPORT')) {
      this.airport = JSON.parse(Cookies.get('SET_AIRPORT'))
    } else {
      this.airport = this.options[0]
    }
    this.$store.dispatch('user/changeAirport', this.airport)
  },
  methods: {
    linkTo() {
      this.$router.push({ path: '/RTM/flightDynamics' })
    },
    getTime() {
      setInterval(() => {
        this.currentDate = new Date().toLocaleString()
      }, 1000)
    },
    changeAirportId() {
      this.$store.dispatch('user/changeAirport', this.airport)
      this.$store.dispatch('user/getRouter', this.airport.airportId)
      this.$router.push('/')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('是否登出吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$store
            .dispatch('user/logout')
            .then(() => {
              this.$router.push({ path: this.redirect || '/login' })
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>
<style>
 .right-menu /deep/  input{
        border:none;
        background: #151c3a;
    }

</style>
<style lang="scss" scoped>
.topbtn {
    display: flex;
    align-items: center;
  color: #fff;
  height: 60px;
  font-size: 14px;
  margin-right: 15px;
  span {
    // background: #151c3a;
    line-height: 60px;
    padding: 0 10px;
    margin-right: 1px;
    cursor: pointer;
    float: left;
    &:hover {
      background: #2d3958;
    }
  }
}
.topSelect{
       display: flex;
    align-items: center;
}
.navbar {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // background: #151c3a;
  height: 60px;
  overflow: hidden;
  .logo {
    margin-top: 11px;
    float: left;
  }
  .title {
    color: #fff;
    margin-top: 23px;
    display: inline-block;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
         display: flex;
      justify-content:flex-end;
    height: 100%;
    align-items: center;
    input{
        border:none;
        background: #151c3a;
    }

    &:focus {
      outline: none;
    }
    div {
      display: inline-block;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        span {
          vertical-align: text-bottom;
          display: inline-table;
          color: #fff;
          margin: 0 10px;
        }

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 16px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
}
</style>
