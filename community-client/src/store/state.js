export default {
    isAuthenticated: false,//身份是否有效
    user: {}, //当前用户信息
    users: {},//所有用户信息（id 用户名 头像）
    chatMsg: [], //当前用户所有相关聊天信息 发给和收到的
    unReadCount: 0, //总的未读数量
    groupChat: [], //群聊聊天信息
    unAll: 0,//群聊未读总数量
 }