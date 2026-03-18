// controllers/faqController.js
const { Faq } = require("../models");

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const faq = new Faq(req.body);
    await faq.save();
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ deleteflag: false });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get FAQs by Page ID
exports.getFaqByPageId = async (req, res) => {
  try {
    const { page_id } = req.params;
    const faqs = await Faq.find({ page_id, deleteflag: false });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Soft Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndUpdate(id, { deleteflag: true }, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
