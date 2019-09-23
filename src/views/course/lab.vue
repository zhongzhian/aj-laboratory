<template>
  <div class="notice-content">
    <div class="notice-content-left" style="right:20px;">
      <div class="normal-tabs">
        <div class="normal-tabs-header">
          <div
            @click="tabindex = '1'"
            class="normal-tabs-header-title"
            :class="tabindex === '1' ? 'active':''"
          >仿真实验</div>
          <div
            @click="tabindex = '2'"
            class="normal-tabs-header-title"
            :class="tabindex === '2' ? 'active':''"
          >在线实验</div>
          <div
            @click="tabindex = '3'"
            class="normal-tabs-header-title"
            :class="tabindex === '3' ? 'active':''"
          >信号观测</div>
        </div>
        <div v-show="tabindex === '1'" class="normal-tabs-content">
          <div v-if="!simulationObj">
            <div class="lab-orderchoose-div">
              <div
                @click="simulationObj = item"
                v-for="(item,key) in simulationList"
                :key="key"
                class="lab-orderchoose-day"
                style="text-align: center;border: 1px solid #ccc;cursor:pointer;"
              >
                <img :src="item.picture" height="150" style="width: 100%;" />
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
          <template v-else>
            <div class="iframe-close-div">
              <Icon class="iframe-close-icon" @click.stop="simulationObj = null" type="ios-undo" />
            </div>
            <iframe
              :src="simulationObj.pageUrl"
              width="100%"
              height="100%"
              style="background: #f1f2f3;"
              frameborder="0"
            ></iframe>
          </template>
        </div>
        <div v-show="tabindex === '2'" class="normal-tabs-content">
          <div v-if="hasDevice">
            <p>已预约实验</p>
            <p>设备：{{myDevice.deviceName}}</p>
            <p>时间：{{myDevice.startTime}} - {{myDevice.endTime}}</p>
            <div>
              <Button @click="gotoPage" size="small" class="condition-btn">我的预约</Button>
            </div>
          </div>
          <div v-else>
            <div v-show="showDeviceList">
              <f-table @on-row-click="rowClick" :columns="columns1" :dataSource="data1"></f-table>
            </div>
            <div v-show="!showDeviceList">
              <div class="table-condition-btnbar">
                <Button @click="showDeviceList = true" size="small" class="condition-btn">返回</Button>
                <Button @click="orderDevice" size="small" class="condition-btn">预约</Button>
              </div>
              <div class="lab-orderchoose-div">
                <div v-for="(item,key) in orderDatas" :key="key" class="lab-orderchoose-day">
                  <p>{{key}}</p>
                  <div class="lab-orderchoose-content">
                    <span
                      class="lab-device-order-span"
                      :class="{'active':(chooseOrderId === item2.id)}"
                      @click="orderClick(item2)"
                      :disabled="item2.status===1"
                      v-for="(item2,key2) in item"
                      :key="key2"
                    >{{key2}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="tabindex === '3'" class="normal-tabs-content">
          <div>暂时没有信号观测实验</div>
        </div>
      </div>
    </div>
    <!-- <div class="notice-content-right">
      <div class="notice-content-right-box">
        <p style="font-size:16px;line-height:30px;">即将到期</p>
        <p style="font-size:12px;color:#70ac1f;">非线性系统的描述单元测试</p>
        <p style="font-size:8px ;">截止提交时间：2019年07月14日 00:00</p>
      </div>
    </div>-->
  </div>
</template>

<script>
import API from "@/api";
export default {
  data() {
    return {
      tabindex: "1",
      courseId: 0,
      courseInfo: null,
      userInfo: null,
      hasDevice: true,
      myDevice: null,
      chooseDevice: null,
      showDeviceList: true,
      chooseOrderId: 0,
      // pageData1: {
      //   total: 0,
      //   current: 1,
      //   pageSize: 10
      // },
      simulationList: [],
      simulationObj: null,
      columns1: [
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
          key: "experimenteName"
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
        // {
        //   title: "页面url",
        //   key: "pageUrl"
        // },
        // {
        //   title: "关联的key",
        //   key: "relationKey"
        // }
      ],
      data1: [],
      columns2: [
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
          key: "experimenteName"
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
        // {
        //   title: "页面url",
        //   key: "pageUrl"
        // },
        // {
        //   title: "关联的key",
        //   key: "relationKey"
        // }
      ],
      data2: [],
      orderDatas: {}
    };
  },
  mounted() {
    this.userInfo = this.$store.getters.user;
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      this.getTableDatas();
      // this.getCourse();
      this.getSimulationDatas();
    }
  },
  methods: {
    orderDevice() {
      this.axios
        .post(`${API.index.deviceOrder}` + this.courseId + '/' + this.chooseOrderId, null)
        .then(result => {
          if (result.code === 20000) {
            this.myDevice = result.result;
            this.hasDevice = true;
          }
        });
    },
    orderClick(item) {
      this.chooseOrderId = item.id;
    },
    getTableDatas() {
      this.axios.get(`${API.index.deviceOrder_getmy}`).then(result => {
        if (result.code === 20000) {
          this.myDevice = result.result;
        } else {
          this.hasDevice = false;
          this.getCourseDeviceDatas();
        }
      });
    },
    currentChange(v) {
      this.pageData1.current = v;
      this.getTableDatas();
    },
    getCourseDeviceDatas() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            },
            {
              name: "type",
              op: "eq",
              type: "int",
              value: 1
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
        }
      });
    },
    getSimulationDatas() {
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
      this.axios.post(`${API.index.simulation_list}`, params).then(result => {
        if (result.code === 20000) {
          this.simulationList = result.result.list;
        }
      });
    },
    getDeviceOrderDatas() {
      var time = new Date()
        .toLocaleDateString()
        .split("/")
        .join("-");
      let params = {
        searchParas: {
          conditions: [
            {
              name: "deviceId",
              op: "eq",
              type: "int",
              value: this.chooseDevice.deviceId
            },
            {
              name: "startTime",
              op: "ge",
              type: "date",
              value: time + " 00:00:00"
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.deviceOrder_list}`, params).then(result => {
        if (result.code === 20000) {
          //   this.orderDatas = result.result.list;
          let orderDatas = {};
          result.result.list.forEach(o => {
            let odate = o.year + "-" + o.month + "-" + o.day;
            let duration = o.startHour + "-" + o.endHour;
            if (!orderDatas[odate]) {
              orderDatas[odate] = {};
            }
            orderDatas[odate][duration] = o;
          });
          this.orderDatas = orderDatas;
          this.showDeviceList = false;
        }
      });
    },
    gotoPage() {
      this.$router.push({
        name: "manage-center-device",
        query: {
          id: this.myDevice.id
        }
      });
    },
    rowClick(item, index) {
      this.chooseDevice = item;
      this.getDeviceOrderDatas();
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.normal-tabs {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.normal-tabs-header {
  height: 50px;
  // line-height: 50px;
  font-size: 14px;
  padding: 0px 16px;
  margin-right: 16px;
}
.normal-tabs-header-title {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 16px;
  cursor: pointer;
}
.normal-tabs-header-title.active {
  color: #70ac1f;
  border-bottom: solid 2px #70ac1f;
}
.normal-tabs-content {
  position: absolute;
  top: 50px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
}
// .lab-orderchoose-div{
//   position: absolute;
//   top: 55px;
//   left: 0px;
//   right: 0px;
//   bottom: 0px;
// }

.lab-orderchoose-day {
  float: left;
  width: 200px;
  min-height: 100px;
  margin: 0 10px 10px 0;
  padding: 5px;
}
.lab-orderchoose-day p {
  text-align: center;
  background: #d9ead6;
  line-height: 24px;
}

.lab-device-order-span {
  border: #fff 1px solid;
  padding: 2px 5px;
  margin: 5px 0 0 5px;
  cursor: pointer;
  float: left;
}
.lab-device-order-span:hover {
  border: #d9ead6 1px solid;
}
.lab-device-order-span.disabled {
  //   background: #f1f2f3;
  border: #fff 1px solid !important;
  cursor: default;
  color: #ccc;
}
.lab-device-order-span.active {
  border: #70ac1f 1px solid;
}
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
.iframe-close-div {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 50px;
  height: 50px;
  opacity: 0.5;
  background: #000;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
.iframe-close-icon {
  font-size: 30px;
  color: #fff;
}
</style>
