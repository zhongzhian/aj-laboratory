<template>
  <div class="classselect-component-content">
    <Select v-model="grade" style="width:100px" @on-change="gradeChange">
      <Option v-for="item in gradelist" :value="item" :key="item">{{
                item
              }}</Option>
    </Select>

    <Select v-model="major" style="width:100px" @on-change="majorChange">
      <Option v-for="item in majorlist" :value="item" :key="item">{{
              item
            }}</Option>
    </Select>

    <Select v-model="class1" style="width:100px" @on-change="classChange">
      <Option v-for="item in class1list" :value="item" :key="item">{{
                  item
                }}</Option>
    </Select>
  </div>
</template>

<script>
  import API from "@/api";

  export default {
    props: ["courseid"],
    data() {
      return {
        majorlist: ["全部专业"],
        major: "全部专业",
        gradelist: ["全部年级"],
        grade: "全部年级",
        class1list: ["全部班"],
        class1: "全部班",
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
      console.log("classselect mounted");
      if (this.courseid) {} else {
        this.getGrade()
      }
    },
    methods: {
      classSelectChange() {
        let params = {
          grade: this.grade === "全部年级" ? "" : this.grade,
          major: this.major === "全部专业" ? "" : this.major,
          class1: this.class1 === "全部班" ? "" : this.class1,
        }
        console.log("classselect classselectchange", params);
        this.$emit("classselectchange", params)
      },
      majorChange() {
        this.class1list = ["全部班"];
        this.class1 = "全部班";
        this.getClass1();
        this.classSelectChange();
      },
      gradeChange() {
        this.majorlist = ["全部专业"];
        this.major = "全部专业";
        this.class1list = ["全部班"];
        this.class1 = "全部班"
        this.getMajor();
        this.classSelectChange();
      },
      classChange() {
        this.classSelectChange();
      },
      getGrade(v) {
        let params = {
          // major: this.major,
          // type: 0
        };
        this.axios
          .post(`${API.index.grade_get}`, params)
          .then(result => {
            if (result.code === 20000) {
              let gradelist = ["全部年级"];
              if (result.result) {
                let arr = result.result.filter(a => {
                  if (a) return true;
                  else return false;
                })
                gradelist = gradelist.concat(arr);
              }
              this.gradelist = gradelist;
            }
          });
      },
      getMajor() {
        let params = {
          grade: this.grade,
          // type: 0
        };
        this.axios
          .post(`${API.index.major_get}`, params)
          .then(result => {
            if (result.code === 20000) {
              let majorlist = ["全部专业"];
              if (result.result) {
                let arr = result.result.filter(a => {
                  if (a) return true;
                  else return false;
                })
                majorlist = majorlist.concat(arr);
              }
              this.majorlist = majorlist;
            }
          });
      },
      getClass1() {
        let params = {
          major: this.major,
          grade: this.grade
        };
        this.axios
          .post(`${API.index.class_get}`, params)
          .then(result => {
            if (result.code === 20000) {
              let class1list = ["全部班"];
              if (result.result) {
                let arr = result.result.filter(a => {
                  if (a) return true;
                  else return false;
                })
                class1list = class1list.concat(arr);
              }
              this.class1list = class1list;
            }
          });
      },
    }
  };
</script>
<style></style>

<style lang="less" scoped>
  .classselect-component-content {
    display: inline-block;
  }
</style>
