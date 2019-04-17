<template>
  <div class="login" :style="{ height: bodyHeight + 'px' }">
    <div class="content">
      <mu-container>
        <mu-text-field v-model="username" label="用户"></mu-text-field>
        <br>
        <mu-text-field 
        v-model="password" 
        label="密码"
        :action-icon="visibility ? ':iconfont icon-mimaxianshi' : ':iconfont icon-mima-yincang'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"
        ></mu-text-field>
        <br>
        <div class="login-btn" @click="login">登录</div>
        <div class="go-register" @click="goRegister">去注册</div>
        <br>
      </mu-container>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import { reqLogin } from "../api/index";
export default {
  name: "",
  data() {
    return {
      username: "",
      password: "",
      bodyHeight: '',
      visibility: false
    };
  },
  methods: {
    goRegister() {
      this.$router.push({ name: "register" });
    },
    async login() {
      //去掉用户名和密码左右空格
      if (!this.username || !this.password) {
        this.$alert("账号或密码不能为空", "提示");
        return;
      }
      const username = this.username.trim();
      const password = this.password.trim();

      const result = await reqLogin({ username, password });
      //console.log(result)
      if (result.data.code === 200) {
        const { token } = result.data;
        //存到本地
        localStorage.setItem("eleToken", token);
        //解析token
        const decoded = jwt_decode(token);
        //console.log(decoded);
        //将解析后的token存到vuex中
        this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded));
        this.$store.dispatch("setUser", decoded);
        //登录成功后跳转到主页面
        this.$router.push("/me");
      }
    },
    isEmpty(value) {
      //判断为空
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  },
  mounted () {
    this.bodyHeight=document.documentElement.clientHeight
  }
};
</script>

<style lang = 'stylus' scoped>
.login
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  background-image url(../assets/images/bg.jpg)
  background-size 100% 100%
  background-position center center
  .content
    width 80%
    margin 2rem auto 1rem
    text-align center
    .container
      display flex
      justify-content center
      align-items center
      flex-direction column
      .login-btn
        width 80%
        height 1.2rem
        border 1px solid #2196f3
        color #2196f3
        line-height 1.2rem
        text-align center
        border-radius 1.2rem
        font-size 0.4rem
      .go-register
        color #2196f3
        margin-top 1rem
        font-size 0.4rem
</style>