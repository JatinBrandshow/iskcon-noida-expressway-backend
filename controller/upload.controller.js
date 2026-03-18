const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
// DigitalOcean Spaces configuration
const bucket = 'csip-image';
const region = 'blr1';
const endpoint = 'https://csip-image.blr1.digitaloceanspaces.com';
const accessKeyId = 'DO00GDP78XUCFGCYBR3P';
const secretAccessKey = 'zL0CvU2FTCmiejqW5+9BN/WZQP0B3J6Eu6PXZUYS1ew';

// Create an S3 client
const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

const uploadfile = async (req, res) => {
  try {
    const files = req.files; // Access multiple files

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No files uploaded or incorrect field name.",
        data: false,
      });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const filePath = file.path;
      const fileName = file.originalname;

      // Prepare S3 upload parameters
      const key = `akg/${fileName}`;
      const fileBuffer = fs.readFileSync(filePath); // Read file as a buffer

      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype,
        ACL: "public-read", // File will be publicly accessible
      };

      // Upload file to DigitalOcean Spaces
      await s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://csip-image.blr1.digitaloceanspaces.com/${key}`;

      // Add the file URL to the response array
      uploadedFiles.push(fileUrl);

      // Delete the temporary file from "uploads"
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        }
      });
    }

    return res.status(200).json({
      status: true,
      message: "Files uploaded successfully.",
      data: { fileUrls: uploadedFiles },
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({
      status: false,
      message: "Error uploading files",
      data: error.message,
    });
  }
};

module.exports = {
  uploadfile,
};