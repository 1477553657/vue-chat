<template>
  <div class="home">
    <mu-paper class="demo-list-wrap">
      <mu-appbar color="#ff4081">消息列表</mu-appbar>
      <mu-list>
        <!-- 这是进入该用户发送给其他用户的路由 其他用户是to 再从users找到名字 -->
        <mu-list-item avatar button v-for="item in aLastMsgs" :key="item.id" @click="goChat(item)">
          <mu-list-item-action>
            <mu-avatar>
              <img v-show="item.to === user.id" :src="users[item.from].avatar">
              <img v-show="item.from === user.id" :src="users[item.to].avatar">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title v-show="item.to === user.id">{{users[item.from].username}}</mu-list-item-title>
            <mu-list-item-title v-show="item.from === user.id">{{users[item.to].username}}</mu-list-item-title>
            <mu-list-item-sub-title>{{item.content}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-badge v-show="item.unReadCount" :content="String(item.unReadCount)" color="rgb(255, 64, 129)" :circle="true"></mu-badge>
          </mu-list-item-action>
        </mu-list-item>
        <!-- <mu-divider></mu-divider> -->
      </mu-list>
    </mu-paper>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
        
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    users() {
        return this.$store.getters.users;
    },
    chatMsg() {
      return this.$store.getters.chatMsgs;
    },
    aLastMsgs() {
        return this.getLastMsgs(this.$store.state.chatMsg,this.user.id)
       
    }
  },
  methods: {
    //找出所有和该用户聊天的最后一条消息记录
    getLastMsgs(chatMsgs, userId) {
      const oLastMsgs = {};
      if (!chatMsgs) return;
      chatMsgs.forEach(item => {
        if (item.to === userId && !item.read) {
            //把登录方作为消息接收的那方 那条消息设置一个unReadCount未读为1
          item.unReadCount = 1;
        } else {
          item.unReadCount = 0;
        }
        const chatId = item.chat_id;
        //如果存在的话，这个就是之前那条了
        let lastMsg = oLastMsgs[chatId];
        if (!lastMsg) {
            //第一次不存在 加入数组
          oLastMsgs[chatId] = item;
        } else {
            //之前那条消息未读数
          let unReadCount = lastMsg.unReadCount;
          if (item.create_time > lastMsg.create_time) {
            oLastMsgs[chatId] = item;
          }
          //把统计的结果加到 lastMsgs[chatId]的unReadCount里
          //之前未读加上现在 就是一共未读
          oLastMsgs[chatId].unReadCount = unReadCount + item.unReadCount;
        }
      });
      //   - 2.得到所有lastMsg的数组 obj.value=>arr
      const aLastMsgs = Object.values(oLastMsgs);
      //   - 3.对数组进行排序(按照create_time降序)
      aLastMsgs.sort((m1, m2) => {
        //如果结果<0，将m1放前面 => 升序
        return m2.create_time - m1.create_time;
      });
      return aLastMsgs;
    },
     goChat(item) {
     // console.log(item)
     // 这样才可以进入对面那方，不然进入自己和自己聊天就尴尬了。。
     const id = item.from === this.user.id ? item.to : item.from
     const name = this.users[id].username
      this.$router.push({
        name: "chat",
        params: {
          id,
          name
        }
      });
    }
  },
  mounted() {
  }
};
</script>

<style lang = 'stylus' scoped>
.home
  font-size 0.5rem
</style>