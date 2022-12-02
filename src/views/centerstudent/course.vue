<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <!-- <Button @click="delItem" size="small" class="condition-btn">删除</Button> -->
    </div>
    <div class="manage-content-right-content">
      <div :key="item" v-for="(item,index) in chapterDatas" class="course-chapter-item">
        <div @click="getSections(item)" class="course-chapter-item-header">
          <Icon class="course-chapter-item-icon" @click.stop="addSection(item)" type="android-add" />
          <Icon class="course-chapter-item-icon" @click.stop="editChapter(item)" type="edit" />
          <Icon
            class="course-chapter-item-icon"
            @click.stop="delItem('chapter',item,index)"
            type="android-delete"
          />
          <!-- <Button icon="android-add" @click.stop="addSection(item)" size="small" ghost>新增节</Button>
          <Button icon="android-add" @click.stop="editChapter(item)" size="small" ghost>编辑章</Button>
          <Button
            icon="android-add"
            @click.stop="delItem('chapter',item,index)"
            size="small"
            ghost
          >删除章</Button>-->
          {{item.name+" - "+item.title}}
        </div>
        <div v-show="(item.children.length>0) && item.show" class="course-chapter-item-content">
          <p :key="section" v-for="(section,sindex) in item.children" class="manage-collapse-p">
            <Icon
              class="course-chapter-item-icon"
              @click.stop="editSection(section,item)"
              type="edit"
            />
            <Icon
              class="course-chapter-item-icon"
              @click.stop="delItem('section',section,sindex)"
              type="android-delete"
            />
            <!-- <Button icon="android-add" @click="editSection(section,item)" size="small" ghost>编辑节</Button>
            <Button
              icon="android-add"
              @click="delItem('section',section,sindex)"
              size="small"
              ghost
            >删除节</Button>-->
            {{section.name+" - "+section.title}}
          </p>
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
                <Input v-model="newChapter.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="标题" prop="title">
                <Input v-model="newChapter.title" size="small" placeholder="请输入标题" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
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
                <Input v-model="newSection.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="标题" prop="title">
                <Input v-model="newSection.title" size="small" placeholder="请输入标题" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="内容" prop="content" label-position="top">
            <Input v-show="false" type="textarea" v-model="newSection.content" :rows="4" />
            <div id="editor" style="margin-top: 35px;"></div>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddSection = false">取消</Button>
        <Button type="primary" @click="handleSubmit('sectionValidate')">保存</Button>
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
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
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
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
        // dataType: [
        //   { required: true, message: "请选择数据类型", trigger: "change" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getChapters();
      this.getCourse();
    }

    this.editor = new E("#editor");
    console.log("this.editor",this.editor);
    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    this.editor.create();
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
            this.getChapters();
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
              result.result.children = [];
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
        name: "",
        title: ""
      };
      this.setEdit();
      this.showAddSection = true;
    },
    editSection(item, chapter) {
      this.editChapterObj = chapter;
      this.newSection = item;
      this.setEdit();
      this.showAddSection = true;
    },
    setEdit() {
      this.editor.txt.html(this.newSection.content);
    },
    addSectionSubmit() {
      this.newSection.content = this.editor.txt.html();
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
              this.editChapterObj.children.push(result.result);
            }
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    getSections(item) {
      item.show = !item.show;
      if (item.show && !item.loadSection) {
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
            item.children = result.result.list;
            item.loadSection = true;
          }
        });
      }
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
            c.children = [];
            c.show = false;
            c.loadSection = false;
            return c;
          });
        }
      });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            // this.newChapter.courseId = result.result.id;
            // this.newChapter.courseName = result.result.name;
            // this.newSection.courseId = result.result.id;
            // this.newSection.courseName = result.result.name;
          }
        });
    }
  }
};
</script>
<style>
</style>

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
