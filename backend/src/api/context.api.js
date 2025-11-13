
import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Route phục vụ context.jsonld cho NGSI-LD
router.get("/context.jsonld", (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    res.sendFile(path.resolve(__dirname, "../../context.jsonld"));
});

export default router;
