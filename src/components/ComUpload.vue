<template>
  <div>
    {{ comdata.label || comdata.order }}:
    <Upload
      type="drag"
      ref="upload"
      :action="uploadAction"
      :headers="headers"
      :data="uploadData"
      :show-upload-list="false"
      :on-success="handleSuccessABCD"
      :format="['jpg', 'jpeg', 'png']"
      :max-size="1024"
      :on-format-error="handleFormatErrorABCD"
      :on-exceeded-size="handleMaxSizeABCD"
      :before-upload="handleBeforeUploadABCD"
    >
      <div v-if="comdata.content" style="padding: 20px 0">
        <img :src="comdata.content" class="comupload-img" />
      </div>
      <div v-else style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或者拖拽文件到此上传</p>
      </div>
    </Upload>
  </div>
</template>

<script>
import API from "@/api";
export default {
  props: ["comdata", "selectValue", "textLeft", "cswidth", "isdisabled"],
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: "",
        type: "normal"
      }
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
  },
  methods: {
    handleBeforeUploadABCD(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    },
    handleSuccessABCD(res, file, fileList, option) {
      this.$emit("comuplaodsuccess", res, file, fileList, this.comdata);
    },
    handleMaxSizeABCD(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "上传的答案图片不能大于1M."
      });
    },
    handleFormatErrorABCD(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件 " + file.name + " 格式错误, 目前仅支持jpg,jpeg,png格式."
      });
    }
  }
};
</script>
<style>
.comupload-img {
  width: 100%;
  max-width: 500px;
  cursor: pointer;
}
</style>
