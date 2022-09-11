const e = require("express");
const express = require("express");
const fs = require("fs");
const { Blog } = require("../models/Blog");
const multer = require("multer");
const router = express.Router();

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

//LIST

router.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (blogs.length == 0) {
      return res.status(400).json({
        message: "No products found",
      });
    } else {
      return res.status(200).json({
        summary: {
          message: "Blogs retrieved successfully",
          totalcount: `${blogs.length}`,
        },
        blogs,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Sommething went wrong",
      error: err.message,
    });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog.length == 0) {
      return res.status(400).json({
        message: "No products found",
      });
    } else {
      let imgArr = [];
      blog.blogVisitingPlaces.map((item) => {
        imgArr = [...imgArr, item.placeImage.data.toString("base64")];
      });
      return res.status(200).json({
        blog,
        imgArr,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Sommething went wrong",
      error: err.message,
    });
  }
});

router.post("/blog", upload.any("uploads"), async (req, res) => {
  console.log("Reached the add route");
  console.log(req.files);
  try {
    const {
      blogName,
      blogText,
      blogLocation,
      blogFamousFor,
      blogCreatedBy,
      blogVisitingPlaces,
    } = req.body;
    const blogImage = {
      data: fs.readFileSync("uploads/" + req.files[0].filename),
      contentType: "image/png",
    };

    blogVisitingPlaces.map((item, index) => {
      item.placeImage = {
        data: fs.readFileSync("uploads/" + req.files[index + 1].filename),
        contentType: "image/png",
      };
    });
    const blogObj = {
      blogName,
      blogText,
      blogImage,
      blogLocation,
      blogFamousFor,
      blogCreatedBy,
      blogVisitingPlaces,
    };

    const blog = new Blog(blogObj);
    await blog.save();
    return res.status(201).json({
      summary: {
        message: "Blog saved successfully",
        totalcount: `${await Blog.count()}`,
      },
      blog,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Sommething went wrong",
      error: err.message,
    });
  }
});

router.put("/blog/:id", upload.single("blogImage"), async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      const { blogName, blogText, blogCreatedBy } = req.body;
      const blogImage = {
        data: req.file.filename,
        contentType: "image/png",
      };
      const blogObj = {
        blogName,
        blogText,
        blogImage,
        blogCreatedBy,
      };
      await blog.save();
      return res.status(201).json({
        message: `Blog with id ${id} updated successfully`,
      });
    } else {
      return res.status(400).json({
        message: "No such id found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

router.delete("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      await Blog.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Blog deleted successfully",
      });
    } else {
      return res.status(400).json({
        message: "No such id found",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});
module.exports = router;
