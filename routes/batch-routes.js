const express = require("express");
const router = express.Router();
const { 
  AddBatch, 
  GetBatches, 
  GetBatchById, 
  UpdateBatch, 
  DeleteBatch 
} = require("../controllers/batch.controller");

// Define batch routes
router.post("/batch", AddBatch); // Add a new batch
router.get("/batch", GetBatches); // Get all batches with optional search & pagination
router.get("/batch/:id", GetBatchById); // Get a batch by ID
router.put("/batch/:id", UpdateBatch); // Update a batch by ID
router.delete("/batch/:id", DeleteBatch); // Delete a batch by ID

module.exports = router;
