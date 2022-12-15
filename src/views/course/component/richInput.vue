<template>
  <div class="course-component-richinput" :style="richstyle">
    <div>
      <Upload ref="upload" :action="uploadPdf" :headers="headers" :data="uploadPdfData" :show-upload-list="true"
        :on-success="handleSuccess" :format="['pdf']" :max-size="20480" :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
        <Button icon="ios-cloud-upload-outline">上传PDF文件</Button>
      </Upload>
      <!-- <input type="file" @change="readPdf" /> -->
    </div>
    <div :id="comeditorid"></div>
  </div>
</template>

<script>
  import API from "@/api";

  export default {
    props: ["richstyle", "status", "grade", "isquestion"],
    data() {
      return {
        uploadPdf: API.uploadPath + API.index.upload_pdf2html,
        uploadAction: API.uploadPath + API.index.upload_upload,
        picBasePath: API.picPath,
        headers: null,
        uploadData: {
          file: null,
          name: "",
          type: "normal"
        },
        loading: false,
        uploadPdfData: {
          file: null,
          name: ""
        },
        value1: "",
        comeditor: null,
        comeditorid: "comeditor_",
        timespan: 0
      };
    },
    computed: {
      disabled() {
        return false;
      }
    },
    beforeMount() {
      this.timespan = new Date().valueOf();
      this.comeditorid = "comeditor_" + this.timespan;
    },
    mounted() {
      this.headers = {
        Authorization: "Bearer " + this.$store.getters.token
      };
      this.initEditor(this.comeditorid);
    },
    methods: {
      setTxt(txt) {
        this.comeditor.txt.html(txt);
      },
      getTxt() {
        return this.comeditor.txt.html();
      },
      readPdf(e) {
        console.log("start pdf script", e);
        let _file = e.target.files[0];
        console.log("_file", _file);
        this.axios({
            method: "post",
            url: this.uploadPdf,
            data: {
              file: _file,
              name: _file.name
            }
          })
          .then(result => {
            if (result.code === 20000) {}
          })
          .catch(err => {
            this.$Message.error("上传失败");
          });
      },
      handleSuccess(res, file, fileList) {
        this.$Spin.hide();
        console.log("handleSuccess-pdf .. res", res, file, fileList);
        let html = res.result.replace('border:1px solid blue;', '');
        this.comeditor.txt.html(html);
        //{"code":50401,"message":"用户没有登陆或Token已过期"}
        // if (res.code === 20000) {
        //   let splits = res.result.uploadFileName.split("|");
        //   let path = splits[1] ? splits[1] : splits[0];
        //   file.url = this.picBasePath + path;
        //   this.courseInfop.logo = file.url;
        //   // this.picList.unshift(file);
        //   // this.picList = [...this.picList];
        //   // console.log("handleSuccess1 .. this.picList", this.picList);
        // } else if (res.code === 50401) {
        //   console.log("this.$route.name....", this.$route.name);
        //   this.$router.push({
        //     name: "login",
        //     query: {
        //       name: this.$route.name
        //     }
        //   });
        // } else {
        //   this.$Message.error(res.message);
        // }
      },
      handleBeforeUpload(file) {
        console.log("handleBeforeUpload,pdf .. file", file);
        this.uploadData.file = file;
        this.uploadData.name = file.name;
        // this.$Spin.show();
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 28
                }
              }),
              h('div', '解析中')
            ])
          }
        });
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: "文件格式错误",
          desc: "文件 " + file.name + " 格式错误, 目前仅支持pdf格式."
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "文件过大",
          desc: "文件  " + file.name + " 不能大于20M."
        });
      },
      initEditor(id) {
        let _this = this;
        let editor = new E("#" + id);

        // editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
        editor.customConfig.uploadImgServer = this.uploadAction; // 将图片上传到服务器上
        // 限制一次最多上传 5 张图片
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgHeaders = {
          Authorization: "Bearer " + this.$store.getters.token
        };

        editor.customConfig.uploadFileName = "file";
        editor.customConfig.uploadImgParams = {
          name: "file",
          type: "normal"
        };
        editor.customConfig.uploadImgHooks = {
          before: function(xhr, editor, files) {
            console.log("before", files);
            console.log("editor", editor);
            console.log("file", files[0]);
            console.log("name", files[0].name);
            // editor.config.uploadImgParams = {
            //   name: files[0].name,
            //   file: files[0]
            // };
            // editor.customConfig.uploadImgParams.name = files[0].name;
            // editor.customConfig.uploadImgParams.file = files[0];
            // this.uploadData.file = file;
            // this.uploadData.name = file.name;

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
              console.log("fileurl", fileurl);
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
        // console.log("editor.customConfig",editor.customConfig);
        // 配置粘贴文本的内容处理
        editor.customConfig.pasteTextHandle = function(pasteStr) {
          // 对粘贴的文本进行处理，然后返回处理后的结果
          console.log("pasteStr", pasteStr);
          return pasteStr + '巴拉巴拉'
        }
        editor.create();

        this.comeditor = editor;
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .course-component-richinput {
    padding: 5px;
    max-width: 700px;
    // height: 350px;
    display: inline-block;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
