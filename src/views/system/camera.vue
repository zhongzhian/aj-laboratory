<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
    </div>
    <div>
      <!-- <f-table
        @on-select="rowSelect"
        @on-row-click="rowClick"
        :columns="columns1"
        :dataSource="data1"
      ></f-table>-->
      <b-table
        @page-data-change="currentChange"
        :pageData="pageData1"
        @on-select="rowSelect"
        @on-row-click="rowClick"
        :columns="columns1"
        :dataSource="data1"
      ></b-table>
    </div>

    <Drawer
      title="摄像头"
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
                <Input v-model="newObj.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="ip地址" prop="ip" label-position="top">
                <Input v-model="newObj.ip" size="small" placeholder="请输入ip地址" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="唯一标识" prop="uniqueKey" label-position="top">
                <Input v-model="newObj.uniqueKey" size="small" placeholder="请输入唯一标识" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="所属srs服务" prop="srsServerId" label-position="top">
                <Select v-model="newObj.srsServerId" placeholder="请选择所属srs服务">
                  <Option v-for="item in srsDatas" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户名" prop="userName" label-position="top">
                <Input v-model="newObj.userName" size="small" placeholder="请输入用户名" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="密码" prop="password" label-position="top">
                <Input v-model="newObj.password" size="small" placeholder="请输入密码" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="视频端口" prop="videoPort" label-position="top">
                <Input v-model="newObj.videoPort" size="small" placeholder="请输入视频端口" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="视频路径" prop="retransmitPort" label-position="top">
                <Input v-model="newObj.videoPath" size="small" placeholder="请输入视频路径" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="协议类型" prop="protocol" label-position="top">
                <Input v-model="newObj.protocol" size="small" placeholder="请输入协议类型" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="强制TCP" prop="forceTcp" label-position="top">
                <Select v-model="newObj.forceTcp" placeholder="请选择是否强制TCP">
                  <Option
                    v-for="item in forceTcpData"
                    :value="item.value"
                    :key="item"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <!-- <Row :gutter="32">
            <Col span="12">
              <FormItem label="控制端口" prop="controlPort" label-position="top">
                <Input v-model="newObj.controlPort" size="small" placeholder="请输入控制端口" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="发现端口" prop="findPort" label-position="top">
                <Input v-model="newObj.findPort" size="small" placeholder="请输入发现端口" />
              </FormItem>
              <FormItem label="转发端口" prop="retransmitPort" label-position="top">
                <Input v-model="newObj.retransmitPort" size="small" placeholder="请输入转发端口" />
              </FormItem>
            </Col>
          </Row>-->
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
        <p>确定删除所选摄像头吗？</p>
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
  components: { comselect },
  data() {
    return {
      searchText: "",
      modal_loading: false,
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
          title: "名称",
          key: "name"
        },
        {
          title: "ip地址",
          key: "ip"
        },
        {
          title: "唯一标识",
          key: "uniqueKey"
        },
        {
          title: "视频端口",
          key: "videoPort"
        },
        {
          title: "视频路径",
          key: "videoPath"
        },
        {
          title: "协议类型",
          key: "protocol"
        },
        {
          title: "是否强制TCP",
          key: "forceTcp",
          render: (h, params) => {
            let str = params.row.forceTcp === 1 ? "是" : "否";
            return h("span", str);
          }
        }
      ],
      data1: [],
      forceTcpData: [{ value: 0, label: "否" }, { value: 1, label: "是" }],
      deviceDatas: [],
      srsDatas: [],
      selection: [],
      showAddNew: false,
      showEdit: false,
      showEditType: "", // single,mul
      showImport: false,
      showExport: false,
      showDelete: false,
      cantDelete: false,
      newObj: {
        bindStatus: 0,
        name: "",
        ip: "",
        uniqueKey: "",
        srsServerId: 0,
        userName: "",
        password: "",
        videoPort: "",
        videoPath: "",
        protocol: "",
        forceTcp: 1,
        controlPort: "",
        findPort: "",
        retransmitPort: ""
      },
      editObj: null,
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ip: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
        uniqueKey: [
          { required: true, message: "请输入唯一标识", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        videoPort: [
          { required: true, message: "请输入视频端口", trigger: "blur" }
        ],
        videoPath: [
          { required: true, message: "请输入视频路径", trigger: "blur" }
        ],
        protocol: [
          { required: true, message: "请输入协议类型", trigger: "blur" }
        ],
        forceTcp: [
          {
            required: true,
            type: "number",
            message: "请选择是否强制TCP",
            trigger: "change"
          }
        ],
        srsServerId: [
          {
            required: true,
            type: "number",
            message: "请选择srs服务",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getTableDatas();
    // this.getDeviceDatas();
    this.getSrsDatas();
  },
  methods: {
    currentChange(v) {
      this.pageData1.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize
      };
      this.axios.post(`${API.index.camera_list}`, params).then(result => {
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
          switch (name) {
            case "formValidate":
              _this.addSubmit();
              break;
          }
        } else {
          this.$Message.error("输入有误!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showAddNew = false;
    },
    delItem() {
      if (this.selection.length < 1) {
        this.$Message.error("请先选择要删除的摄像头");
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
        url: API.index.camera,
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
        bindStatus: 0,
        name: "",
        ip: "",
        uniqueKey: "",
        srsServerId: 0,
        userName: "",
        password: "",
        videoPort: "",
        videoPath: "",
        protocol: "",
        forceTcp: 1,
        controlPort: "",
        findPort: "",
        retransmitPort: ""
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
        url: API.index.camera,
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
    getDeviceDatas() {
      let params = {};
      this.axios.post(`${API.index.device_list}`, params).then(result => {
        if (result.code === 20000) {
          this.deviceDatas = result.result.list.map(r => {
            return {
              value: r.id,
              label: r.name
            };
          });
        }
      });
    },
    getSrsDatas() {
      let params = {};
      this.axios.post(`${API.index.srsServer_list}`, params).then(result => {
        if (result.code === 20000) {
          this.srsDatas = result.result.list.map(r => {
            return {
              value: r.id,
              label: r.name
            };
          });
        }
      });
    },
    rowSelect(selection, row) {
      this.selection = selection;
    },
    rowClick(item, index) {
      this.newObj = item;
      this.showAddNew = true;
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
</style>
