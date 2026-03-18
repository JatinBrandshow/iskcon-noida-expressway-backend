// routes/testimonial.routes.js
const express = require('express');
const router = express.Router();
const {  testimonialController } = require('../controller');

// Create a new testimonial
router.post('/create', testimonialController.createTestimonial);

// Get all testimonials
router.get('/get-all', testimonialController.getAllTestimonials);

// Get testimonials by specific page_id 
router.get('/:page_id', testimonialController.getTestimonialsByPageId);

// Get testimonials by minimum rating 
router.get('/rating', testimonialController.getTestimonialsByRating);

// Get single testimonial by ID
router.get('/:id', testimonialController.getTestimonialById);

// Update a testimonial
router.put('/:id', testimonialController.updateTestimonial);

router.post('/add-to-page', testimonialController.addTestimonialToPage);

// Delete a testimonial
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;