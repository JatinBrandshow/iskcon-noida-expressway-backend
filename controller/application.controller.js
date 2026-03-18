const { Application } = require("../models")


// Create new application
const createApplication = async (req, res) => {
    try {
        const { name, email, mobile, city, discipline, program, day, month, year } = req.body

        // Check if application already exists with this email
        const existingApplication = await Application.findOne({ email })
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "Application already exists with this email address",
            })
        }

        // Create new application
        const application = new Application({
            name,
            email,
            mobile,
            city,
            discipline,
            program,
            dateOfBirth: {
                day,
                month,
                year,
            },
        })

        await application.save()

        res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
            data: {
                id: application._id,
                name: application.name,
                email: application.email,
                applicationStatus: application.applicationStatus,
            },
        })
    } catch (error) {
        console.error("Error creating application:", error)

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message)
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            })
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Application already exists with this email address",
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        })
    }
}

// Get all applications (for admin)
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        })
    } catch (error) {
        console.error("Error fetching applications:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Get application by ID
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            })
        }

        res.status(200).json({
            success: true,
            data: application,
        })
    } catch (error) {
        console.error("Error fetching application:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { applicationStatus: status },
            { new: true, runValidators: true },
        )

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application,
        })
    } catch (error) {
        console.error("Error updating application:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
}
