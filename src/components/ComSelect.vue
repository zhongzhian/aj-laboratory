<template>
  <!-- <Dropdown placement="bottom-end" trigger="click" @on-click="selectClick">
    <Button class="coms-select-btn" :class="{'textleft':textLeft}" type="primary">{{selectName}}</Button>
    <Icon class="coms-select-icon" type="ios-arrow-down"></Icon>
    <DropdownMenu class="coms-select-menu" slot="list">
      <DropdownItem
        v-for="sd in selectDatas"
        v-model="selectValue"
        :key="sd.value"
        :name="sd.value"
        :class="{'active':selectValue === sd.value,'textleft':textLeft}"
      >{{sd.name}}</DropdownItem>
    </DropdownMenu>
  </Dropdown>-->
  <Select
    :class="{'textleft':textLeft,'color-blue':true}"
    :disabled="isdisabled"
    v-model="selectValue"
    @on-change="selectClick"
    placeholder="请选择"
    size="small"
    :style="{'width':cswidth?cswidth:'200px'}"
  >
    <Option v-for="item in selectDatas" :value="item" :key="item">{{ item }}</Option>
  </Select>
</template>

<script>
export default {
  props: ["selectDatas", "selectValue", "textLeft", "cswidth", "isdisabled"],
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
      // console.log(name);
      // this.selectValue = name;
      this.$emit("coms-select-change", name);
    }
  }
};
</script>
<style>
.ivu-select-placeholder {
  color: #50b5ec !important;
}
.ivu-icon.ivu-icon-ios-arrow-down.ivu-select-arrow {
  color: #50b5ec !important;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.textleft {
  text-align: left;
}
.color-blue {
  color: #50b5ec;
}
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
    // margin-left: -20px;
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
</style>
