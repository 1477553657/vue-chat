import {
    AUTHENTICATED,USER,MSGLIST,ONEMESSAGE,RECEIVEMSGLIST,READMSG,USERINFO,AVATAR,ALLMESSAGE,GROUPCHAT
} from './mutation-types';
import {reqMsgList,reqReadMsg,reqUserInfo,reqGroup} from '../api/index'

import io from 'socket.io-client';

import store from './index'

//初始化socket连接
//这里使用到了单例对象，只有不存在才创建，存在就不需要了
function initIO(userId) {
    if(!io.socket) {
        // io.socket = io("ws://203.195.135.197:3000");
        io.socket = io("ws://127.0.0.1:3000");
        //监听服务器发来的消息
        io.socket.on('serverToClient',(chatMsg) => {
            //console.log("客户端接收服务器发来的消息",chatMsg)
            //console.log(userId)
            //只有当前双方才能收到消息，不相干的人收不到（from和to和消息有关，都是相干的）
            if(userId === chatMsg.from || userId === chatMsg.to) {
                store.dispatch("receiveOneMsg",{chatMsg,userId})
            }
        })
        //监听群聊消息
        io.socket.on('message',(chatMsg) => {
            //console.log("收到群聊消息",chatMsg)
            store.dispatch("receiveAll",chatMsg)
        })
    }
}


export default {
    setAuthenticated: ({ commit }, isAuthenticated) => {
        commit(AUTHENTICATED, isAuthenticated)
    },
    setUser: ({ commit }, user) => {
        commit(USER, user)
    },
    //清除用户信息
    clearCurrentState: ({ commit }) => {
        commit(AUTHENTICATED, false)
        commit(USER, null)
    },
    //私聊的发送消息
    sendMsg: ({commit},chatMsg) => {
        initIO()
        //将消息发送给服务器
        io.socket.emit("clientToServer",chatMsg)
    },
    //群聊的发送消息
    groupMsg: ({commit},chatMsg) => {
        initIO()
        //将群聊消息发给服务器
        io.socket.emit("groupChat",chatMsg)
    },
    //群聊的收到信息
    receiveAll: ({commit},chatMsg) => {
        initIO()
        //群聊消息保存到vuex
        commit(ALLMESSAGE,chatMsg)
    },
    //异步请求群聊信息 
    async reqGroupChat({commit}) {
        const result = await reqGroup()
        if(result.data.code === 200) {
            commit(GROUPCHAT,result.data.message)
        }
    },
    //异步请求当前用户聊天消息和所有用户部分信息
    async reqMsgList({commit},userId) {
        //初始化sockket 在App.vue里就开始，任何页面都可以时刻收到信息
        //这个id是当前登录用户id 触发后 从后台接收的消息插入state
        //这个初始化会发生 receiveOneMsg，将双方消息搞入state
        initIO(userId)
        let result = await reqMsgList();
        if(result.data.code === 200) {
            const {users,msg} = result.data.message
            //消息列表全部获得后，去同步下未读消息
            store.dispatch("receiveMsgList",{users, chatMsg: msg, userId})
            commit(MSGLIST,{users,msg})
        }
    },
    receiveOneMsg: ({commit},{chatMsg,userId}) => {
    //    console.log(chatMsg,userId)
       commit(ONEMESSAGE,{chatMsg,userId})
    },
    //接收消息列表的同步
    receiveMsgList: ({commit},{chatMsg,userId}) => {
        commit(RECEIVEMSGLIST,{chatMsg, userId})
    },
    //更新已读消息
    async readMsg({commit},{from,to}) {
        let result = await reqReadMsg(from)
        if(result.data.code === 200) {
            const count = result.data.data
            commit(READMSG,{count,from,to})
        }
    },
    //更新当前用户信息
    async updateUserInfo({commit},user) {
        let result = await reqUserInfo()
        if(result.data.code === 200) {
            user = result.data.message
            commit(USERINFO,{user})
        }
    },
    reqAvatar: ({commit},{avatar}) => {
        commit(AVATAR,{avatar})
    }
}