const  { Slug} = require("../models");

// Generic count function
const getStats = async (Model, filter = {}) => {
  const total = await Model.countDocuments(filter);
  const active = await Model.countDocuments({ ...filter, status: true, deleteflag: false });
  const inactive = await Model.countDocuments({ ...filter, status: false, deleteflag: false });

  return { total, active, inactive };
};

const getSlugStats = async (req, res) => {
  try {
    const [
      pages,
      news,
      article,
      event,
      circular,
      departments,
      program,
      schools
    ] = await Promise.all([
      getStats(Slug),                          // All Pages
      getStats(Slug, { type: "News" }),
      getStats(Slug, { type: "Event" }),
      getStats(Slug, { type: "Article" }),
      getStats(Slug, { type: "Circular" }),
      getStats(Slug, { type: "Department" }),
      getStats(Slug, { type: "Program" }),
      getStats(Slug, { type: "School" }),
    ]);

    res.status(200).json({
      pages,
      news,
      article,
      event,
      circular,
      departments,
      program,
      schools
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getSlugStats,
};
