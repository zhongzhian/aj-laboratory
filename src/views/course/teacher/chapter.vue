<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn"
        >新建章</Button
      >
    </div>
    <div class="manage-content-right-content">
      <div
        :key="item"
        v-for="(item, index) in chapterDatas"
        class="course-chapter-item"
      >
        <div class="course-chapter-item-header">
          <Icon
            class="course-chapter-item-icon"
            @click.stop="addSection(item)"
            type="android-add"
          />
          <Icon
            class="course-chapter-item-icon"
            style="background:#2d8cf0;"
            @click.stop="editChapter(item)"
            type="edit"
          />
          <Icon
            v-if="courseInfo.status === 0"
            class="course-chapter-item-icon"
            style="background:#e83b46;"
            @click.stop="delItem('chapter', item, index)"
            type="android-delete"
          />
          {{ item.name + " - " + item.title }}
        </div>
        <div class="course-chapter-item-content">
          <div
            :key="section"
            v-for="(section, sindex) in item.sectionList"
            class="manage-collapse-p"
          >
            <Icon
              class="course-chapter-item-icon"
              style="background:#2d8cf0;"
              @click.stop="editSection(section, item, sindex)"
              type="edit"
            />
            <Icon
              v-if="courseInfo.status === 0"
              class="course-chapter-item-icon"
              style="background:#e83b46;"
              @click.stop="delItem('section', section, sindex)"
              type="android-delete"
            />
            {{ section.name + " - " + section.title }}
            <!-- <p>
              <Button
                @click="configTest(section, item)"
                size="small"
                class="condition-btn"
                >习题列表</Button
              >
              <Button
                @click="configTemplate(section, item)"
                size="small"
                class="condition-btn"
                >试卷模版</Button
              >
            </p> -->
          </div>
        </div>
      </div>
    </div>
    <Drawer
      title="课程-章"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newChapter" :rules="ruleValidate">
          <Row>
            <Col span="24">
              <FormItem label="名称" prop="name">
                <Input
                  v-model="newChapter.name"
                  size="small"
                  placeholder="请输入名称"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="标题" prop="title">
                <Input
                  v-model="newChapter.title"
                  size="small"
                  placeholder="请输入标题"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('formValidate')"
          >保存</Button
        >
      </div>
    </Drawer>
    <Drawer
      title="课程-章-节"
      v-model="showAddSection"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="sectionValidate" :model="newSection" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input
                  v-model="newSection.name"
                  size="small"
                  placeholder="请输入名称"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="标题" prop="title">
                <Input
                  v-model="newSection.title"
                  size="small"
                  placeholder="请输入标题"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="学习文档PDF">
                <Input v-model="newSection.docPdf" size="small" readonly />
                <Upload
                  ref="upload_docPdf"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="true"
                  :on-success="handleSuccess2docPdf"
                  :format="['pdf']"
                  :max-size="1024 * 50"
                  :on-format-error="handleFormatError2"
                  :on-exceeded-size="handleMaxSize2"
                  :before-upload="handleBeforeUpload"
                >
                  <Button icon="ios-cloud-upload-outline">上传PDF文件</Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学习课件PDF">
                <Input
                  v-model="newSection.coursewarePdf"
                  size="small"
                  readonly
                />
                <Upload
                  ref="upload_coursewarePdf"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="true"
                  :on-success="handleSuccess2coursewarePdf"
                  :format="['pdf']"
                  :max-size="1024 * 50"
                  :on-format-error="handleFormatError2"
                  :on-exceeded-size="handleMaxSize2"
                  :before-upload="handleBeforeUpload"
                >
                  <Button icon="ios-cloud-upload-outline">上传PDF文件</Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="视频">
                <Input v-model="newSection.video" size="small" readonly />
                <Upload
                  ref="upload_video"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="true"
                  :on-success="handleSuccess"
                  :format="['mp4']"
                  :max-size="1024 * 500"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <Button icon="ios-cloud-upload-outline">上传视频</Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span="12"> </Col>
          </Row>
          <FormItem label="内容" label-position="top">
            <!-- <Input v-show="false" type="textarea" v-model="newSection.content" :rows="4" /> -->
            <richinput ref="course_richinput"></richinput>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddSection = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('sectionValidate')"
          >保存</Button
        >
      </div>
    </Drawer>

    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选章节吗？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="delSubmit"
          >删除</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";
import richinput from "../component/richInput";

