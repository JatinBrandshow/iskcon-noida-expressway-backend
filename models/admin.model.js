const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SuperAdmin', 'SubAdmin'], default: 'SubAdmin' },
    sid: { type: Number, unique: true } // sid is a number
});

// Hash password before save
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate unique sid before save
AdminSchema.pre('save', async function (next) {
    if (this.sid) return next(); // sid already set
    let unique = false;
    let newSid;
    while (!unique) {
        // Generate random 6 digit number
        newSid = Math.floor(100000 + Math.random() * 900000);
        const existing = await mongoose.models.Admin.findOne({ sid: newSid });
        if (!existing) unique = true;
    }
    this.sid = newSid;
    next();
});

// Compare Password
AdminSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
