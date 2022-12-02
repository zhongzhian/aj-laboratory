<template>
  <div class="course-component-content">
    <RadioGroup v-model="value1" @on-change="change">
      <Radio :disabled="disabled" :key="item" v-for="(item,index) in options" :label="item.key">
        <span>{{item.value}}</span>
      </Radio>
    </RadioGroup>
    <!-- <div v-if="grade" class="course-component-grade">
    客观题只要一交卷，就可以看到正确答案和得分，20190923-->
    <div v-if="disabled" class="course-component-grade">
      <div>正确答案：{{correctAnswer}}</div>
      <div>
        得分：
        <span v-if="isRight">{{testobj.score}}</span>
        <span v-else>0</span>
      </div>
    </div>
    <template v-else>
      <div v-if="finish" class="course-component-grade">
        <div>正确答案：{{correctAnswer}}</div>
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
      value1: "",
      options: [{ key: "A", value: "正确" }, { key: "B", value: "错误" }]
    };
  },
  computed: {
    correctAnswer() {
      return this.testobj.correctAnswer === "A" ? "正确" : "错误";
    },
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
    change(item) {
      let params = {
        answer: this.value1,
        testExerciseInstanceId: this.testobj.id
      };
      this.axios.post(`${API.index.test_answer}`, params).then(result => {
        if (result.code === 20000) {
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
