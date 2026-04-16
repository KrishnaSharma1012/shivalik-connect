const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/shivalik-connect');
  const Course = require('./backend/models/Course.js').default;
  const courses = await Course.find({});
  console.log(JSON.stringify(courses, null, 2));
  process.exit(0);
}

check();
