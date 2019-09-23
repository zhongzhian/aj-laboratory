<template>
  <div class="root">
    <Table
      :data="data"
      :columns="columns"
      :size="size"
      :height="height"
      @on-row-click="onRowClick"
      @on-sort-change="onSortChange"
      @on-row-dblclick="onRowDbClick"
      @on-selection-change="onSelect"
      :highlight-row="highlightRow"
    />
    <!-- <div class="hyz-page"> :height="tableHeight"
      <Page :total="total" :current="page" :page-size="pageSize" 
            show-sizer show-elevator show-total placement="top"
            @on-change="changePage"
            @on-page-size-change="pageSizeChange"	/>
    </div>-->

    <div class="hyz-page">
      <Page
        :total="total"
        :current="page"
        :page-size="pageSize"
        show-elevator
        show-total
        size="small"
        placement="top"
        @on-change="changePage"
        @on-page-size-change="pageSizeChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ["dataSource", "columns", "size", "highlightRow", "height"],
  data() {
    return {
      page: 1,
      pageSize: 10
    };
  },
  computed: {
    data() {
      let { page, pageSize, dataSource } = this;
      if ((this.page - 1) * pageSize >= dataSource.length) {
        this.page = Math.max(1, this.page - 1);
      }
      const start = (this.page - 1) * pageSize;
      const end = Math.min(
        this.page * pageSize,
        dataSource ? dataSource.length : 0
      );
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(dataSource[i]);
      }
      return result;
    },
    total() {
      return this.dataSource ? this.dataSource.length : 0;
    },
    // tableHeight() {
    //   if (this.height) return this.height;

    //   if (this.data.length >= 10) {
    //     return window.innerHeight < 750 ? 450 : 521;
    //   } else {
    //     return "";
    //   }
    // }
  },
  watch: {
    // dataSource() {
    //   this.page = 1
    //   this.pageSize = 10
    // }
  },
  methods: {
    changePage(v) {
      this.page = v;
    },
    pageSizeChange(v) {
      this.pageSize = v;
    },
    onRowClick(v) {
      this.$emit("on-row-click", v);
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column, key, order);
    },
    onRowDbClick(v) {
      this.$emit("on-row-dblclick", v);
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
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
.ivu-page.mini .ivu-page-options-elevator{
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