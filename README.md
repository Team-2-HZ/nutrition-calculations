# Node API Template

All APIs are secuerd by a hardcoded randomly created bearer, stored in the .env file.
The APIs URIs all follow this convention: /api/v1/ where the v represents the version number of the API. The URI is not mentioned again in the Endpoint definitions.

## Prerequisites

This is an example of how to list things you need to use the software and how to install them. Requires at least version 19.1.0

- npm
  ```sh
  npm install
  ```

## API Endpoints:

### /nutrition/summary?days=x

      returns the nutritional info for the last x days in percent
      requires:
        Authorization: Bearer
        days: int,
      response:
        {
          data: {
            kcal: int,
            fat: int,
            sat_fat: int,
            carbs: int,
            sugar: int,
            fiber: int,
            protein: int
          }
        }
        
### /nutrition/meal/:id

      returns the nutritional info for the last meal and it's ingredients
      requires:
        Authorization: Bearer
        id: id | FK,
      response:
        {
          percentage: {
            kcal: int,
            fat: int,
            sat_fat: int,
            carbs: int,
            sugar: int,
            fiber: int,
            protein: int
          },
          ingredients: {[
            {
              type: string,
              kcal: int,
              fat: int,
              sat_fat: int,
              carbs: int,
              sugar: int,
              fiber: int,
              protein: int
            },
            {
              type: string,
              ...
            },
          ]}
        }

# Nutrition Calculation API

The nutrition app makes 2 API calls

- The frst API call is a GET request to the following endpoint
  -- https://api.edamam.com/api/food-database/v2/parser?ingr=${<food>}&app_id=${<APP_ID>}&app_key=${<APP_KEY>}
- The second is a POST request to the the following enopint
  --https://api.edamam.com/api/food-database/v2/nutrients?app_id=${<APP_ID>}&app_key=${<APP_KEY>}`
  with the following body:

```json
{
      "ingredients": [
        {
          "quantity": <grams>,
          "measureURI": <The Measurement URI from the 1st API call>
          "foodId": <FoodID from the 1st API call>,
        },
      ],
    }
```

## Calling the Nutrition API itself

The nutrition app accepts a POST request on the following URL
https://nutrition-calculation-app.onrender.com/api/v1/nutrition
the BODY of the request should be styled as follows:

```json
{
    "data":{
        "food":"<Food name>",
        "grams":<amount of food in grams>
    }
}
```
