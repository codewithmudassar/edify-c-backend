const express = require("express");
const app = express();
const { sequelize } = require("./models");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Import Routes
const batchRoutes = require("./routes/batch-routes");
const studentRoutes = require("./routes/student-routes");
const timeSlotRoutes = require("./routes/timeslot-routes");
const courseRoutes = require("./routes/course-routes");
const employeeRoutes = require("./routes/employee-routes"); // New Employee Routes

// Use Routes
app.use("/api", batchRoutes);
app.use("/api", studentRoutes);
app.use("/api", timeSlotRoutes);
app.use("/api", courseRoutes);
app.use("/api/employees", employeeRoutes); // New Employee Route Integration

// Sync Database (Optional)
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.log("Database sync error:", error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
