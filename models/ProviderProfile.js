const mongoose = require("mongoose")

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    location: {
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      lga: {
        type: String,
        required: [true, "LGA is required"],
        trim: true,
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^(\+234|234|0)[789][01]\d{8}$/, "Please enter a valid Nigerian phone number"],
      },
      whatsapp: {
        type: String,
        required: [true, "WhatsApp number is required"],
        match: [/^(\+234|234|0)[789][01]\d{8}$/, "Please enter a valid Nigerian WhatsApp number"],
      },
      email: {
        type: String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
      },
    },
    portfolio: [
      {
        imageUrl: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          maxlength: [200, "Description cannot exceed 200 characters"],
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search optimization
providerProfileSchema.index({ category: 1, "location.state": 1, "location.lga": 1 })
providerProfileSchema.index({ isActive: 1, isVerified: 1 })

// Method to format phone numbers for WhatsApp
providerProfileSchema.methods.getWhatsAppUrl = function () {
  let phone = this.contact.whatsapp

  // Convert local format to international
  if (phone.startsWith("0")) {
    phone = "234" + phone.substring(1)
  } else if (phone.startsWith("+234")) {
    phone = phone.substring(1)
  } else if (!phone.startsWith("234")) {
    phone = "234" + phone
  }

  return `https://wa.me/${phone}`
}

module.exports = mongoose.model("ProviderProfile", providerProfileSchema)
