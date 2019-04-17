const {ChatModel} = require('../db/models');

//暴露一个函数 在www文件里直接引入并执行 就拿到了www里面的server
module.exports = (server) => {
    const io = require('socket.io')(server);

    io.on('connection',(socket) => {
        console.log("有个浏览器连接");
        //接收客户端发来的消息
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
    })
}