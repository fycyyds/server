const express = require('express');
const app = express();
/**
 * 解析post请求的body数据
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false }));

/**
 * 跨域请求配置
 */
const cors = require('cors');
app.use(cors());

//在路由配置之前配置解析token中间件
const expressJwt = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey');
//expressJwt({secret:jwtSecretKey})解析token的中间件
//unless({path:[/^\/user\//]})指定哪些接口不需要访问权限
app.use(expressJwt({secret:jwtSecretKey,algorithms:['HS256']}).unless({path:['/api/user/register', '/api/user/login'] }))


/**
 * 用户相关的接口
 */
const userRouter = require('./router/user');
const courseRouter=require('./router/course');
app.use('/api/user', userRouter);
app.use('/api/course',courseRouter)

const joi = require('joi');
//错误级别中间件
app.use(function (err, req, res, next) {
  //处理joi 参数校验失败
  if (err instanceof joi.ValidationError) {
    return res.send({
      code: 1,
      message: err.message,
    });
  }
  //错误中间件处理身份认证失败的错误
  if(err.name==='UnauthorizedError'){
    return res.send({code:1,message:'身份认证失败'})
  }	
  //未知错误
  res.send({
    code: 1,
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('服务启动在：http://127.0.0.1:3000');
});

