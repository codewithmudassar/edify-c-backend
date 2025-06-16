const sequelize = require("../models"); 

async function AddBatch(req, res) {
  try {
    const { course_id, start_date, end_date, schedule, active_status,timeslot_id } = req.body;

    if (!course_id || !start_date || !end_date || !schedule || !timeslot_id) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    const courseExists = await sequelize.Courses.findByPk(course_id);
    if (!courseExists) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const timeSlotExists = await sequelize.Timeslots.findByPk(timeslot_id);
    if (!timeSlotExists) {
      return res.status(404).json({ success: false, message: "Timeslot not found." });
    }

    const newBatch = await sequelize.Batches.create({
      course_id,
      start_date,
      end_date,
      schedule,
      timeslot_id,
      active_status: active_status || "Y",
    });

    if(newBatch){
      await timeSlotExists.update({
        status: "occupied"
      })
    }

    res.status(201).json({ success: true, batch: newBatch });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ success: false, message: "Error creating batch." });
  }
}

async function GetBatches(req, res) {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(pageSize, 10);

    if (pageNumber < 1) {
      return res.status(400).json({ success: false, message: "Page number must be greater than 0." });
    }

    const whereCondition = {};

    const { count, rows } = await sequelize.Batches.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: pageLimit,
      offset: (pageNumber - 1) * pageLimit,
      include: [
        {
          model: sequelize.Courses,
          attributes: ["id", "course_name", "course_fee", "duration_months"],
        },
        {
          model: sequelize.Timeslots, 
          attributes:[  "class_start_time", "class_end_time", "classroom", "class_capacity", "status"]
        }
      ],
    });

    const totalPages = Math.ceil(count / pageLimit);

    res.status(200).json({
      success: true,
      batches: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        pageSize: pageLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ success: false, message: "Error fetching batches." });
  }
}

async function GetBatchById(req, res) {
  try {
    const batch = await sequelize.Batches.findByPk(req.params.id, {
      include: {
        model: sequelize.Courses,
        attributes: ["id", "course_name", "course_fee", "duration_months"],
      },
    });

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    res.status(200).json({ success: true, batch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ success: false, message: "Error fetching batch." });
  }
}

async function UpdateBatch(req, res) {
  try {
    const { start_date, end_date, schedule, active_status } = req.body;
    const batch = await sequelize.Batches.findByPk(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    await batch.update({ start_date, end_date, schedule, active_status });
    res.status(200).json({ success: true, batch });
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ success: false, message: "Error updating batch." });
  }
}

async function DeleteBatch(req, res) {
  try {
    const batch = await sequelize.Batches.findByPk(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    await batch.destroy();
    res.status(200).json({ success: true, message: "Batch deleted successfully." });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ success: false, message: "Error deleting batch." });
  }
}

module.exports = {
  AddBatch,
  GetBatches,
  GetBatchById,
  UpdateBatch,
  DeleteBatch,
};
