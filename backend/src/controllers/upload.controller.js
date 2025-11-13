import httpStatus from 'http-status';
import { uploadBuffer } from '../configs/cloudinary.js';


export const uploadImagesHandler = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No files uploaded' });
    }

    const results = await Promise.all(
      req.files.map((f, i) => uploadBuffer(f.buffer, `${Date.now()}_${i}`))
    );

    const urls = results.map((r) => r.secure_url);
    const details = results.map((r) => ({ url: r.secure_url, publicId: r.public_id }));

    res.status(httpStatus.CREATED).json({ urls, details });
  } catch (e) { next(e); }
};