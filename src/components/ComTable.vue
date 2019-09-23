<template>
  <Table stripe height="300" :columns="alarmColumns" :data="alarmData"></Table>
</template>

<script>
export default {
  props: ["selectDatas", "selectValue", "selectName", "textLeft"],
  data() {
    return {
      // textLeft: false,
      // selectDatas: [
      //   {
      //     name: "驴打滚",
      //     value: "1"
      //   },
      //   {
      //     name: "炸酱面",
      //     value: "2"
      //   },
      //   {
      //     name: "冰糖葫芦",
      //     value: "3"
      //   },
      //   {
      //     name: "北京烤鸭",
      //     value: "4"
      //   }
      // ],
      // selectIndex: 0,
      // selectValue: "1",
      // selectName: "驴打滚"
    };
  },
  methods: {
    selectClick(name) {
      // this.selectValue = name;
      // let aa = _.find(this.selectDatas, function(d) {
      //   return d.value === name;
      // });
      // this.selectName = aa.name;
      this.$emit("coms-select-change", name);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.coms-select {
  &-btn {
    background-color: #161941;
    border: 1px solid #2a6893;
    font-size: 12px;
    color: #50b5ecc;
    border-radius: 2px;
    padding: 4px 8px;
    width: 200px;
    font-weight: 700;
    padding-right: 40px;
  }
  &-btn.textleft {
    text-align: left;
  }
  &-icon {
    font-size: 18px;
    color: #50b5ecc;
    margin-left: -24px;
    vertical-align: middle;
    font-weight: 700;
  }
  &-menu {
    width: 198px;
    left: 0;
    background-color: #161941;
    li {
      border-top: solid 1px #2a6893;
      color: #ccc;
      padding-right: 40px;
    }
    li.textleft {
      text-align: left;
    }
    li.active {
      background-color: #29517e;
    }
  }
}
.ivu-select-dropdown {
  margin: -1px 5px;
  border-radius: 0;
  border: 1px solid #2a6893;
  background-color: #161941;
}
</style>
