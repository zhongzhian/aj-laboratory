// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import iView from "iview";
import store from "./store";
// import './styles/lab/index.less'
import "./styles/light/index.less";
import VueI18n from "vue-i18n";
import messages from "./locale";
import axios from "axios";
import VueAxios from "vue-axios";
import BTable from "./components/table/BTable.vue";
import FTable from "./components/table/FTable.vue";
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueI18n);
Vue.use(VueAxios, axios);
Vue.component("BTable", BTable);
Vue.component("FTable", FTable);
// Vue.use(Antd)

// import PDFJS from "vue-pdf"

// import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
// import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry';
// PDFJS.workerSrc = workerSrc;

var PDFJS = require('pdfjs-dist/es5/build/pdf.js');

// if (typeof window !== 'undefined' && 'Worker' in window && navigator.appVersion.indexOf('MSIE 10') === -1) {

//   var PdfjsWorker = require('worker-loader!pdfjs-dist/es5/build/pdf.worker.js');
//   PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker();
// }
var PdfjsWorker = require('worker-loader!pdfjs-dist/es5/build/pdf.worker.js');
PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker();
// let PDFJS = require('pdfjs-dist');
// import * as PDFJS = require(".utils/pdf.js");
window.PDFJS = PDFJS;
import wsjs from "./utils/reconnecting-websocket";
window._ = require("lodash");
window.anime = require("animejs");
window.E = require("wangeditor");
window.wsjs = wsjs;

const i18n = new VueI18n({
  locale: "zh-CN",
  messages
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  render: h => h(App)
});
