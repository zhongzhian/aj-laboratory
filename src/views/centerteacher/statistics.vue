<template>
  <div class="notice-content">
    <div class="notice-content-left">
      <!-- <div class="notice-content-left-box">
        <p>亲爱的 {{userInfo.personName || userInfo.userName}}</p>
        <p>欢迎您加入课程，赶快开启学习之旅吧～</p>
        <Button @click="gotoPage" class="notice-content-left-box-btn" type="warning">开始学习</Button>
      </div>-->
      <div class="layout-content-title">数据统计</div>
      <div>无</div>
    </div>
    <div class="notice-content-right">
      <!-- <div class="notice-content-right-box">
        <p style="font-size:16px;line-height:30px;">即将到期</p>
        <p style="font-size:12px;color:#70ac1f;">非线性系统的描述单元测试</p>
        <p style="font-size:8px ;">截止提交时间：2019年07月14日 00:00</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import API from "@/api";

// 开始使用 G2 绘制地图
var provinceChart = void 0;

// 当前聚焦的区域
var currentAreaNode = void 0;
export default {
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      data1: []
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      //   this.getTableDatas();
      this.getCourse();
    }
  },
  methods: {
    getTableDatas() {
      let params = {
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
      this.axios.post(`${API.index.announcement_list}`, params).then(result => {
        if (result.code === 20000) {
          this.data1 = result.result.list;
        }
      });
    },
    gotoPage() {
      this.$router.push({
        name: "manage-index-chapter",
        query: {
          id: this.courseId
        }
      });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
          }
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.notice-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.notice-content-left {
  position: absolute;
  top: 10px;
  left: 20px;
  bottom: 20px;
  right: 250px;
}
.notice-content-right {
  position: absolute;
  top: 10px;
  bottom: 20px;
  right: 30px;
  width: 200px;
}
.notice-content-left-box {
  background-color: #f1f2f3;
  padding: 5px;
  position: relative;
  margin-bottom: 20px;
}
.notice-content-left-box-btn {
  width: 200px;
  position: absolute;
  right: 20px;
  top: 7px;
}
.notice-content-left-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
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
.notice-content-right-box {
  background-color: #f7f8f9;
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
