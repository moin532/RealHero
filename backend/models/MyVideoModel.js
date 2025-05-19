const mongoose = require("mongoose");

const driversVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },

  caption: {
    type: String,
  },

  location: {
    type: String,
    required: true,
  },
  emergency: {
    type: String,
    default: "false",
  },
  likes: {
    type: Number,
    default: 0,
  },

  ratings: {
    type: Number,
    default: 0,
  },

  video: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  images: [
    {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],

  user: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DriversVideo", driversVideoSchema);
