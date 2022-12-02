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
  console.log(data);
  if (error) {
    console.log("There was an error: ", error);
    console.log(data);
  }
}

export async function getFoodFromSupabase(req, res) {
  const { data, error } = await supabase.from("nutrition").select("*");
  if (error) {
    console.log("There was an error: ", error);
  }
  res.send(data);
}
