<template>
  <!-- 底部tab切换 -->
  <div class="nav">
    <mu-paper>
      <mu-bottom-nav :value="bottomNav" color="#ff5252" @change="handleChange">
        <mu-bottom-nav-item value="home" title="主页" icon=":iconfont icon-zhuye" to="/"/>
        <!-- 这里的阿里巴巴图标要这样使用才有用（冒号别忘了） -->
        <mu-bottom-nav-item value="message" title="消息" icon=":iconfont icon-xiaoxi-copy" to="/message"/>
        <mu-bottom-nav-item value="me" title="我的" icon=":iconfont icon-wode" to="/me"/>
      </mu-bottom-nav>
    </mu-paper>
    <mu-badge v-show="unReadCount" class="badge" :content="String(unReadCount)" color="rgb(255, 64, 129)" :circle="true"></mu-badge>
  </div>
</template>

<script>
export default {
  name: "",
  computed: {
      //监听路由地址，让下面Nav不会刷新而不匹配
    bottomNav() {
      if (this.$route.path == "/home") {
        return "home";
      }
      if(this.$route.path == "/message") {
          return "message"
      }
      if (this.$route.path == "/me") {
        return "me";
      }
    },
    unReadCount() {
      return this.$store.getters.unReadCount
    }
  },
  methods: {
    handleChange(val) {
      this.bottomNav = val;
    }
  }
};
</script>

<style lang = 'stylus' scoped>
.nav
  width 100%
  position fixed
  bottom 0
  z-index 100
  border-top 1px solid #ccc
  .badge
    position absolute
    bottom 50%
    left 52%
</style>