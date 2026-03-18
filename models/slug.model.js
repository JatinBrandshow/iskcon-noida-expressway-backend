const mongoose = require('mongoose');

const slugSchema = new mongoose.Schema({
    page_id: {
        type: Number,
        required: true,
        unique: true
    },
    parent_id: {
        type: Number,
        required: false,
        default: 0,
    },
    clg_id: {
        type: Number,
        required: false,
        default: 0,
    },

    languageId: {
        type: Number,
        required: false,
        default: 1,
    },
    price: {
        type: Number,
        default: 0,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    shortdesc: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    downloadCenterPdf: {
        type: String,
    },
    param1: {
        type: String,
        required: false
    },
    paramvalue1: {
        type: String,
        required: false
    },
    param_img1: {
        type: String,
        required: false
    },
    param_url1: {
        type: String,
        required: false
    },
    param2: {
        type: String,
        required: false
    },
    paramvalue2: {
        type: String,
        required: false
    },
    param_img2: {
        type: String,
        required: false
    },
    param_url2: {
        type: String,
        required: false
    },
    param3: {
        type: String,
        required: false
    },
    paramvalue3: {
        type: String,
        required: false
    },
    param_img3: {
        type: String,
        required: false
    },
    param_url3: {
        type: String,
        required: false
    },
    param4: {
        type: String,
        required: false
    },
    paramvalue4: {
        type: String,
        required: false
    },
    param_img4: {
        type: String,
        required: false
    },
    param_url4: {
        type: String,
        required: false
    },
    param5: {
        type: String,
        required: false
    },
    paramvalue5: {
        type: String,
        required: false
    },
    param_img5: {
        type: String,
        required: false
    },
    param_url5: {
        type: String,
        required: false
    },
    param6: {
        type: String,
        required: false
    },
    paramvalue6: {
        type: String,
        required: false
    },
    param_img6: {
        type: String,
        required: false
    },
    param_url6: {
        type: String,
        required: false
    },
    param7: {
        type: String,
        required: false
    },
    paramvalue7: {
        type: String,
        required: false
    },
    param_img7: {
        type: String,
        required: false
    },
    param_url7: {
        type: String,
        required: false
    },
    param8: {
        type: String,
        required: false
    },
    paramvalue8: {
        type: String,
        required: false
    },
    param_img8: {
        type: String,
        required: false
    },
    param_url8: {
        type: String,
        required: false
    },
    param9: {
        type: String,
        required: false
    },
    paramvalue9: {
        type: String,
        required: false
    },
    param_img9: {
        type: String,
        required: false
    },
    param_url9: {
        type: String,
        required: false
    },
    param10: {
        type: String,
        required: false
    },
    paramvalue10: {
        type: String,
        required: false
    },
    param_img10: {
        type: String,
        required: false
    },
    param_url10: {
        type: String,
        required: false
    },
    banner_img: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        required: true,
    },
    metatitle: {
        type: String,
        required: false
    },
    metadesc: {
        type: String,
        required: false
    },
    keywords_tag: {
        type: String,
        required: false
    },
    tag1: {
        type: String,
        required: false
    },
    tag2: {
        type: String,
        required: false
    },
    tag3: {
        type: String,
        required: false
    },
    schemaid: {
        type: String,
        required: false
    },
    nic_name: {
        type: String,
        required: false
    },
    col_width: {
        type: String,
        required: false
    },
    featured_img: {
        type: String,
        required: false
    },
    mainReportImage: {
        type: String,
    },
    video_url: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    featured_status: {
        type: Boolean,
        default: false
    },
    galleryimg: {
        type: Array,
    },
    highlightBanner: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    ComponentType: {
        type: String,
        required: false
    },
    qualification: [String], 
    path: {
        type: String,
        required: true,
        unique: true
    },
    id_path: {
        type: String,
        required: true,
        unique: true
    },
    old_url: {
        type: String,
        required: false
    },
    stream: {
        type:Number,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    addedon: {
        type: Date,
        default: Date.now
    },
    addedby: {
        type: String,
        default: "Admin",
        required: false
    },
    editedon: {
        type: Date,
        required: false
    },
    editedby: {
        type: String,
        default: "Admin",
        required: false
    },
    deleteflag: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Slug', slugSchema);
