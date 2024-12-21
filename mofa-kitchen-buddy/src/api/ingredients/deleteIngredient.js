import Ingredient from './ingredients.js';

const deleteIngredient = async (req, res) => {
    const { name, quantity } = req.body;

    try {
        const ingredient = await Ingredient.findOne({ name });

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        if (ingredient.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity to remove' });
        }

        ingredient.quantity -= quantity;

        if (ingredient.quantity === 0) {
            await Ingredient.deleteOne({ name });
        } else {
            await ingredient.save();
        }

        res.status(200).json({ message: 'Ingredient quantity updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export default deleteIngredient;