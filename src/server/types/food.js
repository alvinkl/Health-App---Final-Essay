export const foodType = {
    name: '',
    quantity: 0,
    unit: 'gr',
    total_weight: 0,

    nutrients: nutrientType,

    alternative_measure: [measureType],

    photo: photoType,
}

export const nutrientType = {
    calories: 0,
    satureated_fat: 0,
    total_fat: 0,
    cholesterol: 0,
    sodium: 0,
    carbohydrate: 0,
    dietary_fiber: 0,
    sugar: 0,
    protein: 0,
    potassium: 0,
}

export const measureType = {
    measure: 0,
    serving_weight: 0,
    quantity: 0,
}

export const photoType = {
    thumbnail: '',
    highres: '',
}

export default function generateFood(data) {
    return data.map(dt => {
        const {
            food_name,
            serving_qty,
            serving_unit,
            serving_weight_grams,
            nf_calories,
            nf_total_fat,
            nf_saturated_fat,
            nf_cholesterol,
            nf_sodium,
            nf_total_carbohydrate,
            nf_dietary_fiber,
            nf_sugars,
            nf_protein,
            nf_potassium,
            alt_measures,
            photo: p,
        } = dt

        let nutrient = nutrientType
        nutrient.calories = nf_calories
        nutrient.satureated_fat = nf_saturated_fat
        nutrient.total_fat = nf_total_fat
        nutrient.cholesterol = nf_cholesterol
        nutrient.sodium = nf_sodium
        nutrient.carbohydrate = nf_total_carbohydrate
        nutrient.dietary_fiber = nf_dietary_fiber
        nutrient.sugar = nf_sugars
        nutrient.protein = nf_protein
        nutrient.potassium = nf_potassium

        let measure = []
        measure = alt_measures.map(({ measure, serving_weight, qty }) => {
            let ms = Object.assign({}, measureType)
            ms.measure = measure
            ms.serving_weight = serving_weight
            ms.quantity = qty
            return ms
        })

        let photo = photoType
        photo.thumbnail = p.thumb
        photo.highres = p.highres

        let food = foodType
        food.name = food_name
        food.quantity = serving_qty
        food.unit = serving_unit
        food.total_weight = serving_weight_grams
        food.nutrients = nutrient
        food.alternative_measure = measure
        food.photo = photo

        return food
    })
}
