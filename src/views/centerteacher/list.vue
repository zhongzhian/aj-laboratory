<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">创建新课程</Button>
      <!-- <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>-->
      <template v-if="editObj">
        <Button
          v-if="editObj.status === 0"
          @click="changeStatus(1)"
          size="small"
          class="condition-btn"
          style="margin-left:10px;"
        >发布</Button>
        <Button
          v-if="editObj.status === 1"
          @click="changeStatus(2)"
          size="small"
          class="condition-btn"
          style="margin-left:10px;"
        >结束</Button>
      </template>
    </div>
    <div class="center-course-list">
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
            <!-- <Icon
              @click="delItem(item)"
              style="margin-right:5px; cursor:pointer;float:right"
              color="#fff"
              size="20"
              type="android-delete"
            ></Icon>-->
          </div>
        </div>
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
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name" label-position="top">
                <Input v-model="newObj.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem v-if="isAdmin" label="老师" prop="teacherId" label-position="top">
                <Select @on-change="teacherChange" v-model="newObj.teacherId" placeholder="请选择老师">
                  <Option
                    v-for="item in teacherDatas"
                    :value="item.value"
                    :key="item"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="实验时长限制（小时）" prop="timeLimit" label-position="top">
            <Input type="number" v-model="newObj.timeLimit" size="small" placeholder="请输入实验时长限制" />
            <!-- <InputNumber v-model="newObj.timeLimit" :min="1" :step="1" size="small"></InputNumber> -->
            <!-- <InputNumber :max="10" :min="1" :step="1.2" v-model="value2"></InputNumber> -->
          </FormItem>
          <FormItem label="logo图" prop="logo" label-position="top">
            <div style="margin-top: 35px;">支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议300*360</div>
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
              <img v-if="!newObj.logo" src="http://temp.im/300x360" class="form-course-logoimg" />
            </Upload>
          </FormItem>
          <FormItem label="主图" prop="mainImg" label-position="top">
            <div style="margin-top: 35px;">支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议266*151</div>
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
              <img v-else src="http://temp.im/266x151" class="form-course-mainImg" />
            </Upload>
          </FormItem>
          <FormItem label="介绍视频" prop="videoDesc" label-position="top">
            <div style="margin-top: 35px;">支持mp4格式，文件大小不超过500M</div>
            <Input v-model="newObj.videoDesc" size="small" readonly />
            <Upload
              ref="upload"
              :action="uploadAction"
              :headers="headers"
              :data="uploadData"
              :show-upload-list="true"
              :on-success="handleSuccess_video"
              :format="['mp4']"
              :max-size="1024*500"
              :on-format-error="handleFormatError_video"
              :on-exceeded-size="handleMaxSize_video"
              :before-upload="handleBeforeUpload"
            >
              <Button icon="ios-cloud-upload-outline">上传视频</Button>
            </Upload>
          </FormItem>
          <FormItem label="评分标准" prop="standard" label-position="top">
            <Input type="textarea" v-model="newObj.standard" :rows="4" placeholder="请输入评分标准" />
          </FormItem>
          <FormItem label="简介" prop="introduction" label-position="top">
            <Input type="textarea" v-model="newObj.introduction" :rows="4" placeholder="请输入简介" />
          </FormItem>
          <FormItem label="描述" prop="description" label-position="top">
            <!-- <Input type="textarea" v-model="newObj.description" :rows="4" placeholder="请输入描述" /> -->
            <div id="editor" style="margin-top: 35px;"></div>
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
import dateformat from "@/utils/dateformat.js";
import Cookie from "js-cookie";

