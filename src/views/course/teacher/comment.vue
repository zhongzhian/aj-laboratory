<template>
  <div>
    <div class="table-condition-btnbar">
      <Select v-model="class1" style="width:200px">
        <Option v-for="item in class1list" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Input v-model="searchName" size="small" placeholder="姓名" style="margin-left:10px;width:200px;" />
      <Button style="margin-left:10px;" @click="getTableDatas" size="small" class="condition-btn">查询</Button>
      <!-- <Button @click="getTableDatas" size="small" class="condition-btn"
        >刷新</Button
      > -->
    </div>
    <div>
      <div :key="item" v-for="item in data1" class="comment-itemdiv">
        <div v-if="item.mainPageDisplay" class="comment-itemdiv-action color-green">
          已设为首页评论
        </div>
        <div v-if="!item.mainPageDisplay" class="comment-itemdiv-action">
          <Button type="primary" size="small" @click="setDefault(item)">设为首页评论</Button>
        </div>
        <div class="comment-itemdiv-avatar">
          <Avatar size="large" icon="ios-person" :src="item.userImage" />
        </div>
        <div class="comment-itemdiv-title">
          {{ item.userName }}
        </div>
        <div class="comment-itemdiv-rate">
          <Rate v-model="item.score" disabled />
        </div>
        <div class="comment-itemdiv-content">
          <pre>{{ item.content }}</pre>
        </div>
        <div class="comment-itemdiv-desc">发表于 {{ item.updateTime }}</div>
      </div>
    </div>
    <div class="hyz-page">
      <Page show-elevator show-total :show-sizer="true" :page-size-opts="sizeOpts" size="small"
        :page-size="pageData.pageSize" :total="pageData.total" :current="pageData.current" @on-change="currentChange"
        @on-page-size-change="pageSizeChange" />
    </div>

    <Modal v-model="showComment" :title="commentObj.title">
      <div>
        <Form :model="commentObj">
          <!-- <Row :gutter="32">
            <Col span="12"> -->
          <FormItem label="评论人" prop="introduction" label-position="left">
            <Avatar icon="ios-person" :src="commentObj.userImage" />
            <span>{{ commentObj.userName }}</span>
          </FormItem>
          <!-- </Col>
            <Col span="12"> -->
          <FormItem label="评论时间" prop="introduction" label-position="left">
            {{ commentObj.updateTime }}
          </FormItem>
          <!-- </Col>
          </Row> -->
          <FormItem label="内容" prop="introduction" label-position="top">
            <Input readonly="readonly" type="textarea" v-model="commentObj.content" :rows="4" placeholder="请输入评论内容" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button v-if="commentObj.mainPageDisplay" long type="primary" @click="showComment = false">关闭</Button>
        <Button v-if="!commentObj.mainPageDisplay" long type="primary" :loading="modal_loading"
          @click="setDefault(commentObj)">设为首页评论</Button>
      </div>
    </Modal>
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
        data1: [],
        data2: [],
        sizeOpts: [10, 20, 50, 100],
        pageData1: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        replyContent: "",

        searchText: "",
        modal_loading: false,
        selection: [],
        showComment: false,
        showDelete: false,
        commentObj: {
          content: "",
          courseId: 0,
          courseName: "",
          title: "评价标题",
          userId: 0,
          userName: ""
        },
        class1list: ["全部班"],
        class1: "全部班",
        searchName: ""
      };
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      this.isForbid = this.userInfo.forumForbidden === 1;
      let courseId = this.$route.query.id;
      if (courseId) {
        this.courseId = courseId;
        this.getClass1();
        this.getTableDatas();
        this.getCourse();
      }
    },
    methods: {
      setDefault(item) {
        this.axios
          .post(`${API.index.coursecomment_setdefault}` + item.id, null)
          .then(result => {
            if (result.code === 20000) {
              this.showComment = false;
              this.pageData = {
                total: 0,
                current: 1,
                pageSize: 10
              };
              this.getTableDatas();
            }
          });
      },
      currentChange1(v) {
        this.pageData.current = v;
        this.getTableDatas();
      },
      currentChange(v) {
        this.pageData.current = v;
        this.getTableDatas();
      },
      pageSizeChange(v) {
        this.pageData.current = 1;
        this.pageData.pageSize = v;
        this.getTableDatas();
      },
      getTableDatas() {
        let params = {
          page: this.pageData.current - 1,
          pageSize: this.pageData.pageSize,
          searchParas: {
            conditions: [{
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }],
            logic: "and"
          },
          sortDirection: "asc",
          sortProperties: "userName"
        };
        if (this.class1 != "全部班") {
          params.searchParas.conditions.push({
            name: "class1",
            op: "eq",
            type: "string",
            value: this.class1
          });
        }
        if (this.searchName) {
          params.searchParas.conditions.push({
            name: "userName",
            op: "like",
            type: "string",
            value: this.searchName
          });
        }
        this.axios
          .post(`${API.index.coursecomment_list}`, params)
          .then(result => {
            if (result.code === 20000) {
              this.pageData.total = result.result.totalNum;
              this.data1 = result.result.list;
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
      rowSelect(selection, row) {
        // console.log("selection",selection);
        this.selection = selection;
      },
      rowClick(item, index) {
        this.commentObj = item;
        this.showComment = true;
      },
      getClass1() {
        let params = {
          courseId: this.courseId,
          type: 0
        };
        this.axios
          .post(`${API.index.class_getbycourseid}`, params)
          .then(result => {
            if (result.code === 20000) {
              let class1list = ["全部班"];
              if (result.result) {
                class1list = class1list.concat(result.result);
              }
              this.class1list = class1list;
            }
          });
      },
      getCourse() {
        this.axios
          .get(`${API.index.course + "/"}` + this.courseId)
          .then(result => {
            if (result.code === 20000) {
              this.courseInfo = result.result;
              this.commentObj.courseId = result.result.id;
              this.commentObj.courseName = result.result.name;
            }
          });
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .comment-itemdiv {
    font-size: 14px;
    line-height: 22px;
    color: #333;
    padding: 10px 14px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    border-bottom: solid 1px #eee;
  }

  .comment-itemdiv-action {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .comment-itemdiv-avatar {
    width: 50px;
    height: 50px;
    background: #ffffff;
    border-radius: 100%;
    margin-right: 8px;
    vertical-align: middle;
    position: absolute;
    padding: 5px;
  }

  .comment-itemdiv-title {
    text-align: center;
    font-size: 12px;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    color: #222;

    width: 50px;
    margin-right: 8px;
    vertical-align: middle;
    position: absolute;
    top: 55px;
  }

  .comment-itemdiv-rate {
    padding-left: 65px;
    text-align: left;
    margin: 10px 0 0 0;
    position: relative;
  }

  .comment-itemdiv-content {
    padding-left: 65px;
    text-align: left;
    min-height: 50px;
    margin: 10px 0;
    position: relative;
  }

  .comment-itemdiv-desc {
    text-align: left;
    font-size: 12px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    color: #999;
    padding-left: 65px;
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
