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

        let nutrient = {
            calories: nf_calories,
            satureated_fat: nf_saturated_fat,
            total_fat: nf_total_fat,
            cholesterol: nf_cholesterol,
            sodium: nf_sodium,
            carbohydrate: nf_total_carbohydrate,
            dietary_fiber: nf_dietary_fiber,
            sugar: nf_sugars,
            protein: nf_protein,
            potassium: nf_potassium,
        }

        let measure = alt_measures.map(({ measure, serving_weight, qty }) => ({
            measure,
            serving_weight,
            quantity: qty,
        }))

        let photo = {
            thumbnail: p.thumb,
            highres: p.highres,
        }

        let food = {
            name: food_name,
            quantity: serving_qty,
            unit: serving_unit,
            total_weight: serving_weight_grams,
            nutrients: nutrient,
            alternative_measure: measure,
            photo: photo,
        }

        return food
    })
}
