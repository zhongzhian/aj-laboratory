<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">查询</Button>
    </div>
    <div>
      <b-table
        :height="tableheight"
        @on-select="rowSelect"
        @on-row-click="rowClick"
        @page-data-change="currentChange"
        :pageData="pageData1"
        :columns="columns1"
        :dataSource="data1"
      ></b-table>
    </div>

    <Drawer
      title="用户"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户头像" label-position="top">
                <!-- <img v-if="newObj.userImage" :src="newObj.userImage" class="form-user-img" /> -->
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
                  style="display: inline-block;vertical-align: top;"
                >
                  <!-- <Button icon="ios-cloud-upload-outline">选择用户头像</Button> -->
                  <img v-if="newObj.userImage" :src="newObj.userImage" class="form-user-img" />
                  <img
                    v-if="!newObj.userImage"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户标识" prop="userKey" label-position="top">
                <Input v-model="newObj.userKey" placeholder="请输入用户标识(身份证号、学号、教师编号)" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户名" prop="userName" label-position="top">
                <Input v-model="newObj.userName" placeholder="请输入用户名" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="电话" label-position="top">
                <Input v-model="newObj.telphone" placeholder="请输入电话" />
              </FormItem>
            </Col>
          </Row>
          <Row v-if="newObj.id" :gutter="32">
            <Col span="12">
              <FormItem label="密码" label-position="top">
                <div style="margin-top: 35px;">如果不填，则不会修改</div>
                <Input v-model="passwordd" type="password" placeholder="请输入密码" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="确认密码" label-position="top">
                <div style="margin-top: 35px;">确认密码必须与密码一致</div>
                <Input v-model="passwordd2" type="password" placeholder="请再次输入密码" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="姓名" prop="personName" label-position="top">
                <Input v-model="newObj.personName" placeholder="请输入姓名" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="性别" label-position="top">
                <Select v-model="newObj.sex" placeholder="请选择用户类型">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="民族" label-position="top">
                <Input v-model="newObj.minzu" placeholder="请输入民族" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="籍贯" label-position="top">
                <Input v-model="newObj.nativePlace" placeholder="请输入籍贯" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户类型" label-position="top">
                <Select v-model="newObj.userType" placeholder="请选择用户类型">
                  <Option value="2">老师</Option>
                  <Option value="3">学生</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem v-if="newObj.userType === '2'" label="职称" label-position="top">
                <Input v-model="newObj.title" placeholder="请输入职称" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="学院" label-position="top">
                <Input v-model="newObj.college" placeholder="请输入学院" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="专业" label-position="top">
                <Input v-model="newObj.major" placeholder="请输入专业" />
              </FormItem>
            </Col>
          </Row>
          <Row v-if="newObj.userType === '3'" :gutter="32">
            <Col span="12">
              <FormItem label="年级" label-position="top">
                <Input v-model="newObj.grade" placeholder="请输入年级" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="班" label-position="top">
                <Input v-model="newObj.class1" placeholder="请输入班" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </div>
    </Drawer>

    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选用户吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";
import jsSHA from "jssha";

