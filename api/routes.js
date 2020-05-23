const controllers = require('./controllers.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();


//router.get('/', controllers.hello);

// write your routes


router.get('/courses', controllers.getCourses);

router.post('/courses/anyCourse', controllers.get1Course);

router.post('/courses', controllers.postCourse);

router.post('/courses/change', controllers.putCourse);



router.post('/courses/delete', controllers.deleteCourse);

module.exports = router;
