<template>
  <div>
    <Table :height="height" :data="dataSource" :columns="columns" :highlight-row="highlightRow" :size="size"
      @on-row-click="onRowClick" @on-row-dblclick="onRowDbClick" @on-sort-change="onSortChange"
      @on-selection-change="onSelect" />
    <div class="hyz-page">
      <Page :total="pageData.total" :current="pageData.current" :page-size="pageData.pageSize" show-elevator show-total
        :show-sizer="showSize" :page-size-opts="sizeOpts" size="small" placement="top" @on-change="currentChange"
        @on-page-size-change="pageSizeChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sizeOpts: [10, 20, 50, 100]
      }
    },
    props: [
      "dataSource",
      "columns",
      "pageData",
      "highlightRow",
      "useHand",
      "size",
      "pageSize",
      "height"
    ],
    computed: {
      showSize() {
        // return true;
        if (!this.pageSize) {
          return true;
        } else {
          return false;
        }
      },
      tableHeight() {
        if (this.height) return this.height;

        if (this.data.length >= 10) {
          return window.innerHeight < 750 ? 450 : 521;
        } else {
          return "";
        }
      }
    },
    methods: {
      currentChange(v) {
        this.pageData.current = v;
        this.$emit("page-data-change", v);
      },
      pageSizeChange(v) {
        this.pageData.pageSize = v;
        this.$emit("page-size-change", v);
      },
      onSortChange(column, key, order) {
        this.$emit("on-sort-change", column, key, order);
      },
      onRowDbClick(v) {
        this.$emit("on-row-dblclick", v);
      },
      onRowClick(v) {
        this.$emit("on-row-click", v);
      },
      onSelect(selection, row) {
        this.$emit("on-select", selection, row);
      },
      rowClassName() {
        return "use-hand";
      },
      empty() {
        return "";
      }
    }
  };
</script>
<style lang="less">
  .hyz-page {
    margin: 10px 20px;
    display: flex;
    justify-content: flex-end;
    color: #50b5ec;
  }

  .hyz-page .ivu-select {
    position: relative;
  }

  .ivu-table .use-hand td {
    cursor: pointer;
  }

  .ivu-table-header {
    // background-color: #212b4b;
    // color: #50b5ec;
    color: #70ac1f;
  }

  // .ivu-table-body {
  //   color: #ccc;
  // }
  .ivu-table {
    // background-color: rgba(33, 41, 72, 0.5);
    background-color: #f1f2f3;
  }

  .ivu-page.mini .ivu-page-total {
    position: absolute;
    left: 20px;
    color: #70ac1f !important;
  }

  .ivu-page.mini .ivu-page-options-elevator {
    color: #70ac1f !important;
  }

  .ivu-page.mini .ivu-page-item {
    margin: 0 3px;
    background-color: transparent;
    // border: 1px solid #2a6893;
    border: 1px solid #70ac1f;
  }

  .ivu-page.mini .ivu-page-prev,
  .ivu-page.mini .ivu-page-next {
    background-color: transparent;
    margin: 0 5px;
    // color: #50b5ec !important;
    color: #70ac1f !important;
  }

  // .ivu-page-disabled a{
  //   color: #50b5ec;
  // }
  .ivu-icon-ios-arrow-left:before {
    // content: "\F33F";
    // color: #03a9f4;
    color: #70ac1f;
    font-size: 20px;
    vertical-align: middle;
  }

  .ivu-icon-ios-arrow-right:before {
    // content: "\F341";
    // color: #03a9f4;
    color: #70ac1f;
    font-size: 20px;
    vertical-align: middle;
  }

  .ivu-icon-ios-arrow-forward:before,
  .ivu-icon-ios-arrow-back:before {
    // color: #03a9f4;
    color: #70ac1f;
  }

  // .ivu-page-item-active {
  //   background-color: #03a9f4 !important;
  //   border: 1px solid #03a9f4 !important;
  // }
  .ivu-page.mini .ivu-page-options-elevator input {
    // background-color: #161941;
    // color: #50b5ec;
    background-color: #f1f2f3;
    color: #70ac1f;
    border-radius: 2px;
    border: 0;
  }
</style>
