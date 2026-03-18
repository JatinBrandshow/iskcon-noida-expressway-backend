const { Slug } = require('../models');

const getNewsDetailPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type } = req.query;
    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const filter = {
      status: true,
      deleteflag: false,
    };
    if (type) {
      filter.type = type
    }

    if (type == "News") {
      filter.ComponentType = "news-details"
    } else if (type == "Event") {
      filter.ComponentType = "event-details"
    } else if (type == "Circular") {
      filter.ComponentType = "circular-details"
    } else if (type == "Article") {
      filter.ComponentType = "article-details"
    }

    // Optional search on title or slug
    if (search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch paginated data and total count
    const [pages, total] = await Promise.all([
      Slug.find(filter)
        .skip(skip)
        .limit(pageLimit)
        .sort({ addedon: -1 }),
      Slug.countDocuments(filter)
    ]);

    // Handle empty result
    if (pages.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No matching news found.",
        data: false,
      });
    }

    // Success response
    return res.status(200).json({
      status: true,
      message: "News list retrieved successfully!",
      data: pages,
      pagination: {
        totalItems: total,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageLimit),
        pageSize: pageLimit,
      },
    });

  } catch (error) {
    console.error("Error fetching NewsDetailPage pages:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: false,
    });
  }
};

module.exports
  = {
  getNewsDetailPages
};