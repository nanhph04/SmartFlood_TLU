import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(jpeg|png|webp|gif|heic|heif)$/i.test(file.mimetype);
  if (!ok) {
    return cb(new Error('Invalid image type'), false);
  }
  cb(null, true);
};


export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB/file, tối đa 10 file
  fileFilter,
});