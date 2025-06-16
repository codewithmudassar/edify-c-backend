const express = require("express");
const router = express.Router();
const { 
  AddStudent, 
  GetStudents, 
  GetStudentById, 
  UpdateStudent, 
  DeleteStudent 
} = require("../controllers/student.controller");

// Define student routes
router.post("/student", AddStudent); // Add a new student
router.get("/student", GetStudents); // Get all students with optional search
router.get("/student/:id", GetStudentById); // Get a student by ID
router.put("/student/:id", UpdateStudent); // Update a student by ID
router.delete("/student/:id", DeleteStudent); // Delete a student by ID

module.exports = router;