export default {
  components: { richinput },
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: "",
        type: "normal"
      },

      editor: null,
      courseId: 0,
      courseInfo: null,
      chapterDatas: [],
      modal_loading: false,
      deleteType: null,
      deleteObj: null,
      deleteIndex: null,
      showAddNew: false,
      showEdit: false,
      showDelete: false,
      newChapter: {
        name: "",
        title: "",
        courseId: 0,
        courseName: ""
      },
      editChapterObj: null,
      showAddSection: false,
      showEditSection: false,
      showDeleteSection: false,
      editSectionIndex: -1,
      newSection: {
        courseId: 0,
        courseName: "",
        chapterId: 0,
        chapterName: "",
        chapterTitle: "",
        content: "",
        name: "",
        title: ""
      },
      editSectionObj: null,
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],

        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        options: [{ required: true, message: "请输入选项", trigger: "blur" }],
        answer: [
          { required: true, message: "请输入正确答案", trigger: "blur" }
        ],
        mulAnswer: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择正确答案",
            trigger: "change"
          }
        ]
        // exercisesType: [{ required: true, message: "请选择题目类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    let _this = this;
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      // this.getChapters();
      this.getCourse();
    }
  },
  methods: {
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$store.dispatch("register", this.formValidate);
          switch (name) {
            case "formValidate":
              _this.addSubmit();
              break;
            case "sectionValidate":
              _this.addSectionSubmit();
              break;
            case "channelValidate":
              _this.addChannelSubmit();
              break;
            case "templateValidate":
              _this.tamplateSubmit();
              break;
            case "bigtestValidate":
              _this.bigtestrowSubmit();
              break;
            case "testValidate":
              _this.testrowSubmit();
              break;
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    delItem(type, item, index) {
      this.deleteType = type;
      this.deleteObj = item;
      this.deleteIndex = index;
      this.showDelete = true;
    },
    delSubmit() {
      let url =
        this.deleteType === "chapter" ? API.index.chapter : API.index.section;
      let ids = [this.deleteObj.id];
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: url,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showDelete = false;
            this.modal_loading = false;
            // this.getChapters();
            this.getCourse();
            // if (this.deleteType === "chapter") {
            //   this.chapterDatas.splice(this.deleteIndex, 1);
            // }
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    // chapter
    addItem() {
      this.newChapter = {
        name: "",
        title: "",
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name
      };
      this.showAddNew = true;
    },
    editChapter(item) {
      this.newChapter = item;
      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newChapter.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.chapter,
        data: this.newChapter,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddNew = false;
            // this.getTableDatas();
            if (!this.newChapter.id) {
              result.result.sectionList = [];
              this.chapterDatas.push(result.result);
            }
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    // section
    addSection(item) {
      this.editChapterObj = item;
      this.newSection = {
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        chapterId: item.id,
        chapterName: item.name,
        chapterTitle: item.title,
        content: "",
        pdf: "",
        vedio: "",
        name: "",
        title: ""
      };
      this.setEdit();
      this.showAddSection = true;
    },
    editSection(item, chapter, index) {
      this.axios({
        method: "get",
        url: API.index.section + "/" + item.id,
        showSpin: false
      }).then(result => {
        if (result.code === 20000) {
          this.editChapterObj = chapter;
          this.newSection = result.result;
          this.editSectionIndex = index;
          this.setEdit();
          this.showAddSection = true;
        }
      });
    },
    setEdit() {
      this.$refs["upload_docPdf"].clearFiles();
      this.$refs["upload_coursewarePdf"].clearFiles();
      this.$refs["upload_video"].clearFiles();
      // clearFiles
      this.$refs["course_richinput"].setTxt(this.newSection.content);
    },
    addSectionSubmit() {
      this.newSection.content = this.$refs["course_richinput"].getTxt();
console.log("this.newSection.content")
console.log(this.newSection.content)
return;


      let method = "post";
      if (this.newSection.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.section,
        data: this.newSection,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddSection = false;
            // this.getTableDatas();
            if (!this.newSection.id) {
              this.editChapterObj.sectionList.push(result.result);
            } else {
              // this.editChapterObj.loadSection = false;
              // this.editChapterObj.show = false;
              this.getSections(this.editChapterObj);
            }
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    getSections(item) {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "chapterId",
              op: "eq",
              type: "int",
              value: item.id
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.section_list}`, params).then(result => {
        if (result.code === 20000) {
          item.sectionList = result.result.list;
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
            c.sectionList = [];
            // c.show = false;
            // c.loadSection = false;
            return c;
          });
        }
      });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course_getDetail + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.chapterDatas = result.result.chapterList;
            // this.newChapter.courseId = result.result.id;
            // this.newChapter.courseName = result.result.name;
            // this.newSection.courseId = result.result.id;
            // this.newSection.courseName = result.result.name;
          }
        });
    },
    handleSuccess(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.video = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccess2(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.pdf = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccess2docPdf(res, file, fileList) {
      console.log("handleSuccess2docPdf .. res", res);
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.docPdf = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccess2coursewarePdf(res, file, fileList) {
      console.log("handleSuccess2coursewarePdf .. res", res);
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.coursewarePdf = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "视频文件 " + file.name + " 格式错误, 目前仅支持mp4格式."
      });
    },
    handleFormatError2(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "PDF文件 " + file.name + " 格式错误, 目前仅支持PDF格式."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "视频文件  " + file.name + " 不能大于500M."
      });
    },
    handleMaxSize2(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "PDF文件  " + file.name + " 不能大于50M."
      });
    },
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    }
  }
};
</script>
<style></style>

<style lang="less" scoped>
.manage-content-right-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
}
// .manage-content-right-content {
//   margin-top: 10px;
// }
// .manage-collapse-p {
//   line-height: 30px;
//   border-bottom: 2px #ccc dotted;
// }
.chapter-toolbar {
  position: relative;
}
.course-chapter-item {
  margin-top: 10px;
}
.course-chapter-item-icon {
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid #fff;
  padding: 2px;
  width: 18px;
  height: 18px;
  text-align: center;
  background: #58b736;
  color: #fff;
  border-radius: 3px;
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

.course-chapter-action-icon {
  border: 1px solid #fff;
  padding: 2px;
  width: 18px;
  height: 18px;
  text-align: center;
  background: #58b736;
  color: #fff;
  border-radius: 3px;
}
.test-content-img {
  min-width: 400;
  // min-height: 150;
  width: 100%;
  height: 100%;
}
</style>
