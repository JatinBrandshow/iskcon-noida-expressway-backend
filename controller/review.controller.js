const { Review } = require("../models");

// Create Review (with page_id)
const createReview = async (req, res) => {
  try {
    const { name, course, company_name, description, image, page_id } = req.body;

    const review = new Review({
      name,
      course,
      company_name,
      description,
      image,
      page_ids: page_id ? [page_id] : [], // Initialize as array
    });

    await review.save();
    res.status(201).json({ 
      success: true, 
      message: "Review created", 
      data: review 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get All Reviews (with optional page_id filter)
const getAllReviews = async (req, res) => {
  try {
    const { page_id } = req.query;
    const filter = { deleteflag: false };
    
    if (page_id) {
      filter.page_id = page_id;
    }

    const reviews = await Review.find(filter);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Reviews by Page ID (updated version)
const getReviewsByPageId = async (req, res) => {
  try {
    const { page_id } = req.params;
    
    // Find reviews where either:
    // 1. page_id matches exactly (legacy)
    // 2. page_ids array contains the page_id (new)
    const reviews = await Review.find({
      $or: [
        { page_id: page_id },
        { page_ids: page_id }
      ],
      deleteflag: false
    });
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get Single Review
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { page_id, ...otherUpdates } = req.body;
    
    // First get the current review
    const currentReview = await Review.findById(id);
    if (!currentReview) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }

    // If a new page_id is being added
    if (page_id) {
      // Convert to string for comparison
      const pageIdStr = page_id.toString();
      
      // Check if this page_id already exists
      const exists = currentReview.page_ids.some(id => id.toString() === pageIdStr);
      
      if (!exists) {
        // Add to array if not already present
        await Review.findByIdAndUpdate(
          id,
          { 
            $addToSet: { page_ids: page_id }, // Safely add to array
            $set: { 
              ...otherUpdates,
              // Update single page_id only if array was empty
              page_id: currentReview.page_ids.length === 0 ? page_id : currentReview.page_id
            }
          },
          { new: true }
        );
      } else {
        // Just update other fields if page_id already exists
        await Review.findByIdAndUpdate(
          id,
          { $set: otherUpdates },
          { new: true }
        );
      }
    } else {
      // Update only other fields if no page_id provided
      await Review.findByIdAndUpdate(
        id,
        { $set: otherUpdates },
        { new: true }
      );
    }

    const updatedReview = await Review.findById(id);
    
    res.status(200).json({ 
      success: true, 
      message: "Review updated", 
      data: updatedReview 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Soft Delete Review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { deleteflag: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted (soft)", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByPageId,
  getReviewById,
  updateReview,
  deleteReview,
};