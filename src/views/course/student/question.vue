ha<template>
  <div>
    <div class="table-condition-btnbar">
      须知：问卷调查不影响课程成绩。问题一旦确定答案，不能修改。
    </div>
    <div class="manage-content-right-content">
      <div v-if="!showDetail" class="student-test-list">
        本课程未设置问卷。
      </div>
      <div v-if="showDetail">
        <div
          v-if="templateInfo.testExerciseInstanceList"
          class="manage-content-html"
        >
          <!-- <div class="testinstance-title">{{ templateInfo.name }}</div> -->
          <div v-if="templateInfo.status === 0" class="course-exam-score">
            <Button @click="submitTest" size="small" class="condition-btn"
              >提交</Button
            >
          </div>
          <div class="course-exam-bigTest">
            <div class="course-exam-bigTest-content">
              <div
                :key="test"
                v-for="(test, sindex) in templateInfo.testExerciseInstanceList"
                class="course-exam-test"
              >
                <div class="course-exam-test-content">
                  <div class="course-exam-test-content-inline">
                    {{ test.serialNumber }}.
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
                      :status="templateInfo.status"
                      :isquestion="isquestion"
                    ></danxuan>
                  </template>
                  <!-- 多选题 -->
                  <template v-if="test.exercisesType === 2">
                    <duoxuan
                      :testobj="test"
                      :status="templateInfo.status"
                      :isquestion="isquestion"
                    ></duoxuan>
                  </template>
                  <!-- 填空题 -->
                  <template v-if="test.exercisesType === 3">
                    <tiankong
                      :testobj="test"
                      :status="templateInfo.status"
                      :isquestion="isquestion"
                    ></tiankong>
                  </template>
                  <!-- 判断题 -->
                  <template v-if="test.exercisesType === 4">
                    <panduan
                      :testobj="test"
                      :status="templateInfo.status"
                      :isquestion="isquestion"
                    ></panduan>
                  </template>
                  <!-- 问答题 -->
                  <template v-if="test.exercisesType === 5">
                    <wenda
                      :testobj="test"
                      :status="templateInfo.status"
                      :isquestion="isquestion"
                    ></wenda>
                  </template>
                  <!-- 计算题 -->
                  <template v-if="test.exercisesType === 6">
                    <jisuan
                      :testobj="test"
                      :status="templateInfo.status"
                      :isquestion="isquestion"
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
      isquestion: true,
      showDetail: false,
      templateId: 0,
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
        .post(`${API.index.test_submit}` + this.templateInfo.id)
        .then(result => {
          if (result.code === 20000) {
            this.recordInfo = result.result;
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
              this.templateInfo = this.testInfo.testSubsectionInstancePublicVoList[3];
            }
            this.showDetail = true;
          }
        });
    },
    getQuestionDetail() {
      this.axios
        .post(`${API.index.test_start}` + this.templateId, null)
        .then(result => {
          if (result.code === 20000) {
            if (result.result.testExerciseInstanceList) {
              result.result.testExerciseInstanceList = result.result.testExerciseInstanceList.sort(
                (a, b) => {
                  return a.serialNumber - b.serialNumber;
                }
              );
            }
            this.templateInfo = result.result;

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
            this.showDetail = this.recordInfo.isQuestionnaireFinish;
            if (this.recordInfo.questionnaireTemplateId) {
              this.templateId = this.recordInfo.questionnaireTemplateId;
              this.getQuestionDetail();
            }
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
// exam
.student-test-list {
  position: relative;
}
.student-test-item {
  display: inline-block;
  margin: 0 20px 20px 0;
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
}
</style>
