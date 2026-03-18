// models/Param.js
const mongoose = require('mongoose');

const ParamSchema = new mongoose.Schema({
    pageid: { type: String, required: true },
    param: { type: String, required: true },
    subparam: { type: String, default:"" },
    paramDesc: { type: String },
    paramImg: { type: [String], default: [] },
    paramUrl: { type: String },
    orderSequence: { type: Number, default: 0 },
    type: { type: String, required: true }, // Multiple values allowed
    holder: { type: String, required: true },
    widgetType: { type: String, },
    status: { type: Boolean, default: true },
    addedon: { type: Date, default: Date.now },
    addedby: { type: String },
    editedon: { type: Date },
    editedby: { type: String },
    deleteflag: { type: Boolean, default: false },
    pdfs: { type: [String], default: [] },
    params: { type: [String], default: [] },
    extraData: { type: Array, default: [] }
});

// Enforce unique constraint on combination of pageid and holder
ParamSchema.index({ pageid: 1, holder: 1 });

module.exports = mongoose.model('ExtraParamsData', ParamSchema);
