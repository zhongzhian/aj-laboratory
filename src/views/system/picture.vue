<template>
  <div class="normal-fullscream">
    <div class="normal-fullscream-top" style="height:50px;">
      <div class="table-condition-btnbar">
        <Upload
          ref="upload"
          :action="uploadAction"
          :headers="headers"
          :data="uploadData"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
        >
          <Button @click="addItem" size="small" class="condition-btn">上传图片</Button>
        </Upload>
      </div>

      <!-- <div class="notice-content-left-title">上传图片</div>
      <div>
        <Upload
          ref="upload"
          :action="uploadAction"
          :headers="headers"
          :data="uploadData"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          style="width: 70%;"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或者拖拽上传</p>
          </div>
        </Upload>
      </div>-->
    </div>
    <div class="normal-fullscream-bottom" style="top:80px;">
      <!-- <div class="notice-content-left-title">图片库</div> -->
      <div class="demo-upload-div" style="top:0px;">
        <div class="demo-upload-list2" :key="item" v-for="(item,index) in picList">
          <img :src="item.url" @click="handleView(item)" />
          <Icon
            class="upload-picture-close"
            type="close-round"
            color="red"
            size="20"
            @click="delPic(item,index)"
          />
        </div>
      </div>
    </div>

    <Modal title="View Image" v-model="visible" width="732">
      <div style="text-align:center;width:700px;">
        <img :src="imgName" v-if="visible" style="max-width: 700px;max-height:500px;" />
      </div>
    </Modal>

    <Modal v-model="showDelete" width="532">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <img :src="deleteImgName" style="max-width: 500px;max-height:500px;" />
        <p>确定删除所选图片吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>

  <!-- <div style="overflow:auto;height:100%;width:100%;">
    <div class="layout-row">
      <div class="layout-content2" style="padding:30px;">
        <Form :label-width="200">
          <FormItem label="图片库">
            <div class="demo-upload-div">
              <div class="demo-upload-list2" :key="item" v-for="(item,index) in picList">
                <img :src="item.url" @click="handleView(item)" />
                <Icon
                  class="upload-picture-close"
                  type="close-round"
                  color="red"
                  size="20"
                  @click="delPic(item,index)"
                />
              </div>
            </div>
          </FormItem>
          <FormItem label="上传图片">
            <div>
              <Upload
                ref="upload"
                :action="uploadAction"
                :headers="headers"
                :data="uploadData"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                style="width: 70%;"
              >
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>点击或者拖拽上传</p>
                </div>
              </Upload>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal title="View Image" v-model="visible" width="732">
      <div style="text-align:center;width:700px;">
        <img :src="imgName" v-if="visible" style="max-width: 700px;max-height:500px;" />
      </div>
    </Modal>

    <Modal v-model="showDelete" width="532">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <img :src="deleteImgName" style="max-width: 500px;max-height:500px;" />
        <p>确定删除所选图片吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>-->
</template>

<script>
import API from "@/api";
import dateformat from "@/utils/dateformat.js";

export default {
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },
      picList: [],
      showDelete: false,
      deleteItem: null,
      deleteIndex: -1,
      modal_loading: false,
      deleteImgName: "",

      defaultList: [],
      selectedPhotoList: [],
      imgName: "",
      visible: false
    };
  },
  mounted() {
    this.getPhotoDatas();
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
  },
  methods: {
    delPic(item, index) {
      console.log("item", item);
      this.deleteItem = item;
      this.deleteIndex = index;
      this.deleteImgName = item.url;
      this.showDelete = true;
    },
    delSubmit() {
      this.modal_loading = true;
      this.axios({
        method: "delete",
        url: API.index.upload_deleteById + this.deleteItem.id,
        // data: [item.id],
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.$Message.success("删除成功");
            this.picList.splice(this.deleteIndex, 1);
            this.deleteItem = null;
            this.deleteIndex = -1;
            this.deleteImgName = "";
          }
          this.modal_loading = false;
          this.showDelete = false;
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSelectedRemove(file) {
      this.selectedPhotoList.splice(this.selectedPhotoList.indexOf(file), 1);
    },
    handleSuccess(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.picList.unshift(file);
        // this.picList = [...this.picList];
        console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
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
      console.log("file",file)
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    },
    getPhotoDatas() {
      let params = {
          sortDirection: "desc",
          sortProperties: "updateTime"
        },
        _this = this;
      this.axios.post(`${API.index.upload_mylist}`, params).then(result => {
        if (result.code === 20000) {
          this.defaultList = result.result.list.map(p => {
            let splits = p.uploadFileName.split("|");
            let path = splits[1] ? splits[1] : splits[0];
            p.url = _this.picBasePath + path;
            p.selected = false;
            return p;
          });
          _this.picList = [...this.defaultList];
          // console.log("this.defaultList", this.defaultList);
          // this.$nextTick(function() {
          //   _this.picList = _this.$refs.upload.fileList;
          // });
        }
      });
    },
    picSelect(item) {
      console.log("item", item);
      // item.selected = !item.selected;
      this.updateSelect();
    },
    updateSelect() {
      this.selectedPhotoList = _.filter(this.picList, "selected");
    },
    selectSubmit() {
      // this.homePhotoList = this.selectedPhotoList;
      // this.showPhotos = false;
    },
    handleSubmit(name) {
      let params = {};
      this.axios({
        method: "put",
        url: API.index.sysSetting,
        data: params,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.$Message.success("设置成功");
          }
        })
        .catch(err => {
          this.$Message.error("设置失败");
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.normal-fullscream-top {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 165px;
}
.normal-fullscream-bottom {
  position: absolute;
  top: 180px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}

.notice-content-left-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
  margin-bottom: 10px;
}
.upload-picture-close {
  font-size: 20px;
  color: red;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 20px;
  height: 20px;
  background: #fff;
  border: solid 1px #ccc;
  cursor: pointer;
}
.demo-upload-div {
  position: absolute;
  overflow-y: auto;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
}
.demo-upload-list2 {
  float: left;
  height: 112px;
  margin: 0 10px 10px 0;
  text-align: center;
  border: 1px solid #ccc;
  padding: 5px;
  position: relative;
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
    .ivu-row > .ivu-col > span,
    .ivu-row.device > .ivu-col > p > span {
      display: inline-block;
      width: 150px;
      text-align: left;
      color: #50b5ec;
    }
    .ivu-row.device > .ivu-col > p {
      display: inline-block;
      background-color: #161941;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(1) {
      width: auto;
      min-width: 40px;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(2) {
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
