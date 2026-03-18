const { Meta, Slug } = require("../models");

const getMeta = async (req, res) => {
  try {
    const { pageid } = req.query;

    if (!pageid) {
      return res
        .status(400)
        .json({ status: false, message: "Page ID is required", data: false });
    }
    // validate pageid in slug model
    const slug = await Slug.findOne({ page_id: pageid, status: true });

    if (!slug) {
      return res
        .status(404)
        .json({ status: false, message: "Page ID not found", data: false });
    }
    const meta = await Meta.findOne({
      pageid,
    });
    const updatedMeta = {
      ...meta.toObject(),
      pageName: slug.name,
    };
    if (meta) {
      return res
        .status(200)
        .json({ status: true, message: "Meta found", data: updatedMeta });
    }
    return res
      .status(404)
      .json({ status: false, message: "Meta not found", data: false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const addMeta = async (req, res) => {
  try {
    const {
      pageid,
      metatitle,
      metaDescription,
      metaKeywords,
      path,
      status = true,
      deleteflag = false,
    } = req.body;
    const missings = [];
    if (!pageid) missings.push("Page ID");
    if (!metatitle) missings.push("Meta Title");
    if (!metaDescription) missings.push("Meta Description");
    if (!metaKeywords) missings.push("Meta Keywords");
    if (!path) missings.push("Path");

    if (missings.length) {
      return res.status(400).json({
        status: false,
        message: `${missings.join(", ")} ${
          missings.length > 1 ? "are" : "is"
        } required`,
        data: false,
      });
    }
    const slug = await Slug.findOne({ page_id: pageid, status: true });

    if (!slug) {
      return res
        .status(404)
        .json({ status: false, message: "Page ID not found", data: false });
    }

    // Check if the meta entry already exists for the given pageid
    const existingMeta = await Meta.findOne({ pageid });

    if (existingMeta) {
      // If it exists, update the meta data
      existingMeta.metatitle = metatitle;
      existingMeta.metaDescription = metaDescription;
      existingMeta.metaKeywords = metaKeywords;
      existingMeta.path = path;
      existingMeta.status = status;
      existingMeta.deleteflag = deleteflag;

      await existingMeta.save();
      return res.status(200).json({
        status: true,
        message: "Meta updated",
        data: existingMeta,
      });
    }

    // If it doesn't exist, create a new meta entry
    const meta = new Meta({
      pageid,
      metatitle,
      metaDescription,
      metaKeywords,
      path,
    });

    await meta.save();
    res.status(200).json({ status: true, message: "Meta added", data: meta });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const list = async (req, res) => {
  try {
    const metas = await Meta.find({ status: true, deleteflag: false });

    // Use Promise.all to handle asynchronous operations inside map
    const updatedMetas = await Promise.all(
      metas.map(async (meta) => {
        const slug = await Slug.findOne({ page_id: meta.pageid, status: true });
        // Create a copy of meta and add the pageName property
        return {
          ...meta.toObject(), // Convert the MongoDB document to a plain JavaScript object
          pageName: slug ? slug.name : null, // Add the pageName property
        };
      })
    );

    if (metas || metas.length) {
      return res
        .status(200)
        .json({ status: true, message: "Meta found", data: updatedMetas });
    }
    return res
      .status(404)
      .json({ status: false, message: "Meta not found", data: false });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
const deleteMeta = async (req, res) => {
  try {
    const { pageid } = req.body;
    if (!pageid) {
      return res
        .status(400)
        .json({ status: false, message: "Page ID is required", data: false });
    }
    const meta = await Meta.findOne({ pageid });
    if (!meta) {
      return res
        .status(404)
        .json({ status: false, message: "Meta not found", data: false });
    }
    meta.deleteflag = true;
    meta.status = false;
    await meta.save();
    return res
      .status(200)
      .json({ status: true, message: "Meta deleted", data: meta });
      
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};
module.exports = {
  getMeta,
  addMeta,
  list,
  deleteMeta,
};
