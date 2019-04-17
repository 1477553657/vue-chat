<template>
  <div class="chat">
    <!-- 头部 -->
    <div class="title">
      <mu-appbar style="width: 100%;" color="primary">
        <mu-button icon slot="left" @click="back">
          <i class="iconfont icon-fanhui" style="font-size: 0.5rem;"></i>
        </mu-button>{{this.$route.params.name}}
        <mu-button flat slot="right" @click="openSimpleDialog">
          <i class="iconfont icon-renzhuanhuan" style="font-size: 0.6rem;"></i>
        </mu-button>
      </mu-appbar>
    </div>

    <!-- 聊天内容部分 -->
    <div class="chat-container" ref="chatContent">
      <div class="container">
        <div class="item" v-for="(item,index) in msg" :key="index">
          <div :class="item.from === user.id ? 'right' : 'left' ">
            <div class="time">{{item.create_time}} </div>
            <div class="chat-msg">{{item.content}}</div>
            <!-- <div class="avatar"></div> -->
            <mu-avatar>
              <img v-show="item.from === user.id" :src="user.avatar">
              <img v-show="item.from !== user.id" :src="otheruser.avatar">
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

    <!-- 弹出信息栏部分 -->
    <mu-dialog width="360" :open.sync="openSimple">
      <div><span style="font-weight: 600;">昵称:</span> {{otheruser.username}}</div>
      <div><span style="font-weight: 600;">来自:</span> {{otheruser.school}}</div>
      <div><span style="font-weight: 600;">年龄:</span> {{otheruser.age}}</div>
      <div><span style="font-weight: 600;">信息:</span> {{otheruser.info}}</div>
  </mu-dialog>
  </div>
</template>

<script>
import moment from "moment";
import emoji from "../components/Emoji";
export default {
  name: "",
  components: {
    emoji
  },
  computed: {
      //当前用户
    user() {
      return this.$store.getters.user;
    },
    //这是过滤掉消息得到双方的消息
    msg() {
         //计算当前聊天的chat_id 只属于当前两个人的 from to（sort再拼接）
      const meId = this.user.id; //当前用户
      const targetId = this.$route.params.id; //对方
      const chatId = [meId,targetId].sort().join('_'); //合并
      //在消息列表中找出这个合并的，就是双方两个人的消息
      const msg = this.$store.state.chatMsg.filter(msg => msg.chat_id === chatId);
      //格式化时间;
      msg.forEach(item => {
          item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss");
      })
      return msg;
    },
    //对方信息
    otheruser() {
        return this.$store.state.users[this.$route.params.id]
    }
  },
  data() {
    return {
      chatValue: '',
      getEmoji: false,//表情框弹出
      openSimple: false //信息弹出框
    };
  },
  methods: {
    //返回上一页
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
    //发送消息
    //这里发送才有socket连接 我们要想个办法时刻socket
    //ps已解决: 在App.vue的reqMsgList中加入了初始化socket 使得页面一进入就可以时刻收消息了
    sendmess() {
      if (!this.chatValue) {
        this.$alert("不能没有任何输入");
        return;
      }
      //console.log({from: this.user.id,to: this.$route.params.id,content: this.chatValue})
      this.$store.dispatch("sendMsg",{from: this.user.id,to: this.$route.params.id,content: this.chatValue});
      this.chatValue = "";
    },
    openSimpleDialog() {
      this.openSimple = true;
    }
  },
  mounted() {
      //这个控制的话点击重进会报错！！但不影响功能
      //终于知道为啥报错了，因为在document绑定后离开，没有移除document的click事件
      //这个组件外的组件可是没有 this.$refs.emoji 的
      document.addEventListener("click",this.hideEmoji);
      //进来加载下消息
      this.$store.dispatch("reqMsgList",this.user.id);
      //进来就标记消息为已读
      this.$store.dispatch("readMsg",{from: this.$route.params.id,to: this.user.id})
  },
  beforeDestroy () {
      //离开这个组件必须移除掉，不然其它组件会报错！
      document.removeEventListener("click",this.hideEmoji)
      //离开也要标记消息为已读，因为你看完了
      this.$store.dispatch("readMsg",{from: this.$route.params.id,to: this.user.id})
  },
  watch: {
      //监听消息变化，到底部滚动
      msg() {
      //监听消息变化，马上滚动到底部，一定要nextTick 否则会是第二条数据
      this.$nextTick(() => {
        this.$refs.chatContent.scrollTop = 20000;
      });
    }
  }
};
</script>

<style lang = 'stylus' scoped>
.chat
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
        font-size 0.5rem
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
          /* .avatar
          img
            width 1.2rem
            height 1.2rem
            border-radius 0.1rem */
</style>