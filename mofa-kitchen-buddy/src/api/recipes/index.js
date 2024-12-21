import express from 'express';
import addRecipetoFile from './addRecipe';
import getRecipe from './getRecipe';

const router = express.Router();

router.put('/recipes', (req, res) => {
    const recipeData = req.body;
    if (!recipeData || Object.keys(recipeData).length === 0) {
        return res.status(400).json({ error: 'Invalid recipe data' });
    }
    const { name, description, procedure, ingredients, taste, reviews, 'cuisine type': cuisineType, 'preparation time': preparationTime, images } = recipeData;

    if (!name || !description || !procedure || !ingredients || !taste || !cuisineType || !preparationTime) {
        return res.status(400).json({ error: 'Missing required recipe fields' });
    }

    try {

        addRecipetoFile(recipeData);
        res.status(200).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/recipes', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    try {
        const recipe = await getRecipe(query);
        res.status(200).json({ recipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;