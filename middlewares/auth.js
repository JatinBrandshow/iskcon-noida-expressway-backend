const jwt = require('jsonwebtoken');
const { Admin } = require('../models');


// const userAuth = async (req, res, next) => {
//     try {
//         const { token } = req.cookies;

//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await Admin.findById(decoded._id);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({ message: "Invalid token" });
//         }

//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Token expired" });
//         }

//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

const userAuth = async (req, res, next) => {
  next();
};


module.exports = {
    userAuth
}