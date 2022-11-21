const APP_ID = "4e75f735";
const APP_KEY = "d282ddce3ca102a4d55f4dd7370f1760";
const foodsInfo = [];

export async function getFood(food, grams) {
  //filter through the foodsInfo and check if food is already in it
  const filteredFoods = foodsInfo.filter((foodItem) => {
    // check if the food name is the same as the food name in the array and if weight is the same as the weight in the array
    return (
      foodItem.foodName.toLowerCase() === food && foodItem.quantity === grams
    );
  });

  console.log("before: foodsInfo", foodsInfo);
  console.log("before: filteredFoods", filteredFoods);

  //if food is not in the foodsInfo array, fetch it from the api
  if (filteredFoods.length === 0) {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      const data = await response.json();
      if (data) {
        // create an object with the food info
        const foodDetails = {
          foodName: data.hints[0].food.label,
          foodId: data.hints[0].food.foodId,
          // find the measure with the "Grams" label
          foodMeasures: data.hints[0].measures.find(
            (measure) => measure.label === "Gram"
          ),
          quantity: grams,
        };

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
        const nutritionResponse = await fetch(
          `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${APP_ID}&app_key=${APP_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(query),
          }
        );
        const nutritionData = await nutritionResponse.json();
        // add the nutrition info to the foodDetails object
        foodDetails.ENERC_KCAL = {
          calories: nutritionData.totalNutrients.ENERC_KCAL.quantity,
          unit: nutritionData.totalNutrients.ENERC_KCAL.unit,
        };
        foodDetails.FAT = {
          fat: nutritionData.totalNutrients.FAT.quantity,
          unit: nutritionData.totalNutrients.FAT.unit,
        };
        foodDetails.PROTEIN = {
          protein: nutritionData.totalNutrients.PROCNT.quantity,
          unit: nutritionData.totalNutrients.PROCNT.unit,
        };
        foodDetails.SUGAR = {
          sugar: nutritionData.totalNutrients.SUGAR.quantity,
          unit: nutritionData.totalNutrients.SUGAR.unit,
        };
        foodDetails.CARBS = {
          carbs: nutritionData.totalNutrients.CHOCDF.quantity,
          unit: nutritionData.totalNutrients.CHOCDF.unit,
        };
        foodDetails.cautions = nutritionData.cautions;

        // add the foodDetails object to the foodsInfo array
        foodsInfo.push(foodDetails);
        console.log("after: foodsInfo", foodsInfo);
        console.log("after: filteredFoods", filteredFoods);
        return foodDetails;
      }
    } catch (error) {
      return [];
    }
  } else {
    // return the items in the foodsInfo array that match the food name and weight
    let cachedFood = foodsInfo.filter((foodItem) => {
      return (
        foodItem.foodName.toLowerCase() === food && foodItem.quantity === grams
      );
    });
    console.log(cachedFood);
    return cachedFood[0];
  }
}
