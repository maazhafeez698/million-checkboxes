import express from "express";
import checkboxRoutes from "./modules/checkbox/checkbox.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "omcb",
  });
});

app.use("/api/checkboxes", checkboxRoutes);

app.use(errorMiddleware);

export default app;
