const express = require("express");
const router = express.Router();
const { 
  AddTimeSlot, 
  GetTimeSlots, 
  GetTimeSlotById, 
  UpdateTimeSlot, 
  DeleteTimeSlot 
} = require("../controllers/timeslot.controller");


router.post("/timeslot", AddTimeSlot); // Add a new time slot
router.get("/timeslot", GetTimeSlots); // Get all time slots with optional search & pagination
router.get("/timeslot/:id", GetTimeSlotById); // Get a time slot by ID
router.put("/timeslot/:id", UpdateTimeSlot); // Update a time slot by ID
router.delete("/timeslot/:id", DeleteTimeSlot); // Delete a time slot by ID

module.exports = router;
