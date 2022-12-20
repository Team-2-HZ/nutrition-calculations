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
    cautions: food.cautions,
  });
  // console.log(data);
  if (error) {
    console.log("There was an error: ", error);
    // console.log(data);
  }
}

export async function getNullmeals(req, res) {
  // get all the database entries where meal_id is null
  const { data, error } = await supabase
    .from("nutrition")
    .select("*")
    .is("meal_id", null);
  // create a new meal row in the database
  if (error) {
    console.log("There was an error: ", error);
  }
  res.send(data);
  return data;
}

export async function makeNewMeal(req, res) {
  const nullMeals = await getNullmeals();
  const mealNutrition = calculateNutrition(nullMeals);

  // create a new meal row in the database
  const { data, error } = await supabase
    .from("meals")
    .insert({ name: req.body.name, nutritions: mealNutrition });
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

function calculateNutrition(food) {
  // loop through the food array and calculate the nutrition
  const nutrition = food.reduce(
    (acc, food) => {
      acc.calories += food.ENERC_KCAL.fat;
      acc.fat += food.FAT.fat;
      acc.protein += food.PROTEIN.protein;
      acc.sugar += food.SUGAR.sugar;
      acc.carbs += food.CARBS.carbs;
      acc.cautions.push(...food.cautions);
      return acc;
    },
    {
      calories: 0,
      fat: 0,
      protein: 0,
      sugar: 0,
      carbs: 0,
      cautions: [],
    }
  );
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
