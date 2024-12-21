import express from 'express';
import { getIngredients, getIngredientsByIds } from './getIngredient.js';
import addIngredients from './putIngredient.js';
import deleteIngredient from './deleteIngredient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const ingredients = await getIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/:ids', async (req, res) => {
    const ids = req.params.ids.split(',');
    try {
        const ingredients = await getIngredientsByIds(ids);
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/', async (req, res) => {
    const ingredientsArray = req.body;
    try {
        await addIngredients(ingredientsArray);
        res.status(201).json({ message: 'Ingredients added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/', deleteIngredient);

export default router;