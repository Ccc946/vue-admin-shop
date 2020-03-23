<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt width="40px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 收起侧边栏按钮 -->
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <!-- 侧边栏 -->
        <el-menu
          :default-active="$route.path"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409FFF"
        >
          <el-menu-item index="/homeInfo">
            <i class="el-icon-s-tools"></i>
            <span slot="title">主页信息</span>
          </el-menu-item>

          <el-submenu :index="MenuList.id+''" v-for="(MenuList,index) in MenuLists" :key="index">
            <template slot="title">
              <i :class="iconsName[index]"></i>
              <span>{{MenuList.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+childList.path"
              v-for="childList in MenuList.children"
              :key="childList.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{childList.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      MenuLists: [],
      iconsName: [
        "el-icon-user-solid",
        "el-icon-s-cooperation",
        "el-icon-s-shop",
        "el-icon-s-order",
        "el-icon-s-data"
      ],
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 退出登录，清除token
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 发送请求，获取侧边栏数据
    async getMenuList() {
      const {
        data: { data: res }
      } = await this.$http.get("menus");
      this.MenuLists = res;
    },
    // 控制侧边栏
    togleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scope>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    justify-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  height: 100%;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
