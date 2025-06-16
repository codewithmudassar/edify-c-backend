const { Op } = require("sequelize");
const sequelize = require("../models"); // Import sequelize instance

// Add a new time slot
async function AddTimeSlot(req, res) {
  try {
    const { class_start_time, class_end_time, classroom, class_capacity, status = 'free' } = req.body;

    if (!class_start_time || !class_end_time || !classroom || !class_capacity) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Ensure status is either 'occupied' or 'free'
    if (!['occupied', 'free'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'occupied' or 'free'." });
    }

    const newTimeSlot = await sequelize.Timeslots.create({
      class_start_time,
      class_end_time,
      classroom,
      class_capacity,
      status,
    });

    res.status(201).json({ success: true, timeSlot: newTimeSlot });
  } catch (error) {
    console.error("Error creating time slot:", error);
    res.status(500).json({ success: false, message: "Error creating time slot." });
  }
}

// Get all time slots with optional search and pagination
async function GetTimeSlots(req, res) {
  try {
    const { search, status, page = 1, pageSize = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(pageSize, 10);

    if (pageNumber < 1) {
      return res.status(400).json({ success: false, message: "Page number must be greater than 0." });
    }

    // Define the where condition for search and status filtering
    const whereCondition = {
      ...(search && {
        classroom: { [Op.iLike]: `%${search}%` }, // Search by classroom name
      }),
      ...(status && {
        status, // Filter by status (either 'occupied' or 'free')
      }),
    };

    const { count, rows } = await sequelize.Timeslots.findAndCountAll({
      where: whereCondition,
      order: [["class_start_time", "ASC"]], // Ordering by class start time
      limit: pageLimit,
      offset: (pageNumber - 1) * pageLimit,
    });

    const totalPages = Math.ceil(count / pageLimit);

    res.status(200).json({
      success: true,
      timeSlots: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        pageSize: pageLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ success: false, message: "Error fetching time slots." });
  }
}

// Get time slot by ID
async function GetTimeSlotById(req, res) {
  try {
    const timeSlot = await sequelize.Timeslots.findByPk(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: "Time slot not found." });
    }
    res.status(200).json({ success: true, timeSlot });
  } catch (error) {
    console.error("Error fetching time slot:", error);
    res.status(500).json({ success: false, message: "Error fetching time slot." });
  }
}

// Update time slot by ID
async function UpdateTimeSlot(req, res) {
  try {
    const { class_start_time, class_end_time, classroom, class_capacity, status } = req.body;

    const timeSlot = await sequelize.Timeslots.findByPk(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: "Time slot not found." });
    }

    // Ensure status is either 'occupied' or 'free'
    if (status && !['occupied', 'free'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'occupied' or 'free'." });
    }

    await timeSlot.update({
      class_start_time,
      class_end_time,
      classroom,
      class_capacity,
      status,
    });

    res.status(200).json({ success: true, timeSlot });
  } catch (error) {
    console.error("Error updating time slot:", error);
    res.status(500).json({ success: false, message: "Error updating time slot." });
  }
}

// Delete time slot by ID
async function DeleteTimeSlot(req, res) {
  try {
    const timeSlot = await sequelize.Timeslots.findByPk(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: "Time slot not found." });
    }

    await timeSlot.destroy();
    res.status(200).json({ success: true, message: "Time slot deleted successfully." });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    res.status(500).json({ success: false, message: "Error deleting time slot." });
  }
}

module.exports = {
  AddTimeSlot,
  GetTimeSlots,
  GetTimeSlotById,
  UpdateTimeSlot,
  DeleteTimeSlot,
};
