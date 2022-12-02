<template>
  <div>
    <div class="table-condition-btnbar">
      <!-- <RadioGroup v-model="filterType">
        <Radio label="按年级"></Radio>
        <Radio label="按班"></Radio>
      </RadioGroup>
      <Select
        v-if="filterType === '按年级'"
        v-model="grade"
        style="width:200px"
      >
        <Option v-for="item in gradelist" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Select v-if="filterType === '按班'" v-model="class1" style="width:200px">
        <Option v-for="item in class1list" :value="item" :key="item">{{
          item
        }}</Option>
      </Select> -->
      <Select
        @on-change="gradeChange"
        v-model="grade"
        style="width:150px;margin-left:10px;"
      >
        <Option v-for="item in gradeList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Select
        @on-change="majorChange"
        v-model="major"
        style="width:150px;margin-left:10px;"
      >
        <Option v-for="item in majorList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <Select
        @on-change="classChange"
        v-model="class1"
        style="width:150px;margin-left:10px;"
      >
        <Option v-for="item in classList" :value="item" :key="item">{{
          item
        }}</Option>
      </Select>
      <!-- <Button
        @click="getQuestionDatas"
        size="small"
        class="condition-btn"
        style="margin-left:10px;"
        >查询</Button
      > -->
      <span style="margin-left:20px;"
        >须知：以下问卷调查结果只统计当前各问题的答案的选择人数。</span
      >
    </div>
    <div class="manage-content-right-content">
      <div>
        <div
          v-if="testInfo && testInfo.testExerciseTemplateList"
          class="manage-content-html"
        >
          <div class="course-exam-bigTest">
            <div class="course-exam-bigTest-content">
              <div
                :key="test"
                v-for="(test, sindex) in testInfo.testExerciseTemplateList"
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
                  <template
                    v-if="test.exercisesType === 1 || test.exercisesType === 2"
                  >
                    <div :key="option" v-for="option in test.optionArr">
                      答案【{{ option.content }}】，选择人数：{{
                        option.selectNumber || "0"
                      }}
                    </div>
                    <!-- <span
                      style="margin-right:30px;"
                      :key="option"
                      v-for="option in test.optionArr"
                      >{{ option.content }}: {{ option.selectNumber || "0" }}
                    </span> -->
                  </template>
                  <!-- 问答题 -->
                  <template v-if="test.exercisesType === 5">
                    <Button
                      @click="showQuestionAnswer(test)"
                      size="small"
                      class="condition-btn"
                      style="margin-left:10px;"
                      >查看答案</Button
                    >
                  </template>
                </div>
                <!-- <div class="course-exam-test-result">{{test.correctAnswer}}</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Drawer
      title="学生回答"
      v-model="showAnswers"
      width="60%"
      :mask-closable="true"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <div>
          <div :key="item" v-for="item in answerDatas" class="comment-itemdiv">
            <!-- <div class="comment-itemdiv-avatar">
            <Avatar size="large" icon="ios-person" :src="item.userImage" />
          </div> -->
            <div class="comment-itemdiv-title" style="top:10px;">
              {{ item.userName }}
              <!-- <div style="color:#999;">[学生]</div> -->
            </div>
            <!-- <div class="comment-itemdiv-desc">
              学生：{{ item.userName || "-" }}
            </div> -->
            <div class="comment-itemdiv-content" style="margin:0;">
              <div v-if="item.answer" v-html="item.answer"></div>
              <div v-else style="color: #999;">[未作答]</div>
            </div>
            <div class="comment-itemdiv-desc">发表于 {{ item.updateTime }}</div>
          </div>
        </div>
      </div>
      <div class="demo-drawer-footer">
        <div class="hyz-page">
          <Page
            show-elevator
            show-total
            size="small"
            :page-size="pageData.pageSize"
            :total="pageData.total"
            :current="pageData.current"
          />
        </div>
      </div>
    </Drawer>
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
      showAnswers: false,
      answerDatas: [],
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      templateId: 0,
      filterType: "按年级",
      major: "全部专业",
      grade: "全部年级",
      class1: "全部班",
      majorList: ["全部专业"],
      gradeList: ["全部年级"],
      classList: ["全部班"]
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getCourse();
      // this.getMajor();
      this.getGrade();
      // this.getClass1();
      this.getQuestionDatas();
      // this.getExamDatas();
    }
  },
  methods: {
    submitTest() {
      this.axios
        .post(`${API.index.test_submit}` + this.templateInfo.id)
        .then(result => {
          if (result.code === 20000) {
            this.templateInfo = result.result;
          }
        });
    },
    showQuestionAnswer(test) {
      this.showAnswers = true;
      this.selectedTest = test;
      this.pageData = {
        total: 0,
        current: 1,
        pageSize: 10
      };
      this.getTableDatas();
    },
    currentChange1(v) {
      this.pageData.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let params = {
        page: this.pageData.current - 1,
        pageSize: this.pageData.pageSize,
        searchParas: {
          conditions: [
            {
              name: "testExerciseTemplateId",
              op: "eq",
              type: "int",
              value: this.selectedTest.id
            }
          ],
          logic: "and"
        }
        // sortDirection: "asc",
        // sortProperties: "userName"
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
      this.axios
        .post(`${API.index.test_instance_list}`, params)
        .then(result => {
          if (result.code === 20000) {
            this.pageData.total = result.result.totalNum;
            this.answerDatas = result.result.list;
          }
        });
    },
    getQuestionDetail() {
      this.axios
        .get(
          `${API.index.testTemplate_detail}` +
            "/" +
            this.recordInfo.testTemplateId
        )
        .then(result => {
          if (result.code === 20000) {
            if (result.result.testExerciseTemplateList) {
              result.result.testExerciseTemplateList = result.result.testExerciseTemplateList.map(
                t => {
                  let optionArr = JSON.parse(t.options);
                  return {
                    ...t,
                    optionArr
                  };
                }
              );
            }
            this.testInfo = result.result;
            console.log("this.testInfo", this.testInfo);
          }
        });
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
      this.getQuestionDatas();
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
      this.getQuestionDatas();
    },
    classChange() {
      this.pageData1 = {
        total: 0,
        current: 1,
        pageSize: 10
      };
      this.getQuestionDatas();
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
        type: 0
      };
      if (this.major != "全部专业") {
        params.major = this.major;
      }
      if (this.grade != "全部年级") {
        params.grade = this.grade;
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
    getQuestionDatas() {
      let params = {
        class1: "",
        courseId: this.courseId,
        grade: "",
        major: ""
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
      this.axios
        .post(`${API.index.test_questionresult_getbycourseid}`, params)
        .then(result => {
          if (result.code === 20000) {
            if (result.result) {
              if (result.result.testExerciseTemplateList) {
                result.result.testExerciseTemplateList = result.result.testExerciseTemplateList.map(
                  t => {
                    let optionArr = JSON.parse(t.options);
                    return {
                      ...t,
                      optionArr
                    };
                  }
                );
              }
              this.testInfo = result.result;
              console.log("this.testInfo", this.testInfo);
            }
          }
        });
    },
    getExamDatas() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "testType",
              op: "eq",
              type: "int",
              value: 2
            }
          ],
          logic: "and"
        }
      };
      this.axios
        .post(`${API.index.test_listByCourseId}` + this.courseId, params)
        .then(result => {
          if (result.code === 20000) {
            if (result.result.totalNum > 0) {
              this.recordInfo = result.result.list[0];
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

.comment-itemdiv {
  font-size: 14px;
  line-height: 22px;
  color: #333;
  padding: 10px 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  border-bottom: solid 1px #eee;
}
.comment-itemdiv-action {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.comment-itemdiv-avatar {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border-radius: 100%;
  margin-right: 8px;
  vertical-align: middle;
  position: absolute;
  padding: 5px;
}
.comment-itemdiv-title {
  text-align: center;
  font-size: 12px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
  color: #222;

  width: 50px;
  margin-right: 8px;
  vertical-align: middle;
  position: absolute;
  top: 55px;
}
.comment-itemdiv-rate {
  padding-left: 65px;
  text-align: left;
  margin: 10px 0 0 0;
  position: relative;
}
.comment-itemdiv-content {
  padding-left: 65px;
  text-align: left;
  min-height: 50px;
  margin: 10px 0;
  position: relative;
}
.comment-itemdiv-desc {
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
</style>
