const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const upload = require('../config/upload');

const {UserModel,ChatModel} = require('../db/models');
const filter = {password: 0, __v: 0} //数据库过滤信息，不返回这两个

//测试
router.get('/test',passport.authenticate('jwt',{session:false}),(req,res) => {
  res.json({
      message: req.user
  })
})

//注册
router.post('/register',(req,res) => {
  const {username,password,type} = req.body;
  UserModel.findOne({username})
  .then((user) => {
    if(user) {
      return res.status(400).json({message: '该用户已被注册!'})
    }else {
      //生成新用户
      const newUser = new UserModel({
        username,
        password: md5(password),
        type
      })
      //保存到数据库
      newUser.save()
      .then(user => res.json({code: 200,message: '恭喜注册成功'}))
      .catch(err => console.log(err))
    }
  })
})

//登录
router.post('/login',(req,res) => {
  const {username,password} = req.body;
  //根据用户名和密码查询
  UserModel.findOne({username,password: md5(password)},
  filter, //第二个参数是过滤，password和_v被设为了0，不会返回这两个
  )
  .then((user) => {
    if(user) {
      //生成token 1小时有效期
      // console.log(user)
      //配置规则
      const rule = {id: user.id,username: user.username,type: user.type,avatar: user.avatar,info: user.info,school: user.school,age: user.age}
      jwt.sign(rule,"kim",{expiresIn: 3600},(err,token) => {
        if(err) console.log(err)
        //登录成功，返回token给前台
        res.json({
          code: 200,
          token: "Bearer " + token
        })
      })
    }else {
      res.status(400).json("账号或密码错误!")
    }
  })
})

//用户列表
router.get('/userlist',passport.authenticate('jwt',{session:false}),(req,res) => {
  //console.log(req.user)
  //如果当前登录的是老师，就显示学生列表；否则相反
  const type = (req.user.type === "teacher")?"student":"teacher";
  //过滤掉密码和一个没用的（不让其发送到前台）
  UserModel.find({type},filter)
  .then((user) => {
    if(user) {
      res.json({code: 200,message: user})
    }else {
      res.json({code: 0,message: '当前还没有用户'})
    }
  })
})

//获取当前用户所有相关聊天信息列表
router.get('/msglist',passport.authenticate('jwt',{session:false}),(req,res) => {
  //查询所有用户名字和头像，聊天显示用
  UserModel.find((err,user) => {
    const users = {} //存用户
    user.forEach(item => {
      users[item.id] = {username: item.username,avatar: item.avatar,school: item.school,info: item.info,age: item.age}
    })
   // 查询当前登录用户的所有聊天信息
  ChatModel.find({
    //查询该用户发的和收的消息
    '$or':[{from: req.user.id},{to: req.user.id}]
  },filter,(err,msg) => {
    if(err) console.log(err)
    res.json({code: 200,message: {users,msg}})
  })
  })

})

//修改消息为已读
router.post("/readmsg",passport.authenticate('jwt',{session: false}),(req,res) => {
  const from = req.body.from
  const to = req.user.id
  ChatModel.updateMany({from: from,to: to,read: false},{$set: {read: true}},(err,data) => {
    if(err) console.log(err);
    // console.log(data)
    // console.log(data.nModified) //更新数量
    res.json({code: 200,data: data.nModified})
  })
})

//信息修改 年龄 咨询 学校
router.post("/update",passport.authenticate('jwt',{session: false}),(req,res) => {
  const {age,school,info} = req.body
  UserModel.findOneAndUpdate({_id: req.user.id},{$set: {age,school,info}},(err,data) => {
    if(err) console.log(err)
    res.json({code: 200,message: '修改成功!'})
  })
} )

//获取当前用户所有信息
router.get("/userInfo",passport.authenticate("jwt",{session: false}),(req,res) => {
  UserModel.findById(req.user.id,filter,(err,doc) => {
    if(err) console.log(err);
    res.json({code: 200,message: doc})
  })
})

//上传头像 
router.post('/uploadAvatar',upload.any(),passport.authenticate("jwt",{session: false}),(req,res) => {
  //console.log(req.body)
  //console.log(req.files)
  //找出路径 根据用户id 插入头像 id作为图片名 以后每上传一次就会覆盖，不用发担心多了
  const filename = req.files[0].filename
  const avatar = `http://127.0.0.1:3000/uploads/${filename}`
  //console.log(avatar) //可以访问到的图片路径
  UserModel.findOneAndUpdate({_id: req.user.id},{$set: {avatar}},(err,data) => {
    if(err) console.log(err)
    //把头像地址返回给前端，vuex要改变
    res.json({code: 200,message: avatar})
  })
})




module.exports = router;
