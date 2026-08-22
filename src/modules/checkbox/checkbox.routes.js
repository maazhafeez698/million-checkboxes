import { Router } from "express";

import {
  getStats,
  getSingleCheckbox,
  toggleCheckbox,
  getCheckboxChunk,
} from "./checkbox.controller.js";

const router = Router();

router.get("/stats", getStats);

router.get("/chunk/:chunkIndex", getCheckboxChunk);

router.get("/:index", getSingleCheckbox);

router.post("/:index/toggle", toggleCheckbox);

export default router;
