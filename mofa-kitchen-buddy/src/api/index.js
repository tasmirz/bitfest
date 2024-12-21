import express from 'express';
import recipeRoutes from './recipes';
import ingredientRoutes from './ingredients';
import crypto from 'crypto';
import { confirg } from '/home/zihad/Projects/BitFest_Preli/mofa-kitchen-buddy/src/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to check API key
app.use((req, res, next) => {
        const hash = crypto.createHash('md5').update(confirg.api_key).digest('hex');
        if (!apiKey || apiKey !== hash) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
});

app.use(express.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});