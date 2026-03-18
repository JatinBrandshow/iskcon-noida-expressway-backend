const { PageData } = require("../models");

// Validate required fields
const validatePageData = (body) => {
    const requiredFields = ["pageid", "key", "value", "pageType", "dataType"];
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null || body[field] === "");

    if (missingFields.length > 0) {
        return {
            valid: false,
            message: `Missing required field(s): ${missingFields.join(", ")}`
        };
    }

    return { valid: true };
};

// Add Page Param
exports.addPageParam = async (req, res) => {
    try {
        const validation = validatePageData(req.body);
        if (!validation.valid) {
            return res.json({ status: false, message: validation.message, data: false });
        }

        const param = await PageData.create(req.body);
        res.json({ status: true, message: "Added successfully", data: param });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};

// Get All Params
exports.getAllPageParams = async (req, res) => {
    try {
        const data = await PageData.find({ deleteflag: false });
        res.json({ status: true, message: "Fetched", data });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};
// Get All Params
exports.getAllPageParamsByPageid = async (req, res) => {
    try {
        const { pageId } = req.query;
        console.log(pageId);
        
        const data = await PageData.find({ pageid: pageId, deleteflag: false });
        res.json({ status: true, message: "Fetched", data });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};

// Update Param by ID
exports.updatePageParam = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json({ status: false, message: "Missing param ID", data: false });
        }

        const validation = validatePageData(req.body);
        if (!validation.valid) {
            return res.json({ status: false, message: validation.message, data: false });
        }

        const updated = await PageData.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.json({ status: false, message: "Param not found", data: false });
        }

        res.json({ status: true, message: "Updated", data: updated });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};

// Soft Delete Param by ID
exports.deletePageParam = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json({ status: false, message: "Missing param ID", data: false });
        }

        const deleted = await PageData.findByIdAndUpdate(id, { deleteflag: true }, { new: true });
        if (!deleted) {
            return res.json({ status: false, message: "Param not found", data: false });
        }

        res.json({ status: true, message: "Deleted (soft)", data: true });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};

exports.getUniqueKeysByPageType = async (req, res) => {
    try {
        const { pageType } = req.query;
        console.log(pageType);
        
        if (!pageType) {
            return res.json({ status: false, message: "Missing pageType", data: false });
        }

        const records = await PageData.find({ pageType});
        console.log(records);
        
        const keyMap = new Map();
        records.forEach(item => {
            if (!keyMap.has(item.key)) {
                keyMap.set(item.key, item.dataType);
            }
        });

        const data = Array.from(keyMap.entries()).map(([key, dataType]) => ({ key, dataType }));

        res.json({
            status: true,
            message: "Fetched successfully",
            data: data.length > 0 ? data : []
        });
    } catch (error) {
        res.json({ status: false, message: error.message || "Server error", data: false });
    }
};

