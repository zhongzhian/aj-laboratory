<template>
  <div style="overflow:auto;height:100%;width:100%;">
    <div class="layout-row">
      <div class="layout-content2">
        <div>
          <Form
            ref="formValidate"
            :model="userInfop"
            :rules="ruleValidate"
            :label-width="200"
          >
            <div class="layout-content-title">账号信息</div>
            <FormItem label="用户名" label-position="top">
              <Input
                v-model="userInfo.userName"
                disabled
                size="small"
                style="width:400px;"
              />
            </FormItem>
            <!-- <FormItem label="密码" prop="ppassword" label-position="top">
              <Input v-model="userInfop.ppassword" size="small" style="width:400px;" />
            </FormItem>-->
            <FormItem label="头像" label-position="top">
              <Upload
                ref="upload"
                :action="uploadAction"
                :headers="headers"
                :data="uploadData"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
              >
                <img
                  v-if="userInfo.userImage"
                  :src="userInfo.userImage"
                  class="form-user-img"
                />
                <img
                  v-if="!userInfo.userImage"
                  src="static/images/noperson.png"
                  class="form-user-img"
                />
              </Upload>
            </FormItem>
            <div class="layout-content-title">个人信息</div>

            <FormItem label="姓名" prop="personName" label-position="top">
              <Input
                v-model="userInfo.personName"
                size="small"
                placeholder="请输入姓名"
                style="width:400px;"
              />
            </FormItem>
            <FormItem label="性别" prop="sex">
              <Select
                v-model="userInfo.sex"
                placeholder="请选择性别"
                style="width:400px;"
              >
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            <FormItem label="电话" prop="telphone">
              <Input
                v-model="userInfo.telphone"
                placeholder="请输入电话"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem label="民族" prop="minzu">
              <Input
                v-model="userInfo.minzu"
                placeholder="请输入民族"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem label="个人简介" prop="description">
              <Input
                v-model="userInfo.nativePlace"
                placeholder="请输入个人简介"
                style="width:400px;"
              ></Input>
            </FormItem>
            <div v-if="userInfo.userType === '2'" class="layout-content-title">
              职务信息
            </div>
            <div v-if="userInfo.userType === '3'" class="layout-content-title">
              学籍信息
            </div>
            <FormItem
              v-if="userInfo.userType === '2'"
              label="职称"
              prop="title"
            >
              <Input
                v-model="userInfo.title"
                placeholder="请输入职称"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem
              v-if="userInfo.userType === '3'"
              label="学号"
              prop="userKey"
            >
              <Input
                v-model="userInfo.userKey"
                placeholder="请输入学号"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem label="学院" prop="college">
              <Input
                v-model="userInfo.college"
                placeholder="请输入学院"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem
              v-if="userInfo.userType === '3'"
              label="专业"
              prop="major"
            >
              <Input
                v-model="userInfo.major"
                placeholder="请输入专业"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem
              v-if="userInfo.userType === '2'"
              label="系/所"
              prop="major"
            >
              <Input
                v-model="userInfo.major"
                placeholder="请输入系/所"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem
              v-if="userInfo.userType === '3'"
              label="年级"
              prop="grade"
            >
              <Input
                v-model="userInfo.grade"
                placeholder="请输入年级"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem v-if="userInfo.userType === '3'" label="班" prop="class1">
              <Input
                v-model="userInfo.class1"
                placeholder="请输入班"
                style="width:400px;"
              ></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="infoSubmit">保存</Button>
              <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
            </FormItem>

            <div class="layout-content-title">修改密码</div>
            <FormItem label="旧密码" prop="oldpassword" label-position="top">
              <Input
                v-model="userInfop.oldpassword"
                type="password"
                size="small"
                style="width:400px;"
              />
            </FormItem>
            <FormItem label="新密码" prop="newpassword1" label-position="top">
              <Input
                v-model="userInfop.newpassword1"
                type="password"
                size="small"
                style="width:400px;"
              />
            </FormItem>
            <FormItem
              label="确认新密码"
              prop="newpassword2"
              label-position="top"
            >
              <Input
                v-model="userInfop.newpassword2"
                type="password"
                size="small"
                style="width:400px;"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')"
                >确定</Button
              >
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";
import dateformat from "@/utils/dateformat.js";
import jsSHA from "jssha";
import qs from "qs";

