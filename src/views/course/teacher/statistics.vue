<template>
  <div>
    <div class="layout-content-title" style="padding: 10px 0;">
      <Select @on-change="gradeChange" v-model="grade" style="width:150px;margin-left:10px;">
        <Option v-for="item in gradeList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Select @on-change="majorChange" v-model="major" style="width:150px;margin-left:10px;">
        <Option v-for="item in majorList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Select @on-change="getCourseStatistics" v-model="class1" style="width:150px;margin-left:10px;">
        <Option v-for="item in classList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Checkbox style="margin-left:10px;" v-model="isOnly" @on-change="onlyChange">只看本期成绩</Checkbox>
    </div>
    <!-- <div class="table-condition-btnbar">
      班级<Select
        @on-change="getCourseStatistics"
        v-model="class1"
        style="width:400px;margin-left:10px;"
      >
        <Option v-for="item in classList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
    </div> -->
    <div v-if="showChart">
      <div id="main" style="width: 600px;height:400px;"></div>
    </div>
    <div v-if="!showChart">无</div>
    <!-- <div class="layout-content-title">
      学生
    </div> -->

    <div class="table-condition-btnbar">
      <Input v-model="searchName" size="small" placeholder="姓名" style="width:200px;" />
      <Button style="margin-left:10px;" @click="getStudentsDatas(1)" size="small" class="condition-btn">查询</Button>
    </div>
    <div>
      <b-table @page-data-change="currentChange" @page-size-change="sizeChange" :pageData="pageData1"
        :columns="columns1" :dataSource="data1">
      </b-table>
    </div>
    <!-- v-show="selectedUser" -->
    <div v-if="selectedUser">
      <div class="layout-content-title">{{ selectedUser.userName }} 的成绩</div>
      <div>
        <div id="userMain" style="width: 600px;height:400px;"></div>
      </div>
      <div class="table-condition-btnbar">
        {{ selectedUser.userName }} 的实验报告成绩
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
        major: "全部专业",
        grade: "全部年级",
        class1: "全部班",
        majorList: ["全部专业"],
        gradeList: ["全部年级"],
        classList: ["全部班"],
        isOnly: false,

        searchName: "",
        pageData1: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        columns1: [{
            title: "姓名",
            maxWidth: 100,
            tooltip: true,
            key: "userName"
          },
          {
            title: "班级",
            ellipsis: true,
            key: "class1"
          },
          {
            title: "课程总得分",
            maxWidth: 100,
            key: "score"
          },
          {
            title: "课程预习",
            maxWidth: 100,
            key: "preStudyScore"
          },
          {
            title: "实验操作",
            maxWidth: 100,
            key: "operationScore"
          },
          {
            title: "实验数据",
            maxWidth: 100,
            key: "dataScore"
          },
          {
            title: "数据分析",
            maxWidth: 100,
            key: "dataAnalysisScore"
          },
          {
            title: "实验报告",
            maxWidth: 100,
            key: "reportScore"
          },
          {
            title: "评分时间",
            maxWidth: 200,
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
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        console.log("params", params);
                        this.selectUser(params.row);
                      }
                    }
                  },
                  "查看"
                )
              ]);
            }
          }
        ],
        data1: [],
        columns2: [{
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
                  "Button", {
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
        this.showChart = true;
        this.getGrade();
        this.getCourseStatistics();
        // this.getStudentsDatas();
      }
    },
    methods: {
      selectUser(user) {
        console.log("selectUser", user);
        this.selectedUser = user;
        let _data = [{
            value: this.selectedUser.preStudyScore,
            name: "课程预习"
          },
          {
            value: this.selectedUser.operationScore,
            name: "实验操作"
          },
          {
            value: this.selectedUser.dataScore,
            name: "实验数据"
          },
          {
            value: this.selectedUser.dataAnalysisScore,
            name: "数据分析"
          },
          {
            value: this.selectedUser.reportScore,
            name: "实验报告"
          }
        ];
        this.$nextTick(() => {
          this.initUserMain(_data);
        });
        this.getStudentsReportDatas();
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
                _data.push({
                  value: sub.scored,
                  name: sub.name
                });
                _radar.push({
                  max: sub.score,
                  text: sub.name
                });
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
            text: this.selectedUser.userName + "本课程总成绩",
            left: "center"
          },
          tooltip: {
            trigger: "item"
          },
          legend: {
            orient: "vertical",
            left: "left"
          },
          series: [{
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
          }]
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
          series: [{
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
          }]
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
      onlyChange(e) {
        console.log("onlyChange", e);
        this.isOnly = e;
        this.pageData1 = {
          total: 0,
          current: 1,
          pageSize: 10
        };
        // this.major = "全部专业";
        // this.grade = "全部年级";
        // this.class1 = "全部班";
        // this.getMajor();
        this.getCourseStatistics();
      },

      gradeChange() {
        this.pageData1 = {
          total: 0,
          current: 1,
          pageSize: 10
        };
        this.major = "全部专业";
        this.class1 = "全部班";
        this.classList = ["全部班"];
        if (this.grade === "全部年级") {
          this.majorList = ["全部专业"];
        } else {
          this.getMajor();
        }
        this.getCourseStatistics();
      },
      majorChange() {
        this.pageData1 = {
          total: 0,
          current: 1,
          pageSize: 10
        };
        this.class1 = "全部班";
        if (this.major === "全部专业") {
          this.classList = ["全部班"];
        } else {
          this.getClass();
        }
        this.getCourseStatistics();
      },
      getCourseStatistics() {
        let params = {
          // class1: "计算机信息学院->软件工程->2020级->2.0",
          courseId: this.courseId,
          type: this.isOnly ? 1 : 0
        };
        if (this.major != "全部专业") {
          params.major = this.major;
        }
        if (this.grade != "全部年级") {
          params.grade = this.grade;
        }
        if (this.class1 != "全部班") {
          params.class1 = this.class1;
        }
        this.axios.post(`${API.index.study_statistics}`, params).then(result => {
          if (result.code === 20000) {
            let category = [],
              series = [];

            category.push("优");
            series.push(result.result["优"]);
            category.push("良");
            series.push(result.result["良"]);
            category.push("中");
            series.push(result.result["中"]);
            category.push("及格");
            series.push(result.result["及格"]);
            category.push("不及格");
            series.push(result.result["不及格"]);
            // for (let cate in result.result) {
            //   category.push(cate);
            //   series.push(result.result[cate]);
            // }
            this.initChart(category, series);
            this.getStudentsDatas();
          }
        });
      },
      getStudentsDatas(_page) {
        let params = {
          page: _page ? _page - 1 : this.pageData1.current - 1,
          pageSize: this.pageData1.pageSize,
          searchParas: {
            conditions: [],
            logic: "and"
          }
        };
        if (this.major != "全部专业") {
          params.searchParas.conditions.push({
            name: "major",
            op: "eq",
            type: "string",
            value: this.major
          });
        }
        if (this.grade != "全部年级") {
          params.searchParas.conditions.push({
            name: "grade",
            op: "eq",
            type: "string",
            value: this.grade
          });
        }
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
            op: "eq",
            type: "string",
            value: this.searchName
          });
        }
        if (this.isOnly) {
          params.searchParas.conditions.push({
            name: "isOld",
            op: "eq",
            type: "int",
            value: this.isOnly ? 0 : 1
          });
        }
        this.axios
          .post(`${API.index.study_listByCourseId}` + this.courseId, params)
          .then(result => {
            if (result.code === 20000) {
              this.pageData1.total = result.result.totalNum;
              let _data1 = result.result.list;
              this.data1 = _data1;
            }
          });
      },
      sizeChange(v) {
        this.pageData1.current = 1;
        this.pageData1.pageSize = v;
        this.getStudentsDatas();
      },
      currentChange(v) {
        console.log("v", v);
        this.pageData1.current = v;
        this.getStudentsDatas();
      },
      getStudentsReportDatas() {
        let params = {
          searchParas: {
            conditions: [{
                name: "userId",
                op: "eq",
                type: "int",
                value: this.selectedUser.userId
              },
              {
                name: "testType",
                op: "eq",
                type: "int",
                value: 1
              }
            ],
            logic: "and"
          }
        };
        this.axios
          .post(`${API.index.test_listByCourseId}` + this.courseId, params)
          .then(result => {
            if (result.code === 20000) {
              let _data1 = result.result.list;
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
          series: [{
            data: _series,
            type: "bar"
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      getGrade() {
        let params = {
          courseId: this.courseId,
          type: this.isOnly ? 1 : 0
        };
        this.axios
          .post(`${API.index.grade_getbycourseid}`, params)
          .then(result => {
            if (result.code === 20000) {
              let gradeList = ["全部年级"];
              this.gradeList = gradeList.concat(result.result);
            }
          });
      },
      getMajor() {
        let params = {
          courseId: this.courseId,
          type: this.isOnly ? 1 : 0
        };
        if (this.grade != "全部年级") {
          params.grade = this.grade;
        }
        this.axios
          .post(`${API.index.major_getbycourseid}`, params)
          .then(result => {
            if (result.code === 20000) {
              let majorList = ["全部专业"];
              this.majorList = majorList.concat(result.result);
            }
          });
      },
      getClass() {
        let params = {
          courseId: this.courseId,
          type: this.isOnly ? 1 : 0
        };
        if (this.grade != "全部年级") {
          params.grade = this.grade;
        }
        if (this.major != "全部专业") {
          params.major = this.major;
        }
        this.axios
          .post(`${API.index.class_getbycourseid}`, params)
          .then(result => {
            if (result.code === 20000) {
              let classList = ["全部班"];
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
