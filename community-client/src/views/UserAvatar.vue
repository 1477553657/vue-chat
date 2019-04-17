<template>
  <div class="avatar">
    <!-- 头部 -->
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="goBack">
        <i class="iconfont icon-fanhui" style="font-size: 0.5rem;"></i>
      </mu-button>
    </mu-appbar>
    <!-- 裁剪区 -->
    <div class="wrap">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :autoCrop="option.autoCrop"
      ></vueCropper>
    </div>
    <!-- 上传保存区 -->
    <div class="save">
      <label class="btn" for="uploads">头像上传</label>
      <input
        type="file"
        id="uploads"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event,1)"
      >
      <button @click="handleSubmit" class="btn">保存头像</button>
    </div>
  </div>
</template>

<script>
import { reqUserInfo ,reqAvatar} from "../api/index";
import { VueCropper } from "vue-cropper";
export default {
  name: "",
  components: {
    VueCropper
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  data() {
    return {
      option: {
        img: "",
        size: 1,
        autoCrop: true
      }
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    uploadImg(e, num) {
      //console.log(e.target.files)
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$alert("请选择正确的图片格式", "提示");
        return false;
      }
      if (file.size > 3 * 1024 * 1024) {
        this.$alert("图片大小不能超过3m", "提示");
        return false;
      }
      const reader = new FileReader();
      reader.onload = e => {
        console.log(e);
        let data;
        if (typeof e.target.result === "object") {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        }
      };
      reader.readAsArrayBuffer(file);
    },
    async handleSubmit() {
      const res = await this.$confirm("确认上传吗?", "提示");
      //console.log(res)
      if (res.result === true) {
        this.saveAvatar();
      }
    },
    saveAvatar() {
      this.$refs.cropper.getCropBlob(async data => {
        // 把blob上传到服务器 需要把Blob对象分装成FormData对象，就像表单上传文件一样去处理
        //console.log(data);
        //new File([blob], "filename")//来处理blob
         let files = new File([data], this.user.id);
    //     //console.log(files)
        let formData = new FormData();
        formData.append("file", files);
        formData.append("name", "kim");
    //    console.log(formData.get("file"))
   // const headerConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
      const result = await reqAvatar(formData)
      if(result.data.code === 200) {
        this.$toast.success("修改成功!");
        //改变vuex里面的avatar,用后台返回的头像新地址
        console.log(result.data.message)
        this.$store.dispatch("reqAvatar",{avatar: result.data.message})
        this.$router.push({name: 'me'})
      }
      });
      //改变头像后 还要将store的头像顺便改了。因为我有几个页面都是用vuex里面数据
    },
    async userInfo() {
      let result = await reqUserInfo();
      if (result.data.code === 200) {
        this.option.img = result.data.message.avatar;
      }
    }
  },
  mounted() {
    this.userInfo();
  }
};
</script>

<style lang = 'stylus' scoped>
.avatar
  width 100%
  height 100%
  .wrap
    width 100%
    height 10rem
  .save
    padding 0.5rem 0
    background #ffffff
    display flex
    justify-content space-around
    .btn
      display inline-block
      background #2196f3
      font-size 0.4rem
      border-radius 0.1rem
      color #ffffff
      padding 0.1rem
      text-decoration none
      outline none
      user-select none
      border 1px solid #2196f3
    #uploads
      position absolute
      clip rect(0, 0, 0, 0)
</style>