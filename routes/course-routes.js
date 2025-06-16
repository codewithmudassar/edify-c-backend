const express = require("express");
const router = express.Router();
const {AddCourse,GetCourses,GetCourseById,UpdateCourse,DeleteCourse} = require("../controllers/course.controller");

// Define course routes
router.post("/course", AddCourse); // Add a new course
router.get("/course", GetCourses); // Get all courses with optional search & pagination
router.get("/course/:id", GetCourseById); // Get a course by ID
router.put("/course/:id", UpdateCourse); // Update a course by ID
router.delete("/course/:id", DeleteCourse); // Delete a course by ID

module.exports = router;