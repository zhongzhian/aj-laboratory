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
          <div class="layout-content" style="padding:30px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <div class="layout-content-title">账号信息</div>
              <!-- <FormItem label="头像" label-position="top">
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <img
                    v-if="formValidate.userImage"
                    :src="formValidate.userImage"
                    class="form-user-img"
                  />
                  <img
                    v-if="!formValidate.userImage"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </FormItem>-->
              <FormItem label="用户名" prop="userName" label-position="top">
                <Input
                  v-model="formValidate.userName"
                  placeholder="请输入用户名"
                  size="small"
                  style="width:400px;"
                />
              </FormItem>
              <FormItem label="密码" prop="password" label-position="top">
                <Input
                  type="password"
                  v-model="formValidate.password"
                  placeholder="请输入密码"
                  size="small"
                  style="width:400px;"
                />
              </FormItem>
              <!-- <FormItem label="确认密码" prop="password" label-position="top">
              <Input type="password" v-model="formValidate.password" placeholder="请输入密码" size="small" style="width:400px;" />
              </FormItem>-->
              <div class="layout-content-title">个人信息</div>

              <FormItem label="姓名" prop="personName" label-position="top">
                <Input
                  v-model="formValidate.personName"
                  size="small"
                  placeholder="请输入姓名"
                  style="width:400px;"
                />
              </FormItem>
              <FormItem label="性别" prop="sex">
                <Select v-model="formValidate.sex" placeholder="请选择性别" style="width:400px;">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
              <FormItem label="电话" prop="telphone">
                <Input v-model="formValidate.telphone" placeholder="请输入电话" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="民族" prop="minzu">
                <Input v-model="formValidate.minzu" placeholder="请输入民族" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="籍贯" prop="nativePlace">
                <Input v-model="formValidate.nativePlace" placeholder="请输入籍贯" style="width:400px;"></Input>
              </FormItem>
              <div class="layout-content-title">学籍信息</div>
              <FormItem label="学号" prop="userKey">
                <Input v-model="formValidate.userKey" placeholder="请输入学号" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="学院" prop="college">
                <Input v-model="formValidate.college" placeholder="请输入学院" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="专业" prop="major">
                <Input v-model="formValidate.major" placeholder="请输入专业" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="年级" prop="grade">
                <Input v-model="formValidate.grade" placeholder="请输入年级" style="width:400px;"></Input>
              </FormItem>
              <FormItem label="班" prop="class1">
                <Input v-model="formValidate.class1" placeholder="请输入班" style="width:400px;"></Input>
              </FormItem>
              <!-- <FormItem label="用户账号" prop="userName">
                <Input v-model="formValidate.userName" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="姓名" prop="personName">
                <Input v-model="formValidate.personName" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="formValidate.password" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="性别" prop="sex">
                <Select v-model="formValidate.sex" placeholder="Select your city">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
              <FormItem label="电话" prop="telphone">
                <Input v-model="formValidate.telphone" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="用户标识" prop="userKey">
                <Input v-model="formValidate.userKey" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="学院" prop="college">
                <Input v-model="formValidate.college" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="年级" prop="grade">
                <Input v-model="formValidate.grade" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="班" prop="class1">
                <Input v-model="formValidate.class1" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="专业" prop="major">
                <Input v-model="formValidate.major" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="民族" prop="minzu">
                <Input v-model="formValidate.minzu" placeholder="Enter your name"></Input>
              </FormItem>
              <FormItem label="籍贯" prop="nativePlace">
                <Input v-model="formValidate.nativePlace" placeholder="Enter your e-mail"></Input>
              </FormItem>-->
              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </FormItem>
            </Form>
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
import API from "@/api";
export default {
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },
      formValidate: {
        class1: "",
        college: "",
        forumForbidden: 0,
        grade: "",
        major: "",
        minzu: "",
        nativePlace: "",
        password: "",
        personName: "",
        sex: "男",
        telphone: "",
        title: "",
        userImage: "",
        userKey: "",
        userName: "",
        userType: "3"
      },
      ruleValidate: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        userKey: [
          {
            required: true,
            message: "请输入学号",
            trigger: "blur"
          }
        ],
        college: [
          {
            required: true,
            message: "请输入学院",
            trigger: "blur"
          }
        ],
        major: [
          {
            required: true,
            message: "请输入专业",
            trigger: "blur"
          }
        ],
        grade: [
          {
            required: true,
            message: "请输入年级",
            trigger: "blur"
          }
        ],
        class1: [
          {
            required: true,
            message: "请输入班",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    gotoHome() {
      this.$router.push({ name: "home-index" });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$store.dispatch("register", this.formValidate);
          // this.axios.post(`${API.login.register}`, this.formValidate).then(result => {
          //   console.log(API.login.register, result);
          //   if (result.code === 20000) {

          //   }
          // });
        } else {
          // this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleSuccess(res, file, fileList) {
      if ((res.code = 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.formValidate.userImage = file.url;
      }
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    }
  }
};
</script>

<style lang="less" scoped>
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

