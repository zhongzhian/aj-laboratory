<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn"
        >刷新</Button
      >
    </div>
    <div>
      <!-- <f-table @on-select="rowSelect" :columns="columns1" :dataSource="data1"></f-table> -->
      <b-table
        @on-select="rowSelect"
        @page-data-change="currentChange"
        :pageData="pageData1"
        :columns="columns1"
        :dataSource="data1"
      ></b-table>
    </div>

    <Drawer
      title="设备"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name" label-position="top">
                <Input
                  v-model="newObj.name"
                  size="small"
                  placeholder="请输入名称"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="类型" prop="type" label-position="top">
                <Select v-model="newObj.type" placeholder="请选择类型">
                  <Option
                    v-for="item in typedata"
                    :value="item.value"
                    :key="item"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="图片" label-position="top">
                <!-- <img v-if="newObj.userImage" :src="newObj.userImage" class="form-user-img" /> -->
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  style="display: inline-block;vertical-align: top;"
                >
                  <img
                    v-if="newObj.picture"
                    :src="newObj.picture"
                    class="form-user-img"
                  />
                  <img
                    v-if="!newObj.picture"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="资源类型"
                prop="resourceClass"
                label-position="top"
              >
                <Input
                  v-model="newObj.resourceClass"
                  size="small"
                  placeholder="请输入资源类型"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="关联的摄像头" label-position="top">
                <Select v-model="cameraId" placeholder="请选择关联的摄像头">
                  <Option
                    v-for="item in cameraDatas"
                    :value="item.value"
                    :key="item"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="实验时长" prop="duration" label-position="top">
                <Input
                  type="number"
                  v-model="newObj.duration"
                  size="small"
                  placeholder="请输入实验时长(单位：小时)"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="页面url" prop="pageUrl" label-position="top">
                <Input
                  v-model="newObj.pageUrl"
                  size="small"
                  placeholder="请输入页面url"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备ID" prop="relationKey" label-position="top">
                <Input
                  v-model="newObj.relationKey"
                  size="small"
                  placeholder="请输入关联的key"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="描述" prop="description" label-position="top">
                <Input
                  type="textarea"
                  v-model="newObj.description"
                  :rows="4"
                  placeholder="请输入描述"
                />
              </FormItem>
            </Col>
            <Col span="12"></Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('formValidate')"
          >保存</Button
        >
      </div>
    </Drawer>

    <Drawer
      title="信号通道列表"
      v-model="showChannel"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <div class="table-condition-btnbar">
          <Button @click="addChannel" size="small" class="condition-btn"
            >添加</Button
          >
          <Button @click="delChannel" size="small" class="condition-btn"
            >删除</Button
          >
          <Button @click="getChannelDatas" size="small" class="condition-btn"
            >刷新</Button
          >
        </div>
        <Table
          size="small"
          :columns="columns2"
          :data="channelDatas"
          @on-row-click="channelrowClick"
          @on-select="channelrowSelect"
        ></Table>
      </div>
      <div class="demo-drawer-footer">
        <!-- <Button style="margin-right: 8px" @click="showChannel = false">取消</Button> -->
        <Button type="primary" @click="showChannel = false">关闭</Button>
      </div>
    </Drawer>

    <Drawer
      title="信号通道"
      v-model="showEditChannel"
      width="600"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="channelValidate" :model="channelObj" :rules="ruleValidate">
          <FormItem label="图片" prop="picture">
            <Upload
              ref="upload"
              :action="uploadAction"
              :headers="headers"
              :data="uploadData"
              :show-upload-list="false"
              :on-success="handleSuccess2"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="2048"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              style="display: inline-block;vertical-align: top;"
            >
              <img
                v-if="channelObj.picture"
                :src="channelObj.picture"
                class="form-user-img"
              />
              <img
                v-if="!channelObj.picture"
                src="static/images/noperson.png"
                class="form-user-img"
              />
            </Upload>
          </FormItem>
          <FormItem label="名称" prop="name">
            <Input
              v-model="channelObj.name"
              size="small"
              placeholder="请输入名称"
            />
          </FormItem>
          <FormItem label="信道编号" prop="channelId">
            <!-- <Input
              v-model="channelObj.channelId"
              size="small"
              placeholder="请输入信道编号"
            /> -->
            <Select v-model="channelObj.channelId" placeholder="请输入信道编号">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
            </Select>
          </FormItem>
          <FormItem label="数据类型" prop="dataType">
            <!-- <Input
              v-model="channelObj.dataType"
              size="small"
              placeholder="请输入数据类型"
            /> -->
            <Select v-model="channelObj.dataType" placeholder="请输入数据类型">
              <Option
                v-for="item in channelTypes"
                :value="item.value"
                :key="item"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="描述" prop="description" label-position="top">
            <Input
              type="textarea"
              v-model="channelObj.description"
              :rows="4"
              placeholder="请输入描述"
            />
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showEditChannel = false"
          >取消</Button
        >
        <Button type="primary" @click="addChannelSubmit">保存</Button>
      </div>
    </Drawer>

    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选设备吗？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="delSubmit"
          >删除</Button
        >
      </div>
    </Modal>
    <Modal v-model="showChannelDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选信号通道吗？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="delChannelSubmit"
          >删除</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";
import dateformat from "@/utils/dateformat.js";

