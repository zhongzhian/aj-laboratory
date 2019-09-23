<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="active" @on-select="changeMenu">
          <div class="layout-logo">
            <img className="Img" src="../../../static/logo.png" />
          </div>
          <template v-for="item in appmenuconfig">
            <MenuItem  v-if="!item.item" :key="item.id" :name="item.link">
              <!-- <Icon :type="item.icon" :key="item.id" ></Icon> -->
              {{ item.name }}
            </MenuItem>

            <Submenu v-if="item.item" :name="item.link" :key="item.name">
              <template slot="title">
                <!-- <Icon :type="item.icon"></Icon> -->
                <span class="layout-text">{{ item.name }}</span>
              </template>
              <template v-for="child in item.item">
                <MenuItem :name="child.link" :key="child.id">
                  <!-- <Icon :type="child.icon" :key="child.name"></Icon> -->
                  {{ child.name }}
                </MenuItem>
              </template>
            </Submenu>

          </template>

        </Menu>
      </Header>
      <Content >

        <transition>
          <router-view :key="key" style="padding: 20px 10px; display: inline"></router-view>
        </transition>

      </Content>
    </Layout>
  </div>
</template>
<script>
  import appmenuconfig from '../../utils/AppMenuConfig'
  console.log("#####",appmenuconfig.menu_level_one)
  export default {
    data(){
      return {
        appmenuconfig: appmenuconfig.menu_level_one,
        active:'home'
      }
    },
    methods: {
      changeMenu(active) {
        console.log(",,,,,,",active)
        //this.$emit("on-change", active);
        this.$router.push({name: active})
      }
    }
  }
</script>
<style scoped>
  .layout{
    /* border: 1px solid #d7dde4; */
    background: #151740;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    /* width: 100px;
    height: 30px; */
    float: left;
    position: relative;
    margin-top:5px;

  }
  .layout-nav{
    width: 100%;


  }

</style>
