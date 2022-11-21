// function that craetes a list with the food info

const FoodInfo = ({food}) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-10 ">

            <div className="max-w-4xl  bg-white w-full rounded-lg shadow-2xl">
                <div className="p-4 border-b">
                    <h2 className="text-2xl ">
                        Food Information
                    </h2>
                    <p className="text-sm text-gray-500">
                        Nutritional information of selected food
                    </p>
                </div>
                <div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Food name
                        </p>
                        <p>
                            {food.foodName}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Calories
                        </p>
                        <p>
                            {`${food.ENERC_KCAL.calories.toFixed(2)} ${food.ENERC_KCAL.unit}`}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                           Fats
                        </p>
                        <p>
                            {`${food.FAT.fat.toFixed(2)} ${food.FAT.unit}`}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Protein
                        </p>
                        <p>
                            { `${food.PROTEIN.protein.toFixed(2) } ${food.PROTEIN.unit}`}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Sugar
                        </p>
                        <p>
                            {`${food.SUGAR.sugar.toFixed(2)} ${food.SUGAR.unit}`}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Carbohydrates
                        </p>
                        <p>
                            {`${food.CARBS.carbs.toFixed(2)} ${food.CARBS.unit}`}
                        </p>
                    </div>
                    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                        <p className="text-gray-600">
                            Cautions
                        </p>
                        <p>
                            {food.cautions ? food.cautions.map((caution) => {
                                return <li key={caution}>{caution}</li>
                            }) : 'None'}
                        </p>
                    </div>
                    
                </div>
            </div>

        </div>
    )
}

export default FoodInfo;