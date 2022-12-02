<template>
  <div>
    <div class="table-condition-btnbar">
      header
    </div>
    <template v-if="!showDetail">
      <div>无待评分</div>
    </template>
    <template v-if="showDetail">
      <div style="position: absolute;top: 15px;left: 15px;right: 15px;bottom: 15px;">
        <div class="manage-content-html">
          <div class="table-condition-btnbar">
            <Button class="condition-btn" size="small" @click="showDetail = false">返回</Button>
            <Button v-if="!isFinish" class="condition-btn" size="small" @click="submitTest">完成评分</Button>
          </div>

          <div v-if="isFinish" class="course-exam-score">
            已完成评分，得分{{ testInfo.scored }}
          </div>

          <div class="testinstance-title">{{ testInfo.name }}</div>
          <div class="testinstance-desc">
            本实验报告占分
            {{ testInfo.score }}。其中各分项占分：
          </div>
          <div :key="testsub" v-for="testsub in testInfo.testSubsectionInstancePublicVoList" class="testinstance-desc">
            {{ testsub.name }}({{ testsub.score }}):<InputNumber style="margin-left:10px;"
              :disabled="testsub.type === 4 || !isAdmin" :max="testsub.score" :min="0" v-model="testsub.scored">
            </InputNumber>
            <Button v-if="testsub.type != 4" :disabled="!isAdmin" style="margin-left:10px;" class="condition-btn"
              size="small" @click="gradeTest(testsub)">评分</Button>
          </div>
          <div :key="item" v-for="(item, index) in templateInfo.testPartInstancePublicVoList"
            class="course-exam-bigTest">
            <p class="course-exam-bigTest-title">
              {{ item.serialNumber }}.{{ item.name }}
              <span style="font-size:12px;font-weight400;">（{{ item.score }}分）</span>
              <!-- <span
                style="float:right;font-size:12px;font-weight400;"
              >总分{{item.score}}分</span>-->
              <span style="float:right;font-size:12px;font-weight400;">{{
                convertTestType(item.type)
              }}</span>
            </p>
            <div class="course-exam-bigTest-content">
              <div :key="test" v-for="(test, sindex) in item.testExerciseInstanceList" class="course-exam-test">
                <!-- <div
                  v-if="test.displayType === 2"
                  class="course-exam-test-content"
                >
                  <div>{{ test.serialNumber }}.（{{ test.score }}分）</div>
                  <img
                    v-if="test.exerciseContent"
                    :src="test.exerciseContent"
                    class="test-content-img"
                  />
                </div>
                <div v-else class="course-exam-test-content">
                  <div class="course-exam-test-content-inline">
                    （{{ test.score }}分）{{ test.serialNumber }}.
                  </div>
                  <div class="course-exam-test-content-inline">
                    <div v-html="test.exerciseContent"></div>
                  </div>
                </div> -->

                <div class="course-exam-test-content">
                  <div class="course-exam-test-content-inline">
                    （{{ test.score }}分）{{ test.serialNumber }}.
                  </div>
                  <div class="course-exam-test-content-inline">
                    <div v-html="test.exerciseContent"></div>
                  </div>
                </div>
                <div class="course-exam-test-answer">
                  <!-- 单选题 -->
                  <template v-if="test.exercisesType === 1">
                    <danxuan :testobj="test" :status="testInfo.status" :grade="true"></danxuan>
                  </template>
                  <!-- 多选题 -->
                  <template v-if="test.exercisesType === 2">
                    <duoxuan :testobj="test" :status="testInfo.status" :grade="true"></duoxuan>
                  </template>
                  <!-- 填空题 -->
                  <template v-if="test.exercisesType === 3">
                    <tiankong :testobj="test" :status="testInfo.status" :grade="true"></tiankong>
                  </template>
                  <!-- 判断题 -->
                  <template v-if="test.exercisesType === 4">
                    <panduan :testobj="test" :status="testInfo.status" :grade="true"></panduan>
                  </template>
                  <!-- 问答题 -->
                  <template v-if="test.exercisesType === 5">
                    <wenda :testobj="test" :status="testInfo.status" :grade="true"></wenda>
                  </template>
                  <!-- 计算题 -->
                  <template v-if="test.exercisesType === 6">
                    <jisuan :testobj="test" :status="testInfo.status" :grade="true"></jisuan>
                  </template>
                </div>
                <!-- <div class="course-exam-test-result">{{test.correctAnswer}}</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import API from "@/api";

  import danxuan from "../component/danxuan.vue";
  import duoxuan from "../component/duoxuan.vue";
  import tiankong from "../component/tiankong.vue";
  import panduan from "../component/panduan.vue";
  import wenda from "../component/wenda.vue";
  import jisuan from "../component/jisuan.vue";
  import classselect from "../component/classselect.vue"
  export default {
    components: {
      danxuan,
      duoxuan,
      tiankong,
      panduan,
      wenda,
      jisuan,
      classselect
    },
    data() {
      return {
        isAdmin: false,
        courseId: 0,
        courseInfo: null,
        userInfo: null,
        chapterDatas: [],
        chapterId: 0,
        sectionId: 0,
        sectionInfo: {},
        showDetail: false,
        testInfo: null,
        templateInfo: null,
        classSelectData: {
          major: "",
          grade: "",
          class1: ""
        },

        showClose: false,
        searchName: "",
        searchKey: "",
      };
    },
    computed: {
      isFinish() {
        return this.testInfo.status === 2;
      }
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      let courseId = this.$route.query.id;
      if (this.userInfo) {
        this.isAdmin = this.userInfo.userName === "admin";
      }
      if (courseId) {
        this.courseId = courseId;
        // this.getChapters();
        // this.getClass1();
        // this.refreshData();

        // this.getMyGrade();
        this.getOneToGrade();
      }
    },
    // beforeDestroy() {
    //   console.log("beforeDestroy");
    //   this.showClose = true;
    // },
    methods: {
      submitTest() {
        this.axios
          .post(`${API.index.test_finish}` + this.testInfo.id)
          .then(result => {
            if (result.code === 20000) {
              this.testInfo = result.result;
            }
          });
      },
      gradeTest(testsub) {
        let params = {
          scored: testsub.scored,
          testSubsectionInstanceId: testsub.id,
          type: 2
        };
        this.axios.post(`${API.index.test_grade}`, params).then(result => {
          if (result.code === 20000) {
            // this.testInfo = result.result;
            this.$Message.success("评分成功！");
          }
        });
      },
      startTest() {
        this.axios
          .post(`${API.index.startTestBySectionId}` + this.sectionId)
          .then(result => {
            if (result.code === 20000) {
              this.templateInfo = result.result;
            }
          });
      },
      selectTest(test) {
        this.axios.get(`${API.index.test_getDetail}` + test.id).then(result => {
          if (result.code === 20000) {
            this.testInfo = result.result;
            if (
              this.testInfo.testSubsectionInstancePublicVoList &&
              this.testInfo.testSubsectionInstancePublicVoList[3]
            ) {
              let templateInfo = this.testInfo
                .testSubsectionInstancePublicVoList[3];
              if (templateInfo) {
                templateInfo.testPartInstancePublicVoList = templateInfo.testPartInstancePublicVoList
                  .sort((a, b) => {
                    return a.serialNumber - b.serialNumber;
                  })
                  .map(part => {
                    let testExerciseInstanceList =
                      part.testExerciseInstanceList || [];
                    testExerciseInstanceList = testExerciseInstanceList.sort(
                      (a, b) => {
                        return a.serialNumber - b.serialNumber;
                      }
                    );
                    part.testExerciseInstanceList = testExerciseInstanceList;
                    return part;
                  });
              }
              this.templateInfo = templateInfo;
            }
            this.showDetail = true;
          }
        });
      },
      selectSections(value, selectedData) {
        this.chapterId = value[0];
        this.sectionId = value[1];
        this.getTableDatas();
      },
      loadData(item, callback) {
        item.loading = true;
        let params = {
          searchParas: {
            conditions: [{
              name: "chapterId",
              op: "eq",
              type: "int",
              value: item.value
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.section_list}`, params).then(result => {
          if (result.code === 20000) {
            item.children = result.result.list.map(s => {
              return {
                ...s,
                value: s.id,
                label: s.name + "-" + s.title
              };
            });
            item.loading = false;
            callback();
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
              return {
                ...c,
                children: [],
                value: c.id,
                label: c.name + "-" + c.title,
                loading: false
              };
            });
          }
        });
      },
      exportDatas() {
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
                name: "testType",
                op: "eq",
                type: "int",
                value: 1
              }
            ],
            logic: "and"
          },
          sortDirection: "asc",
          sortProperties: "name"
        };
        if (this.isOnlyNot) {
          params.searchParas.conditions = [{
              name: "status",
              op: "eq",
              type: "int",
              value: 1
            },
            {
              name: "testType",
              op: "eq",
              type: "int",
              value: 1
            }
          ];
        }
        if (this.class1 != "全部班") {
          params.searchParas.conditions.push({
            name: "class1",
            op: "eq",
            type: "string",
            value: this.class1
          });
        }
        this.axios({
          method: "post",
          url: `${API.index.test_export}` + this.courseId,
          data: params,
          responseType: "arraybuffer"
        }).then(result => {
          console.log(`${this.class1}-成绩表`);
          this.saveExcel(result, `${this.class1}-成绩表`);
        });
      },
      saveExcel(data, title) {
        if (!data) {
          return;
        }
        let blob = new Blob([data], {
          type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.download = title + ".xls";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      getMyGrade() {
        let id = this.courseId;
        let url = `${API.index.test_instance_getmygrade}` + id;
        this.axios.get(url).then(result => {
          if (result.code === 20000) {}
        });
      },
      getOneToGrade() {
        let id = this.courseId;
        let url = `${API.index.test_instance_getonetograde}` + id;
        this.axios.get(url).then(result => {
          if (result.code === 20000) {}
        });
      },
      convertTestType(type) {
        //1-单选题 2-多选题 3-填空题 4-判断题 5-问答题 6-计算题
        let str = "";
        if (type) {
          switch (type) {
            case 1:
              str = "单选题";
              break;
            case 2:
              str = "多选题";
              break;
            case 3:
              str = "填空题";
              break;
            case 4:
              str = "判断题";
              break;
            case 5:
              str = "问答题";
              break;
            case 6:
              str = "计算题";
              break;
          }
        }
        return str;
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  // exam
  .testinstance-title {
    font-size: 20px;
    font-weight: 500;
    padding: 10px;
  }

  .testinstance-desc {
    padding: 10px;
  }

  .course-exam-bigTest {
    position: relative;
    margin-bottom: 10px;
  }

  .course-exam-bigTest-title {
    background: #d9ead6;
    height: 30px;
    line-height: 30px;
    position: relative;
    padding: 0 10px;
    font-weight: 600;
    font-size: 14px;
  }

  .course-exam-bigTest-content {
    line-height: 20px;
    position: relative;
    padding: 10px 20px;
  }

  .course-exam-test {
    border-bottom: solid 1px #ccc;
    margin-bottom: 10px;
  }

  .course-exam-test:last-child {
    border-bottom: none;
  }

  .course-exam-test-answer {
    padding: 5px 20px;
  }

  .manage-content-breadcrumb-span {
    color: #999;
    font-size: 14px;
    margin-right: 10px;
  }

  .manage-content-breadcrumb-span:last-child {
    font-weight: bold;
    color: #495060;
  }

  .manage-content-right-title {
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    line-height: 30px;
  }

  .manage-content-right-content {
    position: absolute;
    top: 68px;
    bottom: 15px;
    left: 25px;
    right: 25px;
  }

  .manage-content-html {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }

  .course-chapter-item {
    margin-top: 10px;
  }

  .course-chapter-item-icon {
    margin-right: 5px;
    cursor: pointer;
  }

  .course-chapter-item-header {
    background: #d9ead6;
    height: 30px;
    line-height: 30px;
    // color: #666;
    cursor: pointer;
    position: relative;
    padding: 0 10px;
  }

  .course-chapter-item-content {
    color: #495060;
    padding: 0 16px;
    background-color: #fff;
    margin: 10px 0;
  }

  .course-exam-test-content-inline {
    display: inline-block;
  }
</style>
