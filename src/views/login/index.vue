<template>
  <div class="layout">
    <Layout>
      <Header>
        <div>
          <div class="layout-row">
            <div class="layout-content">
              <h4 @click="gotoHome" class="header-title">东北大学智慧在线实验课程平台</h4>
              <!-- <Select
                class="header-select"
                v-model="selectValue"
                @on-change="selectClick"
                size="small"
              >
                <Option v-for="item in selectDatas" :value="item" :key="item">{{ item }}</Option>
              </Select>
              <span class="header-span">登录</span>
              <span class="header-span" style="margin:0 5px;">|</span>
              <span class="header-span">注册</span>
              <Input class="header-search" search enter-button placeholder="Enter something..." />-->
            </div>
          </div>
        </div>
      </Header>
      <Content>
        <div class="layout-row">
          <div class="layout-content" style="padding:30px;min-height:500px;">
            <div class="login-content">
              <Form
                style="margin-top: 80px;"
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                :label-width="80"
              >
                <FormItem label="用户名" prop="username">
                  <Input v-model="formValidate.username" autofocus placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <Input
                    v-model="formValidate.password"
                    type="password"
                    placeholder="请输入密码"
                    @on-enter="handleSubmit('formValidate')"
                  ></Input>
                </FormItem>
                <FormItem>
                  <Button
                    :loading="loginLoading"
                    type="primary"
                    @click="handleSubmit('formValidate')"
                  >登录</Button>
                  <Button style="margin-left:20px;" type="primary" @click="gotoRegister">注册新账号</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
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
                <!-- <Col span="5">
                  <h4 class="footer-title">关于我们</h4>
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
                  </div>
                </Col>
                <Col span="4">
                  <h4 class="footer-title">关注我们</h4>
                  <div class="footer-desc">
                    <img class="footer-img" src="static/images/weixin.png" />
                    <img class="footer-img" src="static/images/weibo.png" />
                  </div>
                </Col>
                <Col span="3">
                  <h4 class="footer-title">友情链接</h4>
                  <div class="footer-desc">网易卡搭编程</div>
                  <div class="footer-desc">网易云课堂</div>
                  <div class="footer-desc">网易100分</div>
                </Col>-->
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
import { canvas } from "@/utils/star";
import { mapState } from "vuex";
let funny = null;
export default {
  data() {
    return {
      formValidate: {
        username: "",
        password: ""
      },
      ruleValidate: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      loginLoading: ({ app }) => app.loginLoading,
      loginMsg: ({ app }) => app.loginMsg
    })
  },
  mounted() {},
  methods: {
    gotoHome() {
      this.$router.push({ name: "home-index" });
    },
    gotoRegister() {
      this.$router.push({ name: "register" });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$store.dispatch("fetchToken", this.formValidate);
        } else {
          // this.$Message.error("!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-content {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 100px;
  left: 50%;
  padding: 10px;
  border: solid 1px #ccc;
}
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
  float: left;
  width: auto;
  margin: 8px 20px;
}
.header-span {
  font-size: 14px;
  font-weight: 600;
  float: right;
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

