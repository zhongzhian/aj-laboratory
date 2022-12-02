<template>
  <div>
    <div class="table-condition-btnbar">
      <template v-if="showDetail">
        <Button @click="showDetail = false" size="small" class="condition-btn"
          >返回</Button
        >
      </template>
      <template v-if="!showDetail">
        {{ courseInfo.name }}
      </template>
    </div>

    <div class="manage-content-right-content">
      <div v-if="!showDetail" class="student-test-list">
        <div
          @click="getTestDetail(item)"
          :key="item"
          v-for="item in examDatas"
          class="student-test-item"
        >
          <Card>
            <p slot="title">{{ item.testTemplateName }}</p>
            <p class="student-test-item-p color-red" v-if="item.status === 0">
              未完成
            </p>
            <p
              class="student-test-item-p color-yellow"
              v-if="item.status === 1"
            >
              已交卷，未评分
            </p>
            <p class="student-test-item-p color-green" v-if="item.status === 2">
              已完成评分
            </p>
            <p class="student-test-item-p">{{ item.updateTime }}</p>
          </Card>
        </div>
      </div>
      <div v-if="showDetail">
        <div
          v-if="templateInfo.testPartInstancePublicVoList"
          class="manage-content-html"
        >
          <div class="testinstance-title">{{ testInfo.name }}</div>
          <div class="testinstance-desc">
            课程总分 100，本实验报告占分
            {{ testInfo.score }}。<br />
            以下为本报告四大分项占分情况：
          </div>
          <div class="testinstance-desc">
            <span
              style="margin-right:30px;"
              :key="testsub"
              v-for="testsub in testInfo.testSubsectionInstancePublicVoList"
              >{{ testsub.name }}: {{ testsub.score }}
            </span>
          </div>
          <!-- 
            ，目前得分 {{ testInfo.scored }}
            以及目前得分
            {{ testsub.scored }}/
           -->
          <div
            style="position: absolute;left: 0;right: 0;bottom: 0;top: 150px;"
          >
            <div class="normal-tabs">
              <div class="normal-tabs-header">
                <div class="normal-tabs-header-title active">
                  实验报告
                </div>
              </div>
              <div class="normal-tabs-content">
                <div v-if="testInfo.status === 2" class="course-exam-score">
                  已完成评分，得分{{ templateInfo.scored }}
                </div>
                <div v-if="testInfo.status === 1" class="course-exam-score">
                  已交卷，未评分
                </div>
                <div v-if="testInfo.status === 0" class="course-exam-score">
                  未交卷
                  <Button @click="submitTest" size="small" class="condition-btn"
                    >交卷</Button
                  >
                </div>
                <div
                  :key="item"
                  v-for="(item,
                  index) in templateInfo.testPartInstancePublicVoList"
                  class="course-exam-bigTest"
                >
                  <p class="course-exam-bigTest-title">
                    {{ item.serialNumber }}.{{ item.name }}
                    <span style="font-size:12px;font-weight400;"
                      >（{{ item.score }}分）</span
                    >
                    <span style="float:right;font-size:12px;font-weight400;">{{
                      convertTestType(item.type)
                    }}</span>
                  </p>
                  <div class="course-exam-bigTest-content">
                    <div
                      :key="test"
                      v-for="(test, sindex) in item.testExerciseInstanceList"
                      class="course-exam-test"
                    >
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
                          <danxuan
                            :testobj="test"
                            :status="testInfo.status"
                          ></danxuan>
                        </template>
                        <!-- 多选题 -->
                        <template v-if="test.exercisesType === 2">
                          <duoxuan
                            :testobj="test"
                            :status="testInfo.status"
                          ></duoxuan>
                        </template>
                        <!-- 填空题 -->
                        <template v-if="test.exercisesType === 3">
                          <tiankong
                            :testobj="test"
                            :status="testInfo.status"
                          ></tiankong>
                        </template>
                        <!-- 判断题 -->
                        <template v-if="test.exercisesType === 4">
                          <panduan
                            :testobj="test"
                            :status="testInfo.status"
                          ></panduan>
                        </template>
                        <!-- 问答题 -->
                        <template v-if="test.exercisesType === 5">
                          <wenda
                            :testobj="test"
                            :status="testInfo.status"
                          ></wenda>
                        </template>
                        <!-- 计算题 -->
                        <template v-if="test.exercisesType === 6">
                          <jisuan
                            :testobj="test"
                            :status="testInfo.status"
                          ></jisuan>
                        </template>
                      </div>
                      <!-- <div class="course-exam-test-result">{{test.correctAnswer}}</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
