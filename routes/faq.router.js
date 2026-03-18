// routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const  { faqController } = require("../controller");

router.post("/create", faqController.createFaq); 
router.get("/get-all", faqController.getAllFaqs); 
router.get("/:page_id", faqController.getFaqByPageId);
router.put("/:id", faqController.updateFaq); 
router.delete("/:id", faqController.deleteFaq); 

module.exports = router;
