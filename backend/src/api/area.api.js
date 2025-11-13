import express from "express";
import { createArea, getAllAreas, getAreaById, updateArea, deleteArea } from "../controllers/area.controller.js";

const router = express.Router();

router.post("/", createArea);
router.get("/", getAllAreas);
router.get("/:id", getAreaById);
router.patch("/:id", updateArea);
router.delete("/:id", deleteArea);

export default router;
