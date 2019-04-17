//调用接口方法

import ajax from './ajax'

//注册
export const reqRegister = (user) => ajax('/api/register',user,'POST');

//登录
export const reqLogin = (user) => ajax('/api/login',user,'POST');

//用户列表
export const reqUserList = () => ajax('/api/userlist');

//和当前用户相关的消息列表 （还有所有用户相关信息）
export const reqMsgList = () => ajax('/api/msglist');

//标记消息read为已读
export const reqReadMsg = (from) => ajax('/api/readmsg',{from},'POST')

//更新信息
export const reqUpdate = (info) => ajax('/api/update',info,'POST')

//查询当前登录用户信息
export const reqUserInfo = () => ajax("/api/userInfo")

//上传头像
export const reqAvatar = (formData) => ajax("/api/uploadAvatar",formData,'POST')

//请求群聊聊天信息
export const reqGroup = () => ajax("/api/groupChat")
