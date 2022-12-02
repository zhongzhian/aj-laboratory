<template>
  <div class="course-component-content">
    <!-- <Input style="margin-right:20px;width:400px;" v-model="value1" placeholder="请输入答案内容"></Input> -->
    <div>
      <!-- <template v-if="isPic">
        <template v-if="disabled">
          <div>作答：</div>
          <img v-if="value1" :src="value1" class="test-content-img" />
        </template>
        <template v-else>
          <div>
            支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议不小于300*150
          </div>
          <Upload
            ref="upload"
            :action="uploadAction"
            :headers="headers"
            :data="uploadData"
            :show-upload-list="false"
            :on-success="handleSuccessXA"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatErrorABCD"
            :on-exceeded-size="handleMaxSizeABCD"
            :before-upload="handleBeforeUpload"
          >
            <img v-if="value1" :src="value1" class="test-content-img" />
            <img
              v-if="!value1"
              src="http://temp.im/300x150"
              class="test-content-img"
            />
          </Upload>
        </template>
      </template>
      <richinput v-else ref="comtest_richinput"></richinput> -->

      <template v-if="disabled">
        <div>学生作答：</div>
        <div v-html="value1"></div>
      </template>
      <template v-else>
        <richinput ref="comtest_richinput"></richinput>
      </template>
    </div>
    <div v-if="!disabled">
      <Button
        :loading="loginLoading"
        size="small"
        type="primary"
        @click="valueSubmit"
        >确定</Button
      >
    </div>
    <div v-if="grade" class="course-component-grade">
      <!-- <div v-if="isPic">
        正确答案：
        <img :src="testobj.correctAnswer" class="test-content-img" />
      </div>
      <div v-else>正确答案：{{ testobj.correctAnswer }}</div> -->
      <div>
        得分：
        <template v-if="testobj.scored">
          <span>{{ testobj.scored }}</span>
          <Button
            v-if="!finish"
            :loading="loginLoading"
            size="small"
            type="primary"
            @click="testobj.scored = ''"
            >改分</Button
          >
        </template>
        <template v-else>
          <InputNumber
            :max="testobj.score"
            :min="0"
            v-model="score"
          ></InputNumber>
          <Button
            v-if="!finish"
            :loading="loginLoading"
            size="small"
            type="primary"
            @click="scoreSubmit"
            >打分</Button
          >
        </template>
      </div>
    </div>
    <template v-else>
      <div v-if="finish" class="course-component-grade">
        <!-- <div v-if="isPic">
          正确答案：
          <img :src="testobj.correctAnswer" class="test-content-img" />
        </div>
        <div v-else>正确答案：{{ testobj.correctAnswer }}</div> -->

        <div>
          得分：
          <span>{{ testobj.scored }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import API from "@/api";
import richinput from "../component/richInput";

export default {
  components: { richinput },
  props: ["testobj", "status", "grade"],
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
      loginLoading: false,
      value1: "",
      isPic: false
    };
  },
  computed: {
    disabled() {
      return this.status > 0;
    },
    finish() {
      return this.status === 2;
    },
    isRight() {
      return this.testobj.correctAnswer === this.testobj.answer;
    }
  },
  mounted() {
    console.log("this.testobj", this.testobj);
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    if (this.testobj) {
      this.isPic = this.testobj.displayType === 2;
      console.log(this.testobj.exerciseContent);
      console.log("this.testobj.displayType", this.testobj.displayType);
      console.log(this.isPic);
      if (this.testobj.answer) {
        this.value1 = this.testobj.answer;
        if (!this.isPic) {
          this.$refs["comtest_richinput"].setTxt(this.value1);
        }
      }
    }
    // this.userInfo = this.$store.getters.user;
    // let courseId = this.$route.query.id;
    // if (courseId) {
    //   this.courseId = courseId;
    //   this.getTableDatas();
    // }
  },
  methods: {
    valueSubmit() {
      if (!this.isPic) {
        this.value1 = this.$refs["comtest_richinput"].getTxt();
      }
      let params = {
        answer: this.value1,
        testExerciseInstanceId: this.testobj.id
      };
      this.loginLoading = true;
      this.axios.post(`${API.index.test_answer}`, params).then(result => {
        if (result.code === 20000) {
          this.loginLoading = false;
        }
      });
    },
    scoreSubmit() {
      let params = {
        scored: this.score,
        testExerciseInstanceId: this.testobj.id,
        type: 1
      };
      this.loginLoading = true;
      this.axios.post(`${API.index.test_grade}`, params).then(result => {
        if (result.code === 20000) {
          this.testobj = result.result;
          this.loginLoading = false;
        }
      });
    },
    handleSuccessXA(res, file, fileList) {
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.value1 = file.url;
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
    handleFormatErrorABCD(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件 " + file.name + " 格式错误, 目前仅支持jpg,jpeg,png格式."
      });
    },
    handleMaxSizeABCD(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "上传的答案图片不能大于1M."
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
.course-component-result {
  padding: 5px;
}
.testright {
  border: solid 1px #58b736;
}
.testwrong {
  border: solid 1px red;
}
</style>
