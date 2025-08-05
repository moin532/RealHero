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
  },

  emergency: {
    type: Boolean, // changed to Boolean for consistency
    default: false,
  },

  likes: {
    type: Number,
    default: 0,
  },

  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserHero",
    },
  ],

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
        required: true, // keeping this required ensures all images have IDs
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserHero",
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId, // changed from String to ObjectId for proper referencing
    ref: "UserHero",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DriversVideo", driversVideoSchema);
