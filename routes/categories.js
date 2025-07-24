const express = require("express")
const Category = require("../models/Category")

const router = express.Router()

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).select("name description icon").sort({ name: 1 })

    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    })
  }
})

module.exports = router
