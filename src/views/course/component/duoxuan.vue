<template>
  <div class="course-component-content">
    <CheckboxGroup v-model="valueArr" @on-change="change">
      <Checkbox :disabled="disabled" :key="item" v-for="(item,index) in options" :label="item.key">
        <template v-if="isPic">
          {{item.key}}:<img :src="item.value" class="course-component-option-img">
        </template>
      </Checkbox>
    </CheckboxGroup>
    <!-- <div v-if="grade" class="course-component-grade">
      客观题只要一交卷，就可以看到正确答案和得分，20190923 -->
    <div v-if="disabled" class="course-component-grade">
      <div>正确答案：{{testobj.correctAnswer}}</div>
      <div>
        得分：
        <span v-if="isRight">{{testobj.score}}</span>
        <span v-else>0</span>
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
      value1: "",
      valueArr: [],
      options: [],
      isPic:false
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
    if (this.testobj) {
      let optionsobj = JSON.parse(this.testobj.options);
      if (optionsobj) {
        this.options = optionsobj.map(o => {
          let obj = {};
          for (var i in o) {
            obj["key"] = i;
            obj["value"] = o[i];
          }
          return obj;
        });
        this.isPic = optionsobj[0].A.indexOf("http://") === 0;
      } else {
        console.log(
          this.testobj.exerciseContent +
            "...option 格式有问题..." +
            this.testobj.options
        );
      }
      if (this.testobj.answer) {
        this.valueArr = this.testobj.answer.split(',');
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
      console.log("item", item);
      let params = {
        answer: item.join(","),
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
.course-component-option-img{
  max-width:200px;
  max-height:150px;
}
</style>
