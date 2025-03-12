import multer from 'multer';

// Using memory storage
const storage = multer.memoryStorage(); // Stores files in memory for processing

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'), false);
    }
  },
});

export default upload;
