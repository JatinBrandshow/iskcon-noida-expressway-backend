const { Slug } = require("../models");

const generateUniqueId = async (existingIds) => {
  let id;
  const existingIdsSet = new Set(existingIds); // Use Set for faster lookups
  do {
    id = Math.floor(Math.random() * 1000000); // Adjust range if needed
  } while (existingIdsSet.has(id));
  return id;
};

const createStaticPage = async (req, res) => {
  try {
    const {
      parent_id = 0,
      clg_id = 1,
      languageId = 1,
      price = 0,
      name,
      path: providedPath,
      status = true,
      addedby = "Admin",
    } = req.body;

    // Validate required fields
    if (!name || !providedPath) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: 'name' or 'path'",
        data: false,
      });
    }
    if (parent_id === 0 && providedPath.split("/").length > 2) {
      return res.status(400).json({
        status: false,
        message:
          "Root level slugs cannot have more than one path segment ! Please select parent of this path",
        data: false,
      });
    }
    // Validate provided path
    if (!/^[a-zA-Z0-9-/]+$/.test(providedPath)) {
      return res.status(400).json({
        status: false,
        message: "Invalid path format",
        data: false,
      });
    }
    // Ensure the path starts with a forward slash
    const path = providedPath.startsWith("/")
      ? providedPath
      : `/${providedPath}`;
    const slug = path.split("/").pop(); // Extract the slug from the path
    // Check if the slug already exists
    const existingSlug = await Slug.findOne({
      path: path,
      status: true,
    });
    if (existingSlug) {
      return res.status(400).json({
        status: false,
        message: "path already exists",
        data: false,
      });
    }

    // Fetch existing IDs from the database
    const existingSlugs = await Slug.find({}).select("page_id");
    const existingIds = existingSlugs.map((slug) => slug.page_id);
    const page_id = await generateUniqueId(existingIds);

    // Prepare id_path
    let id_path;
    if (parent_id === 0) {
      id_path = `/${page_id}`; // Root level
    } else {
      const parentSlugDoc = await Slug.findOne({ page_id: parent_id });
      if (!parentSlugDoc) {
        return res.status(400).json({
          status: false,
          message: "Parent slug not found",
          data: false,
        });
      }
      id_path = `${parentSlugDoc.id_path}/${page_id}`;
    }

    // Create a new slug object
    const newSlug = new Slug({
      page_id,
      parent_id,
      clg_id,
      languageId,
      price,
      name,
      slug,
      path,
      id_path,
      status,
      addedon: Date.now(),
      addedby,
    });

    // Save the new slug to the database
    await newSlug.save();
    return res.status(201).json({
      status: true,
      message: "Slug created successfully",
      data: newSlug,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.slug) {
      return res.status(400).json({
        status: false,
        message: `Duplicate slug error: '${error.keyValue.slug}' already exists.`,
        data: false,
      });
    }

    console.error("Error in createStaticPage:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      data: false,
    });
  }
};

module.exports = {
  createStaticPage,
};
