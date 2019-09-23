<template>
  <div>
    <!-- <app-header :showType="showType" @show-panel="onShowPanel"></app-header> -->
    <transition>
 <!-- style="padding: 20px 10px;" -->
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
// import AppHeader from '@/components/layout/AppHeader';
// import HeaderMenu from '@/components/layout/HeaderMenu';
export default {
  // components: {AppHeader,HeaderMenu},
  data() {
    return {
      showType: ''
    }
  },
  methods: {
    onShowPanel(v) {
      this.showType = this.showType == v ? '' : v
    }
  },
  computed: {
    key() {
      // console.log("this.$route", this.$route);
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  }
}
</script>

<style lang="less" scoped>
</style>

