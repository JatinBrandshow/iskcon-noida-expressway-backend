const { AdminLog, Admin } = require("../models");

const saveAdminLog = async (req, res) => {
    try {
        const {
            adminId,
            module,
            action,
            targetId,
            targetLabel,
            description
        } = req.body;

        const log = new AdminLog({
            adminId,
            module,
            action,
            targetId,
            targetLabel,
            description,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        await log.save();

        return res.status(200).json({ status: true, message: "Log saved" });
    } catch (err) {
        console.error("Log save error:", err);
        return res.status(500).json({ status: false, message: "Log error", error: err.message });
    }
};
const getAdminLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            adminId,
            module,
            action,
            startDate,
            endDate,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        // Exclude SuperAdmin logs
        filter.adminId = { $ne: '6890469fdced36228146a302' };

        if (adminId) {
            // If adminId filter is provided, combine it with the exclusion
            filter.adminId = {
                $ne: '6890469fdced36228146a302',
                $eq: adminId
            };
        }
        if (module) filter.module = new RegExp(module, 'i');
        if (action) filter.action = new RegExp(action, 'i');

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Search in description and targetLabel
        if (search) {
            filter.$or = [
                { ipAddress: new RegExp(search.trim(), 'i') },
                { description: new RegExp(search.trim(), 'i') },
                { targetLabel: new RegExp(search.trim(), 'i') }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with population
        const logs = await AdminLog.find(filter)
            .populate('adminId', 'name email username')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalLogs = await AdminLog.countDocuments(filter);
        const totalPages = Math.ceil(totalLogs / parseInt(limit));

        // Get unique values for filter dropdowns
        const modules = await AdminLog.distinct('module');
        const actions = await AdminLog.distinct('action');

        // Get unique admins for filter dropdown (excluding SuperAdmin)
        const adminIds = await AdminLog.distinct('adminId', {
            adminId: { $ne: '6890469fdced36228146a302' }
        });

        // Populate admin details for the dropdown
        const admins = await Admin.find(
            {
                _id: { $in: adminIds },
                _id: { $ne: '6890469fdced36228146a302' }
            },
            'name email username'
        ).sort({ name: 1 });

        return res.status(200).json({
            status: true,
            data: {
                logs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalLogs,
                    hasNext: parseInt(page) < totalPages,
                    hasPrev: parseInt(page) > 1
                },
                filters: {
                    modules,
                    actions,
                    admins // Add this line
                }
            }
        });

    } catch (err) {
        console.error("Get logs error:", err);
        return res.status(500).json({
            status: false,
            message: "Error fetching logs",
            error: err.message
        });
    }
};


module.exports = { saveAdminLog, getAdminLogs };
