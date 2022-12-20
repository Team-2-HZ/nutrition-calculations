import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveFood(food) {
  const { data, error } = await supabase.from("nutrition").insert({
    foodName: food.foodName,
    quantity: food.quantity,
    ENERC_KCAL: food.ENERC_KCAL.calories,
    FAT: food.FAT.fat,
    PROTEIN: food.PROTEIN.protein,
    SUGAR: food.SUGAR.sugar,
    CARBS: food.CARBS.carbs,
    SATURATED_FAT: food.SATURATED_FAT.saturatedFat,
    FIBRE: food.FIBRE.fibre,
    cautions: food.cautions,
  });
  // console.log(data);
  if (error) {
    console.log("There was an error: ", error);
    // console.log(data);
  }
}

export async function getNutritionEntries(req, res) {
  if (req.query.mealId === undefined) {
    // get all the database entries where meal_id is null
    const { data, error } = await supabase
      .from("nutrition")
      .select("*")
      .is("meal_id", null);
    if (error) {
      console.log("There was an error: ", error);
    }
    res.send(data);
    return data;
  } else {
    // get all the database entries where meal_id === req.query.mealId
    const { data, error } = await supabase
      .from("nutrition")
      .select("*")
      .eq("meal_id", req.query.mealId);
    if (error) {
      console.log("There was an error: ", error);
    }
    res.send(data);
    return data;
  }
}

async function getNullMeals() {
  // get all the database entries where meal_id is null
  const { data, error } = await supabase
    .from("nutrition")
    .select("*")
    .is("meal_id", null);
  if (error) {
    console.log("There was an error: ", error);
  }
  return data;
}

export async function makeNewMeal(req, res) {
  const nullMeals = await getNullMeals();
  const mealNutrition = calculateTotalNutrition(nullMeals);

  // create a new meal row in the database
  const { data, error } = await supabase
    .from("meals")
    .insert({ name: "Breakfast", nutritions: mealNutrition });
  if (error) {
    console.log("There was an error: ", error);
  }

  // get the id of the new meal
  const newestRow = await supabase
    .from("meals")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);

  // update the meal_id column in the nutrition table
  updateMeal(newestRow.data[0].id);

  res.send(200);
}

function calculateTotalNutrition(food) {
  // loop through the food array and calculate the nutrition
  const nutrition = food.reduce(
    (acc, food) => {
      acc.ENERC_KCAL += Number(food.ENERC_KCAL);
      acc.FAT += Number(food.FAT);
      acc.PROTEIN += Number(food.PROTEIN);
      acc.SUGAR += Number(food.SUGAR);
      acc.CARBS += Number(food.CARBS);
      acc.SATURATED_FAT += Number(food.SATURATED_FAT);
      acc.FIBRE += Number(food.FIBRE);
      acc.cautions.push(...food.cautions);
      return acc;
    },
    {
      ENERC_KCAL: 0,
      FAT: 0,
      PROTEIN: 0,
      SUGAR: 0,
      CARBS: 0,
      SATURATED_FAT: 0,
      FIBRE: 0,
      cautions: [],
    }
  );
  // loop through the cautions array and remove duplicates
  nutrition.cautions = [...new Set(nutrition.cautions)];
  // loop through the nutrition object and round the numbers to 2 decimals
  for (const key in nutrition) {
    if (typeof nutrition[key] === "number") {
      nutrition[key] = Number(nutrition[key].toFixed(2));
    }
  }
  return nutrition;
}

export async function updateMeal(meal_id) {
  // update the meal_id column in the nutrition table
  const { data, error } = await supabase
    .from("nutrition")
    .update({
      meal_id: meal_id,
    })
    .is("meal_id", null);
}

export async function summary(req, res) {
  const days = req.query.days;

  const dailyNutritionMale = {
    ENERC_KCAL: 2500,
    FAT: 95,
    PROTEIN: 55,
    SUGAR: 65,
    CARBS: 300,
    SATURATED_FAT: 20,
    FIBRE: 30,
  };

  const dailyNutritionFemale = {
    ENERC_KCAL: 2000,
    FAT: 73,
    PROTEIN: 45,
    SUGAR: 49,
    CARBS: 230,
    SATURATED_FAT: 20,
    FIBRE: 24,
  };

  // craete a new date that is days days ago
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const dateStr = date.toISOString().split("T")[0];
  console.log(dateStr);
  // create time
  const time = "00:00:00.000000";
  const dateAndTime = dateStr + " " + time;

  // get all meals from specified days
  const { data, error } = await supabase
    .from("nutrition")
    .select("*")
    .gte("created_at", dateAndTime);
  if (error) {
    console.log("There was an error: ", error);
  }

  // calculate the total nutrition of all the meals from the specified days
  const totalNutrition = calculateTotalNutrition(data);
  // calculate the percentage of the daily nutrition for the total nutrition
  const summary = {};
  for (const key in totalNutrition) {
    if (key === "cautions") {
      summary[key] = totalNutrition[key];
    } else {
      const perDay = totalNutrition[key] / 7;
      summary[key] = (perDay / dailyNutritionMale[key]) * 100;
    }
  }

  // set all summary values toFixed(2)
  for (const key in summary) {
    if (typeof summary[key] === "number") {
      summary[key] = Number(summary[key].toFixed(2));
    }
  }
  console.log(totalNutrition);
  console.log(dailyNutritionMale);
  console.log(summary);
  res.send(summary);
}

export async function getMeal(req, res) {
  if (req.query.mealId === undefined) {
    // get all meals
    const { data, error } = await supabase.from("meals").select("*");
    res.send(data);
    if (error) {
      console.log("There was an error: ", error);
    }
  } else {
    // get all the database entries where meal_id === req.query.mealId
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("id", req.query.mealId);

    // calculate the total nutrition of all the meals from the specified meal
    if (error) {
      console.log("There was an error: ", error);
    }
    res.send(data);
  }
}
