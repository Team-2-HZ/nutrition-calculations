import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// register controllers
import { getFood } from "../controllers/nutrition.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

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

// NUTRITION
router.post("/api/v1/nutrition", getFood);

app.use("/", router);
// starting the server
app.listen(3042, () => {
  console.log("listening on port 3042");
});
