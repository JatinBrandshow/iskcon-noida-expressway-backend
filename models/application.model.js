const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
            minlength: [2, "City must be at least 2 characters long"],
        },
        discipline: {
            type: String,
            required: [true, "Discipline is required"],
            enum: ["B.Tech", "M.Tech", "Master of Computer Applications (MCA)"],
        },
        program: {
            type: String,
            required: [true, "Program is required"],
        },
        dateOfBirth: {
            day: {
                type: String,
                required: [true, "Day is required"],
                match: [/^(0[1-9]|[12][0-9]|3[01])$/, "Please enter a valid day"],
            },
            month: {
                type: String,
                required: [true, "Month is required"],
            },
            year: {
                type: String,
                required: [true, "Year is required"],
                match: [/^(19|20)\d{2}$/, "Please enter a valid year"],
            },
        },
        applicationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    },
)

// Custom validation for program based on discipline
applicationSchema.pre("save", function (next) {
    const validPrograms = {
        "B.Tech": [
            "B.Tech Computer Science and Engineering",
            "B.Tech Computer Science and Engineering (Artificial Intelligence & Machine Learning)",
            "B.Tech Computer Science and Engineering (Data Science)",
            "B.Tech Computer Science",
            "B.Tech Computer Science and Engineering (Hindi)",
            "B.Tech Artificial Intelligence & Machine Learning",
            "B.Tech Information Technology",
            "B.Tech Computer Science and Information Technology",
            "B.Tech Electronics and Communication Engineering",
            "B.Tech Mechanical Engineering",
            "B.Tech Electrical and Electronics Engineering",
            "B.Tech Civil Engineering",
        ],
        "M.Tech": [
            "M.Tech Computer Science and Engineering",
            "M.Tech Electrical and Electronics Engineering",
            "M.Tech Electronics and Communication Engineering",
            "M.Tech Mechanical Engineering",
        ],
        "Master of Computer Applications (MCA)": ["MCA"],
    }

    if (!validPrograms[this.discipline]?.includes(this.program)) {
        next(new Error("Invalid program for selected discipline"))
    }
    next()
})

module.exports = mongoose.model("Application", applicationSchema)
