<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
    <Nav v-show="!$route.meta.hiddenNav"/>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Nav from "./components/Nav";
export default {
  components: {
    Nav
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    chatMsg() {
      return this.$store.getters.chatMsg
    }
  },
  //刷新时保存数据在vuex
  created() {
    if (localStorage.eleToken) {
      const decoded = jwt_decode(localStorage.eleToken);
      this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded));
      this.$store.dispatch("setUser", decoded);
      //请求用户聊天信息
      this.$store.dispatch("reqMsgList",this.user.id)
      //请求群聊信息 保存到vuex
      this.$store.dispatch("reqGroupChat")
  }
  },
  mounted () {
    this.$store.dispatch("reqMsgList",this.user.id);
    //请求总的未读消息
      this.$store.dispatch("receiveMsgList",{chatMsg: this.chatMsg,userId: this.user.id})
  },
  methods: {
    isEmpty(value) {
      //判断为空
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style lang="stylus">
#app
  width 100%
  height 100%
  .v-enter
    opacity 0
    transform translateX(100%)
  .v-leave-to
    opacity 0
    transform translateX(-100%)
    position absolute
  .v-enter-active, .v-leave-active
    transition all 0.5s ease
</style>