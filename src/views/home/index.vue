<template>
  <div>
    <!-- banner -->
    <div class="layout-row">
      <div class="banner-mask"></div>
      <!-- <div class="layout-content" style="height: 200px;">
        <div class="home-banner">
          <img src="static/images/banner1.jpg" />
        </div>
      </div>-->
    </div>
    <!-- content carousel -->
    <div v-if="carouselData.length>0" class="layout-row">
      <!-- <div class="carousel-mask"></div> -->
      <div class="layout-content" style="left:0;margin-left:0;width:100%;">
        <Carousel v-model="value1" loop autoplay arrow="always" dots="none">
          <CarouselItem v-for="(item,index) in carouselData" v-bind:index="index" v-bind:key="item">
            <div class="home-carousel" style="width:100%;height:auto;">
              <img class="home-carousel-img" :src="item.url" />
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
    <!-- content course -->
    <div class="layout-row">
      <div class="course-mask"></div>
      <div class="normallist-titleline"></div>
      <div class="layout-content" style="padding:0px 30px 30px;">
        <div class="normallist-title">课程</div>
        <!-- <div class="normallist-condition">
          <span>全部</span>
          <span>正在进行</span>
          <span>即将开始</span>
          <span>已结束</span>
        </div>-->
        <div class="normallist-content" style="padding-top: 30px;">
          <!-- <div class="course-listitem" v-for="(item,index) in carouselData" v-bind:index="index" v-bind:key="item">{{item}}</div> -->
          <Row :gutter="30">
            <Col
              span="6"
              v-for="(item,index) in courseDatas"
              v-bind:index="index"
              v-bind:key="item"
            >
              <div class="course-listitem" @click="itemClick(item)">
                <img class="course-listitem-img" :src="item.logo" />
              </div>
            </Col>
          </Row>
        </div>
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
    <!-- content carousel -->
    <div v-if="abcData.length>0" class="layout-row">
      <div class="carousel-mask"></div>
      <div class="layout-content">
        <Carousel v-model="value1" loop autoplay arrow="always" dots="none">
          <CarouselItem v-for="(item,index) in abcData" v-bind:index="index" v-bind:key="item">
            <div class="home-carousel">
              <img class="home-carousel-img" :src="item.url" />
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
    <!-- content teachers -->
    <div v-if="teacherDatas.length>0" class="layout-row">
      <div class="teacher-mask"></div>
      <div class="normallist-titleline"></div>
      <div class="layout-content" style="padding:0px 30px 30px;">
        <div class="normallist-title">老师列表</div>
        <div class="normallist-content" style="margin-top:30px;">
          <Row :gutter="30">
            <Col
              span="6"
              v-for="(item,index) in teacherDatas"
              v-bind:index="index"
              v-bind:key="item"
            >
              <div class="course-listitem">
                <img class="teacher-listitem-img" :src="item.userImage" @click="teacherClick(item)" />
                <p>{{item.personName}}</p>
                <p style="font-size:12px;top:40px;">{{item.title}}</p>
              </div>
            </Col>
          </Row>
        </div>
        <div class="normallist-pager">
          <Page
            :total="pageData2.total"
            :current="pageData2.current"
            :page-size="pageData2.pageSize"
            prev-text="上一页"
            next-text="下一页"
            placement="top"
            @on-change="currentChange2"
          />
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
      value1: 0,
      carouselData: [],
      courseDatas: [],
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
      }
    };
  },
  mounted() {
    this.getCarouselData();
    this.getABClData();
    this.getCourseData();
    this.getTeacherData();
    // this.proviceChart();
    // this.appTop5('in');
    // this.alarmShow();
    // this.setProvinceColor();
  },
  methods: {
    itemClick(item) {
      this.$router.push({
        name: "home-course",
        query: {
          id: item.id
        }
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
            this.carouselData = JSON.parse(dataStr);
          }
        }
      });
    },
    getABClData() {
      this.axios.get(`${API.index.getHomePageBottomImages}`).then(result => {
        if (result.code === 20000) {
          let dataStr = result.result.value;
          if (dataStr) {
            this.abcData = JSON.parse(dataStr);
          }
        }
      });
    },
    getCourseData() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize,
        searchParas: {
          conditions: [
            {
              name: "status",
              op: "eq",
              type: "int",
              value: 1
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.course_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          // this.pageData.current = result.result.page++;
          this.courseDatas = result.result.list;
        }
      });
    },
    getTeacherData() {
      let params = {
        page: this.pageData2.current - 1,
        pageSize: this.pageData2.pageSize,
        searchParas: {
          conditions: [
            {
              name: "userType",
              op: "eq",
              type: "string",
              value: "2"
            }
          ],
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
.teacher-listitem-img {
  // width: 150px;
  // height: 150px;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
}
.course-listitem p {
  // position: absolute;
  // left: 170px;
  // top: 15px;
  // text-align: left;
  text-align: center;
  font-size: 14px;
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
