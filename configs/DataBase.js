const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true); // Opción para mantener el comportamiento actual

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log('La Base De Datos esta conectada');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
