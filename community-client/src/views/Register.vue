<template>
  <div class="register" :style="{ height: bodyHeight + 'px' }">
    <div class="content">
      <mu-container>
        <mu-text-field
          v-model="username"
          label="用户"
        ></mu-text-field>
        <br>
        <mu-text-field
          v-model="password"
          label="密码"
        :action-icon="visibility ? ':iconfont icon-mimaxianshi' : ':iconfont icon-mima-yincang'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"
        ></mu-text-field>
        <mu-select label="身份" v-model="type">
        <mu-option v-for="option in options" :key="option" :label="option" :value="option"></mu-option>
      </mu-select>
        <div class="login-btn" @click="register">注册</div>
        <div class="go-register" @click="goLogin">去登录</div>
        <br>
      </mu-container>
    </div>
  </div>
</template>

<script>
import {reqRegister} from '../api/index'
export default {
  name: "",
  data() {
    return {
     username: "",
      password: "",
      type: "",//用户类型 老师或者学生
      options: ["学生","老师"],
       bodyHeight: '',
      visibility: false
    };
  },
  methods: {
      goLogin() {
          this.$router.push({name: 'login'})
      },
     async register() {
        if(!this.username) {
           this.$alert("请输入用户名");
           return
        }
        let reg = /^[\w_-]{6,16}$/
        if(!reg.test(this.password)) {
          this.$alert("密码长度在6-16位,不能含中文");
           return
        }
        if(!this.type) {
            this.$alert("请选择身份");
           return
        }
        const username = this.username.trim()
        const password = this.password.trim()
        const type = this.type === "学生"?"student":"teacher"
        const result = await reqRegister({username,password,type})
        //console.log(result)
        //this.$toast.success("haha")
        if(result.data.code === 200) {
            this.$toast.success(result.data.message);
            this.$router.push("/login");
        }else {
            this.$toast.error(result.data.message);
        }
      }
  },
  mounted () {
    this.bodyHeight=document.documentElement.clientHeight
  }
};
</script>

<style lang = 'stylus' scoped>
.register
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