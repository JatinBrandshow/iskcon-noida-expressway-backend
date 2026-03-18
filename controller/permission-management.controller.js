const { Permission } = require('../models');

exports.setPermission = async (req, res) => {
    try {
        const { admin, module, actions, subModule } = req.body;
        // Build query safely
        let query = {
            admin,
            module,
        };

        // Check for existing permission
        let permission = await Permission.findOne(query);
        if (permission) {
            permission.actions = actions;
            if (subModule) {
                permission.subModule = subModule;
            }
            await permission.save();
            return res.json({ status: true, message: 'Permission updated', data: permission });
        }

        // Create new permission
        permission = await Permission.create({ admin, module, actions, subModule });
        res.status(201).json({ status: true, message: 'Permission created', data: permission });

    } catch (err) {
        console.error("Error in setPermission:", err);
        res.status(500).json({ status: false, message: err.message });
    }
};

// ✅ Get all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().populate('admin');

        const subAdminPermissions = permissions.filter(p => p.admin?.role === 'SubAdmin');

        res.json({ status: true, data: subAdminPermissions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err.message });
    }
};

// ✅ Get permissions by admin
exports.getPermissionsByAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const permissions = await Permission.find({ admin: adminId });
        res.json({ status: true, data: permissions });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ✅ Get permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ status: false, message: 'Not found' });

        res.json({ status: true, data: permission });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ✅ Delete permission
exports.deletePermission = async (req, res) => {
    try {
        const deleted = await Permission.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, message: 'Not found' });

        res.json({ status: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


