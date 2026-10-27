
const mongoose = require("mongoose");
const HotelPackage = require("../models/HotelPackage");

// GET: Get all hotel packages
const getAllHotelPackages = async (req, res) => {
  try {
    const hotelPackages = await HotelPackage.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: hotelPackages.length,
      data: hotelPackages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET: Get a single hotel package by ID
const getOneHotelPackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel package ID",
      });
    }

    const hotelPackage = await HotelPackage.findById(id);

    if (!hotelPackage) {
      return res.status(404).json({
        success: false,
        message: "Hotel package not found",
      });
    }

    res.json({
      success: true,
      data: hotelPackage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST: Create a hotel package
const createHotelPackage = async (req, res) => {
  try {
    const {
      package_name,
      destination,
      check_in,
      check_out,
      hotel_name,
      alternative_hotel,
      star_rating,
      room_type,
      room_count,
      occupancy_type,
      meal_plan,
      price_per_adult,
      currency,
      minimum_guests,
    } = req.body;

    if (
      !package_name ||
      !destination ||
      !check_in ||
      !check_out ||
      !hotel_name ||
      !alternative_hotel ||
      star_rating == null ||
      !room_type ||
      room_count == null ||
      !occupancy_type ||
      price_per_adult == null ||
      !currency ||
      minimum_guests == null ||
      !Array.isArray(meal_plan) ||
      meal_plan.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required hotel package fields",
      });
    }

    const hotelPackage = await HotelPackage.create({
      package_name,
      destination,
      check_in,
      check_out,
      hotel_name,
      alternative_hotel,
      star_rating,
      room_type,
      room_count,
      occupancy_type,
      meal_plan,
      price_per_adult,
      currency,
      minimum_guests,
    });

    res.status(201).json({
      success: true,
      message: "Hotel package created successfully",
      data: hotelPackage,
    });
  } catch (err) {
    if (
      err.name === "ValidationError" ||
      err.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PUT: Update a hotel package
const updateHotelPackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel package ID",
      });
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide fields to update",
      });
    }

    const hotelPackage = await HotelPackage.findById(id);

    if (!hotelPackage) {
      return res.status(404).json({
        success: false,
        message: "Hotel package not found",
      });
    }

    const updates = { ...req.body };

    // Prevent changes to MongoDB-managed fields.
    delete updates._id;
    delete updates.id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;

    hotelPackage.set(updates);

    const updatedPackage = await hotelPackage.save();

    res.json({
      success: true,
      message: "Hotel package updated successfully",
      data: updatedPackage,
    });
  } catch (err) {
    if (
      err.name === "ValidationError" ||
      err.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE: Delete a hotel package
const deleteHotelPackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel package ID",
      });
    }

    const hotelPackage = await HotelPackage.findByIdAndDelete(id);

    if (!hotelPackage) {
      return res.status(404).json({
        success: false,
        message: "Hotel package not found",
      });
    }

    res.json({
      success: true,
      message: "Hotel package deleted successfully",
      data: {
        _id: hotelPackage._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllHotelPackages,
  getOneHotelPackage,
  createHotelPackage,
  updateHotelPackage,
  deleteHotelPackage,
};