export default {
  data() {
    const validateSequence = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入实验总时长"));
      } else if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字"));
      } else if (parseInt(value) < 1) {
        callback(new Error("实验总时长不能小于1"));
      } else {
        callback();
      }
    };
    return {
      editor: null,

      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },
      imgName: "",
      visible: false,

      statusArr: [
        { value: 0, label: "即将开始" },
        { value: 1, label: "进行中" },
        { value: 2, label: "已结束" }
      ],
      userInfo: null,
      isAdmin: false,
      searchText: "",
      modal_loading: false,
      courseDatas: [],
      teacherDatas: [],
      selection: [],
      showAddNew: false,
      showEdit: false,
      showDelete: false,
      activeItemid: -1,
      newObj: {
        standard: "",
        name: "",
        logo: "",
        description: "",
        status: 0,
        teacherId: 0,
        teacherName: "",
        videoDesc: "",
        logo: "",
        mainImg: "",
        timeLimit: 10
      },
      editObj: null,
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        logo: [{ required: true, message: "请上传logo图", trigger: "blur" }],
        mainImg: [{ required: true, message: "请上传主图", trigger: "blur" }],
        timeLimit: [
          { required: true, validator: validateSequence, trigger: "blur" }
        ]
        // dataType: [
        //   { required: true, message: "请选择数据类型", trigger: "change" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    let _this = this;
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    this.userInfo = this.$store.getters.user;
    let isAdmin = Cookie.get("app_isAdmin");
    if (isAdmin == 1) {
      this.isAdmin = true;
      this.getTeacherDatas();
    }
    this.getTableDatas();

    let editor = new E("#editor");
    // editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    editor.customConfig.uploadImgServer = this.uploadAction; // 将图片上传到服务器上
    // 限制一次最多上传 5 张图片
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.uploadImgHeaders = {
      Authorization: "Bearer " + this.$store.getters.token
    };

    editor.customConfig.uploadFileName = "file";
    editor.customConfig.uploadImgParams = {
      name: "aaa.jpg"
    };
    editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        console.log("before", files);
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        console.log("success", result);
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function(xhr, editor, result) {
        console.log("fail", result);
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        console.log("error", xhr);
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function(xhr, editor) {
        console.log("timeout", xhr);
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        console.log("customInsert", result);
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        // var url = result.url;
        if (result.code === 20000) {
          let splits = result.result.uploadFileName.split("|");
          let path = splits[1] ? splits[1] : splits[0];
          let fileurl = _this.picBasePath + path;
          insertImg(fileurl);
        }
        // insertImg(url);

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    };

    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      // "video", // 插入视频
      // "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.create();
    this.editor = editor;
  },
  methods: {
    gotoSetting() {
      this.$router.push({
        name: "manage-course-index",
        query: {
          id: this.activeItemid
        }
      });
    },
    itemClick(item) {
      this.activeItemid = item.id;
      this.editObj = item;
    },
    teacherChange(name) {
      let teacher = _.find(this.teacherDatas, { value: name });
      this.newObj.teacherId = teacher.value;
      this.newObj.teacherName = teacher.label;
    },
    changeStatus(status) {
      this.axios({
        method: "put",
        url: API.index.updateStatus + this.activeItemid + "/" + status,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.getTableDatas();
          }
        })
        .catch(err => {
          this.$Message.error("操作失败");
        });
    },
    getTableDatas() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "teacherId",
              op: "eq",
              type: "int",
              value: this.userInfo.id
            }
          ],
          logic: "and"
        }
      };
      if (this.isAdmin) {
        params = {};
      }
      this.axios.post(`${API.index.course_list}`, params).then(result => {
        if (result.code === 20000) {
          this.courseDatas = result.result.list.map(c => {
            let statusStr = "--";
            switch (c.status) {
              case 0:
                statusStr = "即将开始";
                break;
              case 1:
                statusStr = "进行中";
                break;
              case 2:
                statusStr = "已结束";
                break;
            }
            c.statusStr = statusStr;
            return c;
          });
        }
      });
    },
    getTeacherDatas() {
      let params = {};
      this.axios.post(`${API.index.teacher_list}`, params).then(result => {
        if (result.code === 20000) {
          this.teacherDatas = result.result.list.map(c => {
            return {
              value: c.id,
              label: c.personName || c.userName
            };
          });
          // this.teacherDatas.unshift({
          //   value: this.userInfo.id,
          //   label: this.userInfo.userName
          // });
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
          this.$Message.error("请输入所有必填项");
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
        teacherName: this.userInfo.personName || this.userInfo.userName,
        videoDesc: "",
        logo: "",
        mainImg: "",
        timeLimit: 10
      };
      this.editor.txt.html(this.newObj.description);
      // if(this.isAdmin){
      //   this.newObj.teacherId = 0;
      //   this.newObj.teacherId = 0;
      // }
      this.showAddNew = true;
    },
    editItem(item) {
      this.newObj = item;
      this.editor.txt.html(this.newObj.description);
      this.showAddNew = true;
    },
    addSubmit() {
      this.newObj.description = this.editor.txt.html();
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
      //{"code":50401,"message":"用户没有登陆或Token已过期"}
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.logo = file.url;
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
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.mainImg = file.url;
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
        desc: "文件 " + file.name + " 格式错误, 目前仅支持jpg,jpeg,png格式."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件  " + file.name + " 不能大于2M."
      });
    },
    handleSuccess_video(res, file, fileList) {
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newObj.videoDesc = file.url;
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
    handleFormatError_video(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "视频文件 " + file.name + " 格式错误, 目前仅支持mp4格式."
      });
    },
    handleMaxSize_video(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "视频文件  " + file.name + " 不能大于500M."
      });
    },
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    },
    setEdit() {
      this.editor.txt.html(this.newObj.description);
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.form-course-logoimg {
  width: 300px;
  height: 360px;
  border: 1px solid #ccc;
  // height: 100px;
}
.form-course-mainImg {
  width: 266px;
  height: 151px;
  border: 1px solid #ccc;
  // height: 100px;
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
