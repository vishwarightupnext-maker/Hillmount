const router = require("express").Router();

const {
  getAllHotelPackages,
  getOneHotelPackage,
  createHotelPackage,
  updateHotelPackage,
  deleteHotelPackage,
} = require("../controllers/hotelPackageController");

router.get("/", getAllHotelPackages);
router.get("/:id", getOneHotelPackage);
router.post("/", createHotelPackage);
router.put("/:id", updateHotelPackage);
router.delete("/:id", deleteHotelPackage);

module.exports = router;
