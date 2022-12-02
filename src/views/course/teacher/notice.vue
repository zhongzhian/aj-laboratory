<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
    </div>
    <div>
      <!-- <f-table
        @on-select="rowSelect"
        @on-row-click="rowClick"
        :columns="columns1"
        :dataSource="data1"
      ></f-table> -->
      <b-table @page-data-change="currentChange" @page-size-change="sizeChange" :pageData="pageData1"
        @on-select="rowSelect" @on-row-click="rowClick" :columns="columns1" :dataSource="data1"></b-table>
    </div>
    <Drawer title="公告" v-model="showAddNew" width="720" :mask-closable="false" class-name="demo-drawer-style">
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="newObj.title" size="small" placeholder="请输入标题" />
          </FormItem>
          <FormItem label="内容" prop="content" label-position="top">
            <Input type="textarea" v-model="newObj.content" :rows="4" placeholder="请输入内容" />
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </div>
    </Drawer>

    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选公告吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import API from "@/api";
  import comselect from "@/components/ComSelect.vue";
  import dateformat from "@/utils/dateformat.js";

  export default {
    components: {
      comselect
    },
    data() {
      return {
        courseId: 0,
        courseInfo: null,
        userInfo: null,
        searchText: "",
        modal_loading: false,
        pageData1: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        columns1: [{
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "标题",
            key: "title"
          },
          {
            title: "内容",
            minWidth: 500,
            ellipsis: true,
            tooltip: true,
            key: "content"
          },
          {
            title: "发布人",
            key: "userName"
          }
        ],
        data1: [],
        selection: [],
        showAddNew: false,
        showDelete: false,
        newObj: {
          content: "",
          courseId: 0,
          courseName: "",
          title: "",
          userId: 0,
          userName: ""
        },
        ruleValidate: {
          title: [{
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }],
          content: [{
            required: true,
            message: "请输入内容",
            trigger: "blur"
          }]
        }
      };
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      let courseId = this.$route.query.id;
      if (courseId) {
        this.courseId = courseId;
        this.getTableDatas();
        this.getCourse();
      }
    },
    methods: {
      currentChange(v) {
        this.pageData1.current = v;
        this.getTableDatas();
      },
      sizeChange(v) {
        this.pageData1.current = 1;
        this.pageData1.pageSize = v;
        this.getTableDatas();
      },
      getTableDatas() {
        let params = {
          page: this.pageData1.current - 1,
          pageSize: this.pageData1.pageSize,
          searchParas: {
            conditions: [{
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.announcement_list}`, params).then(result => {
          if (result.code === 20000) {
            this.pageData1.total = result.result.totalNum;
            this.data1 = result.result.list;
          }
        });
      },
      handleSubmit(name) {
        let _this = this;
        this.$refs[name].validate(valid => {
          if (valid) {
            // this.$store.dispatch("register", this.formValidate);
            switch (name) {
              case "formValidate":
                _this.addSubmit();
                break;
            }
          } else {
            this.$Message.error("Fail!");
          }
        });
      },
      delItem() {
        if (this.selection.length < 1) {
          this.$Message.error("请先选择要删除的设备");
          return;
        }
        this.showDelete = true;
      },
      delSubmit() {
        let ids = [];
        ids = this.selection.map(s => s.id);
        this.modal_loading = true;

        this.axios({
            method: "delete",
            url: API.index.announcement,
            data: ids,
            showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.showDelete = false;
              this.modal_loading = false;
              this.getTableDatas();
            }
          })
          .catch(err => {
            this.modal_loading = false;
            this.$Message.error("删除失败");
          });
      },
      addItem() {
        this.newObj = {
          title: "",
          content: "",
          courseId: this.courseInfo.id,
          courseName: this.courseInfo.name,
          userId: this.userInfo.id,
          userName: this.userInfo.personName || this.userInfo.userName
        };
        this.showAddNew = true;
      },
      addSubmit() {
        let method = "post";
        if (this.newObj.id) {
          method = "put";
        }
        this.axios({
            method: method,
            url: API.index.announcement,
            data: this.newObj,
            showSpin: false
          })
          .then(result => {
            if (result.code === 20000) {
              this.showAddNew = false;
              this.getTableDatas();
            }
          })
          .catch(err => {
            this.$Message.error("保存失败");
          });
      },
      rowSelect(selection, row) {
        // console.log("selection",selection);
        this.selection = selection;
      },
      rowClick(item, index) {
        this.newObj = item;
        this.showAddNew = true;
      },
      getCourse() {
        this.axios
          .get(`${API.index.course + "/"}` + this.courseId)
          .then(result => {
            if (result.code === 20000) {
              this.courseInfo = result.result;
              this.newObj.courseId = result.result.id;
              this.newObj.courseName = result.result.name;
            }
          });
      }
    }
  };
</script>
<style></style>

<style lang="less" scoped></style>
