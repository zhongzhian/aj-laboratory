<template>
  <div class="notice-content">
    <div class="notice-content-left">
      <div class="layout-content-title">数据统计</div>
      <div v-if="showChart">
        <div id="main" style="width: 600px;height:400px;"></div>
      </div>
      <div v-if="!showChart">无</div>
    </div>
    <div class="notice-content-right"></div>
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
    this.getTableDatas();
  },
  methods: {
    initChart(_data) {
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "课程成绩统计",
          // subtext: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "课程成绩统计",
            type: "pie",
            radius: "50%",
            data: _data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getTableDatas() {
      this.axios
        .post(`${API.index.test_list}`, {
          searchParas: {
            conditions: [
              {
                name: "testType",
                op: "eq",
                type: "int",
                value: 1
                // },
                // {
                //   name: "status",
                //   op: "eq",
                //   type: "int",
                //   value: 2
              }
            ],
            logic: "and"
          }
        })
        .then(result => {
          if (result.code === 20000) {
            let d90 = 0,
              d80 = 0,
              d70 = 0,
              d60 = 0,
              d50 = 0;
            result.result.list.forEach(r => {
              if (r.scored < 60) d50++;
              else if (r.scored < 70) d60++;
              else if (r.scored < 80) d70++;
              else if (r.scored < 90) d80++;
              else d90++;
            });
            let _data = [
              { value: d90, name: "优（90）" },
              { value: d80, name: "良（80）" },
              { value: d70, name: "中（70）" },
              { value: d60, name: "及格（60）" },
              { value: d50, name: "不及格（60以下）" }
            ];
            this.initChart(_data);
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
<style></style>

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
