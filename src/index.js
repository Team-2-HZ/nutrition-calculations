import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// register controllers
import { getNutrition } from "../controllers/nutrition.js";
import {
  makeNewMeal,
  getNutritionEntries,
  summary,
  getMeal,
} from "../models/supabase.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 3030;

// defining the Express app
const app = express();
const router = express.Router();

router.use((req, res, next) => {
  if (req.headers.authorization !== process.env.bearer) {
    res.status(401);
    res.send("Unauthorized");
    return;
  }
  next();
});

// adding Helmet for API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects and plain text
app.use(bodyParser.json(["application/json", "text/plain"]));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// GET NUTRITION INFO FROM API
router.post("/api/v1/nutrition", getNutrition);

// MAKE NEW MEAL
router.post("/api/v1/meals", makeNewMeal);

// GET NULL MEALS
router.get("/api/v1/ingredients", getNutritionEntries);

// GET MEAL SUMMARY
router.get("/api/v1/nutrition/summary", summary);

// GET SPECIFIC MEAL
router.get("/api/v1/nutrition/meal", getMeal);

app.use("/", router);

router.get("/", summary);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
