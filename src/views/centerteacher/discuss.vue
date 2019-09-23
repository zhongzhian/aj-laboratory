<template>
  <div>
    <div v-if="subjectInfo">
      <div class="table-condition-btnbar" style="padding: 0;margin-bottom:0;">
        <div class="manage-content-breadcrumb">
          <span
            class="manage-content-breadcrumb-span"
            style="cursor:pointer;"
            @click="subjectInfo = null"
          >全部话题</span>
          <span class="manage-content-breadcrumb-span">></span>
          <span class="manage-content-breadcrumb-span discuss-subject-title">
            {{subjectInfo.title}}
            <span>{{subjectInfo.replyNumber}}回复</span>
          </span>
        </div>
      </div>
      <div class="manage-content-right-content">
        <div class="discuss-subject-main">
          <!-- <div class="discuss-subject-title">
            {{subjectInfo.title}}
            <span>{{subjectInfo.replyNumber}}回复</span>
          </div>-->
          <div class="discuss-subject-content">
            <div class="discuss-content-img">
              <img
                v-if="subjectInfo.userImage"
                class="header-adavor-img"
                :src="subjectInfo.userImage"
              />
              <img v-else class="header-adavor-img" src="static/images/noperson.png" />
            </div>
            <div class="discuss-content-userdiv">
              {{subjectInfo.userName}}
              <span
                style="margin-left:0;"
              >{{convertUser(subjectInfo.userType)}}</span>
              <span>{{subjectInfo.createTime}}</span>
            </div>
            <div class="discuss-content-textdiv">{{subjectInfo.content}}</div>
          </div>
        </div>
        <div class="detail-main">
          <div class="discuss-reply-main">
            <div class="discuss-reply-list">
              <div class="discuss-reply-list-item" :key="item" v-for="(item,index) in data2">
                <div class="discuss-content-img">
                  <img v-if="item.userImage" class="header-adavor-img" :src="item.userImage" />
                  <img v-else class="header-adavor-img" src="static/images/noperson.png" />
                </div>
                <div class="discuss-content-userdiv">
                  {{item.userName}}
                  <span style="margin-left:0;">{{convertUser(item.userType)}}</span>
                  <span>{{item.createTime}}</span>
                  <span>{{item.replyNumber}}回复</span>
                  <span style="cursor:default;" class="replythis">{{item.floorNumber}}楼</span>
                  <span
                    v-if="!isForbid && (userInfo.id != item.userId)"
                    @click="replyTarget = item"
                    class="replythis"
                  >回复此人</span>
                </div>
                <div class="discuss-content-textdiv">
                  <div v-if="item.replayId" class="discuss-content-replytargetdiv">
                    <p style="border-bottom: 1px dotted #ccc;">
                      <span style="margin-left:0;">回复：</span>
                      {{item.replyUserName}}
                      <span
                        v-if="item.replyTarget"
                        style="float:right;"
                      >{{item.replyTarget.floorNumber}}楼</span>
                    </p>
                    <p v-if="item.replyTarget" class="text-ellipsis">{{item.replyTarget.content}}</p>
                    <p
                      v-else
                      @click="getTarget(item,index)"
                      class="text-ellipsis getTarget"
                    >--- 查看内容 ---</p>
                  </div>
                  {{item.content}}
                </div>
              </div>
            </div>
            <div v-if="data2.length>0" class="discuss-reply-page">
              <Page
                :total="pageData1.total"
                :current="pageData1.current"
                :page-size="pageData1.pageSize"
                prev-text="上一页"
                next-text="下一页"
                placement="top"
                @on-change="currentChange"
              />
            </div>
            <div class="discuss-reply-content">
              <div class="discuss-content-img">
                <img v-if="userInfo.userImage" class="header-adavor-img" :src="userInfo.userImage" />
                <img v-else class="header-adavor-img" src="static/images/noperson.png" />
              </div>
              <div
                v-if="replyTarget"
                class="discuss-content-userdiv"
                style="border:none;margin-right: 20px;"
              >
                回复：
                <div class="discuss-content-replytargetdiv">
                  <p style="border-bottom: 1px dotted #ccc;">
                    {{replyTarget.userName}}
                    <span
                      style="margin-left:0;"
                    >{{convertUser(replyTarget.userType)}}</span>
                    <span>{{replyTarget.createTime}}</span>
                    <span @click="replyTarget = null" class="replythis">取消</span>
                  </p>
                  <p class="text-ellipsis">{{replyTarget.content}}</p>
                </div>
              </div>
              <div class="discuss-content-textdiv">
                <Input
                  :disabled="isForbid"
                  type="textarea"
                  v-model="replyContent"
                  :rows="4"
                  placeholder="请输入回复内容"
                />
                <div class="submit-btn-div">
                  <Button
                    :disabled="isForbid"
                    class="submit-btn"
                    type="primary"
                    @click="submitReply"
                  >回复</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="table-condition-btnbar">
        <Button @click="addItem" size="small" class="condition-btn">发布新话题</Button>
        <Button @click="delItem" size="small" class="condition-btn">删除</Button>
        <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
      </div>
      <div>
        <!-- <f-table
          @on-select="rowSelect"
          @on-row-click="rowClick"
          :columns="columns1"
          :dataSource="data1"
        ></f-table>-->
        <b-table
          @page-data-change="currentChange1"
          :pageData="pageData"
          @on-select="rowSelect"
          @on-row-click="rowClick"
          :columns="columns1"
          :dataSource="data1"
        ></b-table>
      </div>
    </div>

    <Drawer
      title="话题"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="newObj.title" size="small" placeholder="请输入标题" />
          </FormItem>
          <FormItem label="内容" prop="content" label-position="top">
            <Input type="textarea" v-model="newObj.content" :rows="4" placeholder="请输入内容" />
          </FormItem>
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
        <p>确定删除所选话题吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";
