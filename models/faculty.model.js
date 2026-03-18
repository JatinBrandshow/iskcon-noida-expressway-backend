const { default: mongoose } = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    email: {
      type: String,
    },
    designation: String,
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department", 
      },
    ],
    school: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School", 
      },
    ],
    subjectsTaught: [String],
    qualification: [String], 
    profilePicture: String,
    socialLinks: [],
    status: {
      type: Boolean,
      default: true,
    },
    deleteflag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;