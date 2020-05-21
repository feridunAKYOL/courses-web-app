const controllers = require('./controllers.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();


router.get('/', controllers.hello);

// write your routes


router.get('/courses', controllers.getCourses);

router.get('/courses/:id', controllers.get1Course);

router.post('/courses', controllers.postCourse);

router.put('/courses/:id', controllers.putCourse);



router.delete('/courses/:id', controllers.deleteCourse);

module.exports = router;
