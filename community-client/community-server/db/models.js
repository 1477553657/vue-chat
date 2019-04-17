const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/community',{useNewUrlParser: true});
const con = mongoose.connection;
con.on('error', console.error.bind(console, '连接失败'));
con.on('connected', () => {
    console.log('数据库连接成功')
})

//创建用户Schema
const userSchema = mongoose.Schema({
    username: { type: String, require: true },//用户名
    password: { type: String, require: true },//密码
    type: { type: String, require: true },//学生或老师
    avatar: { type: String,default: 'http://localhost:3000/images/avatar/1.jpeg'},//头像
    info: { type: String,default: '这个家伙啥都没说'},//个人简介(要咨询的东西)
    school: { type: String,default: '某某大学'},//学校
    age: { type: String, default: '保密'},//年龄
});

//定义和暴露用户 Model
const UserModel = mongoose.model('user', userSchema);
exports.UserModel = UserModel;

//创建聊天Schema
const chatSchema = mongoose.Schema({
    from: { type: String, require: true },//发送者
    to: { type: String, require: true },//接收者
    chat_id: { type: String, required: true }, // 发送和接收者组成的字符串
    content: { type: String, required: true }, // 聊天内容
    read: { type: Boolean, default: false }, // 标识是否已读
    create_time: { type: Number }, // 创建时间
})

//定义和暴露聊天 Model
const ChatModel = mongoose.model('chat',chatSchema);
exports.ChatModel = ChatModel;

//创建群聊 Schema
const allChatSchema = mongoose.Schema({
    userid: {type: String,require: true}, //发送者id
    username: {type: String,require: true}, //发送者姓名
    content: { type: String, required: true }, // 当前发送者聊天内容
    read: { type: Boolean, default: false }, // 标识是否已读
    create_time: { type: Number }, // 创建时间
})
const AllChatModel = mongoose.model('allchat',allChatSchema);
exports.AllChatModel = AllChatModel;