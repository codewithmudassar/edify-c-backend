const { Op } = require("sequelize");
const sequelize = require("../models"); // Import sequelize instance

async function AddCourse(req, res) {
  try {
    const { course_name, course_fee, duration_months, duration_weeks, duration_days, modules } = req.body;

    if (!course_name || !course_fee) {
      return res.status(400).json({ success: false, message: "Course name and fee are required." });
    }

    const newCourse = await sequelize.Courses.create({
      course_name,
      course_fee,
      duration_months,
      duration_weeks,
      duration_days,
      modules,
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Error creating course." });
  }
}

async function GetCourses(req, res) {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(pageSize, 10);

    if (pageNumber < 1) {
      return res.status(400).json({ success: false, message: "Page number must be greater than 0." });
    }

    const whereCondition = search ? { course_name: { [Op.iLike]: `%${search}%` } } : {};

    const { count, rows } = await sequelize.Courses.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: pageLimit,
      offset: (pageNumber - 1) * pageLimit,
    });

    const totalPages = Math.ceil(count / pageLimit);

    res.status(200).json({
      success: true,
      courses: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        pageSize: pageLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Error fetching courses." });
  }
}

async function GetCourseById(req, res) {
  try {
    const course = await sequelize.Courses.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Error fetching course." });
  }
}

async function UpdateCourse(req, res) {
  try {
    const { course_name, course_fee, duration_months, duration_weeks, duration_days, modules, status } = req.body;

    const course = await sequelize.Courses.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    await course.update({ course_name, course_fee, duration_months, duration_weeks, duration_days, modules, status });

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, message: "Error updating course." });
  }
}

async function DeleteCourse(req, res) {
  try {
    const course = await sequelize.Courses.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    await course.destroy();
    res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Error deleting course." });
  }
}

module.exports = {
  AddCourse,
  GetCourses,
  GetCourseById,
  UpdateCourse,
  DeleteCourse,
};
