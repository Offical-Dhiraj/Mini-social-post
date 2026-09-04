const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },

      username: {
        type: String,
        required: true,
        trim: true,
      },
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    image: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },
    },

    likes: {
      type: [likeSchema],
      default: [],
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

module.exports = mongoose.model("Post", postSchema);