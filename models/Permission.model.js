const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin', // assuming you have an Admin model
        required: true
    },
    module: {
        type: String,
        required: true
    },
    subModule: {
        type: [String],
    },
    actions: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete', 'view', 'edit'],
        default: []
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Permission', permissionSchema);
