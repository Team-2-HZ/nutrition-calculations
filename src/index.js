import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// register controllers
import { getNutrition } from "../controllers/nutrition.js";
import { getFoodFromSupabase } from "../models/supabase.js";
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

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// GET NUTRITION INFO FROM API
router.post("/api/v1/nutrition", getNutrition);

// RETRIEVE FOOD FROM SUPABASE
router.get("/api/v1/nutrition", getFoodFromSupabase);

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
