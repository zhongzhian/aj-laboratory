<template>
  <div class="notice-content">
    <div v-if="courseInfo.experimentStarted" class="notice-content-left" style="right:20px;">
      <div class="normal-tabs">
        <div class="normal-tabs-header">
          <div @click="tabindex = '1'" class="normal-tabs-header-title" :class="tabindex === '1' ? 'active' : ''">
            仿真实验
          </div>
          <div @click="tabindex = '2'" class="normal-tabs-header-title" :class="tabindex === '2' ? 'active' : ''">
            在线实验
          </div>
          <div @click="tabindex = '3'" class="normal-tabs-header-title" :class="tabindex === '3' ? 'active' : ''">
            信号观测
          </div>
        </div>
        <div v-show="tabindex === '1'" class="normal-tabs-content">
          <template v-if="simulationList.length>0">
            <div v-if="!simulationObj">
              <div class="lab-orderchoose-div">
                <div @click="simulationObj = item" v-for="(item, key) in simulationList" :key="key"
                  class="lab-orderchoose-day" style="text-align: center;border: 1px solid #ccc;cursor:pointer;">
                  <img :src="item.picture" height="150" style="width: 100%;" />
                  <p>{{ item.name }}</p>
                </div>
              </div>
            </div>
            <template v-else>
              <div class="iframe-close-div">
                <Icon class="iframe-close-icon" @click.stop="simulationObj = null" type="ios-undo" />
              </div>
              <iframe :src="simulationObj.pageUrl" width="100%" height="100%" style="background: #f1f2f3;"
                frameborder="0"></iframe>
            </template>
          </template>
          <template v-else>
            暂时没有仿真实验
          </template>
        </div>
        <div v-show="tabindex === '2'" class="normal-tabs-content">
          <div v-if="hasDevice">
            <p>已预约实验</p>
            <p>课程：{{ myDevice.courseName }}</p>
            <p>实验名称：{{ myDevice.experimenteName }}</p>
            <p>设备：{{ myDevice.deviceName }}</p>
            <p>设备号：{{ myDevice.resourceClass }}</p>
            <p>时间：{{ myDevice.startTime }} - {{ myDevice.endTime }}</p>
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
                <div v-for="(item, key) in orderDatas" :key="key" class="lab-orderchoose-day">
                  <p>{{ key }}</p>
                  <div class="lab-orderchoose-content">
                    <span class="lab-device-order-span" :class="{
                        active: chooseOrderId === item2.id,
                        disabled: item2.isDisabled
                      }" @click="orderClick(item2)" :disabled="item2.isDisabled" v-for="(item2, key2) in item"
                      :key="key2">{{ key2 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="tabindex === '3'" class="normal-tabs-content">
          <div v-show="!wsObj">
            <div v-if="data3.length === 0">暂时没有信号观测实验</div>
            <div v-else>
              <div v-for="(item, key) in data3" :key="key" class="lab-orderchoose-day lab-tab3-item">
                <img v-if="item.picture" :src="item.picture" class="form-user-img lab-tab3-item-img" />
                <img v-if="!item.picture" src="static/images/noperson.png" class="form-user-img lab-tab3-item-img" />
                <div class="lab-tab3-item-main">
                  <p class="lab-tab3-item-main-title">
                    {{ item.experimenteName }}
                  </p>
                  <p>{{ item.deviceName }}</p>
                </div>
                <div class="lab-tab3-item-toolbar">
                  <Button v-for="(channel, ckey) in item.signalChannelList" :key="ckey" type="info"
                    @click="wsInit(item, channel)" class="lab-tab3-item-toolbar-btn" ghost>
                    <span>{{
                      channel.channelId + ":" + channel.dataType
                    }}</span>
                    <Icon style="margin-left:5px;" type="ios-play" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div v-show="wsObj" style="width:100%;height:100%;">
            <div class="iframe-close-div" style="z-index:1;">
              <Icon class="iframe-close-icon" @click.stop="doClose" type="ios-undo" />
            </div>
            <div style="width:100%;height:100%;">
              <!-- v-show="wstype === 'AI'" -->
              <div v-show="wstype === 'AI'" id="myChart" style="width:1200px;height:400px;"></div>
              <!-- v-show="wstype === 'DI'" -->
              <div v-show="wstype === 'DI'" class="di-div">
                <div v-for="(item, key) in diData" :key="key" :class="{
                    'di-div-item': true,
                    'di-div-item0': item === '0',
                    'di-div-item1': item === '1'
                  }"></div>
              </div>
              <!-- v-show="wstype != 'AI' && wstype != 'DI'" -->
              <div v-show="wstype != 'AI' && wstype != 'DI'" class="spi-div">
                <div v-for="(item, key) in textData" :key="key" class="spi-div-item">
                  <div class="spi-div-item-preword">{{ preword }}</div>
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!courseInfo.experimentStarted" class="notice-content-left"
      style="right:20px;padding:20px;font-size:20px;">
      本课程未暂时未开放实验
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
        courseInfo: {
          experimentStarted: false
        },
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
        columns1: [{
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
          }
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
        columns2: [{
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
          }
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
        orderDatas: {},
        data3: [],
        ws: null,
        wsObj: null,
        wstype: "",
        myChart: null,
        diData: ["0", "0", "0", "0", "0", "0", "0", "0"],
        preword: "->",
        textData: []
      };
    },
    mounted() {
      this.userInfo = this.$store.getters.user;
      let courseId = this.$route.query.id;
      if (courseId) {
        this.courseId = courseId;
        this.getCourse();
      }
    },
    beforeDestroy() {
      this.ws.close();
      this.ws = null;
    },
    methods: {
      setChart(obj) {
        let xdata = [],
          ydata = [],
          xlength = 1024,
          title = "";
        if (obj) {
          let {
            t0,
            type,
            dataSet
          } = obj[0];
          ydata = dataSet;
          // title = type + " " + new Date(t0).toDateString;
        }

        if (!this.myChart) {
          var dom = document.getElementById("myChart");
          // var myChartp = document.getElementById("myChartp");
          // console.log(myChartp.style.width);
          // dom.style.width = myChartp.innerWidth + "px";
          this.myChart = echarts.init(dom);
        }
        if (ydata && ydata.length > 0) {
          xlength = ydata.length;
          for (var i = 0; i < xlength; i++) {
            xdata.push(i + 1 + "/" + xlength);
            ydata.push(ydata[i]);
          }
        } else {
          for (var i = 0; i < xlength; i++) {
            xdata.push(i + 1 + "/" + xlength);
            ydata.push("0");
          }
        }
        let option = {
          title: {
            text: title,
            show: title
          },
          // grid: {
          //   left: 0,
          //   right: 0,
          //   top: 0,
          //   bottom: 0
          // },
          xAxis: {
            type: "category",
            data: xdata,
            show: false
          },
          yAxis: {
            type: "value"
          },
          series: [{
            data: ydata,
            type: "line"
          }]
        };
        this.myChart.setOption(option);
      },
      doSent(device, channel) {
        this.wsObj = [{
          index: channel.channelId,
          type: channel.dataType,
          elvisId: device.relationKey
        }];
        console.log("params", this.wsObj);
        this.wstype = channel.dataType;
        this.ws.send(JSON.stringify(this.wsObj));
        this.setChart();
      },
      doClose() {
        this.resetWs();
        this.ws.close();
      },
      orderDevice() {
        this.axios
          .post(
            `${API.index.deviceOrder}` + this.courseId + "/" + this.chooseOrderId,
            null
          )
          .then(result => {
            if (result.code === 20000) {
              this.myDevice = result.result;
              this.hasDevice = true;
            }
          });
      },
      orderClick(item) {
        if (!item.isDisabled) {
          this.chooseOrderId = item.id;
        }
      },
      wsInit(device, channel) {
        this.resetWs();
        this.ws = wsjs.getWebSocket(`${API.wsPath}`);
        let _this = this;

        // this.ws.send(JSON.stringify(obj));

        this.ws.onopen = function(event) {
          console.log("webSocket链接已打开...");
          _this.doSent(device, channel);
        };

        //websocket连接错误回调函数
        this.ws.onerror = function(event) {
          console.log("webSocket链接失败...event");
          console.log(JSON.stringify(event));
        };

        //websocket连接关闭回调函数
        this.ws.onclose = function(event) {
          console.log("webSocket链接关闭...event");
          console.log(JSON.stringify(event));
        };

        //websocket收到后台消息回调函数
        this.ws.onmessage = function(event) {
          let data = null;
          let datastr = event.data;
          console.log(event);
          if (datastr && datastr != "connection success") {
            let dataobj = JSON.parse(datastr);
            if (dataobj) {
              _this.setChart(dataobj);
            }
          }
        };
      },
      resetWs() {
        this.wsObj = null;
        this.wstype = "";
        this.myChart = null;
        this.diData = ["0", "0", "0", "0", "0", "0", "0", "0"];
        this.textData = [
          "asdfdsafdasf",
          "this.userInfo = this.$store.getters.user;this.userInfo = this.$store.getters.user;this.userInfo = this.$store.getters.user;this.userInfo = this.$store.getters.user;this.userInfo = this.$store.getters.user;",
          "this.getSimulationDatas();"
        ];
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
            conditions: [{
                name: "courseId",
                op: "eq",
                type: "int",
                value: this.courseId
              }
              // {
              //   name: "type",
              //   op: "eq",
              //   type: "int",
              //   value: 1
              // }
            ],
            logic: "and"
          }
        };
        this.axios.post(`${API.index.courseDevice_list}`, params).then(result => {
          if (result.code === 20000) {
            this.data1 = result.result.list
              .filter(d => d.type === 1)
              .map(d => {
                let typeStr = d.type === 1 ? "在线实验设备" : "实时数据设备";
                return {
                  ...d,
                  typeStr: typeStr
                };
              });
            this.data3 = result.result.list.filter(d => d.type === 2);
            if (this.data3.length > 0) {
              this.wsInit();
            }
          }
        });
      },
      getSimulationDatas() {
        let params = {
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
            conditions: [{
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
              o.isDisabled = o.status === 1;
              if (!orderDatas[odate]) {
                orderDatas[odate] = {};
              }
              orderDatas[odate][duration] = o;
            });
            console.log("orderDatas", orderDatas);
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
      },
      getCourse() {
        this.axios
          .get(`${API.index.course + "/"}` + this.courseId)
          .then(result => {
            if (result.code === 20000) {
              this.courseInfo = result.result;
              if (this.courseInfo.experimentStarted) {
                this.getTableDatas();
                this.getSimulationDatas();
              }
            }
          });
      }
    }
  };
