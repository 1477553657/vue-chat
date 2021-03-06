import {
    AUTHENTICATED,USER,MSGLIST,ONEMESSAGE,RECEIVEMSGLIST, READMSG,USERINFO,AVATAR, ALLMESSAGE,GROUPCHAT
} from './mutation-types.js'

export default {
    [AUTHENTICATED](state,isAuthenticated) {
        if(isAuthenticated) {
            state.isAuthenticated = isAuthenticated
        }else {
            state.isAuthenticated = false
        }
    },
    [USER](state,user) {
        if(user) {
            state.user = user
        }else {
            state.user = {}
        }
    },
    [MSGLIST](state,{users,msg}) {
        state.users = users
        state.chatMsg = msg
    },
    [ONEMESSAGE](state,{chatMsg,userId}) {
        //拼接进去,聊天页面就会自动增加了
        state.chatMsg = [...state.chatMsg,chatMsg]
        state.unReadCount = state.unReadCount +
(!chatMsg.read && chatMsg.to === userId ? 1 : 0)
    },
    [RECEIVEMSGLIST](state,{chatMsg, userId}) {
        state.unReadCount =chatMsg.reduce((pre,msg) => pre + (!msg.read && msg.to === userId ? 1 : 0),0)
    },
    [READMSG](state,{count,from,to}) {
        //总的减去已读的
        state.unReadCount = state.unReadCount - count;
        //更新所有消息
        state.chatMsg = state.chatMsg.map(item => {
            //如果是这条消息，并且未读的话 就设置为已读
            if(item.from === from && item.to === to && !item.read) {
                return {...item,read: true}
            }else {
                return item
            }
        })
    },
    [USERINFO](state,{user}) {
        state.user = user
    },
    [AVATAR] (state,{avatar}) {
        state.user.avatar = avatar
    },
    //群聊消息
    [ALLMESSAGE](state,chatMsg) {
        // console.log(chatMsg)
        if(chatMsg.read === false) state.unAll += 1;
        state.groupChat = [...state.groupChat,chatMsg]
    },
    [GROUPCHAT](state,result) {
        state.groupChat = result
        //console.log(result)
        state.unAll  =result.reduce((pre,msg) => pre + (!msg.read ? 1 : 0),0)
    }
}