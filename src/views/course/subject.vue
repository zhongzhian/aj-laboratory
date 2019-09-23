<template>
  <div>
    <!-- banner -->
    <div class="layout-row">
      <!-- <div class="banner-mask"></div> -->
      <div class="layout-content">
        <!-- <div class="detail-main-toolbar">
          <img class="detail-main-toolbar-img" src="static/images/qq-color.png" />
          <img class="detail-main-toolbar-img" src="static/images/weibo-color.png" />
          <img class="detail-main-toolbar-img" src="static/images/weixin-color.png" />
          <span class="detail-main-toolbar-span">分享</span>
        </div>-->
        <div style="padding: 20px 15px 10px;">
          <Breadcrumb separator=">">
            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
            <BreadcrumbItem to="/home/search">全部课程</BreadcrumbItem>
            <BreadcrumbItem
              :to="'/manage/index/notice?id='+subjectInfo.courseId"
            >{{subjectInfo.courseName}}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="detail-main">
          <div>{{subjectInfo.title}}</div>
          <div>{{subjectInfo.content}}</div>
        </div>
      </div>
    </div>
    <!-- content carousel -->
    <div class="layout-row">
      <div class="layout-content">
        <div class="detail-main">
          <div :key="item" v-for="(item,index) in data1">{{item.content}}</div>
          <div class="normallist-pager">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      subjectId: 0,
      subjectInfo: {},
      data1: [],
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    let subjectId = this.$route.query.id;
    if (subjectId) {
      this.subjectId = subjectId;
      this.getSubject();
    }
  },
  methods: {
    getTableDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize,
        searchParas: {
          conditions: [
            {
              name: "subjectId",
              op: "eq",
              type: "int",
              value: this.subjectId
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.reply_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          this.data1 = result.result.list;
        }
      });
    },
    getSubject() {
      this.axios
        .get(`${API.index.subject + "/"}` + this.subjectId)
        .then(result => {
          if (result.code === 20000) {
            this.subjectInfo = result.result;
          }
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.banner-mask {
  background: #000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
}
.course-mask {
  background: #edeeef;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.detail-main {
  height: 300px;
  position: relative;
}
.detail-main-left,
.detail-main-right {
  float: left;
  width: 550px;
  height: 350px;
  padding: 0 15px;
  font-size: 14px;
}
.detail-main-toolbar {
  position: absolute;
  right: 0;
  top: 20px;
  width: 200px;
  height: 50px;
}
.detail-main-img {
  // height: 250px;
  width: 511px;
  height: 291px;
}
// .detail-main-right {
//   float: left;
//   width: 600px;
//   height: 300px;
//   padding: 0 15px;
// }

.detail-main-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 40px;
}
.detail-confirm-btn {
  border-radius: 2px;
  height: 52px;
  line-height: 52px;
  font-size: 18px;
  background-color: #ff7a3e;
  border-color: #ff7a3e;
  color: #fff;
  width: 220px;
  font-weight: 500;
  padding: 0px;
}
.detail-main-desc {
  padding: 10px;
  background-color: #ddd;
  position: relative;
}
.detail-main-desc-p {
  // font-size: 14px;
  line-height: 24px;
}
.detail-main-desc-span {
  color: #58b736;
  margin-left: 50px;
}
.detail-main-toolbar-span {
  float: right;
  line-height: 30px;
  margin: 5px;
}
.detail-main-toolbar-img {
  float: right;
  width: 30px;
  height: 30px;
  margin: 5px;
}
.detail-content {
  background: #fff;
  padding: 10px 20px;
}
.detail-content-authorword {
  background: #f1fbf2;
  padding: 10px 20px;
}
.detail-content-desc-title {
  font-size: 16px;
  line-height: 40px;
}
.detail-content-schoollogo {
  border-bottom: 1px solid #ccc;
  padding: 10px 10px 10px 0;
}
.detail-content-schoollogo-img {
  width: 100%;
}
.detail-content-schoolteachers-title {
  border-left: 3px solid rgb(112, 172, 31);
  margin: 10px 0;
  line-height: 16px;
  padding: 0 5px;
  font-size: 16px;
}
</style>
