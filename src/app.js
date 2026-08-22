import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import checkboxRoutes from "./modules/checkbox/checkbox.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "omcb",
  });
});

app.use("/api/checkboxes", checkboxRoutes);

app.use(errorMiddleware);

export default app;