</script>
<style></style>

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

  .lab-device-order-span.disabled:hover {
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

  .lab-tab3-item {
    border: 1px solid #70ac1f;
    width: 300px;
    position: relative;
    border-radius: 5px;

    &-img {
      position: absolute;
      left: 10px;
      top: 10px;
    }

    &-main {
      padding: 10px 10px 10px 80px;

      & p {
        text-align: left;
        background: #fff;
      }

      &-title {
        line-height: 20px;
        color: #70ac1f;
        font-weight: 500;
        font-size: 14px;
      }
    }

    &-toolbar {
      padding: 10px;

      &-btn {
        background: #70ac1f;
        border-color: #70ac1f;
        // background: transparent;
        // color: #70ac1f;
        margin-bottom: 2px;
      }
    }
  }

  .di-div {
    text-align: center;

    &-item {
      width: 50px;
      height: 50px;
      display: inline-block;
      border: 1px solid #222;
      border-radius: 50%;
      margin: 20px;
    }

    &-item1 {
      background: red;
    }

    &-item0 {
      background: #70ac1f;
    }
  }

  .spi-div {
    text-align: left;
    padding: 20px;
    background: #242424;
    color: #70ac1f;
    min-height: 300px;

    &-item {
      line-height: 22px;
      font-size: 14px;
      position: relative;
      padding-left: 20px;

      &-preword {
        position: absolute;
        left: 0;
      }
    }
  }
</style>
