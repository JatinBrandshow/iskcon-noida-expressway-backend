// controllers/testimonial.controller.js
const { Testimonial } = require("../models");

// Create Testimonial (with page_ids)
const createTestimonial = async (req, res) => {
  try {
    const { name, rating, position, description, company_name, company_city, company_country, image, page_ids } = req.body;

    const testimonial = new Testimonial({
      name,
      rating,
      position,
      description,
      company_name,
      company_city,
      company_country,
      image,
      page_ids: page_ids || [] // Make page_ids optional, default to empty array
    });

    await testimonial.save();
    res.status(201).json({ success: true, message: "Testimonial created", data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get All Testimonials (with optional page_id filter)
const getAllTestimonials = async (req, res) => {
  try {
    const { page_id } = req.query;
    const filter = { deleteflag: false };
    
    if (page_id) {
      filter.page_id = page_id;
    }

    const testimonials = await Testimonial.find(filter);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTestimonialsByPageId = async (req, res) => {
  try {
    const { page_id } = req.params;
    const testimonials = await Testimonial.find({ 
      page_ids: page_id, // Now checking if page_id exists in page_ids array
      deleteflag: false 
    });
    
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Testimonial
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add testimonial to page (new separate endpoint)
const addTestimonialToPage = async (req, res) => {
  try {
    const { testimonial_id, page_id } = req.body;

    // Validate input
    if (!testimonial_id || !page_id) {
      return res.status(400).json({
        success: false,
        message: "Both testimonial_id and page_id are required"
      });
    }

    // Get the current testimonial
    const currentTestimonial = await Testimonial.findById(testimonial_id);
    if (!currentTestimonial) {
      return res.status(404).json({ 
        success: false, 
        message: "Testimonial not found" 
      });
    }

    // Check if page_id already exists
    if (currentTestimonial.page_ids.includes(page_id)) {
      return res.status(400).json({
        success: false,
        message: "Testimonial already exists on this page"
      });
    }

    // Add the page_id to the array
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonial_id,
      { $addToSet: { page_ids: page_id } }, // $addToSet prevents duplicates
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial added to page successfully", 
      data: updatedTestimonial 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Keep the existing updateTestimonial for general updates
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // First get the current testimonial
    const currentTestimonial = await Testimonial.findById(id);
    if (!currentTestimonial) {
      return res.status(404).json({ 
        success: false, 
        message: "Testimonial not found" 
      });
    }

    // Handle page_ids update - prevent modification if exists
    if (updateData.page_ids) {
      if (currentTestimonial.page_ids && currentTestimonial.page_ids.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot modify page_ids directly. Use the add-to-page endpoint instead."
        });
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial updated", 
      data: testimonial 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Soft Delete Testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { deleteflag: true },
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Testimonial deleted (soft)", 
      data: testimonial 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Testimonials by Rating (additional filter)
const getTestimonialsByRating = async (req, res) => {
  try {
    const { minRating } = req.query;
    const filter = { 
      deleteflag: false,
      rating: { $gte: parseInt(minRating) || 1 } 
    };

    const testimonials = await Testimonial.find(filter);
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsByPageId,
  getTestimonialById,
  updateTestimonial,
  addTestimonialToPage,
  deleteTestimonial,
  getTestimonialsByRating
};