<template>
  <div>
    <div class="table-condition-btnbar">
      <Button v-if="!deleteChoose" @click="addItem" size="small" class="condition-btn">创建新课程</Button>
      <!--
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>-->
      <template v-if="editObj && !deleteChoose">
        <Button v-if="editObj.status === 0" @click="changeStatus(1)" size="small" class="condition-btn"
          style="margin-left:10px;">发布</Button>
        <Button v-if="editObj.status === 1" @click="changeStatus(2)" size="small" class="condition-btn"
          style="margin-left:10px;">结束</Button>
      </template>
      <template v-if="isAdmin">
        <Button v-if="!deleteChoose" @click="selectDelete" size="small" class="condition-btn"
          style="margin-left:10px;">课程删除选择</Button>
        <Button v-if="deleteChoose" @click="deleteChoose = false" size="small" class="condition-btn"
          style="margin-left:10px;">返回编辑</Button>
        <!-- <Checkbox style="margin-left:10px;" v-model="includeDeleted"
          >显示已删除</Checkbox
        > -->
      </template>
    </div>
    <div class="center-course-list">
      <div :key="item" v-for="(item, index) in courseDatas" class="center-course-item"
        :class="item.id === activeItemid ? 'center-course-item-active' : ''" @click="itemClick(item)"
        @dblclick="gotoSetting(item)">
        <!-- @dblclick="gotoSetting(item)" -->
        <!-- <div v-if="item.id === activeItemid" class="center-course-item-mask">
          <div class="center-course-item-toolbar">
            <Icon
              @click="editItem(item)"
              style="margin-right:5px; cursor:pointer;float:left;"
              color="#fff"
              size="20"
              type="ios-trash"
            ></Icon>
            <Icon
              @click="gotoSetting"
              style="margin-right:5px; cursor:pointer;float:left;"
              color="#fff"
              size="20"
              type="android-settings"
            ></Icon>
          </div>
        </div> -->
        <div v-if="deleteChoose" class="center-course-item-mask">
          <div class="center-course-item-toolbar" style="height:auto;bottom:0;text-align:center;line-height:200px;">
            <Icon @click.stop="delItem(item)" style="margin-right:5px; cursor:pointer;" color="#fff" size="80"
              type="ios-trash"></Icon>
            <!-- <Icon
              @click="gotoSetting"
              style="margin-right:5px; cursor:pointer;float:left;"
              color="#fff"
              size="20"
              type="android-settings"
            ></Icon> -->
          </div>
        </div>
        <div class="center-course-item-header">
          <img class="center-course-item-header-img" :src="item.mainImg" />
        </div>
        <div class="center-course-item-content">
          <div class="center-course-item-content-title">{{ item.name }}</div>
          <div class="center-course-item-content-process">
            {{ item.teacherName }}
          </div>
          <div class="center-course-item-content-desc">
            <span style="float:left;">{{ item.statusStr }}</span>
            <span style="float:right;">{{ item.studentNumber }}</span>
            <Icon style="float:right;margin-right:2px;line-height:35px;" color="#ccc" size="16" type="ios-heart"></Icon>
          </div>
        </div>
      </div>
    </div>
    <Drawer title="课程" v-model="showAddNew" width="720" :mask-closable="false" class-name="demo-drawer-style">
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
                <Option v-for="item in teacherDatas" :value="item.value" :key="item">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
            <FormItem label="是否外部课程" prop="isOuter" label-position="top">
              <Checkbox v-model="newObj.isOuter">外部课程</Checkbox>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem v-if="newObj.isOuter" label="外部课程连接" prop="outerUrl" label-position="top">
              <Input v-model="newObj.outerUrl" size="small" placeholder="请输入外部课程连接" />
            </FormItem>
            </Col>
          </Row>
          <FormItem label="实验时长限制（小时）" prop="timeLimit" label-position="top">
            <Input type="number" v-model="newObj.timeLimit" size="small" placeholder="请输入实验时长限制" />
            <!-- <InputNumber v-model="newObj.timeLimit" :min="1" :step="1" size="small"></InputNumber> -->
            <!-- <InputNumber :max="10" :min="1" :step="1.2" v-model="value2"></InputNumber> -->
          </FormItem>
          <FormItem label="logo图" prop="logo" label-position="top">
            <div style="margin-top: 35px;">
              支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议300*360
            </div>

            <!-- style="width:300px;height:360px;" -->
            <Upload type="drag" ref="upload" :action="uploadAction" :headers="headers" :data="uploadData"
              :show-upload-list="false" :on-success="handleSuccess" :format="['jpg', 'jpeg', 'png']" :max-size="2048"
              :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload">
              <img v-if="newObj.logo" :src="newObj.logo" class="form-course-logoimg" />
              <div v-else style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或者拖拽文件到此处上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="主图" prop="mainImg" label-position="top">
            <div style="margin-top: 35px;">
              支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议266*151
            </div>
            <!-- style="width:266px;height:151px;" -->
            <Upload type="drag" ref="upload" :action="uploadAction" :headers="headers" :data="uploadData"
              :show-upload-list="false" :on-success="handleSuccess2" :format="['jpg', 'jpeg', 'png']" :max-size="2048"
              :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload">
              <img v-if="newObj.mainImg" :src="newObj.mainImg" class="form-course-mainImg" />
              <div v-else style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或者拖拽文件到此处上传</p>
              </div>
              <!-- <img
                v-else
                src="http://temp.im/266x151"
                class="form-course-mainImg"
              /> -->
            </Upload>
          </FormItem>
          <FormItem label="介绍视频" prop="videoDesc" label-position="top">
            <div style="margin-top: 35px;">支持mp4格式，文件大小不超过1G</div>
            <Input v-model="newObj.videoDesc" size="small" readonly />
            <Upload ref="upload" :action="uploadAction" :headers="headers" :data="uploadData" :show-upload-list="true"
              :on-success="handleSuccess_video" :format="['mp4']" :max-size="1024 * 1024"
              :on-format-error="handleFormatError_video" :on-exceeded-size="handleMaxSize_video"
              :before-upload="handleBeforeUpload">
              <Button icon="ios-cloud-upload-outline">上传视频</Button>
            </Upload>
          </FormItem>
          <FormItem label="评分标准" prop="standard" label-position="top">
            <!-- <Input
              type="textarea"
              v-model="newObj.standard"
              :rows="4"
              placeholder="请输入评分标准"
            /> -->
            <!-- <div id="standardeditor" style="margin-top: 35px;"></div> -->
            <richinput ref="standard_richinput"></richinput>
          </FormItem>
          <FormItem label="简介" prop="introduction" label-position="top">
            <Input type="textarea" maxlength="200" v-model="newObj.introduction" :rows="4"
              placeholder="请输入不超过200字的简介" />
          </FormItem>
          <FormItem label="描述" prop="description" label-position="top">
            <!-- <Input type="textarea" v-model="newObj.description" :rows="4" placeholder="请输入描述" /> -->
            <!-- <div id="editor" style="margin-top: 35px;"></div> -->
            <richinput ref="description_richinput"></richinput>
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
  import richinput from "../course/component/richInput";

  export default {
    components: {
      richinput
    },
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
        editor: {},
        picPath: API.uploadPath,

        picBasePath: API.picPath,
        uploadAction: API.uploadPath + API.index.upload_upload,
        headers: null,
        uploadData: {
          file: null,
          name: "",
          type: "normal"
        },
        imgName: "",
        visible: false,

        statusArr: [{
            value: 0,
            label: "即将开始"
          },
          {
            value: 1,
            label: "进行中"
          },
          {
            value: 2,
            label: "已结束"
          }
        ],
        userInfo: null,
        isAdmin: false,
        searchText: "",
        includeDeleted: false,
        deleteChoose: false,
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
          timeLimit: 10,
          isOuter: false,
          outerUrl: ""
        },
        editObj: null,
        ruleValidate: {
          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],
          logo: [{
            required: true,
            message: "请上传logo图",
            trigger: "blur"
          }],
          mainImg: [{
            required: true,
            message: "请上传主图",
            trigger: "blur"
          }],
          timeLimit: [{
            required: true,
            validator: validateSequence,
            trigger: "blur"
          }],
          outerUrl: [{
            required: true,
            message: "请输入外部课程连接",
            trigger: "blur"
          }]
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

      console.log("w11")
      var w = new ActiveXObject('Word.Application');
      var docText;
      var obj;
      console.log("w", w)
      if (w != null) {
        w.Visible = true;
        obj = w.Documents.Open("/Users/iamdoerzhan/Downloads/12345.docx");
        console.log("obj", obj)
        docText = obj.Content;
        console.log("docText", docText)
        w.Selection.TypeText("Hello");
        w.Documents.Save();
        document.write(docText); //Print on webpage
        /*The Above Code Opens existing Document
         set w.Visible=false
         */
        /*Below code will create doc file and add data to it and will close*/
        w.Documents.Add();
        w.Selection.TypeText("Writing This Message ....");
        w.Documents.Save("/Users/iamdoerzhan/Downloads/12345.docx");
        w.Quit();
        /*Don't forget
         set w.Visible=false */
      } else {
        console.log("w != null")

      }

      // this.initEditor("#editor");
      // this.initEditor("#standardeditor");
    },
    methods: {
      gotoSetting(item) {
        this.activeItemid = item.id;
        this.$router.push({
          name: "manage-course-index",
          query: {
            id: this.activeItemid
          }
        });
      },
      itemClick(item) {
        console.log("itemClick", item);

        this.activeItemid = item.id;
        this.editObj = item;
      },
      teacherChange(name) {
        let teacher = _.find(this.teacherDatas, {
          value: name
        });
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
            conditions: [{
                name: "teacherId",
                op: "eq",
                type: "int",
                value: this.userInfo.id
              },
              {
                name: "isDeleted",
                op: "eq",
                type: "boolean",
                value: false
              }
            ],
            logic: "and"
          }
        };
        if (this.isAdmin) {
          params = {
            searchParas: {
              conditions: [{
                name: "isDeleted",
                op: "eq",
                type: "boolean",
                value: false
              }],
              logic: "and"
            }
          };
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
              if (c.logo.indexOf("http") === -1) {
                c.logo = this.picPath + c.logo;
                c.mainImg = this.picPath + c.mainImg;
              }
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
      selectDelete() {
        this.deleteChoose = true;
      },
      delItem(item) {
        this.selection = [item.id];
        console.log("delItem", this.selection);
        // if (this.selection.length < 1) {
        //   this.$Message.error("请先选择要删除的srs服务");
        //   return;
        // }
        this.showDelete = true;
      },
      delSubmit() {
        let ids = [];
        ids = this.selection;
        console.log("delSubmit", ids);
        // return;
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
              this.getTableDatas();
            }
            this.modal_loading = false;
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
          timeLimit: 10,
          isOuter: false,
          outerUrl: ""
        };
        this.$refs["description_richinput"].setTxt(this.newObj.description);
        this.$refs["standard_richinput"].setTxt(this.newObj.standard);
        // if(this.isAdmin){
        //   this.newObj.teacherId = 0;
        //   this.newObj.teacherId = 0;
        // }
        this.showAddNew = true;
      },
      editItem(item) {
        this.newObj = item;
        // this.editor.txt.html(this.newObj.description);
        this.$refs["description_richinput"].setTxt(this.newObj.description);
        this.$refs["standard_richinput"].setTxt(this.newObj.standard);
        this.showAddNew = true;
      },
      addSubmit() {
        // this.newObj.description = this.editor.txt.html();
        this.newObj.description = this.$refs["description_richinput"].getTxt();
        this.newObj.standard = this.$refs["standard_richinput"].getTxt();
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
      setEdit(id, txt) {
        this.editor[id].txt.html(txt);
      }
    }
  };
</script>
<style></style>

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
