const db = require('../config/db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config/jwtSecretKey');
/**
 * 注册接口逻辑
 */
exports.registerController = (req, res) => {
  // 注册接口逻辑,判断用户名密码是否为空
  let { userName, password } = req.body
  if (!userName || !password) {
    return res.send({ code: 1, message: '用户名或者密码不能为空' })
  }
  const userSelectSql = 'select * from user where name=?'
  db.query(userSelectSql, userName, (err, results) => {
    if (err) {
      return res.send({ code: 1, message: err.message });
    }
    // 判断用户是否存在
    if (results.length > 0) {
      return res.send({ code: 1, message: '用户名已存在' })
    }
    //密码加密, bcrypt.hashSync(明文密码，随机长度)
    password = bcrypt.hashSync(password, 10)
    // 头像列表
    const imgList = [
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/10.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/11.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/12.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/13.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/14.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/15.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/16.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/17.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/18.jpeg',
      'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/19.jpeg',
    ];
    // 随机生成1-10的整数
    const num = Math.floor(Math.random() * 10 + 1)
    // 随机头像

    const userInsertSql = 'insert into user (name,pwd,head_img) value (?,?,?)';
    db.query(userInsertSql, [userName, password, imgList[num]], (err, results) => {
      if (err) {
        return res.send({ code: 1, message: err.message })
      };
      //影响行数是否为1
      if (results.affectedRows !== 1) {
        return res.send({ code: 1, message: '注册失败' });
      };
      res.send({
        code: 0,
        data: { message: '注册成功' }
      });

    })
  });


};

//用户登录
exports.loginController = (req, res) => {
  const { userName, password } = req.body;
  const userSelectSql = 'select * from user where name=?';
  db.query(userSelectSql, userName, (err, results) => {
    if (err) {
      return res.send({ code: 1, message: err.message });
    }
    if (results.length === 0) {
      return res.send({ code: 1, message: '账号不存在' });

    }
    const compareState = bcrypt.compareSync(password, results[0].pwd)
    if (!compareState) {
      return res.send({ code: 1, message: '密码错误' })
    }
    const user = { ...results[0], pwd: '' };
    const token = jwt.sign(user, jwtSecretKey, { expiresIn: '24h' })
    res.send({
      code: 0,
      data: { message: '登录成功', token: 'Bearer ' + token }
    });
  })
}

//获取用户信息
exports.userInfoController = (req, res) => {
  //获取用户token解析
  const token = req.headers.authorization;
  const userInfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey);
  res.send({
    code: 0,
    data: {
      name: userInfo.name,
      headImg: userInfo.head_img,
    },
  });
}
