const { ExtraParamsData } = require('../models')

exports.createParam = async (req, res) => {
    try {
        const data = req.body;

        if (!data?.pageid || !data?.holder || !data?.param || !data?.type) {
            return res.json({
                status: false,
                message: "Missing required fields: pageid, holder, param, type",
                data: false
            });
        }

        const exists = await ExtraParamsData.findOne({
            pageid: data.pageid,
            holder: data.holder,
            deleteflag: false
        });

        if (exists) {
            return res.json({
                status: false,
                message: `${data.holder} already exists for this page.`,
                data: false
            });
        }

        const param = new ExtraParamsData({
            pageid: data.pageid,
            param: data.param,
            subparam: data.subparam || "",
            paramDesc: data.paramDesc || "",
            paramImg: Array.isArray(data.paramImg) ? data.paramImg : [],
            paramUrl: data.paramUrl || "",
            orderSequence: data.orderSequence || 0,
            type: data.type,
            holder: data.holder,
            widgetType: data.widgetType || "",
            status: data.status !== undefined ? data.status : true,
            addedby: data.addedby || "",
            pdfs: Array.isArray(data.pdfs) ? data.pdfs : [],
            params: Array.isArray(data.params) ? data.params : [],
            extraData: Array.isArray(data.extraData) ? data.extraData : []
        });

        await param.save();

        return res.json({
            status: true,
            message: "Holder added successfully.",
            data: param
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            message: error.message,
            data: false
        });
    }
};


exports.getAllParams = async (req, res) => {
    try {
        const params = await ExtraParamsData.find({ deleteflag: false });
        res.json({ status: true, message: "Params fetched", data: params });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

exports.getParamById = async (req, res) => {
    try {
        const param = await ExtraParamsData.findById(req.params.id);
        if (!param || param.deleteflag) {
            return res.json({ status: false, message: "ExtraParamsData not found", data: false });
        }
        res.json({ status: true, message: "ExtraParamsData found", data: param });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

// controllers/param.controller.js
exports.updateParam = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        if (!id) {
            return res.json({
                status: false,
                message: "ID is required in params",
                data: false
            });
        }

        const existing = await ExtraParamsData.findOne({
            _id: { $ne: id },
            pageid: data.pageid,
            holder: data.holder,
            deleteflag: false
        });

        if (existing) {
            return res.json({
                status: false,
                message: `The holder '${data.holder}' already exists for this page.`,
                data: false
            });
        }

        data.editedon = new Date();
        data.editedby = data.editedby || "";

        // Normalize arrays
        data.paramImg = Array.isArray(data.paramImg) ? data.paramImg : [];
        data.pdfs = Array.isArray(data.pdfs) ? data.pdfs : [];
        data.params = Array.isArray(data.params) ? data.params : [];
        data.extraData = Array.isArray(data.extraData) ? data.extraData : [];

        const updated = await ExtraParamsData.findByIdAndUpdate(id, data, { new: true });

        if (!updated) {
            return res.json({
                status: false,
                message: "No entry found with the given ID.",
                data: false
            });
        }

        res.json({
            status: true,
            message: "Param updated successfully.",
            data: updated
        });

    } catch (error) {
        res.json({
            status: false,
            message: error.message,
            data: false
        });
    }
};


exports.deleteParam = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await ExtraParamsData.findByIdAndUpdate(id, { deleteflag: true }, { new: true });

        res.json({ status: true, message: "ExtraParamsData deleted", data: deleted });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

// controllers/param.controller.js

exports.getUsedHoldersByPageId = async (req, res) => {
    try {
        const pageid = req.params.pageid;
        const usedHolders = await ExtraParamsData.find(
            { pageid: pageid, deleteflag: false },
            { holder: 1, _id: 0 }
        );

        const holderList = usedHolders.map(item => item.holder);

        res.json({
            status: true,
            message: "Used holders fetched successfully",
            data: holderList.length > 0 ? holderList : false
        });

    } catch (error) {
        res.json({
            status: false,
            message: error.message,
            data: false
        });
    }
};
