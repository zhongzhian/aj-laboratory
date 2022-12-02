<template>
  <div class="course-component-content"></div>
</template>

<script>
import API from "@/api";

export default {
  props: ["testobj", "status", "grade"],
  data() {
    return {
      value1: "",
      options: [],
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
    // isPic(){
    //   return this.testobj.options[0].A.indexOf("http://") === 0;
    // }
  },
  mounted() {
    console.log("this.testobj", this.testobj);
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
}
</style>
