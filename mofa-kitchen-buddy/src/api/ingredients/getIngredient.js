import Ingredient from './ingredients.js';

export const getIngredients = async () => {
    try {
        const ingredients = await Ingredient.find();
        return ingredients;
    } catch (error) {
        throw new Error('Error fetching ingredients: ' + error.message);
    }
};

export const getIngredientsByIds = async (ids) => {
    try {
        const ingredients = await Ingredient.find({ name: { $in: ids } });
        return ingredients;
    } catch (error) {
        throw new Error('Error fetching ingredients by ids: ' + error.message);
    }
};