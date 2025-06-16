const { Employee } = require("../models");

// Create an Employee Application
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json({ message: "Employee application submitted", newEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employee Applications
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employee Application by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Application Status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Declined"
    if (!["Pending", "Accepted", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const employee = await Employee.update(
      { applicationStatus: status, adminResponseDate: new Date() },
      { where: { id: req.params.id }, returning: true }
    );

    if (!employee[0]) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: `Application ${status}`, employee: employee[1] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Employee Application
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