export default {
  components: { danxuan, duoxuan, tiankong, panduan, wenda, jisuan },
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      recordInfo: null,
      testInfo: null,
      showDetail: false,
      chapterTitle: "",
      sectionTitle: "",
      sectionId: 0,
      sectionInfo: {},
      templateInfo: {},
      examDatas: [],
      examColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "testTemplateName"
        },
        {
          title: "试卷类型",
          key: "testType",
          render: (h, params) => {
            let str = params.row.testType === 1 ? "实验报告" : "问卷调查";
            return h("span", str);
          }
        },
        {
          title: "总分",
          key: "score"
        },
        {
          title: "说明",
          key: "description"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.getTemplateDetail(params.id);
                      this.showTemplate = true;
                      // this.showBigTest = true;
                    }
                  }
                },
                "开始答题"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getCourse();
      this.getExamDatas();
    }
  },
  methods: {
    submitTest() {
      this.axios
        .post(`${API.index.test_submit}` + this.testInfo.id)
        .then(result => {
          if (result.code === 20000) {
            this.showDetail = false;
            this.getExamDatas();
          }
        });
    },
    getTestDetail(item) {
      this.axios
        .post(`${API.index.test_start}` + item.testTemplateId, null)
        .then(result => {
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
    getExamDatas() {
      this.axios
        .get(`${API.index.course_detail_getmy}` + this.courseId, null)
        .then(result => {
          if (result.code === 20000) {
            this.recordInfo = result.result;
            this.examDatas = result.result.testRecordList;
          }
        });
    },
    templaterowClick(item, index) {
      // this.templateObj = item;
      this.getTemplateDetail(item.id);
      this.showEdittemplate = true;
    },
    getTableDatas() {
      this.axios
        .get(`${API.index.course_detail_getmy}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            // this.recordInfo = result.result;
            let recordInfo = result.result;
            if (
              recordInfo.chapterStudyRecordPublicVoList &&
              recordInfo.chapterStudyRecordPublicVoList.length > 0
            ) {
              recordInfo.chapterStudyRecordPublicVoList = recordInfo.chapterStudyRecordPublicVoList.map(
                r => {
                  if (
                    r.sectionStudyRecordList &&
                    r.sectionStudyRecordList.length > 0
                  ) {
                    r.sectionStudyRecordList = r.sectionStudyRecordList.map(
                      s => {
                        return {
                          ...s,
                          studiedStr: parseInt(s.studied * 100) + "%"
                        };
                      }
                    );
                  }
                  return { ...r, studiedStr: parseInt(r.studied * 100) + "%" };
                }
              );
            }
            this.recordInfo = recordInfo;
          }
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
    },
    getCourse() {
      this.axios
        .get(`${API.index.course_getDetail + "/"}` + this.courseId)
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
.normal-tabs {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.normal-tabs-header {
  height: 50px;
  // line-height: 50px;
  font-size: 14px;
  padding: 0px 16px;
  margin-right: 16px;
}
.normal-tabs-header-title {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 16px;
  cursor: pointer;
}
.normal-tabs-header-title.active {
  color: #70ac1f;
  border-bottom: solid 2px #70ac1f;
}
.normal-tabs-content {
  position: absolute;
  top: 50px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
}
// exam
.student-test-list {
  position: relative;
}
.student-test-item {
  display: inline-block;
  margin: 0 20px 20px 0;
  min-width: 200px;
}
.student-test-item-p {
  font-size: 12px;
}
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
  vertical-align: top;
}
</style>
