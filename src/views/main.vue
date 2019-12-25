<template>
  <div class="layout">
    <Layout>
      <Header style="height:80px;background: #fff;color:#70ac1f;">
        <div>
          <div class="layout-row">
            <div class="layout-content" style="padding: 10px 0;">
              <h4
                @click="gotoHome"
                style="font-size:30px;font-style:italic;line-height: 60px;color:#000;"
                class="header-title"
              >东北大学智慧在线实验课程平台</h4>
              <Button
                @click="gotoCourses"
                size="small"
                class="condition-btn"
                style="border-radius: 5px;margin-left: 20px;margin-top: 14px;"
              >探索</Button>
              <div style="position:absolute;right:20px;top:41px;">
                <div v-if="userInfo" style="float:right;position:relative;">
                  <Menu @on-select="menuSelect" mode="horizontal" active-name="1">
                    <Submenu name="1">
                      <template slot="title">
                        <!-- <Icon class="header-span" type="android-arrow-dropdown" /> -->
                        <span
                          v-if="userInfo"
                          class="header-span"
                          style="margin-right:10px;font-weight:400;"
                        >{{userInfo.personName || userInfo.userName}}</span>
                        <div class="header-adavor">
                          <img
                            v-if="userInfo.userImage"
                            class="header-adavor-img"
                            :src="userInfo.userImage"
                          />
                          <img v-else class="header-adavor-img" src="static/images/noperson.png" />
                        </div>
                      </template>
                      <MenuItem name="logout">退出</MenuItem>
                    </Submenu>
                  </Menu>
                </div>
                <span v-if="userInfo" @click="gotoCenter()" class="header-span">个人中心</span>
                <div v-if="!userInfo" style="float:right;position:relative;">
                  <span v-if="!userInfo" @click="gotoPage('login')" class="header-span">登录</span>
                  <span v-if="!userInfo" class="header-span" style="margin:0 5px;cursor:default;">|</span>
                  <span v-if="!userInfo" @click="gotoPage('register')" class="header-span">注册</span>
                </div>
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
          </div>
        </div>
      </Header>
      <Content>
        <transition>
          <router-view :key="key"></router-view>
        </transition>
      </Content>
      <Footer>
        <div>
          <div class="layout-row">
            <div class="layout-content">
              <Row>
                <Col span="12">
                  <div>
                    <h4 class="footer-title">东北大学智慧在线实验课程平台</h4>
                    <div class="footer-desc">在线内容教学与在线实验的混合式教学平台，不限时间地点的综合性学习平台</div>
                  </div>
                </Col>
                <Col span="5">
                  <!-- <h4 class="footer-title">关于我们</h4>
                  <div class="footer-desc">
                    <span>关于我们</span>
                    <span style="margin-left:20px;">学校云</span>
                  </div>
                  <div class="footer-desc">
                    <span>联系我们</span>
                    <span style="margin-left:20px;">常见问题</span>
                  </div>
                  <div class="footer-desc">
                    <span>意见反馈</span>
                    <span style="margin-left:20px;">法律条款</span>
                  </div>-->
                </Col>
                <Col span="4">
                  <!-- <h4 class="footer-title">关注我们</h4>
                  <div class="footer-desc">
                    <img class="footer-img" src="static/images/weixin.png" />
                    <img class="footer-img" src="static/images/weibo.png" />
                  </div>-->
                </Col>
                <Col span="3">
                  <!-- <h4 class="footer-title">友情链接</h4>
                  <div class="footer-desc">网易卡搭编程</div>
                  <div class="footer-desc">网易云课堂</div>
                  <div class="footer-desc">网易100分</div>-->
                </Col>
              </Row>

              <!-- <div class="footer-copyright" style="margin-top:50px;">
                <span
                  style="font-size:10px;"
                >粤B2-20090191-26 | 京ICP备12020669号-2 | 京公网安备44010602000207</span>
              </div>
              <div class="footer-copyright">
                <span style="font-size:10px;">2014-2019 icourse163.org</span>
              </div>-->
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
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
      this.$router.push({
        name: "home-search",
        query: {
          text: this.searchText
        }
      });
    },
    menuSelect(name) {
      if (name === "logout") {
        this.axios.post(`${API.login.logout}`, null).then(result => {
          this.$store.dispatch("logout");
          // if (result.code === 20000) {
          //   this.$store.dispatch("logout");
          // }
        });
      }
    },
    gotoHome() {
      this.$router.push({ name: "home-index" });
    },
    gotoCourses() {
      this.gotoPage("home-search");
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
      this.$router.push({ name: active });
    }
  }
};
</script>
<style scoped>
.layout {
  /* border: 1px solid #d7dde4; */
  /* background: #151740; */
  position: relative;
  /* border-radius: 4px; */
  overflow: hidden;
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
}
.header-title {
  font-size: 18px;
  font-weight: 700;
  float: left;
  color: #fff;
  cursor: pointer;
}
.header-select {
  float: right;
  width: auto;
  margin: 8px 20px;
}
.header-span {
  font-size: 14px;
  font-weight: 600;
  float: right;
  cursor: pointer;
  line-height: 40px;
}
.header-search {
  float: right;
  width: 300px;
  margin: 4px 20px;
  z-index: 900;
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

