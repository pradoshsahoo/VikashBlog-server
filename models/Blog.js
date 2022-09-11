const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const visitingPlaces = new Schema(
  {
    placeName: {
      type: String,
      required: true,
    },
    placeImage: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);
const blogSchema = new Schema(
  {
    blogName: {
      type: String,
      required: true,
    },
    blogText: {
      type: String,
      required: true,
    },
    blogLocation: {
      type: String,
      required: true,
    },
    blogImage: {
      data: Buffer,
      contentType: String,
    },
    blogFamousFor: {
      type: [String],
      required: true,
    },
    blogVisitingPlaces: [visitingPlaces],
    blogCreatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

exports.Blog = mongoose.model("blog", blogSchema);
