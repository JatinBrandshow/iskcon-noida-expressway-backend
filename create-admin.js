const mongoose = require('mongoose');
const Admin = require('./models/admin.model');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const name = "Admin";
        const email = "admin@iskcon.com";
        const password = "adminpassword123"; // You should change this!
        const role = "SuperAdmin";

        const existing = await Admin.findOne({ email });
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const admin = await Admin.create({ name, email, password, role });
        console.log(`Admin created successfully: ${admin.email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
