import express from "express";
import { uploadImagesHandler } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", uploadImagesHandler);
export default router;
