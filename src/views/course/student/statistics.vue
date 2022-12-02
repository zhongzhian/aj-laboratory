<template>
  <div>
    <!-- v-show="selectedUser" -->
    <div>
      <div class="layout-content-title">课程总成绩</div>
      <template v-if="!showChart">
        老师未评分
      </template>
      <template v-if="showChart">
        <div style="padding: 20px 0;">
          <span style="margin-right:30px;font-size:18px;"
            >总分: {{ selectedUser.score }}
          </span>
          <span style="margin-right:30px;"
            >课程预习: {{ selectedUser.preStudyScore }}
          </span>
          <span style="margin-right:30px;"
            >实验操作: {{ selectedUser.operationScore }}
          </span>
          <span style="margin-right:30px;"
            >实验数据: {{ selectedUser.dataScore }}
          </span>
          <span style="margin-right:30px;"
            >数据分析: {{ selectedUser.dataAnalysisScore }}
          </span>
          <span style="margin-right:30px;"
            >实验报告: {{ selectedUser.reportScore }}
          </span>
        </div>
        <div>
          <div id="userMain" style="width: 600px;height:400px;"></div>
        </div>
        <div class="table-condition-btnbar">
          实验报告成绩
        </div>
        <div>
          <Table size="small" :columns="columns2" :data="data2"></Table>
        </div>
        <div v-if="selectedReport" class="table-condition-btnbar">
          实验报告 [{{ selectedReport.name }}] 成绩
        </div>
        <div>
          <div id="userReportMain" style="width: 600px;height:400px;"></div>
          <!-- <div id="userReportRadarMain" style="width: 600px;height:400px;"></div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      showChart: false,
      class1: "全部",
      classList: [],

      columns2: [
        {
          title: "名称",
          maxWidth: 300,
          ellipsis: true,
          tooltip: true,
          key: "name"
        },
        {
          title: "满分",
          maxWidth: 100,
          key: "score"
        },
        {
          title: "目前得分",
          maxWidth: 100,
          key: "scored"
        },
        {
          title: "评分时间",
          key: "updateTime"
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
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
                    click: () => {
                      console.log("params", params);
                      this.selectReport(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      data2: [],

      selectedUser: null,
      selectedReport: null
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getCourseStatistics();
      // this.getStudentsDatas();
    }
  },
  methods: {
    getCourseStatistics() {
      this.axios
        .get(`${API.index.course_detail_getmy}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.selectedUser = result.result;
            // this.showChart = this.selectedUser.status > 1;
            this.showChart = true;
            if (this.showChart) {
              let _data = [
                { value: this.selectedUser.preStudyScore, name: "课程预习" },
                { value: this.selectedUser.operationScore, name: "实验操作" },
                { value: this.selectedUser.dataScore, name: "实验数据" },
                {
                  value: this.selectedUser.dataAnalysisScore,
                  name: "数据分析"
                },
                { value: this.selectedUser.reportScore, name: "实验报告" }
              ];
              this.$nextTick(() => {
                this.initUserMain(_data);
              });
              this.getStudentsReportDatas();
            }
          }
        });
    },
    selectReport(reoprt) {
      console.log("selectedReport", reoprt);
      this.selectedReport = reoprt;
      this.axios
        .get(`${API.index.test_getDetail + "/"}` + reoprt.id)
        .then(result => {
          if (result.code === 20000) {
            let _data = [],
              _radar = [],
              _radardata = [];
            result.result.testSubsectionInstancePublicVoList.forEach(sub => {
              _data.push({ value: sub.scored, name: sub.name });
              _radar.push({ max: sub.score, text: sub.name });
              _radardata.push(sub.scored);
            });
            console.log("_radar", _radar);
            console.log("_radardata", _radardata);
            this.initUserReportMain(_data, _radar, _radardata);
          }
        });
    },
    initUserMain(_data) {
      var myChart = echarts.init(document.getElementById("userMain"));
      var option = {
        title: {
          text: "课程总成绩",
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
            name: "分项成绩",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: _data
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    initUserReportMain(_data, _radar, _radardata) {
      var myChart = echarts.init(document.getElementById("userReportMain"));
      var option = {
        title: {
          text: "实验报告 [" + this.selectedReport.name + "] 成绩",
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
            name: "分项成绩",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: _data
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      // var myChart1 = echarts.init(
      //   document.getElementById("userReportRadarMain")
      // );
      // var option1 = {
      //   title: {
      //     text: "基础雷达图"
      //   },
      //   tooltip: {},
      //   legend: {
      //     data: ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"]
      //   },
      //   radar: {
      //     // shape: 'circle',
      //     name: {
      //       textStyle: {
      //         color: "#fff",
      //         backgroundColor: "#999",
      //         borderRadius: 3,
      //         padding: [3, 5]
      //       }
      //     },
      //     indicator: [
      //       { name: "销售（sales）", max: 6500 },
      //       { name: "管理（Administration）", max: 16000 },
      //       { name: "信息技术（Information Techology）", max: 30000 },
      //       { name: "客服（Customer Support）", max: 38000 },
      //       { name: "研发（Development）", max: 52000 },
      //       { name: "市场（Marketing）", max: 25000 }
      //     ]
      //   },
      //   series: [
      //     {
      //       name: "预算 vs 开销（Budget vs spending）",
      //       type: "radar",
      //       // areaStyle: {normal: {}},
      //       data: [
      //         {
      //           value: [4300, 10000, 28000, 35000, 50000, 19000],
      //           name: "预算分配（Allocated Budget）"
      //         },
      //         {
      //           value: [5000, 14000, 28000, 31000, 42000, 21000],
      //           name: "实际开销（Actual Spending）"
      //         }
      //       ]
      //     }
      //   ]
      // };

      // // 使用刚指定的配置项和数据显示图表。
      // myChart1.setOption(option1);
    },
    getStudentsReportDatas() {
      this.axios
        .get(`${API.index.test_getMyByCourseId}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            let _data1 = result.result.filter(r => {
              return r.testType === 1;
            });
            this.data2 = _data1;
          }
        });
    },
    initChart(_category, _series) {
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        xAxis: {
          type: "category",
          data: _category
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: _series,
            type: "bar"
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getClass() {
      let params = {
        courseId: this.courseId,
        type: 0
      };
      this.axios
        .post(`${API.index.class_getbycourseid}`, params)
        .then(result => {
          if (result.code === 20000) {
            let classList = ["全部"];
            this.classList = classList.concat(result.result);
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
