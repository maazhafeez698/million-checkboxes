import { Router } from "express";

import {
  getState,
  getStats,
  getSingleCheckbox,
  toggleCheckbox,
} from "./checkbox.controller.js";

const router = Router();

router.get("/state", getState);
router.get("/stats", getStats);
router.get("/:index", getSingleCheckbox);
router.post("/:index/toggle", toggleCheckbox);

export default router;
