import { Router } from "express";

import {
  getStats,
  getSingleCheckbox,
  toggleCheckbox,
  getCheckboxChunk,
  getCheckedIndexesController,
} from "./checkbox.controller.js";

const router = Router();

router.get("/stats", getStats);

router.get("/checked", getCheckedIndexesController);

router.get("/chunk/:chunkIndex", getCheckboxChunk);

router.get("/:index", getSingleCheckbox);

router.post("/:index/toggle", toggleCheckbox);

export default router;
