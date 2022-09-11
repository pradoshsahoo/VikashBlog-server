const mongoose = require("mongoose");
exports.dbConn = async () => {
  try {
    const dbURL =
      "mongodb+srv://vikaash:vikaash123@cluster0.jpci9.mongodb.net/blogdb?retryWrites=true&w=majority";
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected`);
  } catch (err) {
    console.log(`Database connection error ${err.message}`);
  }
};
