const express=require('express');
const router=express.Router();
const courseRouter=require('../controllers/courseController');
const expressJoi = require('@escook/express-joi');
const { findCourseCheck,updateCourseCheck,deleteCourseCheck} = require('../utils/check');
//课程查询
router.get('/find',expressJoi(findCourseCheck),courseRouter.listVideo);
//课程修改
router.get('/update',expressJoi(updateCourseCheck),courseRouter.updateVideoById);
//课程删除
router.get('/delete',expressJoi(deleteCourseCheck),courseRouter.deleteVideoById);
module.exports = router;
