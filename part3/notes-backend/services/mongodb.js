const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));
