const mongoose = require("mongoose");

const url = process.env.MONGODB_URI
mongoose.set("strictQuery", false);

// Abrir la conexión a la base de datos
mongoose.connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });