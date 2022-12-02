<template>
  <div style="overflow:auto;height:100%;width:100%;">
    <div class="layout-row">
      <div class="layout-content2">
        <div style="width:80%;">
          <div class="notice-content-left-box">
            <p>亲爱的 {{ userInfo.personName || userInfo.userName }}</p>
            <p>欢迎您加入课程，赶快开启学习之旅吧～</p>
            <template v-if="courseInfop.isOuter">
              <Button @click="gotoOutPage" class="notice-content-left-box-btn" type="warning">打开课程</Button>
            </template>
            <template v-if="!courseInfop.isOuter">
              <Button v-if="isGuest" @click="gotoPage" class="notice-content-left-box-btn" type="warning">进入课程</Button>
              <Button v-else @click="gotoPage" class="notice-content-left-box-btn"
                type="warning">开始学习</Button></template>
          </div>
        </div>
        <div>
          <Form ref="formValidate" :model="courseScore" :rules="ruleValidate" :label-width="200">
            <div class="layout-content-title">学生评分设置</div>
            <FormItem label="状态" prop="preStudyScore" label-position="top">
              <!-- 学生评分开关 0-关 1-开 -->
              <div>{{courseInfop.studentGradeSwitch?'已开启':'已关闭'}}</div>
            </FormItem>
            <FormItem>
              <div>
                <Button v-if="courseInfop.studentGradeSwitch" @click="configStudentGrade(0)" size="small"
                  class="condition-btn" style="margin-left:10px;">关闭</Button>
                <Button v-else @click="configStudentGrade(1)" size="small" class="condition-btn"
                  style="margin-left:10px;">开启</Button>
              </div>
            </FormItem>
            <div class="layout-content-title">占分设置</div>
            <FormItem label="课程预习占分" prop="preStudyScore" label-position="top">
              <InputNumber :max="100" :min="0" v-model="courseScore.preStudyScore" :disabled="courseInfop.status === 1"
                placeholder="请输入课程预习占分"></InputNumber>
            </FormItem>
            <FormItem label="实验报告占分" prop="reportScore" label-position="top">
              <InputNumber :max="100" :min="0" v-model="courseScore.reportScore" :disabled="courseInfop.status === 1"
                placeholder="请输入实验报告占分"></InputNumber>
            </FormItem>
            <FormItem>
              <div v-if="courseInfop.status === 0">
                <Button @click="configScore(0)" size="small" class="condition-btn"
                  style="margin-left:10px;">设置占分</Button>
                <Button @click="configScore(1)" size="small" class="condition-btn"
                  style="margin-left:10px;">立刻发布</Button>
              </div>
              <div v-if="courseInfop.status === 1">
                <Button v-if="!courseInfop.experimentStarted" @click="startExperiment" size="small"
                  class="condition-btn" style="margin-left:10px;">开始实验</Button>
                <Button @click="changeStatus(2)" size="small" class="condition-btn"
                  style="margin-left:10px;">结束</Button>
              </div>
              <div v-if="courseInfop.status === 2">
                <Button @click="configScore(0)" size="small" class="condition-btn"
                  style="margin-left:10px;">设置占分</Button>
                <Button @click="configScore(1)" size="small" class="condition-btn"
                  style="margin-left:10px;">再次发布</Button>
              </div>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form ref="formValidate" :model="courseInfop" :rules="ruleValidate" :label-width="200">
            <div class="layout-content-title">基本信息</div>
            <FormItem label="名称" prop="name" label-position="top">
              <Input v-model="courseInfop.name" size="small" placeholder="请输入名称" />
            </FormItem>
            <!-- <FormItem label="老师" prop="teacherId" label-position="top">
              <Select
                @on-change="teacherChange"
                v-model="courseInfop.teacherId"
                placeholder="请选择老师"
              >
                <Option
                  v-for="item in teacherDatas"
                  :value="item.value"
                  :key="item"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem> -->
            <FormItem label="实验时长限制（小时）" prop="timeLimit" label-position="top">
              <Input type="number" v-model="courseInfop.timeLimit" size="small" placeholder="请输入实验时长限制" />
              <!-- <InputNumber v-model="courseInfop.timeLimit" :min="1" :step="1" size="small"></InputNumber> -->
              <!-- <InputNumber :max="10" :min="1" :step="1.2" v-model="value2"></InputNumber> -->
            </FormItem>
            <FormItem v-if="courseInfop.isOuter" label="外部课程连接" prop="outerUrl" label-position="top">
              <Input v-model="courseInfop.outerUrl" size="small" placeholder="请输入外部课程连接" />
            </FormItem>
            <FormItem label="logo图" prop="logo" label-position="top">
              <div>
                支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议300*360
              </div>
              <Upload ref="upload" :action="uploadAction" :headers="headers" :data="uploadData"
                :show-upload-list="false" :on-success="handleSuccess" :format="['jpg', 'jpeg', 'png']" :max-size="2048"
                :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload">
                <img v-if="courseInfop.logo" :src="courseInfop.logo" class="form-course-logoimg" />
                <img v-if="!courseInfop.logo" src="http://temp.im/300x360" class="form-course-logoimg" />
              </Upload>
            </FormItem>
            <FormItem label="主图" prop="mainImg" label-position="top">
              <div>
                支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议266*151
              </div>
              <Upload ref="upload" :action="uploadAction" :headers="headers" :data="uploadData"
                :show-upload-list="false" :on-success="handleSuccess2" :format="['jpg', 'jpeg', 'png']" :max-size="2048"
                :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload">
                <img v-if="courseInfop.mainImg" :src="courseInfop.mainImg" class="form-course-mainImg" />
                <img v-else src="http://temp.im/266x151" class="form-course-mainImg" />
              </Upload>
            </FormItem>
            <FormItem label="介绍视频" prop="videoDesc" label-position="top">
              <div>
                支持mp4格式，文件大小不超过500M
              </div>
              <Input v-model="courseInfop.videoDesc" size="small" readonly />
              <Upload ref="upload" :action="uploadAction" :headers="headers" :data="uploadData" :show-upload-list="true"
                :on-success="handleSuccess_video" :format="['mp4']" :max-size="1024 * 500"
                :on-format-error="handleFormatError_video" :on-exceeded-size="handleMaxSize_video"
                :before-upload="handleBeforeUpload">
                <Button icon="ios-cloud-upload-outline">上传视频</Button>
              </Upload>
            </FormItem>
            <FormItem label="评分标准" prop="standard" label-position="top">
              <!-- <Input
                type="textarea"
                v-model="courseInfop.standard"
                :rows="4"
                placeholder="请输入评分标准"
              /> -->
              <richinput ref="standard_richinput"></richinput>
            </FormItem>
            <FormItem label="简介" prop="introduction" label-position="top">
              <Input type="textarea" maxlength="200" v-model="courseInfop.introduction" :rows="4"
                placeholder="请输入不超过200字的简介" />
            </FormItem>
            <FormItem label="课程详情" prop="description" label-position="top">
              <!-- <div id="editor" style="margin-top: 35px;"></div> -->
              <richinput ref="description_richinput" :richstyle="richstyle"></richinput>
            </FormItem>
            <FormItem label="操作说明" prop="operateDesc" label-position="top">
              <!-- <div id="editor" style="margin-top: 35px;"></div> -->
              <richinput ref="operateDesc_richinput" :richstyle="richstyle"></richinput>
            </FormItem>

            <!-- <div class="layout-content-title">修改密码</div>
            <FormItem label="旧密码" prop="oldpassword" label-position="top">
              <Input
                v-model="userInfop.oldpassword"
                type="password"
                size="small"
                style="width:400px;"
              />
            </FormItem> -->
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "@/api";
  import dateformat from "@/utils/dateformat.js";
  import jsSHA from "jssha";
  import qs from "qs";
  import richinput from "../component/richInput";

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
        richstyle: "width:915px;",
        picBasePath: API.picPath,
        uploadAction: API.uploadPath + API.index.upload_upload,
        headers: null,
        uploadData: {
          file: null,
          name: "",
          type: "normal"
        },
        showPhotos: false,
        editor: null,

        userInfop: {
          oldpassword: "",
          newpassword1: "",
          newpassword2: ""
        },
        userInfo: {},
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
        },
        courseId: 0,
        courseInfo: null,
        courseScore: {
          courseId: 0,
          preStudyScore: 0,
          reportScore: 0
        },
        courseInfop: {
          standard: "",
          name: "",
          logo: "",
          description: "",
          operateDesc: "",
          status: 0,
          teacherId: 0,
          teacherName: "",
          videoDesc: "",
          logo: "",
          mainImg: "",
          timeLimit: 10,
          experimentStarted: false,
          isOuter: false
        }
      };
    },
    mounted() {
      this.headers = {
        Authorization: "Bearer " + this.$store.getters.token
      };
      this.userInfo = this.$store.getters.user;
      console.log("this.userInfo", this.userInfo);
      // this.initEidtor();
      let courseId = this.$route.query.id;
      let _this = this;
      if (courseId) {
        this.courseId = courseId;
        this.courseScore.courseId = this.courseId;
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
              case "editValidate":
                _this.editItem();
                break;
            }
          } else {
            this.$Message.error("请输入所有必填项");
          }
        });
      },
      addSubmit() {
        let description_richinput = this.$refs["description_richinput"];
        let standard_richinput = this.$refs["standard_richinput"];
        let operateDesc_richinput = this.$refs["operateDesc_richinput"];
        if (description_richinput) {
          this.courseInfop.description = description_richinput.getTxt();
        }
        if (standard_richinput) {
          this.courseInfop.standard = standard_richinput.getTxt();
        }
        if (operateDesc_richinput) {
          this.courseInfop.operateDesc = operateDesc_richinput.getTxt();
        }
        let method = "post";
        if (this.courseInfop.id) {
          method = "put";
        }
        this.axios({
            method: method,
            url: API.index.course,
            data: this.courseInfop,
            showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.$Message.error("保存成功");
            }
          })
          .catch(err => {
            this.$Message.error("保存失败");
          });
      },
      startExperiment() {
        this.axios({
            method: "post",
            url: API.index.startExperiment + this.courseId,
            showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.getCourse();
            }
          })
          .catch(err => {
            this.$Message.error("操作失败");
          });
      },
      configStudentGrade(isstart) {
        let url = API.index.course_setStudentGrade + this.courseId + "/" + isstart;
        this.axios({
            method: 'POST',
            url: url,
            // data: this.courseInfop,
            // showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.$Message.error("设置成功");
              this.getCourse();
            }
          })
          .catch(err => {
            this.$Message.error("设置失败");
          });
      },
      configScore(isstart) {
        if (
          this.courseScore.preStudyScore + this.courseScore.reportScore ===
          100
        ) {
          this.axios({
              method: "post",
              url: API.index.course_setscore,
              data: this.courseScore,
              showSpin: false
            })
            .then(result => {
              if (result.code === 20000) {
                this.$Message.success("设置成功");
                if (isstart) {
                  this.changeStatus(1);
                }
              }
            })
            .catch(err => {
              this.$Message.error("设置失败");
            });
        } else {
          this.$Message.error("课程预习与实验报告总分必须等于 100");
        }
      },
      changeStatus(status) {
        this.axios({
            method: "put",
            url: API.index.updateStatus + this.courseId + "/" + status,
            showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.getCourse();
            }
          })
          .catch(err => {
            this.$Message.error("操作失败");
          });
      },
      getCourse() {
        this.axios
          .get(`${API.index.course + "/"}` + this.courseId)
          .then(result => {
            if (result.code === 20000) {
              this.courseInfop = result.result;
              this.courseScore.preStudyScore = this.courseInfop.preStudyScore;
              this.courseScore.reportScore = this.courseInfop.reportScore;
              let description_richinput = this.$refs["description_richinput"];
              let standard_richinput = this.$refs["standard_richinput"];
              let operateDesc_richinput = this.$refs["operateDesc_richinput"];
              if (description_richinput) {
                description_richinput.setTxt(this.courseInfop.description);
              }
              if (operateDesc_richinput) {
                operateDesc_richinput.setTxt(this.courseInfop.operateDesc);
              }
              if (standard_richinput) {
                standard_richinput.setTxt(this.courseInfop.standard);
              }
            }
          });
      },
      handleSuccess(res, file, fileList) {
        //{"code":50401,"message":"用户没有登陆或Token已过期"}
        if (res.code === 20000) {
          let splits = res.result.uploadFileName.split("|");
          let path = splits[1] ? splits[1] : splits[0];
          file.url = this.picBasePath + path;
          this.courseInfop.logo = file.url;
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
          this.courseInfop.mainImg = file.url;
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
      handleSuccess_video(res, file, fileList) {
        if (res.code === 20000) {
          let splits = res.result.uploadFileName.split("|");
          let path = splits[1] ? splits[1] : splits[0];
          file.url = this.picBasePath + path;
          this.courseInfop.videoDesc = file.url;
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
        this.editor.txt.html(this.courseInfop.description);
      },
      initEidtor() {
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
          name: "aaa.jpg",
          type: "normal"
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
      gotoOutPage() {
        window.open(this.courseInfop.outerUrl, "_block");
      },
      gotoPage() {
        this.$router.push({
          name: "manage-index-chapter",
          query: {
            id: this.courseId
          }
        });
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .notice-content-left {
    position: absolute;
    top: 10px;
    left: 20px;
    bottom: 20px;
    right: 250px;
  }

  .notice-content-right {
    position: absolute;
    top: 10px;
    bottom: 20px;
    right: 30px;
    width: 200px;
  }

  .notice-content-left-box {
    background-color: #f1f2f3;
    padding: 5px;
    position: relative;
    margin-bottom: 20px;
  }

  .notice-content-left-box-btn {
    width: 200px;
    position: absolute;
    right: 20px;
    top: 7px;
  }

  .notice-content-left-title {
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    line-height: 30px;
  }

  .notice-content-left-div {
    padding: 20px 0;
    font-size: 10px;
  }

  .notice-content-left-time {
    color: #ccc;
    text-align: right;
    font-size: 8px;
    border-bottom: 1px solid #ccc;
  }

  .notice-content-right-box {
    background-color: #f7f8f9;
    border: 1px solid #ccc;
    padding: 5px;
  }

  .demo-upload-div {
    position: relative;
    padding: 10px 0 0 10px;
    max-height: 300px;
    overflow-y: auto;
  }

  .demo-upload-list2 {
    float: left;
    height: 130px;
    margin: 0 10px 10px 0;
    text-align: center;
    border: 1px solid transparent;
  }

  .demo-upload-list2 img {
    // width: 100%;
    height: 100px;
  }

  .demo-upload-list-checkdiv {
    text-align: center;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .alarmDetail-modal {
    .btns {
      margin-bottom: 20px;
      line-height: 50px;
      text-align: center;

      .ivu-btn.ivu-btn-primary {
        border-radius: 1px;
        height: 28px;
        line-height: 28px;
        padding: 0 15px;
        margin-left: 30px;
      }
    }

    .description {
      padding: 15px 25px;

      textarea {
        height: 120px;
        background-color: #161941;
      }
    }

    .ivu-input {
      border: 1px solid rgba(143, 205, 240, 0.25);
      height: 28px;
      background-color: #161941;
      color: #50b5ec;
      border-radius: 1px;
    }

    .table-title {
      height: 50px;
      text-align: left;
      padding-left: 25px;
      border-top: solid 1px rgba(143, 205, 240, 0.25);
      border-bottom: solid 1px rgba(143, 205, 240, 0.25);
      background-color: #1a2440;
      line-height: 50px;
    }

    .table-content {
      background-color: #1a2440;
      margin-bottom: 20px;
      border-bottom: solid 1px rgba(143, 205, 240, 0.25);

      .ivu-row {
        text-align: left;
        line-height: 40px;

        label {
          display: inline-block;
          width: 150px;
          text-align: right;
        }
      }

      .device {
        text-align: center;

        label {
          width: auto;
          padding-left: 8px;
        }

        .ivu-col {
          padding: 10px 0;
        }
      }

      .ivu-row>.ivu-col>span,
      .ivu-row.device>.ivu-col>p>span {
        display: inline-block;
        width: 150px;
        text-align: left;
        color: #50b5ec;
      }

      .ivu-row.device>.ivu-col>p {
        display: inline-block;
        background-color: #161941;
      }

      .ivu-row.device>.ivu-col>p>span:nth-of-type(1) {
        width: auto;
        min-width: 40px;
      }

      .ivu-row.device>.ivu-col>p>span:nth-of-type(2) {
        width: 100px;
        padding-right: 8px;
      }

      .ivu-row.desc {
        label {
          float: left;
        }

        span {
          width: 50%;
          line-height: 20px;
          padding-top: 10px;
        }
      }
    }

    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    z-index: 98;
    padding: 20px 15%;

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.6;
      z-index: 99;
    }

    .normal-panel-content {
      background-color: rgba(33, 41, 72);
      height: 100%;
      z-index: 100;
      overflow: auto;
    }

    .normal-panel-title {
      height: 50px;
      line-height: 50px;
      padding: 0 15px;

      .ivu-icon {
        float: right;
        font-size: 20px;
        color: red;
        margin-top: 15px;
        cursor: pointer;
      }
    }
  }
</style>
