<template>
  <div class="layout2">
    <div class="layout2-header">
      <h4 @click="gotoHome" class="header-title">东北大学智慧在线实验课程平台</h4>
      <!-- <div v-if="userInfo" style="float:right;position:relative;">
        <span
          class="header-span"
          style="margin-right:20px;font-weight:400;"
        >{{userInfo.personName || userInfo.userName}}</span>
        <div class="header-adavor">
          <img v-if="userInfo.userImage" class="header-adavor-img" :src="userInfo.userImage" />
          <img v-else class="header-adavor-img" src="static/images/noperson.png" />
        </div>
      </div>
      <span v-if="userInfo" class="header-span">个人中心</span>
      <span v-if="!userInfo" @click="gotoPage('login')" class="header-span">登录</span>
      <span v-if="!userInfo" class="header-span" style="margin:0 5px;cursor:default;">|</span>
      <span v-if="!userInfo" @click="gotoPage('register')" class="header-span">注册</span>-->

      <Button
        @click="gotoCourses"
        size="small"
        class="condition-btn"
        style="border-radius: 5px;margin-left: 10px;"
      >探索</Button>
      <div v-if="userInfo" style="float:right;position:relative;">
        <Menu @on-select="menuSelect" mode="horizontal" theme="dark" active-name="1">
          <Submenu name="1">
            <template slot="title">
              <!-- <Icon class="header-span" type="android-arrow-dropdown" /> -->
              <span
                v-if="userInfo"
                class="header-span"
                style="margin-right:10px;font-weight:400;"
              >{{userInfo.personName || userInfo.userName}}</span>
              <div class="header-adavor">
                <img v-if="userInfo.userImage" class="header-adavor-img" :src="userInfo.userImage" />
                <img v-else class="header-adavor-img" src="static/images/noperson.png" />
              </div>
            </template>
            <MenuItem name="logout">退出</MenuItem>
          </Submenu>
        </Menu>
      </div>
      <span v-if="userInfo" @click="gotoCenter" class="header-span">个人中心</span>
      <div v-if="!userInfo" style="float:right;position:relative;">
        <span v-if="!userInfo" @click="gotoPage('login')" class="header-span">登录</span>
        <span v-if="!userInfo" class="header-span" style="margin:0 5px;cursor:default;">|</span>
        <span v-if="!userInfo" @click="gotoPage('register')" class="header-span">注册</span>
      </div>
      <Input
        v-model="searchText"
        class="header-search"
        search
        enter-button
        @on-enter="doSearch"
        @on-click="doSearch"
      />
    </div>
    <div class="layout2-content">
      <transition>
        <router-view :key="key"></router-view>
      </transition>
    </div>

    <!-- <Layout>
      <Header>
        <div>
          <div class="layout-row">
            <div class="layout-content2">
              <h4 class="header-title">东北大学智慧在线实验课程平台</h4>
              <div class="header-adavor">
                <img class="header-adavor-img" src="static/images/noperson.png" />
              </div>
              <span class="header-span">个人中心</span>
              <Input class="header-search" search enter-button placeholder="Enter something..." />
            </div>
          </div>
        </div>
      </Header>
      <Content>
        <transition>
          <router-view :key="key"></router-view>
        </transition>
      </Content>
    </Layout>-->
  </div>
</template>
<script>
// import appmenuconfig from "../utils/AppMenuConfig";
import API from "@/api";
export default {
  data() {
    return {
      // appmenuconfig: appmenuconfig.menu_level_one,
      searchText: "",
      userInfo: null
    };
  },
  computed: {
    key() {
      // console.log("this.$route", this.$route);
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
  },
  methods: {
    doSearch(params) {
      // console.log("searchText", this.searchText);
      this.$router.push({
        name: "home-search",
        query: {
          text: this.searchText
        }
      });
    },
    gotoCourses() {
      this.gotoPage("home-search");
    },
    menuSelect(name) {
      if (name === "logout") {
        this.axios.post(`${API.login.logout}`, null).then(result => {
          if (result.code === 20000) {
            this.$store.dispatch("logout");
            // this.$router.push({ name: "login" });
          }
        });
      }
    },
    gotoHome() {
      this.$router.push({ name: "home-index" });
    },
    gotoCenter() {
      if (this.userInfo) {
        let name = "";
        switch (this.userInfo.userType) {
          case "1":
            // admin
            name = "manage-system";
            break;
          case "2":
            // 老师
            name = "manage-config";
            break;
          case "3":
            // 学生
            name = "manage-center";
            break;
          case "0":
            // 访客
            name = "manage-guest";
            break;
        }
        if (name) {
          this.gotoPage(name);
        }
      }
    },
    gotoPage(active) {
      this.$router.push({ name: active });
    },
    selectClick(name) {
      this.selectValue = name;
    },
    changeMenu(active) {
      console.log(",,,,,,", active);
      //this.$emit("on-change", active);
      this.$router.push({ name: active });
    }
  }
};
</script>
<style scoped>
.layout2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.layout2-header {
  position: relative;
  background: #2c323e;
  color: #fff;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 10px;
}
.layout2-content {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
}
.layout-logo {
  /* width: 100px;
    height: 30px; */
  float: left;
  position: relative;
  margin-top: 5px;
}
.layout-nav {
  width: 100%;
}
.ivu-layout-header {
  background: #2c323e;
  color: #fff;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding-left: 10px;
}
.header-title {
  font-size: 18px;
  font-weight: 700;
  float: left;
  color: #fff;
  cursor: pointer;
}
.header-select {
  float: left;
  width: auto;
  margin: 8px 20px;
}
.header-span {
  font-size: 14px;
  font-weight: 600;
  float: right;
  cursor: pointer;
}
.header-search {
  float: right;
  width: 300px;
  margin: 4px 20px;
}
.ivu-layout-footer {
  background: #323334;
  color: #f7f8f9;
  font-size: 12px;
  height: 250px;
}
.footer-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  line-height: 40px;
}
.footer-desc {
  line-height: 25px;
}
.footer-img {
  width: 40px;
  height: 40px;
  margin: 10px 2px;
}
.footer-copyright {
  line-height: 20px;
  font-size: 10px;
  text-align: center;
}
</style>