import dateformat from "@/utils/dateformat.js";

export default {
  data() {
    return {
      isForbid: false,
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      subjectInfo: null,
      replyTarget: null,
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      columns1: [
        {
          title: "标题",
          key: "title"
        },
        {
          title: "内容",
          minWidth: 400,
          ellipsis: true,
          tooltip: true,
          key: "content"
        },
        {
          title: "回复数",
          width: 80,
          align: "center",
          key: "replyNumber"
        },
        {
          title: "作者",
          width: 80,
          align: "center",
          key: "userName"
        },
        {
          title: "操作",
          width: 120,
          key: "forumForbidden",
          render: (h, params) => {
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
                      this.showReply(params.row, params.index);
                    }
                  }
                },
                "查看回复"
              )
            ]);
          }
        }
      ],
      data1: [],
      data2: [],
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      replyContent: "",

      searchText: "",
      modal_loading: false,
      selection: [],
      showAddNew: false,
      showDelete: false,
      newObj: {
        content: "",
        courseId: 0,
        courseName: "",
        title: "",
        userId: 0,
        userName: ""
      },
      ruleValidate: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    this.isForbid = this.userInfo.forumForbidden === 1;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getTableDatas();
      this.getCourse();
    }
  },
  methods: {
    submitReply() {
      if (this.replyContent) {
        let params = {
          content: this.replyContent,
          subjectId: this.subjectInfo.id,
          subjectTitle: this.subjectInfo.title,
          type: 1
        };
        if (this.replyTarget) {
          params.type = 2;
          params = {
            ...params,
            replayId: this.replyTarget.id,
            replyUserId: this.replyTarget.userId,
            replyUserName: this.replyTarget.userName
          };
        }
        this.axios.post(`${API.index.reply}`, params).then(result => {
          if (result.code === 20000) {
            this.refreshReply();
          }
        });
      } else {
        this.$Message.error("请输入回复内容");
        // this.$Notice.warning({
        //   title: "请输入回复内容",
        //   desc: "File  " + file.name + " is too large, no more than 2M."
        // });
      }
    },
    getTarget(item, index) {
      this.axios
        .get(`${API.index.reply}` + "/" + item.replayId)
        .then(result => {
          if (result.code === 20000) {
            item.replyTarget = result.result;
            this.$set(this.data2, index, item);
          }
        });
    },
    refreshReply() {
      this.replyTarget = null;
      this.replyContent = "";
      this.pageData1 = {
        total: 0,
        current: 1,
        pageSize: 10
      };
      this.getReplyDatas();
    },
    getReplyDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize,
        searchParas: {
          conditions: [
            {
              name: "subjectId",
              op: "eq",
              type: "int",
              value: this.subjectInfo.id
            }
          ],
          logic: "and"
        },
        sortDirection: "desc",
        sortProperties: "createTime"
      };
      this.axios.post(`${API.index.reply_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          this.data2 = result.result.list;
        }
      });
    },
    showReply(item, index) {
      this.subjectInfo = item;
      this.getReplyDatas();
    },
    convertUser(type) {
      let typestr = "";
      if (type === "1") {
        typestr = "(管理员)";
      } else if (type === "2") {
        typestr = "(老师)";
      } else if (type === "3") {
        typestr = "(学生)";
      }
      return typestr;
    },
    currentChange(v) {
      this.pageData1.current = v;
      this.getReplyDatas();
    },
    currentChange1(v) {
      this.pageData.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let params = {
        page: this.pageData.current - 1,
        pageSize: this.pageData.pageSize,
        searchParas: {
          conditions: [
            {
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.subject_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData.total = result.result.totalNum;
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
        this.$Message.error("请先选择要删除的设备");
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
        url: API.index.subject,
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
        title: "",
        content: "",
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        userId: this.userInfo.id,
        userName: this.userInfo.personName || this.userInfo.userName
      };
      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newObj.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.subject,
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
      // console.log("selection",selection);
      this.selection = selection;
    },
    rowClick(item, index) {
      this.newObj = item;
      this.showAddNew = true;
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.newObj.courseId = result.result.id;
            this.newObj.courseName = result.result.name;
          }
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.discuss-subject-main {
  position: relative;
}
.discuss-subject-title {
  position: relative;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
}
.discuss-subject-title span {
  font-size: 12px;
  font-weight: 400;
  line-height: 40px;
  color: #999;
  margin-left: 10px;
}
.discuss-content-img {
  position: absolute;
  top: 10px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: #fff;
  border: solid 1px #f1f1f1;
}
.discuss-content-img img {
  width: 100%;
  height: 100%;
}
.discuss-content-textdiv {
  margin: 10px 20px 20px 100px;
  min-height: 150px;
  line-height: 25px;
  font-size: 14px;
}
.discuss-content-userdiv {
  margin: 0px 0px 0px 100px;
  font-size: 12px;
  line-height: 25px;
  border-bottom: 1px dotted #ccc;
}
.discuss-content-userdiv span {
  color: #999;
  margin-left: 10px;
}
.discuss-content-userdiv span.replythis {
  float: right;
  margin-right: 10px;
  cursor: pointer;
}
.discuss-content-userdiv span.replythis:hover {
  text-decoration: underline;
}
.discuss-content-replytargetdiv {
  color: #999;
}
.discuss-subject-content,
.discuss-reply-content,
.discuss-reply-list-item {
  position: relative;
  background: #d9ead6;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-top: 10px;
}
.discuss-reply-list {
  position: relative;
}
.discuss-reply-list-item {
  position: relative;
  background: #f1f2f3;
}
.discuss-reply-content {
  position: relative;
  background: #f1f2f3;
}
.discuss-content-replytargetdiv {
  background: #dedede;
  border: solid 1px #bbb;
  padding: 0 10px;
}
.discuss-reply-page {
  position: relative;
  margin-top: 10px;
}
.getTarget {
  cursor: pointer;
}
.getTarget:hover {
  text-decoration: underline;
}
</style>
