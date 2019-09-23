<template>
  <div>
    <div class="table-condition-btnbar">
      <div class="manage-content-breadcrumb">
        <span class="manage-content-breadcrumb-span">{{recordInfo.courseName}}</span>
        <span class="manage-content-breadcrumb-span" v-if="sectionTitle">></span>
        <span
          class="manage-content-breadcrumb-span"
          style="cursor:pointer;"
          v-if="sectionTitle"
          @click="sectionTitle = ''"
        >{{chapterTitle}}</span>
        <span class="manage-content-breadcrumb-span" v-if="sectionTitle">></span>
        <span class="manage-content-breadcrumb-span" v-if="sectionTitle">{{sectionTitle}}</span>
      </div>
    </div>
    <div class="manage-content-right-content">
      <div v-if="!sectionTitle">
        <div
          :key="item"
          v-for="(item,index) in recordInfo.chapterStudyRecordPublicVoList"
          class="course-chapter-item"
        >
          <div class="course-chapter-item-header" style="cursor:default;">
            <span>{{item.chapterName+" - "+item.chapterTitle}}</span>
          </div>
          <div class="course-chapter-item-content">
            <p
              :key="section"
              v-for="(section,sindex) in item.sectionStudyRecordList"
              class="manage-collapse-p"
            >
              <Button
                v-if="section.testStatus === 0"
                @click="selectSections(section)"
                size="small"
                class="condition-btn"
              >前往测验</Button>
              <Button
                v-if="section.testStatus > 0"
                @click="selectSections(section)"
                size="small"
                class="condition-btn"
                style="border:1px solid #dddee1;background:#f7f7f7;color:#495060;"
              >查看答卷</Button>
              <span>{{section.sectionName+" - "+section.sectionTitle}}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-if="sectionTitle">
        <div v-if="templateInfo.testPartInstancePublicVoList" class="manage-content-html">
          <div
            v-if="templateInfo.status === 2"
            class="course-exam-score"
          >已完成评分，得分{{templateInfo.scored}}</div>
          <div v-if="templateInfo.status === 1" class="course-exam-score">已交卷，未评分</div>
          <div v-if="templateInfo.status === 0" class="course-exam-score">
            未交卷
            <Button @click="submitTest" size="small" class="condition-btn">交卷</Button>
          </div>
          <div
            :key="item"
            v-for="(item,index) in templateInfo.testPartInstancePublicVoList"
            class="course-exam-bigTest"
          >
            <p class="course-exam-bigTest-title">
              {{item.serialNumber}}.{{item.name}}
              <span
                style="font-size:12px;font-weight400;"
              >（{{item.score}}分）</span>
              <!-- <span
                style="float:right;font-size:12px;font-weight400;"
              >总分{{item.score}}分</span>-->
              <span
                style="float:right;font-size:12px;font-weight400;"
              >{{convertTestType(item.type)}}</span>
            </p>
            <div class="course-exam-bigTest-content">
              <div
                :key="test"
                v-for="(test,sindex) in item.testExerciseInstanceList"
                class="course-exam-test"
              >
                <!-- <p class="course-exam-test-title"></p> -->
                <div
                  class="course-exam-test-content"
                >{{test.serialNumber}}.{{test.exerciseContent}}（{{test.score}}分）</div>
                <div class="course-exam-test-answer">
                  <!-- 单选题 -->
                  <template v-if="test.exercisesType === 1">
                    <danxuan :testobj="test" :status="templateInfo.status"></danxuan>
                  </template>
                  <!-- 多选题 -->
                  <template v-if="test.exercisesType === 2">
                    <duoxuan :testobj="test" :status="templateInfo.status"></duoxuan>
                  </template>
                  <!-- 填空题 -->
                  <template v-if="test.exercisesType === 3">
                    <tiankong :testobj="test" :status="templateInfo.status"></tiankong>
                  </template>
                  <!-- 判断题 -->
                  <template v-if="test.exercisesType === 4">
                    <panduan :testobj="test" :status="templateInfo.status"></panduan>
                  </template>
                  <!-- 问答题 -->
                  <template v-if="test.exercisesType === 5">
                    <wenda :testobj="test" :status="templateInfo.status"></wenda>
                  </template>
                  <!-- 计算题 -->
                  <template v-if="test.exercisesType === 6">
                    <jisuan :testobj="test" :status="templateInfo.status"></jisuan>
                  </template>
                </div>
                <!-- <div class="course-exam-test-result">{{test.correctAnswer}}</div> -->
              </div>
            </div>
          </div>
          <!-- <div v-if="templateInfo.status === 0" class="submit-btn-div">
            <Button
              :disabled="templateInfo.status > 0"
              class="submit-btn"
              type="primary"
              @click="submitTest"
            >交卷</Button>
          </div>
          <div v-else class="submit-btn-div">您已交卷</div> -->
        </div>
        <div v-else>
          <div class="submit-btn-div">本小节没有测验内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";

