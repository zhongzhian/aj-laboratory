<template>
  <div class="course-component-content">
    <!-- <Input style="margin-right:20px;width:400px;" v-model="value1" placeholder="请输入答案内容"></Input> -->
    <div>
      <Input
        :disabled="disabled"
        style="margin-right:20px;width:400px;margin-bottom: 10px;"
        type="textarea"
        v-model="value1"
        :rows="4"
        placeholder="请输入答案内容"
      />
    </div>
    <div v-if="!disabled">
      <Button :loading="loginLoading" size="small" type="primary" @click="valueSubmit">确定</Button>
    </div>
    <div v-if="grade" class="course-component-grade">
      <div>正确答案：{{testobj.correctAnswer}}</div>
      <div>
        得分：
        <template v-if="testobj.scored">
          <span>{{testobj.scored}}</span>
          <Button
            v-if="!finish"
            :loading="loginLoading"
            size="small"
            type="primary"
            @click="testobj.scored = ''"
          >改分</Button>
        </template>
        <template v-else>
          <InputNumber :max="testobj.score" :min="0" v-model="score"></InputNumber>
          <Button
            v-if="!finish"
            :loading="loginLoading"
            size="small"
            type="primary"
            @click="scoreSubmit"
          >打分</Button>
        </template>
      </div>
    </div>
    <template v-else>
      <div v-if="finish" class="course-component-grade">
        <div>正确答案：{{testobj.correctAnswer}}</div>
        <div>
          得分：
          <span>{{testobj.scored}}</span>
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
      value1: ""
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
        testExerciseInstanceId: this.testobj.id
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
<style>
</style>

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
