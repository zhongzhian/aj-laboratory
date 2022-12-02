<template>
  <div class="course-component-content">
    <CheckboxGroup v-model="valueArr" @on-change="change">
      <Checkbox
        :disabled="disabled"
        :key="item.key"
        v-for="(item, index) in options"
        :label="item.value"
      >
        <template v-if="isPic">
          {{ item.key }}:<img
            :src="item.value"
            class="course-component-option-img"
          />
        </template>
      </Checkbox>
    </CheckboxGroup>
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
        <div>正确答案：{{ testobj.correctAnswer }}</div>
        <div>
          得分：
          <span v-if="isRight">{{ testobj.score }}</span>
          <span v-else>0</span>
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
      valueArr: [],
      options: [],
      optionsMap: {},
      isPic: false,
      questionAnswer: "",
      questionDisabled: false
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
  },
  mounted() {
    if (this.testobj) {
      let optionsobj = JSON.parse(this.testobj.options);
      console.log("this.optionsobj", optionsobj);
      if (optionsobj) {
        let optionsMap = [];
        this.options = optionsobj.map(o => {
          let objvalue = o.displayOrder + ": " + o.content;
          optionsMap[objvalue] = o.displayOrder;
          let obj = {
            key: o.order,
            value: objvalue
          };
          return obj;
        });
        this.optionsMap = optionsMap;
        this.isPic = optionsobj[0].content.indexOf("http://") === 0;
      } else {
        console.log(
          this.testobj.exerciseContent +
            "...option 格式有问题..." +
            this.testobj.options
        );
      }
      if (this.testobj.answer) {
        let valueArr = [],
          answerArr = this.testobj.answer.split(",");
        if (optionsobj) {
          optionsobj.forEach(o => {
            if (_.indexOf(answerArr, o.order) != -1) {
              let objvalue = o.displayOrder + ": " + o.content;
              valueArr.push(objvalue);
            }
          });
          this.valueArr = valueArr;
        }
        if (this.isquestion) {
          this.questionDisabled = true;
        }
      }
    }
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
      let valueArr = item.map(i => {
        return this.optionsMap[i];
      });
      this.questionAnswer = valueArr.join(",");
      let params = {
        answer: this.questionAnswer,
        testExerciseInstanceId: this.testobj.id
      };
      console.log("params", params);
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
