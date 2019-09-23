<template>
  <div>
    <div class="table-condition-btnbar">
      <div class="notice-content-left-title">实验预约情况</div>
    </div>
    <div v-if="myDevice" class="lab-device-div">
      <div class="lab-device-div-header">
        <p>设备：{{myDevice.deviceName}}</p>
        <p>时间：{{myDevice.startTime}} - {{myDevice.endTime}}</p>
        <p v-if="errorMsg">{{errorMsg}}</p>
        <div v-if="(!isStart)&&(!errorMsg)">
          <Button @click="startGame" size="small" class="condition-btn">开始实验</Button>
        </div>
      </div>
      <div v-if="isStart" class="lab-device-div-content">
        <div class="iframe-close-div">
          <Icon
            v-show="isShowVideo"
            class="iframe-close-icon"
            @click.stop="hiddenVideo"
            type="ios-pause"
          />
          <Icon
            v-show="!isShowVideo"
            class="iframe-close-icon"
            @click.stop="showVideo"
            type="ios-play"
          />
        </div>
        <iframe
          :src="myDeviceDetail.pageUrl"
          width="100%"
          height="100%"
          style="background: #f1f2f3;"
          frameborder="0"
        ></iframe>

        <div
          v-show="isShowVideo"
          class="lab-device-video-div"
          @mousedown="move"
          :style="'left:'+positionX+'px;top:'+positionY+'px;'"
        >
          <div class="lab-device-video-title">
            实验视频
            <Icon
              style="color:#fff;float:right;margin-top: 10px;cursor:pointer;"
              @click.stop="hiddenVideo"
              type="close"
            />
          </div>
          <div class="lab-device-video-content">
            <video
              id="example_video_1"
              width="100%"
              height="300"
              name="videoElement"
              class="centeredVideo"
              controls
              autoplay
              muted
            >Your browser is too old which doesn't support HTML5 video.</video>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="lab-device-div-header">
        <p>目前没有预约</p>
      </div>
    </div>

    <!-- <Modal
      v-model="isStart"
      draggable
      title="实验视频"
      :transfer="true"
      :mask-closable="false"
      :closable="false"
      footer-hide="true"
    >
      <div class="lab-device-video-div">
        <video
          id="example_video_1"
          width="100%"
          height="300"
          name="videoElement"
          class="centeredVideo"
          controls
          autoplay
          muted
        >Your browser is too old which doesn't support HTML5 video.</video>
      </div>
    </Modal>-->
  </div>
</template>

<script>
import API from "@/api";
import dateformat from "@/utils/dateformat.js";

export default {
  data() {
    return {
      headers: null,
      myDevice: null,
      myDeviceDetail: null,
      isStart: false,
      isShowVideo: true,
      errorMsg: "",
      video: null,
      player: null,
      positionX: 50,
      positionY: 20
    };
  },
  mounted() {
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    this.getTableDatas();
  },
  methods: {
    startGame() {
      this.isStart = true;
      this.$nextTick(() => {
        this.createVideo();
      });
    },
    hiddenVideo() {
      this.isShowVideo = false;
      // this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    },
    showVideo() {
      this.isShowVideo = true;
      // this.player.play();
      this.createVideo();
    },
    move(e) {
      let odiv = window.screen; //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.screenX - this.positionX;
      let disY = e.screenY - this.positionY;
      document.onmousemove = eee => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = eee.screenX - disX;
        let top = eee.screenY - disY;
        if (left < 0) {
          left = 0;
        }
        if (top < 0) {
          top = 0;
        }
        if (left > odiv.width - 420) {
          left = odiv.width - 420;
        }
        if (top > odiv.height - 355) {
          top = odiv.height - 355;
        }

        //绑定元素位置到positionX和positionY上面
        this.positionX = left;
        this.positionY = top;
      };
      document.onmouseup = eeeee => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    createVideo() {
      if (flvjs.isSupported()) {
        var mediaDataSource = {
          type: "flv",
          isLive: true,
          hasAudio: false,
          hasVideo: true,
          // url: "https://turbo.linkme8.cn:33000/srs1/live/3ef9e64741a74061a59c34eb1de87165.flv"
          url: this.myDeviceDetail.camera.srsUrl
        };
      }

      this.flv_load_mds(mediaDataSource);
    },
    flv_load_mds(mediaDataSource) {
      var element = document.getElementById("example_video_1");
      var player = this.player;
      if (typeof this.player !== "undefined") {
        if (this.player != null) {
          this.player.unload();
          this.player.detachMediaElement();
          this.player.destroy();
          this.player = null;
        }
      }
      this.player = flvjs.createPlayer(mediaDataSource, {
        enableWorker: false,
        enableStashBuffer: false,
        stashInitialSize: 128,
        headers: this.headers
      });
      this.player.attachMediaElement(element);
      this.player.load();
      console.log("this.player", this.player);
    },
    getOrderDetail() {
      this.axios
        .get(`${API.index.deviceOrder_getDetail}` + this.myDevice.id)
        .then(result => {
          if (result.code === 20000) {
            this.errorMsg = "";
            this.myDeviceDetail = result.result;
            // this.createVideo();
          } else if (result.code === 40010) {
            this.errorMsg = "抱歉,您的预约还未到时间或已过期";
          }
        });
    },
    getTableDatas() {
      this.axios.get(`${API.index.deviceOrder_getmy}`).then(result => {
        if (result.code === 20000) {
          this.myDevice = result.result;
          this.getOrderDetail();
        }
      });
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.lab-device-div {
  position: absolute;
  top: 50px;
  left: 25px;
  right: 25px;
  bottom: 15px;
}
.lab-device-div-header {
  height: 60px;
  line-height: 20px;
  padding: 10px 0;
}
.lab-device-div-content {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
}
.lab-device-div-content video {
  height: 100%;
  width: 100%;
}
.lab-device-video-div {
  position: fixed;
  width: 420px;
  height: 255px;
  // left: 20px;
  // top: 50px;
  padding: 10px;
  padding-top: 0px;
  background: #222;
  color: #fff;
  cursor: move;
  z-index: 901;
}
.lab-device-video-title {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  padding: 0 10px;
}
.lab-device-video-content {
  height: 205px;
  background: #000;
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
