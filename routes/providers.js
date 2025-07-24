const express = require("express")
const ProviderProfile = require("../models/ProviderProfile")
const User = require("../models/User")
const { authenticate, authorize } = require("../middleware/auth")
const { validateProviderProfile } = require("../middleware/validation")

const router = express.Router()

// @route   GET /api/providers
// @desc    Get all active providers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const providers = await ProviderProfile.find({ isActive: true })
      .populate("userId", "name email")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await ProviderProfile.countDocuments({ isActive: true })

    res.json({
      success: true,
      data: {
        providers,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching providers",
      error: error.message,
    })
  }
})

// @route   GET /api/providers/search
// @desc    Search providers by category and location
// @access  Public
router.get("/search", async (req, res) => {
  try {
    const { category, state, lga, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    // Build search query
    const query = { isActive: true }

    if (category) {
      query.category = new RegExp(category, "i")
    }

    if (state) {
      query["location.state"] = new RegExp(state, "i")
    }

    if (lga) {
      query["location.lga"] = new RegExp(lga, "i")
    }

    const providers = await ProviderProfile.find(query)
      .populate("userId", "name email")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ "rating.average": -1, createdAt: -1 })

    const total = await ProviderProfile.countDocuments(query)

    res.json({
      success: true,
      data: {
        providers,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
        searchParams: { category, state, lga },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching providers",
      error: error.message,
    })
  }
})

// @route   GET /api/providers/:id
// @desc    Get provider profile by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id).populate("userId", "name email createdAt")

    if (!provider || !provider.isActive) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      })
    }

    // Add WhatsApp URL to response
    const providerData = provider.toObject()
    providerData.whatsappUrl = provider.getWhatsAppUrl()

    res.json({
      success: true,
      data: providerData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching provider profile",
      error: error.message,
    })
  }
})

// @route   PUT /api/providers/:id/profile
// @desc    Update provider profile
// @access  Private (Provider only)
router.put("/:id/profile", authenticate, authorize("provider"), validateProviderProfile, async (req, res) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id)

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      })
    }

    // Check if the authenticated user owns this profile
    if (provider.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own profile.",
      })
    }

    const { category, bio, location, contact } = req.body

    // Update profile
    provider.category = category
    provider.bio = bio
    provider.location = location
    provider.contact = contact

    await provider.save()

    const updatedProvider = await ProviderProfile.findById(provider._id).populate("userId", "name email")

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProvider,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating provider profile",
      error: error.message,
    })
  }
})

// @route   POST /api/providers/:id/portfolio
// @desc    Add portfolio item
// @access  Private (Provider only)
router.post("/:id/portfolio", authenticate, authorize("provider"), async (req, res) => {
  try {
    const { imageUrl, description } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      })
    }

    const provider = await ProviderProfile.findById(req.params.id)

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      })
    }

    // Check if the authenticated user owns this profile
    if (provider.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own portfolio.",
      })
    }

    // Add portfolio item
    provider.portfolio.push({
      imageUrl,
      description: description || "",
      uploadedAt: new Date(),
    })

    await provider.save()

    res.json({
      success: true,
      message: "Portfolio item added successfully",
      data: provider.portfolio[provider.portfolio.length - 1],
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding portfolio item",
      error: error.message,
    })
  }
})

// @route   POST /api/providers/profile
// @desc    Create provider profile (for new providers)
// @access  Private (Provider only)
router.post("/profile", authenticate, authorize("provider"), validateProviderProfile, async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await ProviderProfile.findOne({ userId: req.user._id })
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Provider profile already exists",
      })
    }

    const { category, bio, location, contact } = req.body

    const profile = new ProviderProfile({
      userId: req.user._id,
      category,
      bio,
      location,
      contact,
      portfolio: [],
    })

    await profile.save()

    const populatedProfile = await ProviderProfile.findById(profile._id).populate("userId", "name email")

    res.status(201).json({
      success: true,
      message: "Provider profile created successfully",
      data: populatedProfile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating provider profile",
      error: error.message,
    })
  }
})

module.exports = router
