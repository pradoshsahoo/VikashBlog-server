const express = require("express");
const { dbConn } = require("./config/db");
const cors = require("cors");
const blogRoutes = require("./routes/blog");
const app = express();
const port = 2001;
app.use(express.json());
app.use(cors());
app.use(blogRoutes);
dbConn();
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
