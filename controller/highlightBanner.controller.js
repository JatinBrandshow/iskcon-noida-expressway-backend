const { HighlightBanner, Slug } = require("../models");

/**
 * Add a new highlight banner
 */
const addHighlightBanner = async (req, res) => {
  try {
    const {
      banner,
      description,
      link,
      size,
      title,
      stream,
      bannerAlt,
      tags = [], // optional, defaults to empty array
    } = req.body;

    // Validate required fields
    const requiredFields = { banner, description, link, size, title };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          status: false,
          message: `${key} is required.`,
          data: false,
        });
      }
    }
    // Get the current max order
    const lastBanner = await HighlightBanner.findOne().sort({ order: -1 });
    const nextOrder = lastBanner ? lastBanner.order + 1 : 1;

    // Create new banner
    const newBanner = new HighlightBanner({
      banner,
      title,
      description,
      link,
      order: nextOrder,
      size,
      tags,
      bannerAlt,
      stream: stream || null,
    });

    await newBanner.save();

    return res.status(201).json({
      status: true,
      message: "Highlight banner added successfully.",
      data: newBanner,
    });

  } catch (error) {
    console.error("Error in addHighlightBanner:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
      data: false,
    });
  }
};
/**
 * Update an existing highlight banner
 */
const updateHighlightBanner = async (req, res) => {
  try {
    const {
      _id,
      banner,
      description,
      link,
      status,
      size,
      title,
      bannerAlt,
      stream,
      tags = [],
    } = req.body;

    // Validate ID
    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "_id is required.",
        data: false,
      });
    }


    // Build update object
    const updateFields = {
      ...(banner && { banner: banner.trim() }),
      ...(description && { description: description.trim() }),
      ...(link && { link: link.trim() }),
      ...(typeof status === "boolean" && { status }),
      ...(size && { size: size.trim() }),
      ...(title && { title: title.trim() }),
      ...(bannerAlt && { bannerAlt: bannerAlt.trim() }),
      ...(stream && { stream }),
      ...(Array.isArray(tags) && { tags }),
    };

    const updatedBanner = await HighlightBanner.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Highlight banner updated successfully.",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error in updateHighlightBanner:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
      data: false,
    });
  }
};
/**
 * Delete a highlight banner (soft delete)
 */
const deleteHighlightBanner = async (req, res) => {
  try {
    const { _id } = req.body;

    // Soft delete: set deleteflag to true
    const deletedBanner = await HighlightBanner.findByIdAndUpdate(
      _id,
      { deleteflag: true, status: false },
      { new: true }
    );

    if (!deletedBanner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Highlight banner deleted successfully.",
      data: deletedBanner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
/**
 * Get a highlight banner by ID
 */
const getHighlightBannerById = async (req, res) => {
  try {
    const { _id } = req.query;

    const banner = await HighlightBanner.findById(_id).where({
      deleteflag: false,
      status: true,
    }).populate('stream');

    if (!banner) {
      return res.status(404).json({
        status: false,
        message: "Highlight banner not found.",
        status: false,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Highlight banner fetched successfully.",
      data: banner,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, data: false });
  }
};
/**
 * Get highlight banners List
 */
const getHighlightBannerList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      status,
    } = req.query;

    const query = {
      deleteflag: false,
    };

    if (status !== undefined && status !== "") {
      query.status = status === "true";
    }
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const totalItems = await HighlightBanner.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const banners = await HighlightBanner.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    const bannerWithStream = await Promise.all(
      banners.map(async (banner) => {
        if (banner.stream) {
          const streamData = await Slug.findOne({
            page_id: banner.stream,
            deleteflag: false,
            status: true,
          }).lean().select("name");

          return {
            ...banner,
            stream: streamData || null, // replace id with data
          };
        }
        return banner;
      })
    );



    return res.status(200).json({
      status: true,
      message: "Highlight banners fetched successfully.",
      data: {
        banners: bannerWithStream,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          hasPrevPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Error in getHighlightBannerList:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: false,
    });
  }
};

/**
 * Get highlight banners by stream and/or tags
 */
const getHighlightBannerByTagsAndStream = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      status = "true",
      tags,
      stream,
    } = req.query;

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const query = { deleteflag: false };

    // Apply status (default: true)
    if (status !== "") {
      query.status = status === "true";
    }

    // If stream is present, filter by stream
    if (stream) {
      query.stream = stream;
    }

    // Normalize tags into array (even if single string comes)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    const totalItems = await HighlightBanner.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const banners = await HighlightBanner.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return res.status(200).json({
      status: true,
      message: "Highlight banners fetched successfully.",
      data: {
        banners,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          hasPrevPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Error in getHighlightBannerByTagsAndStream:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: false,
    });
  }
};

module.exports = {
  addHighlightBanner,
  getHighlightBannerList,
  updateHighlightBanner,
  deleteHighlightBanner,
  getHighlightBannerById,
  getHighlightBannerByTagsAndStream
};
