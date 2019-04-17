<template>
  <div class="group">
    <!-- 头部 -->
    <div class="title">
      <mu-appbar style="width: 100%;" color="primary">
        <mu-button icon slot="left" @click="back">
          <i class="iconfont icon-fanhui" style="font-size: 0.5rem;"></i>
        </mu-button>师生群聊
      </mu-appbar>
    </div>

    <!-- 聊天内容部分 -->
    <div class="chat-container" ref="chatContent">
      <div class="container">
        <div class="item" v-for="(item,index) in groupChat" :key="index">
          <div :class="item.userid === user.id ? 'right' : 'left' ">
            <div class="time">{{item.username}} </div>
            <div class="chat-msg">{{item.content}}</div>
            <div class="avatar"></div>
            <mu-avatar>
              <img :src="users[item.userid].avatar">
            </mu-avatar>
          </div>
        </div>
      </div>
    </div>
    <!-- 聊天输入部分 -->
    <div class="chat-input">
      <div class="chat-content">
        <div class="input" @keyup.enter="sendmess">
          <input type="text" v-model="chatValue">
        </div>
        <div class="biaoqing" @click.stop="showEmoji">
          <i class="iconfont icon-ziyuan"></i>
        </div>
        <mu-button raised color="primary" class="chat-button" @click="sendmess">发送</mu-button>
      </div>
    </div>

    <!-- 表情部分 -->
    <div ref="emoji">
      <emoji :getEmoji="getEmoji" ref="emoji" @sendEmoji="sendEmoji"/>
    </div>
  </div>
</template>

<script>
import emoji from "../components/Emoji";
export default {
  name: "",
  components: {
    emoji
  },
  data() {
    return {
      msg: "",
      getEmoji: false,
      chatValue: "",
    };
  },
  computed: {
      groupChat() {
          return this.$store.getters.groupChat
      },
      user() {
          return this.$store.getters.user
      },
      users() {
          return this.$store.getters.users
      },
  },
  methods: {
    back() {
      this.$router.back();
    },
    //表情框显示是否
    showEmoji() {
      this.getEmoji = !this.getEmoji;
    },
    hideEmoji(e) {
      if (!this.$refs.emoji.contains(e.target)) {
        this.getEmoji = false;
      }
    },
    //点击表情框表情
    sendEmoji(e) {
      //console.log(e)
      let target = e.target || e.srcElement;
      if (!!target && target.tagName.toLowerCase() === "span") {
        this.chatValue += target.innerHTML;
      }
      e.stopPropagation();
    },
    sendmess() {
        if (!this.chatValue) {
        this.$alert("不能没有任何输入");
        return;
      }
       this.$store.dispatch("groupMsg",{userid: this.user.id,username: this.user.username,content: this.chatValue});
       this.chatValue = ""
    }
  },
  mounted() {
    document.addEventListener("click", this.hideEmoji);
    this.$refs.chatContent.scrollTop = 20000;
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideEmoji);
  },
  watch: {
      groupChat() {
          this.$nextTick(() => {
        this.$refs.chatContent.scrollTop = 20000;
      });
      }
  }
};
</script>

<style lang = 'stylus' scoped>
.group
  width 100%
  height 100%
  /* position relative */
  .chat-input
    width 100%
    height 1.5rem
    position fixed
    bottom 0
    left 0
    background #f7f6fb
    border-top 1px solid #ddd
    display flex
    align-items center
  .chat-content
    width 100%
    display flex
    align-items center
    .input
      flex 1
      padding 0.18rem
      margin-left 2px
      input
        width 100%
        height 1rem
        box-sizing border-box
        border 1px solid #e8e7ea
        color #333333
        border-radius 0.1rem
        font-size 0.4rem
    .biaoqing
      margin-right 0.16rem
      i
        font-size 0.8rem
    .chat-button
      margin-right 0.1rem
      border-radius 0.1rem
  .chat-container
    width 100%
    position absolute
    top 56px
    bottom 1.5rem
    overflow-x hidden
    overflow-y scroll
    .container
      overflow hidden
      .item
        width 100%
        min-height 2.5rem
        margin-top 3px
        display flex
        align-items center
        position relative
        .right
          display flex
          justify-content flex-end
          width 100%
          height 100%
          .time
            position absolute
            right 0.1rem
            top 0rem
            overflow hidden
            text-overflow ellipsis
            white-space no-wrap
          .chat-msg
            background #a0e75a
            margin-right 0.5rem
            text-align center
            padding 0.32rem
            border-radius 0.2rem
            position relative
          .chat-msg::before
            content ''
            position absolute
            right -0.24rem
            top 0.2rem
            border-width 0.24rem
            border-color transparent transparent #a0e75a transparent
            border-style solid
          /* .avatar
          img
            width 1.2rem
            height 1.2rem
            border-radius 0.1rem */
        .left
          display flex
          justify-content flex-start
          .time
            position absolute
            left 0.1rem
            top 0
            overflow hidden
            text-overflow ellipsis
            white-space no-wrap
          .chat-msg
            background #bbdefb
            margin-left 0.5rem
            text-align center
            padding 0.3rem
            border-radius 0.2rem
            position relative
            order 2
          .chat-msg::before
            content ''
            position absolute
            left -0.24rem
            top 0.2rem
            border-width 0.24rem
            border-color transparent transparent #bbdefb transparent
            border-style solid
</style>