import express from "express";
import cors from "cors";
import vinylRouter from "./routes/vinyl.routes.js";
import coverRouter from "./routes/cover.routes.js"; // default import

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vinyls", vinylRouter);
app.use("/api/cover", coverRouter);

export default app;
