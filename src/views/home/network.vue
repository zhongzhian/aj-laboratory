<template>
  <div>
    <!-- banner -->
    <div class="layout-row">
      <!-- <div class="banner-mask"></div> -->
      <div class="layout-content">
        <div class="search-main" style="padding:20px 40px;">
          <div v-if="network" class="search-main-left">
            <div class="anchor">
              <a href="#youxiaolianjiewangzhi"></a>
              <div class="network-title">有效链接网址</div>
              <div class="network-content">
                <div>（1）{{ network.server_host }}</div>
                <div>（2）{{ network.use_brower }}</div>
              </div>
            </div>
            <div class="anchor">
              <a href="#wangluotiaojianyaoqiu"></a>
              <div class="network-title">网络条件要求</div>
              <div class="network-content">
                <pre>
（1）说明客户端到服务器的带宽要求
      基于公有云服务器部署的系统，{{
                    network.wangluotiaojian_yaoqiu.gongyouyun
                  }}
      基于局域网服务器部署的系统，{{ network.wangluotiaojian_yaoqiu.siyouyun }}
（2）说明能够支持的同时在线人数
      {{
                    network.neirong_zhichi
                  }}支持120个学生同时在线并发访问和请求，远程控制按硬件数量支持学生同时在线并发访问。
                </pre>
              </div>
            </div>
            <div class="anchor">
              <a href="#yonghucaozuoxitongyaoqiu"></a>
              <div class="network-title">用户操作系统要求</div>
              <div class="network-content">
                <div>
                  （1）计算机操作系统和版本要求：{{
                    network.caozuoxitong_yaoqiu.xitong_banben
                  }}
                </div>
                <div>
                  （2）其他计算终端操作系统和版本要求：{{
                    network.caozuoxitong_yaoqiu.qita_xitong_banben
                  }}
                </div>
                <div>
                  （3）支持移动端：{{
                    network.caozuoxitong_yaoqiu.zhichi_yidongduan
                  }}
                </div>
              </div>
            </div>
            <div class="anchor">
              <a href="#yonghufeicaozuoxitongyaoqiu"></a>
              <div class="network-title">用户硬件配置要求</div>
              <div class="network-content">
                <div>（1）计算机硬件配置要求</div>
                <div class="network-content-detail">
                  <Row>
                    <Col span="12">
                      <div>软件配置需求（最低）</div>
                      <div>
                        操作系统：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu
                            .xitong_banben
                        }}
                      </div>
                      <div>
                        浏览器：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu.liulanqi
                        }}
                      </div>
                      <div>配件配置需求（最低）</div>
                      <div>
                        处理器：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu.chuliqi
                        }}
                      </div>
                      <div>
                        内存：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu.neicun
                        }}
                      </div>
                      <div>
                        硬盘空间：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu
                            .yingpankongjian
                        }}
                      </div>
                      <div>
                        显卡：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu.xianka
                        }}
                      </div>
                      <div>
                        显示器：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu
                            .xianshiqi
                        }}
                      </div>
                      <div>
                        网速：{{
                          network.yingjian_yaoqiu.jisuanji.zuidi_yaoqiu.wangsu
                        }}
                      </div>
                    </Col>
                    <Col span="12">
                      <div>软件配置需求（推荐）</div>
                      <div>
                        操作系统：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu
                            .xitong_banben
                        }}
                      </div>
                      <div>
                        浏览器：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu
                            .liulanqi
                        }}
                      </div>
                      <div>配件配置需求（推荐）</div>
                      <div>
                        处理器：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu
                            .chuliqi
                        }}
                      </div>
                      <div>
                        内存：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu.neicun
                        }}
                      </div>
                      <div>
                        硬盘空间：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu
                            .yingpankongjian
                        }}
                      </div>
                      <div>
                        显卡：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu.xianka
                        }}
                      </div>
                      <div>
                        显示器：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu
                            .xianshiqi
                        }}
                      </div>
                      <div>
                        网速：{{
                          network.yingjian_yaoqiu.jisuanji.tuijian_yaoqiu.wangsu
                        }}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>（2）其他计算终端硬件配置要求</div>
                <div class="network-content-detail">
                  {{ network.yingjian_yaoqiu.qita }}
                </div>
              </div>
            </div>
            <div class="anchor">
              <a href="#yonghuyingjianpeizhiyaoqiu"></a>
              <div class="network-title">用户外置硬件要求</div>
              <div class="network-content">
                <div>（1）计算机外置硬件要求</div>
                <div class="network-content-detail">
                  {{ network.waizhi_yaoqiu.jisuanji }}
                </div>
                <div>（2）其他计算终端外置硬件要求</div>
                <div class="network-content-detail">
                  {{ network.waizhi_yaoqiu.qitazhongduan }}
                </div>
              </div>
            </div>
          </div>
          <div class="search-main-right" style="padding:10px;">
            <!-- <Anchor @on-select="selectAnchor" show-ink offset-top="100">
              <AnchorLink href="#youxiaolianjiewangzhi" title="有效链接网址" />
              <AnchorLink href="#wangluotiaojianyaoqiu" title="网络条件要求" />
              <AnchorLink
                href="#yonghucaozuoxitongyaoqiu"
                title="用户操作系统要求"
              />
              <AnchorLink
                href="#yonghufeicaozuoxitongyaoqiu"
                title="用户非操作系统要求"
              />
              <AnchorLink
                href="#yonghuyingjianpeizhiyaoqiu"
                title="用户硬件配置要求"
              />
              <AnchorLink
                href="#yonghuteshuwaizhiyingjianpeizhiyao"
                title="用户特殊外置硬件配置要求"
              />
            </Anchor> -->
            <div class="search-main-right-title">为您推荐的课程</div>
            <div
              :key="item"
              v-for="(item, index) in courseDatas2"
              @click="itemClick(item)"
              class="search-main-right-listitem"
            >
              <div class="search-main-right-listitem-img">
                <img :src="item.mainImg" />
              </div>
              <p
                style="font-size: 14px;margin-top: 10px;line-height: 15px;font-weight: 500;"
              >
                {{ item.name }}
              </p>
              <p style="font-size:8px;color:#ccc">{{ item.teacherName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";
// import network from "@/static/doc/network.json";
export default {
  data() {
    return {
      nopersonPath: "static/images/noperson.png",
      textEllipsis: "-webkit-box-orient: vertical;",
      networkPath: API.uploadPath + "/remoteLaboratory/static/doc/network.json",
      network: null,
      value1: 0,
      courseDatas: [],
      courseDatas2: [],
      searchText: "",
      pageData: {
        total: 0,
        current: 1,
        pageSize: 5
      }
    };
  },
  mounted() {
    let searchText = this.$route.query.text;
    console.log("searchText", searchText);
    if (searchText) {
      this.searchText = searchText;
    }
    this.getTableDatas();
    this.getTableDatas2();

    this.axios.get(this.networkPath, null).then(result => {
      console.log("result", result);
      this.network = result;
      // this.network = {
      //   server_host: "写实际本地服务器网址",
      //   use_brower: "推荐使用Chrome浏览器",
      //   wangluotiaojian_yaoqiu: {
      //     gongyouyun: "公有云：*M-*M带宽",
      //     siyouyun: "私有云：*M-*M带宽"
      //   },
      //   neirong_zhichi: "仿真内容",
      //   caozuoxitong_yaoqiu: {
      //     xitong_banben: "Windows7及以上（把位加上）",
      //     qita_xitong_banben: "无",
      //     zhichi_yidongduan: "否"
      //   },
      //   yingjian_yaoqiu: {
      //     jisuanji: {
      //       zuidi_yaoqiu: {
      //         xitong_banben: "Windows7及以上（把位加上）",
      //         liulanqi: "IE6.0以上",
      //         chuliqi: "Intel 2GHz及以上",
      //         neicun: "2GB 及以上",
      //         yingpankongjian: "40G",
      //         xianka: "分辨率1024x768像素网络：1000Mbps以太网卡",
      //         wangluo: "1000Mbps以太网卡",
      //         xianshiqi: "14英寸以上",
      //         wangsu: "1M以上"
      //       },
      //       tuijian_yaoqiu: {
      //         xitong_banben: "Windows7及以上（把位加上）",
      //         liulanqi: "IE8.0",
      //         chuliqi: "Intel 2.2GHz",
      //         neicun: "2GB",
      //         yingpankongjian: "80G",
      //         xianka: "分辨率1280x1024",
      //         wangluo: "1000Mbps以太网卡",
      //         xianshiqi: "14英寸以上",
      //         wangsu: "2M"
      //       }
      //     },
      //     qita: "无"
      //   },
      //   waizhi_yaoqiu: {
      //     jisuanji: "无",
      //     qitazhongduan: "无"
      //   }
      // };
    });
  },
  methods: {
    selectAnchor(link) {
      console.log("selectAnchor", link);
      return false;
    },
    itemClick(item) {
      this.$router.push({
        name: "home-course",
        query: {
          id: item.id
        }
      });
    },
    getTableDatas() {
      let params = {
        page: this.pageData.current - 1,
        pageSize: this.pageData.pageSize,
        searchParas: {
          conditions: [
            {
              name: "userType",
              op: "eq",
              type: "string",
              value: "2"
            }
          ],
          logic: "and"
        }
        // sortDirection: "string",
        // sortProperties: "string"
      };
      this.axios.post(`${API.index.teacher_list}`, params).then(result => {
        if (result.code === 20000) {
          this.pageData.total = result.result.totalNum;
          this.courseDatas = result.result.list;
        }
      });
    },
    getTableDatas2() {
      let params = {
        page: 0,
        pageSize: 5,
        searchParas: {
          conditions: [
            {
              name: "status",
              op: "eq",
              type: "int",
              value: 1
            },
            {
              name: "isDeleted",
              op: "eq",
              type: "boolean",
              value: false
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.course_list}`, params).then(result => {
        if (result.code === 20000) {
          this.courseDatas2 = result.result.list;
        }
      });
    },
    currentChange(v) {
      this.pageData.current = v;
      console.log("page", v);
      this.getTableDatas();
    }
  }
};
</script>
<style>
.network-content-detail {
  padding: 20px 50px;
}

.search-main-left-page .ivu-page-item {
  border: none !important;
}
.search-main-left-page .ivu-page-prev,
.search-main-left-page .ivu-page-next {
  border: none !important;
}
.ivu-anchor {
  position: relative;
  padding-left: 2px;
}
.ivu-anchor-wrapper {
  overflow: auto;
  padding-left: 4px;
  margin-left: -4px;
}
.ivu-anchor-ink {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
}
.ivu-anchor-ink:before {
  content: " ";
  position: relative;
  width: 2px;
  height: 100%;
  display: block;
  background-color: #e8eaec;
  margin: 0 auto;
}
.ivu-anchor-ink-ball {
  display: inline-block;
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #2d8cf0;
  background-color: #fff;
  left: 50%;
  -webkit-transition: top 0.2s ease-in-out;
  transition: top 0.2s ease-in-out;
  -webkit-transform: translate(-50%, 2px);
  -ms-transform: translate(-50%, 2px);
  transform: translate(-50%, 2px);
}
.ivu-anchor.fixed .ivu-anchor-ink .ivu-anchor-ink-ball {
  display: none;
}
.ivu-anchor-link {
  padding: 8px 0 8px 16px;
  line-height: 1;
}
.ivu-anchor-link-title {
  display: block;
  position: relative;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  color: #515a6e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.ivu-anchor-link-title:only-child {
  margin-bottom: 0;
}
.ivu-anchor-link-active > .ivu-anchor-link-title {
  color: #2d8cf0;
}
.ivu-anchor-link .ivu-anchor-link {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>

<style lang="less" scoped>
.network-title {
  font-size: 22px;
  font-weight: 800;
  color: #222;
  padding: 10px;
  text-align: center;
}
.network-content {
  // font-size: 14px;
  font-size: 16px;
  color: #666;
  padding: 20px;
}
.teacher-listitem-img {
  // width: 150px;
  // height: 150px;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 50%;
  // cursor: pointer;
  font-size: 100px;
  line-height: 100px;
  margin: 0 20px;
}

.search-result-word {
  padding: 20px 0px 10px;
  font-size: 14px;
  color: #666;
}
.search-switch-span {
  cursor: pointer;
}
.search-main {
  position: relative;
}
.search-main-left {
  position: relative;
  width: 930px;
}
.search-main-right {
  position: absolute;
  top: 10px;
  bottom: 20px;
  right: 30px;
  width: 200px;
  overflow: auto;
}
.search-main-left-listitem {
  position: relative;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  // height: 175px;
}
.search-main-left-listitem-img {
  position: absolute;
  width: 266px;
  height: 100px;
  top: 10px;
  left: 0;
  bottom: 10px;
  cursor: pointer;
  z-index: 1;
}
.search-main-left-listitem-img-title {
  position: absolute;
  top: 25px;
  right: 0;
  left: 0;
  padding-left: 160px;
  text-align: left;
  font-size: 18px;
}
.search-main-left-listitem-img-desc {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  padding-left: 160px;
  text-align: left;
  font-size: 12px;
}
.search-main-left-listitem-img img {
  width: 100%;
  height: 100%;
}
.search-main-left-listitem-content {
  padding: 10px 10px 10px 280px;
  position: relative;
  height: 100px;
}
.search-main-left-listitem-content-nump {
  font-size: 10px;
  color: #999;
  bottom: 5px;
  position: absolute;
  left: 280px;
}
.search-main-left-page {
  margin: 30px 0;
  background: #f1f2f3;
  padding: 10px;
  text-align: center;
}
.search-main-right-title {
  border-left: 3px solid rgb(112, 172, 31);
  // margin-bottom: 10px;
  line-height: 16px;
  padding: 0 5px;
  font-size: 16px;
}
.search-main-right-listitem {
  margin-top: 20px;
}
.search-main-right-listitem-img {
  width: 100%;
  height: 100px;
  cursor: pointer;
}
.search-main-right-listitem-img img {
  width: 100%;
  height: 100%;
}
</style>
