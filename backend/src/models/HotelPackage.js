
const mongoose = require("mongoose");

const hotelPackageSchema = new mongoose.Schema(
  {
    package_name: { type: String, required: [true, "Package name is required"], trim: true,},
    destination: { type: String, required: [true, "Destination is required"], trim: true,},
    check_in: { type: Date, required: [true, "Check-in date is required"],},
    check_out: { type: Date, required: [true, "Check-out date is required"],},
    hotel_name: { type: String, required: [true, "Hotel name is required"], trim: true,},
    alternative_hotel: { type: String, required: [true, "Alternative hotel is required"], trim: true,},
    star_rating: { type: Number, required: [true, "Star rating is required"], min: [1, "Star rating must be at least 1"], max: [5, "Star rating cannot exceed 5"], validate: {   validator: Number.isInteger,   message: "Star rating must be a whole number", },},
    room_type: { type: String, required: [true, "Room type is required"], trim: true,},
    room_count: { type: Number, required: [true, "Room count is required"], min: [1, "Room count must be positive"], validate: {   validator: Number.isInteger,   message: "Room count must be a whole number", },},
    occupancy_type: { type: String, required: [true, "Occupancy type is required"], enum: {   values: ["single", "double", "triple"],   message: "Occupancy must be single, double, or triple", },},
    meal_plan: { type: [   {     type: String,     enum: { values: ["breakfast", "lunch", "dinner"], message: "Meal plan must be breakfast, lunch, or dinner",     },   }, ], required: [true, "Meal plan is required"], validate: {   validator: (value) =>     Array.isArray(value) && value.length > 0,   message: "At least one meal plan is required", },},
    price_per_adult: { type: Number, required: [true, "Price per adult is required"], min: [0.01, "Price must be greater than zero"],},
    currency: { type: String, required: [true, "Currency is required"], enum: {   values: ["INR"],   message: "Currency must be INR", }, default: "INR",},
    minimum_guests: { type: Number, required: [true, "Minimum guests is required"], min: [1, "Minimum guests must be positive"], validate: {   validator: Number.isInteger,   message: "Minimum guests must be a whole number", },},
  },
  {
    timestamps: true,
  }
);

// Validate check-out against check-in during creation and updates.
hotelPackageSchema.pre("validate", function () {
  if (
    this.check_in &&
    this.check_out &&
    this.check_out <= this.check_in
  ) {
    this.invalidate( "check_out", "Check-out date must be later than check-in date"
    );
  }
});

module.exports = mongoose.model(
  "HotelPackage",
  hotelPackageSchema
);
