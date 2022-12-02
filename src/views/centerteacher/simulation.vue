<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
    </div>
    <div>
      <b-table @page-data-change="currentChange" @page-size-change="sizeChange" :pageData="pageData1"
        @on-select="rowSelect" @on-row-click="rowClick" :columns="columns1" :dataSource="data1"></b-table>
    </div>
    <Drawer title="仿真实验详情" v-model="showAddNew" width="720" :mask-closable="false" class-name="demo-drawer-style">
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
            <FormItem label="名称" prop="name" label-position="top">
              <Input v-model="newObj.name" size="small" placeholder="请输入名称" />
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="图片" label-position="top">
              <!-- <img v-if="newObj.userImage" :src="newObj.userImage" class="form-user-img" /> -->
              <Upload ref="upload" :action="uploadAction" :headers="headers" :data="uploadData"
                :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload"
                style="display: inline-block;vertical-align: top;">
                <img v-if="newObj.picture" :src="newObj.picture" class="form-user-img" />
                <img v-if="!newObj.picture" src="static/images/noperson.png" class="form-user-img" />
              </Upload>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="实验页面url" prop="pageUrl">
            <Input v-model="newObj.pageUrl" size="small" placeholder="请输入实验页面url" />
          </FormItem>
          <FormItem label="描述" prop="description" label-position="top">
            <Input type="textarea" v-model="newObj.description" :rows="4" placeholder="请输入内容" />
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
        <p>确定删除所选仿真实验吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import API from "@/api";
  import dateformat from "@/utils/dateformat.js";

  export default {
    data() {
      return {
        picBasePath: API.picPath,
        uploadAction: API.uploadPath + API.index.upload_upload,
        headers: null,
        uploadData: {
          file: null,
          name: "",
          type: "normal"
        },

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
            title: "图片",
            width: 90,
            key: "picture",
            render: (h, params) => {
              if (params.row.picture) {
                return h("img", {
                  class: "list-user-img",
                  attrs: {
                    src: params.row.picture
                  }
                });
              } else {
                return h("img", {
                  class: "list-user-img",
                  attrs: {
                    src: "static/images/noperson.png"
                  }
                });
              }
            }
          },
          {
            title: "名称",
            key: "name"
          },
          {
            title: "实验页面url",
            key: "pageUrl"
          },
          {
            title: "描述",
            key: "description"
          }
        ],
        data1: [],
        selection: [],
        showAddNew: false,
        showDelete: false,
        newObj: {
          courseId: 0,
          courseName: "",
          name: "",
          picture: "",
          pageUrl: "",
          description: ""
        },
        ruleValidate: {
          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],
          pageUrl: [{
            required: true,
            message: "请输入实验页面url",
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
      this.headers = {
        Authorization: "Bearer " + this.$store.getters.token
      };
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
        this.axios.post(`${API.index.simulation_list}`, params).then(result => {
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
          this.$Message.error("请先选择要删除的仿真实验");
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
            url: API.index.simulation,
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
          courseId: this.courseInfo.id,
          courseName: this.courseInfo.name,
          name: "",
          picture: "",
          pageUrl: "",
          description: ""
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
            url: API.index.simulation,
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
      },
      handleSuccess(res, file, fileList) {
        if ((res.code === 20000)) {
          let splits = res.result.uploadFileName.split("|");
          let path = splits[1] ? splits[1] : splits[0];
          file.url = this.picBasePath + path;
          this.newObj.picture = file.url;
        } else if (res.code === 50401) {
          console.log("this.$route.name....", this.$route.name);
          this.$router.push({
            name: "login",
            query: {
              name: this.$route.name
            }
          });
        } else {
          this.$Message.error(res.message);
        }
      },
      handleSuccess2(res, file, fileList) {
        if ((res.code === 20000)) {
          let splits = res.result.uploadFileName.split("|");
          let path = splits[1] ? splits[1] : splits[0];
          file.url = this.picBasePath + path;
          this.channelObj.picture = file.url;
        } else if (res.code === 50401) {
          console.log("this.$route.name....", this.$route.name);
          this.$router.push({
            name: "login",
            query: {
              name: this.$route.name
            }
          });
        } else {
          this.$Message.error(res.message);
        }
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "Exceeding file size limit",
          desc: "File  " + file.name + " is too large, no more than 2M."
        });
      },
      handleBeforeUpload(file) {
        this.uploadData.file = file;
        this.uploadData.name = file.name;
      }
    }
  };
</script>
<style>
</style>

<style lang="less" scoped>
</style>
