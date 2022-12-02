<template>
  <div>
    <template v-if="!templateInfo">
      <div class="table-condition-btnbar">
        <Cascader
          style="width:400px;display:inline-block;"
          @on-change="selectSections"
          clearable
          :data="chapterDatas"
          :load-data="loadData"
        ></Cascader>
        <Checkbox style="margin-left:10px;" v-model="isAll">包含已阅卷</Checkbox>
        <Button
          style="margin-left:10px;"
          @click="getTableDatas"
          size="small"
          class="condition-btn"
        >刷新</Button>
      </div>
      <div class="manage-content-right-content" style="top: 75px;">
        <div>
          <!-- <f-table
            @on-select="rowSelect"
            @on-row-click="rowClick"
            :columns="columns1"
            :dataSource="data1"
          ></f-table>-->
          <b-table
            @page-data-change="currentChange"
            :pageData="pageData1"
            @on-select="rowSelect"
            @on-row-click="rowClick"
            :columns="columns1"
            :dataSource="data1"
          ></b-table>
        </div>
      </div>
    </template>
    <template v-if="templateInfo">
      <div style="position: absolute;top: 15px;left: 15px;right: 15px;bottom: 15px;">
        <div class="manage-content-html">
          <div class="table-condition-btnbar">
            <Button class="condition-btn" size="small" @click="templateInfo=null">返回</Button>
            <Button v-if="!isFinish" class="condition-btn" size="small" @click="submitTest">完成阅卷</Button>
          </div>
          <div v-if="isFinish" class="course-exam-score">已完成评分，得分{{templateInfo.scored}}</div>
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
                <!-- <div
                  class="course-exam-test-content"
                >{{test.serialNumber}}.{{test.exerciseContent}}（{{test.score}}分）</div>-->
                <div v-if="test.displayType === 2" class="course-exam-test-content">
                  <div>{{test.serialNumber}}.（{{test.score}}分）</div>
                  <img
                    v-if="test.exerciseContent"
                    :src="test.exerciseContent"
                    class="test-content-img"
                  />
                </div>
                <div
                  v-else
                  class="course-exam-test-content"
                >{{test.serialNumber}}.{{test.exerciseContent}}（{{test.score}}分）</div>
                <div class="course-exam-test-answer">
                  <!-- 单选题 -->
                  <template v-if="test.exercisesType === 1">
                    <danxuan :testobj="test" :status="templateInfo.status" :grade="true"></danxuan>
                  </template>
                  <!-- 多选题 -->
                  <template v-if="test.exercisesType === 2">
                    <duoxuan :testobj="test" :status="templateInfo.status" :grade="true"></duoxuan>
                  </template>
                  <!-- 填空题 -->
                  <template v-if="test.exercisesType === 3">
                    <tiankong :testobj="test" :status="templateInfo.status" :grade="true"></tiankong>
                  </template>
                  <!-- 判断题 -->
                  <template v-if="test.exercisesType === 4">
                    <panduan :testobj="test" :status="templateInfo.status" :grade="true"></panduan>
                  </template>
                  <!-- 问答题 -->
                  <template v-if="test.exercisesType === 5">
                    <wenda :testobj="test" :status="templateInfo.status" :grade="true"></wenda>
                  </template>
                  <!-- 计算题 -->
                  <template v-if="test.exercisesType === 6">
                    <jisuan :testobj="test" :status="templateInfo.status" :grade="true"></jisuan>
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

import danxuan from "../course/component/danxuan.vue";
import duoxuan from "../course/component/duoxuan.vue";
import tiankong from "../course/component/tiankong.vue";
import panduan from "../course/component/panduan.vue";
import wenda from "../course/component/wenda.vue";
import jisuan from "../course/component/jisuan.vue";
export default {
  components: { danxuan, duoxuan, tiankong, panduan, wenda, jisuan },
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      chapterDatas: [],
      chapterId: 0,
      sectionId: 0,
      sectionInfo: {},
      templateInfo: null,

      isAll: false,
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      columns1: [
        {
          title: "章",
          maxWidth: 300,
          ellipsis: true,
          tooltip: true,
          key: "chapterName",
          render: (h, params) => {
            return h(
              "span",
              params.row.chapterName + "-" + params.row.chapterTitle
            );
          }
        },
        {
          title: "节",
          maxWidth: 300,
          ellipsis: true,
          tooltip: true,
          key: "sectionName",
          render: (h, params) => {
            return h(
              "span",
              params.row.sectionName + "-" + params.row.sectionTitle
            );
          }
        },
        {
          title: "答卷人",
          key: "userName"
        },
        {
          title: "交卷时间",
          key: "updateTime"
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            if (params.row.status === 2) {
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
                        this.selectTest(params.row);
                      }
                    }
                  },
                  "查看"
                )
              ]);
            } else {
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
                        this.selectTest(params.row);
                      }
                    }
                  },
                  "阅卷"
                )
              ]);
            }
          }
        }
      ],
      data1: []
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getChapters();
      this.getTableDatas();
    }
  },
  computed: {
    isFinish() {
      return this.templateInfo.status === 2;
    }
  },
  methods: {
    submitTest() {
      this.axios
        .post(`${API.index.test_finish}` + this.templateInfo.id)
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
    selectTest(test) {
      this.axios.get(`${API.index.test_getDetail}` + test.id).then(result => {
        if (result.code === 20000) {
          this.templateInfo = result.result;
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
          conditions: [
            {
              name: "chapterId",
              op: "eq",
              type: "int",
              value: item.value
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.section_list}`, params).then(result => {
        if (result.code === 20000) {
          item.children = result.result.list.map(s => {
            return { ...s, value: s.id, label: s.name + "-" + s.title };
          });
          item.loading = false;
          callback();
        }
      });
    },
    getChapters() {
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
    currentChange(v) {
      this.pageData1.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let id = this.courseId;
      let url = `${API.index.test_listByCourseId}` + id;
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize,
        searchParas: {
          conditions: [
            {
              name: "status",
              op: "eq",
              type: "int",
              value: 1
            }
          ],
          logic: "and"
        }
      };
      if (this.isAll) {
        params.searchParas.conditions = [
          {
            name: "status",
            op: "noeq",
            type: "int",
            value: 0
          }
        ];
      }
      if (this.sectionId) {
        url = `${API.index.test_listBySectionId}` + this.sectionId;
      }
      this.axios.post(url, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          this.data1 = result.result.list;
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
</style>