export default {
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: "",
        type: "normal"
      },
      showPhotos: false,

      userInfop: { oldpassword: "", newpassword1: "", newpassword2: "" },
      userInfo: {},
      ruleValidate: {
        oldpassword: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newpassword1: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        newpassword2: [
          { required: true, message: "请确认新密码", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    this.userInfo = this.$store.getters.user;
    console.log("this.userInfo", this.userInfo);
  },
  methods: {
    //user_modify
    infoSubmit() {
      this.axios({
        method: "put",
        url: API.index.user_modify,
        data: this.userInfo,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.$store.dispatch("fetchAccount");
            this.$Message.success("保存成功");
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    handleSubmit(name) {
      if (this.userInfop.newpassword1 !== this.userInfop.newpassword2) {
        this.$Message.error("请确认一致的新密码!");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.checkPwd();
        } else {
          this.$Message.error("您的输入有误!");
        }
      });
    },
    checkPwd() {
      const shaObj = new jsSHA("SHA-1", "TEXT");
      let pppassword = this.userInfop.oldpassword;
      shaObj.update(pppassword);
      const para = {
        password: shaObj.getHash("HEX"),
        username: this.userInfo.userName
      };
      this.axios({
        method: "post",
        url: API.login.token,
        data: qs.stringify(para),
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.modifyPwd();
          } else {
            this.$Message.error("旧密码有误！");
          }
        })
        .catch(err => {
          this.$Message.error("旧密码有误！");
        });
    },
    modifyPwd() {
      const shaObj = new jsSHA("SHA-1", "TEXT");
      let pppassword = this.userInfop.newpassword1;
      shaObj.update(pppassword);
      const para = {
        password: shaObj.getHash("HEX")
      };
      this.axios({
        method: "post",
        url: API.login.modifyPassword,
        data: qs.stringify(para),
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.$Message.success("修改成功！");
            this.userInfop = {
              oldpassword: "",
              newpassword1: "",
              newpassword2: ""
            };
          } else {
            this.$Message.error("修改失败！");
          }
        })
        .catch(err => {
          this.$Message.error("修改失败！");
        });
    },
    handleSuccess(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code = 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        this.userInfo.userImage = this.picBasePath + path;
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
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
<style></style>

<style lang="less" scoped>
.demo-upload-div {
  position: relative;
  padding: 10px 0 0 10px;
  max-height: 300px;
  overflow-y: auto;
}
.demo-upload-list2 {
  float: left;
  height: 130px;
  margin: 0 10px 10px 0;
  text-align: center;
  border: 1px solid transparent;
}
.demo-upload-list2 img {
  // width: 100%;
  height: 100px;
}
.demo-upload-list-checkdiv {
  text-align: center;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.alarmDetail-modal {
  .btns {
    margin-bottom: 20px;
    line-height: 50px;
    text-align: center;
    .ivu-btn.ivu-btn-primary {
      border-radius: 1px;
      height: 28px;
      line-height: 28px;
      padding: 0 15px;
      margin-left: 30px;
    }
  }
  .description {
    padding: 15px 25px;
    textarea {
      height: 120px;
      background-color: #161941;
    }
  }
  .ivu-input {
    border: 1px solid rgba(143, 205, 240, 0.25);
    height: 28px;
    background-color: #161941;
    color: #50b5ec;
    border-radius: 1px;
  }
  .table-title {
    height: 50px;
    text-align: left;
    padding-left: 25px;
    border-top: solid 1px rgba(143, 205, 240, 0.25);
    border-bottom: solid 1px rgba(143, 205, 240, 0.25);
    background-color: #1a2440;
    line-height: 50px;
  }
  .table-content {
    background-color: #1a2440;
    margin-bottom: 20px;
    border-bottom: solid 1px rgba(143, 205, 240, 0.25);
    .ivu-row {
      text-align: left;
      line-height: 40px;
      label {
        display: inline-block;
        width: 150px;
        text-align: right;
      }
    }
    .device {
      text-align: center;
      label {
        width: auto;
        padding-left: 8px;
      }
      .ivu-col {
        padding: 10px 0;
      }
    }
    .ivu-row > .ivu-col > span,
    .ivu-row.device > .ivu-col > p > span {
      display: inline-block;
      width: 150px;
      text-align: left;
      color: #50b5ec;
    }
    .ivu-row.device > .ivu-col > p {
      display: inline-block;
      background-color: #161941;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(1) {
      width: auto;
      min-width: 40px;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(2) {
      width: 100px;
      padding-right: 8px;
    }
    .ivu-row.desc {
      label {
        float: left;
      }
      span {
        width: 50%;
        line-height: 20px;
        padding-top: 10px;
      }
    }
  }
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  z-index: 98;
  padding: 20px 15%;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.6;
    z-index: 99;
  }
  .normal-panel-content {
    background-color: rgba(33, 41, 72);
    height: 100%;
    z-index: 100;
    overflow: auto;
  }
  .normal-panel-title {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .ivu-icon {
      float: right;
      font-size: 20px;
      color: red;
      margin-top: 15px;
      cursor: pointer;
    }
  }
}
</style>
