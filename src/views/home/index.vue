<template>
  <div>
    <!-- banner -->
    <div class="layout-row">
      <!-- <div class="banner-mask"></div> -->
      <!-- <div class="layout-content" style="height: 200px;">
        <div class="home-banner">
          <img src="static/images/banner1.jpg" />
        </div>
      </div>-->
    </div>
    <!-- content carousel  v-if="carouselData.length > 0"-->
    <div class="layout-row">
      <!-- <div class="course-mask"></div> -->
      <div class="layout-content" style="padding:10px 0px;">
        <Row :gutter="12">
          <Col span="4">
          <div class="home-bannerdiv banner-left">
            <img style="height:100%;" :src="vlogoUrl" />
          </div>
          </Col>
          <Col span="16">
          <div class="home-bannerdiv banner-middle" style="padding:0;">
            <Carousel height="360px" loop autoplay :autoplay-speed="autoSpeed" arrow="always" dots="none">
              <CarouselItem v-for="(item, index) in carouselData" v-bind:index="index" v-bind:key="item">
                <div class="home-carousel" style="width:100%;height:100%;">
                  <img class="home-carousel-img" :src="item.url" />
                </div>
              </CarouselItem>
            </Carousel>
          </div>
          </Col>
          <Col span="4">
          <div class="home-bannerdiv banner-right">
            <div class="home-bannerdiv-rowdiv" style="margin:10px 0;">
              欢迎来到东北大学
            </div>
            <template v-if="!showLogin">
              <div class="home-bannerdiv-rowdiv">
                <Avatar class="home-bannerdiv-avatar" size="large" :src="nopersonPath" />
              </div>
              <div class="home-bannerdiv-rowdiv">
                <!-- <Button
                    long
                    class="home-loginbtn"
                    type="primary"
                    shape="circle"
                    >登录/注册</Button
                  > -->
                <Button long class="home-loginbtn" type="primary" shape="circle">登录</Button>
              </div>
              <div class="home-bannerdiv-rowdiv"
                style="font-size: 12px;font-weight: 400;color: rgb(153, 153, 153);position:absolute;bottom:30px;left:10px;right:10px;">
                请登录账号一起来学习吧
              </div>
            </template>
            <template v-else>
              <template v-if="userInfo">
                <div class="home-bannerdiv-rowdiv">
                  <Avatar class="home-bannerdiv-avatar" size="large" :src="userInfo.userImage || nopersonPath" />
                  <div>{{ userInfo.personName }}</div>
                </div>
                <div class="home-bannerdiv-rowdiv">
                  <Button v-if="userInfo.userType === '3'" @click="gotoMyCourse()" long class="home-loginbtn"
                    type="primary" shape="circle">我的课程</Button>
                  <Button v-if="
                        userInfo.userType === '1' || userInfo.userType === '2'
                      " @click="gotoMyCourse()" long class="home-loginbtn" type="primary" shape="circle">个人中心</Button>
                </div>
                <div class="home-bannerdiv-rowdiv"
                  style="font-size: 12px;font-weight: 400;color: rgb(153, 153, 153);position:absolute;bottom:30px;left:10px;right:10px;">
                  请开始您的学习吧
                </div>
              </template>
              <template v-else>
                <div class="home-bannerdiv-rowdiv">
                  <Avatar class="home-bannerdiv-avatar" size="large" :src="nopersonPath" @click="teacherClick(item)" />
                </div>
                <div class="home-bannerdiv-rowdiv">
                  <Button @click="gotoPage('login')" long class="home-loginbtn" type="primary"
                    shape="circle">登录</Button>
                </div>
                <div class="home-bannerdiv-rowdiv"
                  style="font-size: 12px;font-weight: 400;color: rgb(153, 153, 153);position:absolute;bottom:30px;left:10px;right:10px;">
                  请登录账号一起来学习吧
                </div>
              </template>
            </template>
          </div>
          </Col>
        </Row>
      </div>
      <!-- <div class="carousel-mask"></div> -->
      <!-- <div class="layout-content" style="left:0;margin-left:0;width:100%;">
        <Carousel v-model="value1" loop autoplay arrow="always" dots="none">
          <CarouselItem
            v-for="(item, index) in carouselData"
            v-bind:index="index"
            v-bind:key="item"
          >
            <div class="home-carousel" style="width:100%;height:auto;">
              <img class="home-carousel-img" :src="item.url" />
            </div>
          </CarouselItem>
        </Carousel>
      </div> -->
    </div>
    <!-- content course -->
    <div class="layout-row">
      <!-- <div class="course-mask"></div> -->
      <!-- <div class="normallist-titleline"></div> -->
      <div class="layout-content" style="margin-bottom:30px;">
        <div class="normallist-title">课程推荐</div>
        <!-- <div class="normallist-condition">
          <span>全部</span>
          <span>正在进行</span>
          <span>即将开始</span>
          <span>已结束</span>
        </div>-->
        <div class="normallist-content">
          <!-- <div class="course-listitem" v-for="(item,index) in carouselData" v-bind:index="index" v-bind:key="item">{{item}}</div> -->
          <Row :gutter="30">
            <Col span="6" v-for="(item, index) in courseDatas" v-bind:index="index" v-bind:key="item">
            <div class="course-listitem" @click="itemClick(item)">
              <img class="course-listitem-img" :src="item.logo" />
              <!-- <div>{{ item.name }}</div> -->
            </div>
            </Col>
          </Row>
        </div>
        <div class="normallist-pager">
          <Page :total="pageData1.total" :current="pageData1.current" :page-size="pageData1.pageSize" prev-text="上一页"
            next-text="下一页" placement="top" @on-change="currentChange" />
        </div>
      </div>
    </div>
    <!-- content comment -->
    <div v-if="commentData.length > 0" class="layout-row">
      <!-- <div class="course-mask"></div> -->
      <!-- <div class="normallist-titleline"></div> -->
      <div class="layout-content" style="padding:0px 0px 30px;">
        <div class="normallist-title">精彩评价</div>
        <div class="normallist-content" style="margin-top:30px;">
          <Carousel :loop="commentloop" :autoplay="commentautoplay" arrow="hover" dots="none">
            <CarouselItem v-for="(group, index) in commentData" v-bind:index="index" v-bind:key="group">
              <div class="home-carousel" style="height:auto;">
                <Row :gutter="16">
                  <Col span="6" v-for="item in group" v-bind:key="item">
                  <div class="comment-itemdiv">
                    <div class="comment-itemdiv-avatar">
                      <Avatar size="large" icon="ios-person" :src="item.userImage" />
                    </div>
                    <div class="comment-itemdiv-title">
                      {{ item.userName }}
                    </div>
                    <div class="comment-itemdiv-rate">
                      <!-- {{ item.content }} -->
                      <Rate v-model="item.score" disabled />
                    </div>
                    <div class="comment-itemdiv-content">
                      {{ item.content }}
                      <!-- <pre>{{ item.content }}</pre> -->
                    </div>
                    <div class="comment-itemdiv-from green-color">
                      来自《{{ item.courseName }}》
                    </div>
                  </div>
                  </Col>
                </Row>
              </div>
              <!-- <div>
              <div v-for="item in group" v-bind:key="item">
                {{ item.userName }}
              </div>
            </div> -->
            </CarouselItem>
          </Carousel>
        </div>
      </div>
    </div>
    <!-- content abc -->
    <div v-if="abcData.length > 0" class="layout-row">
      <!-- <div class="carousel-mask"></div> -->
      <div class="layout-content">
        <Carousel v-model="value1" loop autoplay :autoplay-speed="autoSpeed" arrow="always" dots="none">
          <CarouselItem v-for="(item, index) in abcData" v-bind:index="index" v-bind:key="item">
            <div class="home-carousel">
              <img class="home-carousel-img" :src="item.url" />
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
    <!-- content teachers -->
    <div v-if="teacherDatas.length > 0" class="layout-row">
      <!-- <div class="teacher-mask"></div> -->
      <!-- <div class="normallist-titleline"></div> -->
      <div class="layout-content" style="margin-bottom:30px;">
        <div class="normallist-title">名师专栏</div>
        <div class="normallist-content" style="margin-top:30px;margin-bottom:30px;">
          <Row :gutter="30">
            <Col span="6" v-for="(item, index) in teacherDatas" v-bind:index="index" v-bind:key="item">
            <div class="course-listitem">
              <!-- <img
                  class="teacher-listitem-img"
                  :src="item.userImage"
                  @click="teacherClick(item)"
                /> -->

              <Avatar class="teacher-listitem-img" size="large" :src="item.userImage || nopersonPath"
                @click="teacherClick(item)" />
              <p>{{ item.personName }}</p>
              <!-- <p style="font-size:12px;top:40px;">{{ item.title }}</p> -->
            </div>
            </Col>
          </Row>
        </div>
        <div class="normallist-pager">
          <Page :total="pageData2.total" :current="pageData2.current" :page-size="pageData2.pageSize" prev-text="上一页"
            next-text="下一页" placement="top" @on-change="currentChange2" />
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
        picPath: API.uploadPath,
        nopersonPath: "static/images/noperson.png",
        commentloop: false,
        commentautoplay: false,
        vlogoUrl: "static/images/vlogo.jpeg",
        showLogin: false,
        userInfo: null,
        value1: 0,
        carouselData: [],
        courseDatas: [],
        commentData: [],
        abcData: [],
        teacherDatas: [],
        pageData1: {
          total: 0,
          current: 1,
          pageSize: 8
        },
        pageData2: {
          total: 0,
          current: 1,
          pageSize: 8
        },
        autoSpeed: 8000
      };
    },
    mounted() {
      let guest = this.$route.query.guest;
      if (guest === "1") {
        this.$store.dispatch("updateGuest", true);
      } else if (guest === "0") {
        this.$store.dispatch("updateGuest", false);
      }
      let isGuest = this.$store.getters.isGuest;
      if (typeof isGuest === "string") {
        isGuest = isGuest === "true";
      }
      this.showLogin = !isGuest;
      console.log("this.showLogin", this.showLogin);
      this.userInfo = this.$store.getters.user;
      // console.log("this.userInfo", this.userInfo);
      this.getCarouselData();
      this.getABClData();
      this.getCourseData();
      this.getCommentData();
      this.getTeacherData();
    },
    methods: {
      gotoMyCourse() {
        // 学生 manage-center-list
        // 老师 manage-config-list
        // admin manage-system-course
        let url = "manage-center-list";
        if (this.userInfo.userType === "1") {
          url = "manage-system-course";
        }
        if (this.userInfo.userType === "2") {
          url = "manage-config-list";
        }
        this.$router.push({
          name: url
        });
      },
      itemClick(item) {
        this.$router.push({
          name: "home-course",
          query: {
            id: item.id
          }
        });
      },
      gotoPage(active) {
        if (active === "login") {
          if (!this.showLogin) {
            // 20210824 刘洋确定，大屏模式点登陆没反应就ok
            return;
          }
        }
        this.$router.push({
          name: active
        });
      },
      teacherClick(item) {
        // this.$router.push({
        //   name: "home-course",
        //   query: {
        //     id: item.id
        //   }
        // });
      },
      getCarouselData() {
        this.axios.get(`${API.index.getHomePageImages}`).then(result => {
          if (result.code === 20000) {
            let dataStr = result.result.value;
            if (dataStr) {
              let imageObjs = JSON.parse(dataStr);
              this.carouselData = imageObjs.map(i => {
                i.url = this.picPath + i.url;
                return i;
              });
              console.log("getCarouselData", imageObjs, this.carouselData)
            }
          }
        });
      },
      getCommentData() {
        let params = {
          page: 0,
          pageSize: 20,
          searchParas: {
            conditions: [{
              name: "mainPageDisplay",
              op: "eq",
              type: "boolean",
              value: true
            }],
            logic: "and"
          },
          sortDirection: "desc",
          sortProperties: "updateTime"
        };
        this.axios
          .post(`${API.index.coursecomment_list}`, params)
          .then(result => {
            if (result.code === 20000) {
              // let courseDatas = [];
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // courseDatas = courseDatas.concat(result.result.list);
              // this.commentData = _.chunk(courseDatas, 4);
              this.commentData = _.chunk(result.result.list, 4);
              console.log("this.commentData", this.commentData);
            }
          });
      },
      getABClData() {
        this.axios.get(`${API.index.getHomePageBottomImages}`).then(result => {
          if (result.code === 20000) {
            let dataStr = result.result.value;
            if (dataStr) {
              let imageObjs = JSON.parse(dataStr);
              this.abcData = imageObjs.map(i => {
                i.url = this.picPath + i.url;
                return i;
              });
            }
          }
        });
      },
      getCourseData() {
        let params = {
          page: this.pageData1.current - 1,
          pageSize: this.pageData1.pageSize,
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
            this.pageData1.total = result.result.totalNum;
            this.courseDatas = result.result.list.map(c => {
              if (c.logo.indexOf("http") === -1) {
                c.logo = this.picPath + c.logo;
                c.mainImg = this.picPath + c.mainImg;
              }
              return c;
            });
            // let courseDatas = [];
            // courseDatas = courseDatas.concat(result.result.list);
            // courseDatas = courseDatas.concat(result.result.list);
            // courseDatas = courseDatas.concat(result.result.list);
            // courseDatas = courseDatas.concat(result.result.list);
            // this.courseDatas = courseDatas;
          }
        });
      },
      getTeacherData() {
        let params = {
          page: this.pageData2.current - 1,
          pageSize: this.pageData2.pageSize,
          searchParas: {
            conditions: [{
              name: "userType",
              op: "eq",
              type: "string",
              value: "2"
            }],
            logic: "and"
          }
          // sortDirection: "string",
          // sortProperties: "string"
        };
        this.axios.post(`${API.index.teacher_list}`, params).then(result => {
          if (result.code === 20000) {
            this.pageData2.total = result.result.totalNum;
            // this.pageData.current = result.result.page++;
            this.teacherDatas = result.result.list;
          }
        });
      },
      currentChange(v) {
        this.pageData1.current = v;
        this.getCourseData();
      },
      currentChange2(v) {
        this.pageData2.current = v;
        this.getTeacherData();
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .home-loginbtn {
    background-color: #58b736;
    border: 1px solid #58b736;
    font-weight: 500;
    font-size: 14px;
  }

  .banner-mask {
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
  }

  .home-bannermain {
    padding: 0 50px 20px 250px;
  }

  .home-bannermain-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 40px;
  }

  .home-bannermain-desc {
    font-size: 12px;
    line-height: 20px;
    color: #999;
    // margin-bottom: 20px;
  }

  .home-bannerlogo {
    position: absolute;
    top: 130px;
    left: 20px;
    width: 200px;
    height: 200px;
  }

  .home-bannerlogo-img {
    width: 100%;
    height: 100%;
  }

  .home-bannerdiv {
    min-height: 100px;
    height: 360px;
    background-color: #fff;
    padding: 10px;
    text-align: center;
  }

  .home-bannerdiv-rowdiv {
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    color: rgb(51, 51, 51);
  }

  .home-bannerdiv-avatar {
    width: 72px;
    height: 72px;
    // border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    font-size: 72px;
    line-height: 72px;
    margin: 20px 0 10px;
  }

  .carousel-mask {
    background: #b2dfdc;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    // height: 200px;
    height: 361px;
  }

  .home-carousel {
    // height: 200px;
    height: 361px;
    width: 1278px;
    text-align: center;
  }

  .home-carousel-img {
    width: 100%;
    height: 100%;
  }

  .course-mask {
    background: #edeeef;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .course-listitem {
    // padding: 0 0 30px 0;
    position: relative;
    text-align: center;
  }

  .course-listitem-img {
    width: 300px;
    height: 360px;
    border: 1px solid #ccc;
    cursor: pointer;
    // border-radius: 50%;
  }

  .comment-itemdiv {
    height: 194px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    font-size: 14px;
    line-height: 22px;
    color: #333;
    padding: 10px 14px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    margin-top: 18px;
    margin-bottom: 20px;
  }

  .comment-itemdiv-avatar {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 1);
    border-radius: 100%;
    margin-right: 8px;
    vertical-align: middle;
    border: 4px solid #fff;
    position: absolute;
    top: -15px;
  }

  .comment-itemdiv-title {
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

  .comment-itemdiv-rate {
    text-align: left;
    padding: 5px 0;
  }

  .comment-itemdiv-content {
    color: rgb(51, 51, 51);
    text-align: left;
    height: 90px;
    background-color: #fff;
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4; //行数
    overflow: hidden;
  }

  .comment-itemdiv-content pre {
    margin: 10px 0;
    line-height: 20px;
  }

  .comment-itemdiv-from {
    color: rgb(83, 184, 128);
    font-size: 12px;
    position: absolute;
    left: 14px;
    bottom: 14px;
  }

  .teacher-listitem-img {
    // width: 150px;
    // height: 150px;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 50%;
    // cursor: pointer;
    font-size: 100px;
    line-height: 100px;
  }

  .course-listitem p {
    // position: absolute;
    // left: 170px;
    // top: 15px;
    // text-align: left;
    text-align: center;
    font-size: 14px;
    padding-top: 10px;
  }

  .teacher-mask {
    background: #feffff;
    // background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
