<template>
  <div class="course-component-content">
    <Input
      :disabled="disabled"
      style="margin-right:20px;width:400px;"
      v-model="value1"
      placeholder="请输入答案内容"
    ></Input>
    <Button
      v-if="!disabled"
      :loading="loginLoading"
      size="small"
      type="primary"
      @click="valueSubmit"
      >确定</Button
    >
    <!-- <Form :label-width="80">
      <FormItem label="答案">
        <Input v-model="value1" placeholder="请输入答案内容"></Input>
      </FormItem>
      <FormItem>
        <Button :loading="loginLoading" size="small" type="primary" @click="valueSubmit">确定</Button>
      </FormItem>
    </Form>-->
    <!-- <div
      v-if="grade"
      class="course-component-result"
      :class="isRight?'testright':'testwrong'"
    >
      <div v-if="isRight">
        <p>回答正确</p>
        <p>得分：{{testobj.score}}</p>
      </div>
      <div v-if="!isRight">
        <p>回答错误，正确答案：{{testobj.correctAnswer}}</p>
        <p>得分：0</p>
      </div>
    </div>-->
    <div v-if="grade" class="course-component-grade">
      <div>正确答案：{{ testobj.correctAnswer }}</div>
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
        <div>正确答案：{{ testobj.correctAnswer }}</div>
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

export default {
  props: ["testobj", "status", "grade"],
  data() {
    return {
      loginLoading: false,
      value1: "",
      score: 0,
      isScored: false
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
    if (this.testobj) {
      if (this.testobj.answer) {
        this.value1 = this.testobj.answer;
      }
      if (this.testobj.scored) {
        this.score = this.testobj.scored;
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
