<template>
  <div>
    <template v-if="!replyInfo">
      <div class="table-condition-btnbar">
        <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
      </div>
      <div class="manage-content-right-content">
        <div>
          <b-table @page-data-change="currentChange" @page-size-change="sizeChange" :pageData="pageData1"
            @on-select="rowSelect" @on-row-click="rowClick" :columns="columns1" :dataSource="data1"></b-table>
        </div>
      </div>
    </template>
    <template v-if="replyInfo">
      <div class="table-condition-btnbar">
        <Button @click="replyInfo = null" size="small" class="condition-btn">返回</Button>
      </div>
      <div class="detail-main">
        <div class="discuss-reply-main">
          <div class="discuss-reply-list">
            <div class="discuss-reply-list-item">
              <div class="discuss-content-img">
                <img v-if="replyInfo.userImage" class="header-adavor-img" :src="replyInfo.userImage" />
                <img v-else class="header-adavor-img" src="static/images/noperson.png" />
              </div>
              <div class="discuss-content-userdiv">
                {{replyInfo.userName}}
                <span style="margin-left:0;">{{convertUser(replyInfo.userType)}}</span>
                <span>{{replyInfo.createTime}}</span>
                <!-- <span>{{replyInfo.replyNumber}}回复</span> -->
                <span style="cursor:default;" class="replythis">{{replyInfo.floorNumber}}楼</span>
              </div>
              <div class="discuss-content-textdiv">{{replyInfo.content}}</div>
            </div>
          </div>
          <div class="discuss-reply-content">
            <div class="discuss-content-img">
              <img v-if="userInfo.userImage" class="header-adavor-img" :src="userInfo.userImage" />
              <img v-else class="header-adavor-img" src="static/images/noperson.png" />
            </div>
            <div class="discuss-content-textdiv">
              <Input :disabled="isForbid" type="textarea" v-model="replyContent" :rows="4" placeholder="请输入回复内容" />
              <div class="submit-btn-div">
                <Button :disabled="isForbid" class="submit-btn" type="primary" @click="submitReply">回复</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import API from "@/api";

  export default {
    data() {
      return {
        isForbid: false,
        replyContent: "",
        courseId: 0,
        courseInfo: null,
        userInfo: null,
        replyInfo: null,
        subjectInfo: null,

        pageData1: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        columns1: [{
            title: "话题",
            ellipsis: true,
            maxWidth: 200,
            tooltip: true,
            key: "subjectTitle"
          },
          {
            title: "内容",
            ellipsis: true,
            tooltip: true,
            key: "content"
          },
          {
            title: "回复人",
            width: 120,
            align: "center",
            key: "userName"
          },
          {
            title: "楼层",
            width: 80,
            align: "center",
            key: "floorNumber"
          },
          {
            title: "回复时间",
            width: 150,
            key: "createTime"
          },
          {
            title: "操作",
            key: "action",
            width: 80,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.replyInfo = params.row;
                        // this.selectTest(params.row);
                      }
                    }
                  },
                  "回复"
                )
              ]);
            }
          }
        ],
        data1: []
      };
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      this.isForbid = this.userInfo.forumForbidden === 1;
      this.getTableDatas();
    },
    methods: {
      submitReply() {
        if (this.replyContent) {
          let params = {
            content: this.replyContent,
            subjectId: this.replyInfo.subjectId,
            subjectTitle: this.replyInfo.subjectTitle,
            type: 2,
            replayId: this.replyInfo.id,
            replyUserId: this.replyInfo.userId,
            replyUserName: this.replyInfo.userName
          };
          this.axios.post(`${API.index.reply}`, params).then(result => {
            if (result.code === 20000) {
              this.replyInfo = null;
              this.getTableDatas();
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
      currentChange(v) {
        this.pageData1.current = v;
        this.getTableDatas();
      },
      sizeChange(v) {
        this.pageData1.current = 1;
        this.pageData1.pageSize = v;
        this.getTableDatas();
      },
      getTableDatas() {
        let url = `${API.index.reply_list}`;
        let params = {
          page: this.pageData1.current - 1,
          pageSize: this.pageData1.pageSize,
          searchParas: {
            conditions: [{
              name: "replyUserId",
              op: "eq",
              type: "int",
              value: this.userInfo.id
            }],
            logic: "and"
          }
        };
        //   if (this.isAll) {
        //     params.searchParas.conditions = [
        //       {
        //         name: "status",
        //         op: "noeq",
        //         type: "int",
        //         value: 0
        //       }
        //     ];
        //   }
        this.axios.post(url, params).then(result => {
          if (result.code === 20000) {
            this.pageData1.total = result.result.totalNum;
            this.data1 = result.result.list;
          }
        });
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
      }
    }
  };
</script>
<style>
</style>

<style lang="less" scoped>
  .manage-content-right-content {
    position: absolute;
    top: 68px;
    bottom: 15px;
    left: 25px;
    right: 25px;
  }

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
