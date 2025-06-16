const { Op } = require("sequelize");
const sequelize = require("../models"); // Import sequelize instance

// Create a new student
async function AddStudent(req, res) {
  try {
    const {
      fullname,
      father_name,
      dob,
      email,
      contact_no,
      gender,
      address,
      active_status,
      batch_id,
      total_fee,
      discount,
      installments,
    } = req.body;

    // Validate required fields
    if (!fullname || !father_name || !dob || !contact_no || !gender || !address) {
      return res.status(400).json({
        success: false,
        message: "Fullname, father name, date of birth, contact number, gender, and address are required.",
      });
    }

    // Validate installments (if provided)
    if (installments && Array.isArray(installments)) {
      for (const installment of installments) {
        if (!installment.installment_fee || !installment.installment_date) {
          return res.status(400).json({
            success: false,
            message: "Each installment must have `installment_fee` and `installment_date`.",
          });
        }
      }
    }

    // Create the student record
    const newStudent = await sequelize.Students.create({
      fullname,
      father_name,
      dob,
      email,
      contact_no,
      gender,
      address,
      active_status,
      batch_id,
      total_fee,
      discount,
      installments: installments || [],
    });

    res.status(201).json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      success: false,
      message: "Error creating student.",
      error: error.message, // Include the actual error message
    });
  }
}

// Get all students
async function GetStudents(req, res) {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(pageSize, 10);

    if (pageNumber < 1) {
      return res.status(400).json({ success: false, message: "Page number must be greater than 0." });
    }

    // Construct the WHERE condition for search if a search term is provided
    const whereCondition = search
      ? {
          [Op.or]: [
            { fullname: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { contact_no: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    // Query the students with pagination and include associated batch details
    const { count, rows } = await sequelize.Students.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: pageLimit,
      offset: (pageNumber - 1) * pageLimit,
      include: [
        {
          model: sequelize.Batches, // Include Batch data for each student
          attributes: ['id', 'start_date', 'end_date', 'schedule', 'active_status'],
          include: [
            {
              model: sequelize.Courses,
            },
            {
              model: sequelize.Timeslots,
            },
          ],
        },
      ],
    });

    const totalPages = Math.ceil(count / pageLimit);

    // Send response with fetched students and pagination data
    res.status(200).json({
      success: true,
      students: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        pageSize: pageLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Error fetching students." });
  }
}

// Get a single student by ID
async function GetStudentById(req, res) {
  try {
    const student = await sequelize.Students.findByPk(req.params.id, {
      include: [
        {
          model: sequelize.Batches,
          attributes: ['id', 'start_date', 'end_date', 'schedule', 'active_status'],
          include: [
            { model: sequelize.Courses },
            { model: sequelize.Timeslots }
          ]
        }
      ]
    });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Error fetching student." });
  }
}

// Update a student by ID
async function UpdateStudent(req, res) {
  try {
    console.log("Incoming request data:", req.body);

    const { 
      fullname, father_name, dob, email, contact_no, gender, address, 
      active_status, batch_id, total_fee, discount, installments 
    } = req.body;

    // ✅ Ensure student model is correctly referenced
    const student = await sequelize.Students.findByPk(req.params.id);
    if (!student) {
      console.log("Student not found:", req.params.id);
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    console.log("Found student:", student.id);

    // ✅ Update student details, including installments
    await student.update({
      fullname, father_name, dob, email, contact_no, gender, 
      address, active_status, batch_id, total_fee, discount,
      installments // Correctly updates JSON field
    });

    console.log("Updated student details including installments.");
    
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Error updating student.",
      error: error.message,
      stack: error.stack
    });
  }
}


// Delete a student by ID
async function DeleteStudent(req, res) {
  try {
    const student = await sequelize.Students.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    await student.destroy();
    res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Error deleting student." });
  }
}

module.exports = {
  AddStudent,
  GetStudents,
  GetStudentById,
  UpdateStudent,
  DeleteStudent,
};
