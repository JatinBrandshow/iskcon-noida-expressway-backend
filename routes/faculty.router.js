const express = require("express");
const router = express.Router();

// import Controllers
const { facultyController } = require("../controller");

// Define Routes
router.post("/add", facultyController.create);
router.post("/update", facultyController.update);
router.get("/list", facultyController.getAll);
router.get("/get-by-id", facultyController.findById);
router.get("/get-by-department-id", facultyController.getByDepartment);
router.get("/search", facultyController.search);
router.get("/delete", facultyController.deleteFaculty);
module.exports = router;
