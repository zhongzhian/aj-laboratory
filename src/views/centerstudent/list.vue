<template>
  <div>
    <!-- <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">查询</Button>
    </div>-->
    <div v-if="!isGuest" class="center-course-list" style="top: 25px;">
      <div
        :key="item"
        v-for="(item,index) in courseDatas"
        class="center-course-item"
        :class="item.id === activeItemid?'center-course-item-active':''"
        @click="itemClick(item)"
      >
        <div v-if="item.id === activeItemid" class="center-course-item-mask">
          <div class="center-course-item-toolbar">
            <Icon
              @click="editItem(item)"
              style="margin-right:5px; cursor:pointer;float:left;"
              color="#fff"
              size="20"
              type="edit"
            ></Icon>
            <Icon
              @click="gotoSetting"
              style="margin-right:5px; cursor:pointer;float:left;"
              color="#fff"
              size="20"
              type="android-settings"
            ></Icon>
          </div>
        </div>
        <div class="center-course-item-header">
          <img class="center-course-item-header-img" :src="item.courseMainImg" />
        </div>
        <div class="center-course-item-content">
          <div class="center-course-item-content-title">{{item.courseName}}</div>
          <!-- <div class="center-course-item-content-process">进度 {{item.studiedStr}}</div> -->
          <div
            v-if="item.chapterTitle"
            :style="textEllipsis"
            class="center-course-item-content-process text-ellipsis"
          >{{item.chapterName+'-'+item.chapterTitle}}</div>
          <div
            v-if="item.sectionTitle"
            :style="textEllipsis"
            class="center-course-item-content-process text-ellipsis"
          >{{item.sectionName+'-'+item.sectionTitle}}</div>
          <div class="center-course-item-content-desc">
            <span style="float:left;">得分 {{item.score}}</span>
            <span style="float:right;">进度 {{item.studiedStr}}</span>
            <!-- <Icon
              style="float:right;margin-right:2px;line-height:35px;"
              color="#ccc"
              size="16"
              type="ios-heart"
            ></Icon>-->
          </div>
        </div>
      </div>
    </div>

    <div v-if="isGuest" class="center-course-list" style="top: 25px;">
      <div
        :key="item"
        v-for="(item,index) in courseDatas"
        class="center-course-item"
        @click="itemClick(item)"
      >
        <div class="center-course-item-header">
          <img class="center-course-item-header-img" :src="item.mainImg" />
        </div>
        <div class="center-course-item-content">
          <div class="center-course-item-content-title">{{item.name}}</div>
          <div class="center-course-item-content-process">{{item.teacherName}}</div>
          <div class="center-course-item-content-desc">
            <span style="float:left;">{{item.statusStr}}</span>
            <span style="float:right;">{{item.studentNumber}}</span>
            <Icon
              style="float:right;margin-right:2px;line-height:35px;"
              color="#ccc"
              size="16"
              type="ios-heart"
            ></Icon>
          </div>
        </div>
      </div>
    </div>
    <Drawer
      title="课程"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <FormItem label="名称" prop="name" label-position="top">
            <Input v-model="newObj.name" size="small" placeholder="请输入标题" />
          </FormItem>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="logo图" prop="logo" label-position="top">
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="newObj.logo" :src="newObj.logo" class="form-course-logoimg" />
                  <img
                    v-if="!newObj.logo"
                    src="static/images/noperson.png"
                    class="form-course-logoimg"
                  />
                </Upload>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="主图" prop="mainImg" label-position="top">
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccess2"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="newObj.mainImg" :src="newObj.mainImg" class="form-course-mainImg" />
                  <img
                    v-if="!newObj.mainImg"
                    src="static/images/noperson.png"
                    class="form-course-mainImg"
                  />
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="简介" prop="introduction" label-position="top">
            <Input type="textarea" v-model="newObj.introduction" :rows="4" placeholder="请输入简介" />
          </FormItem>
          <FormItem label="描述" prop="description" label-position="top">
            <Input type="textarea" v-model="newObj.description" :rows="4" placeholder="请输入描述" />
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </div>
    </Drawer>
    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选课程吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>

    <Modal title="View Image" v-model="visible" width="732">
      <div style="text-align:center;width:700px;">
        <img :src="imgName" v-if="visible" style="max-width: 700px;max-height:500px;" />
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      isGuest: false,
      textEllipsis: "-webkit-box-orient: vertical;",
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },
      imgName: "",
      visible: false,

      userInfo: null,
      searchText: "",
      modal_loading: false,
      courseDatas: [],
      selection: [],
      showAddNew: false,
      showEdit: false,
      showDelete: false,
      activeItemid: -1,
      newObj: {
        // "RESOURCETYPE": "联通专线",
        name: "",
        logo: "",
        description: "",
        status: 0,
        teacherId: 0,
        teacherName: ""
      },
      editObj: null,
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        // dataType: [
        //   { required: true, message: "请选择数据类型", trigger: "change" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    this.userInfo = this.$store.getters.user;
    if (this.userInfo.userType === "0") {
      this.isGuest = true;
      this.getCourseDatas();
    } else {
      this.isGuest = false;
      this.getTableDatas();
    }
  },
  methods: {
    gotoSetting() {
      this.$router.push({
        name: "manage-index",
        query: {
          id: this.activeItemid
        }
      });
    },
    itemClick(item) {
      // this.activeItemid = item.id;
      // this.gotoSetting();
      if (this.isGuest) {
        this.$router.push({
          name: "manage-index",
          query: {
            id: item.id
          }
        });
      } else {
        this.$router.push({
          name: "manage-index",
          query: {
            id: item.courseId
          }
        });
      }
    },
    getTableDatas() {
      let params = {};
      this.axios.post(`${API.index.course_getmy}`, params).then(result => {
        if (result.code === 20000) {
          this.courseDatas = result.result.list.map(c => {
            return { ...c, studiedStr: parseInt(c.studied * 100) + "%" };
          });
        }
      });
    },
    getCourseDatas() {
      let params = {
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
      this.axios.post(`${API.index.course_list}`, params).then(result => {
        if (result.code === 20000) {
          this.courseDatas = result.result.list;
        }
      });
    },
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$store.dispatch("register", this.formValidate);
          switch (name) {
            case "formValidate":
              _this.addSubmit();
              break;
            case "editValidate":
              _this.editItem();
              break;
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showAddNew = false;
    },
    delItem(item) {
      this.selection = [item.id];
      // if (this.selection.length < 1) {
      //   this.$Message.error("请先选择要删除的srs服务");
      //   return;
      // }
      this.showDelete = true;
    },
    delSubmit() {
      let ids = [];
      ids = this.selection.map(s => s.id);
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: API.index.course,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showDelete = false;
            this.modal_loading = false;
            this.getTableDatas();
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    addItem() {
      this.newObj = {
        name: "",
        logo: "",
        description: "",
        status: 0,
        teacherId: this.userInfo.id,
        teacherName: this.userInfo.personName || this.userInfo.userName
      };
      this.showAddNew = true;
    },
    editItem(item) {
      this.newObj = item;
      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newObj.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.course,
        data: this.newObj,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddNew = false;
            this.getTableDatas();
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleSuccess(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code = 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.logo = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      }
    },
    handleSuccess2(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code = 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.mainImg = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.form-course-logoimg {
  // width: 300px;
  // height: 361px;
  height: 100px;
}
.form-course-mainImg {
  // width: 266px;
  // height: 151px;
  height: 100px;
}
.center-course-list {
  padding: 10px 0px 0px 10px;
  position: absolute;
  top: 70px;
  left: 25px;
  right: 25px;
  bottom: 10px;
  background: #f1f2f3;
  overflow: auto;
}
.center-course-item {
  float: left;
  margin: 0 10px 10px 0;
  width: 200px;
  background: #fff;
  cursor: pointer;
  position: relative;
  border: 1px solid #fff;
}
.center-course-item-active {
  border: 1px solid green;
}
.center-course-item-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  background: #fff;
  cursor: default;
}
.center-course-item-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  // opacity: 0.5;
  background: #000;
  padding: 5px 10px;
}
.center-course-item-header {
  // height: 100px;
  text-align: center;
  height: 120px;
}
.center-course-item-content {
  height: 80px;
  text-align: left;
  padding: 0 10px;
}
.center-course-item-header-img {
  width: 100%;
  height: 100%;
}
.center-course-item-content-title {
  font-size: 14px;
  font-weight: 500;
}
.center-course-item-content-process {
  color: #70ac1f;
}
.center-course-item-content-desc {
  color: #999;
  line-height: 35px;
}
</style>
