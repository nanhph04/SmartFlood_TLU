import express from "express";
import { uploadImagesHandler } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.array('images', 5), uploadImagesHandler);
export default router;
