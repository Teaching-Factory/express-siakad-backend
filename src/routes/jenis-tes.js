const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisTesController = require("../controllers/jenis-tes");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), JenisTesController.getAllJenisTes);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), JenisTesController.getJenisTesById);
router.post("/create", checkRole(["admin", "admin-pmb"]), JenisTesController.createJenisTes);
router.put("/:id/update", checkRole(["admin", "admin-pmb"]), JenisTesController.updateJenisTesById);
router.delete("/:id/delete", checkRole(["admin", "admin-pmb"]), JenisTesController.deleteJenisTesById);

module.exports = router;
