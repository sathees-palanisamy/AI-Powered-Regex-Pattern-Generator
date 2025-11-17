import "dotenv/config";
import express from "express";
import patternRoutes from "./chain/routes/patternRoutes.js";

const app = express();
app.use(express.json());

app.use("/", patternRoutes);

app.listen(3000, () => console.log("API running on port 3000"));
