<template>
  <!-- 主页布局 element-ui Container 布局容器实现 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo" src="~assets/img/logo.png" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        :style="{
          width: isCollapse ? '64px' : '200px',
        }"
      >
        <!-- 折叠与展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#ffffff"
          text-color="#202124"
          active-text-color="#d93025"
          class="el-menu-vertical-demo"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            :style="{
              'border-right': isCollapse ? 'solid 1px #e6e6e6' : 'none',
            }"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 侧边栏路由改造 :index="'/' + subItem.path" -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="el-menu-item"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 子路由 /welcome-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
    }
  },
  methods: {
    // 获取所有菜单
    async getMenuList() {
      // 请求菜单数据
      const { data: res } = await this.$http.get('menus')
      // 请求数据失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 退出
    logout() {
      this.$confirm('即将退出登录状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 清空 sessionStorage
          window.sessionStorage.clear()

          // 重定向到登录页
          this.$router.push('login')

          // 提示
          this.$message({
            type: 'success',
            duration: 1000,
            message: '退出成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            duration: 1000,
            message: '您已取消退出!',
          })
        })
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
  // 生命周期函数
  created() {
    this.getMenuList()
  },
}
</script>
<style lang="less">
//设置了默认左边框为白色
.el-submenu .el-submenu__title {
  border-left: #fff solid 6px;
}
//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover {
  border-left: #33a2ef solid 6px !important;
  background-color: #e2eff9 !important;
  color: #38b2ff !important;
  i {
    color: #38b2ff;
  }
}
</style>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #ffffff;

  // 设置无右侧对齐线
  // .el-menu {
  //   border-bottom: solid 1px #e6e6e6;
  // }
}
.el-main {
  background-color: #ffffff;
}
.logo {
  width: 110px;
  height: 40px;
}

//设置了默认左边框为白色
.el-submenu .el-submenu__title {
  border-left: #fff solid 6px;
}
//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover {
  border-left: #33a2ef solid 6px !important;
  background-color: #e2eff9 !important;
  color: #38b2ff !important;
  i {
    color: #38b2ff;
  }
}
.el-menu-item {
  border-right: solid 1px #e6e6e6;
}
.el-header {
  border-bottom: solid 1px #e6e6e6;
}
.el-menu-item:hover {
  border-left: #33a2ef solid 6px !important;
  background-color: #e2eff9 !important;
  color: #38b2ff !important;
  i {
    color: #38b2ff;
  }
}
//设置选中el-menu-item时的样式
.el-menu-item.is-active {
  border-left: #33a2ef solid 6px !important;
  background-color: #e2eff9 !important;
  color: #38b2ff !important;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  font-size: 10px;
  line-height: 24px;
  color: #000;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标悬停为小手
  cursor: pointer;
  border-bottom: solid 1px #e6e6e6;
  border-right: solid 1px #e6e6e6;
}
</style>
