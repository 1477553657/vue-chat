//multer的相关配置
const multer = require('multer')   //文件图片上传

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/uploads')    //上传路径  没有文件夹的话要自己创建
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname + '.jpg')  //保存文件名
    }
  })
  
  var upload = multer({ storage: storage })

  module.exports = upload