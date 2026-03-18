const mongoose = require("mongoose")

const topperSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        rank: {
            type: Number,
            required: true,
            min: 1,
        },
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        school: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
)

// Index for better query performance
topperSchema.index({ rank: 1 })
topperSchema.index({ year: 1 })
topperSchema.index({ subject: 1 })

module.exports = mongoose.model("Topper", topperSchema)
