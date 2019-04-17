const {ChatModel,AllChatModel} = require('../db/models');

//暴露一个函数 在www文件里直接引入并执行 就拿到了www里面的server
module.exports = (server) => {
    const io = require('socket.io')(server);

    io.on('connection',(socket) => {
        console.log("有个浏览器连接");
        //接收客户端发来的消息 一对一聊天
        socket.on('clientToServer',({from,to,content}) => {
            console.log(from,to,content);
            //这样排序出一个聊天id 是让发送方和接收方都可以收到双方信息;
            //也就是小明=>小红 和小红=>小明 都可以看见这个chat_id下的消息
            const chat_id = [from,to].sort().join('_');
            const create_time = Date.now();
            //保存到数据库
            new ChatModel({from,to,content,chat_id,create_time}).save((err,chatMsg) => {
                if(err) console.log(err);
                //向向客户端发送消息
                io.emit('serverToClient',chatMsg)
            })
        })
        //收到客户端发来的消息，群聊
        socket.on('groupChat',chat => {
            const create_time = Date.now();
            const {userid,username,avatar,content} = chat;
            //保存到数据库 不能插_id 重复会报错 唯一性
            //别把头像存入群聊数据库，用户头像会变得，vuex的user就可以找到头像了
            new AllChatModel({userid,username,content,create_time}).save((err,data) => {
                if(err) console.log(err);
                //发送给所有客户端
                const result = {userid,username,content,create_time}
                io.emit("message",result)
            })
        })
    })
}