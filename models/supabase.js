import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveFood(food) {
  const { error } = await supabase.from("nutrition").insert({
    foodName: food.foodName,
    quantity: food.quantity,
    ENERC_KCAL: {
      fat: food.ENERC_KCAL.calories,
      unit: food.ENERC_KCAL.unit,
    },
    FAT: {
      fat: food.FAT.fat,
      unit: food.FAT.unit,
    },
    PROTEIN: {
      protein: food.PROTEIN.protein,
      unit: food.PROTEIN.unit,
    },
    SUGAR: {
      sugar: food.SUGAR.sugar,
      unit: food.SUGAR.unit,
    },
    CARBS: {
      carbs: food.CARBS.carbs,
      unit: food.CARBS.unit,
    },
    cautions: food.cautions,
  });
  if (error) {
    console.log(error);
  }
}
