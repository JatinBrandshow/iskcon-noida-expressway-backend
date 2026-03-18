const { Faculty, Departments, School } = require("../models");
const mongoose = require("mongoose");

const create = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      designation,
      school,
      department, 
      subjectsTaught,
      qualification,
      profilePicture,
      socialLinks,
    } = req.body;

    // Validate the request
    if (
      !firstName ||
      !email ||
      !subjectsTaught ||
      !designation ||
      !school ||
      !Array.isArray(department) ||
      department.length === 0
    ) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all required fields, including departments",
        data: false,
      });
    }

    const schoolExists = await School.findOne({ _id: school });
    if (!schoolExists) {
      return res.status(400).json({
        status: false,
        message: "School does not exist!",
        data: false,
      });
    }

    // Validate each department ID
    const validDepartments = [];
    for (const depId of department) {
      if (!mongoose.Types.ObjectId.isValid(depId)) {
        return res.status(400).json({
          status: false,
          message: `Invalid department ID: ${depId}`,
          data: false,
        });
      }

      const departmentExists = await Departments.findOne({ _id: depId });
      if (!departmentExists) {
        return res.status(400).json({
          status: false,
          message: `Department does not exist with ID: ${depId}`,
          data: false,
        });
      }
      validDepartments.push(departmentExists);
    }

    // Create a new faculty
    const faculty = new Faculty({
      firstName,
      lastName,
      email,
      designation,
      school,
      department,
      subjectsTaught,
      qualification, // नया field जोड़ा गया
      profilePicture,
      socialLinks,
      status: true,
      deleteflag: false,
    });

    // Save the faculty
    await faculty.save();

    // Link the faculty to each department
    for (const dep of validDepartments) {
      dep.faculty = dep.faculty || [];
      dep.faculty.push(faculty._id);
      await dep.save();
    }

    return res.status(201).json({
      status: true,
      message: "Faculty created successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error: " + error.message,
      data: false,
    });
  }
};

const update = async (req, res) => {
  try {
    const {
      _id,
      firstName,
      lastName,
      email,
      school,
      designation,
      departments, 
      subjectsTaught,
      qualification, 
      profilePicture,
      socialLinks,
    } = req.body;

    // Validate the _id
    if (mongoose.Types.ObjectId.isValid(_id) === false) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }
    if (mongoose.Types.ObjectId.isValid(school) === false) {
      return res.status(400).json({
        status: false,
        message: "Invalid school _id!",
        data: false,
      });
    }

    const checkFaculty = await Faculty.findOne({ _id });
    if (!checkFaculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    const schoolExists = await School.findOne({ _id: school });
    if (!schoolExists) {
      return res.status(400).json({
        status: false,
        message: "School does not exist!",
        data: false,
      });
    }

    // Validate the departments array
    if (departments && Array.isArray(departments)) {
      const departmentExistsPromises = departments.map((department) =>
        mongoose.Types.ObjectId.isValid(department)
          ? Departments.findOne({ _id: department })
          : null
      );
      const departmentExists = await Promise.all(departmentExistsPromises);

      // Check if all departments are valid
      const invalidDepartments = departmentExists.filter((dept) => !dept);
      if (invalidDepartments.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Some departments are invalid!",
          data: false,
        });
      }

      // Remove the faculty from old departments and add to new ones
      const oldDepartments = await Departments.find({ faculty: _id });

      // Remove faculty from old departments
      for (let oldDept of oldDepartments) {
        if (!departments.includes(oldDept._id.toString())) {
          oldDept.faculty = oldDept.faculty.filter(
            (faculty) => faculty.toString() !== _id
          );
          await oldDept.save();
        }
      }

      // Add faculty to new departments
      for (let department of departmentExists) {
        if (!department.faculty.includes(_id)) {
          department.faculty.push(_id);
          await department.save();
        }
      }
    }

    // Update the faculty
    const faculty = await Faculty.findOneAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        email,
        designation,
        school,
        department: departments,
        subjectsTaught,
        qualification, // नया field जोड़ा गया
        profilePicture,
        socialLinks,
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const faculty = await Faculty.find({
      deleteflag: false,
      status: true,
    }).populate("department").populate("school");

    if (!faculty || faculty.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};

const findById = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }
    const faculty = await Faculty.findOne({
      _id,
      deleteflag: false,
      status: true,
    }).populate("department").populate("school");
    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};

const getByDepartment = async (req, res) => {z
  try {
    const { department } = req.query;
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        status: false,
        message: "Invalid department _id!",
        data: false,
      });
    }
    const faculty = await Faculty.find({
      department,
      deleteflag: false,
      status: true,
    }).populate("department").populate("school");

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};

const search = async (req, res) => {
  try {
    const { search } = req.query;
    const faculty = await Faculty.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { subjectsTaught: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } }, // नया field जोड़ा गया
        { socialLinks: { $regex: search, $options: "i" } },
      ],
      deleteflag: false,
      status: true,
    }).populate("department").populate("school");

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Faculty retrieved successfully",
      data: faculty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error " + error,
      data: false,
    });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { _id } = req.query;

    // Validate the _id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid faculty _id!",
        data: false,
      });
    }

    // Find and mark the faculty as deleted
    const faculty = await Faculty.findOneAndUpdate(
      { _id },
      { deleteflag: true, status: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(400).json({
        status: false,
        message: "Faculty does not exist!",
        data: false,
      });
    }

    // Handle multiple departments
    if (faculty.department && Array.isArray(faculty.department)) {
      const departments = await Departments.find({
        _id: { $in: faculty.department },
      });

      for (const department of departments) {
        department.faculty = department.faculty.filter(
          (facultyId) => facultyId.toString() !== _id
        );
        await department.save();
      }
    }

    return res.status(200).json({
      status: true,
      message: "Faculty deleted successfully",
      data: faculty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error: " + error.message,
      data: false,
    });
  }
};

module.exports = {
  create,
  update,
  findById,
  getAll,
  getByDepartment,
  search,
  deleteFaculty,
};