import danxuan from "./component/danxuan.vue";
import duoxuan from "./component/duoxuan.vue";
import tiankong from "./component/tiankong.vue";
import panduan from "./component/panduan.vue";
import wenda from "./component/wenda.vue";
import jisuan from "./component/jisuan.vue";
export default {
  components: { danxuan, duoxuan, tiankong, panduan, wenda, jisuan },
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      recordInfo: null,
      chapterTitle: "",
      sectionTitle: "",
      sectionId: 0,
      sectionInfo: {},
      templateInfo: {}
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getTableDatas();
      // this.getCourse();
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
    startTest() {
      this.axios
        .post(`${API.index.startTestBySectionId}` + this.sectionId)
        .then(result => {
          if (result.code === 20000) {
            this.templateInfo = result.result;
          }
        });
    },
    selectSections(section) {
      this.sectionId = section.sectionId;
      // this.chapterTitle = section.chapterName+'·'+section.chapterTitle;
      // this.sectionTitle = section.sectionName+'·'+section.sectionTitle;

      this.axios
        .get(`${API.index.getMyBySectionId}` + this.sectionId)
        .then(result => {
          if (result.code === 20000) {
            this.templateInfo = result.result;
          } else {
            this.templateInfo = {};
            this.startTest(section);
          }
          this.chapterTitle = section.chapterTitle;
          this.sectionTitle = section.sectionTitle;
        });

      // this.chapterTitle = section.chapterTitle;
      // this.sectionTitle = section.sectionTitle;
      // this.templateInfo = {
      //   id: 3,
      //   name: "1232123123",
      //   description: "2222",
      //   score: 100,
      //   courseId: 1,
      //   courseName: "通信工程",
      //   chapterId: 1,
      //   chapterName: "第一章",
      //   chapterTitle: "什么是通信工程",
      //   sectionId: 3,
      //   sectionName: "第一节",
      //   sectionTitle: "发展历程",
      //   createTime: "2019-08-02 16:14:28",
      //   updateTime: "2019-08-02 16:14:28",
      //   testPartTemplatePublicVoList: [
      //     {
      //       id: 3,
      //       name: "单选题",
      //       type: 1,
      //       description: "11111",
      //       serialNumber: 1,
      //       score: 100,
      //       testTemplateId: 3,
      //       createTime: "2019-08-02 16:14:28",
      //       updateTime: "2019-08-02 16:14:28",
      //       testExerciseTemplateList: [
      //         {
      //           id: 1,
      //           exerciseId: 2,
      //           exerciseContent: "选A",
      //           exercisesType: 1,
      //           options: '[{"A": "1"},{"B": "2"},{"C": "3"},{"D": "4"}]',
      //           answer: "A",
      //           testTemplateId: 3,
      //           testPartTemplateId: 3,
      //           serialNumber: 1,
      //           score: 1,
      //           createTime: "2019-08-02 16:14:28",
      //           updateTime: "2019-08-02 16:14:28"
      //         }
      //       ]
      //     }
      //   ]
      // };
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
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
// exam
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
</style>
