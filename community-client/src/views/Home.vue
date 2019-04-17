<template>
  <div class="home">
    <mu-paper class="demo-list-wrap">
      <mu-appbar color="#ff4081">{{user.type==="student"?"老师列表":"学生列表"}}</mu-appbar>
      <mu-list>
        <!-- <mu-sub-header>Hello</mu-sub-header> -->
        <mu-list-item
          avatar
          button
          v-for="(item,index) in userList"
          :key="index"
          @click="goChat(item._id,item.username)"
        >
          <mu-list-item-action>
            <mu-avatar>
              <img :src="item.avatar">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.username}}</mu-list-item-title>
            <mu-list-item-sub-title>{{item.info}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <i class="iconfont icon-qipao" style="font-size: 0.6rem;"></i>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider></mu-divider>
      </mu-list>
    </mu-paper>
  </div>
</template>

<script>
import { reqUserList } from "../api/index";
export default {
  name: "",
  data() {
    return {
      userList: "" //用户列表
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    //老师就获取学生列表，学生就获取老师列表 后台已经处理好了
    async getUserList() {
      let result = await reqUserList();
      if (result.data.code === 200) {
        this.userList = result.data.message;
      }
    },
    goChat(id,name) {
      //console.log(id)
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
    this.getUserList();
  }
};
</script>

<style lang = 'stylus' scoped>
.home
  font-size 0.5rem
</style>