const express = require("express");

const router = express.Router();

// import controller dan middleware
const SetupUserGuestController = require("../controllers/setup-guest");

// all routes
router.get("/get-started", SetupUserGuestController.setupSeeder);
router.post("/create-user-super-admin", SetupUserGuestController.createUserSuperAdmin);

module.exports = router;