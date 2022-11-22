const APP_ID = "4e75f735";
const APP_KEY = "d282ddce3ca102a4d55f4dd7370f1760";
exports.getFood = async (req, res) => {
  // get the food name from the request body
  const food = req.body.data.food;
  // get the grams from the request body
  const grams = req.body.data.grams;
  try {
    // if the food is in the cache, fetch the nutrition info from the cache
    const simpleFoodInfo = await getFoodInfo(food, grams);
    const foodDetails = await buildSimpleFoodObject(simpleFoodInfo, grams);
    const nutritionData = await getNutritionInfo(foodDetails, grams);

    const foodDetailsWithNutrition = await buildFoodObjectWithNutritionData(
      simpleFoodInfo,
      grams,
      nutritionData
    );

    //log the food details
    console.log(foodDetailsWithNutrition);
    res.status(200).send(foodDetailsWithNutrition);
  } catch (error) {
    return [];
  }

  // function to get get food info for a food
  async function getFoodInfo(food) {
    console.log("CALLING API 1");
    const URL = `https://api.edamam.com/api/food-database/v2/parser?ingr=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    console.log("somethnig");
    const response = await fetch(URL);
    console.log("somethnig else ");
    const data = await response.json();
    if (data) {
      // create an object with the food info
      return data;
    } else {
      return [];
    }
  }

  // function to get get nutrition info for a food
  async function getNutritionInfo(foodDetails, grams) {
    console.log("CALLING API 2");
    // check if the food is in the cache

    const URL = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${APP_ID}&app_key=${APP_KEY}`;
    const query = {
      ingredients: [
        {
          quantity: grams,
          measureURI: foodDetails.foodMeasures.uri,
          foodId: foodDetails.foodId,
        },
      ],
    };

    // make a post request to get the nutrition info
    const nutritionDataRaw = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const nutritionData = await nutritionDataRaw.json();

    return nutritionData;
  }

  async function buildSimpleFoodObject(data, grams) {
    const foodDetails = {
      foodName: data.hints[0].food.label,
      foodId: data.hints[0].food.foodId,
      // find the measure with the "Grams" label
      foodMeasures: data.hints[0].measures.find(
        (measure) => measure.label === "Gram"
      ),
      quantity: grams,
      // add the nutrition info to the foodDetails object
    };
    return foodDetails;
  }

  async function buildFoodObjectWithNutritionData(data, grams, nutritionData) {
    const foodDetails = {
      foodName: data.hints[0].food.label,
      foodId: data.hints[0].food.foodId,
      // find the measure with the "Grams" label
      foodMeasures: data.hints[0].measures.find(
        (measure) => measure.label === "Gram"
      ),
      quantity: grams,
      // add the nutrition info to the foodDetails object
      ENERC_KCAL: {
        calories: nutritionData.totalNutrients.ENERC_KCAL.quantity,
        unit: nutritionData.totalNutrients.ENERC_KCAL.unit,
      },
      FAT: {
        fat: nutritionData.totalNutrients.FAT.quantity,
        unit: nutritionData.totalNutrients.FAT.unit,
      },
      PROTEIN: {
        protein: nutritionData.totalNutrients.PROCNT.quantity,
        unit: nutritionData.totalNutrients.PROCNT.unit,
      },
      SUGAR: {
        sugar: nutritionData.totalNutrients.SUGAR.quantity,
        unit: nutritionData.totalNutrients.SUGAR.unit,
      },
      CARBS: {
        carbs: nutritionData.totalNutrients.CHOCDF.quantity,
        unit: nutritionData.totalNutrients.CHOCDF.unit,
      },
      cautions: nutritionData.cautions,
    };
    return foodDetails;
  }
};
