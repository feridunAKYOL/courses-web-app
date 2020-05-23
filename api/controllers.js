'use strict';

const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const config = require('../config');
const file_path = path.join(__dirname, '/..', config.DATA_DIR, '/courses.json');

// read the courses
const readData = () => {
	const objToBeParsed = fs.readFileSync(file_path, 'utf-8');
	//console.log(objToBeParsed);

	const dataParsed = JSON.parse(objToBeParsed);
	//console.log(dataParsed);

	return dataParsed;
};

const courses = readData();
console.log(courses);

// write the new courses list
const writeToCourses = async () => {
	const callbackWrite = (err, content) => {
		if (err) {
			return console.error(err);
		} else {
			console.log(`write JSON done ... `);
		}
	};

	const writingData = JSON.stringify(courses, null, 2);
	fs.writeFile(file_path, writingData, callbackWrite);
};

// this is the main part... GET, POST, DELETE and PUT requests
const controllers = {
	hello: (req, res) => {
		res.json({ api: 'courses!' });
	},

	// get all courses list
	getCourses: (req, res) => {
		res.send(courses);
	},

	// get only one course name
	get1Course: (req, res) => {
		const course = courses.find((course) => course.id === parseInt(req.params.id));

		if (!course) return res.status(404).send('The course with the given ID was not found.');
		res.send(course);
	},

	// create a new course
	postCourse: (req, res) => {
		// object restructuring
		const { error } = validationCourse(req.body); // result.error

		if (error) {
			// 400 Bad request
			// res.status(400).send(result.error);
			res.status(400).send(error.details[0].message);
			return;
		}
		const course = {
			id: courses.length + 1,
			name: req.body.name
		};
		courses.push(course);
		writeToCourses(courses);

		res.redirect("/");
	},

	// change the name of any course
	putCourse: (req, res) => {
		// Look up the course
		// If not existing, return 404
		const course = courses.find((course) => course.id === parseInt(req.params.id));

		if (!course) {
			res.status(404).send('The course with the given Id was not found..');
			return;
		}

		// object restructuring
		const { error } = validationCourse(req.body); // result.error

		if (error) {
			// 400 Bad request
			// res.status(400).send(result.error);
			res.status(400).send(error.details[0].message);
			return;
		}
		// Update course
		course.name = req.body.name;

		// Update Json file...
		writeToCourses();

		// Return the updated course
		res.send(courses);
	},

	// delete a course by id
	deleteCourse: (req, res) => {
		// Look up the course
		//  Not existing, return 404
		const course = courses.find((course) => course.id == parseInt(req.query.id));
		console.log(course);
		
		if (!course) return res.status(404).send('The course with the given Id was not found.');

		// Delete
		const index = courses.indexOf(course);
		courses.splice(index, 1);

		writeToCourses();

		// Return the same course
		res.send(course);
	}
};

// validate the course name
function validationCourse(course) {
	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(course, schema);
}

module.exports = controllers;
