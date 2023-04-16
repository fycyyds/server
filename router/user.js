const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const expressJoi = require('@escook/express-joi');
const { userCheck } = require('../utils/check');

router.post('/register',expressJoi(userCheck), userController.registerController);
router.post('/login',expressJoi(userCheck), userController.loginController);
// 获取用户数据
router.get('/userInfo',userController.userInfoController)
module.exports = router;