export default {
  data() {
    const validateSequence = (rule, value, callback) => {
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字"));
      } else if (parseInt(value) < 1) {
        callback(new Error("实验时长不能小于1"));
      } else {
        callback();
      }
    };
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },

      searchText: "",
      modal_loading: false,
      typedata: [
        { value: 1, label: "在线实验设备" },
        { value: 2, label: "实时数据设备" }
      ],
      channelTypes: [
        { value: "AI", label: "模拟输入" },
        { value: "DI", label: "数字输入" },
        { value: "SPI", label: "SPI" },
        { value: "I2C", label: "I2C" }
      ],
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      columns1: [
        {
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
          title: "类型",
          align: "center",
          key: "typeStr"
        },
        {
          title: "资源类型",
          key: "resourceClass"
        },
        {
          title: "页面url",
          key: "pageUrl"
        },
        {
          title: "关联的key",
          key: "relationKey"
        },
        {
          title: "操作",
          key: "action",
          width: 180,
          align: "center",
          render: (h, params) => {
            let harr = [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.rowClick(params.row);
                    }
                  }
                },
                "编辑"
              )
            ];
            if (params.row.type === 2) {
              harr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.configChannels(params.row);
                      }
                    }
                  },
                  "设置信号通道"
                )
              );
            }
            let hhh = h("div", harr);
            return hhh;
          }
        }
      ],
      columns2: [
        {
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
          title: "信道编号",
          key: "channelId"
        },
        {
          title: "描述",
          key: "description"
        }
      ],
      data1: [],
      cameraDatas: [],
      channelDatas: [],
      selection: [],
      channelselection: [],
      showAddNew: false,
      showChannel: false,
      showEditChannel: false,
      showDelete: false,
      showChannelDelete: false,
      cameraId: 0,
      newObj: {
        name: "",
        dataType: "",
        pageUrl: "",
        relationKey: "",
        resourceClass: "",
        type: 1,
        picture: "",
        // cameraId: 0,
        cameraName: "",
        duration: 1,
        description: "",
        signalChannelList: []
      },
      editObj: null,
      channelObj: {
        channelId: "0",
        dataType: "",
        description: "",
        deviceId: 0,
        deviceName: "",
        name: "",
        picture: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // dataType: [
        //   { required: true, message: "请选择数据类型", trigger: "change" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }],
        pageUrl: [{ required: true, message: "页面url", trigger: "blur" }],
        relationKey: [
          { required: true, message: "请输入关联的key", trigger: "blur" }
        ],
        resourceClass: [
          { required: true, message: "请输入资源类型", trigger: "blur" }
        ],
        duration: [
          { required: true, validator: validateSequence, trigger: "blur" }
        ]
      },
      ws: null
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    this.getTableDatas();
    this.getCameraDatas();
  },
  currentChange(v) {
    console.log("v", v);
    this.pageData1.current = v;
    this.getTableDatas();
  },
  methods: {
    getTableDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize
      };
      this.axios.post(`${API.index.device_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData1.total = result.result.totalNum;
          this.data1 = result.result.list.map(d => {
            let typeStr = d.type === 1 ? "在线实验设备" : "实时数据设备";
            return { ...d, typeStr: typeStr };
          });
        }
      });
    },

    addChannel() {
      this.channelObj = {
        channelId: "",
        dataType: "",
        description: "",
        deviceId: this.editObj.id,
        deviceName: this.editObj.name,
        name: "",
        picture: ""
      };
      this.showEditChannel = true;
    },
    addChannelSubmit() {
      let method = "post";
      if (this.channelObj.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.signalChannel,
        data: this.channelObj,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showEditChannel = false;
            this.getChannelDatas();
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    delChannel() {
      if (this.channelselection.length < 1) {
        this.$Message.error("请先选择要删除的设备");
        return;
      }
      this.showChannelDelete = true;
    },
    delChannelSubmit() {
      let ids = [];
      ids = this.channelselection.map(s => s.id);
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: API.index.signalChannel,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showChannelDelete = false;
            this.modal_loading = false;
            this.getChannelDatas();
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    channelrowSelect(selection, row) {
      this.channelselection = selection;
    },
    channelrowClick(item, index) {
      this.channelObj = item;
      this.showEditChannel = true;
    },
    configChannels(item) {
      this.editObj = item;
      // this.channelObj.deviceId = item.id;
      // this.channelObj.deviceId = item.id;
      this.getChannelDatas();
      this.showChannel = true;
    },
    getChannelDatas() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "deviceId",
              op: "eq",
              type: "int",
              value: this.editObj.id
            }
          ],
          logic: "and"
        }
      };
      this.axios
        .post(`${API.index.signalChannel_list}`, params)
        .then(result => {
          if (result.code === 20000) {
            this.channelDatas = result.result.list;
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
            case "editValidate":
              _this.editItem();
              break;
          }
        } else {
          this.$Message.error("表单有误!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showAddNew = false;
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
        url: API.index.device,
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
        name: "",
        dataType: "",
        pageUrl: "",
        relationKey: "",
        resourceClass: "",
        type: 1,
        picture: "",
        // cameraId: 0,
        cameraName: "",
        duration: 1,
        description: "",
        signalChannelList: []
      };

      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newObj.id) {
        method = "put";
      }
      if (this.cameraId) {
        this.newObj.cameraId = this.cameraId;
      } else {
        delete this.newObj.cameraId;
      }
      this.axios({
        method: method,
        url: API.index.device,
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
      this.selection = selection;
    },
    rowClick(item, index) {
      this.newObj = item;
      this.showAddNew = true;
    },
    getCameraDatas() {
      let params = {};
      this.axios.post(`${API.index.camera_list}`, params).then(result => {
        if (result.code === 20000) {
          let cameraDatas = [{ value: 0, label: "不绑定" }];
          let aaa = result.result.list.map(r => {
            return { ...r, value: r.id, label: r.name };
          });
          cameraDatas.push(...aaa);
          this.cameraDatas = cameraDatas;
        }
      });
    },
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 20000) {
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
      if (res.code === 20000) {
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
<style></style>

<style lang="less" scoped></style>
