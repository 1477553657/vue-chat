<template>
  <div>
    <div class="emoji-content" v-show="getEmoji">
      <div class="emoji-tabs">
        <div class="emoji-container" @click="sendEmoji">
          <div class="emoji-block" :style="{width: Math.ceil(emoji.people.length / 5) * 48 + 'px'}">
            <span v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
          </div>
          <div class="emoji-block" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
            <span v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
          </div>
          <div class="emoji-block" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
            <span v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
          </div>
          <div class="emoji-block" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
            <span v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
          </div>
          <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
            <span v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入表情
import emoji from "../assets/js/emoji";
export default {
  name: "",
  props: ["getEmoji"],
  data() {
    return {
      emoji: emoji
    };
  },
  methods: {
    sendEmoji(e) {
      //console.log(e);
      //发送给父组件
      this.$emit("sendEmoji", e);
    }
  }
};
</script>

<style lang = 'stylus' scoped>
.emoji-content
  position absolute
  bottom 1.5rem
  left 0
  width 100%
  height 200px
  border-top 1px solid #f3f3f3
  overflow hidden
  background-color #fff
  .emoji-container
    width 10000px
  .emoji-tabs
    overflow auto
    .emoji-block
      width 1170px
      height 200px
      float left
      span
        display inline-block
        cursor pointer
        font-size 26px
        min-width 48px
        line-height 39px
        text-align center
        list-style none
</style>