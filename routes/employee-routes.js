const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployeeStatus,
  deleteEmployee,
} = require("../controllers/employee-controller");

const router = express.Router();

router.post("/create", createEmployee); // Submit employee application
router.get("/", getEmployees); // Get all employee applications
router.get("/:id", getEmployeeById); // Get an employee application by ID
router.put("/status/:id", updateEmployeeStatus); // Accept/Decline application
router.delete("/:id", deleteEmployee); // Delete employee application

module.exports = router;
