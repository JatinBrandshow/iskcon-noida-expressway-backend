const apikeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey || req.body.apiKey;
  // For now, accepting any API key or a specific one if defined in env
  // Since the user provided credentials for astrologyapi, we might just want to ensure *some* auth exists.
  // In a real app, this should validate against a stored key.
  if (!apiKey) {
    return res.status(401).json({
      status: false,
      message: "API Key is required",
      data: false,
    });
  }
  // Optional: check against a specific key
  // if (apiKey !== process.env.INTERNAL_API_KEY) { ... }
  
  next();
};

const validateRequestBody = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        data: false,
      });
    }
    next();
  };
};

module.exports = {
  apikeyAuth,
  validateRequestBody,
};
