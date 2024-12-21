import Ingredient from './ingredients.js';

const addIngredients = async (ingredientsArray) => {
    try {        
        const addedIngredients = await Ingredient.insertMany(ingredientsArray);
        console.log('Ingredients added successfully:', addedIngredients);
    } catch (error) {
        console.error('Error adding ingredients:', error);
    }
};

export default addIngredients;