const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `venue-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 1 // Only one file at a time
  }
});

// Middleware for single image upload
const uploadSingleImage = upload.single('photo');

// Middleware wrapper to handle multer errors
const handleUpload = (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File too large. Maximum size is 5MB.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          message: 'Too many files. Only one file is allowed.'
        });
      }
      return res.status(400).json({
        message: 'File upload error',
        error: err.message
      });
    } else if (err) {
      return res.status(400).json({
        message: 'File upload error',
        error: err.message
      });
    }
    next();
  });
};

// Helper function to delete uploaded file
const deleteUploadedFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file URL
const getFileUrl = (filename) => {
  if (!filename) return null;
  return `/uploads/${filename}`;
};

module.exports = {
  handleUpload,
  deleteUploadedFile,
  getFileUrl
};
