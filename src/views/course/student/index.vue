<template>
  <div class="notice-content">
    <div class="notice-content-left">
      <div v-if="userInfo" class="notice-content-left-box">
        <p>亲爱的 {{ userInfo.personName || userInfo.userName }}</p>
        <p>欢迎您加入课程，赶快开启学习之旅吧～</p>
        <Button
          v-if="isGuest"
          @click="gotoPage"
          class="notice-content-left-box-btn"
          type="warning"
          >进入课程</Button
        >
        <Button
          v-else
          @click="gotoPage"
          class="notice-content-left-box-btn"
          type="warning"
          >开始学习</Button
        >
      </div>
      <div class="layout-content-title" style="margin-top:20px;">课程评价</div>
      <div style="width:80%;">
        <Form
          ref="formValidate"
          :model="commentObj"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="评分" prop="name" label-position="top">
            <!-- <Input
              v-model="commentObj.title"
              size="small"
              placeholder="请输入评价标题"
            /> -->
            <Rate show-text allow-half v-model="commentObj.score">
              <span style="color: #f5a623">{{ commentObj.score }}</span>
            </Rate>
          </FormItem>
          <FormItem label="内容" prop="introduction" label-position="top">
            <Input
              type="textarea"
              v-model="commentObj.content"
              :rows="4"
              placeholder="请输入评价内容"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')"
              >保存</Button
            >
          </FormItem>
        </Form>
      </div>
      <div class="layout-content-title" style="margin-top:20px;">评分标准</div>
      <div v-if="courseInfo">
        <div v-html="courseInfo.standard">无</div>
      </div>
      <div v-else>无</div>
      <div class="layout-content-title" style="margin-top:20px;">公告</div>
      <template v-if="data1.length > 0">
        <div :key="item" v-for="item in data1">
          <div class="notice-content-left-div">
            <p style="font-size:16px;line-height:40px;">{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
          <div class="notice-content-left-time">{{ item.updateTime }}</div>
        </div>
      </template>
      <template v-else>
        <div>无</div>
      </template>
    </div>
    <div class="notice-content-right">
      <!-- <div class="notice-content-right-box">
        <p style="font-size:16px;line-height:30px;">即将到期</p>
        <p style="font-size:12px;color:#70ac1f;">非线性系统的描述单元测试</p>
        <p style="font-size:8px ;">截止提交时间：2019年07月14日 00:00</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      editor: null,
      isGuest: false,
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      commentObj: {
        content: "",
        courseId: 0,
        courseName: "",
        score: 0,
        title: "",
        userId: 0,
        userName: ""
      },
      ruleValidate: {
        title: [{ required: true, message: "请输入评论标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入评论内容", trigger: "blur" }
        ]
      },
      data1: []
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    if (this.userInfo.userType === "0") {
      this.isGuest = true;
    } else {
      this.isGuest = false;
    }
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getCourse();
      this.getCommentData();
      this.getTableDatas();
    }
  },
  methods: {
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$store.dispatch("register", this.formValidate);
          switch (name) {
            case "formValidate":
              _this.addCommentSubmit();
              break;
            case "editValidate":
              _this.editItem();
              break;
          }
        } else {
          this.$Message.error("请输入所有必填项");
        }
      });
    },
    addCommentSubmit() {
      this.axios
        .post(`${API.index.coursecomment}`, this.commentObj)
        .then(result => {
          if (result.code === 20000) {
            this.$Message.success("评论成功");
          }
        });
    },
    getTableDatas() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.announcement_list}`, params).then(result => {
        if (result.code === 20000) {
          this.data1 = result.result.list;
        }
      });
    },
    gotoPage() {
      this.$router.push({
        name: "manage-index-chapter",
        query: {
          id: this.courseId
        }
      });
    },
    getCommentData() {
      let params = {
        page: 0,
        pageSize: 20,
        searchParas: {
          conditions: [
            {
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            },
            {
              name: "userId",
              op: "eq",
              type: "int",
              value: this.userInfo.id
            }
          ],
          logic: "and"
        }
      };
      this.axios
        .post(`${API.index.coursecomment_list}`, params)
        .then(result => {
          if (result.code === 20000) {
            if (result.result.totalNum > 0) {
              this.commentObj = result.result.list[0];
            }
          }
        });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.commentObj = {
              ...this.commentObj,
              courseId: this.courseId,
              courseName: this.courseInfo.name,
              userId: this.userInfo.id,
              userName: this.userInfo.personName
            };
          }
        });
    }
  }
};
</script>
<style></style>

<style lang="less" scoped>
.notice-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.notice-content-left {
  position: absolute;
  top: 10px;
  left: 20px;
  bottom: 20px;
  right: 250px;
}
.notice-content-right {
  position: absolute;
  top: 10px;
  bottom: 20px;
  right: 30px;
  width: 200px;
}
.notice-content-left-box {
  background-color: #f1f2f3;
  padding: 5px;
  position: relative;
  margin-bottom: 20px;
}
.notice-content-left-box-btn {
  width: 200px;
  position: absolute;
  right: 20px;
  top: 7px;
}
.notice-content-left-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
}
.notice-content-left-div {
  padding: 20px 0;
  font-size: 10px;
}
.notice-content-left-time {
  color: #ccc;
  text-align: right;
  font-size: 8px;
  border-bottom: 1px solid #ccc;
}
.notice-content-right-box {
  background-color: #f7f8f9;
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
