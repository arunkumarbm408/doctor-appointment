require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { doctorSeedData } = require("./doctorSeedData");

const seedDoctors = async () => {
  try {
    await connectDB();

    for (const doctorData of doctorSeedData) {
      let user = await User.findOne({ email: doctorData.email });

      if (!user) {
        user = await User.create({
          name: doctorData.name,
          email: doctorData.email,
          password: doctorData.password,
          role: "doctor",
          phone: doctorData.phone,
          location: doctorData.location,
        });
      }

      await Doctor.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          specialization: doctorData.specialization,
          experience: doctorData.experience,
          fees: doctorData.fees,
          location: doctorData.location,
          about: doctorData.about,
          qualifications: doctorData.qualifications,
          availabilitySlots: doctorData.availabilitySlots,
          isApproved: true,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    console.log(`Inserted or updated ${doctorSeedData.length} doctors successfully`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDoctors();
