const { Notice } = require("../models")

// Get all notices with filtering and pagination
exports.getAllNotices = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            priority,
            department,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query

        // Build filter object
        const filter = { isActive: true }

        if (category) filter.category = category
        if (priority) filter.priority = priority
        if (department) filter.department = department

        // Add search functionality
        if (search) {
            filter.$text = { $search: search }
        }

        // Calculate pagination
        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

        // Build sort object
        const sort = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        const notices = await Notice.find(filter).sort(sort).skip(skip).limit(Number.parseInt(limit))

        const total = await Notice.countDocuments(filter)

        res.json({
            success: true,
            data: {
                notices,
                pagination: {
                    currentPage: Number.parseInt(page),
                    totalPages: Math.ceil(total / Number.parseInt(limit)),
                    totalNotices: total,
                    hasNext: skip + notices.length < total,
                    hasPrev: Number.parseInt(page) > 1,
                },
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching notices",
            error: error.message,
        })
    }
}

// Get single notice by ID
exports.getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id)

        if (!notice || !notice.isActive) {
            return res.status(404).json({
                success: false,
                message: "Notice not found",
            })
        }

        // Increment view count
        notice.views += 1
        await notice.save()

        res.json({
            success: true,
            data: notice,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching notice",
            error: error.message,
        })
    }
}

// Create new notice
exports.createNotice = async (req, res) => {
    try {
        const noticeData = req.body

        // Validate required fields
        const requiredFields = ["title", "content", "category", "department", "author"]
        for (const field of requiredFields) {
            if (!noticeData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`,
                })
            }
        }

        const notice = new Notice(noticeData)
        await notice.save()

        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            data: notice,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating notice",
            error: error.message,
        })
    }
}

// Update notice
exports.updateNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id)

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found",
            })
        }

        Object.assign(notice, req.body)
        notice.updatedAt = Date.now()
        await notice.save()

        res.json({
            success: true,
            message: "Notice updated successfully",
            data: notice,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating notice",
            error: error.message,
        })
    }
}

// Delete notice (soft delete)
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id)

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found",
            })
        }

        notice.isActive = false
        await notice.save()

        res.json({
            success: true,
            message: "Notice deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting notice",
            error: error.message,
        })
    }
}

// Get notice statistics
exports.getNoticeStats = async (req, res) => {
    try {
        const stats = await Notice.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalNotices: { $sum: 1 },
                    totalViews: { $sum: "$views" },
                    categoryCounts: {
                        $push: "$category",
                    },
                    priorityCounts: {
                        $push: "$priority",
                    },
                },
            },
        ])

        const categoryStats = await Notice.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ])

        const priorityStats = await Notice.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ])

        res.json({
            success: true,
            data: {
                overview: stats[0] || { totalNotices: 0, totalViews: 0 },
                categories: categoryStats,
                priorities: priorityStats,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: error.message,
        })
    }
}
