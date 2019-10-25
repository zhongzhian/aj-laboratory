<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">添加</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delItem" size="small" class="condition-btn">删除</Button>
      <Button @click="getTableDatas" size="small" class="condition-btn">刷新</Button>
    </div>
    <div>
      <f-table @on-select="rowSelect" :columns="columns1" :dataSource="data1"></f-table>
      <!-- <Table height="200" size="small" :columns="columns1" :data="data1" @on-select="rowSelect"></Table> -->
    </div>

    <Drawer
      title="设备列表"
      v-model="showAddNew"
      width="900"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <!-- <Table size="small" :columns="columns2" :data="data2" @on-select="rowSelect2"></Table> -->
        <!-- <f-table :columns="columns2" :data="data2" @on-select="rowSelect2"></f-table> -->
        <b-table
          @page-data-change="currentChange"
          :pageData="pageData1"
          @on-select="rowSelect2"
          :columns="columns2"
          :dataSource="data2"
        ></b-table>
      </div>
      <div class="demo-drawer-footer">
        <!-- <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="addSubmit">确定</Button>-->
        <Button type="primary" @click="showAddNew = false">收起</Button>
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
      courseId: 0,
      courseInfo: null,
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
          key: "deviceName"
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
          title: "实验名称",
          key: "experimenteName",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("input", {
              domProps: {
                value: params.row.experimenteName
              },
              class: "ivu-input ivu-input-small",
              on: {
                input: function(event) {
                  params.row.experimenteName = event.target.value;
                }
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.saveOne(params.row);
                    }
                  }
                },
                "保存"
              )
            ]);
          }
        }
      ],
      columns2: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
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
          title: "实验名称",
          key: "experimenteName",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("input", {
              domProps: {
                value: params.row.experimenteName
              },
              attrs: {
                disabled: params.row.isAdd
              },
              class: "ivu-input ivu-input-small",
              on: {
                input: function(event) {
                  params.row.experimenteName = event.target.value;
                }
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    disabled: params.row.isAdd
                  },
                  on: {
                    click: () => {
                      this.addOne(params.row);
                    }
                  }
                },
                "选取"
              )
            ]);
          }
        }
      ],
      data1: [],
      data2: [],
      selection: [],
      selection2: [],
      showAddNew: false,
      showDelete: false
    };
  },
  mounted() {
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getCourse();
      this.getTableDatas();
    }
  },
  methods: {
    currentChange(v) {
      this.pageData1.current = v;
      this.getAllDevicesDatas();
    },
    getAllDevicesDatas() {
      let params = {
        page: this.pageData1.current - 1,
        pageSize: this.pageData1.pageSize
      };
      this.axios.post(`${API.index.device_list}`, params).then(result => {
        if (result.code === 20000) {
          // let data2 = [];
          // for (var i = 0; i < 30; i++) {
          //   data2.push(result.result.list[0]);
          // }
          // this.data2 = data2;
          this.pageData1.total = result.result.totalNum;
          this.data2 = result.result.list.map(d => {
            let typeStr = d.type === 1 ? "在线实验设备" : "实时数据设备";
            let isAdd = false;
            let aaa = {
              courseId: 0,
              courseName: "",
              deviceId: d.id,
              deviceName: d.name,
              experimenteName: "",
              picture: d.picture,
              resourceClass: d.resourceClass,
              type: d.type
            };
            let row = this.data1.find(item => {
              return item.deviceId === d.id;
            });
            if (row) {
              aaa.experimenteName = row.experimenteName;
              isAdd = true;
            }
            return { ...aaa, typeStr: typeStr, isAdd: isAdd };
          });
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
      this.axios.post(`${API.index.courseDevice_list}`, params).then(result => {
        if (result.code === 20000) {
          this.data1 = result.result.list.map(d => {
            let typeStr = d.type === 1 ? "在线实验设备" : "实时数据设备";
            return { ...d, typeStr: typeStr };
          });
          this.getAllDevicesDatas();
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
        url: API.index.courseDevice,
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
      this.showAddNew = true;
    },
    saveOne(item) {
      item.courseId = this.courseId;
      item.courseName = this.courseInfo.name;
      this.axios({
        method: "put",
        url: API.index.courseDevice,
        data: item,
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
    addOne(item) {
      item.courseId = this.courseId;
      item.courseName = this.courseInfo.name;
      this.axios({
        method: "post",
        url: API.index.courseDevice,
        data: item,
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
    addSubmit() {
      if (this.selection2.length > 0) {
        let ids = this.selection2.map(s => s.id);
        let params = {
          courseId: this.courseId,
          deviceIds: ids
        };
        this.axios({
          method: "post",
          url: API.index.courseDevice_listadd,
          data: params,
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
      }
    },
    rowSelect(selection, row) {
      // console.log("selection",selection);
      this.selection = selection;
    },
    rowSelect2(selection, row) {
      // console.log("selection",selection);
      this.selection2 = selection;
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
          }
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
</style>
