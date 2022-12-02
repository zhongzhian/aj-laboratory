<template>
  <div>
    <!-- banner -->
    <div class="layout-row" style="background: #fff;">
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
            <BreadcrumbItem>{{ courseInfo.name }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="detail-main">
          <div class="detail-main-left">
            <div v-if="!videoShow && courseInfo.videoDesc" @click="showVideo" class="detail-main-video-playbtn">
              <Icon type="ios-play" size="50" />
            </div>
            <img v-if="!videoShow" class="detail-main-img" :src="courseInfo.mainImg" />
            <div v-if="videoShow" class="detail-main-img">
              <!-- autoplay -->
              <video :src="courseInfo.videoDesc" autoplay controls style="width:100%;height:100%;"></video>
            </div>
          </div>
          <div class="detail-main-right">
            <h4 class="detail-main-title">{{ courseInfo.name }}</h4>
            <div class="detail-main-desc">
              <!-- <span class="detail-main-desc-morespan">
                更多
              </span> -->
              <!-- <p class="detail-main-desc-p">第2次开课</p>
              <p class="detail-main-desc-p">
                开课时间：2019年09月25日 ～ 2020年1月12日
                <span class="detail-main-desc-span">进行至第16周，共16周</span>
              </p>
              <p class="detail-main-desc-p">学时安排：3-5</p>   text-ellipsis4-->
              <p :style="textEllipsis" class="detail-main-desc-p text-ellipsis4" :title="courseInfo.introduction">
                {{ courseInfo.introduction }}
              </p>
            </div>

            <!-- 学生 -->
            <template v-if="userInfo.userType === '3'">
              <!-- 已发布 -->
              <template v-if="courseInfo.status === 1">
                <!-- 未开始试验 -->
                <template v-if="!courseInfo.experimentStarted">
                  <div style="margin-top:30px;color:#ccc;line-height: 32px;">
                    抱歉，课程未开放学习，暂时无法参加。
                  </div>
                  <div>
                    <Button disabled class="detail-confirm-btn">无法参加</Button>
                  </div>
                </template>
                <!-- 开始试验 -->
                <template v-if="courseInfo.experimentStarted">
                  <div style="margin-top:30px;color:#ccc;line-height: 32px;">
                    已有 {{ courseInfo.studentNumber }} 人参加
                  </div>
                  <div v-if="!hasCourse">
                    <Button @click="gotoStart" class="detail-confirm-btn">立即参加</Button>
                  </div>
                  <div v-if="hasCourse">
                    <Button @click="gotoCourse" class="detail-confirm-btn">进入课程</Button>
                  </div>
                </template>
              </template>
              <!-- 已结课 -->
              <template v-if="courseInfo.status === 2">
                <div style="margin-top:30px;color:#ccc;line-height: 32px;">
                  抱歉，课程已经结束，无法参加。
                </div>
                <div>
                  <Button disabled class="detail-confirm-btn">已结课</Button>
                </div>
              </template>
            </template>
            <!-- 非学生 -->
            <template v-else>
              <div style="margin-top:30px;color:#ccc;line-height: 32px;">
                只有系统内部学生才能参加课程的学习
              </div>
              <div>
                <Button disabled class="detail-confirm-btn">无法参加</Button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- content carousel -->
    <div class="layout-row">
      <div class="course-mask"></div>
      <div class="layout-content" style="padding:20px 0;">
        <Row :gutter="20">
          <Col span="18">
          <div class="detail-content">
            <div class="normal-tabs">
              <div class="normal-tabs-header">
                <div @click="tabindex = '1'" class="normal-tabs-header-title" :class="tabindex === '1' ? 'active' : ''">
                  课程详情
                </div>
                <div @click="tabindex = '3'" class="normal-tabs-header-title" :class="tabindex === '3' ? 'active' : ''">
                  操作说明
                </div>
                <div v-if="showTopic" @click="tabindex = '2'" class="normal-tabs-header-title"
                  :class="tabindex === '2' ? 'active' : ''">
                  <!-- 课程评价（{{ courseInfo.subjectNumber }}） -->
                  课程评价
                </div>
              </div>
              <div v-show="tabindex === '1'" class="normal-tabs-content">
                <!-- <div
                    v-if="courseInfo.videoDesc"
                    class="normal-video-div"
                    style="margin:20px;position:relative;"
                  >
                    <video :src="courseInfo.videoDesc" controls></video>
                  </div> -->
                <div v-html="courseInfo.description"></div>
              </div>
              <div v-show="tabindex === '3'" class="normal-tabs-content">
                <div v-html="courseInfo.operateDesc"></div>
              </div>
              <div v-show="tabindex === '2'" class="normal-tabs-content">
                <template v-if="commentObj">
                  <div class="comment-itemdiv">
                    <div class="comment-itemdiv-avatar">
                      <Avatar size="large" icon="ios-person" :src="commentObj.userImage" />
                    </div>
                    <div class="comment-itemdiv-title">
                      {{ commentObj.userName }}
                    </div>
                    <div class="comment-itemdiv-rate">
                      <Rate v-model="commentObj.score" disabled />
                    </div>
                    <div class="comment-itemdiv-content">
                      <pre>{{ commentObj.content }}</pre>
                    </div>
                    <div class="comment-itemdiv-desc">
                      发表于 {{ commentObj.updateTime }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <div class="notice-content-left-div">
                      <p style="font-size:16px;line-height:40px;">无评价</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="detail-content">
            <div class="detail-content-schoollogo">
              <img class="detail-content-schoollogo-img" src="static/images/logo.jpg" />
            </div>
            <div class="detail-content-schoolteachers">
              <div class="detail-content-schoolteachers-title">授课老师</div>
            </div>
            <div>
              <div :key="item" v-for="(item, index) in teacherDatas" class="manage-content-header-left">
                <div class="manage-content-avadar">
                  <img v-if="item.userImage" :src="item.userImage" />
                  <img v-else src="static/images/noperson.png" />
                </div>
                <div class="manage-content-userinfo">
                  <p style="font-size: 14px;font-weight: 500;">
                    {{ item.personName || item.userName }}
                  </p>
                  <p style="color: #999;">{{ item.title }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-content" style="margin-top:20px;">
            <!-- <div class="detail-content-schoollogo">
                <img class="detail-content-schoollogo-img" src="static/images/bj.png" />
              </div>-->
            <div class="detail-content-schoolteachers">
              <div class="detail-content-schoolteachers-title">推荐课程</div>
            </div>

            <div :key="item" v-for="(item, index) in courseDatas2" @click="itemClick(item)"
              class="search-main-right-listitem">
              <div class="search-main-right-listitem-img">
                <img :src="item.mainImg" />
              </div>
              <p style="font-size: 14px;margin-top: 10px;line-height: 15px;font-weight: 500;">
                {{ item.name }}
              </p>
              <p style="font-size:8px;color:#ccc">{{ item.teacherName }}</p>
            </div>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "@/api";
  export default {
    data() {
      return {
        picPath: API.uploadPath,
        isGuest: false,
        isExperimentStarted: false,
        textEllipsis: "-webkit-box-orient: vertical;",
        tabindex: "1",
        courseId: 0,
        courseInfo: null,
        userInfo: null,
        commentObj: null,
        teacherDatas: [],
        courseDatas2: [],
        hasCourse: false,
        showTopic: false,
        data1: [],
        videoShow: false
      };
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      let courseId = this.$route.query.id;
      if (courseId) {
        this.courseId = courseId;
        // this.getChapters();
        this.getCourse();
        this.showTopic = true;
        this.getCommentData();
        console.log("this.userInfo", this.userInfo);
        if (this.userInfo) {
          console.log("this.userInfo", this.userInfo);
          if (this.userInfo.userType === "0") {
            this.isGuest = true;
          } else {
            this.isGuest = false;
          }
          this.getMyCourse();
          // this.getSubjectDatas();
        }
      }
      this.getTableDatas2();
    },
    methods: {
      showVideo() {
        console.log("showVideo", this.courseInfo.videoDesc);
        if (this.courseInfo.videoDesc) {
          this.videoShow = true;
        }
      },
      itemClick(item) {
        this.$router.push({
          name: "home-course",
          query: {
            id: item.id
          }
        });
      },
      gotoCourse() {
        if (this.courseInfo.isOuter) {
          this.gotoOutPage();
        } else {
          this.$router.push({
            name: "manage-index-chapter",
            query: {
              id: this.courseId
            }
          });
        }
      },
      gotoStart() {
        this.axios
          .post(`${API.index.startStudy}` + this.courseId, null)
          .then(result => {
            if (result.code === 20000) {
              this.gotoCourse();
            }
          });
      },
      getCommentData() {
        let params = {
          page: 0,
          pageSize: 20,
          searchParas: {
            conditions: [{
                name: "courseId",
                op: "eq",
                type: "int",
                value: this.courseId
              },
              {
                name: "mainPageDisplay",
                op: "eq",
                type: "boolean",
                value: true
              }
            ],
            logic: "and"
          }
        };
        this.axios
          .post(`${API.index.coursecomment_list}`, params)
          .then(result => {
            if (result.code === 20000) {
              if (result.result.totalNum > 0) {
                this.commentObj = result.result.list[0];
              }
            }
          });
      },
      getSubjectDatas() {
        let params = {
          // page: this.pageData.current - 1,
          // pageSize: this.pageData.pageSize,
          searchParas: {
            conditions: [{
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.subject_list}`, params).then(result => {
          if (result.code === 20000) {
            // this.pageData.total = result.result.totalNum;
            this.data1 = result.result.list;
          }
        });
      },
      getMyCourse() {
        let params = {
          searchParas: {
            conditions: [{
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.study_getMy}`, params).then(result => {
          if (result.code === 20000) {
            this.hasCourse = result.result.totalNum > 0;
          }
        });
      },
      getTableDatas2() {
        let params = {
          page: 0,
          pageSize: 3,
          searchParas: {
            conditions: [{
                name: "status",
                op: "noeq",
                type: "int",
                value: 0
              },
              {
                name: "isDeleted",
                op: "eq",
                type: "boolean",
                value: false
              }
            ],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.course_list}`, params).then(result => {
          if (result.code === 20000) {
            this.courseDatas2 = result.result.list.map(c => {
              if (c.logo.indexOf("http") === -1) {
                c.logo = this.picPath + c.logo;
                c.mainImg = this.picPath + c.mainImg;
              }
              return c;
            });
          }
        });
      },
      getTeacherData() {
        let params = {
          searchParas: {
            conditions: [{
              name: "id",
              op: "eq",
              type: "int",
              value: this.courseInfo.teacherId
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.teacher_list}`, params).then(result => {
          if (result.code === 20000) {
            this.teacherDatas = result.result.list;
          }
        });
      },
      getChapters() {
        let params = {
          searchParas: {
            conditions: [{
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.chapter_list}`, params).then(result => {
          if (result.code === 20000) {
            this.chapterDatas = result.result.list.map(c => {
              c.children = [];
              c.show = false;
              c.loadSection = false;
              return c;
            });
          }
        });
      },
      getCourse() {
        this.axios
          .get(`${API.index.course + "/"}` + this.courseId)
          .then(result => {
            if (result.code === 20000) {
              this.courseInfo = result.result;
              if (this.courseInfo.mainImg.indexOf("http") === -1) {
                this.courseInfo.logo = this.picPath + this.courseInfo.logo;
                this.courseInfo.mainImg = this.picPath + this.courseInfo.mainImg;
              }
              if (this.courseInfo.videoDesc) {
                this.courseInfo.videoDesc =
                  this.picPath + this.courseInfo.videoDesc;
              }
              this.getTeacherData();
            }
          });
      },
      gotoOutPage() {
        window.open(this.courseInfo.outerUrl, "_block");
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .ivu-breadcrumb {
    font-size: 20px;
  }

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

  .normal-tabs {
    position: relative;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  .normal-tabs-header {
    height: 50px;
    // line-height: 50px;
    font-size: 20px;
    padding: 0px 16px;
    margin-right: 16px;
  }

  .normal-tabs-header-title {
    display: inline-block;
    padding: 4px 16px;
    margin-right: 16px;
    cursor: pointer;
  }

  .normal-tabs-header-title.active {
    color: #70ac1f;
    border-bottom: solid 2px #70ac1f;
  }

  .normal-tabs-content {
    position: relative;
    // position: absolute;
    // top: 50px;
    // left: 0px;
    // right: 0px;
    // bottom: 0px;
    // overflow: auto;
  }

  .banner-mask {
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
  }

  .course-mask {
    background: #f5f5f5;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .detail-main {
    height: 320px;
    position: relative;
  }

  .detail-main-left,
  .detail-main-right {
    float: left;
    width: 550px;
    // height: 350px;
    padding: 0 15px;
    font-size: 14px;
    position: relative;
  }

  .detail-main-right {
    width: calc(100% - 550px);
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

  .detail-main-video-playbtn {
    position: absolute;
    top: 110px;
    left: 235px;
    width: 70px;
    height: 70px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
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
    background-color: #f5f5f5;
    position: relative;
    max-width: 600px;
    // max-height: 90px;
  }

  .detail-main-desc-p {
    // font-size: 14px;
    line-height: 24px;
  }

  .detail-main-desc-span {
    color: #58b736;
    margin-left: 50px;
  }

  .detail-main-desc-morespan {
    position: absolute;
    bottom: 10px;
    right: 10px;
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
    font-size: 20px;
  }

  .notice-content-left-div {
    padding: 20px 0;
    font-size: 10px;
  }

  .notice-content-left-time {
    color: #ccc;
    text-align: right;
    font-size: 8px;
    border-bottom: 1px solid #ccc;
  }

  .manage-content-header-left {
    padding: 10px 20px 10px 10px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
    position: relative;
    height: 80px;
  }

  .manage-content-avadar {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .manage-content-avadar img {
    height: 100%;
    width: 100%;
  }

  .manage-content-userinfo {
    position: absolute;
    top: 10px;
    left: 80px;
    right: 10px;
    bottom: 10px;
    padding: 5px;
  }

  .search-main-right-listitem {
    margin-top: 20px;
  }

  .search-main-right-listitem-img {
    width: 100%;
    height: 100px;
    cursor: pointer;
  }

  .search-main-right-listitem-img img {
    width: 100%;
    height: 100%;
  }
</style>