export default {
  data() {
    return {
      tableheight: 300,
      // nopersonUrl:'static/images/noperson.png',
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },
      imgName: "",
      visible: false,

      pppassword: "",
      modal_loading: false,
      searchText: "",
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户头像",
          width: 90,
          align: "left",
          key: "userImage",
          render: (h, params) => {
            if (params.row.userImage) {
              return h("img", {
                class: "list-user-img",
                attrs: {
                  src: params.row.userImage
                }
              });
            } else {
              return h("img", {
                class: "list-user-img",
                attrs: {
                  src: "static/images/noperson.png"
                }
              });
            }
          }
        },
        {
          title: "用户账号",
          key: "userName"
        },
        {
          title: "用户类型",
          width: 90,
          align: "center",
          key: "userType",
          render: (h, params) => {
            let str = "--";
            if (params.row.userType === "1") {
              str = "管理员";
            } else if (params.row.userType === "2") {
              str = "老师";
            }
            if (params.row.userType === "3") {
              str = "学生";
            }
            return h("span", str);
          }
        },
        {
          title: "姓名",
          key: "personName"
        },
        // {
        //   title: "职称",
        //   key: "title"
        // },
        // {
        //   title: "学院",
        //   key: "college"
        // },
        // {
        //   title: "年级",
        //   key: "grade"
        // },
        // {
        //   title: "班",
        //   key: "class1"
        // },
        // {
        //   title: "专业",
        //   key: "major"
        // },
        // {
        //   title: "民族",
        //   key: "minzu"
        // },
        // {
        //   title: "籍贯",
        //   key: "nativePlace"
        // },
        {
          title: "操作",
          width: 90,
          key: "forumForbidden",
          render: (h, params) => {
            if (params.row.forumForbidden === 1) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        this.user_forumForbidden(params.row.id, 0);
                      }
                    }
                  },
                  "解除"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        this.user_forumForbidden(params.row.id, 1);
                      }
                    }
                  },
                  "禁言"
                )
              ]);
            }
          }
        }
      ],
      data1: [],
      selection: [],
      showAddNew: false,
      showDelete: false,
      passwordd: "",
      passwordd2: "",
      newObj: {
        class1: "",
        college: "",
        forumForbidden: 0,
        grade: "",
        major: "",
        minzu: "",
        nativePlace: "",
        password: "123456",
        personName: "",
        sex: "男",
        telphone: "",
        title: "",
        userImage: "",
        userKey: "",
        userName: "",
        userType: "2"
      },
      ruleValidate: {
        userKey: [
          { required: true, message: "请输入用户标识", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        personName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };

    const shaObj = new jsSHA("SHA-1", "TEXT");
    let pppassword = "123456";
    shaObj.update(pppassword);
    this.pppassword = shaObj.getHash("HEX");
    this.getTableDatas();
  },
  methods: {
    user_forumForbidden(userid, status) {
      this.axios
        .post(`${API.index.user_forumForbidden}` + userid + "/" + status, null)
        .then(result => {
          if (result.code === 20000) {
            this.getTableDatas();
          }
        });
    },
    currentChange(v) {
      console.log("v", v);
      this.pageData1.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize
      };
      this.axios.post(`${API.index.user_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          this.data1 = result.result.list;
        }
      });
    },
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$store.dispatch("register", this.formValidate);
          switch (name) {
            case "formValidate":
              _this.addSubmit();
              break;
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    delItem() {
      if (this.selection.length < 1) {
        this.$Message.error("请先选择要删除的用户");
        return;
      }
      this.showDelete = true;
    },
    delSubmit() {
      let ids = [];
      ids = this.selection.map(s => s.id);
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: API.index.user,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showDelete = false;
            this.modal_loading = false;
            this.getTableDatas();
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    addItem() {
      this.newObj = {
        class1: "",
        college: "",
        forumForbidden: 0,
        grade: "",
        major: "",
        minzu: "",
        nativePlace: "",
        password: this.pppassword,
        personName: "",
        sex: "男",
        telphone: "",
        title: "",
        userImage: "",
        userKey: "",
        userName: "",
        userType: "2"
      };
      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newObj.id) {
        method = "put";
        if (this.passwordd) {
          if (this.passwordd !== this.passwordd2) {
            this.$Message.error("请确认一致的新密码!");
            return;
          }
          const shaObj = new jsSHA("SHA-1", "TEXT");
          shaObj.update(this.passwordd);
          this.newObj.password = shaObj.getHash("HEX");
        }
      }
      this.axios({
        method: method,
        url: API.index.user,
        data: this.newObj,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddNew = false;
            this.getTableDatas();
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    rowSelect(selection, row) {
      this.selection = selection;
    },
    rowClick(item, index) {
      this.newObj = item;
      this.showAddNew = true;
    },
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.userImage = file.url;
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
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
<style>
.ivu-upload-drag {
  background: transparent !important;
}
</style>

<style lang="less" scoped>
</style>
