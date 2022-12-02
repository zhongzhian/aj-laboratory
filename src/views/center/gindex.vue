<template>
  <div class="manage-layout">
    <!-- content -->
    <div class="manage-content">
      <div class="manage-content-left">
        <div class="manage-content-header-left">
          <!-- <img class="manage-header-img" src="static/images/logo1.png" /> -->
          <img class="manage-header-img" src="static/images/logo.jpg" />
        </div>
        <div class="manage-sider">
          <ul class="manage-sider-ul">
            <li
              @click="onMenuChanged(item)"
              v-for="(item,index) in manageMenu"
              :value="item"
              :key="index"
              :class="{'manage-sider':true,'active':(item.key === thiskey)}"
            >{{item.label}}</li>
            <!-- <li class="manage-sider">课程公告</li>
            <li class="manage-sider">评分标准</li>
            <li class="manage-sider active">进入课程</li>
            <li class="manage-sider">进入实验</li>
            <li class="manage-sider">测验与作业</li>
            <li class="manage-sider">讨论区</li>-->
          </ul>
        </div>
      </div>
      <div class="manage-content-right">
        <transition>
          <router-view :key="thiskey"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api";

// 开始使用 G2 绘制地图
var provinceChart = void 0;

// 当前聚焦的区域
var currentAreaNode = void 0;
export default {
  // props: ["key", "module"],
  data() {
    return {
      courseId: 0,
      courseInfo: null,
      manageMenu: [],
      pageData: {
        total: 10,
        current: 1,
        pageSize: 6
      }
    };
  },
  computed: {
    thiskey() {
      let key = this.$route.name !== undefined ? this.$route.name : this.$route;
      return key;
    },
    appMenus() {
      return this.$store.getters.appMenus;
    }
  },
  mounted() {
    // let courseId = this.$route.params.id;
    // if (courseId) {
    //   this.courseId = courseId;
    //   this.getCourse();
    // }

    let menus = [],
      tname = this.$route.name;

    (function ps(data, depth) {
      for (let v of data) {
        if (v.name === tname) {
          menus = data.map(d => {
            return {
              key: d.name,
              label: d.label
            };
          });
          return;
        }
        if (v.children && v.children.length > 0) {
          ps(v.children, depth + 1);
        }
      }
    })(this.appMenus, 0);
    // console.log("menus", menus);
    this.manageMenu = menus;
  },
  methods: {
    getCourse() {
      this.axios.get(`${API.index.course + "/" + courseId}`).then(result => {
        if (result.code === 20000) {
          this.courseInfo = result.result;
        }
      });
    },
    onMenuChanged: function(item) {
      if (item.key) {
        this.$router.push({ name: item.key });
      }
      // this.$router.push({ name: v });
      // this.$router.push('/'+this.module+'/'+v);
    },
    currentChange(v) {
      this.pageData.current = v;
      console.log("page", v);
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.manage-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.manage-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-bottom: 1px solid #ccc;
}

.manage-header-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 210px;
  padding: 10px 20px 10px 10px;
}
.manage-header-right {
  position: absolute;
  top: 10px;
  left: 210px;
  right: 0;
  bottom: 10px;
  border-left: 1px solid #ccc;
  padding: 0px 30px;
}
.manage-header-img {
  width: 100%;
  height: 100%;
}
.manage-header-title {
  font-size: 14px;
  font-weight: 600;
}
.manage-header-author {
  font-size: 12px;
}
.manage-content {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
}
.manage-content-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 210px;
  padding: 10px 5px;
  background: #f1f2f3;
}
.manage-content-header-left {
  padding: 10px 20px 10px 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 5px;
}
.manage-content-right {
  position: absolute;
  top: 0;
  left: 210px;
  right: 0;
  bottom: 0;
  padding: 15px 25px;
  border-left: 1px solid #ccc;
  // box-shadow: -10px 0px 10px red;
  overflow: auto;
}
.manage-content-img {
  width: 100%;
  height: 100px;
  border-radius: 5px;
}
.manage-sider {
  background: #fff;
}
.manage-sider-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.manage-sider-ul li {
  padding: 10px;
  line-height: 20px;
  font-size: 12px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.manage-sider-ul li.active {
  background: #70ac1f;
  color: #fff;
}
.manage-content-right-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
}
// .manage-content-right-content {
//   margin-top: 10px;
// }
// .manage-collapse-p {
//   line-height: 30px;
//   border-bottom: 2px #ccc dotted;
// }
</style>
