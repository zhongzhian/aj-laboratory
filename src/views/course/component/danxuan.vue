<template>
  <div class="course-component-content">
    <RadioGroup v-model="value1" @on-change="change">
      <Radio
        :disabled="disabled"
        :key="item"
        v-for="(item, index) in options"
        :label="item.key"
      >
        <template v-if="isPic">
          {{ item.key }}:<img
            :src="item.value"
            class="course-component-option-img"
          />
        </template>
        <span v-else>{{ item.key }}: {{ item.value }}</span>
      </Radio>
    </RadioGroup>
    <div v-if="isquestion" style="padding:10px 0;">
      <Button
        :disabled="disabled"
        @click="submitTest"
        size="small"
        class="condition-btn"
        >确定</Button
      >
    </div>
    <!-- <div v-if="grade" class="course-component-grade">
      客观题只要一交卷，就可以看到正确答案和得分，20190923 -->
    <template v-if="!isquestion">
      <div v-if="disabled" class="course-component-grade">
        <div>正确答案：{{ correctAnswer }}</div>
        <div>
          得分：
          <span v-if="isRight">{{ testobj.score }}</span>
          <span v-else>0</span>
        </div>
      </div>
      <template v-else>
        <div v-if="finish" class="course-component-grade">
          <div>正确答案：{{ correctAnswer }}</div>
          <div>
            得分：
            <span>{{ testobj.scored }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import API from "@/api";

export default {
  props: ["testobj", "status", "grade", "isquestion"],
  data() {
    return {
      value1: "",
      options: [],
      isPic: false,
      questionAnswer: "",
      questionDisabled: false,
      correctAnswer: ""
    };
  },
  computed: {
    disabled() {
      return this.status > 0 || this.questionDisabled;
    },
    finish() {
      return this.status === 2;
    },
    isRight() {
      return this.testobj.correctAnswer === this.testobj.answer;
    }
    // isPic(){
    //   return this.testobj.options[0].A.indexOf("http://") === 0;
    // }
  },
  mounted() {
    console.log("this.testobj", this.testobj);
    if (this.testobj) {
      let optionsobj = JSON.parse(this.testobj.options);
      this.correctAnswer = this.testobj.correctAnswer;
      if (optionsobj) {
        this.options = optionsobj.map(o => {
          // o = {"displayOrder":"A","content":"2","order":"B"}
          let obj = {
            key: o.displayOrder,
            value: o.content,
            realkey: o.order
          };
          if (this.testobj.correctAnswer === o.order) {
            this.correctAnswer = o.displayOrder;
          }
          return obj;
        });
        this.isPic = optionsobj[0].content.indexOf("http://") === 0;
      } else {
        console.log(
          this.testobj.exerciseContent +
            "...option 格式有问题..." +
            this.testobj.options
        );
      }
      if (this.testobj.answer) {
        // this.value1 = this.testobj.answer;
        let value1 = "",
          answer = this.testobj.answer;
        if (optionsobj) {
          optionsobj.forEach(o => {
            if (o.order === answer) {
              value1 = o.displayOrder;
            }
          });
          this.value1 = value1;
        }
        if (this.isquestion) {
          this.questionDisabled = true;
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
    submitTest() {
      let params = {
        answer: this.questionAnswer,
        testExerciseInstanceId: this.testobj.id
      };
      if (this.isquestion) {
        this.axios.post(`${API.index.test_answer}`, params).then(result => {
          if (result.code === 20000) {
            this.questionDisabled = this.isquestion;
          }
        });
      }
    },
    change(item) {
      console.log("this.item", item);
      let answer1 = "";
      let optionsobj = JSON.parse(this.testobj.options);
      console.log("this.testobj.options", this.testobj.options);
      console.log("optionsobj", optionsobj);
      console.log("this.options", this.options);
      if (optionsobj) {
        this.options.forEach(o => {
          if (o.key === item) {
            answer1 = o.realkey;
          }
        });
        this.value1 = item;
      }
      console.log("answer1", answer1);
      this.questionAnswer = answer1;
      let params = {
        answer: this.questionAnswer,
        testExerciseInstanceId: this.testobj.id
      };
      if (!this.isquestion) {
        this.axios.post(`${API.index.test_answer}`, params).then(result => {
          if (result.code === 20000) {
            // this.questionDisabled = this.isquestion;
          }
        });
      }
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
.course-component-option-img {
  max-width: 200px;
  max-height: 150px;
  vertical-align: top;
}
</style>
