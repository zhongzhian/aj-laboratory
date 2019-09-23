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
      ></f-table> -->
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
      title="Srs"
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
              <FormItem label="端口" prop="port" label-position="top">
                <Input v-model="newObj.port" size="small" placeholder="请输入端口" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="rtmp端口" prop="rtmpPort" label-position="top">
                <Input v-model="newObj.rtmpPort" size="small" placeholder="请输入端口" />
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
              <FormItem label="url" prop="url" label-position="top">
                <Input v-model="newObj.url" size="small" placeholder="请输入url" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="文件保留时间" prop="fileKeepTime" label-position="top">
                <Input v-model="newObj.fileKeepTime" size="small" placeholder="请输入文件保留时间(天)" />
              </FormItem>
            </Col>
            <Col span="12">
            </Col>
          </Row>
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
        <p>确定删除所选srs服务吗？</p>
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
          title: "文件保留时间(天)",
          key: "fileKeepTime"
        },
        {
          title: "端口",
          key: "port"
        },
        {
          title: "rtmp端口",
          key: "rtmpPort"
        },
        {
          title: "唯一标识",
          key: "uniqueKey"
        },
        {
          title: "url",
          key: "url"
        }
      ],
      data1: [],
      selection: [],
      showAddNew: false,
      showDelete: false,
      newObj: {
        name: "",
        ip: "",
        port: "",
        rtmpPort: "",
        uniqueKey: "",
        url: "",
        fileKeepTime:0
      },
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        // dataType: [
        //   { required: true, message: "请选择数据类型", trigger: "change" }
        // ],
        // type: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getTableDatas();
  },
  methods: {
    currentChange(v) {
      console.log("v", v);
      this.pageData1.current = v;
      this.getTableDatas();
    },
    getTableDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize
      };
      this.axios.post(`${API.index.srsServer_list}`, params).then(result => {
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
            case "editValidate":
              _this.editItem();
              break;
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showAddNew = false;
    },
    delItem() {
      if (this.selection.length < 1) {
        this.$Message.error("请先选择要删除的srs服务");
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
        url: API.index.srsServer,
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
        ip: "",
        port: "",
        rtmpPort: "",
        uniqueKey: "",
        url: "",
        fileKeepTime:0
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
        url: API.index.srsServer,
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
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
</style>
