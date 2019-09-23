<template>
  <div>
    <div class="table-condition-btnbar">
      <div class="manage-content-breadcrumb">
        <span v-if="isGuest" class="manage-content-breadcrumb-span">{{courseInfo.name}}</span>
        <span v-else class="manage-content-breadcrumb-span">{{recordInfo.courseName}}</span>
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
      <template v-if="isGuest">
        <div v-if="!sectionTitle">
          <div
            :key="item"
            v-for="(item,index) in courseInfo.chapterList"
            class="course-chapter-item"
          >
            <div class="course-chapter-item-header" style="cursor:default;">
              <span>{{item.name+" - "+item.title}}</span>
            </div>
            <div class="course-chapter-item-content">
              <p
                :key="section"
                v-for="(section,sindex) in item.sectionList"
                class="manage-collapse-p"
              >
                <Button
                  @click="selectSections(section)"
                  size="small"
                  class="condition-btn"
                >查看内容</Button>
                <span>{{section.name+" - "+section.title}}</span>
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="!sectionTitle">
          <div
            :key="item"
            v-for="(item,index) in recordInfo.chapterStudyRecordPublicVoList"
            class="course-chapter-item"
          >
            <div class="course-chapter-item-header" style="cursor:default;">
              <span>{{item.chapterName+" - "+item.chapterTitle}}</span>
              <span style="float:right;">{{"进度："+item.studiedStr}}</span>
            </div>
            <div class="course-chapter-item-content">
              <p
                :key="section"
                v-for="(section,sindex) in item.sectionStudyRecordList"
                class="manage-collapse-p"
              >
                <Button
                  v-if="section.studyStatus === 0"
                  @click="startStudy(section)"
                  size="small"
                  class="condition-btn"
                >开始学习</Button>
                <Button
                  v-if="section.studyStatus > 0"
                  @click="selectSections(section)"
                  size="small"
                  class="condition-btn"
                  style="border:1px solid #dddee1;background:#f7f7f7;color:#495060;"
                >再次学习</Button>
                <span>{{section.sectionName+" - "+section.sectionTitle}}</span>
                <span style="float:right;">{{"进度："+section.studiedStr}}</span>
              </p>
            </div>
          </div>
        </div>
      </template>

      <div v-if="sectionTitle">
        <div class="normal-tabs">
          <div style="position:absolute;top:5px;left:250px;width:100px;">
            <Button
              v-if="sectionInfo.studyStatus === 1"
              @click="endStudy"
              size="small"
              class="condition-btn"
            >完成学习</Button>
          </div>
          <div class="normal-tabs-header">
            <div
              @click="tabindex = '1'"
              class="normal-tabs-header-title"
              :class="tabindex === '1' ? 'active':''"
            >内容</div>
            <div
              @click="tabindex = '2'"
              class="normal-tabs-header-title"
              :class="tabindex === '2' ? 'active':''"
            >视频</div>
            <div
              @click="tabindex = '3'"
              class="normal-tabs-header-title"
              :class="tabindex === '3' ? 'active':''"
            >PDF</div>
          </div>
          <div v-show="tabindex === '1'" class="normal-tabs-content">
            <!-- <div class="manage-content-html" v-html="sectionInfo.content"></div> -->
            <div v-html="sectionInfo.content"></div>
          </div>
          <div v-show="tabindex === '2'" class="normal-tabs-content">
            <div class="normal-video-div">
              <!-- autoplay -->
              <video :src="sectionInfo.video" controls></video>
            </div>
          </div>
          <div v-show="tabindex === '3'" class="normal-tabs-content">
            <!-- <iframe :src="sectionInfo.pdf" width="100%" height="100%">
              该浏览器无法支持PDF，请点击查看：
              <a href="PDF地址">下载 PDF</a>
            </iframe>-->
            <template v-if="sectionInfo.pdf">
              <object :data="sectionInfo.pdf" type="application/pdf" width="100%" height="100%">
                <p>
                  <b>返回内容</b>: 该浏览器不支持PDFs.请点击查看:
                  <a href="PDF地址">Download PDF</a>.
                </p>
              </object>
            </template>
            <template v-else>无</template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      isGuest: false,
      tabindex: "1",
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      recordInfo: null,
      chapterTitle: "",
      sectionTitle: "",
      sectionId: 0,
      sectionInfo: {}
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      if (this.userInfo.userType === "0") {
        this.isGuest = true;
        this.getCourseDatas();
      } else {
        this.isGuest = false;
        this.getTableDatas();
      }
      // this.getCourse();
    }
  },
  methods: {
    startStudy(section) {
      this.sectionId = section.sectionId;
      this.axios
        .get(`${API.index.section_start}` + this.sectionId)
        .then(result => {
          if (result.code === 20000) {
            this.sectionInfo = result.result;
            this.sectionInfo.studyStatus = 1;
            section.studyStatus = 1;
            this.chapterTitle = section.chapterTitle;
            this.sectionTitle = section.sectionTitle;
            this.tabindex = "1";
          }
        });
    },
    endStudy() {
      this.axios
        .get(`${API.index.section_finish}` + this.sectionId)
        .then(result => {
          if (result.code === 20000) {
            this.getTableDatas();
            this.sectionTitle = "";
          }
        });
    },
    selectSections(section) {
      if (this.isGuest) {
        this.sectionId = section.id;
      } else {
        this.sectionId = section.sectionId;
      }
      // this.chapterTitle = section.chapterName+'·'+section.chapterTitle;
      // this.sectionTitle = section.sectionName+'·'+section.sectionTitle;

      this.axios.get(`${API.index.section}/` + this.sectionId).then(result => {
        if (result.code === 20000) {
          this.sectionInfo = result.result;
          // this.sectionInfo.studyStatus = 1;
          this.chapterTitle = result.result.chapterTitle;
          this.sectionTitle = result.result.title;
          this.tabindex = "1";
        }
      });
    },
    getCourseDatas() {
      this.axios
        .get(`${API.index.course_getDetail + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
          }
        });
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
    }
  }
};
</script>
<style>
</style>

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
  // cursor: pointer;
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
