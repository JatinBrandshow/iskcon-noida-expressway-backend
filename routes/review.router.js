const express = require("express");
const router = express.Router();
const  {reviewController } = require("../controller");

// Create a new review
router.post('/create', reviewController.createReview);

// Get all reviews (with optional page_id query parameter)
router.get('/get-all', reviewController.getAllReviews);

// Get reviews by page_id
router.get('/:page_id', reviewController.getReviewsByPageId);

// Get single review by ID
router.get('/:id', reviewController.getReviewById);

// Update a review
router.put('/:id', reviewController.updateReview);

// Soft delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
