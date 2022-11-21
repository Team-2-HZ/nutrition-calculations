import "./App.css";
import React, { useState, useEffect } from "react";
import { getFood } from "./services/FoodService";
import FoodInfo from "./components/FoodInfo";

function App() {
  // user foodName state
  const [foodName, setFoodName] = useState("");
  // user grams state
  const [grams, setGrams] = useState(0);
  // food state
  const [food, setFood] = useState({});

  const clickHandler = (event, searhString, grams) => {
    event.preventDefault();
    if (searhString) {
      try {
        getFood(searhString, grams).then((response) => {
          setFood(response);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFoodChange = (event) => {
    setFoodName(event.target.value);
  };

  const handleGramsChange = (event) => {
    setGrams(Number(event.target.value));
  };

  useEffect(() => {
    // console.log(food);
    // console.log(grams);
  }, [food, grams]);

  return (
    <div className="App">
      <div className="flex flex-col h-screen">
        <div className="flex justify-center items-center ">
          <form className="m-4">
            <input
              onChange={handleFoodChange}
              className="rounded-lg p-4 mr-2 border-2 text-gray-800 border-gray-800 bg-white"
              placeholder="chicken"
            />
            <input
              onChange={handleGramsChange}
              className="rounded-lg p-4  m-2  border-2 text-gray-800 border-gray-800 bg-white"
              placeholder="grams"
            />
            <div>
              <button
                onClick={(e) => {
                  clickHandler(e, foodName, grams);
                }}
                className="px-8 rounded-lg bg-blue-400  text-gray-800 font-bold p-4 uppercase border-blue-500 border-t border-b border-r"
              >
                Go!
              </button>
            </div>
          </form>
        </div>
        {food.foodName ? <FoodInfo food={food} /> : null}
      </div>
    </div>
  );
}

export default App;
