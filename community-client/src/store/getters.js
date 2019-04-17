import moment from "moment";
export default {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    users: state => state.users,
    chatMsg: state => state.chatMsg,
    unReadCount: state => state.unReadCount,
    //群聊
    groupChat: (state) => {
        state.groupChat.forEach(item => {
           item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
        })
        return state.groupChat
    }
}