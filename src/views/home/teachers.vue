<template>
  <div>
    <!-- banner -->
    <div class="layout-row">
      <!-- <div class="banner-mask"></div> -->
      <div class="layout-content">
        <div v-if="searchText" class="search-result-word">
          共有 {{ pageData.total }} 条“{{ searchText }}”相关结果
        </div>
        <div v-if="!searchText" class="search-result-word">
          共有 {{ pageData.total }} 条结果
        </div>
        <!-- <div style="margin: 20px 0 10px;width:930px;border:1px solid #ccc;padding:5px 20px;">
          <span class="search-switch-span">全部</span>
          <span class="header-span" style="margin:0 5px;">|</span>
          <span class="search-switch-span">正在进行</span>
          <span class="header-span" style="margin:0 5px;">|</span>
          <span class="search-switch-span">即将开始</span>
          <span class="header-span" style="margin:0 5px;">|</span>
          <span class="search-switch-span">已结束</span>
        </div>-->
        <div class="search-main">
          <div class="search-main-left">
            <div class="search-main-left-list">
              <div :key="item" v-for="(item, index) in courseDatas" class="search-main-left-listitem">
                <div class="search-main-left-listitem-img">
                  <Avatar class="teacher-listitem-img" size="large" :src="item.userImage || nopersonPath" />
                  <div class="search-main-left-listitem-img-title color-content">
                    {{ item.personName }}
                  </div>
                  <!-- <div
                    class="search-main-left-listitem-img-desc color-subcontent"
                  >
                    职务：{{ item.title || "-" }}
                  </div> -->
                </div>
                <div class="search-main-left-listitem-content">
                  <p :style="textEllipsis" class="text-ellipsis3" style="margin: 15px 0 0;font-size: 12px;color:#666;">
                    个人简介：{{ item.description || "无" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="search-main-left-page">
              <Page :total="pageData.total" :current="pageData.current" :page-size="pageData.pageSize" prev-text="上一页"
                next-text="下一页" placement="top" @on-change="currentChange" />
            </div>
          </div>
          <div class="search-main-right">
            <div class="search-main-right-title">为您推荐的课程</div>
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
        nopersonPath: "static/images/noperson.png",
        textEllipsis: "-webkit-box-orient: vertical;",
        value1: 0,
        courseDatas: [],
        courseDatas2: [],
        searchText: "",
        pageData: {
          total: 0,
          current: 1,
          pageSize: 5
        }
      };
    },
    mounted() {
      let searchText = this.$route.query.text;
      if (searchText) {
        this.searchText = searchText;
      }
      this.getTableDatas();
      this.getTableDatas2();
      this.$nextTick(() => {
        console.log("teachers menuchange", "3");
        this.$emit("menuchange", "3");
      });
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
      getTableDatas() {
        let params = {
          page: this.pageData.current - 1,
          pageSize: this.pageData.pageSize,
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
            this.pageData.total = result.result.totalNum;
            this.courseDatas = result.result.list;
          }
        });
      },
      getTableDatas2() {
        let params = {
          page: 0,
          pageSize: 5,
          searchParas: {
            conditions: [{
                name: "status",
                op: "eq",
                type: "int",
                value: 1
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
            this.courseDatas2 = result.result.list;
          }
        });
      },
      currentChange(v) {
        this.pageData.current = v;
        console.log("page", v);
        this.getTableDatas();
      }
    }
  };
</script>
<style>
  .search-main-left-page .ivu-page-item {
    border: none !important;
  }

  .search-main-left-page .ivu-page-prev,
  .search-main-left-page .ivu-page-next {
    border: none !important;
  }
</style>

<style lang="less" scoped>
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
    margin: 0 20px;
  }

  .search-result-word {
    padding: 20px 0px 10px;
    font-size: 14px;
    color: #666;
  }

  .search-switch-span {
    cursor: pointer;
  }

  .search-main {
    position: relative;
  }

  .search-main-left {
    position: relative;
    width: 930px;
  }

  .search-main-right {
    position: absolute;
    top: 10px;
    bottom: 20px;
    right: 30px;
    width: 200px;
    overflow: auto;
  }

  .search-main-left-listitem {
    position: relative;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    // height: 175px;
  }

  .search-main-left-listitem-img {
    position: absolute;
    width: 266px;
    height: 100px;
    top: 10px;
    left: 0;
    bottom: 10px;
    cursor: pointer;
    z-index: 1;
  }

  .search-main-left-listitem-img-title {
    position: absolute;
    top: 25px;
    right: 0;
    left: 0;
    padding-left: 160px;
    text-align: left;
    font-size: 18px;
  }

  .search-main-left-listitem-img-desc {
    position: absolute;
    top: 50px;
    right: 0;
    left: 0;
    padding-left: 160px;
    text-align: left;
    font-size: 12px;
  }

  .search-main-left-listitem-img img {
    width: 100%;
    height: 100%;
  }

  .search-main-left-listitem-content {
    padding: 10px 10px 10px 280px;
    position: relative;
    height: 100px;
  }

  .search-main-left-listitem-content-nump {
    font-size: 10px;
    color: #999;
    bottom: 5px;
    position: absolute;
    left: 280px;
  }

  .search-main-left-page {
    margin: 30px 0;
    background: #f1f2f3;
    padding: 10px;
    text-align: center;
  }

  .search-main-right-title {
    border-left: 3px solid rgb(112, 172, 31);
    // margin-bottom: 10px;
    line-height: 20px;
    padding: 0 5px;
    font-size: 20px;
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
