import multer from 'multer';

// Configure multer for memory storage (no disk writes)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

// Create multer instance with configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Helper to convert buffer to base64
export const bufferToBase64 = (buffer: Buffer): string => {
  return buffer.toString('base64');
};
