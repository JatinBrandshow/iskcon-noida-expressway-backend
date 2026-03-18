const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Academic", "Administrative", "Events", "Examinations", "General", "Sports", "Cultural"],
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium",
    },
    department: {
        type: String,
        required: true,
    },
    author: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        designation: {
            type: String,
        },
    },
    attachments: [{
        filename: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
        size: { type: Number },
    }],
    deadline: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

// Update the updatedAt field before saving
noticeSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})

// Index for better search performance
noticeSchema.index({ title: "text", content: "text", tags: "text" })
noticeSchema.index({ category: 1, priority: 1, createdAt: -1 })

module.exports = mongoose.model("Notice", noticeSchema)
