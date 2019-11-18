<template>
  <div style="overflow:auto;height:100%;width:100%;">
    <div class="layout-row">
      <div class="layout-content2" style="padding:30px;">
        <!-- <Tabs value="name1">
        <TabPane label="日志保留时间" name="name1">
          
        </TabPane>
        <TabPane label="设备预约可提前天数" name="name2">标签二的内容</TabPane>
        <TabPane label="设备开放时间-开始时间" name="name3">标签三的内容</TabPane>
        <TabPane label="设备开放时间-结束时间" name="name4">标签三的内容</TabPane>
        <TabPane label="设备周末是否开放" name="name5">标签三的内容</TabPane>
        <TabPane label="首页轮播图片" name="name6">标签三的内容</TabPane>
        </Tabs>-->

        <Form ref="formValidate" :model="formValidate" :label-width="200">
          <FormItem label="日志保留时间">
            <!-- <Input v-model="settings['logRetainTime']" type="number" placeholder="值为正整数，单位: 天"></Input> -->
            <InputNumber
              :max="180"
              :min="1"
              v-model="settings['logRetainTime']"
              placeholder="值为正整数，单位: 天"
            ></InputNumber>
            <Button type="primary" @click="handleSubmit('logRetainTime')">设置</Button>
          </FormItem>
          <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('logRetainTime')">设置</Button>
          </FormItem>-->

          <FormItem label="设备预约可提前天数">
            <InputNumber
              :max="15"
              :min="5"
              v-model="settings['deviceOrderTime']"
              placeholder="值为正整数，单位: 天"
            ></InputNumber>
            <Button type="primary" @click="handleSubmit('deviceOrderTime')">设置</Button>
          </FormItem>
          <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('deviceOrderTime')">设置</Button>
          </FormItem>-->

          <FormItem label="设备开放时间-开始时间">
            <InputNumber
              :max="24"
              :min="1"
              v-model="settings['deviceOpenTimeStart']"
              placeholder="值为整点小时"
            ></InputNumber>
            <Button type="primary" @click="handleSubmit('deviceOpenTimeStart')">设置</Button>
          </FormItem>
          <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('deviceOpenTimeStart')">设置</Button>
          </FormItem>-->

          <FormItem label="设备开放时间-结束时间">
            <InputNumber
              :max="24"
              :min="1"
              v-model="settings['deviceOpenTimeEnd']"
              placeholder="值为整点小时"
            ></InputNumber>
            <Button type="primary" @click="handleSubmit('deviceOpenTimeEnd')">设置</Button>
          </FormItem>
          <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('deviceOpenTimeEnd')">设置</Button>
          </FormItem>-->

          <FormItem label="设备周末是否开放">
            <!-- <Select v-model="settings['deviceOpenWeekend']" placeholder="0-不开放 1-开放">
              <Option value="0">不开放</Option>
              <Option value="1">开放</Option>
            </Select>-->
            <RadioGroup v-model="settings['deviceOpenWeekend']">
              <Radio true-value="0" false-value="1" label="不开放"></Radio>
              <Radio true-value="1" false-value="0" label="开放"></Radio>
            </RadioGroup>
            <Button type="primary" @click="handleSubmit('deviceOpenWeekend')">设置</Button>
          </FormItem>
          <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('deviceOpenWeekend')">设置</Button>
          </FormItem>-->

          <FormItem label="首页轮播图片">
            <div class="demo-upload-list" :key="item" v-for="item in homePhotoList">
              <img :src="item.url" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleHomePhotoRemove(item)"></Icon>
              </div>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="showChoosePhoto">选择图片</Button>
            <Button type="primary" @click="handleSubmit('homePageImages')">设置</Button>
          </FormItem>

          <FormItem label="首页底部轮播图片">
            <div class="demo-upload-list" :key="item" v-for="item in homeBottomPhotoList">
              <img :src="item.url" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleHomeBottomPhotoRemove(item)"></Icon>
              </div>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="showChooseBottomPhoto">选择图片</Button>
            <Button type="primary" @click="handleSubmit('homePageBottomImages')">设置</Button>
          </FormItem>
        </Form>
      </div>
    </div>

    <Drawer
      title="选择图片"
      v-model="showPhotos"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form>
          <FormItem label="图片库">
            <div class="demo-upload-div">
              <div class="demo-upload-list2" :key="item" v-for="(item,index) in uploadList">
                <img :src="item.url" />
                <div class="demo-upload-list-checkdiv">
                  <Checkbox @on-change="picSelect(item)" v-model="item.selected">{{item.name}}</Checkbox>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="当前选中">
            <div class="demo-upload-list" :key="item" v-for="item in selectedPhotoList">
              <img :src="item.url" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleSelectedRemove(item)"></Icon>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showPhotos = false">取消</Button>
        <Button type="primary" @click="selectSubmit">确定</Button>
      </div>
    </Drawer>

    <Drawer
      title="选择图片"
      v-model="showBottomPhotos"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form>
          <FormItem label="图片库">
            <div class="demo-upload-div">
              <div class="demo-upload-list2" :key="item" v-for="(item,index) in uploadBottomList">
                <img :src="item.url" />
                <div class="demo-upload-list-checkdiv">
                  <Checkbox @on-change="picSelectBottom(item)" v-model="item.selected">{{item.name}}</Checkbox>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="当前选中">
            <div class="demo-upload-list" :key="item" v-for="item in selectedBottomPhotoList">
              <img :src="item.url" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleSelectedBottomRemove(item)"></Icon>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showBottomPhotos = false">取消</Button>
        <Button type="primary" @click="selectBottomSubmit">确定</Button>
      </div>
    </Drawer>

    <Modal title="图片" v-model="visible" width="732">
      <div style="text-align:center;width:700px;">
        <img :src="imgName" v-if="visible" style="max-width: 700px;max-height:500px;" />
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
        name: ""
      },
      showPhotos: false,
      showBottomPhotos: false,

      defaultList: [],
      selectedPhotoList: [],
      selectedBottomPhotoList: [],
      homePhotoList: [],
      homeBottomPhotoList: [],
      imgName: "",
      visible: false,
      uploadList: [],
      uploadBottomList: [],
      settings: {},
      formValidate: {}
    };
  },
  mounted() {
    this.getTableDatas();
    // this.getPhotoDatas();
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
  },
  methods: {
    handleView(item) {
      this.imgName = item.url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    getTableDatas() {
      let params = {},
        _this = this;
      this.axios.post(`${API.index.sysSetting_list}`, params).then(result => {
        if (result.code === 20000) {
          _this.settings = result.result.list;
          result.result.list.forEach(r => {
            if (r.keyName === "homePageImages") {
              _this.homePhotoList = JSON.parse(r.value);
            }
            if (r.keyName === "homePageBottomImages") {
              _this.homeBottomPhotoList = JSON.parse(r.value);
            }
            if (r.keyName === "deviceOpenWeekend") {
              r.value = r.value === "1" ? "开放" : "不开放";
            }
            _this.settings[r.keyName] = r.value;
          });
          this.selectedPhotoList = [...this.homePhotoList];
          this.selectedBottomPhotoList = [...this.homeBottomPhotoList];
          console.log("this.selectedPhotoList", this.selectedPhotoList);
          console.log(
            "this.selectedBottomPhotoList",
            this.selectedBottomPhotoList
          );
          this.getPhotoDatas();
        }
      });
    },
    getPhotoDatas() {
      let params = {},
        _this = this;
      this.axios.post(`${API.index.upload_mylist}`, params).then(result => {
        if (result.code === 20000) {
          this.uploadList = result.result.list.map(p => {
            let splits = p.uploadFileName.split("|");
            let path = splits[1] ? splits[1] : splits[0];
            p.url = _this.picBasePath + path;
            let isSelect =
              _.findIndex(this.selectedPhotoList, { id: p.id }) != -1;
            p.selected = isSelect;
            return p;
          });
          console.log("this.uploadList", this.uploadList);
          this.uploadBottomList = result.result.list.map(p => {
            let splits = p.uploadFileName.split("|");
            let path = splits[1] ? splits[1] : splits[0];
            p.url = _this.picBasePath + path;
            let isSelect =
              _.findIndex(this.selectedBottomPhotoList, { id: p.id }) != -1;
            p.selected = isSelect;
            return p;
          });
          console.log("this.uploadBottomList", this.uploadBottomList);
        }
      });
    },
    handleHomePhotoRemove(file) {
      this.homePhotoList.splice(this.homePhotoList.indexOf(file), 1);
    },
    handleSelectedRemove(file) {
      this.selectedPhotoList.splice(this.selectedPhotoList.indexOf(file), 1);
    },
    showChoosePhoto() {
      this.showPhotos = true;
      // this.uploadList = this.$refs.upload.fileList;
      this.selectedPhotoList = this.homePhotoList;
    },
    picSelect(item) {
      console.log("item", item);
      // item.selected = !item.selected;
      this.updateSelect();
    },
    updateSelect() {
      this.selectedPhotoList = _.filter(this.uploadList, "selected");
    },
    selectSubmit() {
      this.homePhotoList = this.selectedPhotoList;
      this.showPhotos = false;
    },

    // 底部
    handleHomeBottomPhotoRemove(file) {
      this.homeBottomPhotoList.splice(
        this.homeBottomPhotoList.indexOf(file),
        1
      );
    },
    handleSelectedBottomRemove(file) {
      this.selectedBottomPhotoList.splice(
        this.selectedBottomPhotoList.indexOf(file),
        1
      );
    },
    showChooseBottomPhoto() {
      this.showBottomPhotos = true;
      // this.uploadList = this.$refs.upload.fileList;
      this.selectedBottomPhotoList = this.homeBottomPhotoList;
    },
    picSelectBottom(item) {
      console.log("item", item);
      // item.selected = !item.selected;
      this.updateSelectBottom();
    },
    updateSelectBottom() {
      this.selectedBottomPhotoList = _.filter(this.uploadList, "selected");
    },
    selectBottomSubmit() {
      this.homeBottomPhotoList = this.selectedBottomPhotoList;
      this.showBottomPhotos = false;
    },
    handleSubmit(name) {
      if (name === "homePageImages") {
        this.settings[name] = JSON.stringify(
          // this.homePhotoList.map(p => p.url)
          this.homePhotoList
        );
        console.log("homePageImages", this.settings[name]);
      }
      if (name === "homePageBottomImages") {
        this.settings[name] = JSON.stringify(
          // this.homePhotoList.map(p => p.url)
          this.homeBottomPhotoList
        );
        console.log("homePageBottomImages", this.settings[name]);
      } else if (name === "deviceOpenWeekend") {
        this.settings[name] = this.settings[name] === "开放" ? "1" : "0";
        console.log("deviceOpenWeekend", this.settings[name]);
      }

      let params = {
        keyName: name,
        value: this.settings[name]
      };
      this.axios({
        method: "put",
        url: API.index.sysSetting,
        data: params,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.$Message.success("设置成功");
            this.settings[name] = result.result.value;
          }
        })
        .catch(err => {
          this.$Message.error("设置失败");
        });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.demo-upload-div {
  position: relative;
  padding: 10px 0 0 10px;
  max-height: 300px;
  overflow-y: auto;
}
.demo-upload-list2 {
  float: left;
  height: 130px;
  margin: 0 10px 10px 0;
  text-align: center;
  border: 1px solid transparent;
}
.demo-upload-list2 img {
  // width: 100%;
  height: 100px;
}
.demo-upload-list-checkdiv {
  text-align: center;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.alarmDetail-modal {
  .btns {
    margin-bottom: 20px;
    line-height: 50px;
    text-align: center;
    .ivu-btn.ivu-btn-primary {
      border-radius: 1px;
      height: 28px;
      line-height: 28px;
      padding: 0 15px;
      margin-left: 30px;
    }
  }
  .description {
    padding: 15px 25px;
    textarea {
      height: 120px;
      background-color: #161941;
    }
  }
  .ivu-input {
    border: 1px solid rgba(143, 205, 240, 0.25);
    height: 28px;
    background-color: #161941;
    color: #50b5ec;
    border-radius: 1px;
  }
  .table-title {
    height: 50px;
    text-align: left;
    padding-left: 25px;
    border-top: solid 1px rgba(143, 205, 240, 0.25);
    border-bottom: solid 1px rgba(143, 205, 240, 0.25);
    background-color: #1a2440;
    line-height: 50px;
  }
  .table-content {
    background-color: #1a2440;
    margin-bottom: 20px;
    border-bottom: solid 1px rgba(143, 205, 240, 0.25);
    .ivu-row {
      text-align: left;
      line-height: 40px;
      label {
        display: inline-block;
        width: 150px;
        text-align: right;
      }
    }
    .device {
      text-align: center;
      label {
        width: auto;
        padding-left: 8px;
      }
      .ivu-col {
        padding: 10px 0;
      }
    }
    .ivu-row > .ivu-col > span,
    .ivu-row.device > .ivu-col > p > span {
      display: inline-block;
      width: 150px;
      text-align: left;
      color: #50b5ec;
    }
    .ivu-row.device > .ivu-col > p {
      display: inline-block;
      background-color: #161941;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(1) {
      width: auto;
      min-width: 40px;
    }
    .ivu-row.device > .ivu-col > p > span:nth-of-type(2) {
      width: 100px;
      padding-right: 8px;
    }
    .ivu-row.desc {
      label {
        float: left;
      }
      span {
        width: 50%;
        line-height: 20px;
        padding-top: 10px;
      }
    }
  }
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  z-index: 98;
  padding: 20px 15%;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.6;
    z-index: 99;
  }
  .normal-panel-content {
    background-color: rgba(33, 41, 72);
    height: 100%;
    z-index: 100;
    overflow: auto;
  }
  .normal-panel-title {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .ivu-icon {
      float: right;
      font-size: 20px;
      color: red;
      margin-top: 15px;
      cursor: pointer;
    }
  }
}
</style>
