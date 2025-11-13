import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImagesHandler } from '../controllers/upload.controller.js';


const uploadRoutes = Router();
uploadRoutes.post('/images', upload.array('files', 10), uploadImagesHandler);
export default uploadRoutes;