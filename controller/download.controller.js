const { Download } = require("../models")


// Get all downloads
const getAllDownloads = async (req, res) => {
    try {
        const { category, search, sortBy } = req.query
        const query = { isActive: true }

        // Filter by category
        if (category && category !== "all") {
            query.category = category
        }

        // Search functionality
        if (search) {
            query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
        }

        let sortOptions = {}
        switch (sortBy) {
            case "newest":
                sortOptions = { createdAt: -1 }
                break
            case "oldest":
                sortOptions = { createdAt: 1 }
                break
            case "popular":
                sortOptions = { downloads: -1 }
                break
            case "name":
                sortOptions = { title: 1 }
                break
            default:
                sortOptions = { createdAt: -1 }
        }

        const downloads = await Download.find(query).sort(sortOptions)

        res.json({
            success: true,
            data: downloads,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching downloads",
            error: error.message,
        })
    }
}

// Get single download
const getDownloadById = async (req, res) => {
    try {
        const download = await Download.findById(req.params.id)

        if (!download) {
            return res.status(404).json({
                success: false,
                message: "Download not found",
            })
        }

        res.json({
            success: true,
            data: download,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching download",
            error: error.message,
        })
    }
}

// Create new download
const createDownload = async (req, res) => {
    try {
        const { title, description, category, featured, fileName, fileUrl, fileSize, fileType } = req.body

        if (!fileUrl) {
            return res.status(400).json({
                success: false,
                message: "File URL is required",
            })
        }

        const download = new Download({
            title,
            description,
            category,
            fileType,
            fileName,
            fileUrl,
            fileSize,
            featured: featured === "true" || featured === true,
        })

        await download.save()

        res.status(201).json({
            success: true,
            message: "Download created successfully",
            data: download,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating download",
            error: error.message,
        })
    }
}

// Update download
const updateDownload = async (req, res) => {
    try {
        const { title, description, category, featured, fileName, fileUrl, fileSize, fileType } = req.body
        const download = await Download.findById(req.params.id)

        if (!download) {
            return res.status(404).json({
                success: false,
                message: "Download not found",
            })
        }

        // Update fields
        download.title = title || download.title
        download.description = description || download.description
        download.category = category || download.category
        download.featured = featured !== undefined ? featured === "true" || featured === true : download.featured

        // Handle file update
        if (fileUrl) {
            download.fileType = fileType || download.fileType
            download.fileName = fileName || download.fileName
            download.fileUrl = fileUrl
            download.fileSize = fileSize || download.fileSize
        }

        await download.save()

        res.json({
            success: true,
            message: "Download updated successfully",
            data: download,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating download",
            error: error.message,
        })
    }
}

// Delete download
const deleteDownload = async (req, res) => {
    try {
        const download = await Download.findById(req.params.id)

        if (!download) {
            return res.status(404).json({
                success: false,
                message: "Download not found",
            })
        }

        await Download.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: "Download deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting download",
            error: error.message,
        })
    }
}

// Download file
const downloadFile = async (req, res) => {
    try {
        const download = await Download.findById(req.params.id)

        if (!download) {
            return res.status(404).json({
                success: false,
                message: "Download not found",
            })
        }

        // Increment download count
        download.downloads += 1
        await download.save()

        // Return file URL for frontend to handle download
        res.json({
            success: true,
            data: {
                fileUrl: download.fileUrl,
                fileName: download.fileName,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error downloading file",
            error: error.message,
        })
    }
}

// Get download statistics
const getDownloadStats = async (req, res) => {
    try {
        const totalDownloads = await Download.countDocuments({ isActive: true })
        const totalDownloadCount = await Download.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$downloads" } } },
        ])

        const categoryStats = await Download.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ])

        res.json({
            success: true,
            data: {
                totalDownloads,
                totalDownloadCount: totalDownloadCount[0]?.total || 0,
                categoryStats,
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

module.exports = {
    getAllDownloads,
    getDownloadById,
    createDownload,
    updateDownload,
    deleteDownload,
    downloadFile,
    getDownloadStats,
}
