<template>
  <div class="me">
    <!-- 头部 -->
    <div class="header">
      <!-- 单独抽出来背景，不影响头像显示 -->
      <!-- 这里动态绑定的背景图 一定要用驼峰写法！！！！ -->
      <div class="bg bg-blur" :style="{backgroundImage: `url(${user.avatar})`}"></div>
      <div class="avatar">
        <mu-avatar size="75">
          <img :src="avatar" alt>
        </mu-avatar>
        <div class="name">{{username}}</div>
        <!-- 这里用token里面的数据必然有问题，后台修改了 你还是老数据！！ -->
        <!-- 所以要调用vuex改 -->
        <div class="info">{{info}}</div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list">
      <mu-paper>
        <mu-list>
          <mu-list-item button :ripple="false" @click="guanyu">
            <mu-list-item-action>
              <i class="iconfont icon-wode-guanyuwomen" style="font-size: 0.6rem;"></i>
            </mu-list-item-action>
            <mu-list-item-title>关于我们</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="updateInfo">
            <mu-list-item-action>
              <i class="iconfont icon-gerenxinxi3" style="font-size: 0.6rem;"></i>
            </mu-list-item-action>
            <mu-list-item-title>信息修改</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button :ripple="false" @click="updateAvatar">
            <mu-list-item-action>
              <i class="iconfont icon-touxiang" style="font-size: 0.6rem;"></i>
            </mu-list-item-action>
            <mu-list-item-title>头像修改</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-paper>
      <!-- 退出登录 -->
      <mu-button class="logout" color="primary" @click="logout">退出登录</mu-button>
    </div>
  </div>
</template>

<script>
import {reqUserInfo} from '../api/index'
export default {
  name: "",
  data () {
    return {
      username: '',
      info: '',
      avatar: ''
    }
  },
  methods: {
    logout() {
      this.$confirm("确认退出登录 ?", "提示").then(res => {
        //console.log(res.result)
        if (res.result) {
          //清除token,store和跳转页面
          localStorage.removeItem("eleToken");
          this.$store.dispatch("clearCurrentState");
          this.$router.push("/login");
        }
      });
    },
    guanyu() {
      this.$alert('感谢您的使用,欢迎随时撩我', 'Hi');
    },
    updateInfo() {
      this.$router.push({name: 'userinfo'})
    },
     updateAvatar() {
      this.$router.push({name: 'useravatar'})
    },
    async userInfo() {
                let result = await reqUserInfo()
                if(result.data.code === 200) {
                    this.username = result.data.message.username
                    this.avatar = result.data.message.avatar
                    this.info = result.data.message.info
                }
            }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  mounted () {
    this.userInfo()
    //会把message组件显示搞掉 我去！！！！！用了vuex修改user内容 会把message组件搞坏！！！
    //userInfo组件也一样 暂时先这样写着吧 有点问题
    //改为vuex 一进来就从数据库请求信息 并把信息给state(getters)的user
    // this.$store.dispatch("updateUserInfo")
     //请求用户聊天信息
      this.$store.dispatch("reqMsgList",this.user.id)
  }
};
</script>

<style lang = 'stylus' scoped>
.me
  width 100%
  height 100%
  .header
    width 100%
    height 5.4rem
    position relative
    .bg
      width 100%
      height 100%
    .bg-blur
      float left
      background-position center
      background-repeat no-repeat
      background-size cover
      -webkit-filter blur(9px)
      -moz-filter blur(9px)
      -o-filter blur(9px)
      -ms-filter blur(9px)
      filter blur(9px)
    .avatar
      text-align center
      font-size 0.6rem
      position absolute
      left 50%
      transform translate(-50%)
      top 1rem
      color #ffff
      .info
        font-size 0.4rem
  .list
    position relative
    .logout
      position absolute
      left 50%
      transform translate(-50%)
</style>