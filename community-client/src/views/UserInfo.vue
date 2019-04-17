<template>
<div class="userInfo">
    <!-- 头部 -->
    <mu-appbar style="width: 100%;" color="primary">
  <mu-button icon slot="left" @click="back">
    <i class="iconfont icon-fanhui" style="font-size: 0.5rem;"></i>
  </mu-button>
  编辑资料
</mu-appbar>
<!-- 内容 -->
<mu-container class="content">
  <mu-text-field v-model="school" full-width placeholder="学校" icon=":iconfont icon-xuexiao"></mu-text-field><br/>
  <mu-text-field v-model="age" full-width type="number"  placeholder="年龄" icon=":iconfont icon-nianling"></mu-text-field><br/>
  <mu-text-field v-model="info" full-width multi-line :rows="2"  placeholder="咨询或帮助方面" icon=":iconfont icon-leixing"></mu-text-field><br/>
  <mu-button color="primary" @click="save">保存</mu-button>

</mu-container>

</div>
</template>

<script>
import {reqUpdate,reqUserInfo} from '../api/index'
import { userInfo } from 'os';
    export default {
        name: '',
        computed: {
            user() {
                return this.$store.getters.user
            }
        },
        data () {
            return {
                age: '',
                school: '',
                info: ''
            }
        },
        methods: {
            back() {
                this.$router.back()
            },
            save() {
                if(!this.school || !this.age || !this.info) {
                     this.$alert('请先输入完整');
                     return;
                }
                this.$confirm('确认修改吗?', '提示')
                .then(res => {
                   // console.log(res.result)
                   if(res.result) {
                       //发送修改请求
                       this.upInfo();
                   }
                })
            },
            async upInfo() {
                let result = await reqUpdate({age: this.age,school: this.school,info: this.info})
                if(result.data.code === 200) {
                    this.$toast.success(result.data.message);
                    this.$router.push({name: 'me'})
                }
            },
            async userInfo() {
                let result = await reqUserInfo()
                if(result.data.code === 200) {
                    this.age = result.data.message.age
                    this.school = result.data.message.school
                    this.info = result.data.message.info
                }
            }
        },
        mounted () {
            this.userInfo()
            // this.$store.dispatch("updateUserInfo")
            // this.age = this.user.age
            // this.school = this.user.school
            // this.info = this.user.info
        }
    }

</script>

<style lang = 'stylus' scoped>
.userInfo
  width 100%
  height 100%
  .content
    padding-top 1rem
    background #fff  
    text-align center
</style>