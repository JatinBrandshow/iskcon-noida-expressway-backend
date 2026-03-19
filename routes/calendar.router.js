const express = require("express");
const router = express.Router();

// Import the Middlewares
const { apikeyAuth, validateRequestBody } = require("../middlewares");

// Import the Guest User controller
const { calendarController } = require("../controller");

// router.post("/", validateRequestBody(["apiKey", "url", "domainSecreteCode"]), apikeyAuth,calendarDataController.calendarData );
router.post("/", apikeyAuth, calendarController.getTithi);
router.post("/get-tithi-by-date", apikeyAuth, calendarController.getTithiByDate);
router.post("/add", apikeyAuth, calendarController.addCalender);
router.post("/update", apikeyAuth, calendarController.updateCalender);
router.post("/delete", apikeyAuth, calendarController.deleteCalenderdetails);
router.post("/getAll", apikeyAuth, calendarController.getCalender);
router.post("/get-by-id", apikeyAuth, calendarController.getCalenderById);
router.post("/get-by-date", apikeyAuth, calendarController.getCalenderBydate);

module.exports = router;
