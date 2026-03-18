const { Topper } = require("../models")

// Get all toppers
const getAllToppers = async (req, res) => {
    try {
        const { page = 1, limit = 10, year, subject, sortBy = "rank", sortOrder = "asc" } = req.query

        // Build filter object
        const filter = {}
        if (year) filter.year = year
        if (subject) filter.subject = new RegExp(subject, "i")

        // Build sort object
        const sort = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        const toppers = await Topper.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const total = await Topper.countDocuments(filter)

        res.status(200).json({
            success: true,
            data: {
                toppers,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total,
            },
            message: "Toppers retrieved successfully",
        })
    } catch (error) {
        console.error("Error fetching toppers:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching toppers",
            error: error.message,
        })
    }
}

// Get single topper by ID
const getTopperById = async (req, res) => {
    try {
        const { id } = req.params
        const topper = await Topper.findById(id)

        if (!topper) {
            return res.status(404).json({
                success: false,
                message: "Topper not found",
            })
        }

        res.status(200).json({
            success: true,
            data: topper,
            message: "Topper retrieved successfully",
        })
    } catch (error) {
        console.error("Error fetching topper:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching topper",
            error: error.message,
        })
    }
}

// Create new topper
const createTopper = async (req, res) => {
    try {
        const { name, rank, percentage, school, year, subject, profileImage } = req.body

        // Validate required fields
        if (!name || !rank || !percentage || !school || !year || !subject) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            })
        }

        // Check if rank already exists for the same year and subject
        const existingTopper = await Topper.findOne({ rank, year, subject })
        if (existingTopper) {
            return res.status(400).json({
                success: false,
                message: `Rank ${rank} already exists for ${subject} in ${year}`,
            })
        }

        const newTopper = new Topper({
            name,
            rank: Number.parseInt(rank),
            percentage: Number.parseFloat(percentage),
            school,
            year,
            subject,
            profileImage: profileImage || "",
        })

        const savedTopper = await newTopper.save()

        res.status(201).json({
            success: true,
            data: savedTopper,
            message: "Topper created successfully",
        })
    } catch (error) {
        console.error("Error creating topper:", error)
        res.status(500).json({
            success: false,
            message: "Error creating topper",
            error: error.message,
        })
    }
}

// Update topper
const updateTopper = async (req, res) => {
    try {
        const { id } = req.params
        const { name, rank, percentage, school, year, subject, profileImage } = req.body

        const topper = await Topper.findById(id)
        if (!topper) {
            return res.status(404).json({
                success: false,
                message: "Topper not found",
            })
        }

        // Check if rank already exists for the same year and subject (excluding current topper)
        if (rank && (rank !== topper.rank || year !== topper.year || subject !== topper.subject)) {
            const existingTopper = await Topper.findOne({
                rank,
                year: year || topper.year,
                subject: subject || topper.subject,
                _id: { $ne: id },
            })

            if (existingTopper) {
                return res.status(400).json({
                    success: false,
                    message: `Rank ${rank} already exists for ${subject || topper.subject} in ${year || topper.year}`,
                })
            }
        }

        // Update fields
        if (name) topper.name = name
        if (rank) topper.rank = Number.parseInt(rank)
        if (percentage) topper.percentage = Number.parseFloat(percentage)
        if (school) topper.school = school
        if (year) topper.year = year
        if (subject) topper.subject = subject
        if (profileImage !== undefined) topper.profileImage = profileImage

        const updatedTopper = await topper.save()

        res.status(200).json({
            success: true,
            data: updatedTopper,
            message: "Topper updated successfully",
        })
    } catch (error) {
        console.error("Error updating topper:", error)
        res.status(500).json({
            success: false,
            message: "Error updating topper",
            error: error.message,
        })
    }
}

// Delete topper
const deleteTopper = async (req, res) => {
    try {
        const { id } = req.params

        const topper = await Topper.findById(id)
        if (!topper) {
            return res.status(404).json({
                success: false,
                message: "Topper not found",
            })
        }

        await Topper.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Topper deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting topper:", error)
        res.status(500).json({
            success: false,
            message: "Error deleting topper",
            error: error.message,
        })
    }
}

// Get topper statistics
const getTopperStats = async (req, res) => {
    try {
        const totalToppers = await Topper.countDocuments()

        const avgPercentage = await Topper.aggregate([
            {
                $group: {
                    _id: null,
                    avgPercentage: { $avg: "$percentage" },
                },
            },
        ])

        const topRank = await Topper.findOne().sort({ rank: 1 })

        const schoolCount = await Topper.distinct("school")

        const yearlyStats = await Topper.aggregate([
            {
                $group: {
                    _id: "$year",
                    count: { $sum: 1 },
                    avgPercentage: { $avg: "$percentage" },
                },
            },
            { $sort: { _id: -1 } },
        ])

        const subjectStats = await Topper.aggregate([
            {
                $group: {
                    _id: "$subject",
                    count: { $sum: 1 },
                    avgPercentage: { $avg: "$percentage" },
                },
            },
            { $sort: { count: -1 } },
        ])

        res.status(200).json({
            success: true,
            data: {
                totalToppers,
                avgPercentage: avgPercentage[0]?.avgPercentage || 0,
                topRank: topRank?.rank || 0,
                totalSchools: schoolCount.length,
                yearlyStats,
                subjectStats,
            },
            message: "Statistics retrieved successfully",
        })
    } catch (error) {
        console.error("Error fetching statistics:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: error.message,
        })
    }
}

module.exports = {
    getAllToppers,
    getTopperById,
    createTopper,
    updateTopper,
    deleteTopper,
    getTopperStats,
}
