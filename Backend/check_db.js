require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Payment = require("./src/models/Payment");
const User = require("./src/models/User");
const Appointment = require("./src/models/Appointment");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctorbook");
    const user = await User.findById("69f6cc59904548db9693e76d").lean();
    const appt = await Appointment.findById("69f70ebb3154f2fc361c463e").lean();
    
    fs.writeFileSync("db_dump3.json", JSON.stringify({ user, appt }, null, 2));
    console.log("Dumped user and appt.");
  } catch (err) {
    fs.writeFileSync("db_dump3.json", err.toString());
  } finally {
    process.exit(0);
  }
};

run();
